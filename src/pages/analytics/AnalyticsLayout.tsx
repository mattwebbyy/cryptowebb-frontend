// src/pages/analytics/AnalyticsLayout.tsx — analytics workspace sub-layout.
// Renders inside AppShell (which owns the sidebar/topbar); this adds only a
// slim tab strip across the workspace sections.
import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnalyticsErrorBoundary } from '@/components/ErrorBoundary';

const tabs = [
  { to: '/analytics', label: 'Dashboards', end: true },
  { to: '/analytics/metrics', label: 'Metrics', end: false },
  { to: '/analytics/datasources', label: 'Data sources', end: true },
  { to: '/analytics/manage', label: 'Manage', end: true },
];

const AnalyticsLayout: React.FC = () => {
  const location = useLocation();
  // Metric chart pages get the Metrics tab highlighted
  const onMetricPage = location.pathname.startsWith('/analytics/metrics/');

  return (
    <AnalyticsErrorBoundary>
      <div className="mx-auto max-w-screen-2xl px-4 md:px-6">
        <nav
          className="flex items-center gap-1 border-b border-border -mx-4 md:-mx-6 px-4 md:px-6 overflow-x-auto"
          aria-label="Analytics sections"
        >
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `relative px-3 py-2.5 text-[13px] whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  isActive || (tab.to === '/analytics/metrics' && onMetricPage)
                    ? 'text-text font-medium border-primary'
                    : 'text-text-secondary hover:text-text border-transparent'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
        <Outlet />
      </div>
    </AnalyticsErrorBoundary>
  );
};

export default AnalyticsLayout;
