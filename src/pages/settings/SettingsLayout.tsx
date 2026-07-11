// src/pages/settings/SettingsLayout.tsx — settings sub-layout inside
// AppShell: page title, tab strip, subscription badge. Same visual grammar
// as the analytics workspace tabs.
import { Outlet, NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';

const tabs = [
  { to: '/settings', label: 'Overview', end: true },
  { to: '/settings/profile', label: 'Profile', end: true },
  { to: '/settings/api', label: 'API keys', end: true },
  { to: '/settings/referrals', label: 'Referrals', end: true },
];

type SubscriptionData = {
  tier?: string;
  status?: string;
};

const SettingsLayout = () => {
  const { data: subscription } = useQuery<SubscriptionData>({
    queryKey: ['subscription'],
    queryFn: () => apiClient.get<SubscriptionData>('/api/v1/users/me/subscription'),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6">
      <div className="flex items-center justify-between pt-5 pb-3">
        <h1 className="text-lg font-semibold tracking-tight">Settings</h1>
        {subscription?.tier && (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 text-xs text-text-secondary">
            Plan
            <span className="font-medium text-text capitalize">{subscription.tier}</span>
          </span>
        )}
      </div>

      <nav
        className="flex items-center gap-1 border-b border-border overflow-x-auto"
        aria-label="Settings sections"
      >
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `relative px-3 py-2.5 text-[13px] whitespace-nowrap transition-colors border-b-2 -mb-px ${
                isActive
                  ? 'text-text font-medium border-primary'
                  : 'text-text-secondary hover:text-text border-transparent'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <div className="py-6">
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsLayout;
