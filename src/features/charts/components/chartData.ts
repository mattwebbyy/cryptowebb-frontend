// Shared data-shaping for chart widgets: detects the x-axis key and numeric
// series in loosely-shaped API rows and emits ECharts series.
import type { ChartData, ChartDataRow } from '@/types/data';

export type WidgetChartType = 'line' | 'bar' | 'pie' | 'number' | 'table';

const X_KEY_CANDIDATES = ['time', 'date', 'timestamp', 'category', 'name', 'label'];

export interface EChartsSeriesResult {
  series: Record<string, unknown>[];
  xType: 'time' | 'category';
  categories: string[];
  seriesCount: number;
}

export const transformDataForECharts = (
  data: ChartData | undefined | null,
  chartType: WidgetChartType,
  title?: string
): EChartsSeriesResult => {
  const empty: EChartsSeriesResult = { series: [], xType: 'category', categories: [], seriesCount: 0 };
  if (!data || data.length === 0) return empty;

  const keys = Object.keys(data[0]);
  const xKey =
    keys.find((k) => X_KEY_CANDIDATES.includes(k.toLowerCase())) || keys[0];
  const numericKeys = keys.filter(
    (k) => k !== xKey && typeof data[0]?.[k] === 'number' && !k.toLowerCase().endsWith('id')
  );
  const isTimeBased = xKey.toLowerCase().includes('time') || xKey.toLowerCase().includes('date');

  const getXValue = (row: ChartDataRow): number | string => {
    const rawValue = row[xKey];
    if (isTimeBased) {
      const date = new Date(rawValue as string | number | Date);
      return isNaN(date.getTime()) ? String(rawValue) : date.getTime();
    }
    return String(rawValue);
  };

  switch (chartType) {
    case 'line':
    case 'bar': {
      const series = numericKeys.map((valueKey) => ({
        type: chartType === 'bar' ? 'bar' : 'line',
        name: valueKey,
        showSymbol: false,
        smooth: false,
        emphasis: { focus: 'series' },
        ...(chartType === 'bar' ? { itemStyle: { borderRadius: [3, 3, 0, 0] } } : {}),
        data: data.map((row) => [getXValue(row), (row[valueKey] as number | null) ?? null]),
      }));
      return {
        series,
        xType: isTimeBased ? 'time' : 'category',
        categories: isTimeBased ? [] : data.map((row) => String(row[xKey])),
        seriesCount: series.length,
      };
    }
    case 'pie': {
      const nameKey = keys.find((k) => typeof data[0]?.[k] === 'string') || 'name';
      const valueKey = numericKeys[0] || 'value';
      return {
        series: [
          {
            type: 'pie',
            name: title || 'Segments',
            radius: ['40%', '70%'],
            itemStyle: { borderRadius: 4, borderWidth: 2, borderColor: 'transparent' },
            label: { formatter: '{b}: {d}%' },
            data: data.map((row) => ({
              name: String(row[nameKey] ?? 'Unknown'),
              value: (row[valueKey] as number | null) ?? 0,
            })),
          },
        ],
        xType: 'category',
        categories: [],
        seriesCount: 1,
      };
    }
    default:
      return empty;
  }
};
