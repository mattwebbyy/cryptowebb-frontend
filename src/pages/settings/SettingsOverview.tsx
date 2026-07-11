// src/pages/settings/SettingsOverview.tsx — account summary: identity,
// plan, keys and shortcuts. Real data only; sections link to where each
// thing is managed.
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { User, ChevronRight, KeyRound, CreditCard, Share2, Bell } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  fetchUserProfile,
  fetchUserApiKeys,
  fetchSubscriptionSummary,
  type SubscriptionSummary,
} from '@/api/dashboardApi';

type Profile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  lastLogin?: string | null;
  createdAt?: string;
};

const rowClass =
  'flex items-center justify-between gap-4 px-4 py-3.5 border-b border-border last:border-0';

const SettingsOverview = () => {
  const { data: profile, isLoading, error } = useQuery<Profile>({
    queryKey: ['profile'],
    queryFn: fetchUserProfile,
  });

  const { data: apiKeys } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: fetchUserApiKeys,
    retry: 1,
  });

  const { data: subscription } = useQuery<SubscriptionSummary>({
    queryKey: ['subscription-summary'],
    queryFn: fetchSubscriptionSummary,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-16 rounded-md bg-surface-2" />
        <div className="h-48 rounded-md bg-surface-2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-border bg-surface p-8 text-center">
        <p className="text-sm text-text-secondary mb-4">
          Couldn't load your account: {(error as Error).message}
        </p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ');
  const keyCount = Array.isArray(apiKeys) ? apiKeys.length : 0;

  return (
    <div className="space-y-6">
      {/* Identity */}
      <div className="rounded-md border border-border bg-surface p-5 flex items-center gap-4">
        {profile?.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt=""
            className="w-12 h-12 rounded-md object-cover border border-border"
          />
        ) : (
          <div className="w-12 h-12 rounded-md bg-surface-2 border border-border flex items-center justify-center">
            <User className="w-5 h-5 text-text-secondary" aria-hidden="true" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold truncate">{fullName || 'Your account'}</div>
          <div className="text-[13px] text-text-secondary truncate">{profile?.email}</div>
          {profile?.lastLogin && (
            <div className="text-xs text-text-secondary/70 mt-0.5">
              Last signed in {new Date(profile.lastLogin).toLocaleDateString()}
            </div>
          )}
        </div>
        <Link to="/settings/profile">
          <Button variant="outline" size="sm">Edit profile</Button>
        </Link>
      </div>

      {/* Account rows */}
      <div className="rounded-md border border-border bg-surface">
        <div className={rowClass}>
          <div className="flex items-center gap-3 min-w-0">
            <CreditCard className="w-4 h-4 text-text-secondary shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <div className="text-sm font-medium">Subscription</div>
              <div className="text-[13px] text-text-secondary">
                <span className="capitalize">{subscription?.tier || 'Free'}</span>
                {subscription?.daysRemaining
                  ? ` · renews in ${subscription.daysRemaining} days`
                  : subscription?.status
                    ? ` · ${subscription.status.toLowerCase()}`
                    : ''}
              </div>
            </div>
          </div>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-1 text-[13px] text-text-secondary hover:text-text transition-colors shrink-0"
          >
            Manage plan
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className={rowClass}>
          <div className="flex items-center gap-3 min-w-0">
            <KeyRound className="w-4 h-4 text-text-secondary shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <div className="text-sm font-medium">API keys</div>
              <div className="text-[13px] text-text-secondary">
                {keyCount === 0 ? 'No active keys' : `${keyCount} active key${keyCount === 1 ? '' : 's'}`}
              </div>
            </div>
          </div>
          <Link
            to="/settings/api"
            className="inline-flex items-center gap-1 text-[13px] text-text-secondary hover:text-text transition-colors shrink-0"
          >
            Manage keys
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className={rowClass}>
          <div className="flex items-center gap-3 min-w-0">
            <Bell className="w-4 h-4 text-text-secondary shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <div className="text-sm font-medium">Alerts</div>
              <div className="text-[13px] text-text-secondary">
                Metric thresholds, email and webhook notifications
              </div>
            </div>
          </div>
          <Link
            to="/alerts"
            className="inline-flex items-center gap-1 text-[13px] text-text-secondary hover:text-text transition-colors shrink-0"
          >
            Open alerts
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className={rowClass}>
          <div className="flex items-center gap-3 min-w-0">
            <Share2 className="w-4 h-4 text-text-secondary shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <div className="text-sm font-medium">Referrals</div>
              <div className="text-[13px] text-text-secondary">
                Share your referral link and track your codes
              </div>
            </div>
          </div>
          <Link
            to="/settings/referrals"
            className="inline-flex items-center gap-1 text-[13px] text-text-secondary hover:text-text transition-colors shrink-0"
          >
            Manage referrals
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SettingsOverview;
