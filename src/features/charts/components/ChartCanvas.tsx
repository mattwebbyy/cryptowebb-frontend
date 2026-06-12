// Pure chart surface: rows in, ECharts out. Memoized so dashboard grid
// re-renders don't redraw charts whose data hasn't changed.
import { memo, useMemo } from 'react';
import { EChart } from '@/components/charts/EChart';
import type { ECharts } from 'echarts/core';
import type { ChartData } from '@/types/data';
import { transformDataForECharts, WidgetChartType } from './chartData';

interface ChartCanvasProps {
  data: ChartData;
  chartType: WidgetChartType;
  title?: string;
  loading?: boolean;
  onReady?: (chart: ECharts) => void;
}

const ChartCanvasInner = ({ data, chartType, title, loading, onReady }: ChartCanvasProps) => {
  const option = useMemo(() => {
    const { series, xType, categories, seriesCount } = transformDataForECharts(data, chartType, title);

    if (chartType === 'pie') {
      return {
        tooltip: { trigger: 'item' },
        series,
      };
    }

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: chartType === 'bar' ? 'shadow' : 'line' },
      },
      grid: { left: 48, right: 16, top: 16, bottom: 28, containLabel: false },
      legend: seriesCount > 1 ? { top: 0 } : undefined,
      xAxis:
        xType === 'time'
          ? { type: 'time' }
          : { type: 'category', data: categories },
      yAxis: { type: 'value', scale: true },
      dataZoom:
        chartType === 'line'
          ? [{ type: 'inside', throttle: 50 }]
          : undefined,
      series,
    };
  }, [data, chartType, title]);

  return <EChart option={option} loading={loading} onReady={onReady} />;
};

export const ChartCanvas = memo(ChartCanvasInner);
export default ChartCanvas;
