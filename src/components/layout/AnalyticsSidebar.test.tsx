import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import AnalyticsSidebar from './AnalyticsSidebar';

const navigateMock = vi.fn();
const onMetricSelectMock = vi.fn();
const onOpenCommandPaletteMock = vi.fn();

const mockMetrics = [
  {
    MetricID: 1,
    MetricName: 'Active Addresses',
    Description: 'Number of active addresses',
    Blockchain: 'Ethereum',
    DataSourceType: 'on-chain',
    ValueType: 'number',
    DefaultStoragePreference: 'daily',
    CreatedAt: '2024-01-01',
    LastEdited: '2024-01-10',
    Category: 'Engagement',
  },
  {
    MetricID: 2,
    MetricName: 'Transaction Volume',
    Description: 'Daily transaction volume',
    Blockchain: 'Bitcoin',
    DataSourceType: 'on-chain',
    ValueType: 'number',
    DefaultStoragePreference: 'daily',
    CreatedAt: '2024-01-02',
    LastEdited: '2024-01-05',
    Category: 'Volume',
  },
];

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useParams: () => ({ metricId: '1' }),
  };
});

vi.mock('@/features/dataMetrics/api/useDataMetrics', () => ({
  useDataMetricsList: () => ({
    data: mockMetrics,
    isLoading: false,
    error: undefined,
  }),
}));

vi.mock('@/components/ui/MatrixLoader', () => ({
  MatrixLoader: () => <div data-testid="matrix-loader" />,
}));

describe('AnalyticsSidebar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigateMock.mockReset();
    onMetricSelectMock.mockReset();
    onOpenCommandPaletteMock.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderSidebar = (overrides: Partial<React.ComponentProps<typeof AnalyticsSidebar>> = {}) => {
    const props = {
      isOpen: true,
      onMetricSelect: onMetricSelectMock,
      isMobile: false,
      onOpenCommandPalette: onOpenCommandPaletteMock,
      ...overrides,
    } as React.ComponentProps<typeof AnalyticsSidebar>;

    return render(
      <MemoryRouter initialEntries={["/analytics"]}>
        <AnalyticsSidebar {...props} />
      </MemoryRouter>,
    );
  };

  it('renders base navigation links and highlights active metric', () => {
    renderSidebar();

    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /data sources/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cipher matrix/i })).toBeInTheDocument();

    const activeMetricButton = screen.getByRole('button', { name: /active addresses/i });
    expect(activeMetricButton.className).toContain('bg-primary/25');
  });

  it('opens command palette when quick action is clicked', async () => {
    renderSidebar();

    await userEvent.click(screen.getByRole('button', { name: /command palette/i }));
    expect(onOpenCommandPaletteMock).toHaveBeenCalledTimes(1);
  });

  it('navigates to metric and invokes callback when metric selected', async () => {
    renderSidebar();

    const metricButton = screen.getByRole('button', { name: /transaction volume/i });
    await userEvent.click(metricButton);

    await act(async () => {
      vi.runAllTimers();
    });

    expect(navigateMock).toHaveBeenCalledWith('/analytics/metrics/2');
    expect(onMetricSelectMock).toHaveBeenCalledWith(2);
  });

  it('shows category buttons and switches view when category selected on mobile', async () => {
    renderSidebar({ isMobile: true });

    const categoryButton = screen.getByRole('button', { name: /engagement/i });
    await userEvent.click(categoryButton);

    await act(async () => {
      vi.runAllTimers();
    });

    // After switching categories, back button should be visible
    expect(screen.getByRole('button', { name: /back to categories/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /active addresses/i })).toBeInTheDocument();
  });
});
