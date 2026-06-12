// ECharts implementations of the "advanced" widget chart types
// (candlestick / heatmap / treemap). Replaces the Highcharts-based
// AdvancedChartTypes for the shared/embed dashboard pages.
import { memo, useMemo } from 'react';
import { EChart } from '@/components/charts/EChart';
import { getGainLossColors } from '@/features/charts/theme';

export interface OHLCData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface HeatmapDataPoint {
  x: number | string;
  y: number | string;
  value: number;
  name?: string;
}

export interface TreemapDataPoint {
  name: string;
  value: number;
  colorValue?: number;
  parent?: string;
}

export type AdvancedChartType = 'candlestick' | 'heatmap' | 'treemap';

export interface AdvancedChartProps {
  chartType: AdvancedChartType;
  data: unknown;
  title?: string;
  height?: number;
  className?: string;
}

const buildOption = (chartType: AdvancedChartType, data: unknown, title?: string) => {
  const base = {
    title: title ? { text: title, left: 8, textStyle: { fontSize: 14 } } : undefined,
  };

  switch (chartType) {
    case 'candlestick': {
      const rows = (Array.isArray(data) ? data : []) as OHLCData[];
      const { gain, loss } = getGainLossColors();
      return {
        ...base,
        tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
        grid: { left: 56, right: 16, top: title ? 40 : 16, bottom: 48 },
        xAxis: {
          type: 'category',
          data: rows.map((r) => new Date(r.timestamp).toLocaleDateString()),
        },
        yAxis: { type: 'value', scale: true },
        dataZoom: [{ type: 'inside' }, { type: 'slider', height: 18, bottom: 8 }],
        series: [
          {
            type: 'candlestick',
            // ECharts candlestick order: [open, close, low, high]
            data: rows.map((r) => [r.open, r.close, r.low, r.high]),
            itemStyle: {
              color: gain,
              color0: loss,
              borderColor: gain,
              borderColor0: loss,
            },
          },
        ],
      };
    }
    case 'heatmap': {
      const points = (Array.isArray(data) ? data : []) as HeatmapDataPoint[];
      const xCats = [...new Set(points.map((p) => String(p.x)))];
      const yCats = [...new Set(points.map((p) => String(p.y)))];
      const values = points.map((p) => p.value);
      return {
        ...base,
        tooltip: { position: 'top' },
        grid: { left: 80, right: 16, top: title ? 40 : 16, bottom: 56 },
        xAxis: { type: 'category', data: xCats, splitArea: { show: true } },
        yAxis: { type: 'category', data: yCats, splitArea: { show: true } },
        visualMap: {
          min: Math.min(...values, 0),
          max: Math.max(...values, 1),
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: 4,
        },
        series: [
          {
            type: 'heatmap',
            data: points.map((p) => [String(p.x), String(p.y), p.value]),
            emphasis: { itemStyle: { shadowBlur: 8 } },
          },
        ],
      };
    }
    case 'treemap': {
      const nodes = (Array.isArray(data) ? data : []) as TreemapDataPoint[];
      return {
        ...base,
        tooltip: { formatter: '{b}: {c}' },
        series: [
          {
            type: 'treemap',
            roam: false,
            nodeClick: false,
            breadcrumb: { show: false },
            label: { show: true, formatter: '{b}' },
            itemStyle: { borderWidth: 1, gapWidth: 1 },
            data: nodes.map((n) => ({ name: n.name, value: n.value })),
          },
        ],
      };
    }
  }
};

const AdvancedChartInner = ({ chartType, data, title, height = 300, className }: AdvancedChartProps) => {
  const option = useMemo(() => buildOption(chartType, data, title), [chartType, data, title]);
  return <EChart option={option} className={className} style={{ height }} />;
};

export const AdvancedChart = memo(AdvancedChartInner);
export default AdvancedChart;
