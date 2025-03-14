from __future__ import annotations

import signal
import sys
from multiprocessing import cpu_count
from typing import Optional

import click

from sentry.bgtasks.api import managed_bgtasks
from sentry.ingest.types import ConsumerType
from sentry.runner.decorators import configuration, log_options
from sentry.utils.kafka import run_processor_with_signals

DEFAULT_BLOCK_SIZE = int(32 * 1e6)


def _address_validate(
    ctx: click.Context, param: click.Parameter, value: str | None
) -> tuple[str | None, int | None]:
    if value is None:
        return (None, None)

    if ":" in value:
        host, port_s = value.split(":", 1)
        port: int | None = int(port_s)
    else:
        host = value
        port = None
    return host, port


class QueueSetType(click.ParamType):
    name = "text"

    def convert(self, value, param, ctx):
        if value is None:
            return None
        # Providing a compatibility with splitting
        # the `events` queue until multiple queues
        # without the need to explicitly add them.
        queues = set()
        for queue in value.split(","):
            if queue == "events":
                queues.add("events.preprocess_event")
                queues.add("events.process_event")
                queues.add("events.save_event")

                from sentry.runner.initializer import show_big_error

                show_big_error(
                    [
                        "DEPRECATED",
                        "`events` queue no longer exists.",
                        "Switch to using:",
                        "- events.preprocess_event",
                        "- events.process_event",
                        "- events.save_event",
                    ]
                )
            else:
                queues.add(queue)
        return frozenset(queues)


QueueSet = QueueSetType()


def kafka_options(
    consumer_group: str,
    allow_force_cluster: bool = True,
    include_batching_options: bool = False,
    default_max_batch_size: Optional[int] = None,
    default_max_batch_time_ms: Optional[int] = 1000,
):

    """
    Basic set of Kafka options for a consumer.
    """

    def inner(f):
        f = click.option(
            "--consumer-group",
            "group_id",
            default=consumer_group,
            help="Kafka consumer group for the consumer.",
        )(f)

        f = click.option(
            "--auto-offset-reset",
            "auto_offset_reset",
            default="latest",
            type=click.Choice(["earliest", "latest", "error"]),
            help="Position in the commit log topic to begin reading from when no prior offset has been recorded.",
        )(f)

        if include_batching_options:
            f = click.option(
                "--max-batch-size",
                "max_batch_size",
                default=default_max_batch_size,
                type=int,
                help="Maximum number of messages to batch before flushing.",
            )(f)

            f = click.option(
                "--max-batch-time-ms",
                "max_batch_time",
                default=default_max_batch_time_ms,
                type=int,
                help="Maximum time (in seconds) to wait before flushing a batch.",
            )(f)

        if allow_force_cluster:
            f = click.option(
                "--force-topic",
                "force_topic",
                default=None,
                type=str,
                help="Override the Kafka topic the consumer will read from.",
            )(f)

            f = click.option(
                "--force-cluster",
                "force_cluster",
                default=None,
                type=str,
                help="Kafka cluster ID of the overridden topic. Configure clusters via KAFKA_CLUSTERS in server settings.",
            )(f)

        return f

    return inner


def strict_offset_reset_option():
    return click.option(
        "--strict-offset-reset/--no-strict-offset-reset",
        default=True,
        help=(
            "--strict-offset-reset, the default, means that the kafka consumer "
            "still errors in case the offset is out of range.\n\n"
            "--no-strict-offset-reset will use the auto offset reset even in that case. "
            "This is useful in development, but not desirable in production since expired "
            "offsets mean data-loss.\n\n"
            "Most consumers that do not have this option at all default to 'Not Strict'."
        ),
    )


@click.group()
def run():
    "Run a service."


@run.command()
@click.option(
    "--bind",
    "-b",
    default=None,
    help="Bind address.",
    metavar="ADDRESS",
    callback=_address_validate,
)
@click.option(
    "--workers", "-w", default=0, help="The number of worker processes for handling requests."
)
@click.option("--upgrade", default=False, is_flag=True, help="Upgrade before starting.")
@click.option(
    "--with-lock", default=False, is_flag=True, help="Use a lock if performing an upgrade."
)
@click.option(
    "--noinput", default=False, is_flag=True, help="Do not prompt the user for input of any kind."
)
@log_options()
@configuration
def web(bind, workers, upgrade, with_lock, noinput):
    "Run web service."
    if upgrade:
        click.echo("Performing upgrade before service startup...")
        from sentry.runner import call_command

        try:
            call_command(
                "sentry.runner.commands.upgrade.upgrade",
                verbosity=0,
                noinput=noinput,
                lock=with_lock,
            )
        except click.ClickException:
            if with_lock:
                click.echo("!! Upgrade currently running from another process, skipping.", err=True)
            else:
                raise

    with managed_bgtasks(role="web"):
        from sentry.services.http import SentryHTTPServer

        SentryHTTPServer(host=bind[0], port=bind[1], workers=workers).run()


@run.command()
@click.option(
    "--bind",
    "-b",
    default=None,
    help="Bind address.",
    metavar="ADDRESS",
    callback=_address_validate,
)
@click.option("--upgrade", default=False, is_flag=True, help="Upgrade before starting.")
@click.option(
    "--noinput", default=False, is_flag=True, help="Do not prompt the user for input of any kind."
)
@configuration
def smtp(bind, upgrade, noinput):
    "Run inbound email service."
    if upgrade:
        click.echo("Performing upgrade before service startup...")
        from sentry.runner import call_command

        call_command("sentry.runner.commands.upgrade.upgrade", verbosity=0, noinput=noinput)

    from sentry.services.smtp import SentrySMTPServer

    with managed_bgtasks(role="smtp"):
        SentrySMTPServer(host=bind[0], port=bind[1]).run()


def run_worker(**options):
    """
    This is the inner function to actually start worker.
    """
    from django.conf import settings

    if settings.CELERY_ALWAYS_EAGER:
        raise click.ClickException(
            "Disable CELERY_ALWAYS_EAGER in your settings file to spawn workers."
        )

    # These options are no longer used, but keeping around
    # for backwards compatibility
    for o in "without_gossip", "without_mingle", "without_heartbeat":
        options.pop(o, None)

    from sentry.celery import app

    with managed_bgtasks(role="worker"):
        worker = app.Worker(
            # NOTE: without_mingle breaks everything,
            # we can't get rid of this. Intentionally kept
            # here as a warning. Jobs will not process.
            # without_mingle=True,
            without_gossip=True,
            without_heartbeat=True,
            pool_cls="processes",
            **options,
        )
        worker.start()
        try:
            sys.exit(worker.exitcode)
        except AttributeError:
            # `worker.exitcode` was added in a newer version of Celery:
            # https://github.com/celery/celery/commit/dc28e8a5
            # so this is an attempt to be forward compatible
            pass


@run.command()
@click.option(
    "--hostname",
    "-n",
    help=(
        "Set custom hostname, e.g. 'w1.%h'. Expands: %h" "(hostname), %n (name) and %d, (domain)."
    ),
)
@click.option(
    "--queues",
    "-Q",
    type=QueueSet,
    help=(
        "List of queues to enable for this worker, separated by "
        "comma. By default all configured queues are enabled. "
        "Example: -Q video,image"
    ),
)
@click.option("--exclude-queues", "-X", type=QueueSet)
@click.option(
    "--concurrency",
    "-c",
    default=cpu_count(),
    help=(
        "Number of child processes processing the queue. The "
        "default is the number of CPUs available on your "
        "system."
    ),
)
@click.option(
    "--logfile", "-f", help=("Path to log file. If no logfile is specified, stderr is used.")
)
@click.option("--quiet", "-q", is_flag=True, default=False)
@click.option("--no-color", is_flag=True, default=False)
@click.option("--autoreload", is_flag=True, default=False, help="Enable autoreloading.")
@click.option("--without-gossip", is_flag=True, default=False)
@click.option("--without-mingle", is_flag=True, default=False)
@click.option("--without-heartbeat", is_flag=True, default=False)
@click.option("--max-tasks-per-child", default=10000)
@click.option("--ignore-unknown-queues", is_flag=True, default=False)
@log_options()
@configuration
def worker(ignore_unknown_queues, **options):
    """Run background worker instance and autoreload if necessary."""

    from sentry.celery import app

    known_queues = frozenset(c_queue.name for c_queue in app.conf.CELERY_QUEUES)

    if options["queues"] is not None:
        if not options["queues"].issubset(known_queues):
            unknown_queues = options["queues"] - known_queues
            message = "Following queues are not found: %s" % ",".join(sorted(unknown_queues))
            if ignore_unknown_queues:
                options["queues"] -= unknown_queues
                click.echo(message)
            else:
                raise click.ClickException(message)

    if options["exclude_queues"] is not None:
        if not options["exclude_queues"].issubset(known_queues):
            unknown_queues = options["exclude_queues"] - known_queues
            message = "Following queues cannot be excluded as they don't exist: %s" % ",".join(
                sorted(unknown_queues)
            )
            if ignore_unknown_queues:
                options["exclude_queues"] -= unknown_queues
                click.echo(message)
            else:
                raise click.ClickException(message)

    if options["autoreload"]:
        from django.utils import autoreload

        autoreload.run_with_reloader(run_worker, **options)
    else:
        run_worker(**options)


@run.command()
@click.option(
    "--pidfile",
    help=(
        "Optional file used to store the process pid. The "
        "program will not start if this file already exists and "
        "the pid is still alive."
    ),
)
@click.option(
    "--logfile", "-f", help=("Path to log file. If no logfile is specified, stderr is used.")
)
@click.option("--quiet", "-q", is_flag=True, default=False)
@click.option("--no-color", is_flag=True, default=False)
@click.option("--autoreload", is_flag=True, default=False, help="Enable autoreloading.")
@click.option("--without-gossip", is_flag=True, default=False)
@click.option("--without-mingle", is_flag=True, default=False)
@click.option("--without-heartbeat", is_flag=True, default=False)
@log_options()
@configuration
def cron(**options):
    "Run periodic task dispatcher."
    from django.conf import settings

    if settings.CELERY_ALWAYS_EAGER:
        raise click.ClickException(
            "Disable CELERY_ALWAYS_EAGER in your settings file to spawn workers."
        )

    from sentry.celery import app

    with managed_bgtasks(role="cron"):
        app.Beat(
            # without_gossip=True,
            # without_mingle=True,
            # without_heartbeat=True,
            **options
        ).run()


@run.command("post-process-forwarder")
@kafka_options("snuba-post-processor", allow_force_cluster=False)
@strict_offset_reset_option()
@click.option(
    "--topic",
    type=str,
    help="Main topic with messages for post processing",
)
@click.option(
    "--commit-log-topic",
    default="snuba-commit-log",
    help="Topic that the Snuba writer is publishing its committed offsets to.",
)
@click.option(
    "--synchronize-commit-group",
    default="snuba-consumers",
    help="Consumer group that the Snuba writer is committing its offset as.",
)
@click.option(
    "--concurrency",
    default=5,
    type=int,
    help="Thread pool size for post process worker.",
)
@click.option(
    "--entity",
    type=click.Choice(["errors", "transactions", "search_issues"]),
    help="The type of entity to process (errors, transactions, search_issues).",
)
@log_options()
@configuration
def post_process_forwarder(**options):
    from sentry import eventstream
    from sentry.eventstream.base import ForwarderNotRequired

    try:
        # TODO(markus): convert to use run_processor_with_signals -- can't yet because there's a custom shutdown handler
        eventstream.backend.run_post_process_forwarder(
            entity=options["entity"],
            consumer_group=options["group_id"],
            topic=options["topic"],
            commit_log_topic=options["commit_log_topic"],
            synchronize_commit_group=options["synchronize_commit_group"],
            concurrency=options["concurrency"],
            initial_offset_reset=options["auto_offset_reset"],
            strict_offset_reset=options["strict_offset_reset"],
        )
    except ForwarderNotRequired:
        sys.stdout.write(
            "The configured event stream backend does not need a forwarder "
            "process to enqueue post-process tasks. Exiting...\n"
        )
        return


@run.command("query-subscription-consumer")
@click.option(
    "--group",
    default="query-subscription-consumer",
    help="Consumer group to track query subscription offsets. ",
)
@click.option("--topic", default=None, help="Topic to get subscription updates from.")
@click.option(
    "--initial-offset-reset",
    default="latest",
    type=click.Choice(["earliest", "latest"]),
    help="Position in the commit log topic to begin reading from when no prior offset has been recorded.",
)
@click.option(
    "--force-offset-reset",
    default=None,
    type=click.Choice(["earliest", "latest"]),
    help="Force subscriptions to start from a particular offset",
)
@kafka_options(
    "query-subscription-consumer",
    include_batching_options=True,
    allow_force_cluster=False,
    default_max_batch_size=100,
)
@click.option(
    "--processes",
    default=1,
    type=int,
)
@click.option("--input-block-size", type=int, default=DEFAULT_BLOCK_SIZE)
@click.option("--output-block-size", type=int, default=DEFAULT_BLOCK_SIZE)
@strict_offset_reset_option()
@log_options()
@configuration
def query_subscription_consumer(**options):
    from sentry.consumers import print_deprecation_warning
    from sentry.snuba.query_subscriptions.constants import (
        dataset_to_logical_topic,
        topic_to_dataset,
    )
    from sentry.snuba.query_subscriptions.run import get_query_subscription_consumer

    dataset = topic_to_dataset[options["topic"]]
    logical_topic = dataset_to_logical_topic[dataset]
    # name of new consumer == name of logical topic
    print_deprecation_warning(logical_topic, options["group_id"])

    subscriber = get_query_subscription_consumer(
        topic=options["topic"],
        group_id=options["group"],
        strict_offset_reset=options["strict_offset_reset"],
        initial_offset_reset=options["initial_offset_reset"],
        max_batch_size=options["max_batch_size"],
        # Our batcher expects the time in seconds
        max_batch_time=int(options["max_batch_time"] / 1000),
        num_processes=options["processes"],
        input_block_size=options["input_block_size"],
        output_block_size=options["output_block_size"],
        multi_proc=True,
    )
    run_processor_with_signals(subscriber)


@run.command("ingest-consumer")
@log_options()
@click.option(
    "consumer_type",
    "--consumer-type",
    required=True,
    help="Specify which type of consumer to create",
    type=click.Choice(ConsumerType.all()),
)
@kafka_options("ingest-consumer", include_batching_options=True, default_max_batch_size=100)
@strict_offset_reset_option()
@configuration
@click.option(
    "--processes",
    "num_processes",
    default=1,
    type=int,
)
@click.option("--input-block-size", type=int, default=DEFAULT_BLOCK_SIZE)
@click.option("--output-block-size", type=int, default=DEFAULT_BLOCK_SIZE)
def ingest_consumer(consumer_type, **options):
    """
    Runs an "ingest consumer" task.

    The "ingest consumer" tasks read events from a kafka topic (coming from Relay) and schedules
    process event celery tasks for them
    """
    from sentry.consumers import print_deprecation_warning

    print_deprecation_warning(f"ingest-{consumer_type}", options["group_id"])

    from arroyo import configure_metrics

    from sentry.ingest.consumer_v2.factory import get_ingest_consumer
    from sentry.utils import metrics
    from sentry.utils.arroyo import MetricsWrapper

    configure_metrics(MetricsWrapper(metrics.backend, name=f"ingest_{consumer_type}"))

    options["max_batch_time"] = options["max_batch_time"] / 1000
    consumer = get_ingest_consumer(consumer_type, **options)
    run_processor_with_signals(consumer)


@run.command("occurrences-ingest-consumer")
@kafka_options(
    "occurrence-consumer",
    include_batching_options=True,
    allow_force_cluster=False,
    default_max_batch_size=20,
)
@strict_offset_reset_option()
@configuration
@click.option(
    "--processes",
    "num_processes",
    default=1,
    type=int,
)
@click.option("--input-block-size", type=int, default=DEFAULT_BLOCK_SIZE)
@click.option("--output-block-size", type=int, default=DEFAULT_BLOCK_SIZE)
def occurrences_ingest_consumer(**options):
    from sentry.consumers import print_deprecation_warning

    print_deprecation_warning("ingest-occurrences", options["group_id"])
    from django.conf import settings

    from sentry.utils import metrics

    consumer_type = settings.KAFKA_INGEST_OCCURRENCES

    # Our batcher expects the time in seconds
    options["max_batch_time"] = int(options["max_batch_time"] / 1000)

    from sentry.issues.run import get_occurrences_ingest_consumer

    with metrics.global_tags(ingest_consumer_types=consumer_type, _all_threads=True):
        consumer = get_occurrences_ingest_consumer(consumer_type, **options)
        run_processor_with_signals(consumer)


@run.command("ingest-metrics-parallel-consumer")
@log_options()
@kafka_options("ingest-metrics-consumer", allow_force_cluster=False)
@strict_offset_reset_option()
@configuration
@click.option(
    "--processes",
    default=1,
    type=int,
)
@click.option("--input-block-size", type=int, default=DEFAULT_BLOCK_SIZE)
@click.option("--output-block-size", type=int, default=DEFAULT_BLOCK_SIZE)
@click.option("--ingest-profile", required=True)
@click.option("--indexer-db", default="postgres")
@click.option("max_msg_batch_size", "--max-msg-batch-size", type=int, default=50)
@click.option("max_msg_batch_time", "--max-msg-batch-time-ms", type=int, default=10000)
@click.option("max_parallel_batch_size", "--max-parallel-batch-size", type=int, default=50)
@click.option("max_parallel_batch_time", "--max-parallel-batch-time-ms", type=int, default=10000)
def metrics_parallel_consumer(**options):
    from sentry.sentry_metrics.consumers.indexer.parallel import get_parallel_metrics_consumer

    streamer = get_parallel_metrics_consumer(**options)

    from arroyo import configure_metrics

    from sentry.utils.arroyo import MetricsWrapper
    from sentry.utils.metrics import backend

    metrics_wrapper = MetricsWrapper(backend, name="sentry_metrics.indexer")
    configure_metrics(metrics_wrapper)

    run_processor_with_signals(streamer)


@run.command("billing-metrics-consumer")
@log_options()
@kafka_options("billing-metrics-consumer")
@strict_offset_reset_option()
@configuration
def metrics_billing_consumer(**options):
    from sentry.consumers import print_deprecation_warning

    print_deprecation_warning("billing-metrics-consumer", options["group_id"])
    from sentry.ingest.billing_metrics_consumer import get_metrics_billing_consumer

    consumer = get_metrics_billing_consumer(**options)
    run_processor_with_signals(consumer)


@run.command("ingest-profiles")
@log_options()
@click.option("--topic", default="profiles", help="Topic to get profiles data from.")
@kafka_options("ingest-profiles")
@strict_offset_reset_option()
@configuration
def profiles_consumer(**options):
    from sentry.consumers import print_deprecation_warning

    print_deprecation_warning("ingest-profiles", options["group_id"])
    from sentry.profiles.consumers import get_profiles_process_consumer

    consumer = get_profiles_process_consumer(**options)
    run_processor_with_signals(consumer)


@run.command("consumer")
@log_options()
@click.argument(
    "consumer_name",
)
@click.argument("consumer_args", nargs=-1)
@click.option(
    "--topic",
    type=str,
    help="Which physical topic to use for this consumer. This can be a topic name that is not specified in settings. The logical topic is still hardcoded in sentry.consumers.",
)
@click.option(
    "--cluster", type=str, help="Which cluster definition from settings to use for this consumer."
)
@click.option(
    "--consumer-group",
    "group_id",
    required=True,
    help="Kafka consumer group for the consumer.",
)
@click.option(
    "--auto-offset-reset",
    "auto_offset_reset",
    default="latest",
    type=click.Choice(["earliest", "latest", "error"]),
    help="Position in the commit log topic to begin reading from when no prior offset has been recorded.",
)
@click.option("--join-timeout", type=float, help="Join timeout in seconds.", default=None)
@click.option(
    "--max-poll-interval-ms",
    type=int,
)
@click.option(
    "--synchronize-commit-log-topic",
    help="Topic that the Snuba writer is publishing its committed offsets to.",
)
@click.option(
    "--synchronize-commit-group",
    help="Consumer group that the Snuba writer is committing its offset as.",
)
@click.option(
    "--healthcheck-file-path",
    help="A file to touch roughly every second to indicate that the consumer is still alive. See https://getsentry.github.io/arroyo/strategies/healthcheck.html for more information.",
)
@strict_offset_reset_option()
@configuration
def basic_consumer(consumer_name, consumer_args, topic, **options):
    """
    Launch a "new-style" consumer based on its "consumer name".

    Example:

        sentry run consumer ingest-profiles --consumer-group ingest-profiles

    runs the ingest-profiles consumer with the consumer group ingest-profiles.

    Consumers are defined in 'sentry.consumers'. Each consumer can take
    additional CLI options. Those can be passed after '--':

        sentry run consumer ingest-occurrences --consumer-group occurrence-consumer -- --processes 1

    Consumer-specific arguments can be viewed with:

        sentry run consumer ingest-occurrences --consumer-group occurrence-consumer -- --help
    """
    from sentry.consumers import get_stream_processor
    from sentry.metrics.middleware import add_global_tags
    from sentry.utils.arroyo import initialize_arroyo_main

    add_global_tags(kafka_topic=topic, consumer_group=options["group_id"])
    initialize_arroyo_main()

    processor = get_stream_processor(consumer_name, consumer_args, topic=topic, **options)
    run_processor_with_signals(processor)


@run.command("dev-consumer")
@click.argument("consumer_names", nargs=-1)
@log_options()
@configuration
def dev_consumer(consumer_names):
    """
    Launch multiple "new-style" consumers in the same thread.

    This does the same thing as 'sentry run consumer', but is not configurable,
    hardcodes consumer groups and is highly imperformant.
    """

    from sentry.consumers import get_stream_processor
    from sentry.utils.arroyo import initialize_arroyo_main

    initialize_arroyo_main()

    processors = [
        get_stream_processor(
            consumer_name,
            [],
            topic=None,
            cluster=None,
            group_id="sentry-consumer",
            auto_offset_reset="latest",
            strict_offset_reset=False,
            join_timeout=None,
            max_poll_interval_ms=None,
            synchronize_commit_group=None,
            synchronize_commit_log_topic=None,
            healthcheck_file_path=None,
            validate_schema=True,
        )
        for consumer_name in consumer_names
    ]

    def handler(signum, frame):
        for processor in processors:
            processor.signal_shutdown()

    signal.signal(signal.SIGINT, handler)
    signal.signal(signal.SIGTERM, handler)

    while True:
        for processor in processors:
            processor._run_once()


@run.command("ingest-replay-recordings")
@log_options()
@configuration
@kafka_options("ingest-replay-recordings")
@click.option(
    "--topic", default="ingest-replay-recordings", help="Topic to get replay recording data from"
)
def replays_recordings_consumer(**options):
    from sentry.consumers import print_deprecation_warning

    print_deprecation_warning("ingest-replay-recordings", options["group_id"])
    from sentry.replays.consumers import get_replays_recordings_consumer

    consumer = get_replays_recordings_consumer(**options)
    run_processor_with_signals(consumer)


@run.command("ingest-monitors")
@log_options()
@click.option("--topic", default="ingest-monitors", help="Topic to get monitor check-in data from.")
@kafka_options("ingest-monitors")
@strict_offset_reset_option()
@configuration
def monitors_consumer(**options):
    from sentry.consumers import print_deprecation_warning

    print_deprecation_warning("ingest-monitors", options["group_id"])
    from sentry.monitors.consumers import get_monitor_check_ins_consumer

    consumer = get_monitor_check_ins_consumer(**options)
    run_processor_with_signals(consumer)


@run.command("indexer-last-seen-updater")
@log_options()
@configuration
@kafka_options(
    "indexer-last-seen-updater-consumer",
    allow_force_cluster=False,
    include_batching_options=True,
    default_max_batch_size=100,
)
@strict_offset_reset_option()
@click.option("--ingest-profile", required=True)
@click.option("--indexer-db", default="postgres")
def last_seen_updater(**options):
    from sentry.sentry_metrics.consumers.last_seen_updater import get_last_seen_updater
    from sentry.utils.metrics import global_tags

    config, consumer = get_last_seen_updater(**options)

    with global_tags(_all_threads=True, pipeline=config.internal_metrics_tag):
        run_processor_with_signals(consumer)


@run.command("backpressure-monitor")
@log_options()
@configuration
def backpressure_monitor():
    from sentry.processing.backpressure.monitor import start_service_monitoring

    start_service_monitoring()
