// src/pages/settings/SettingsOverview.tsx
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { User, Mail, Calendar, Activity, TrendingUp, CreditCard, Bell, Key } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RESPONSIVE_CLASSES } from '@/config/responsive';
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
  bio?: string;
  lastLogin?: string;
  createdAt?: string;
};

type QuickStat = {
  label: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
};

type APIKeyData = {
  activeKeys: number;
  totalCalls: number;
  callsToday: number;
};

type SubscriptionData = SubscriptionSummary;

const fetchProfile = async (): Promise<Profile> => {
  return await fetchUserProfile();
};

const fetchAPIKeyData = async (): Promise<APIKeyData> => {
  try {
    const keys = await fetchUserApiKeys();
    
    // For now, return mock call data since we don't have usage endpoints
    return {
      activeKeys: keys.length,
      totalCalls: Math.floor(Math.random() * 10000) + 1000, // Mock data
      callsToday: Math.floor(Math.random() * 500) + 50, // Mock data
    };
  } catch (error) {
    return {
      activeKeys: 0,
      totalCalls: 0,
      callsToday: 0,
    };
  }
};

const fetchSubscriptionData = async (): Promise<SubscriptionData> => {
  return await fetchSubscriptionSummary();
};

const SettingsOverview = () => {
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery<Profile>({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  const {
    data: apiKeyData,
    isLoading: apiKeyLoading,
  } = useQuery<APIKeyData>({
    queryKey: ['apiKeyData'],
    queryFn: fetchAPIKeyData,
  });

  const {
    data: subscriptionData,
    isLoading: subscriptionLoading,
  } = useQuery<SubscriptionData>({
    queryKey: ['subscriptionData'],
    queryFn: fetchSubscriptionData,
  });

  const isLoading = profileLoading || apiKeyLoading || subscriptionLoading;
  const error = profileError;

  const quickStats: QuickStat[] = [
    {
      label: 'Active API Keys',
      value: apiKeyData?.activeKeys?.toString() || '0',
      icon: <Key className="h-5 w-5" />,
      change: apiKeyData?.activeKeys ? `${apiKeyData.activeKeys} active` : 'No keys created',
      changeType: apiKeyData?.activeKeys ? 'positive' : 'neutral'
    },
    {
      label: 'API Calls Today',
      value: apiKeyData?.callsToday ? apiKeyData.callsToday.toLocaleString() : '0',
      icon: <TrendingUp className="h-5 w-5" />,
      change: apiKeyData?.totalCalls ? `${apiKeyData.totalCalls.toLocaleString()} total calls` : 'No usage yet',
      changeType: apiKeyData?.callsToday ? 'positive' : 'neutral'
    },
    {
      label: 'Subscription',
      value: subscriptionData?.tier || 'Free',
      icon: <CreditCard className="h-5 w-5" />,
      change: subscriptionData?.daysRemaining 
        ? `Renews in ${subscriptionData.daysRemaining} days`
        : subscriptionData?.status || 'Active',
      changeType: 'neutral'
    },
    {
      label: 'Account Status',
      value: 'Active',
      icon: <Activity className="h-5 w-5" />,
      change: profile?.lastLogin 
        ? `Last login: ${new Date(profile.lastLogin).toLocaleDateString()}`
        : 'Welcome!',
      changeType: 'positive'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background/60 backdrop-blur-sm">
        <div className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-surface/50 rounded-xl w-64"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-surface/50 rounded-xl"></div>
                ))}
              </div>
              <div className="h-64 bg-surface/50 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background/60 backdrop-blur-sm flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center mx-auto">
              <User className="h-6 w-6 text-error" />
            </div>
            <h3 className="text-lg font-semibold text-text">Error Loading Profile</h3>
            <p className="text-text-secondary">{(error as Error).message}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className={`${RESPONSIVE_CLASSES.text.heading} font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent`}>
          Welcome back{profile?.firstName ? `, ${profile.firstName}` : ''}!
        </h1>
        <p className={`text-text-secondary ${RESPONSIVE_CLASSES.text.body}`}>
          Here's your CryptoWebb dashboard overview and account insights.
        </p>
      </div>

      {/* Improved Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 auto-rows-fr min-h-[500px] max-w-full overflow-hidden">
        
        {/* Quick Stats - Individual Cards */}
        {quickStats.map((stat, index) => (
          <Card key={index} className="col-span-1 p-4 bg-surface/95 backdrop-blur-sm border border-border hover:bg-surface transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between min-h-[120px]">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary flex-shrink-0">
                {stat.icon}
              </div>
              <span className="text-xs font-medium text-text-secondary truncate">{stat.label}</span>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-text">{stat.value}</p>
              {stat.change && (
                <p className={`text-xs ${
                  stat.changeType === 'positive' ? 'text-success' :
                  stat.changeType === 'negative' ? 'text-error' :
                  'text-text-secondary'
                }`}>
                  {stat.change}
                </p>
              )}
            </div>
          </Card>
        ))}

        {/* Profile Card - Spans entire row on larger screens */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 p-6 bg-surface/95 backdrop-blur-sm border border-border hover:bg-surface transition-all duration-300 shadow-sm hover:shadow-md min-h-[200px]">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="Profile"
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-primary/20 flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-white" />
                </div>
              )}
              <div className="space-y-1 min-w-0 flex-1">
                <h3 className="text-base font-semibold text-text truncate">
                  {profile?.firstName} {profile?.lastName}
                </h3>
                <p className="text-text-secondary text-sm">Account Manager</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-text-secondary truncate">{profile?.email}</span>
              </div>
              
              {profile?.lastLogin && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-text-secondary">
                    Last login: {new Date(profile.lastLogin).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border">
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Actions Grid - Spans full width on mobile, 2 columns on larger screens */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-24 flex-col gap-2 text-left justify-start p-4 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
            onClick={() => window.location.href = '/analytics'}
          >
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium text-text text-sm">View Analytics</div>
              <div className="text-xs text-text-secondary">Explore your crypto data</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="h-24 flex-col gap-2 text-left justify-start p-4 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
            onClick={() => window.location.href = '/settings/api'}
          >
            <CreditCard className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium text-text text-sm">API Settings</div>
              <div className="text-xs text-text-secondary">Manage your API keys</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="h-24 flex-col gap-2 text-left justify-start p-4 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
            onClick={() => window.location.href = '/alerts'}
          >
            <Bell className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium text-text text-sm">Alerts</div>
              <div className="text-xs text-text-secondary">Manage notifications</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="h-24 flex-col gap-2 text-left justify-start p-4 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
            onClick={() => window.location.href = '/settings/referrals'}
          >
            <Activity className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium text-text text-sm">Referrals</div>
              <div className="text-xs text-text-secondary">Earn rewards</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsOverview;
