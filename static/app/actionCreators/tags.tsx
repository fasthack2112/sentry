import type {Query} from 'history';

import type {Client} from 'sentry/api';
import {normalizeDateTimeParams} from 'sentry/components/organizations/pageFilters/parse';
import {t} from 'sentry/locale';
import AlertStore from 'sentry/stores/alertStore';
import TagStore from 'sentry/stores/tagStore';
import type {PageFilters, Tag} from 'sentry/types';

const MAX_TAGS = 1000;

function tagFetchSuccess(tags: Tag[] | undefined) {
  // We occasionally get undefined passed in when APIs are having a bad time.
  tags = tags || [];
  const trimmedTags = tags.slice(0, MAX_TAGS);

  if (tags.length > MAX_TAGS) {
    AlertStore.addAlert({
      message: t('You have too many unique tags and some have been truncated'),
      type: 'warning',
    });
  }
  TagStore.loadTagsSuccess(trimmedTags);
}

/**
 * Load an organization's tags based on a global selection value.
 */
export function loadOrganizationTags(api: Client, orgId: string, selection: PageFilters) {
  TagStore.reset();

  const url = `/organizations/${orgId}/tags/`;
  const query: Query = selection.datetime
    ? {...normalizeDateTimeParams(selection.datetime)}
    : {};
  query.use_cache = '1';

  if (selection.projects) {
    query.project = selection.projects.map(String);
  }
  const promise = api.requestPromise(url, {
    method: 'GET',
    query,
  });

  promise.then(tagFetchSuccess);

  return promise;
}

/**
 * Fetch tags for an organization or a subset or projects.
 */
export function fetchOrganizationTags(
  api: Client,
  orgId: string,
  projectIds: string[] | null = null
) {
  TagStore.reset();

  const url = `/organizations/${orgId}/tags/`;
  const query: Query = {use_cache: '1'};
  if (projectIds) {
    query.project = projectIds;
  }

  const promise = api.requestPromise(url, {
    method: 'GET',
    query,
  });

  promise.then(tagFetchSuccess);

  return promise;
}

/**
 * Fetch tag values for an organization.
 * The `projectIds` argument can be used to subset projects.
 */
export function fetchTagValues(
  api: Client,
  orgId: string,
  tagKey: string,
  search: string | null = null,
  projectIds: string[] | null = null,
  endpointParams: Query | null = null,
  includeTransactions = false,
  includeSessions = false,
  sort: string | null = null
) {
  const url = `/organizations/${orgId}/tags/${tagKey}/values/`;

  const query: Query = {};
  if (search) {
    query.query = search;
  }
  if (projectIds) {
    query.project = projectIds;
  }
  if (endpointParams) {
    if (endpointParams.start) {
      query.start = endpointParams.start;
    }
    if (endpointParams.end) {
      query.end = endpointParams.end;
    }
    if (endpointParams.statsPeriod) {
      query.statsPeriod = endpointParams.statsPeriod;
    }
  }
  if (includeTransactions) {
    query.includeTransactions = '1';
  }

  if (includeSessions) {
    query.includeSessions = '1';
  }

  if (sort) {
    query.sort = sort;
  }

  return api.requestPromise(url, {
    method: 'GET',
    query,
  });
}
