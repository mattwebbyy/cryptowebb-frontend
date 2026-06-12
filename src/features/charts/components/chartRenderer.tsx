// ChartRenderer — compatibility entry point.
// The implementation now lives in the decomposed ECharts-based pipeline:
//   ChartContainer (data/WS wiring + ref API) → ChartCanvas (ECharts surface)
//   → widgets.tsx (number/table) → chartData.ts (row → series shaping).
export { ChartRenderer, type ChartRendererRef, type ChartRendererProps } from './ChartContainer';
export { default } from './ChartContainer';
