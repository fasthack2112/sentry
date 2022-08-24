import type {MetricsEnhancedSettingContext} from 'sentry/utils/performance/contexts/metricsEnhancedSetting';
import {useMEPSettingContext} from 'sentry/utils/performance/contexts/metricsEnhancedSetting';
import {usePageError} from 'sentry/utils/performance/contexts/pageError';
import {PerformanceDisplayProvider} from 'sentry/utils/performance/contexts/performanceDisplayContext';

import Table from '../../table';
import {PROJECT_PERFORMANCE_TYPE} from '../../utils';
import {BACKEND_COLUMN_TITLES} from '../data';
import {DoubleChartRow, TripleChartRow} from '../widgets/components/widgetChartRow';
import {filterAllowedChartsMetrics} from '../widgets/utils';
import {PerformanceWidgetSetting} from '../widgets/widgetDefinitions';

import type {BasePerformanceViewProps} from './types';

function getAllowedChartsSmall(
  props: BasePerformanceViewProps,
  mepSetting: MetricsEnhancedSettingContext
) {
  const charts = [
    PerformanceWidgetSetting.APDEX_AREA,
    PerformanceWidgetSetting.TPM_AREA,
    PerformanceWidgetSetting.FAILURE_RATE_AREA,
    PerformanceWidgetSetting.USER_MISERY_AREA,
    PerformanceWidgetSetting.P50_DURATION_AREA,
    PerformanceWidgetSetting.P75_DURATION_AREA,
    PerformanceWidgetSetting.P95_DURATION_AREA,
    PerformanceWidgetSetting.P99_DURATION_AREA,
    PerformanceWidgetSetting.DURATION_HISTOGRAM,
  ];

  return filterAllowedChartsMetrics(props.organization, charts, mepSetting);
}

export function BackendView(props: BasePerformanceViewProps) {
  const mepSetting = useMEPSettingContext();
  return (
    <PerformanceDisplayProvider value={{performanceType: PROJECT_PERFORMANCE_TYPE.ANY}}>
      <div>
        <TripleChartRow
          {...props}
          allowedCharts={getAllowedChartsSmall(props, mepSetting)}
        />
        <DoubleChartRow
          {...props}
          allowedCharts={[
            PerformanceWidgetSetting.SLOW_HTTP_OPS,
            PerformanceWidgetSetting.SLOW_DB_OPS,
            PerformanceWidgetSetting.MOST_IMPROVED,
            PerformanceWidgetSetting.MOST_REGRESSED,
          ]}
        />
        <Table
          {...props}
          columnTitles={BACKEND_COLUMN_TITLES}
          setError={usePageError().setPageError}
        />
      </div>
    </PerformanceDisplayProvider>
  );
}
