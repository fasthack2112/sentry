import {CompactSelect, SelectOption} from 'sentry/components/compactSelect';
import SearchBar from 'sentry/components/searchBar';
import {t} from 'sentry/locale';
import type {Crumb} from 'sentry/types/breadcrumbs';
import useErrorFilters from 'sentry/views/replays/detail/errorList/useErrorFilters';
import FiltersGrid from 'sentry/views/replays/detail/filtersGrid';

type Props = {
  errorCrumbs: undefined | Crumb[];
} & ReturnType<typeof useErrorFilters>;

function ErrorFilters({
  getProjectOptions,
  errorCrumbs,
  searchTerm,
  selectValue,
  setFilters,
  setSearchTerm,
}: Props) {
  const projectOptions = getProjectOptions();

  return (
    <FiltersGrid>
      <CompactSelect
        disabled={!projectOptions.length}
        multiple
        onChange={setFilters as (selection: SelectOption<string>[]) => void}
        options={projectOptions}
        size="sm"
        triggerLabel={selectValue?.length === 0 ? t('Any') : null}
        triggerProps={{prefix: t('Project')}}
        value={selectValue}
      />
      <SearchBar
        size="sm"
        onChange={setSearchTerm}
        placeholder={t('Search Errors')}
        query={searchTerm}
        disabled={!errorCrumbs || !errorCrumbs.length}
      />
    </FiltersGrid>
  );
}

export default ErrorFilters;
