// src/features/charts/api/useChartData.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios'; // Import the actual client
import { useChartData } from './useChartData'; // Import the hook
import { ChartData } from '@/types/data'; // Import types

// Mock React Query's useQuery
// We only need to mock the parts our hook relies on
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'), // Keep original functionalities
  useQuery: jest.fn(), // Mock useQuery specifically
}));

// Mock the apiClient
jest.mock('@/lib/axios', () => ({
  apiClient: {
    get: jest.fn(), // Mock the get method
  },
}));

// Type assertion for mocked functions
const mockedUseQuery = useQuery as jest.Mock;
const mockedApiClientGet = apiClient.get as jest.Mock;

// Helper to provide a basic QueryClient wrapper if needed, though often not
// necessary when directly mocking useQuery's return value.
// const createWrapper = () => {
//   const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
//   return ({ children }: { children: React.ReactNode }) => (
//     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//   );
// };

describe('useChartData Hook', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockedUseQuery.mockClear();
    mockedApiClientGet.mockClear();
    // Reset environment variable mock if you modify it during tests
    // (For this example, we assume VITE_USE_MOCK_DATA is false unless mocked otherwise)
    // import.meta.env.VITE_USE_MOCK_DATA = 'false';
  });

  it('should call useQuery with the correct queryKey and default options', () => {
    const chartId = 'line-chart-123';
    renderHook(() => useChartData(chartId));

    expect(mockedUseQuery).toHaveBeenCalledTimes(1);
    // Check the basic structure of the call
    const callArgs = mockedUseQuery.mock.calls[0][0];
    expect(callArgs.queryKey).toEqual(['chartData', chartId]);
    expect(callArgs.enabled).toBe(true); // Enabled because chartId is provided
    expect(typeof callArgs.queryFn).toBe('function');
    // Check other options if necessary (staleTime, refetchOnWindowFocus)
    expect(callArgs.staleTime).toBe(5 * 60 * 1000); // Default for non-mock
    expect(callArgs.refetchOnWindowFocus).toBe(true); // Default for non-mock
  });

  it('should not be enabled if chartId is undefined', () => {
    renderHook(() => useChartData(undefined));

    expect(mockedUseQuery).toHaveBeenCalledTimes(1);
    const callArgs = mockedUseQuery.mock.calls[0][0];
    expect(callArgs.queryKey).toEqual(['chartData', undefined]);
    expect(callArgs.enabled).toBe(false); // Should be disabled
  });

  it('should return data when useQuery succeeds (non-mock)', async () => {
    const chartId = 'bar-chart-456';
    const mockData: ChartData = [{ category: 'A', value: 10 }];

    // Simulate successful API call within the queryFn *execution*
    mockedApiClientGet.mockResolvedValue(mockData);

    // Simulate useQuery returning success state
    mockedUseQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
      error: null,
      // ... other useQuery return properties if needed
    });

    const { result } = renderHook(() => useChartData(chartId));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.data).toEqual(mockData);
    // We don't need to waitFor here because we mocked the *return value* of useQuery
  });

   it('should return error state when useQuery fails (non-mock)', async () => {
      const chartId = 'error-chart-789';
      const mockError = new Error('Failed to fetch');

      // Simulate apiClient.get throwing an error within the queryFn execution if needed,
      // but mocking useQuery's return is usually sufficient for testing the hook's handling
      // mockedApiClientGet.mockRejectedValue(mockError);

      // Simulate useQuery returning error state
      mockedUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        isSuccess: false,
        isError: true,
        error: mockError,
      });

      const { result } = renderHook(() => useChartData(chartId));

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(mockError);
      expect(result.current.data).toBeUndefined();
    });

  // Add tests for the VITE_USE_MOCK_DATA='true' case if needed,
  // mocking the environment variable and checking mock data generation.
  // This requires more setup for mocking import.meta.env.
});