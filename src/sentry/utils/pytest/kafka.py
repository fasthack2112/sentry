import logging
import time
from typing import MutableMapping, Optional

import pytest
from confluent_kafka import Consumer, Producer
from confluent_kafka.admin import AdminClient

_log = logging.getLogger(__name__)

MAX_SECONDS_WAITING_FOR_EVENT = 16


@pytest.fixture
def kafka_producer():
    def inner(settings):
        producer = Producer(
            {"bootstrap.servers": settings.KAFKA_CLUSTERS["default"]["common"]["bootstrap.servers"]}
        )
        return producer

    return inner


class _KafkaAdminWrapper:
    def __init__(self, request, settings):
        self.test_name = request.node.name

        kafka_config = {}
        for key, val in settings.KAFKA_CLUSTERS["default"]["common"].items():
            kafka_config[key] = val

        self.admin_client = AdminClient(kafka_config)

    def delete_topic(self, topic_name):
        try:
            futures_dict = self.admin_client.delete_topics([topic_name])
            self._sync_wait_on_result(futures_dict)
        except Exception:
            _log.warning("Could not delete topic %s", topic_name)

    def _sync_wait_on_result(self, futures_dict):
        """
        Synchronously waits on all futures returned by the admin_client api.
        :param futures_dict: the api returns a dict of futures that can be awaited
        """
        # just wait on all futures returned by the async operations of the admin_client
        for f in futures_dict.values():
            f.result(5)  # wait up to 5 seconds for the admin operation to finish


@pytest.fixture
def kafka_admin(request):
    """
    A fixture representing a simple wrapper over the admin interface
    :param request: the pytest request
    :return: a Kafka admin wrapper
    """

    def inner(settings):
        return _KafkaAdminWrapper(request, settings)

    return inner


@pytest.fixture
def kafka_topics_setter():
    """
    Returns a function that given a Django settings objects will setup the
    kafka topics names to test names.

    :return: a function that given a settings object changes all kafka topic names
    to "test-<normal_topic_name>"
    """

    def set_test_kafka_settings(settings):
        settings.KAFKA_INGEST_EVENTS = "ingest-events"
        settings.KAFKA_TOPICS[settings.KAFKA_INGEST_EVENTS] = {"cluster": "default"}

        settings.INGEST_TRANSACTIONS = "ingest-transactions"
        settings.KAFKA_TOPICS[settings.INGEST_TRANSACTIONS] = {"cluster": "default"}

        settings.KAFKA_INGEST_ATTACHMENTS = "ingest-attachments"
        settings.KAFKA_TOPICS[settings.KAFKA_INGEST_ATTACHMENTS] = {"cluster": "default"}

        settings.KAFKA_OUTCOMES = "outcomes"
        settings.KAFKA_TOPICS[settings.KAFKA_OUTCOMES] = {"cluster": "default"}

    return set_test_kafka_settings


@pytest.fixture(scope="session")
def scope_consumers():
    """
    Sets up an object to keep track of the scope consumers ( consumers that will only
    be created once per test session).

    """
    all_consumers: MutableMapping[str, Optional[Consumer]] = {
        # Relay is configured to use this topic for all ingest messages. See
        # `templates/config.yml`.
        "ingest-events": None,
        "outcomes": None,
    }

    yield all_consumers

    for consumer_name, consumer in all_consumers.items():
        if consumer is not None:
            try:
                # stop the consumer
                consumer.signal_shutdown()
                consumer.run()
            except:  # noqa:
                _log.warning("Failed to cleanup consumer %s", consumer_name)


@pytest.fixture(scope="function")
def session_ingest_consumer(scope_consumers, kafka_admin, task_runner):
    """
    Returns a factory for a session ingest consumer.

    Note/Warning: Once an ingest consumer is created it will be reused by all tests in the session.
    The ingest consumer is created the first time with the provided settings and then reused.
    If you don't want this behaviour DO NOT USE this fixture (create a fixture, similar with this one,
    that returns a new consumer at each invocation rather then reusing it)

    :return: a function factory that creates a consumer at first invocation and returns the cached consumer afterwards.
    """

    def ingest_consumer(settings):
        from sentry.ingest.consumer_v2.factory import get_ingest_consumer
        from sentry.ingest.types import ConsumerType
        from sentry.utils.batching_kafka_consumer import create_topics

        # Relay is configured to use this topic for all ingest messages. See
        # `template/config.yml`.
        cluster_name = "default"
        topic_event_name = "ingest-events"

        if scope_consumers[topic_event_name] is not None:
            # reuse whatever was already created (will ignore the settings)
            return scope_consumers[topic_event_name]

        # first time the consumer is requested, create it using settings
        admin = kafka_admin(settings)
        admin.delete_topic(topic_event_name)
        create_topics(cluster_name, [topic_event_name])

        # simulate the event ingestion task
        group_id = "test-consumer"

        consumer = get_ingest_consumer(
            consumer_type=ConsumerType.Attachments,
            group_id=group_id,
            auto_offset_reset="earliest",
            strict_offset_reset=False,
            max_batch_size=1,
            max_batch_time=10,
            num_processes=1,
            input_block_size=1,
            output_block_size=1,
            force_topic=topic_event_name,
            force_cluster=cluster_name,
        )

        scope_consumers[topic_event_name] = consumer

        return consumer

    return ingest_consumer


@pytest.fixture(scope="function")
def wait_for_ingest_consumer(session_ingest_consumer, task_runner):
    """
    Returns a function that can be used to create a wait loop for the ingest consumer

    The ingest consumer will be called in a loop followed by a query to the supplied
    predicate. If the predicate returns a non None value the wait will be ended and
    the waiter will return whatever the predicate returned.
    If the max_time passes the waiter will be terminated and the waiter will return None

    Note: The reason there we return a factory and not directly the waiter is that we
    need to configure the consumer with the test settings (settings are typically available
    in the test) so a test would typically first create the waiter and the use it to wait for
    the required condition:

    waiter = wait_for_ingest_consumer( test_settings_derived_from_the_project_settings)
    result = waiter( my_predicate, SOME_TIMEOUT)
    assert result == expected_result
    """

    def factory(settings, **kwargs):
        consumer = session_ingest_consumer(settings, **kwargs)

        def waiter(exit_predicate, max_time=MAX_SECONDS_WAITING_FOR_EVENT):
            """
            Implements a wait loop for the ingest consumer
            :param exit_predicate:  A Callable[(),Any] that will be called in a loop after each call
                to the KafkaConsumer _run_once()
            :param max_time: maximum time in seconds to wait
            :return: the first non None result returned by the exit predicate or None if the
                max time has expired without the exit predicate returning a non None value
            """

            start_wait = time.time()
            with task_runner():
                while time.time() - start_wait < max_time:
                    consumer._run_once()
                    # check if the condition is satisfied
                    val = exit_predicate()
                    if val is not None:
                        return val  # we got what we were waiting for stop looping

            _log.warning(
                "Ingest consumer waiter timed-out after %d seconds", time.time() - start_wait
            )
            return None  # timeout without any success

        return waiter

    return factory
