// ECharts theme derived from the design-token CSS variables.
// Canvas rendering can't resolve `var(--x)`, so values are read from
// computed styles at build time and rebuilt whenever the app theme changes.

const cssVar = (name: string, fallback: string): string => {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
};

export const getChartPalette = (): string[] => [
  cssVar('--chart-1', '#8b5cf6'),
  cssVar('--chart-2', '#22d3ee'),
  cssVar('--chart-3', '#f59e0b'),
  cssVar('--chart-4', '#ec4899'),
  cssVar('--chart-5', '#10b981'),
  cssVar('--chart-6', '#3b82f6'),
  cssVar('--chart-7', '#f97316'),
  cssVar('--chart-8', '#e879f9'),
];

export const getGainLossColors = () => ({
  gain: cssVar('--color-gain', '#22c55e'),
  loss: cssVar('--color-loss', '#ef4444'),
});

/** Builds the ECharts theme object from the current design tokens. */
export const buildEChartsTheme = () => {
  const text = cssVar('--color-text', '#fafafa');
  const textSecondary = cssVar('--color-text-secondary', '#a1a1aa');
  const border = cssVar('--color-border', '#27272a');
  const surface = cssVar('--color-surface', '#111113');

  const axisCommon = {
    axisLine: { lineStyle: { color: border } },
    axisTick: { lineStyle: { color: border } },
    axisLabel: { color: textSecondary, fontFamily: 'JetBrains Mono, monospace', fontSize: 11 },
    splitLine: { lineStyle: { color: border, opacity: 0.5 } },
    nameTextStyle: { color: textSecondary },
  };

  return {
    color: getChartPalette(),
    backgroundColor: 'transparent',
    textStyle: { color: text, fontFamily: 'Inter, sans-serif' },
    title: { textStyle: { color: text, fontWeight: 600 } },
    legend: { textStyle: { color: textSecondary } },
    tooltip: {
      backgroundColor: surface,
      borderColor: border,
      textStyle: { color: text, fontSize: 12 },
    },
    categoryAxis: axisCommon,
    valueAxis: axisCommon,
    timeAxis: axisCommon,
    logAxis: axisCommon,
    dataZoom: {
      borderColor: border,
      textStyle: { color: textSecondary },
    },
  };
};
