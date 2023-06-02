import {EventType} from '@sentry-internal/rrweb';
import {serializedNodeWithId} from '@sentry-internal/rrweb-snapshot';

import type {ReplaySpan as TReplaySpan} from 'sentry/views/replays/types';

type FullSnapshotEvent = {
  data: {
    initialOffset: {
      left: number;
      top: number;
    };
    node: serializedNodeWithId;
  };
  timestamp: number;
  type: EventType.FullSnapshot;
};

type BaseReplayProps = {
  timestamp: Date;
};

export function ReplaySegmentInit({
  height = 600,
  href = 'http://localhost/',
  timestamp,
  width = 800,
}: BaseReplayProps & {
  height?: number;
  href?: string;
  width?: number;
}) {
  return [
    {
      type: EventType.DomContentLoaded,
      timestamp: timestamp.getTime(), // rrweb timestamps are in ms
    },
    {
      type: EventType.Load,
      timestamp: timestamp.getTime(), // rrweb timestamps are in ms
    },
    {
      type: EventType.Meta,
      data: {href, width, height},
      timestamp: timestamp.getTime(), // rrweb timestamps are in ms
    },
  ];
}

export function ReplaySegmentFullsnapshot({
  timestamp,
  childNodes,
}: BaseReplayProps & {childNodes: serializedNodeWithId[]}): [FullSnapshotEvent] {
  return [
    {
      type: EventType.FullSnapshot,
      timestamp: timestamp.getTime(),
      data: {
        initialOffset: {
          top: 0,
          left: 0,
        },
        node: {
          type: 0, // NodeType.DocumentType
          id: 0,
          childNodes: [
            ReplayRRWebNode({
              tagName: 'body',
              attributes: {
                style:
                  'margin:0; font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu;',
              },
              childNodes,
            }),
          ],
        },
      },
    },
  ];
}

export function ReplaySegmentConsole({timestamp}: BaseReplayProps) {
  return ReplaySegmentBreadcrumb({
    timestamp,
    payload: {
      timestamp: timestamp.getTime() / 1000, // sentry data inside rrweb is in seconds
      type: 'default',
      category: 'console',
      data: {
        arguments: [
          './src/pages/template/Header.js\n  Line 14:  The href attribute requires a valid value to be accessible. Provide a valid, navigable address as the href value.',
        ],
        logger: 'console',
      },
      level: 'warning',
      message:
        './src/pages/template/Header.js\n  Line 14:  The href attribute requires a valid value to be accessible. Provide a valid, navigable address as the href value.',
    },
  });
}

export function ReplaySegmentNavigation({
  timestamp,
  hrefFrom = '/',
  hrefTo = '/profile/',
}: BaseReplayProps & {hrefFrom?: string; hrefTo?: string}) {
  return ReplaySegmentBreadcrumb({
    timestamp,
    payload: {
      timestamp: timestamp.getTime() / 1000, // sentry data inside rrweb is in seconds
      type: 'default',
      category: 'navigation',
      data: {
        from: hrefFrom,
        to: hrefTo,
      },
    },
  });
}

export function ReplaySegmentBreadcrumb({
  timestamp,
  payload,
}: BaseReplayProps & {payload: any}) {
  return [
    {
      type: EventType.Custom,
      timestamp: timestamp.getTime(), // rrweb timestamps are in ms
      data: {
        tag: 'breadcrumb',
        payload,
      },
    },
  ];
}

export function ReplaySegmentSpan({
  timestamp,
  payload,
}: BaseReplayProps & {payload: any}) {
  return [
    {
      type: EventType.Custom,
      timestamp: timestamp.getTime(), // rrweb timestamps are in ms
      data: {
        tag: 'performanceSpan',
        payload,
      },
    },
  ];
}

const nextRRWebId = (function () {
  let __rrwebID = 0;
  return () => ++__rrwebID;
})();

export function ReplayRRWebNode({
  id,
  tagName,
  attributes,
  childNodes,
  textContent,
}: {
  attributes?: Record<string, string>;
  childNodes?: serializedNodeWithId[];
  id?: number;
  tagName?: string;
  textContent?: string;
}): serializedNodeWithId {
  id = id ?? nextRRWebId();
  if (tagName) {
    return {
      type: 2, // NodeType.Element
      id,
      tagName,
      attributes: attributes ?? {},
      childNodes: childNodes ?? [],
    };
  }
  return {
    type: 3, // NodeType.Text
    id,
    textContent: textContent ?? '',
  };
}

export function ReplayRRWebDivHelloWorld() {
  return ReplayRRWebNode({
    tagName: 'div',
    childNodes: [
      ReplayRRWebNode({
        tagName: 'h1',
        attributes: {style: 'text-align: center;'},
        childNodes: [
          ReplayRRWebNode({
            textContent: 'Hello World',
          }),
        ],
      }),
    ],
  });
}

export function ReplaySpanPayload({
  startTimestamp = new Date(),
  endTimestamp = new Date(),
  ...extra
}: {
  op: string;
  data?: Record<string, any>;
  description?: string;
  endTimestamp?: Date;
  startTimestamp?: Date;
}): TReplaySpan<Record<string, any>> {
  return {
    data: {},
    id: '0',
    ...extra,
    startTimestamp: startTimestamp.getTime() / 1000, // in seconds, with ms precision
    endTimestamp: endTimestamp?.getTime() / 1000, // in seconds, with ms precision
    timestamp: startTimestamp?.getTime(), // in ms, same as startTimestamp
  };
}

export function ReplaySpanPayloadNavigate({
  description = 'http://test.com',
  endTimestamp = new Date(),
  startTimestamp = new Date(),
}: {
  // The url goes into the description field
  description: string;
  endTimestamp: Date;
  startTimestamp: Date;
}) {
  const duration = endTimestamp.getTime() - startTimestamp.getTime(); // in MS
  return ReplaySpanPayload({
    op: 'navigation.navigate',
    description,
    startTimestamp,
    endTimestamp,
    data: {
      size: 1149,
      decodedBodySize: 1712,
      encodedBodySize: 849,
      duration,
      domInteractive: duration - 200,
      domContentLoadedEventStart: duration - 50,
      domContentLoadedEventEnd: duration - 48,
      loadEventStart: duration, // real value would be approx the same
      loadEventEnd: duration, // real value would be approx the same
      domComplete: duration, // real value would be approx the same
      redirectCount: 0,
    },
  });
}
