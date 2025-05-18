
import { useQuery } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { apiClient } from '@/lib/axios';
import type {
  DataMetric,
  DataMetricInfo,
  TimeseriesApiResponse,
  TimeseriesDataPoint
} from '@/types/metricsData';

// Base URL for the data API
const API_DATA_BASE_URL = '/api/v1/data';

// Define granularity options
export type GranularityOption = 'blocks' | 'hours' | 'days';

// Define the API response structure for metrics list
interface MetricsListResponse {
  metrics: DataMetric[];
}

/**
 * Fetches a list of all available data metrics.
 * API: GET /api/v1/data/metrics
 * Expects: { metrics: DataMetric[] }
 */
const fetchDataMetricsList = async (): Promise<DataMetric[]> => {
  try {
    console.log('🚀 Making request to:', `${API_DATA_BASE_URL}/metrics`);
    
    const response = await apiClient.get<MetricsListResponse>(`${API_DATA_BASE_URL}/metrics`);
    
    console.log('📊 Full Axios response:', response);
    
    // Handle different response structures
    let data: MetricsListResponse | DataMetric[] | unknown;
    
    // Case 1: Normal axios response structure
    if (response && response.data) {
      data = response.data;
      console.log('📋 Using response.data:', data);
    }
    // Case 2: Response interceptor might have flattened the structure
    else if (response && typeof response === 'object') {
      data = response;
      console.log('📋 Using response directly:', data);
    }
    // Case 3: Something unexpected
    else {
      console.error('❌ Unexpected response structure:', response);
      throw new Error('Unexpected response structure');
    }
    
    // Type guard to check if data has metrics property
    const hasMetricsProperty = (obj: unknown): obj is MetricsListResponse => {
      return typeof obj === 'object' && obj !== null && 'metrics' in obj;
    };
    
    // Type guard to check if data is an array
    const isDataMetricArray = (obj: unknown): obj is DataMetric[] => {
      return Array.isArray(obj) && (obj.length === 0 || 'MetricID' in obj[0]);
    };
    
    // Now handle the data structure with proper type checking
    if (hasMetricsProperty(data) && Array.isArray(data.metrics)) {
      console.log('✅ Found metrics array:', data.metrics.length, 'items');
      return data.metrics;
    }
    // Handle case where the response is directly the metrics array
    else if (isDataMetricArray(data)) {
      console.log('✅ Response is directly an array:', data.length, 'items');
      return data;
    }
    // Handle case where metrics is at the response level (your current case)
    else if (data && typeof data === 'object' && !Array.isArray(data)) {
      const dataObj = data as Record<string, unknown>;
      const keys = Object.keys(dataObj);
      const hasNumericKeys = keys.some(key => !isNaN(Number(key)));
      
      if ('metrics' in dataObj) {
        const metricsValue = dataObj.metrics;
        if (isDataMetricArray(metricsValue)) {
          return metricsValue;
        }
      }
      
      if (hasNumericKeys) {
        // Convert object with numeric keys to array
        console.log('✅ Response appears to be metrics array with numeric keys');
        const valuesArray = Object.values(dataObj);
        if (isDataMetricArray(valuesArray)) {
          return valuesArray;
        }
      }
    }
    
    console.error('❌ Could not find metrics in response:', data);
    console.error('❌ Data type:', typeof data);
    throw new Error('Metrics not found in response');
    
  } catch (error) {
    console.error('❌ Error fetching data metrics list:', error);
    
    // Enhanced error logging
    if (error instanceof Error) {
      console.error('❌ Error message:', error.message);
    }
    
    // Check if it's an Axios error
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: AxiosResponse; config?: unknown };
      console.error('❌ Axios error response:', axiosError.response);
      console.error('❌ Axios error config:', axiosError.config);
    }
    
    throw error;
  }
};

/**
 * Custom hook for fetching the list of data metrics.
 */
export const useDataMetricsList = () => {
  return useQuery<DataMetric[], Error>({
    queryKey: ['dataMetricsList'],
    queryFn: fetchDataMetricsList,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    retry: (failureCount, error) => {
      console.log(`🔄 Retry attempt ${failureCount} for:`, error);
      return failureCount < 2; // Reduce retries since we know it works
    },
  });
};

/**
 * Fetches detailed information for a specific metric.
 * API: GET /api/v1/data/metrics/:metricId/info
 * Expects: DataMetricInfo
 */
const fetchDataMetricInfo = async (metricId: string): Promise<DataMetricInfo> => {
  try {
    console.log('🚀 Fetching metric info for:', metricId);
    
    const response = await apiClient.get<DataMetricInfo>(`${API_DATA_BASE_URL}/metrics/${metricId}/info`);
    
    console.log('📊 Metric info response:', response);
    
    // Handle the response structure with proper type checking
    if (response && response.data) {
      return response.data;
    } else if (response && typeof response === 'object') {
      // Type assertion with validation
      const metricInfo = response as unknown;
      if (isDataMetricInfo(metricInfo)) {
        return metricInfo;
      }
    }
    
    throw new Error('Could not extract metric info from response');
    
  } catch (error) {
    console.error(`❌ Error fetching data metric info for ${metricId}:`, error);
    throw error;
  }
};

/**
 * Type guard to check if an object is DataMetricInfo
 */
const isDataMetricInfo = (obj: unknown): obj is DataMetricInfo => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'MetricID' in obj &&
    'MetricName' in obj &&
    'Description' in obj
  );
};

/**
 * Custom hook for fetching a specific metric's information.
 */
export const useDataMetricInfo = (metricId: string | null) => {
  return useQuery<DataMetricInfo, Error>({
    queryKey: ['dataMetricInfo', metricId],
    queryFn: () => {
      if (!metricId) {
        return Promise.reject(new Error("Metric ID is required."));
      }
      return fetchDataMetricInfo(metricId);
    },
    enabled: !!metricId,
  });
};

/**
 * Fetches timeseries data for a specific metric with granularity parameter.
 * API: GET /api/v1/data/metrics/:metricId/timeseries?granularity=<granularity>
 * @param metricId - The ID of the metric.
 * @param granularity - The granularity for the timeseries data (blocks, hours, days).
 */
const fetchDataMetricTimeseries = async (
  metricId: string,
  granularity: GranularityOption = 'days'
): Promise<TimeseriesDataPoint[]> => {
  try {
    console.log(`🚀 Fetching timeseries for metric ${metricId} with granularity ${granularity}`);
    
    const response = await apiClient.get<TimeseriesApiResponse>(
      `${API_DATA_BASE_URL}/metrics/${metricId}/timeseries`,
      {
        params: {
          granularity: granularity
        }
      }
    );
    
    console.log('📊 Timeseries response:', response);
    
    // Handle the response structure with proper type checking
    let data: TimeseriesApiResponse | TimeseriesDataPoint[] | unknown;
    
    if (response && response.data) {
      data = response.data;
    } else if (response && typeof response === 'object') {
      data = response;
    }
    
    // Type guard for TimeseriesApiResponse
    const isTimeseriesApiResponse = (obj: unknown): obj is TimeseriesApiResponse => {
      return (
        typeof obj === 'object' &&
        obj !== null &&
        'data' in obj &&
        Array.isArray((obj as { data: unknown }).data)
      );
    };
    
    // Type guard for TimeseriesDataPoint array
    const isTimeseriesDataArray = (obj: unknown): obj is TimeseriesDataPoint[] => {
      return (
        Array.isArray(obj) &&
        (obj.length === 0 || ('timestamp' in obj[0] && 'value' in obj[0]))
      );
    };
    
    // Extract the timeseries data with type checking
    if (isTimeseriesApiResponse(data)) {
      console.log('✅ Successfully parsed timeseries data:', data.data.length, 'points');
      return data.data;
    } else if (isTimeseriesDataArray(data)) {
      console.log('✅ Response is directly an array:', data.length, 'points');
      return data;
    } else {
      console.error('❌ Unexpected timeseries response structure:', data);
      return [];
    }
    
  } catch (error) {
    console.error(`❌ Error fetching timeseries data for ${metricId}:`, error);
    throw error;
  }
};

/**
 * Custom hook for fetching a specific metric's timeseries data.
 * @param metricId - The ID of the metric. Query is disabled if metricId is null.
 * @param granularity - The granularity for the timeseries data.
 */
export const useDataMetricTimeseries = (
  metricId: string | null,
  granularity: GranularityOption = 'days'
) => {
  return useQuery<TimeseriesDataPoint[], Error>({
    queryKey: ['dataMetricTimeseries', metricId, granularity],
    queryFn: () => {
      if (!metricId) {
        return Promise.reject(new Error("Metric ID is required for timeseries."));
      }
      return fetchDataMetricTimeseries(metricId, granularity);
    },
    enabled: !!metricId,
    retry: 2,
  });
};