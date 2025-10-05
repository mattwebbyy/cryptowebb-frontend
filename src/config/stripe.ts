// src/config/stripe.ts

import { getEnvValue } from '@/config/runtimeEnv';

type BillingCycle = 'monthly' | 'six_months' | 'yearly';

interface StripePrices {
  basic: Record<BillingCycle, string>;
  pro: Record<BillingCycle, string>;
  enterprise: Record<BillingCycle, string>;
}

interface PlanDetails {
  name: string;
  features: string[];
  basePrice: number;
  popular?: boolean;
}

interface DiscountRates {
  monthly: 0;
  six_months: number;
  yearly: number;
}

export const STRIPE_CONFIG = {
  freeTrialDays: 14,
  publicKey: getEnvValue('VITE_STRIPE_PUBLIC_KEY', ''),
  prices: {
    basic: {
      monthly: getEnvValue('VITE_STRIPE_BASIC_MONTHLY_PRICE_ID', ''),
      six_months: getEnvValue('VITE_STRIPE_BASIC_SIX_MONTHS_PRICE_ID', ''),
      yearly: getEnvValue('VITE_STRIPE_BASIC_YEARLY_PRICE_ID', ''),
    },
    pro: {
      monthly: getEnvValue('VITE_STRIPE_PRO_MONTHLY_PRICE_ID', ''),
      six_months: getEnvValue('VITE_STRIPE_PRO_SIX_MONTHS_PRICE_ID', ''),
      yearly: getEnvValue('VITE_STRIPE_PRO_YEARLY_PRICE_ID', ''),
    },
    enterprise: {
      monthly: getEnvValue('VITE_STRIPE_ENTERPRISE_MONTHLY_PRICE_ID', ''),
      six_months: getEnvValue('VITE_STRIPE_ENTERPRISE_SIX_MONTHS_PRICE_ID', ''),
      yearly: getEnvValue('VITE_STRIPE_ENTERPRISE_YEARLY_PRICE_ID', ''),
    },
  } as StripePrices,
  plans: {
    basic: {
      name: 'Basic',
      features: [
        '10,000 API Calls',
        '5GB Storage',
        'Basic Analytics',
        'Standard Support',
        'Up to 3 Team Members',
      ],
      basePrice: 29,
    },
    pro: {
      name: 'Pro',
      features: [
        '100,000 API Calls',
        '20GB Storage',
        'Advanced Analytics',
        'Priority Support',
        'Up to 10 Team Members',
        'Custom Domain',
      ],
      basePrice: 99,
      popular: true,
    },
    enterprise: {
      name: 'Enterprise',
      features: [
        '1,000,000 API Calls',
        '100GB Storage',
        'Advanced Analytics',
        'Dedicated Support',
        'Up to 100 Team Members',
        'Custom Domain',
      ],
      basePrice: 299,
    },
  } as Record<string, PlanDetails>,
  discounts: {
    monthly: 0, // no discount
    six_months: 0.1, // 10% discount
    yearly: 0.15, // 15% discount
  } as DiscountRates,
};

export const calculatePrice = (basePrice: number, billingCycle: BillingCycle): number => {
  const multiplier = billingCycle === 'monthly' ? 1 : billingCycle === 'six_months' ? 6 : 12;
  const discount = STRIPE_CONFIG.discounts[billingCycle];
  return Math.round(basePrice * multiplier * (1 - discount));
};

export const getPricePerMonth = (basePrice: number, billingCycle: BillingCycle): number => {
  const discount = STRIPE_CONFIG.discounts[billingCycle];
  return Math.round(basePrice * (1 - discount));
};

export const calculateCryptoPrice = (basePrice: number, billingCycle: BillingCycle): number => {
  const cryptoDiscount = 0.2; // 20% discount for crypto payments
  const regularPrice = calculatePrice(basePrice, billingCycle);
  return Math.round(regularPrice * (1 - cryptoDiscount));
};

export const getCryptoPricePerMonth = (basePrice: number, billingCycle: BillingCycle): number => {
  const cryptoDiscount = 0.2; // 20% discount for crypto payments
  const regularPrice = getPricePerMonth(basePrice, billingCycle);
  return Math.round(regularPrice * (1 - cryptoDiscount));
};
