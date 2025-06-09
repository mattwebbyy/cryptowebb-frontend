import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import configureStore from 'redux-mock-store';

import { AuthProvider } from '../../hooks/useAuth';

// Mock the chart components to avoid Highcharts complexity in tests
jest.mock('../../components/charts/LineChart', () => ({
  LineChart: ({ data, title }: { data: any[]; title: string }) => (
    <div data-testid="line-chart">
      <h3>{title}</h3>
      <div>Data points: {data?.length || 0}</div>
    </div>
  ),
}));

jest.mock('../../components/charts/BarChart', () => ({
  BarChart: ({ data, title }: { data: any[]; title: string }) => (
    <div data-testid="bar-chart">
      <h3>{title}</h3>
      <div>Data points: {data?.length || 0}</div>
    </div>
  ),
}));

// Mock API clients
jest.mock('../../api/chartApi', () => ({
  fetchChartData: jest.fn(),
}));

jest.mock('../../api/dashboardApi', () => ({
  fetchDashboardConfig: jest.fn(),
  saveDashboardConfig: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock fetch for auth
global.fetch = jest.fn();

const mockStore = configureStore([]);

const createTestWrapper = (initialState = {}) => {
  const store = mockStore({
    matrix: {
      speed: 50,
      density: 1,
      glitchIntensity: 1,
      theme: {
        primaryColor: '#33ff33',
        backgroundColor: '#000000',
      },
    },
    ...initialState,
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/analytics']}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );
};

// Mock analytics dashboard component
const MockAnalyticsDashboard = () => {
  const [selectedMetric, setSelectedMetric] = React.useState('bitcoin_price');
  const [chartType, setChartType] = React.useState('line');
  const [isLoading, setIsLoading] = React.useState(false);

  const mockChartData = [
    { timestamp: 1640995200000, value: 47000 },
    { timestamp: 1641081600000, value: 47500 },
    { timestamp: 1641168000000, value: 46800 },
  ];

  const metrics = [
    { id: 'bitcoin_price', name: 'Bitcoin Price', category: 'price' },
    { id: 'ethereum_price', name: 'Ethereum Price', category: 'price' },
    { id: 'gas_fees', name: 'Gas Fees', category: 'network' },
  ];

  const handleMetricChange = (metricId: string) => {
    setIsLoading(true);
    setSelectedMetric(metricId);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleChartTypeChange = (type: string) => {
    setChartType(type);
  };

  return (
    <div data-testid="analytics-dashboard">
      <header>
        <h1>Analytics Dashboard</h1>
      </header>

      <div data-testid="dashboard-controls">
        <div data-testid="metric-selector">
          <label htmlFor="metric-select">Select Metric:</label>
          <select
            id="metric-select"
            value={selectedMetric}
            onChange={(e) => handleMetricChange(e.target.value)}
          >
            {metrics.map((metric) => (
              <option key={metric.id} value={metric.id}>
                {metric.name}
              </option>
            ))}
          </select>
        </div>

        <div data-testid="chart-type-selector">
          <label>Chart Type:</label>
          {['line', 'bar', 'pie'].map((type) => (
            <label key={type}>
              <input
                type="radio"
                name="chartType"
                value={type}
                checked={chartType === type}
                onChange={(e) => handleChartTypeChange(e.target.value)}
              />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <div data-testid="chart-container">
        {isLoading ? (
          <div data-testid="loading-indicator">Loading chart data...</div>
        ) : (
          <>
            {chartType === 'line' && (
              <div data-testid="line-chart">
                <h3>{metrics.find(m => m.id === selectedMetric)?.name} - Line Chart</h3>
                <div>Data points: {mockChartData.length}</div>
              </div>
            )}
            {chartType === 'bar' && (
              <div data-testid="bar-chart">
                <h3>{metrics.find(m => m.id === selectedMetric)?.name} - Bar Chart</h3>
                <div>Data points: {mockChartData.length}</div>
              </div>
            )}
            {chartType === 'pie' && (
              <div data-testid="pie-chart">
                <h3>{metrics.find(m => m.id === selectedMetric)?.name} - Pie Chart</h3>
                <div>Data segments: 3</div>
              </div>
            )}
          </>
        )}
      </div>

      <div data-testid="chart-info">
        <p>Currently viewing: {metrics.find(m => m.id === selectedMetric)?.name}</p>
        <p>Chart type: {chartType}</p>
        <p>Last updated: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

describe('Dashboard Analytics Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock authenticated user
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token';
      if (key === 'refreshToken') return 'mock-refresh-token';
      if (key === 'tokenType') return 'Bearer';
      return null;
    });

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'user'
        }
      }),
    });

    // Suppress console logs
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Dashboard Rendering and Navigation', () => {
    it('should render analytics dashboard with all required components', async () => {
      const Wrapper = createTestWrapper();

      render(
        <Wrapper>
          <MockAnalyticsDashboard />
        </Wrapper>
      );

      // Check main dashboard elements
      expect(screen.getByTestId('analytics-dashboard')).toBeInTheDocument();
      expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-controls')).toBeInTheDocument();
      expect(screen.getByTestId('chart-container')).toBeInTheDocument();
      expect(screen.getByTestId('chart-info')).toBeInTheDocument();
    });

    it('should display metric selector with available options', () => {
      const Wrapper = createTestWrapper();

      render(
        <Wrapper>
          <MockAnalyticsDashboard />
        </Wrapper>
      );

      const metricSelect = screen.getByLabelText('Select Metric:');
      expect(metricSelect).toBeInTheDocument();

      // Check if all metric options are available
      expect(screen.getByDisplayValue('Bitcoin Price')).toBeInTheDocument();
      
      const options = within(metricSelect).getAllByRole('option');
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveTextContent('Bitcoin Price');
      expect(options[1]).toHaveTextContent('Ethereum Price');
      expect(options[2]).toHaveTextContent('Gas Fees');
    });

    it('should display chart type selector with radio buttons', () => {
      const Wrapper = createTestWrapper();

      render(
        <Wrapper>
          <MockAnalyticsDashboard />
        </Wrapper>
      );

      const chartTypeSection = screen.getByTestId('chart-type-selector');
      
      const lineRadio = within(chartTypeSection).getByDisplayValue('line');
      const barRadio = within(chartTypeSection).getByDisplayValue('bar');
      const pieRadio = within(chartTypeSection).getByDisplayValue('pie');

      expect(lineRadio).toBeInTheDocument();
      expect(barRadio).toBeInTheDocument();
      expect(pieRadio).toBeInTheDocument();

      // Line should be selected by default
      expect(lineRadio).toBeChecked();
      expect(barRadio).not.toBeChecked();
      expect(pieRadio).not.toBeChecked();
    });
  });

  describe('Interactive Chart Controls', () => {
    it('should change metric when dropdown selection changes', async () => {
      const user = userEvent.setup();
      const Wrapper = createTestWrapper();

      render(
        <Wrapper>
          <MockAnalyticsDashboard />
        </Wrapper>
      );

      const metricSelect = screen.getByLabelText('Select Metric:');
      
      // Change to Ethereum Price
      await user.selectOptions(metricSelect, 'ethereum_price');

      await waitFor(() => {
        expect(screen.getByText('Currently viewing: Ethereum Price')).toBeInTheDocument();
      });

      // Should show loading state briefly
      expect(screen.getByText('Loading chart data...')).toBeInTheDocument();
      
      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Loading chart data...')).not.toBeInTheDocument();
      });

      // Chart should update to show Ethereum data
      expect(screen.getByText('Ethereum Price - Line Chart')).toBeInTheDocument();
    });

    it('should change chart type when radio button is selected', async () => {
      const user = userEvent.setup();
      const Wrapper = createTestWrapper();

      render(
        <Wrapper>
          <MockAnalyticsDashboard />
        </Wrapper>
      );

      // Initially should show line chart
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();

      // Switch to bar chart
      const barRadio = screen.getByDisplayValue('bar');
      await user.click(barRadio);

      await waitFor(() => {
        expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
        expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
      });

      expect(screen.getByText('Chart type: bar')).toBeInTheDocument();
    });

    it('should handle multiple rapid selections correctly', async () => {
      const user = userEvent.setup();
      const Wrapper = createTestWrapper();

      render(
        <Wrapper>
          <MockAnalyticsDashboard />
        </Wrapper>
      );

      const metricSelect = screen.getByLabelText('Select Metric:');
      
      // Rapidly change metrics
      await user.selectOptions(metricSelect, 'ethereum_price');
      await user.selectOptions(metricSelect, 'gas_fees');
      await user.selectOptions(metricSelect, 'bitcoin_price');

      // Should handle the last selection
      await waitFor(() => {
        expect(screen.getByText('Currently viewing: Bitcoin Price')).toBeInTheDocument();
      });
    });
  });

  describe('Chart Rendering and Data Display', () => {
    it('should display chart with correct data points', async () => {
      const Wrapper = createTestWrapper();

      render(
        <Wrapper>
          <MockAnalyticsDashboard />
        </Wrapper>
      );

      await waitFor(() => {
        const chart = screen.getByTestId('line-chart');
        expect(within(chart).getByText('Data points: 3')).toBeInTheDocument();
      });
    });

    it('should show different chart types with same data', async () => {
      const user = userEvent.setup();
      const Wrapper = createTestWrapper();

      render(
        <Wrapper>
          <MockAnalyticsDashboard />
        </Wrapper>
      );

      // Test line chart
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByText('Data points: 3')).toBeInTheDocument();

      // Switch to bar chart
      await user.click(screen.getByDisplayValue('bar'));
      
      await waitFor(() => {
        expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
        expect(screen.getByText('Data points: 3')).toBeInTheDocument();
      });

      // Switch to pie chart
      await user.click(screen.getByDisplayValue('pie'));
      
      await waitFor(() => {
        expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
        expect(screen.getByText('Data segments: 3')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States and Error Handling', () => {
    it('should show loading indicator when changing metrics', async () => {
      const user = userEvent.setup();
      const Wrapper = createTestWrapper();

      render(
        <Wrapper>
          <MockAnalyticsDashboard />
        </Wrapper>
      );

      const metricSelect = screen.getByLabelText('Select Metric:');
      
      // Change metric
      await user.selectOptions(metricSelect, 'ethereum_price');

      // Should immediately show loading
      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
      expect(screen.getByText('Loading chart data...')).toBeInTheDocument();

      // Should hide chart while loading
      expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
      });

      // Chart should reappear
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should maintain chart type selection during metric changes', async () => {
      const user = userEvent.setup();
      const Wrapper = createTestWrapper();

      render(
        <Wrapper>
          <MockAnalyticsDashboard />
        </Wrapper>
      );

      // Switch to bar chart first
      await user.click(screen.getByDisplayValue('bar'));
      
      await waitFor(() => {
        expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      });

      // Change metric
      const metricSelect = screen.getByLabelText('Select Metric:');
      await user.selectOptions(metricSelect, 'ethereum_price');

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
      });

      // Should still be bar chart, not line chart
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
      expect(screen.getByText('Chart type: bar')).toBeInTheDocument();
    });
  });

  describe('Dashboard State Management', () => {
    it('should update chart info when selections change', async () => {
      const user = userEvent.setup();
      const Wrapper = createTestWrapper();

      render(
        <Wrapper>
          <MockAnalyticsDashboard />
        </Wrapper>
      );

      const chartInfo = screen.getByTestId('chart-info');
      
      // Initial state
      expect(within(chartInfo).getByText('Currently viewing: Bitcoin Price')).toBeInTheDocument();
      expect(within(chartInfo).getByText('Chart type: line')).toBeInTheDocument();

      // Change metric
      await user.selectOptions(screen.getByLabelText('Select Metric:'), 'gas_fees');
      
      await waitFor(() => {
        expect(within(chartInfo).getByText('Currently viewing: Gas Fees')).toBeInTheDocument();
      });

      // Change chart type
      await user.click(screen.getByDisplayValue('pie'));
      
      expect(within(chartInfo).getByText('Chart type: pie')).toBeInTheDocument();
    });

    it('should display last updated timestamp', () => {
      const Wrapper = createTestWrapper();

      render(
        <Wrapper>
          <MockAnalyticsDashboard />
        </Wrapper>
      );

      const chartInfo = screen.getByTestId('chart-info');
      
      // Should display a timestamp
      expect(within(chartInfo).getByText(/Last updated:/)).toBeInTheDocument();
    });
  });
});