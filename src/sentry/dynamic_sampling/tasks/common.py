import math
import time
from datetime import datetime, timedelta
from typing import Any, Generator, Iterator, List, Mapping, Optional, Protocol, Tuple

import sentry_sdk
from snuba_sdk import (
    Column,
    Condition,
    Direction,
    Entity,
    Function,
    Granularity,
    Op,
    OrderBy,
    Query,
    Request,
)

from sentry import quotas
from sentry.dynamic_sampling.rules.utils import OrganizationId
from sentry.dynamic_sampling.tasks.constants import (
    CHUNK_SIZE,
    MAX_ORGS_PER_QUERY,
    MAX_PROJECTS_PER_QUERY,
    MAX_SECONDS,
)
from sentry.dynamic_sampling.tasks.helpers.sliding_window import (
    extrapolate_monthly_volume,
    get_sliding_window_org_sample_rate,
    get_sliding_window_size,
)
from sentry.dynamic_sampling.tasks.logging import log_extrapolated_monthly_volume, log_query_timeout
from sentry.dynamic_sampling.tasks.task_context import DynamicSamplingLogState, TaskContext
from sentry.dynamic_sampling.tasks.utils import Timer
from sentry.sentry_metrics import indexer
from sentry.snuba.dataset import Dataset, EntityKey
from sentry.snuba.metrics.naming_layer.mri import TransactionMRI
from sentry.snuba.referrer import Referrer
from sentry.utils.snuba import raw_snql_query


class TimeoutException(Exception):
    def __init__(self, task_context: TaskContext, *args):
        super().__init__(
            [task_context, *args],
        )
        self.task_context = task_context


class ContextIterator(Protocol):
    """
    An iterator that also can return its current state ( used for logging)
    """

    def __iter__(self):
        ...

    def __next__(self):
        ...

    def get_current_state(self) -> DynamicSamplingLogState:
        """
        Return some current iterator state that can be used for logging
        The return value should be convertible to JSON
        """
        ...


class TimedIterator(Iterator[Any]):
    """
    An iterator that wraps an existing ContextIterator.
    It forces a stop if the max time (from the task context) has passed
    It updates the task context with the current state of the inner iterator at each step
    """

    def __init__(self, context: TaskContext, name: str, inner: ContextIterator):
        self.context = context
        self.iterator_execution_time = Timer()
        self.name = name
        self.inner = inner

    def __iter__(self):
        return self

    def __next__(self):
        if time.monotonic() > self.context.expiration_time:
            raise TimeoutException(self.context)
        with self.iterator_execution_time:
            val = next(self.inner)
            state = self.inner.get_current_state()
            state.execution_time = self.iterator_execution_time.current()
            self.context.set_function_state(self.name, state)
            return val


class GetActiveOrgs:
    """
    Fetch organisations in batches.
    A batch will return at max max_orgs elements
    It will accumulate org ids in the list until either it accumulates max_orgs or the
    number of projects in the already accumulated orgs is more than max_projects or there
    are no more orgs
    """

    def __init__(self, max_orgs: int = MAX_ORGS_PER_QUERY, max_projects: Optional[int] = None):
        self.metric_id = indexer.resolve_shared_org(
            str(TransactionMRI.COUNT_PER_ROOT_PROJECT.value)
        )
        self.offset = 0
        self.last_result: List[Tuple[int, int]] = []
        self.has_more_results = True
        self.max_orgs = max_orgs
        self.max_projects = max_projects
        self.log_state = DynamicSamplingLogState()

    def __iter__(self):
        return self

    def __next__(self):
        self.log_state.num_iterations += 1
        if self._enough_results_cached():
            # we have enough in the cache to satisfy the current iteration
            return self._get_from_cache()

        if self.has_more_results:
            # not enough for the current iteration and data still in the db top it up from db
            query = (
                Query(
                    match=Entity(EntityKey.GenericOrgMetricsCounters.value),
                    select=[
                        Function("uniq", [Column("project_id")], "num_projects"),
                        Column("org_id"),
                    ],
                    groupby=[
                        Column("org_id"),
                    ],
                    where=[
                        Condition(
                            Column("timestamp"), Op.GTE, datetime.utcnow() - timedelta(hours=1)
                        ),
                        Condition(Column("timestamp"), Op.LT, datetime.utcnow()),
                        Condition(Column("metric_id"), Op.EQ, self.metric_id),
                    ],
                    granularity=Granularity(3600),
                    orderby=[
                        OrderBy(Column("org_id"), Direction.ASC),
                    ],
                )
                .set_limit(CHUNK_SIZE + 1)
                .set_offset(self.offset)
            )
            request = Request(
                dataset=Dataset.PerformanceMetrics.value, app_id="dynamic_sampling", query=query
            )
            self.log_state.num_db_calls += 1
            data = raw_snql_query(
                request,
                referrer=Referrer.DYNAMIC_SAMPLING_COUNTERS_FETCH_PROJECTS_WITH_COUNT_PER_TRANSACTION.value,
            )["data"]
            count = len(data)

            self.has_more_results = count > CHUNK_SIZE
            self.offset += CHUNK_SIZE
            if self.has_more_results:
                data = data[:-1]
            self.log_state.num_rows_total += len(data)
            for row in data:
                self.last_result.append((row["org_id"], row["num_projects"]))

        if len(self.last_result) > 0:
            # we have some data left return up to the max amount
            return self._get_from_cache()  # we still have something left in cache
        else:
            # nothing left in the DB or cache
            raise StopIteration()

    def get_current_state(self):
        """
        Returns the current state of the iterator (how many orgs and projects it has iterated over)

        part of the ContexIterator protocol

        """
        return self.log_state

    def _enough_results_cached(self):
        """
        Return true if we have enough data to return a full batch in the cache (i.e. last_result)
        """
        if len(self.last_result) >= self.max_orgs:
            return True

        if self.max_projects is not None:
            total_projects = 0
            for _, num_projects in self.last_result:
                total_projects += num_projects
                if num_projects >= self.max_projects:
                    return True
        return False

    def _get_orgs(self, orgs_and_counts):
        """
        Extracts the orgs from last_result
        """
        return [org for org, _ in orgs_and_counts]

    def _get_from_cache(self):
        """
        Returns a batch from cache and removes the elements returned from the cache
        """
        count_projects = 0
        for idx, (org_id, num_projects) in enumerate(self.last_result):
            count_projects += num_projects
            self.log_state.num_orgs += 1
            self.log_state.num_orgs += num_projects
            if idx >= (self.max_orgs - 1) or (
                self.max_projects is not None and count_projects >= self.max_projects
            ):
                # we got to the number of elements desired
                ret_val = self._get_orgs(self.last_result[: idx + 1])
                self.last_result = self.last_result[idx + 1 :]
                return ret_val
        # if we are here we haven't reached our max limit, return everything
        ret_val = self._get_orgs(self.last_result)
        self.last_result = []
        return ret_val


def get_active_orgs_with_projects_counts(
    max_orgs: int = MAX_ORGS_PER_QUERY, max_projects: int = MAX_PROJECTS_PER_QUERY
) -> Generator[List[int], None, None]:
    """
    Fetch organisations in batches.
    A batch will return at max max_orgs elements
    It will accumulate org ids in the list until either it accumulates max_orgs or the
    number of projects in the already accumulated orgs is more than max_projects or there
    are no more orgs
    """
    start_time = time.time()
    metric_id = indexer.resolve_shared_org(str(TransactionMRI.COUNT_PER_ROOT_PROJECT.value))
    offset = 0
    last_result: List[Tuple[int, int]] = []
    while (time.time() - start_time) < MAX_SECONDS:
        query = (
            Query(
                match=Entity(EntityKey.GenericOrgMetricsCounters.value),
                select=[
                    Function("uniq", [Column("project_id")], "num_projects"),
                    Column("org_id"),
                ],
                groupby=[
                    Column("org_id"),
                ],
                where=[
                    Condition(Column("timestamp"), Op.GTE, datetime.utcnow() - timedelta(hours=1)),
                    Condition(Column("timestamp"), Op.LT, datetime.utcnow()),
                    Condition(Column("metric_id"), Op.EQ, metric_id),
                ],
                granularity=Granularity(3600),
                orderby=[
                    OrderBy(Column("org_id"), Direction.ASC),
                ],
            )
            .set_limit(CHUNK_SIZE + 1)
            .set_offset(offset)
        )
        request = Request(
            dataset=Dataset.PerformanceMetrics.value, app_id="dynamic_sampling", query=query
        )
        data = raw_snql_query(
            request,
            referrer=Referrer.DYNAMIC_SAMPLING_COUNTERS_FETCH_PROJECTS_WITH_COUNT_PER_TRANSACTION.value,
        )["data"]
        count = len(data)
        more_results = count > CHUNK_SIZE
        offset += CHUNK_SIZE
        if more_results:
            data = data[:-1]
        for row in data:
            last_result.append((row["org_id"], row["num_projects"]))

        first_idx = 0
        count_projects = 0
        for idx, (org_id, num_projects) in enumerate(last_result):
            count_projects += num_projects
            if idx - first_idx >= max_orgs - 1 or count_projects >= max_projects:
                # we got to the number of elements desired
                yield [o for o, _ in last_result[first_idx : idx + 1]]
                first_idx = idx + 1
                count_projects = 0

        # keep what is left unused from last_result for the next iteration or final result
        last_result = last_result[first_idx:]
        if not more_results:
            break
    else:
        log_query_timeout(
            query="get_active_orgs_with_projects_counts", offset=offset, timeout_seconds=MAX_SECONDS
        )

    if len(last_result) > 0:
        yield [org_id for org_id, _ in last_result]


def fetch_orgs_with_total_root_transactions_count(
    org_ids: List[int], window_size: int
) -> Mapping[OrganizationId, int]:
    """
    Fetches for each org the total root transaction count.
    """
    query_interval = timedelta(hours=window_size)
    granularity = Granularity(3600)

    count_per_root_metric_id = indexer.resolve_shared_org(
        str(TransactionMRI.COUNT_PER_ROOT_PROJECT.value)
    )
    where = [
        Condition(Column("timestamp"), Op.GTE, datetime.utcnow() - query_interval),
        Condition(Column("timestamp"), Op.LT, datetime.utcnow()),
        Condition(Column("metric_id"), Op.EQ, count_per_root_metric_id),
        Condition(Column("org_id"), Op.IN, list(org_ids)),
    ]

    start_time = time.time()
    offset = 0
    aggregated_projects = {}
    while (time.time() - start_time) < MAX_SECONDS:
        query = (
            Query(
                match=Entity(EntityKey.GenericOrgMetricsCounters.value),
                select=[
                    Function("sum", [Column("value")], "root_count_value"),
                    Column("org_id"),
                ],
                where=where,
                groupby=[Column("org_id")],
                orderby=[
                    OrderBy(Column("org_id"), Direction.ASC),
                ],
                granularity=granularity,
            )
            .set_limit(CHUNK_SIZE + 1)
            .set_offset(offset)
        )

        request = Request(
            dataset=Dataset.PerformanceMetrics.value, app_id="dynamic_sampling", query=query
        )

        data = raw_snql_query(
            request,
            referrer=Referrer.DYNAMIC_SAMPLING_DISTRIBUTION_FETCH_ORGS_WITH_COUNT_PER_ROOT.value,
        )["data"]

        count = len(data)
        more_results = count > CHUNK_SIZE
        offset += CHUNK_SIZE

        if more_results:
            data = data[:-1]

        for row in data:
            aggregated_projects[row["org_id"]] = row["root_count_value"]

        if not more_results:
            break
    else:
        log_query_timeout(
            query="fetch_orgs_with_total_root_transactions_count",
            offset=offset,
            timeout_seconds=MAX_SECONDS,
        )

    return aggregated_projects


def sample_rate_to_float(sample_rate: Optional[str]) -> Optional[float]:
    """
    Converts a sample rate to a float or returns None in case the conversion failed.
    """
    if sample_rate is None:
        return None

    try:
        return float(sample_rate)
    except (TypeError, ValueError):
        return None


def are_equal_with_epsilon(a: Optional[float], b: Optional[float]) -> bool:
    """
    Checks if two floating point numbers are equal within an error boundary.
    """
    if a is None and b is None:
        return True

    if a is None or b is None:
        return False

    return math.isclose(a, b)


def compute_guarded_sliding_window_sample_rate(
    org_id: int, project_id: Optional[int], total_root_count: int, window_size: int
) -> Optional[float]:
    """
    Computes the actual sliding window sample rate by guarding any exceptions and returning None in case
    any problem would arise.
    """
    try:
        # We want to compute the sliding window sample rate by considering a window of time.
        # This piece of code is very delicate, thus we want to guard it properly and capture any errors.
        return compute_sliding_window_sample_rate(org_id, project_id, total_root_count, window_size)
    except Exception as e:
        sentry_sdk.capture_exception(e)
        return None


def compute_sliding_window_sample_rate(
    org_id: int, project_id: Optional[int], total_root_count: int, window_size: int
) -> Optional[float]:
    """
    Computes the actual sample rate for the sliding window given the total root count and the size of the
    window that was used for computing the root count.

    The org_id is used only because it is required on the quotas side to determine whether dynamic sampling is
    enabled in the first place for that project.
    """
    extrapolated_volume = extrapolate_monthly_volume(volume=total_root_count, hours=window_size)
    if extrapolated_volume is None:
        with sentry_sdk.push_scope() as scope:
            scope.set_extra("org_id", org_id)
            scope.set_extra("window_size", window_size)
            sentry_sdk.capture_message("The volume of the current month can't be extrapolated.")

        return None

    # We want to log the monthly volume for observability purposes.
    log_extrapolated_monthly_volume(
        org_id, project_id, total_root_count, extrapolated_volume, window_size
    )

    sampling_tier = quotas.get_transaction_sampling_tier_for_volume(  # type:ignore
        org_id, extrapolated_volume
    )
    if sampling_tier is None:
        return None

    # We unpack the tuple containing the sampling tier information in the form (volume, sample_rate). This is done
    # under the assumption that the sampling_tier tuple contains both non-null values.
    _, sample_rate = sampling_tier

    # We assume that the sample_rate is a float.
    return float(sample_rate)


def get_adjusted_base_rate_from_cache_or_compute(org_id: int) -> Optional[float]:
    """
    Gets the adjusted base sample rate from the sliding window directly from the Redis cache or tries to compute
    it synchronously.
    """
    # We first try to get from cache the sliding window org sample rate.
    sample_rate = get_sliding_window_org_sample_rate(org_id)
    if sample_rate is not None:
        return sample_rate

    # In case we didn't find the value in cache, we want to compute it synchronously.
    window_size = get_sliding_window_size()
    # In case the size is None it means that we disabled the sliding window entirely.
    if window_size is not None:
        # We want to synchronously fetch the orgs and compute the sliding window org sample rate.
        orgs_with_counts = fetch_orgs_with_total_root_transactions_count(
            org_ids=[org_id], window_size=window_size
        )
        if (org_total_root_count := orgs_with_counts.get(org_id)) is not None:
            return compute_guarded_sliding_window_sample_rate(
                org_id, None, org_total_root_count, window_size
            )

    return None
