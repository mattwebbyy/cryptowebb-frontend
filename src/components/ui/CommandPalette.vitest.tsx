import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CommandPalette } from './CommandPalette';
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

vi.mock('@/hooks/useKeyboardShortcuts', () => ({
  getModifierSymbol: () => 'Ctrl',
}));

describe('CommandPalette', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseDataMetricsList.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
  });

  it('executes the highlighted command when pressing Enter', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<CommandPalette isOpen onClose={onClose} />);

    expect(screen.getByText('Go to Home')).toBeInTheDocument();

    await user.keyboard('{Enter}');

    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders metric commands fetched from the API hook', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    const metric: DataMetric = {
      MetricID: 42,
      MetricName: 'Transactions Volume',
      Description: 'Daily on-chain transaction volume',
      Blockchain: 'Ethereum',
      DataSourceType: 'api',
      ValueType: 'number',
      DefaultStoragePreference: 'cache',
      CreatedAt: '2024-01-01T00:00:00Z',
      LastEdited: '2024-01-02T00:00:00Z',
      Category: 'Activity',
    };

    mockUseDataMetricsList.mockReturnValue({
      data: [metric],
      isLoading: false,
      error: null,
    });

    render(<CommandPalette isOpen onClose={onClose} />);

    const input = screen.getByPlaceholderText('Search commands, navigate to pages...');
    await user.type(input, 'transactions');

    const metricCommand = await screen.findByRole('button', { name: /view transactions volume/i });
    await user.click(metricCommand);

    expect(mockNavigate).toHaveBeenCalledWith('/analytics/metrics/42');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
