// src/api/chartApi.ts
import { apiClient } from './apiClient';

export type ChartDataPoint = Record<string, unknown>;

type ChartApiResponse =
  | ChartDataPoint[]
  | {
      points?: ChartDataPoint[];
    };

export const fetchChartData = async (chartId: string): Promise<ChartDataPoint[]> => {
  if (!chartId) {
    return [];
  }

  const data = await apiClient.get<ChartApiResponse>(`/api/v1/charts/${chartId}/data`);

  if (Array.isArray(data)) {
    return data;
  }

  if (data?.points && Array.isArray(data.points)) {
    return data.points;
  }

  return [];
};
