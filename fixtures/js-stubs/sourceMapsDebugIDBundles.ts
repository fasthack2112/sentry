import type {DebugIdBundle} from 'sentry/types';

export function SourceMapsDebugIDBundles(
  debugIdBundle: Partial<DebugIdBundle> = {}
): DebugIdBundle[] {
  return [
    {
      bundleId: 'b916a646-2c6b-4e45-af4c-409830a44e0e',
      associations: [
        {
          release: 'v2.0',
          dist: null,
        },
        {
          release: 'frontend@2e318148eac9298ec04a662ae32b4b093b027f0a',
          dist: ['android', 'iOS'],
        },
      ],
      release: null,
      dist: null,
      fileCount: 39,
      date: '2023-03-08T09:53:09Z',
      ...debugIdBundle,
    },
  ];
}
