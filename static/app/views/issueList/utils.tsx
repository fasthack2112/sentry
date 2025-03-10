import ExternalLink from 'sentry/components/links/externalLink';
import {DEFAULT_QUERY} from 'sentry/constants';
import {t, tct} from 'sentry/locale';
import {Organization} from 'sentry/types';

export enum Query {
  FOR_REVIEW_OLD = 'is:unresolved is:for_review assigned_or_suggested:[me, none]',
  FOR_REVIEW = 'is:unresolved is:for_review assigned_or_suggested:[me, my_teams, none]',
  UNRESOLVED = 'is:unresolved',
  IGNORED = 'is:ignored',
  NEW = 'is:new',
  ARCHIVED = 'is:archived',
  ESCALATING = 'is:escalating',
  REGRESSED = 'is:regressed',
  REPROCESSING = 'is:reprocessing',
}

export const CUSTOM_TAB_VALUE = '__custom__';

type OverviewTab = {
  /**
   * Emitted analytics event tab name
   */
  analyticsName: string;
  /**
   * Will fetch a count to display on this tab
   */
  count: boolean;
  /**
   * Tabs can be disabled via flag
   */
  enabled: boolean;
  name: string;
  hidden?: boolean;
  /**
   * Tooltip text to be hoverable when text has links
   */
  tooltipHoverable?: boolean;
  /**
   * Tooltip text for each tab
   */
  tooltipTitle?: React.ReactNode;
};

/**
 * Get a list of currently active tabs
 */
export function getTabs(organization: Organization) {
  const hasEscalatingIssuesUi = organization.features.includes('escalating-issues');
  const hasAssignToMe = organization.features.includes('assign-to-me');
  const tabs: Array<[string, OverviewTab]> = [
    [
      Query.UNRESOLVED,
      {
        name: hasEscalatingIssuesUi ? t('Unresolved') : t('All Unresolved'),
        analyticsName: 'unresolved',
        count: true,
        enabled: true,
      },
    ],
    [
      hasAssignToMe ? Query.FOR_REVIEW : Query.FOR_REVIEW_OLD,
      {
        name: t('For Review'),
        analyticsName: 'needs_review',
        count: true,
        enabled: true,
        tooltipTitle: hasEscalatingIssuesUi
          ? t(
              'Issues are marked for review if they are new or escalating, and have not been resolved or archived. Issues are automatically marked reviewed in 7 days.'
            )
          : t(`Issues are marked for review when they are created, unresolved, or unignored.
          Mark an issue reviewed to move it out of this list.
          Issues are automatically marked reviewed in 7 days.`),
      },
    ],
    [
      Query.REGRESSED,
      {
        name: t('Regressed'),
        analyticsName: 'regressed',
        count: true,
        enabled: hasEscalatingIssuesUi,
      },
    ],
    [
      Query.ESCALATING,
      {
        name: t('Escalating'),
        analyticsName: 'escalating',
        count: true,
        enabled: hasEscalatingIssuesUi,
      },
    ],
    [
      Query.ARCHIVED,
      {
        name: t('Archived'),
        analyticsName: 'archived',
        count: true,
        enabled: hasEscalatingIssuesUi,
      },
    ],
    [
      Query.IGNORED,
      {
        name: t('Ignored'),
        analyticsName: 'ignored',
        count: true,
        enabled: !hasEscalatingIssuesUi,
        tooltipTitle: t(`Ignored issues don’t trigger alerts. When their ignore
        conditions are met they become Unresolved and are flagged for review.`),
      },
    ],
    [
      Query.REPROCESSING,
      {
        name: t('Reprocessing'),
        analyticsName: 'reprocessing',
        count: true,
        enabled: organization.features.includes('reprocessing-v2'),
        tooltipTitle: tct(
          `These [link:reprocessing issues] will take some time to complete.
        Any new issues that are created during reprocessing will be flagged for review.`,
          {
            link: (
              <ExternalLink href="https://docs.sentry.io/product/error-monitoring/reprocessing/" />
            ),
          }
        ),
        tooltipHoverable: true,
      },
    ],
    [
      // Hidden tab to account for custom queries that don't match any of the queries
      // above. It's necessary because if Tabs's value doesn't match that of any tab item
      // then Tabs will fall back to a default value, causing unexpected behaviors.
      CUSTOM_TAB_VALUE,
      {
        name: t('Custom'),
        analyticsName: 'custom',
        hidden: true,
        count: false,
        enabled: true,
      },
    ],
  ];

  return tabs.filter(([_query, tab]) => tab.enabled);
}

/**
 * @returns queries that should have counts fetched
 */
export function getTabsWithCounts(organization: Organization) {
  const tabs = getTabs(organization);
  return tabs.filter(([_query, tab]) => tab.count).map(([query]) => query);
}

export function isForReviewQuery(query: string | undefined) {
  return !!query && /\bis:for_review\b/.test(query);
}

// the tab counts will look like 99+
export const TAB_MAX_COUNT = 99;

type QueryCount = {
  count: number;
  hasMore: boolean;
};

export type QueryCounts = Partial<Record<Query, QueryCount>>;

export enum IssueSortOptions {
  DATE = 'date',
  NEW = 'new',
  BETTER_PRIORITY = 'betterPriority',
  FREQ = 'freq',
  USER = 'user',
  INBOX = 'inbox',
}

export const DEFAULT_ISSUE_STREAM_SORT = IssueSortOptions.DATE;

export function isDefaultIssueStreamSearch({query, sort}: {query: string; sort: string}) {
  return query === DEFAULT_QUERY && sort === DEFAULT_ISSUE_STREAM_SORT;
}

export function getSortLabel(key: string) {
  switch (key) {
    case IssueSortOptions.NEW:
      return t('First Seen');
    case IssueSortOptions.BETTER_PRIORITY:
      return t('Priority');
    case IssueSortOptions.FREQ:
      return t('Events');
    case IssueSortOptions.USER:
      return t('Users');
    case IssueSortOptions.INBOX:
      return t('Date Added');
    case IssueSortOptions.DATE:
    default:
      return t('Last Seen');
  }
}

export const DISCOVER_EXCLUSION_FIELDS: string[] = [
  'query',
  'status',
  'bookmarked_by',
  'assigned',
  'assigned_to',
  'unassigned',
  'subscribed_by',
  'active_at',
  'first_release',
  'first_seen',
  'is',
  '__text',
];

export const FOR_REVIEW_QUERIES: string[] = [Query.FOR_REVIEW, Query.FOR_REVIEW_OLD];

export const SAVED_SEARCHES_SIDEBAR_OPEN_LOCALSTORAGE_KEY =
  'issue-stream-saved-searches-sidebar-open';
