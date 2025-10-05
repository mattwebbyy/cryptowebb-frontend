import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AnalyticsBreadcrumb, Breadcrumb } from './Breadcrumb';

describe('Breadcrumb', () => {
  it('auto-generates breadcrumbs from the current path', () => {
    render(
      <MemoryRouter initialEntries={['/analytics/datasources']}>
        <Breadcrumb />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();

    const current = screen.getByText('Data Sources');
    expect(current).toBeInTheDocument();
    expect(current).toHaveAttribute('aria-current', 'page');
  });

  it('renders provided breadcrumb items without home link when disabled', () => {
    render(
      <MemoryRouter initialEntries={['/custom/path']}>
        <Breadcrumb
          showHome={false}
          items={[
            { label: 'Parent', href: '/parent' },
            { label: 'Child', isActive: true },
          ]}
        />
      </MemoryRouter>,
    );

    expect(screen.queryByLabelText('Home')).toBeNull();
    expect(screen.getByRole('link', { name: 'Parent' })).toHaveAttribute('href', '/parent');
    expect(screen.getByText('Child')).toHaveAttribute('aria-current', 'page');
  });
});

describe('AnalyticsBreadcrumb', () => {
  it('renders analytics specific crumbs with metric details', () => {
    render(
      <MemoryRouter initialEntries={['/analytics/metrics/42']}>
        <AnalyticsBreadcrumb metricName="Transactions per Second" metricId="42" />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Analytics' })).toHaveAttribute('href', '/analytics');

    const metric = screen.getByText('Transactions per Second');
    expect(metric).toHaveAttribute('aria-current', 'page');
  });
});
