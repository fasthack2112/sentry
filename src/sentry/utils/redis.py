from __future__ import annotations

import functools
import logging
import posixpath
from copy import deepcopy
from threading import Lock
from typing import Generic, TypeVar

import rb
from django.utils.functional import SimpleLazyObject
from pkg_resources import resource_string
from redis.client import Script
from redis.connection import ConnectionPool, Encoder
from redis.exceptions import BusyLoadingError, ConnectionError
from rediscluster import RedisCluster
from rediscluster.exceptions import ClusterError
from sentry_redis_tools import clients
from sentry_redis_tools.failover_redis import FailoverRedis

from sentry import options
from sentry.exceptions import InvalidConfiguration
from sentry.utils import warnings
from sentry.utils.imports import import_string
from sentry.utils.versioning import Version, check_versions
from sentry.utils.warnings import DeprecatedSettingWarning

logger = logging.getLogger(__name__)

_pool_cache = {}
_pool_lock = Lock()


def _shared_pool(**opts):
    if "host" in opts:
        key = "{}:{}/{}".format(opts["host"], opts["port"], opts["db"])
    else:
        key = "{}/{}".format(opts["path"], opts["db"])
    pool = _pool_cache.get(key)
    if pool is not None:
        return pool
    with _pool_lock:
        pool = _pool_cache.get(key)
        if pool is not None:
            return pool
        pool = ConnectionPool(**opts)
        _pool_cache[key] = pool
        return pool


_make_rb_cluster = functools.partial(rb.Cluster, pool_cls=_shared_pool)


class _RBCluster:
    def supports(self, config):
        return not config.get("is_redis_cluster", False)

    def factory(self, **config):
        # rb expects a dict of { host, port } dicts where the key is the host
        # ID. Coerce the configuration into the correct format if necessary.
        hosts = config["hosts"]
        hosts = {k: v for k, v in enumerate(hosts)} if isinstance(hosts, list) else hosts
        config["hosts"] = hosts

        return _make_rb_cluster(**config)

    def __str__(self):
        return "Redis Blaster Cluster"


class RetryingRedisCluster(RedisCluster):
    """
    Execute a command with cluster reinitialization retry logic.

    Should a cluster respond with a ConnectionError or BusyLoadingError the
    cluster nodes list will be reinitialized and the command will be executed
    again with the most up to date view of the world.
    """

    def execute_command(self, *args, **kwargs):
        try:
            return super(self.__class__, self).execute_command(*args, **kwargs)
        except (
            ConnectionError,
            BusyLoadingError,
            ClusterError,
            KeyError,  # see: https://github.com/Grokzen/redis-py-cluster/issues/287
        ):
            self.connection_pool.nodes.reset()
            return super(self.__class__, self).execute_command(*args, **kwargs)


class _RedisCluster:
    def supports(self, config):
        # _RedisCluster supports two configurations:
        #  * Explicitly configured with is_redis_cluster. This mode is for real redis-cluster.
        #  * No is_redis_cluster, but only 1 host. This represents a singular node Redis running
        #    in non-cluster mode.
        return config.get("is_redis_cluster", False) or len(config.get("hosts")) == 1

    def factory(self, **config):
        # StrictRedisCluster expects a list of { host, port } dicts. Coerce the
        # configuration into the correct format if necessary.
        hosts = config.get("hosts")
        hosts = list(hosts.values()) if isinstance(hosts, dict) else hosts

        # support for scaling reads using the readonly mode
        # https://redis.io/docs/reference/cluster-spec/#scaling-reads-using-replica-nodes
        readonly_mode = config.get("readonly_mode", False)

        client_args = config.get("client_args") or {}

        # Redis cluster does not wait to attempt to connect. We'd prefer to not
        # make TCP connections on boot. Wrap the client in a lazy proxy object.
        def cluster_factory():
            if config.get("is_redis_cluster", False):
                return RetryingRedisCluster(
                    # Intentionally copy hosts here because redis-cluster-py
                    # mutates the inner dicts and this closure can be run
                    # concurrently, as SimpleLazyObject is not threadsafe. This
                    # is likely triggered by RetryingRedisCluster running
                    # reset() after startup
                    #
                    # https://github.com/Grokzen/redis-py-cluster/blob/73f27edf7ceb4a408b3008ef7d82dac570ab9c6a/rediscluster/nodemanager.py#L385
                    startup_nodes=deepcopy(hosts),
                    decode_responses=True,
                    skip_full_coverage_check=True,
                    max_connections=16,
                    max_connections_per_node=True,
                    readonly_mode=readonly_mode,
                    **client_args,
                )
            else:
                host = hosts[0].copy()
                host["decode_responses"] = True
                return (
                    import_string(config["client_class"])
                    if "client_class" in config
                    else FailoverRedis
                )(**host, **client_args)

        return SimpleLazyObject(cluster_factory)

    def __str__(self):
        return "Redis Cluster"


T = TypeVar("T")


class ClusterManager(Generic[T]):
    def __init__(self, options_manager, cluster_type=_RBCluster):
        self.__clusters = {}
        self.__options_manager = options_manager
        self.__cluster_type = cluster_type()

    def get(self, key) -> T:
        cluster = self.__clusters.get(key)

        # Do not access attributes of the `cluster` object to prevent
        # setup/init of lazy objects. The _RedisCluster type will try to
        # connect to the cluster during initialization.
        if cluster is None:
            # TODO: This would probably be safer with a lock, but I'm not sure
            # that it's necessary.
            configuration = self.__options_manager.get("redis.clusters").get(key)
            if configuration is None:
                raise KeyError(f"Invalid cluster name: {key}")

            if not self.__cluster_type.supports(configuration):
                raise KeyError(f"Invalid cluster type, expected: {self.__cluster_type}")

            cluster = self.__clusters[key] = self.__cluster_type.factory(**configuration)

        return cluster


# TODO(epurkhiser): When migration of all rb cluster to true redis clusters has
# completed, remove the rb ``clusters`` module variable and rename
# redis_clusters to clusters.
clusters = ClusterManager(options.default_manager)
redis_clusters: ClusterManager[clients.RedisCluster | clients.StrictRedis] = ClusterManager(
    options.default_manager, _RedisCluster
)


def get_cluster_from_options(setting, options, cluster_manager=clusters):
    cluster_option_name = "cluster"
    default_cluster_name = "default"
    cluster_constructor_option_names = frozenset(("hosts",))

    options = options.copy()
    cluster_options = {
        key: options.pop(key)
        for key in set(options.keys()).intersection(cluster_constructor_option_names)
    }
    if cluster_options:
        if cluster_option_name in options:
            raise InvalidConfiguration(
                "Cannot provide both named cluster ({!r}) and cluster configuration ({}) options.".format(
                    cluster_option_name,
                    ", ".join(repr(name) for name in cluster_constructor_option_names),
                )
            )
        else:
            warnings.warn(
                DeprecatedSettingWarning(
                    "{} parameter of {}".format(
                        ", ".join(repr(name) for name in cluster_constructor_option_names), setting
                    ),
                    f'{setting}["{cluster_option_name}"]',
                    removed_in_version="8.5",
                ),
                stacklevel=2,
            )
        cluster = rb.Cluster(pool_cls=_shared_pool, **cluster_options)
    else:
        cluster = cluster_manager.get(options.pop(cluster_option_name, default_cluster_name))

    return cluster, options


def get_dynamic_cluster_from_options(setting, config):
    cluster_name = config.get("cluster", "default")
    cluster_opts = options.default_manager.get("redis.clusters").get(cluster_name)
    if cluster_opts is not None and cluster_opts.get("is_redis_cluster"):
        # RedisCluster
        return True, redis_clusters.get(cluster_name), config

    # RBCluster
    return (False,) + get_cluster_from_options(setting, config)


def validate_dynamic_cluster(is_redis_cluster, cluster):
    try:
        if is_redis_cluster:
            cluster.ping()
            cluster.connection_pool.disconnect()
        else:
            with cluster.all() as client:
                client.ping()
            cluster.disconnect_pools()
    except Exception as e:
        raise InvalidConfiguration(str(e))


def check_cluster_versions(cluster, required, recommended=None, label=None):
    try:
        with cluster.all() as client:
            results = client.info()
        cluster.disconnect_pools()
    except Exception as e:
        # Any connection issues should be caught here.
        raise InvalidConfiguration(str(e))

    versions = {}
    for id, info in results.value.items():
        host = cluster.hosts[id]
        # NOTE: This assumes there is no routing magic going on here, and
        # all requests to this host are being served by the same database.
        key = f"{host.host}:{host.port}"
        versions[key] = Version([int(part) for part in info["redis_version"].split(".", 3)])

    check_versions(
        "Redis" if label is None else f"Redis ({label})", versions, required, recommended
    )


def load_script(path):
    script = []

    # This changes the argument order of the ``Script.__call__`` method to
    # encourage using the script with a specific Redis client, rather
    # than implicitly using the first client that the script was registered
    # with. (This can prevent lots of bizarre behavior when dealing with
    # clusters of Redis servers.)
    def call_script(client, keys, args):
        # Executes load_script's path as a Lua script on a Redis server.
        # Takes the client to execute the script on as the first argument,
        # followed by the values that will be provided as ``KEYS`` and ``ARGV``
        # to the script as two sequence arguments.
        if not script:
            # XXX: Script is a list here. We're doing this to work around the lack of
            # `nonlocal` in python 3, so that we only instantiate the script once.
            script.append(
                Script(client, resource_string("sentry", posixpath.join("scripts", path)))
            )
            # Unset the client here to keep things as close to how they worked before
            # as possible. It will always be overridden on `__call__` anyway.
            script[0].registered_client = None
        return script[0](keys, args, client)

    return call_script


class SentryScript(Script):
    """
    XXX: This is a gross workaround to fix a breaking api change in redis-py. When we
    instantiate a script, we've historically been passing `None` as the client. Then
    when we call the script we pass the actual client, which Redis uses as an override.
    The breaking changes relies on there being a client passed in the constructor to
    determine the encoding of the script before generating the sha.

    To work around this, we create a fake client with a fake connection pool that just
    returns an encoder that will work. Once this has been done we then set the
    `registered_client` back to None, so that the behaviour is the same as before.

    This is only needed when we can't use `load_script`, since we have the client
    available there and can pass it through. So once we remove `RedisTSDB` we can also
    kill this hack.
    """

    class FakeConnectionPool:
        def get_encoder(self):
            return Encoder(encoding="utf-8", encoding_errors="strict", decode_responses=False)

    class FakeEncoderClient:
        def __init__(self):
            self.connection_pool = SentryScript.FakeConnectionPool()

    def __init__(self, registered_client, script):
        if registered_client is None:
            registered_client = self.FakeEncoderClient()
        super().__init__(registered_client, script)
        if isinstance(self.registered_client, self.FakeEncoderClient):
            self.registered_client = None
