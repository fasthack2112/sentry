import {Fragment, ReactNode, useCallback, useEffect, useMemo, useState} from 'react';
import {browserHistory} from 'react-router';
import {Theme, useTheme} from '@emotion/react';
import styled from '@emotion/styled';

import {Button} from 'sentry/components/button';
import ChartZoom from 'sentry/components/charts/chartZoom';
import {LineChart} from 'sentry/components/charts/lineChart';
import Count from 'sentry/components/count';
import EmptyStateWarning from 'sentry/components/emptyStateWarning';
import IdBadge from 'sentry/components/idBadge';
import Link from 'sentry/components/links/link';
import LoadingIndicator from 'sentry/components/loadingIndicator';
import Pagination, {CursorHandler} from 'sentry/components/pagination';
import PerformanceDuration from 'sentry/components/performanceDuration';
import TextOverflow from 'sentry/components/textOverflow';
import {Tooltip} from 'sentry/components/tooltip';
import {IconArrow, IconChevron, IconWarning} from 'sentry/icons';
import {t, tct} from 'sentry/locale';
import {space} from 'sentry/styles/space';
import {Series} from 'sentry/types/echarts';
import {axisLabelFormatter, tooltipFormatter} from 'sentry/utils/discover/charts';
import type {TrendType} from 'sentry/utils/profiling/hooks/types';
import {FunctionTrend} from 'sentry/utils/profiling/hooks/types';
import {useProfileFunctionTrends} from 'sentry/utils/profiling/hooks/useProfileFunctionTrends';
import {generateProfileFlamechartRouteWithQuery} from 'sentry/utils/profiling/routes';
import {decodeScalar} from 'sentry/utils/queryString';
import {useLocation} from 'sentry/utils/useLocation';
import useOrganization from 'sentry/utils/useOrganization';
import usePageFilters from 'sentry/utils/usePageFilters';
import useProjects from 'sentry/utils/useProjects';
import useRouter from 'sentry/utils/useRouter';

import {
  Accordion,
  AccordionItem,
  ContentContainer,
  HeaderContainer,
  HeaderTitleLegend,
  StatusContainer,
  Subtitle,
  WidgetContainer,
} from './styles';

const MAX_FUNCTIONS = 3;
const DEFAULT_CURSOR_NAME = 'fnTrendCursor';

interface FunctionTrendsWidgetProps {
  trendFunction: 'p50()' | 'p75()' | 'p95()' | 'p99()';
  trendType: TrendType;
  cursorName?: string;
  header?: ReactNode;
  userQuery?: string;
  widgetHeight?: string;
}

export function FunctionTrendsWidget({
  cursorName = DEFAULT_CURSOR_NAME,
  header,
  trendFunction,
  trendType,
  widgetHeight,
  userQuery,
}: FunctionTrendsWidgetProps) {
  const location = useLocation();

  const [expandedIndex, setExpandedIndex] = useState(0);

  const fnTrendCursor = useMemo(
    () => decodeScalar(location.query[cursorName]),
    [cursorName, location.query]
  );

  const handleCursor = useCallback(
    (cursor, pathname, query) => {
      browserHistory.push({
        pathname,
        query: {...query, [cursorName]: cursor},
      });
    },
    [cursorName]
  );

  const trendsQuery = useProfileFunctionTrends({
    trendFunction,
    trendType,
    query: userQuery,
    limit: MAX_FUNCTIONS,
    cursor: fnTrendCursor,
  });

  useEffect(() => {
    setExpandedIndex(0);
  }, [trendsQuery.data]);

  const hasTrends = (trendsQuery.data?.length || 0) > 0;
  const isLoading = trendsQuery.isLoading;
  const isError = trendsQuery.isError;

  return (
    <WidgetContainer height={widgetHeight}>
      <FunctionTrendsWidgetHeader
        header={header}
        handleCursor={handleCursor}
        pageLinks={trendsQuery.getResponseHeader?.('Link') ?? null}
        trendType={trendType}
      />
      <ContentContainer>
        {isLoading && (
          <StatusContainer>
            <LoadingIndicator />
          </StatusContainer>
        )}
        {isError && (
          <StatusContainer>
            <IconWarning data-test-id="error-indicator" color="gray300" size="lg" />
          </StatusContainer>
        )}
        {!isError && !isLoading && !hasTrends && (
          <EmptyStateWarning>
            <p>{t('No functions found')}</p>
          </EmptyStateWarning>
        )}
        {hasTrends && (
          <Accordion>
            {(trendsQuery.data ?? []).map((f, i) => {
              return (
                <FunctionTrendsEntry
                  key={`${f.project}-${f.function}-${f.package}`}
                  trendFunction={trendFunction}
                  isExpanded={i === expandedIndex}
                  setExpanded={() => setExpandedIndex(i)}
                  func={f}
                />
              );
            })}
          </Accordion>
        )}
      </ContentContainer>
    </WidgetContainer>
  );
}

interface FunctionTrendsWidgetHeaderProps {
  handleCursor: CursorHandler;
  header: ReactNode;
  pageLinks: string | null;
  trendType: TrendType;
}

function FunctionTrendsWidgetHeader({
  handleCursor,
  header,
  pageLinks,
  trendType,
}: FunctionTrendsWidgetHeaderProps) {
  switch (trendType) {
    case 'regression':
      return (
        <HeaderContainer>
          {header ?? (
            <HeaderTitleLegend>{t('Most Regressed Functions')}</HeaderTitleLegend>
          )}
          <Subtitle>{t('Functions by most regressed.')}</Subtitle>
          <StyledPagination pageLinks={pageLinks} size="xs" onCursor={handleCursor} />
        </HeaderContainer>
      );
    case 'improvement':
      return (
        <HeaderContainer>
          {header ?? (
            <HeaderTitleLegend>{t('Most Improved Functions')}</HeaderTitleLegend>
          )}
          <Subtitle>{t('Functions by most improved.')}</Subtitle>
          <StyledPagination pageLinks={pageLinks} size="xs" onCursor={handleCursor} />
        </HeaderContainer>
      );
    default:
      throw new Error(t('Unknown trend type'));
  }
}

interface FunctionTrendsEntryProps {
  func: FunctionTrend;
  isExpanded: boolean;
  setExpanded: () => void;
  trendFunction: string;
}

function FunctionTrendsEntry({
  func,
  isExpanded,
  setExpanded,
  trendFunction,
}: FunctionTrendsEntryProps) {
  const organization = useOrganization();
  const {projects} = useProjects();
  const project = projects.find(p => p.id === func.project);

  let functionName = <Fragment>{func.function}</Fragment>;

  if (project && func['examples()'].length > 0) {
    const target = generateProfileFlamechartRouteWithQuery({
      orgSlug: organization.slug,
      projectSlug: project.slug,
      profileId: func['examples()'][0],
      query: {
        frameName: func.function as string,
        framePackage: func.package as string,
      },
    });

    functionName = <Link to={target}>{functionName}</Link>;
  }

  functionName = (
    <FunctionName>
      <Tooltip title={func.package}>{functionName}</Tooltip>
    </FunctionName>
  );

  return (
    <Fragment>
      <StyledAccordionItem>
        {project && (
          <Tooltip title={project.name}>
            <IdBadge project={project} avatarSize={16} hideName />
          </Tooltip>
        )}
        {functionName}
        <Tooltip
          title={tct('Appeared [count] times.', {
            count: <Count value={func['count()']} />,
          })}
        >
          <DurationChange>
            <PerformanceDuration nanoseconds={func.aggregate_range_1} abbreviation />
            <IconArrow direction="right" size="xs" />
            <PerformanceDuration nanoseconds={func.aggregate_range_2} abbreviation />
          </DurationChange>
        </Tooltip>
        <Button
          icon={<IconChevron size="xs" direction={isExpanded ? 'up' : 'down'} />}
          aria-label={t('Expand')}
          aria-expanded={isExpanded}
          size="zero"
          borderless
          onClick={() => setExpanded()}
        />
      </StyledAccordionItem>
      {isExpanded && (
        <FunctionTrendsChartContainer>
          <FunctionTrendsChart func={func} trendFunction={trendFunction} />
        </FunctionTrendsChartContainer>
      )}
    </Fragment>
  );
}

interface FunctionTrendsChartProps {
  func: FunctionTrend;
  trendFunction: string;
}

function FunctionTrendsChart({func, trendFunction}: FunctionTrendsChartProps) {
  const {selection} = usePageFilters();
  const router = useRouter();
  const theme = useTheme();

  const series: Series[] = useMemo(() => {
    const trendSeries = {
      data: func.stats.data.map(([timestamp, data]) => {
        return {
          name: timestamp * 1e3,
          value: data[0].count / 1e6,
        };
      }),
      seriesName: trendFunction,
      color: getTrendLineColor(func.change, theme),
    };

    const seriesStart = func.stats.data[0][0] * 1e3;
    const seriesMid = func.breakpoint * 1e3;
    const seriesEnd = func.stats.data[func.stats.data.length - 1][0] * 1e3;

    const dividingLine = {
      data: [],
      color: theme.textColor,
      seriesName: 'dividing line',
      markLine: {},
    };
    dividingLine.markLine = {
      data: [{xAxis: seriesMid}],
      label: {show: false},
      lineStyle: {
        color: theme.textColor,
        type: 'solid',
        width: 2,
      },
      symbol: ['none', 'none'],
      tooltip: {
        show: false,
      },
      silent: true,
    };

    const beforeLine = {
      data: [],
      color: theme.textColor,
      seriesName: 'before line',
      markLine: {},
    };
    beforeLine.markLine = {
      data: [
        [
          {value: 'Past', coord: [seriesStart, func.aggregate_range_1 / 1e6]},
          {coord: [seriesMid, func.aggregate_range_1 / 1e6]},
        ],
      ],
      label: {
        fontSize: 11,
        show: true,
        color: theme.textColor,
        silent: true,
        formatter: 'Past',
        position: 'insideStartTop',
      },
      lineStyle: {
        color: theme.textColor,
        type: 'dashed',
        width: 1,
      },
      symbol: ['none', 'none'],
      tooltip: {
        formatter: getTooltipFormatter(t('Past Baseline'), func.aggregate_range_1),
      },
    };

    const afterLine = {
      data: [],
      color: theme.textColor,
      seriesName: 'after line',
      markLine: {},
    };
    afterLine.markLine = {
      data: [
        [
          {
            value: 'Present',
            coord: [seriesMid, func.aggregate_range_2 / 1e6],
          },
          {coord: [seriesEnd, func.aggregate_range_2 / 1e6]},
        ],
      ],
      label: {
        fontSize: 11,
        show: true,
        color: theme.textColor,
        silent: true,
        formatter: 'Present',
        position: 'insideEndBottom',
      },
      lineStyle: {
        color: theme.textColor,
        type: 'dashed',
        width: 1,
      },
      symbol: ['none', 'none'],
      tooltip: {
        formatter: getTooltipFormatter(t('Present Baseline'), func.aggregate_range_2),
      },
    };

    return [trendSeries, dividingLine, beforeLine, afterLine];
  }, [func, trendFunction, theme]);

  const chartOptions = useMemo(() => {
    return {
      height: 150,
      grid: {
        top: '10px',
        bottom: '0px',
        left: '10px',
        right: '10px',
      },
      yAxis: {
        axisLabel: {
          color: theme.chartLabel,
          formatter: (value: number) => axisLabelFormatter(value, 'duration'),
        },
      },
      xAxis: {
        show: false,
      },
      tooltip: {
        valueFormatter: (value: number) => tooltipFormatter(value, 'duration'),
      },
    };
  }, [theme.chartLabel]);

  return (
    <ChartZoom router={router} {...selection.datetime}>
      {zoomRenderProps => (
        <LineChart {...zoomRenderProps} {...chartOptions} series={series} />
      )}
    </ChartZoom>
  );
}

function getTrendLineColor(trend: TrendType, theme: Theme) {
  switch (trend) {
    case 'improvement':
      return theme.green300;
    case 'regression':
      return theme.red300;
    default:
      throw new Error('Unknown trend type');
  }
}

function getTooltipFormatter(label: string, baseline: number) {
  return [
    '<div class="tooltip-series tooltip-series-solo">',
    '<div>',
    `<span class="tooltip-label"><strong>${label}</strong></span>`,
    tooltipFormatter(baseline / 1e6, 'duration'),
    '</div>',
    '</div>',
    '<div class="tooltip-arrow"></div>',
  ].join('');
}

const StyledPagination = styled(Pagination)`
  margin: 0;
`;

const StyledAccordionItem = styled(AccordionItem)`
  display: grid;
  grid-template-columns: auto 1fr auto auto;
`;

const FunctionName = styled(TextOverflow)`
  flex: 1 1 auto;
`;

const FunctionTrendsChartContainer = styled('div')`
  flex: 1 1 auto;
`;

const DurationChange = styled('span')`
  color: ${p => p.theme.gray300};
  display: flex;
  align-items: center;
  gap: ${space(1)};
`;
