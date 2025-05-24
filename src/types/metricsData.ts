// @/types/metricsData.ts - Updated types for the metrics data

export interface DataMetric {
    MetricID: number;
    MetricName: string;
    Description: string;
    Blockchain: string;
    DataSourceType: string;
    ValueType: string;
    DefaultStoragePreference: string;
    CreatedAt: string;
    LastEdited: string;
    Category?: string; // Optional category field

  }
  
  export interface DataMetricInfo {
    MetricID: number;
    MetricName: string;
    Description: string;
    Blockchain: string;
    DataSourceType: string;
    ValueType: string;
    DefaultStoragePreference: string;
    CreatedAt: string;
    LastEdited: string;
    Category?: string; // Added Category field (optional)

  }
  
  export interface TimeseriesDataPoint {
    timestamp: number | string; // Can be Unix timestamp (number) or ISO string
    value: number;
    blockNumber?: number; // Optional field
  }
  
  export interface TimeseriesApiResponse {
    data: TimeseriesDataPoint[];
    meta?: {
      total: number;
      granularity: string;
      start_time?: string;
      end_time?: string;
    };
  }
  
  // Granularity options type
  export type GranularityOption = 'blocks' | 'hours' | 'days';
  
  // API request parameters
  export interface TimeseriesRequestParams {
    granularity: GranularityOption;
    start_time?: string;
    end_time?: string;
    limit?: number;
  }