// Thin React wrapper over echarts/core.
// Only the renderers/charts/components below are bundled (tree-shaken),
// and Vite routes the whole echarts dependency into the lazy "charts" chunk.
import { memo, useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import {
  LineChart,
  BarChart,
  PieChart,
  CandlestickChart,
  HeatmapChart,
  TreemapChart,
  ScatterChart,
} from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
  ToolboxComponent,
  VisualMapComponent,
  MarkLineComponent,
} from 'echarts/components';
import type { EChartsCoreOption, ECharts } from 'echarts/core';
import { useTheme } from '@/contexts/ThemeContext';
import { buildEChartsTheme } from '@/features/charts/theme';

echarts.use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  CandlestickChart,
  HeatmapChart,
  TreemapChart,
  ScatterChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
  ToolboxComponent,
  VisualMapComponent,
  MarkLineComponent,
]);

export interface EChartProps {
  option: EChartsCoreOption;
  /** Replace the whole option instead of merging on update. */
  notMerge?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onReady?: (chart: ECharts) => void;
  loading?: boolean;
}

const EChartInner = ({ option, notMerge = true, className, style, onReady, loading }: EChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ECharts | null>(null);
  const { theme } = useTheme();
  const themeKey = `${theme.mode}-${theme.variant}`;

  // (Re)create the instance when the design theme changes.
  useEffect(() => {
    if (!containerRef.current) return;

    const themeName = `cryptowebb-${themeKey}`;
    echarts.registerTheme(themeName, buildEChartsTheme());
    const chart = echarts.init(containerRef.current, themeName);
    chartRef.current = chart;
    onReady?.(chart);

    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeKey]);

  useEffect(() => {
    chartRef.current?.setOption(option, { notMerge });
  }, [option, notMerge, themeKey]);

  useEffect(() => {
    if (!chartRef.current) return;
    if (loading) chartRef.current.showLoading('default', { maskColor: 'transparent', text: '' });
    else chartRef.current.hideLoading();
  }, [loading]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: '100%', minHeight: 120, ...style }}
    />
  );
};

export const EChart = memo(EChartInner);
export default EChart;
