import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Bell, ChevronDown, TrendingUp } from 'lucide-react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useDataMetricTimeseries, useDataMetricInfo, type GranularityOption } from '@/features/dataMetrics/api/useDataMetrics';
import type { TimeseriesDataPoint, DataMetricInfo } from '@/types/metricsData';
import { MatrixLoader } from '@/components/ui/MatrixLoader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChartSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { ChartExportButton } from '@/components/ui/ChartExportButton';
import { ExportFormat } from '@/utils/chartExport';
import { useResponsive } from '@/hooks/useResponsive';

/**
 * Transforms timeseries data into a format suitable for Highcharts.
 * @param data - The array of TimeseriesDataPoint.
 * @param metricName - The name of the metric for the series.
 * @returns An array of Highcharts series options.
 */
const transformTimeseriesForHighcharts = (
  data: TimeseriesDataPoint[] | undefined,
  metricName?: string
): Highcharts.SeriesOptionsType[] => {
  if (!data || data.length === 0) {
    return [];
  }

  // Debug the timestamp format
  console.log('First data point:', data[0]);
  console.log('Timestamp type:', typeof data[0].timestamp);
  console.log('Timestamp value:', data[0].timestamp);

  return [{
    type: 'line',
    name: metricName || 'Metric Value',
    data: data.map(point => {
      let timestamp: number;
      
      if (typeof point.timestamp === 'string') {
        // If it's a string, parse it as a date
        timestamp = new Date(point.timestamp).getTime();
      } else if (typeof point.timestamp === 'number') {
        // If it's a number, check if it's in seconds or milliseconds
        // Unix timestamps in seconds are typically 10 digits
        // Unix timestamps in milliseconds are typically 13 digits
        if (point.timestamp.toString().length <= 10) {
          // It's in seconds, convert to milliseconds
          timestamp = point.timestamp * 1000;
        } else {
          // It's already in milliseconds
          timestamp = point.timestamp;
        }
      } else {
        // Fallback - treat as current time
        console.warn('Invalid timestamp format:', point.timestamp);
        timestamp = Date.now();
      }
      
      console.log(`Original: ${point.timestamp} -> Converted: ${timestamp} -> Date: ${new Date(timestamp).toISOString()}`);
      
      return [timestamp, point.value];
    }),
    turboThreshold: 5000,
    marker: {
      enabled: data.length < 100,
    }
  }];
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
  // Get the metricId from URL parameters
  const { metricId } = useParams<{ metricId: string }>();
  const { isMobile, isTablet } = useResponsive();
  
  // State for granularity selection
  const [selectedGranularity, setSelectedGranularity] = useState<GranularityOption>('days');
  
  // State for technical indicators
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [indicatorsDropdownOpen, setIndicatorsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch metric information using the custom hook
  const { data: metricInfo, isLoading: isLoadingInfo, error: errorInfo } = useDataMetricInfo(metricId ?? null);
  
  // Fetch timeseries data for the metric using the custom hook with granularity
  const { data: timeseriesData, isLoading: isLoadingData, error: errorData } = useDataMetricTimeseries(
    metricId ?? null, 
    selectedGranularity
  );

  // Handler for creating alert
  const handleCreateAlert = () => {
    if (metricId) {
      // Navigate to alerts page or open modal - for now just log
      console.log('Create alert for metric:', metricId);
      // TODO: Implement navigation to alerts page with pre-filled metric ID
    }
  };

  // Handler for toggling technical indicators
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
    // For standalone chart page, we'll implement a direct export
    // In the future, this could be enhanced to use a chart ref
    console.log(`Exporting chart as ${format}`);
    
    if (format === 'csv' && timeseriesData) {
      // Simple CSV export for timeseries data
      const csvContent = [
        ['Time', 'Value', 'Block Number'].join(','),
        ...timeseriesData.map(point => [
          new Date(point.timestamp).toISOString(),
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
      // For image/PDF exports, we'd need to integrate with Highcharts export
      throw new Error(`${format} export not yet implemented for this chart type`);
    }
  };

  // Handle loading states
  if (isLoadingInfo || isLoadingData) {
    return (
      <div className="p-4 md:p-6 h-full text-primary">
        <Card className="h-full flex flex-col bg-black/70 border border-primary/50 shadow-lg shadow-primary/30">
          {/* Header skeleton */}
          <div className="p-3 border-b border-primary/30 space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="text-sm text-primary/80">
                <Skeleton className="h-4 w-64" />
              </div>
              
              {/* Controls skeleton */}
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
          
          {/* Chart area skeleton */}
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
      <div className="p-6 text-red-500 text-center">
        <h2 className="text-xl font-bold mb-2">Error Loading Metric Information</h2>
        <p>{errorInfo.message}</p>
        <details className="mt-4 text-left">
          <summary className="cursor-pointer">Error Details</summary>
          <pre className="mt-2 p-2 bg-red-50 rounded text-sm overflow-auto">
            {JSON.stringify(errorInfo, null, 2)}
          </pre>
        </details>
      </div>
    );
  }
  
  if (errorData) {
    return (
      <div className="p-6 text-red-500 text-center">
        <h2 className="text-xl font-bold mb-2">Error Loading Chart Data</h2>
        <p>{errorData.message}</p>
        <div className="mt-4 space-y-2">
          <p className="text-sm">Try selecting a different granularity:</p>
          <div className="flex gap-2 justify-center">
            {granularityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedGranularity(option.value)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  selectedGranularity === option.value
                    ? 'bg-primary text-black'
                    : 'bg-primary/20 text-primary hover:bg-primary/30'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <details className="mt-4 text-left">
          <summary className="cursor-pointer">Error Details</summary>
          <pre className="mt-2 p-2 bg-red-50 rounded text-sm overflow-auto">
            {JSON.stringify(errorData, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  // If metricId is not present
  if (!metricId) {
    return (
      <div className="p-6 text-primary/70 text-center">
        <h2 className="text-xl font-bold mb-2">No Metric Selected</h2>
        <p>Please select a metric from the sidebar to view its chart.</p>
      </div>
    );
  }

  // Prepare Highcharts options
  const chartOptions: Highcharts.Options = {
    chart: {
      backgroundColor: 'transparent',
      style: {
        fontFamily: '"Courier New", Courier, monospace',
        color: 'var(--color-primary)',
      },
      zooming: {
        type: 'x'
      },
      height: 500,
    },
    title: {
      text: metricInfo?.MetricName || `Metric ID: ${metricId}`,
      style: { color: 'var(--color-primary)', fontSize: '1.5em' },
    },
    subtitle: {
      text: metricInfo?.Description || 'Timeseries data',
      style: { color: 'var(--color-primary)', fontSize: '0.9em' }
    },
    xAxis: {
      type: 'datetime',
      labels: { 
        style: { color: 'var(--color-primary)' },
        formatter: function() {
          // Format the date labels properly
          // Ensure this.value is a number for dateFormat
          const timestamp = typeof this.value === 'number' ? this.value : Number(this.value);
          
          if (selectedGranularity === 'blocks') {
            return Highcharts.dateFormat('%b %d %H:%M', timestamp);
          } else if (selectedGranularity === 'hours') {
            return Highcharts.dateFormat('%b %d %H:%M', timestamp);
          } else {
            return Highcharts.dateFormat('%b %d %Y', timestamp);
          }
        }
      },
      lineColor: 'var(--color-primary)',
      tickColor: 'var(--color-primary)',
      title: {
        text: 'Time',
        style: { color: 'var(--color-primary)' }
      },
      // Add these properties to improve X-axis handling
      dateTimeLabelFormats: {
        millisecond: '%H:%M:%S.%L',
        second: '%H:%M:%S',
        minute: '%H:%M',
        hour: '%H:%M',
        day: '%b %e',
        week: '%b %e',
        month: '%b %Y',
        year: '%Y'
      }
    },
    yAxis: {
      title: { text: 'Value', style: { color: 'var(--color-primary)' } },
      labels: { style: { color: 'var(--color-primary)' } },
      gridLineColor: 'var(--color-primary-muted)',
    },
    series: transformTimeseriesForHighcharts(timeseriesData, metricInfo?.MetricName),
    credits: { enabled: false },
    legend: {
      enabled: true,
      itemStyle: { color: 'var(--color-primary)' },
      itemHoverStyle: { color: 'var(--color-primary)' },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      style: { color: 'var(--color-primary)' },
      borderWidth: 1,
      borderColor: 'var(--color-primary)',
      formatter: function () {
        const originalDataPoint = timeseriesData?.find(dp => {
          let dpTime: number;
          
          if (typeof dp.timestamp === 'string') {
            dpTime = new Date(dp.timestamp).getTime();
          } else if (typeof dp.timestamp === 'number') {
            dpTime = dp.timestamp.toString().length <= 10 
              ? dp.timestamp * 1000 
              : dp.timestamp;
          } else {
            dpTime = 0;
          }
          
          return dpTime === this.x && dp.value === this.y;
        });
        
        let tooltipHtml = `<b>${this.series.name}</b><br/>`;
        tooltipHtml += `Time: ${Highcharts.dateFormat('%A, %b %e, %Y %H:%M:%S', this.x ?? 0)}<br/>`;
        tooltipHtml += `Value: ${this.y}`;
        
        if (originalDataPoint?.blockNumber !== undefined) {
          tooltipHtml += `<br/>Block: ${originalDataPoint.blockNumber}`;
        }
        
        return tooltipHtml;
      }
    },
    plotOptions: {
      line: {
        animation: {
          duration: 1000
        }
      }
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden text-primary">
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <Card className="h-full flex flex-col bg-black/70 border border-primary/50 shadow-lg shadow-primary/30 min-h-[calc(100vh-12rem)]">
        
        {/* Header with metric info and controls */}
        {metricInfo && (
          <div className="p-3 border-b border-primary/30 space-y-3">
            {/* Metric Info Row */}
            <div className={`text-sm text-primary/80 ${isMobile ? 'text-xs' : ''}`}>
              <div className={isMobile ? 'space-y-1' : ''}>
                <span className="font-semibold">Blockchain:</span> {metricInfo.Blockchain}
                {!isMobile && ' | '}
                {isMobile && <br />}
                <span className="font-semibold">Source:</span> {metricInfo.DataSourceType}
                {!isMobile && ' | '}
                {isMobile && <br />}
                <span className="font-semibold">ID:</span> {metricInfo.MetricID}
              </div>
            </div>
            
            {/* Controls Row - Consistent sizing and clean layout */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Left side - Technical Indicators */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-primary/80 min-w-max">
                  Technical Indicators:
                </label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIndicatorsDropdownOpen(!indicatorsDropdownOpen)}
                    className="flex items-center justify-between gap-2 bg-black/50 border border-primary/50 text-primary rounded px-3 py-2 pr-3 text-sm hover:bg-primary/10 transition-colors min-w-[140px] h-10"
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>{selectedIndicators.length === 0 ? 'None' : `${selectedIndicators.length} selected`}</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-primary/60 transition-transform ${indicatorsDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {indicatorsDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-black/90 border border-primary/50 rounded shadow-lg shadow-primary/20 z-50 min-w-[200px]">
                      {technicalIndicators.map((indicator) => (
                        <label
                          key={indicator.value}
                          className="flex items-center gap-3 p-3 hover:bg-primary/10 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedIndicators.includes(indicator.value)}
                            onChange={() => handleIndicatorToggle(indicator.value)}
                            className="w-4 h-4 text-primary bg-black border-primary/50 rounded focus:ring-primary focus:ring-2"
                          />
                          <div>
                            <div className="text-sm text-primary font-medium">{indicator.label}</div>
                            <div className="text-xs text-primary/60">{indicator.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right side - Granularity and Actions */}
              <div className="flex items-center gap-3 lg:ml-auto">
                {/* Granularity Selector */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-primary/80 min-w-max">
                    Granularity:
                  </label>
                  <div className="relative">
                    <select
                      value={selectedGranularity}
                      onChange={(e) => setSelectedGranularity(e.target.value as GranularityOption)}
                      className="bg-black/50 border border-primary/50 text-primary rounded px-3 py-2 pr-8 text-sm focus:outline-none focus:border-primary hover:bg-primary/10 transition-colors min-w-[100px] h-10 appearance-none cursor-pointer"
                      title="Select data aggregation level"
                      style={{
                        backgroundImage: 'none'
                      }}
                    >
                      {granularityOptions.map((option) => (
                        <option key={option.value} value={option.value} title={option.description} className="bg-black text-primary">
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/60 pointer-events-none" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 items-center">
                  {/* Create Alert Button */}
                  <button
                    onClick={handleCreateAlert}
                    className="bg-primary/10 text-primary border border-primary/50 hover:bg-primary/20 h-10 px-3 text-sm font-mono transition-all duration-300 flex items-center justify-center rounded"
                    title="Create alert for this metric"
                  >
                    <Bell className="h-4 w-4 flex-shrink-0" />
                    <span className="ml-2 leading-none">Alert</span>
                  </button>

                  {/* Export Button - Make it identical */}
                  <button
                    onClick={() => handleChartExport('csv')} // Export as CSV
                    className="bg-primary/10 text-primary border border-primary/50 hover:bg-primary/20 h-10 px-3 text-sm font-mono transition-all duration-300 flex items-center justify-center rounded"
                    title="Export Chart"
                    disabled={!timeseriesData || timeseriesData.length === 0}
                  >
                    <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="ml-2 leading-none">Export</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Chart Area */}
        <div className="flex-1 p-2 md:p-4 min-h-0">
          {timeseriesData && timeseriesData.length > 0 ? (
            <div className="h-full">
              <HighchartsReact 
                highcharts={Highcharts} 
                options={chartOptions}
                containerProps={{ style: { height: '100%', width: '100%' } }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-primary/70 text-xl mb-2">
                  {isLoadingData ? 'Loading data...' : 'No data available for this metric.'}
                </p>
                {!isLoadingData && (
                  <p className="text-primary/50 text-sm">
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