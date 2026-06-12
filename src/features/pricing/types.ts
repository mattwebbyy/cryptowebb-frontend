// src/features/pricing/types.ts — shared types for the pricing/checkout feature.
import React from 'react';
import { Rocket, Crown, Building2 } from 'lucide-react';

export type BillingCycle = 'monthly' | 'six_months' | 'yearly';
export type PlanTier = 'basic' | 'pro' | 'enterprise';
export type PaymentMethod = 'stripe' | 'crypto';

export interface SelectedPlan {
  tier: PlanTier;
  name: string;
  basePrice: number;
  features: string[];
  popular?: boolean;
  icon: React.ElementType;
}

export interface UserSubscription {
  id: string;
  tier: PlanTier;
  status: string;
  currentPeriodEnd: string;
  currentPeriodStart: string;
  cancelAtPeriodEnd: boolean;
  priceId: string;
}

export interface SubscriptionHistory {
  id: string;
  tier: PlanTier;
  status: string;
  startDate: string;
  endDate: string;
  amount: number;
}

export const planIcons: Record<PlanTier, React.ElementType> = {
  basic: Rocket,
  pro: Crown,
  enterprise: Building2,
};

export const billingCycleLabel = (cycle: BillingCycle): string =>
  cycle === 'monthly' ? 'Monthly' : cycle === 'six_months' ? '6 Months' : 'Yearly';

const tierOrder: Record<PlanTier, number> = { basic: 0, pro: 1, enterprise: 2 };

export const isDowngradeFrom = (current: PlanTier | undefined, next: PlanTier): boolean =>
  current !== undefined && tierOrder[next] < tierOrder[current];
