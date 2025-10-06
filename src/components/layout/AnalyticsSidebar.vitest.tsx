import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ComponentProps } from 'react';
import type { DataMetric } from '@/types/metricsData';

const mockNavigate = vi.fn();
const mockUseDataMetricsList = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/features/dataMetrics/api/useDataMetrics', () => ({
  useDataMetricsList: () => mockUseDataMetricsList(),
}));

// Import after mocks so they receive the mocked modules.
import AnalyticsSidebar from './AnalyticsSidebar';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const renderSidebar = (
  initialPath = '/analytics',
  props: Partial<ComponentProps<typeof AnalyticsSidebar>> = {},
) => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="*" element={<AnalyticsSidebar isOpen {...props} />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('AnalyticsSidebar', () => {
  const metrics: DataMetric[] = [
    {
      MetricID: 1,
      MetricName: 'Active Addresses',
      Description: 'Unique addresses interacting with the network',
      Blockchain: 'Ethereum',
      DataSourceType: 'api',
      ValueType: 'number',
      DefaultStoragePreference: 'cache',
      CreatedAt: '2024-01-01T00:00:00Z',
      LastEdited: '2024-01-02T00:00:00Z',
      Category: 'Network Activity',
    },
    {
      MetricID: 2,
      MetricName: 'Total Value Locked',
      Description: 'Locked USD across supported protocols',
      Blockchain: 'Ethereum',
      DataSourceType: 'api',
      ValueType: 'number',
      DefaultStoragePreference: 'cache',
      CreatedAt: '2024-01-01T00:00:00Z',
      LastEdited: '2024-01-02T00:00:00Z',
      Category: 'Market Data',
    },
  ];

  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseDataMetricsList.mockReset();
  });

  it('renders metric categories from the data hook', () => {
    mockUseDataMetricsList.mockReturnValue({ data: metrics, isLoading: false, error: null });

    renderSidebar();

    expect(screen.getByRole('button', { name: /network activity/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /market data/i })).toBeInTheDocument();
  });

  it('navigates and notifies when selecting a metric', async () => {
    mockUseDataMetricsList.mockReturnValue({ data: metrics, isLoading: false, error: null });
    const onMetricSelect = vi.fn();
    const user = userEvent.setup();

    renderSidebar('/analytics', { onMetricSelect });

    await user.click(screen.getByRole('button', { name: /network activity/i }));

    const metricButton = await screen.findByRole('button', { name: /active addresses/i });
    await user.click(metricButton);

    expect(mockNavigate).toHaveBeenCalledWith('/analytics/metrics/1');
    expect(onMetricSelect).toHaveBeenCalledWith(1);
  });

  it('shows a loader while metrics are being fetched', () => {
    mockUseDataMetricsList.mockReturnValue({ data: undefined, isLoading: true, error: null });

    renderSidebar();

    expect(screen.getByText(/initializing system/i)).toBeInTheDocument();
  });
});
