// Data/lifecycle wiring for dashboard chart widgets: initial fetch, live
// WebSocket merge, loading/error/empty states, and the imperative ref API
// (kept compatible with the previous Highcharts-based ChartRenderer).
import {
  useState,
  useMemo,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { toast } from 'sonner';
import type { ECharts } from 'echarts/core';
import { useChartData } from '../api/useChartData';
import { WebSocketUpdate, ChartData, ChartDataRow } from '@/types/data';
import { useWebSocketImproved } from '@/hooks/useWebSocketImproved';
import { ChartSkeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';
import { ChartErrorBoundary } from '@/components/ErrorBoundary';
import { sanitizeFilename } from '@/utils/chartExport';
import { ChartExporter } from '@/utils/chartExport';
import { WS_BASE_URL } from '@/lib/config';
import { ChartCanvas } from './ChartCanvas';
import { NumberWidget, TableWidget, WidgetShell } from './widgets';
import type { WidgetChartType } from './chartData';

export interface ChartRendererRef {
  getChart: () => ECharts | undefined;
  reflow: () => void;
  updateSize: (width: number, height: number) => void;
  exportChart: (format: 'png' | 'pdf' | 'svg' | 'csv', filename?: string) => Promise<void>;
}

export interface ChartRendererProps {
  chartId: string;
  chartType: WidgetChartType;
  title?: string;
  isLive?: boolean;
  /** Accepted for API compatibility; ECharts resizes via ResizeObserver. */
  gridWidth?: number;
  gridHeight?: number;
}

export const ChartRenderer = forwardRef<ChartRendererRef, ChartRendererProps>(
  ({ chartId, chartType, title, isLive = false }, ref) => {
    const { data: initialData, isLoading: isLoadingInitial, error, refetch } = useChartData(chartId);
    const [liveChartData, setLiveChartData] = useState<ChartData | null>(null);
    const chartInstanceRef = useRef<ECharts | null>(null);

    const wsUrl = useMemo(() => {
      if (!isLive) return null;
      return `${WS_BASE_URL}/ws/live/${chartId}`;
    }, [isLive, chartId]);

    const handleWebSocketMessage = useCallback(
      (wsUpdate: WebSocketUpdate) => {
        if (wsUpdate.chartId !== chartId) return;

        setLiveChartData((currentData) => {
          const baseData: ChartData = currentData ?? initialData ?? [];
          const payload = wsUpdate.payload;

          switch (wsUpdate.type) {
            case 'APPEND': {
              const pointsToAdd: ChartData = Array.isArray(payload)
                ? payload
                : [payload as ChartDataRow];
              if (pointsToAdd.length === 0) return baseData;
              return [...baseData, ...pointsToAdd];
            }
            case 'REPLACE':
              return Array.isArray(payload) ? payload : [];
            default:
              return baseData;
          }
        });
      },
      [chartId, initialData]
    );

    const { isConnected: isWsConnected } = useWebSocketImproved<WebSocketUpdate>(
      wsUrl,
      handleWebSocketMessage,
      {
        shouldReconnect: () => !!isLive,
        heartbeatInterval: 30000,
        reconnectInterval: 2000,
        reconnectAttempts: 3,
      }
    );

    const displayData = useMemo(() => liveChartData ?? initialData ?? [], [liveChartData, initialData]);

    useImperativeHandle(
      ref,
      () => ({
        getChart: () => chartInstanceRef.current ?? undefined,
        // ECharts resizes itself via ResizeObserver; these stay as explicit nudges.
        reflow: () => chartInstanceRef.current?.resize(),
        updateSize: () => chartInstanceRef.current?.resize(),
        exportChart: async (format, filename) => {
          const exportName = sanitizeFilename(filename || `${title || chartId}_${Date.now()}`);
          if (format === 'csv') {
            await ChartExporter.exportToCSV(displayData as Record<string, unknown>[], exportName);
            return;
          }
          const chart = chartInstanceRef.current;
          if (!chart) throw new Error('Chart not available for export');
          if (format !== 'png') {
            toast.info(`${format.toUpperCase()} export not supported; downloading PNG instead.`);
          }
          const url = chart.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: 'transparent' });
          const link = document.createElement('a');
          link.href = url;
          link.download = `${exportName}.png`;
          link.click();
        },
      }),
      [chartId, title, displayData]
    );

    if (isLoadingInitial && !displayData.length) {
      return <ChartSkeleton className="h-full" />;
    }

    if (error) {
      return (
        <Card className="h-full flex flex-col items-center justify-center border-error/50 gap-1 p-4" hover={false}>
          <p className="text-error text-sm">Error loading chart</p>
          <p className="text-error/80 text-xs">{error.message}</p>
          <button onClick={() => refetch()} className="text-xs text-primary hover:underline mt-2">
            Retry
          </button>
        </Card>
      );
    }

    if (chartType === 'number') {
      return <NumberWidget data={displayData} title={title} isLive={isLive} isConnected={isWsConnected} />;
    }
    if (chartType === 'table') {
      return <TableWidget data={displayData} title={title} isLive={isLive} isConnected={isWsConnected} />;
    }

    return (
      <ChartErrorBoundary>
        <WidgetShell title={title} isLive={isLive} isConnected={isWsConnected}>
          <div className="flex-1 overflow-hidden relative">
            <ChartCanvas
              data={displayData}
              chartType={chartType}
              title={title}
              onReady={(chart) => {
                chartInstanceRef.current = chart;
              }}
            />
            {displayData.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
                <p className="text-text-secondary text-sm">No data available.</p>
              </div>
            )}
          </div>
        </WidgetShell>
      </ChartErrorBoundary>
    );
  }
);

ChartRenderer.displayName = 'ChartRenderer';
export default ChartRenderer;
