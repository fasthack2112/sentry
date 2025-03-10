from __future__ import annotations

import abc
import logging
import string
from copy import deepcopy
from datetime import datetime
from hashlib import md5
from typing import TYPE_CHECKING, Any, Mapping, MutableMapping, Optional, Sequence, Tuple, cast

import pytz
import sentry_sdk
from dateutil.parser import parse as parse_date
from django.conf import settings
from django.utils.encoding import force_str

from sentry import eventtypes
from sentry.db.models import NodeData
from sentry.grouping.result import CalculatedHashes
from sentry.interfaces.base import Interface, get_interfaces
from sentry.issues.grouptype import GroupCategory
from sentry.issues.issue_occurrence import IssueOccurrence
from sentry.models import EventDict
from sentry.snuba.events import Columns
from sentry.spans.grouping.api import load_span_grouping_config
from sentry.utils import json
from sentry.utils.cache import memoize
from sentry.utils.canonical import CanonicalKeyView
from sentry.utils.safe import get_path, trim
from sentry.utils.strings import truncatechars

logger = logging.getLogger(__name__)

# Keys in the event payload we do not want to send to the event stream / snuba.
EVENTSTREAM_PRUNED_KEYS = ("debug_meta", "_meta")

if TYPE_CHECKING:
    from sentry.interfaces.user import User
    from sentry.models.environment import Environment
    from sentry.models.group import Group
    from sentry.models.organization import Organization
    from sentry.models.project import Project
    from sentry.spans.grouping.result import SpanGroupingResults


def ref_func(x: Event) -> int:
    return x.project_id or x.project.id


class BaseEvent(metaclass=abc.ABCMeta):
    """
    Event backed by nodestore and Snuba.
    """

    def __init__(
        self,
        project_id: int,
        event_id: str,
        snuba_data: Mapping[str, Any] | None = None,
    ):
        self.project_id = project_id
        self.event_id = event_id
        self._snuba_data = snuba_data or {}

    def __getstate__(self) -> Mapping[str, Any]:
        state = self.__dict__.copy()
        # do not pickle cached info.  We want to fetch this on demand
        # again.  In particular if we were to pickle interfaces we would
        # pickle a CanonicalKeyView which old sentry workers do not know
        # about
        state.pop("_project_cache", None)
        state.pop("_environment_cache", None)
        state.pop("_group_cache", None)
        state.pop("interfaces", None)

        return state

    @property
    @abc.abstractmethod
    def data(self) -> NodeData:
        pass

    @data.setter
    @abc.abstractmethod
    def data(self, value: NodeData | Mapping[str, Any]):
        pass

    @property
    def platform(self) -> str | None:
        column = self._get_column_name(Columns.PLATFORM)
        if column in self._snuba_data:
            return cast(str, self._snuba_data[column])
        return cast(str, self.data.get("platform", None))

    @property
    def message(self) -> str:
        return (
            get_path(self.data, "logentry", "formatted")
            or get_path(self.data, "logentry", "message")
            or ""
        )

    @property
    def datetime(self) -> datetime:
        column = self._get_column_name(Columns.TIMESTAMP)
        if column in self._snuba_data:
            return parse_date(self._snuba_data[column]).replace(tzinfo=pytz.utc)

        timestamp = self.data.get("timestamp")
        date = datetime.fromtimestamp(timestamp)
        date = date.replace(tzinfo=pytz.utc)
        return date

    @property
    def timestamp(self) -> str:
        column = self._get_column_name(Columns.TIMESTAMP)
        if column in self._snuba_data:
            return cast(str, self._snuba_data[column])
        return self.datetime.isoformat()

    @property
    def tags(self) -> Sequence[Tuple[str, str]]:
        """
        Tags property uses tags from snuba if loaded otherwise falls back to
        nodestore.
        """
        tags_key_column = self._get_column_name(Columns.TAGS_KEY)
        tags_value_column = self._get_column_name(Columns.TAGS_VALUE)

        if tags_key_column in self._snuba_data and tags_value_column in self._snuba_data:
            keys = self._snuba_data[tags_key_column]
            values = self._snuba_data[tags_value_column]
            if keys and values and len(keys) == len(values):
                return sorted(zip(keys, values))
            else:
                return []
        # Nodestore implementation
        try:
            rv = sorted(
                (t, v)
                for t, v in get_path(self.data, "tags", filter=True) or ()
                if t is not None and v is not None
            )
            return rv
        except ValueError:
            # at one point Sentry allowed invalid tag sets such as (foo, bar)
            # vs ((tag, foo), (tag, bar))
            return []

    def get_tag(self, key: str) -> Optional[str]:
        for t, v in self.tags:
            if t == key:
                return v
        return None

    @property
    def release(self) -> Optional[str]:
        return self.get_tag("sentry:release")

    @property
    def dist(self) -> Optional[str]:
        return self.get_tag("sentry:dist")

    @property
    def transaction(self) -> Optional[str]:
        return self.get_tag("transaction")

    def get_environment(self) -> Environment:
        from sentry.models import Environment

        if not hasattr(self, "_environment_cache"):
            self._environment_cache = Environment.objects.get(
                organization_id=self.project.organization_id,
                name=Environment.get_name_or_default(self.get_tag("environment")),
            )

        return self._environment_cache

    def get_minimal_user(self) -> User:
        """
        A minimal 'User' interface object that gives us enough information
        to render a user badge.
        """
        from sentry.interfaces.user import User

        user_id_column = self._get_column_name(Columns.USER_ID)
        user_email_column = self._get_column_name(Columns.USER_EMAIL)
        user_username_column = self._get_column_name(Columns.USER_USERNAME)
        user_ip_address_column = self._get_column_name(Columns.USER_IP_ADDRESS)

        if all(
            key in self._snuba_data
            for key in [
                user_id_column,
                user_email_column,
                user_username_column,
                user_ip_address_column,
            ]
        ):
            user_id = self._snuba_data[user_id_column]
            email = self._snuba_data[user_email_column]
            username = self._snuba_data[user_username_column]
            ip_address = self._snuba_data[user_ip_address_column]

            return User.to_python(
                {"id": user_id, "email": email, "username": username, "ip_address": ip_address}
            )

        return self.get_interface("user")

    def get_event_type(self) -> str:
        """
        Return the type of this event.

        See ``sentry.eventtypes``.
        """
        column = self._get_column_name(Columns.TYPE)
        if column in self._snuba_data:
            return cast(str, self._snuba_data[column])
        return cast(str, self.data.get("type", "default"))

    @property
    def ip_address(self) -> str | None:
        column = self._get_column_name(Columns.USER_IP_ADDRESS)
        if column in self._snuba_data:
            return cast(str, self._snuba_data[column])

        ip_address = get_path(self.data, "user", "ip_address")
        if ip_address:
            return cast(str, ip_address)

        remote_addr = get_path(self.data, "request", "env", "REMOTE_ADDR")
        if remote_addr:
            return cast(str, remote_addr)

        return None

    @property
    def title(self) -> str:
        column = self._get_column_name(Columns.TITLE)
        if column in self._snuba_data:
            return cast(str, self._snuba_data[column])

        et = eventtypes.get(self.get_event_type())()
        return cast(str, et.get_title(self.get_event_metadata()))

    @property
    def culprit(self) -> str | None:
        column = self._get_column_name(Columns.CULPRIT)
        if column in self._snuba_data:
            return cast(str, self._snuba_data[column])
        return cast(Optional[str], self.data.get("culprit"))

    @property
    def location(self) -> str | None:
        column = self._get_column_name(Columns.LOCATION)
        if column in self._snuba_data:
            return cast(str, self._snuba_data[column])
        et = eventtypes.get(self.get_event_type())()
        return cast(Optional[str], et.get_location(self.get_event_metadata()))

    @classmethod
    def generate_node_id(cls, project_id: int, event_id: str) -> str:
        """
        Returns a deterministic node_id for this event based on the project_id
        and event_id which together are globally unique. The event body should
        be saved under this key in nodestore so it can be retrieved using the
        same generated id when we only have project_id and event_id.
        """
        return md5(f"{project_id}:{event_id}".encode()).hexdigest()

    @property
    def project(self) -> Project:
        from sentry.models import Project

        if not hasattr(self, "_project_cache"):
            self._project_cache = Project.objects.get(id=self.project_id)
        return self._project_cache

    @project.setter
    def project(self, project: Project) -> None:
        if project is None:
            self.project_id = None
        else:
            self.project_id = project.id
        self._project_cache = project

    def get_interfaces(self) -> Mapping[str, Interface]:
        return cast(Mapping[str, Interface], CanonicalKeyView(get_interfaces(self.data)))

    @memoize
    def interfaces(self) -> Mapping[str, Interface]:
        return self.get_interfaces()

    def get_interface(self, name: str) -> Interface | None:
        return self.interfaces.get(name)

    def get_event_metadata(self) -> Mapping[str, str]:
        """
        Return the metadata of this event.

        See ``sentry.eventtypes``.
        """
        # For some inexplicable reason we have some cases where the data
        # is completely empty.  In that case we want to hobble along
        # further.
        return self.data.get("metadata") or {}

    def get_grouping_config(self) -> MutableMapping[str, Any]:
        """Returns the event grouping config."""
        from sentry.grouping.api import get_grouping_config_dict_for_event_data

        return cast(
            MutableMapping[str, Any],
            get_grouping_config_dict_for_event_data(self.data, self.project),
        )

    def get_hashes(self, force_config: str | Mapping[str, Any] | None = None) -> CalculatedHashes:
        """
        Returns _all_ information that is necessary to group an event into
        issues. It returns two lists of hashes, `(flat_hashes,

        hierarchical_hashes)`:

        1. First, `hierarchical_hashes` is walked
           *backwards* (end to start) until one hash has been found that matches
           an existing group. Only *that* hash gets a GroupHash instance that is
           associated with the group.

        2. If no group was found, an event should be sorted into a group X, if
           there is a GroupHash matching *any* of `flat_hashes`. Hashes that do
           not yet have a GroupHash model get one and are associated with the same
           group (unless they already belong to another group).

           This is how regular grouping works.

        Whichever group the event lands in is associated with exactly one
        GroupHash corresponding to an entry in `hierarchical_hashes`, and an
        arbitrary amount of hashes from `flat_hashes` depending on whether some
        of those hashes have GroupHashes already assigned to other groups (and
        some other things).

        The returned hashes already take SDK fingerprints and checksums into
        consideration.

        """

        # If we have hashes stored in the data we use them, otherwise we
        # fall back to generating new ones from the data.  We can only use
        # this if we do not force a different config.
        if force_config is None:
            rv = CalculatedHashes.from_event(self.data)
            if rv is not None:
                return rv

        # Create fresh hashes
        flat_variants, hierarchical_variants = self.get_sorted_grouping_variants(force_config)
        flat_hashes, _ = self._hashes_from_sorted_grouping_variants(flat_variants)
        hierarchical_hashes, tree_labels = self._hashes_from_sorted_grouping_variants(
            hierarchical_variants
        )

        if flat_hashes:
            sentry_sdk.set_tag("get_hashes.flat_variant", flat_hashes[0][0])
        if hierarchical_hashes:
            sentry_sdk.set_tag("get_hashes.hierarchical_variant", hierarchical_hashes[0][0])

        flat_hashes = [hash_ for _, hash_ in flat_hashes]
        hierarchical_hashes = [hash_ for _, hash_ in hierarchical_hashes]

        return CalculatedHashes(
            hashes=flat_hashes, hierarchical_hashes=hierarchical_hashes, tree_labels=tree_labels
        )

    def get_sorted_grouping_variants(self, force_config: str | Mapping[str, Any] | None = None):
        """Get grouping variants sorted into flat and hierarchical variants"""
        from sentry.grouping.api import sort_grouping_variants

        variants = self.get_grouping_variants(force_config)
        return sort_grouping_variants(variants)

    @staticmethod
    def _hashes_from_sorted_grouping_variants(variants):
        """Create hashes from variants and filter out duplicates and None values"""

        from sentry.grouping.variants import ComponentVariant

        filtered_hashes = []
        tree_labels = []
        seen_hashes = set()
        for name, variant in variants:
            hash_ = variant.get_hash()
            if hash_ is None or hash_ in seen_hashes:
                continue

            seen_hashes.add(hash_)
            filtered_hashes.append((name, hash_))
            tree_labels.append(
                variant.component.tree_label or None
                if isinstance(variant, ComponentVariant)
                else None
            )

        return filtered_hashes, tree_labels

    def normalize_stacktraces_for_grouping(self, grouping_config) -> None:
        """Normalize stacktraces and clear memoized interfaces

        See stand-alone function normalize_stacktraces_for_grouping
        """
        from sentry.stacktraces.processing import normalize_stacktraces_for_grouping

        normalize_stacktraces_for_grouping(self.data, grouping_config)

        # We have modified event data, so any cached interfaces have to be reset:
        self.__dict__.pop("interfaces", None)

    def get_grouping_variants(self, force_config=None, normalize_stacktraces: bool = False):
        """
        This is similar to `get_hashes` but will instead return the
        grouping components for each variant in a dictionary.

        If `normalize_stacktraces` is set to `True` then the event data will be
        modified for `in_app` in addition to event variants being created.  This
        means that after calling that function the event data has been modified
        in place.
        """
        from sentry.grouping.api import get_grouping_variants_for_event, load_grouping_config

        # Forcing configs has two separate modes.  One is where just the
        # config ID is given in which case it's merged with the stored or
        # default config dictionary
        if force_config is not None:
            if isinstance(force_config, str):
                stored_config = self.get_grouping_config()
                config = dict(stored_config)
                config["id"] = force_config
            else:
                config = force_config

        # Otherwise we just use the same grouping config as stored.  if
        # this is None we use the project's default config.
        else:
            config = self.get_grouping_config()

        config = load_grouping_config(config)

        if normalize_stacktraces:
            with sentry_sdk.start_span(op="grouping.normalize_stacktraces_for_grouping") as span:
                span.set_tag("project", self.project_id)
                span.set_tag("event_id", self.event_id)
                self.normalize_stacktraces_for_grouping(config)

        with sentry_sdk.start_span(op="grouping.get_grouping_variants") as span:
            span.set_tag("project", self.project_id)
            span.set_tag("event_id", self.event_id)

            return get_grouping_variants_for_event(self, config)

    def get_primary_hash(self) -> str | None:
        hashes = self.get_hashes()

        if hashes.hierarchical_hashes:
            return hashes.hierarchical_hashes[0]

        if hashes.hashes:
            return hashes.hashes[0]

        return None

    def get_span_groupings(
        self, force_config: str | Mapping[str, Any] | None = None
    ) -> SpanGroupingResults:
        config = load_span_grouping_config(force_config)
        return config.execute_strategy(self.data)

    @property
    def organization(self) -> Organization:
        return self.project.organization

    @property
    def version(self) -> str:
        return cast(str, self.data.get("version", "5"))

    def get_raw_data(self, for_stream: bool = False) -> Mapping[str, Any]:
        """Returns the internal raw event data dict."""
        rv = dict(self.data.items())
        # If we get raw data for snuba we remove some large keys that blow
        # up the payload for no reason.
        if for_stream:
            for key in EVENTSTREAM_PRUNED_KEYS:
                rv.pop(key, None)
        return rv

    @property
    def size(self) -> int:
        return len(json.dumps(dict(self.data)))

    def get_email_subject(self) -> str:
        template = self.project.get_option("mail:subject_template")
        if template:
            template = EventSubjectTemplate(template)
        elif self.group.issue_category == GroupCategory.PERFORMANCE:
            template = EventSubjectTemplate("$shortID - $issueType")
        else:
            template = DEFAULT_SUBJECT_TEMPLATE
        return cast(
            str, truncatechars(template.safe_substitute(EventSubjectTemplateData(self)), 128)
        )

    def as_dict(self) -> Mapping[str, Any]:
        """Returns the data in normalized form for external consumers."""
        data: MutableMapping[str, Any] = {}
        data["event_id"] = self.event_id
        data["project"] = self.project_id
        data["release"] = self.release
        data["dist"] = self.dist
        data["platform"] = self.platform
        data["message"] = self.message
        data["datetime"] = self.datetime
        data["tags"] = [(k.split("sentry:", 1)[-1], v) for (k, v) in self.tags]
        for k, v in sorted(self.data.items()):
            if k in data:
                continue
            if k == "sdk":
                v = {v_k: v_v for v_k, v_v in v.items() if v_k != "client_ip"}
            data[k] = v

        # for a long time culprit was not persisted.  In those cases put
        # the culprit in from the group.
        if data.get("culprit") is None and self.group_id and self.group:
            data["culprit"] = self.group.culprit

        # Override title and location with dynamically generated data
        data["title"] = self.title
        data["location"] = self.location

        return data

    @memoize
    def search_message(self) -> str:
        """
        The internal search_message attribute is only used for search purposes.
        It adds a bunch of data from the metadata and the culprit.
        """
        data = self.data
        culprit = self.culprit

        event_metadata = self.get_event_metadata()

        if event_metadata is None:
            event_metadata = eventtypes.get(self.get_event_type())().get_metadata(self.data)

        message = ""

        if data.get("logentry"):
            message += data["logentry"].get("formatted") or data["logentry"].get("message") or ""

        if event_metadata:
            for value in event_metadata.values():
                value_u = force_str(value, errors="replace")
                if value_u not in message:
                    message = f"{message} {value_u}"

        if culprit and culprit not in message:
            culprit_u = force_str(culprit, errors="replace")
            message = f"{message} {culprit_u}"

        return cast(str, trim(message.strip(), settings.SENTRY_MAX_MESSAGE_LENGTH))

    def _get_column_name(self, column: Columns) -> str:
        # Events are currently populated from the Events dataset
        return cast(str, column.value.event_name)


class Event(BaseEvent):
    def __init__(
        self,
        project_id: int,
        event_id: str,
        group_id: int | None = None,
        data: Mapping[str, Any] | None = None,
        snuba_data: Mapping[str, Any] | None = None,
        groups: Sequence[Group] | None = None,
    ):
        super().__init__(project_id, event_id, snuba_data=snuba_data)
        self.group_id = group_id
        self.groups = groups
        self.data = data

    def __getstate__(self) -> Mapping[str, Any]:
        state = super().__getstate__()
        state.pop("_group_cache", None)
        state.pop("_groups_cache", None)
        return state

    @property
    def data(self) -> NodeData:
        return self._data

    @data.setter
    def data(self, value: Mapping[str, Any]) -> None:
        node_id = Event.generate_node_id(self.project_id, self.event_id)
        self._data = NodeData(
            node_id, data=value, wrapper=EventDict, ref_version=2, ref_func=ref_func
        )

    @property
    def group_id(self) -> int | None:
        # TODO: `group_id` and `group` are deprecated properties on `Event`. We will remove them
        # going forward. Since events may now be associated with multiple `Group` models, we will
        # require `GroupEvent` to be passed around. The `group_events` property should be used to
        # iterate through all `Groups` associated with an `Event`
        if self._group_id:
            return self._group_id

        column = self._get_column_name(Columns.GROUP_ID)

        return self._snuba_data.get(column)

    @group_id.setter
    def group_id(self, value: int | None) -> None:
        self._group_id = value

    # TODO We need a better way to cache these properties. functools
    # doesn't quite do the trick as there is a reference bug with unsaved
    # models. But the current _group_cache thing is also clunky because these
    # properties need to be stripped out in __getstate__.
    @property
    def group(self) -> Group | None:
        from sentry.models import Group

        if not self.group_id:
            return None
        if not hasattr(self, "_group_cache"):
            self._group_cache = Group.objects.get(id=self.group_id)
        return self._group_cache

    @group.setter
    def group(self, group: Group) -> None:
        self.group_id = group.id
        self._group_cache = group

    @property
    def groups(self) -> Sequence[Group]:
        from sentry.models import Group

        if getattr(self, "_groups_cache"):
            return self._groups_cache

        if self._group_ids is not None:
            group_ids = self._group_ids
        else:
            snuba_group_id = self.group_id
            # TODO: Replace `snuba_group_id` with this once we deprecate `group_id`.
            # snuba_group_id = self._snuba_data.get(self._get_column_name(Columns.GROUP_ID))
            snuba_group_ids = self._snuba_data.get(self._get_column_name(Columns.GROUP_IDS))
            group_ids = []
            if snuba_group_id:
                group_ids.append(snuba_group_id)
            if snuba_group_ids:
                group_ids.extend(snuba_group_ids)

        if group_ids:
            groups = list(Group.objects.filter(id__in=group_ids))
        else:
            groups = []

        self._groups_cache = groups
        return groups

    @groups.setter
    def groups(self, values: Sequence[Group] | None):
        self._groups_cache = values
        self._group_ids = [group.id for group in values] if values else None

    def build_group_events(self):
        """
        Yields a GroupEvent for each Group associated with this Event.
        """
        for group in self.groups:
            yield GroupEvent.from_event(self, group)

    def for_group(self, group: Group) -> GroupEvent:
        return GroupEvent.from_event(self, group)


class GroupEvent(BaseEvent):
    def __init__(
        self,
        project_id: int,
        event_id: str,
        group: Group,
        data: NodeData,
        snuba_data: Mapping[str, Any] | None = None,
        occurrence: IssueOccurrence | None = None,
    ):
        super().__init__(project_id, event_id, snuba_data=snuba_data)
        self.group = group
        self.data = data
        self._occurrence = occurrence

    def __eq__(self, other):
        if not isinstance(other, GroupEvent):
            return False
        return other.event_id == self.event_id and other.group_id == self.group_id

    def __hash__(self):
        return hash((self.group_id, self.event_id))

    @property
    def group_id(self) -> int:
        # TODO: Including this as a shim for now. I think it makes sense to remove this helper,
        # since people may as well use `group.id` instead of `group_id`, but it breaks a lot of
        # compatibility with `Event`. Including this here for now so that we don't have to rewrite
        # the whole codebase at once.
        return self.group.id

    @property
    def data(self) -> NodeData:
        return self._data

    @data.setter
    def data(self, value: NodeData) -> None:
        self._data = value

    @classmethod
    def from_event(cls, event: Event, group: Group) -> GroupEvent:
        group_event = cls(
            project_id=event.project_id,
            event_id=event.event_id,
            group=group,
            data=deepcopy(event.data),
            snuba_data=deepcopy(event._snuba_data),
        )
        if hasattr(event, "_project_cache"):
            group_event.project = event.project
        return group_event

    @property
    def occurrence(self) -> Optional[IssueOccurrence]:
        if not self._occurrence and self.occurrence_id:
            self._occurrence = IssueOccurrence.fetch(self.occurrence_id, self.project_id)
            if self._occurrence is None:
                logger.error(
                    "Failed to fetch occurrence for event",
                    extra={"group_id": self.group_id, "occurrence_id": self.occurrence_id},
                )

        return self._occurrence

    @occurrence.setter
    def occurrence(self, value: IssueOccurrence) -> None:
        self._occurrence = value

    @property
    def occurrence_id(self) -> Optional[str]:
        if self._occurrence:
            return self.occurrence.id

        column = self._get_column_name(Columns.OCCURRENCE_ID)
        if column in self._snuba_data:
            return cast(str, self._snuba_data[column])
        return None

    @memoize
    def search_message(self) -> str:
        message = super().search_message
        # Include values from the occurrence in our search message as well, so that occurrences work
        # correctly in search.
        if self.occurrence is not None:
            message = augment_message_with_occurrence(message, self.occurrence)

        return message


def augment_message_with_occurrence(message: str, occurrence: IssueOccurrence) -> str:
    for attr in ("issue_title", "subtitle", "culprit"):
        value = getattr(occurrence, attr, "")
        if value and value not in message:
            value = force_str(value, errors="replace")
            message = f"{message} {value}"
    return message


class EventSubjectTemplate(string.Template):
    idpattern = r"(tag:)?[_a-z][_a-z0-9]*"


class EventSubjectTemplateData:
    tag_aliases = {"release": "sentry:release", "dist": "sentry:dist", "user": "sentry:user"}

    def __init__(self, event: Event):
        self.event = event

    def __getitem__(self, name: str) -> str:
        if name.startswith("tag:"):
            name = name[4:]
            value = self.event.get_tag(self.tag_aliases.get(name, name))
            if value is None:
                value = self.event.get_tag(name)

            if value is None:
                raise KeyError
            return str(value)
        elif name == "project":
            return cast(str, self.event.project.get_full_name())
        elif name == "projectID":
            return cast(str, self.event.project.slug)
        elif name == "shortID" and self.event.group_id and self.event.group:
            return cast(str, self.event.group.qualified_short_id)
        elif name == "orgID":
            return self.event.organization.slug
        elif name == "title":
            if getattr(self.event, "occurrence", None):
                return self.event.occurrence.issue_title
            else:
                return self.event.title

        elif name == "issueType":
            return self.event.group.issue_type.description
        raise KeyError


DEFAULT_SUBJECT_TEMPLATE = EventSubjectTemplate("$shortID - $title")
