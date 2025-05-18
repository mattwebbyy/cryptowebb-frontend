import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useDataMetricTimeseries, useDataMetricInfo, type GranularityOption } from '@/features/dataMetrics/api/useDataMetrics';
import type { TimeseriesDataPoint, DataMetricInfo } from '@/types/metricsData';
import { MatrixLoader } from '@/components/ui/MatrixLoader';
import { Card } from '@/components/ui/Card';

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
 * Component to display a chart for a selected data metric.
 * It fetches metric information and timeseries data based on the metricId from the URL.
 */
const DataMetricChartPage: React.FC = () => {
  // Get the metricId from URL parameters
  const { metricId } = useParams<{ metricId: string }>();
  
  // State for granularity selection
  const [selectedGranularity, setSelectedGranularity] = useState<GranularityOption>('days');

  // Fetch metric information using the custom hook
  const { data: metricInfo, isLoading: isLoadingInfo, error: errorInfo } = useDataMetricInfo(metricId ?? null);
  
  // Fetch timeseries data for the metric using the custom hook with granularity
  const { data: timeseriesData, isLoading: isLoadingData, error: errorData } = useDataMetricTimeseries(
    metricId ?? null, 
    selectedGranularity
  );

  // Handle loading states
  if (isLoadingInfo || isLoadingData) {
    return (
      <div className="h-full flex items-center justify-center">
        <MatrixLoader />
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
                    ? 'bg-matrix-green text-black'
                    : 'bg-matrix-green/20 text-matrix-green hover:bg-matrix-green/30'
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
      <div className="p-6 text-matrix-green/70 text-center">
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
        color: '#00FF00',
      },
      zooming: {
        type: 'x'
      },
      height: 500,
    },
    title: {
      text: metricInfo?.MetricName || `Metric ID: ${metricId}`,
      style: { color: '#33FF33', fontSize: '1.5em' },
    },
    subtitle: {
      text: metricInfo?.Description || 'Timeseries data',
      style: { color: '#33FF33', fontSize: '0.9em' }
    },
    xAxis: {
      type: 'datetime',
      labels: { 
        style: { color: '#00FF00' },
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
      lineColor: '#00FF00',
      tickColor: '#00FF00',
      title: {
        text: 'Time',
        style: { color: '#00FF00' }
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
      title: { text: 'Value', style: { color: '#00FF00' } },
      labels: { style: { color: '#00FF00' } },
      gridLineColor: 'rgba(0, 255, 0, 0.2)',
    },
    series: transformTimeseriesForHighcharts(timeseriesData, metricInfo?.MetricName),
    credits: { enabled: false },
    legend: {
      enabled: true,
      itemStyle: { color: '#00FF00' },
      itemHoverStyle: { color: '#33FF33' },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      style: { color: '#00FF00' },
      borderWidth: 1,
      borderColor: '#00FF00',
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
    <div className="p-4 md:p-6 h-full text-matrix-green">
      <Card className="h-full flex flex-col bg-black/70 border border-matrix-green/50 shadow-lg shadow-matrix-green/30">
        {/* Header with metric info and controls */}
        {metricInfo && (
          <div className="p-3 border-b border-matrix-green/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-matrix-green/80">
                <span className="font-semibold">Blockchain:</span> {metricInfo.Blockchain} | 
                <span className="font-semibold"> Source:</span> {metricInfo.DataSourceType} |
                <span className="font-semibold"> ID:</span> {metricInfo.MetricID}
              </div>
              
              {/* Granularity Selector */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-matrix-green/80">
                  Granularity:
                </label>
                <select
                  value={selectedGranularity}
                  onChange={(e) => setSelectedGranularity(e.target.value as GranularityOption)}
                  className="bg-black/50 border border-matrix-green/50 text-matrix-green rounded px-3 py-1 text-sm focus:outline-none focus:border-matrix-green hover:bg-matrix-green/10 transition-colors"
                  title="Select data aggregation level"
                >
                  {granularityOptions.map((option) => (
                    <option key={option.value} value={option.value} title={option.description}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
                <p className="text-matrix-green/70 text-xl mb-2">
                  {isLoadingData ? 'Loading data...' : 'No data available for this metric.'}
                </p>
                {!isLoadingData && (
                  <p className="text-matrix-green/50 text-sm">
                    Try selecting a different granularity option above.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DataMetricChartPage;