// src/api/dashboardApi.ts
import type { AxiosError } from 'axios';
import { apiClient } from './apiClient';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  bio?: string;
  lastLogin?: string | null;
  createdAt?: string;
}

export interface ApiKeySummary {
  id: string;
  label?: string;
  lastUsedAt?: string | null;
  createdAt?: string;
}

export interface SubscriptionSummary {
  tier: string;
  status: string;
  renewalDate?: string;
  daysRemaining?: number;
}

type UserProfileResponse = { user?: UserProfile } | UserProfile;

export const fetchUserProfile = async (): Promise<UserProfile> => {
  const data = await apiClient.get<UserProfileResponse>('/api/v1/users/me');
  if (data && typeof data === 'object' && 'user' in data && data.user) {
    return data.user;
  }
  return data as UserProfile;
};

type ApiKeysResponse = ApiKeySummary[] | { keys?: ApiKeySummary[] } | null;

export const fetchUserApiKeys = async (): Promise<ApiKeySummary[]> => {
  const data = await apiClient.get<ApiKeysResponse>('/api/v1/users/me/api-keys');
  if (Array.isArray(data)) {
    return data;
  }
  if (data?.keys && Array.isArray(data.keys)) {
    return data.keys;
  }
  return [];
};

type SubscriptionApiResponse = {
  tier?: string;
  plan?: string;
  status?: string;
  state?: string;
  renewalDate?: string;
  nextBillingDate?: string;
  daysRemaining?: number;
  days_until_renewal?: number;
} | null;

export const fetchSubscriptionSummary = async (): Promise<SubscriptionSummary> => {
  try {
    const data = await apiClient.get<SubscriptionApiResponse>('/api/v1/billing/subscription');
    if (data) {
      const tier = data.tier || data.plan || 'Free';
      const status = data.status || data.state || 'Active';
      const renewalDate = data.renewalDate || data.nextBillingDate;
      const daysRemaining = data.daysRemaining ?? data.days_until_renewal;
      return {
        tier,
        status,
        renewalDate,
        daysRemaining,
      };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.warn('Failed to fetch subscription summary, falling back to defaults.', axiosError.message);
  }

  return {
    tier: 'Free',
    status: 'Active',
  };
};
