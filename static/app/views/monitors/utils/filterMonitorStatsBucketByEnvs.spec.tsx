import {MonitorBucket} from 'sentry/views/monitors/components/overviewTimeline/types';
import {filterMonitorStatsBucketByEnvs} from 'sentry/views/monitors/utils/filterMonitorStatsBucketByEnvs';

describe('filterMonitorStatsBucketByEnvs', function () {
  it('filters away environments', function () {
    const bucket = [
      1,
      {
        prod: {ok: 0, missed: 0, timeout: 1, error: 0},
        dev: {ok: 1, missed: 0, timeout: 0, error: 0},
      },
    ] as MonitorBucket;
    const filteredBucket = filterMonitorStatsBucketByEnvs(bucket, new Set(['prod']));
    expect(filteredBucket).toEqual([
      1,
      {
        prod: {ok: 0, missed: 0, timeout: 1, error: 0},
      },
    ]);
  });

  it('filters on an empty bucket', function () {
    const bucket = [1, {}] as MonitorBucket;
    const filteredBucket = filterMonitorStatsBucketByEnvs(bucket, new Set(['prod']));
    expect(filteredBucket).toEqual([1, {}]);
  });
});
