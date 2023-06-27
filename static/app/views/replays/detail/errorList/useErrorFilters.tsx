import {useCallback, useMemo} from 'react';

import type {SelectOption} from 'sentry/components/compactSelect';
import type {Crumb} from 'sentry/types/breadcrumbs';
import {decodeList, decodeScalar} from 'sentry/utils/queryString';
import useFiltersInLocationQuery from 'sentry/utils/replays/hooks/useFiltersInLocationQuery';
import {filterItems} from 'sentry/views/replays/detail/utils';

export interface ErrorSelectOption extends SelectOption<string> {
  qs: 'f_e_project';
}

const DEFAULT_FILTERS = {f_e_project: []} as Record<ErrorSelectOption['qs'], string[]>;

export type FilterFields = {
  f_e_project: string[];
  f_e_search: string;
};

type Options = {
  errorCrumbs: Crumb[];
};

type Return = {
  getProjectOptions: () => ErrorSelectOption[];
  items: Crumb[];
  searchTerm: string;
  selectValue: string[];
  setFilters: (val: ErrorSelectOption[]) => void;
  setSearchTerm: (searchTerm: string) => void;
};

const FILTERS = {
  project: (item: Crumb, projects: string[]) =>
    // @ts-expect-error
    projects.length === 0 || projects.includes(item.data.project || ''),

  searchTerm: (item: Crumb, searchTerm: string) =>
    JSON.stringify([item.message, item.description]).toLowerCase().includes(searchTerm),
};

function useErrorFilters({errorCrumbs}: Options): Return {
  const {setFilter, query} = useFiltersInLocationQuery<FilterFields>();

  const project = decodeList(query.f_e_project);
  const searchTerm = decodeScalar(query.f_e_search, '').toLowerCase();

  const items = useMemo(
    () =>
      filterItems({
        items: errorCrumbs,
        filterFns: FILTERS,
        filterVals: {project, searchTerm},
      }),
    [errorCrumbs, project, searchTerm]
  );

  const getProjectOptions = useCallback(
    () =>
      Array.from(
        new Set(
          errorCrumbs
            // @ts-expect-error
            .map(crumb => crumb.data.project)
            .concat(project)
        )
      )
        .filter(Boolean)
        .sort()
        .map(
          (value): ErrorSelectOption => ({
            value,
            label: value,
            qs: 'f_e_project',
          })
        ),
    [errorCrumbs, project]
  );

  const setSearchTerm = useCallback(
    (f_e_search: string) => setFilter({f_e_search: f_e_search || undefined}),
    [setFilter]
  );

  const setFilters = useCallback(
    (value: ErrorSelectOption[]) => {
      const groupedValues = value.reduce((state, selection) => {
        return {
          ...state,
          [selection.qs]: [...state[selection.qs], selection.value],
        };
      }, DEFAULT_FILTERS);
      setFilter(groupedValues);
    },
    [setFilter]
  );

  return {
    getProjectOptions,
    items,
    searchTerm,
    selectValue: project,
    setFilters,
    setSearchTerm,
  };
}

export default useErrorFilters;
