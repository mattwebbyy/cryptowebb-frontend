// Technical indicator series for the metric chart page.
// Backend computes + Redis-caches these; we just fan out one query per
// selected indicator and shape them into ECharts line series.
import { useQueries } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';

interface IndicatorPoint {
  timestamp: number; // unix ms
  value: number;
}

interface IndicatorResponse {
  indicator: string;
  metricID: number;
  period: number;
  data: IndicatorPoint[] | null;
}

export interface IndicatorSeries {
  key: string;
  label: string;
  points: [number, number][];
}

/** Parses an indicator key like "sma_7" / "ema_30" into endpoint + period. */
const parseIndicatorKey = (key: string): { type: 'sma' | 'ema'; period: number } | null => {
  const match = /^(sma|ema)_(\d+)$/.exec(key);
  if (!match) return null;
  return { type: match[1] as 'sma' | 'ema', period: Number(match[2]) };
};

export const useIndicatorSeries = (
  metricId: string | null,
  granularity: string,
  selectedIndicators: string[]
): { series: IndicatorSeries[]; isLoading: boolean } => {
  const parsed = selectedIndicators
    .map((key) => ({ key, spec: parseIndicatorKey(key) }))
    .filter((x): x is { key: string; spec: { type: 'sma' | 'ema'; period: number } } => x.spec !== null);

  const results = useQueries({
    queries: parsed.map(({ key, spec }) => ({
      queryKey: ['indicator', metricId, granularity, key],
      enabled: !!metricId,
      staleTime: 5 * 60 * 1000,
      retry: 1,
      queryFn: async (): Promise<IndicatorSeries> => {
        const response = await apiClient.get<IndicatorResponse>(
          `/api/v1/indicators/${spec.type}/${metricId}`,
          { params: { period: spec.period, granularity } }
        );
        return {
          key,
          label: `${spec.type.toUpperCase()} (${spec.period})`,
          points: (response.data ?? []).map((p) => [p.timestamp, p.value]),
        };
      },
    })),
  });

  return {
    series: results.flatMap((r) => (r.data ? [r.data] : [])),
    isLoading: results.some((r) => r.isLoading),
  };
};
