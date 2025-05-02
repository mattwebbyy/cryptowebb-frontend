// ChartRenderer.tsx - Complete file

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useChartData, ChartData, ChartDataRow } from '../api/useChartData';
import { WebSocketUpdate } from '@/types/data';
import { Card } from '@/components/ui/Card';
import { useWebSocket } from '@/hooks/useWebSocket';
import { debounce } from 'lodash';

export interface ChartRendererRef {
  getChart: () => Highcharts.Chart | undefined;
  reflow: () => void;
  updateSize: (width: number, height: number) => void;
}

interface ChartRendererProps {
  chartId: string;
  chartType: 'line' | 'bar' | 'pie' | 'number' | 'table';
  title?: string;
  isLive?: boolean;
  // Grid dimensions
  gridWidth?: number;
  gridHeight?: number;
}

// Data transformation logic
const transformDataForHighcharts = (
  data: ChartData | undefined | null,
  chartType: ChartRendererProps['chartType'],
  title?: string
): Highcharts.SeriesOptionsType[] => {
  if (!data || data.length === 0) return [];

  const keys = Object.keys(data[0]);
  const xKey =
    keys.find((k: string) =>
      ['time', 'date', 'timestamp', 'category', 'name', 'label'].includes(k.toLowerCase())
    ) || keys[0];
  const numericKeys = keys.filter(
    (k: string) => k !== xKey && typeof data[0]?.[k] === 'number' && !k.toLowerCase().endsWith('id')
  );
  const isTimeBased = xKey.toLowerCase().includes('time') || xKey.toLowerCase().includes('date');

  const getXValue = (row: ChartDataRow): number | string => {
    const rawValue: any = row[xKey];
    if (isTimeBased) {
      const date = new Date(rawValue as string | number | Date);
      return isNaN(date.getTime()) ? String(rawValue) : date.getTime();
    }
    return String(rawValue);
  };

  switch (chartType) {
    case 'line':
    case 'bar':
      return numericKeys.map(
        (valueKey: string): Highcharts.SeriesLineOptions | Highcharts.SeriesColumnOptions => ({
          type: chartType === 'line' ? 'line' : 'column',
          name: valueKey,
          data: data.map((row: ChartDataRow): [number | string, number | null] => [
            getXValue(row),
            row[valueKey] as number | null,
          ]),
          turboThreshold: 5000,
        })
      );
    case 'pie':
      const nameKeyPie = keys.find((k: string) => typeof data[0]?.[k] === 'string') || 'name';
      const valueKeyPie = numericKeys[0] || 'value';
      if (!valueKeyPie) return [];
      return [
        {
          type: 'pie',
          name: title || 'Segments',
          data: data.map(
            (row: ChartDataRow): Highcharts.PointOptionsObject => ({
              name: String(row[nameKeyPie] ?? 'Unknown'),
              y: row[valueKeyPie] as number | null,
            })
          ),
        },
      ];
    default:
      return [];
  }
};

export const ChartRenderer = forwardRef<ChartRendererRef, ChartRendererProps>(
  ({ chartId, chartType, title, isLive = false, gridWidth, gridHeight }, ref) => {
    const {
      data: initialData,
      isLoading: isLoadingInitial,
      error,
      refetch,
    } = useChartData(chartId);
    const [liveChartData, setLiveChartData] = useState<ChartData | null>(null);

    // References
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Mounted ref
    const isMountedRef = useRef(true);
    useEffect(() => {
      return () => {
        isMountedRef.current = false;
      };
    }, []);

    // Function to update chart dimensions
    const updateChartSize = useCallback(() => {
      if (!chartComponentRef.current?.chart || !containerRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // Only update if there are actual dimensions to use
      if (containerWidth > 0 && containerHeight > 0) {
        // Adjust for padding and margins
        const chart = chartComponentRef.current.chart;
        // Use slightly smaller size to ensure it fits within container
        chart.setSize(containerWidth - 10, containerHeight - (title ? 40 : 10), false);
        console.log(`Chart ${chartId} sized to ${containerWidth}x${containerHeight}`);
      }
    }, [chartId, title]);

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        getChart: () => chartComponentRef.current?.chart,
        reflow: () => {
          if (chartComponentRef.current?.chart) {
            chartComponentRef.current.chart.reflow();
            console.log(`Reflow triggered for chart: ${chartId}`);
          }
        },
        updateSize: (width: number, height: number) => {
          if (chartComponentRef.current?.chart) {
            const chart = chartComponentRef.current.chart;
            // Use slightly smaller dimensions to account for padding
            chart.setSize(Math.max(0, width - 10), Math.max(0, height - (title ? 40 : 10)), false);
            console.log(`Explicit size update for chart ${chartId}: ${width}x${height}`);
          }
        },
      }),
      [chartId, title]
    );

    // Combine data
    const displayData = useMemo(() => liveChartData ?? initialData, [liveChartData, initialData]);

    // WebSocket setup for live charts
    const wsUrl = useMemo(() => {
      if (!isLive) return null;
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
      const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const wsBaseUrl = backendUrl.replace(/^http/, wsProtocol);
      return `${wsBaseUrl}/ws/live/${chartId}`;
    }, [isLive, chartId]);

    // WebSocket message handler
    const handleWebSocketMessage = useCallback(
      (wsUpdate: WebSocketUpdate) => {
        if (!isMountedRef.current) return;
        console.log(`WebSocket (${chartId}): Received update`, wsUpdate);
        if (wsUpdate.chartId !== chartId) return;

        setLiveChartData((currentData) => {
          const baseData: ChartData = currentData ?? initialData ?? [];
          const payload = wsUpdate.payload;

          switch (wsUpdate.type) {
            case 'APPEND':
              const pointsToAdd: ChartData = Array.isArray(payload)
                ? payload
                : [payload as ChartDataRow];
              if (pointsToAdd.length === 0) return baseData;
              return [...baseData, ...pointsToAdd];
            case 'REPLACE':
              return Array.isArray(payload) ? payload : [];
            case 'UPDATE':
              console.warn('WebSocket UPDATE strategy not fully implemented');
              return baseData;
            default:
              console.warn(`Unknown update type: ${wsUpdate.type}`);
              return baseData;
          }
        });
      },
      [chartId, initialData]
    );

    const { isConnected: isWsConnected } = useWebSocket<WebSocketUpdate>(
      wsUrl,
      handleWebSocketMessage,
      {
        onOpen: () => console.log(`WebSocket connected for chart ${chartId}`),
        onError: (err: Event) => console.error(`WebSocket error for chart ${chartId}:`, err),
        shouldReconnect: () => !!isLive,
      }
    );

    // Effect to handle sizing after render and on dimension changes
    useEffect(() => {
      if (!isMountedRef.current) return;

      // Update chart size when grid dimensions change
      if (gridWidth && gridHeight && chartComponentRef.current?.chart) {
        const chart = chartComponentRef.current.chart;
        // Adjust for title and padding
        const adjustedHeight = gridHeight - (title ? 40 : 10);
        chart.setSize(gridWidth - 10, adjustedHeight, false);
        console.log(`Chart ${chartId} sized to grid: ${gridWidth}x${gridHeight}`);
      }

      // Use ResizeObserver for more reliable size detection
      const resizeObserver = new ResizeObserver(
        debounce(() => {
          if (!isMountedRef.current) return;
          updateChartSize();
        }, 100)
      );

      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      // Initial sizing with slight delay to ensure container is rendered
      const initialSizeTimeout = setTimeout(() => {
        if (isMountedRef.current) {
          updateChartSize();
        }
      }, 50);

      return () => {
        resizeObserver.disconnect();
        clearTimeout(initialSizeTimeout);
      };
    }, [chartId, gridWidth, gridHeight, title, updateChartSize]);

    // Chart options
    const chartOptions: Highcharts.Options = useMemo(() => {
      const series = transformDataForHighcharts(displayData, chartType, title);

      return {
        chart: {
          backgroundColor: 'transparent',
          animation: false, // Disable animation for better sizing
          styledMode: false,
          spacing: [5, 5, 5, 5], // Minimal spacing to maximize chart area
          // Don't set explicit dimensions here - we'll control them via setSize
        },
        title: { text: undefined }, // Handle title outside of Highcharts
        series: series,
        xAxis: {
          type: 'datetime',
          labels: { style: { color: 'rgba(51, 255, 51, 0.7)' } },
          lineColor: 'rgba(51, 255, 51, 0.3)',
          tickColor: 'rgba(51, 255, 51, 0.3)',
        },
        yAxis: {
          title: { text: '' },
          gridLineColor: 'rgba(51, 255, 51, 0.1)',
          labels: { style: { color: 'rgba(51, 255, 51, 0.7)' } },
        },
        plotOptions: {
          series: {
            animation: false, // Disable animation for better resizing
            marker: {
              enabled: chartType === 'line',
              radius: 3,
              symbol: 'circle',
            },
          },
          ...(chartType === 'pie' && {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: { color: 'rgba(51, 255, 51, 0.9)' },
              },
            },
          }),
        },
        credits: { enabled: false },
        legend: {
          enabled: series.length > 1,
          itemStyle: { color: 'rgba(51, 255, 51, 0.8)' },
        },
        // Responsive rules for extreme sizing cases
        responsive: {
          rules: [
            {
              condition: { maxWidth: 200 },
              chartOptions: {
                legend: { enabled: false },
                yAxis: { labels: { enabled: false } },
                xAxis: { labels: { enabled: false } },
              },
            },
          ],
        },
      };
    }, [displayData, chartType, title]);

    // Render loading state
    const isLoading = isLoadingInitial && !displayData;

    if (isLoading) {
      return (
        <Card
          className="h-full flex items-center justify-center"
          style={{ background: 'rgba(0, 20, 0, 0.5)' }}
        >
          <div className="text-center">
            <p className="text-matrix-green text-sm animate-pulse">Loading Chart...</p>
          </div>
        </Card>
      );
    }

    // Render error state
    if (error) {
      return (
        <Card
          className="h-full flex items-center justify-center border border-red-500/50"
          style={{ background: 'rgba(20, 0, 0, 0.5)' }}
        >
          <p className="text-red-500 text-sm mb-2">Error loading chart:</p>
          <p className="text-red-500/80 text-xs mb-4">{error.message}</p>
          <button onClick={() => refetch()} className="text-xs text-matrix-green hover:underline">
            Retry
          </button>
        </Card>
      );
    }

    // Render table or number
    if (chartType === 'table' || chartType === 'number') {
      const dataToRender: ChartData = displayData || [];
      const keys = dataToRender.length > 0 ? Object.keys(dataToRender[0]) : [];

      if (chartType === 'number') {
        const valueKey = keys.find((k) => typeof dataToRender?.[0]?.[k] === 'number');
        const rawValue = valueKey ? dataToRender?.[0]?.[valueKey] : undefined;
        const displayValue: string | number =
          typeof rawValue === 'number' ? Number(rawValue).toLocaleString() : 'N/A';
        return (
          <Card className="h-full flex flex-col" style={{ background: 'rgba(0, 20, 0, 0.5)' }}>
            {title && (
              <h3 className="text-md font-mono text-matrix-green px-4 pt-3 pb-1 text-center">
                {title}
              </h3>
            )}
            <div className="flex-grow flex items-center justify-center p-4">
              <div className="text-4xl font-bold text-matrix-green">{String(displayValue)}</div>
            </div>
            {isLive && (
              <div
                className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${isWsConnected ? 'bg-matrix-green animate-pulse shadow-[0_0_8px_#33ff33]' : 'bg-red-600 shadow-[0_0_8px_#ff0000]'}`}
                title={isWsConnected ? 'Live' : 'Disconnected'}
              ></div>
            )}
          </Card>
        );
      }

      if (chartType === 'table') {
        return (
          <Card className="h-full flex flex-col" style={{ background: 'rgba(0, 20, 0, 0.5)' }}>
            {title && (
              <h3 className="text-md font-mono text-matrix-green px-4 pt-3 pb-1 text-center">
                {title}
              </h3>
            )}
            {isLive && (
              <div
                className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${isWsConnected ? 'bg-matrix-green animate-pulse shadow-[0_0_8px_#33ff33]' : 'bg-red-600 shadow-[0_0_8px_#ff0000]'}`}
                title={isWsConnected ? 'Live' : 'Disconnected'}
              ></div>
            )}
            <div className="overflow-auto flex-grow p-4 pt-1 scrollbar-thin scrollbar-track-black/20 scrollbar-thumb-matrix-green/50">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-matrix-green/50">
                    {keys.map((key) => (
                      <th
                        key={key}
                        className="p-2 text-matrix-green font-normal sticky top-0 bg-black/80"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataToRender.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="border-b border-matrix-green/20 hover:bg-matrix-green/5"
                    >
                      {keys.map((key) => (
                        <td
                          key={`${rowIndex}-${key}`}
                          className="p-2 text-matrix-green/80 whitespace-nowrap"
                        >
                          {String(row[key] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {dataToRender.length === 0 && (
              <p className="text-matrix-green/70 text-sm text-center p-4">No data available.</p>
            )}
          </Card>
        );
      }
    }

    // Render Highcharts
    return (
      <Card
        className="h-full w-full flex flex-col overflow-hidden"
        style={{ background: 'rgba(0, 20, 0, 0.5)' }}
        ref={containerRef}
      >
        {title && (
          <h3 className="text-md font-mono text-matrix-green px-4 pt-3 pb-1 text-center flex-shrink-0">
            {title}
          </h3>
        )}
        {isLive && (
          <div
            className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${isWsConnected ? 'bg-matrix-green animate-pulse shadow-[0_0_8px_#33ff33]' : 'bg-red-600 shadow-[0_0_8px_#ff0000]'}`}
            title={isWsConnected ? 'Live' : 'Disconnected'}
          ></div>
        )}

        <div className="flex-1 overflow-hidden">
          <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            ref={chartComponentRef}
            containerProps={{
              className: 'highcharts-wrapper',
              style: {
                height: '100%',
                width: '100%',
                overflow: 'hidden', // Constrain chart
              },
            }}
            callback={(chart) => {
              if (chart && isMountedRef.current) {
                // Force a reflow
                updateChartSize();
              }
            }}
          />
        </div>

        {(!displayData || displayData.length === 0) && !isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
            <p className="text-matrix-green/70 text-sm">No data available.</p>
          </div>
        )}
      </Card>
    );
  }
);

ChartRenderer.displayName = 'ChartRenderer';

export default ChartRenderer;
