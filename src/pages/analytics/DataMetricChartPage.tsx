import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Bell, ChevronDown, Download, TrendingUp } from 'lucide-react';
import { useDataMetricTimeseries, useDataMetricInfo, type GranularityOption } from '@/features/dataMetrics/api/useDataMetrics';
import { useIndicatorSeries } from '@/features/dataMetrics/api/useIndicators';
import type { TimeseriesDataPoint } from '@/types/metricsData';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChartSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { EChart } from '@/components/charts/EChart';
import { ExportFormat } from '@/utils/chartExport';
import { useResponsive } from '@/hooks/useResponsive';

/** Normalizes a timeseries point's timestamp to Unix milliseconds. */
const toMillis = (timestamp: TimeseriesDataPoint['timestamp']): number => {
  if (typeof timestamp === 'string') return new Date(timestamp).getTime();
  if (typeof timestamp === 'number') {
    return timestamp.toString().length <= 10 ? timestamp * 1000 : timestamp;
  }
  return NaN;
};

/**
 * Granularity options for the timeseries data
 */
const granularityOptions: { value: GranularityOption; label: string; description: string }[] = [
  { value: 'blocks', label: 'Blocks', description: 'Per block granularity' },
  { value: 'hours', label: 'Hours', description: 'Hourly aggregated data' },
  { value: 'days', label: 'Days', description: 'Daily aggregated data' },
];

/**
 * Technical indicators options
 */
const technicalIndicators = [
  { value: 'sma_7', label: 'SMA (7)', description: '7-period Simple Moving Average' },
  { value: 'sma_30', label: 'SMA (30)', description: '30-period Simple Moving Average' },
  { value: 'ema_7', label: 'EMA (7)', description: '7-period Exponential Moving Average' },
  { value: 'ema_30', label: 'EMA (30)', description: '30-period Exponential Moving Average' },
];

/**
 * Component to display a chart for a selected data metric.
 * It fetches metric information and timeseries data based on the metricId from the URL.
 */
const DataMetricChartPage: React.FC = () => {
  const { metricId } = useParams<{ metricId: string }>();
  const { isMobile } = useResponsive();

  const [selectedGranularity, setSelectedGranularity] = useState<GranularityOption>('days');
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [indicatorsDropdownOpen, setIndicatorsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: metricInfo, isLoading: isLoadingInfo, error: errorInfo } = useDataMetricInfo(metricId ?? null);
  const { data: timeseriesData, isLoading: isLoadingData, error: errorData } = useDataMetricTimeseries(
    metricId ?? null,
    selectedGranularity
  );
  const { series: indicatorSeries } = useIndicatorSeries(
    metricId ?? null,
    selectedGranularity,
    selectedIndicators
  );

  const handleCreateAlert = () => {
    if (metricId) {
      console.log('Create alert for metric:', metricId);
      // TODO: Implement navigation to alerts page with pre-filled metric ID
    }
  };

  const handleIndicatorToggle = (indicator: string) => {
    setSelectedIndicators(prev =>
      prev.includes(indicator)
        ? prev.filter(ind => ind !== indicator)
        : [...prev, indicator]
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIndicatorsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handler for chart export
  const handleChartExport = async (format: ExportFormat) => {
    if (format === 'csv' && timeseriesData) {
      const csvContent = [
        ['Time', 'Value', 'Block Number'].join(','),
        ...timeseriesData.map(point => [
          new Date(toMillis(point.timestamp)).toISOString(),
          point.value,
          point.blockNumber || ''
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${metricInfo?.MetricName || 'metric'}_data.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      throw new Error(`${format} export not yet implemented for this chart type`);
    }
  };

  // Block numbers by timestamp for tooltip enrichment
  const blockByTime = useMemo(() => {
    const map = new Map<number, number>();
    timeseriesData?.forEach((p) => {
      if (p.blockNumber !== undefined) map.set(toMillis(p.timestamp), p.blockNumber);
    });
    return map;
  }, [timeseriesData]);

  const chartOption = useMemo(() => {
    const seriesData = (timeseriesData ?? [])
      .map((p) => [toMillis(p.timestamp), p.value] as [number, number])
      .filter(([t]) => !isNaN(t));

    return {
      title: {
        text: metricInfo?.MetricName || (metricId ? `Metric ID: ${metricId}` : ''),
        subtext: metricInfo?.Description || 'Timeseries data',
        left: 8,
      },
      grid: { left: 56, right: 24, top: 72, bottom: 64 },
      xAxis: { type: 'time', name: '' },
      yAxis: { type: 'value', scale: true, name: '' },
      tooltip: {
        trigger: 'axis',
        formatter: (params: Array<{ value: [number, number]; seriesName: string }>) => {
          const point = params[0];
          if (!point) return '';
          const [t, v] = point.value;
          const block = blockByTime.get(t);
          const time = new Date(t).toLocaleString();
          return [
            `<b>${point.seriesName}</b>`,
            `Time: ${time}`,
            `Value: ${v}`,
            block !== undefined ? `Block: ${block}` : '',
          ].filter(Boolean).join('<br/>');
        },
      },
      dataZoom: [
        { type: 'inside', throttle: 50 },
        { type: 'slider', height: 20, bottom: 12 },
      ],
      legend: { show: indicatorSeries.length > 0, top: 40, left: 8 },
      series: [
        {
          type: 'line',
          name: metricInfo?.MetricName || 'Metric Value',
          data: seriesData,
          showSymbol: seriesData.length < 100,
          smooth: false,
          areaStyle: { opacity: 0.08 },
          lineStyle: { width: 1.5 },
        },
        ...indicatorSeries.map((ind) => ({
          type: 'line' as const,
          name: ind.label,
          data: ind.points,
          showSymbol: false,
          smooth: true,
          lineStyle: { width: 1, type: 'dashed' as const },
        })),
      ],
    };
  }, [timeseriesData, metricInfo, metricId, blockByTime, indicatorSeries]);

  // Handle loading states
  if (isLoadingInfo || isLoadingData) {
    return (
      <div className="p-4 md:p-6 h-full">
        <Card className="h-full flex flex-col" hover={false}>
          <div className="p-3 border-b border-border space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="text-sm">
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-16" />
                  <div className="flex gap-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-6 w-12 rounded" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-20 rounded" />
                </div>
                <Skeleton className="h-8 w-16 rounded" />
              </div>
            </div>
          </div>
          <div className="flex-1 p-2 md:p-4 min-h-0">
            <ChartSkeleton className="h-full" />
          </div>
        </Card>
      </div>
    );
  }

  // Handle error states
  if (errorInfo) {
    return (
      <div className="p-6 text-error text-center">
        <h2 className="text-xl font-bold mb-2">Error Loading Metric Information</h2>
        <p>{errorInfo.message}</p>
      </div>
    );
  }

  if (errorData) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-2 text-error">Error Loading Chart Data</h2>
        <p className="text-error/80">{errorData.message}</p>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-text-secondary">Try selecting a different granularity:</p>
          <div className="flex gap-2 justify-center">
            {granularityOptions.map((option) => (
              <Button
                key={option.value}
                size="sm"
                variant={selectedGranularity === option.value ? 'primary' : 'outline'}
                onClick={() => setSelectedGranularity(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metricId) {
    return (
      <div className="p-6 text-text-secondary text-center">
        <h2 className="text-xl font-bold mb-2 text-text">No Metric Selected</h2>
        <p>Please select a metric from the sidebar to view its chart.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <Card className="h-full flex flex-col min-h-[calc(100vh-12rem)]" hover={false}>

          {/* Header with metric info and controls */}
          {metricInfo && (
            <div className="p-3 border-b border-border space-y-3">
              <div className={`text-sm text-text-secondary ${isMobile ? 'text-xs' : ''}`}>
                <div className={isMobile ? 'space-y-1' : ''}>
                  <span className="font-medium text-text">Blockchain:</span> {metricInfo.Blockchain}
                  {!isMobile && ' · '}
                  {isMobile && <br />}
                  <span className="font-medium text-text">Source:</span> {metricInfo.DataSourceType}
                  {!isMobile && ' · '}
                  {isMobile && <br />}
                  <span className="font-medium text-text">ID:</span>{' '}
                  <span className="font-mono">{metricInfo.MetricID}</span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Technical Indicators */}
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-text-secondary min-w-max">
                    Indicators:
                  </label>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIndicatorsDropdownOpen(!indicatorsDropdownOpen)}
                      aria-haspopup="listbox"
                      aria-expanded={indicatorsDropdownOpen}
                      className="flex items-center justify-between gap-2 bg-surface-2 border border-border text-text rounded-lg px-3 py-2 text-sm hover:border-primary/50 transition-colors min-w-[140px] h-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>{selectedIndicators.length === 0 ? 'None' : `${selectedIndicators.length} selected`}</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-text-secondary transition-transform ${indicatorsDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {indicatorsDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-50 min-w-[220px]">
                        {technicalIndicators.map((indicator) => (
                          <label
                            key={indicator.value}
                            className="flex items-center gap-3 p-3 hover:bg-surface-2 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedIndicators.includes(indicator.value)}
                              onChange={() => handleIndicatorToggle(indicator.value)}
                              className="w-4 h-4 accent-[var(--color-primary)] rounded"
                            />
                            <div>
                              <div className="text-sm text-text font-medium">{indicator.label}</div>
                              <div className="text-xs text-text-secondary">{indicator.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Granularity and Actions */}
                <div className="flex items-center gap-3 lg:ml-auto">
                  <div className="flex items-center gap-2">
                    <label htmlFor="granularity-select" className="text-sm font-medium text-text-secondary min-w-max">
                      Granularity:
                    </label>
                    <div className="relative">
                      <select
                        id="granularity-select"
                        value={selectedGranularity}
                        onChange={(e) => setSelectedGranularity(e.target.value as GranularityOption)}
                        className="bg-surface-2 border border-border text-text rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 hover:border-primary/50 transition-colors min-w-[100px] h-10 appearance-none cursor-pointer"
                        title="Select data aggregation level"
                      >
                        {granularityOptions.map((option) => (
                          <option key={option.value} value={option.value} title={option.description}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <Button variant="outline" size="sm" onClick={handleCreateAlert} title="Create alert for this metric">
                      <Bell className="h-4 w-4 mr-2" />
                      Alert
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleChartExport('csv')}
                      title="Export chart data as CSV"
                      disabled={!timeseriesData || timeseriesData.length === 0}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chart Area */}
          <div className="flex-1 p-2 md:p-4 min-h-0">
            {timeseriesData && timeseriesData.length > 0 ? (
              <div className="h-full min-h-[400px]">
                <EChart option={chartOption} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-text-secondary text-xl mb-2">
                    {isLoadingData ? 'Loading data...' : 'No data available for this metric.'}
                  </p>
                  {!isLoadingData && (
                    <p className="text-text-secondary/70 text-sm">
                      Try selecting a different granularity option above.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DataMetricChartPage;
