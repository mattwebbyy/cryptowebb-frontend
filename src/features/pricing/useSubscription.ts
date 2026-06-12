// src/features/pricing/useSubscription.ts — current-subscription state for the pricing page.
import { useEffect, useState } from 'react';
import type { PlanTier, UserSubscription } from './types';

// Maps Stripe price IDs to plan tiers. TODO(Phase 4): serve this mapping from the
// backend so frontend and proration logic share one source of truth.
const PRICE_TIER_MAP: Record<string, PlanTier> = {
  // Basic tier
  price_1qoar4ehgug1cysgzmwqvzsn: 'basic', // Basic Monthly
  price_1qojfhehgug1cysgsovk83rz: 'basic', // Basic 6 Months
  price_1qojgeehgug1cysga6vrix4o: 'basic', // Basic Yearly
  // Pro tier
  price_1qoas7ehgug1cysg0pybroux: 'pro', // Pro Monthly
  price_1qojilehgug1cysghjvxwsbz: 'pro', // Pro 6 Months
  price_1qojirehgug1cysg8lbe7glr: 'pro', // Pro Yearly
  // Enterprise tier
  price_1qojjpehgug1cysgchmvtzsw: 'enterprise', // Enterprise Monthly
  price_1qojjsehgug1cysgzaa4stjq: 'enterprise', // Enterprise 6 Months
  price_1qojkmehgug1cysgjllrgpov: 'enterprise', // Enterprise Yearly
};

export const determineTier = (priceId: string): PlanTier | null => {
  const normalizedId = priceId.toLowerCase().replace(/[_-]/g, '');

  for (const [key, tier] of Object.entries(PRICE_TIER_MAP)) {
    const normalizedKey = key.replace(/[_-]/g, '');
    if (normalizedId === normalizedKey) {
      return tier;
    }
  }

  // Fallback: partial match
  for (const [key, tier] of Object.entries(PRICE_TIER_MAP)) {
    const normalizedKey = key.replace(/[_-]/g, '');
    if (normalizedId.includes(normalizedKey) || normalizedKey.includes(normalizedId)) {
      return tier;
    }
  }

  console.warn('Could not determine tier for price ID:', priceId);
  return null;
};

/**
 * Fetches the logged-in user's current subscription (null when logged out,
 * none active, or the request fails). `setSubscription` lets the page apply
 * optimistic updates (e.g. after scheduling a cancellation).
 */
export const useCurrentSubscription = (loggedIn: boolean) => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!loggedIn) {
        setSubscription(null);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setSubscription(null);
        return;
      }

      try {
        const subResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/subscriptions/current`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (subResponse.status === 404) {
          setSubscription(null);
          return;
        }

        if (!subResponse.ok) {
          console.error('Subscription fetch failed:', subResponse.status);
          setSubscription(null);
          return;
        }

        const data = await subResponse.json();
        const tier = determineTier(data.plan_id);

        if (tier) {
          setSubscription({
            id: data.id,
            tier,
            status: data.status,
            currentPeriodEnd: data.current_period_end
              ? new Date(data.current_period_end * 1000).toISOString()
              : '',
            currentPeriodStart: data.current_period_start
              ? new Date(data.current_period_start * 1000).toISOString()
              : '',
            cancelAtPeriodEnd: data.cancel_at_period_end,
            priceId: data.plan_id,
          });
        } else {
          console.error('Could not determine plan tier from price ID:', data.plan_id);
          setSubscription(null);
        }
      } catch (error) {
        console.error('Subscription fetch network/parsing error:', error);
        setSubscription(null);
      }
    };

    fetchSubscriptionData();
  }, [loggedIn]);

  return { subscription, setSubscription };
};
