import {MonitorBucket} from 'sentry/views/monitors/components/overviewTimeline/types';

export function filterMonitorStatsBucketByEnvs(
  bucket: MonitorBucket,
  environments: Set<string>
): MonitorBucket {
  const [timestamp, envMapping] = bucket;
  const envFilteredBucket = Object.entries(envMapping).reduce(
    (filteredBucket, [envName, envBucket]) =>
      environments.has(envName)
        ? {...filteredBucket, [envName]: envBucket}
        : filteredBucket,
    {}
  );
  return [timestamp, envFilteredBucket];
}
