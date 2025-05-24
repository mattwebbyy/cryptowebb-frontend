// src/config/stripe.test.ts
import { calculatePrice, getPricePerMonth, STRIPE_CONFIG } from './stripe';

// Mock the config slightly for predictable tests if needed,
// or use the real config values if they are simple numbers.
// Here, we assume basePrice and discounts are numbers as defined.

describe('Stripe Price Calculations', () => {
  const basePrice = 100; // Example base price

  describe('calculatePrice', () => {
    it('should calculate monthly price correctly (no discount)', () => {
      const price = calculatePrice(basePrice, 'monthly');
      // Base * 1 month * (1 - 0% discount)
      expect(price).toBe(100);
    });

    it('should calculate six-month price correctly (with discount)', () => {
      const price = calculatePrice(basePrice, 'six_months');
      // Base * 6 months * (1 - 10% discount) = 100 * 6 * 0.9 = 540
      const expectedPrice = Math.round(basePrice * 6 * (1 - STRIPE_CONFIG.discounts.six_months));
      expect(price).toBe(expectedPrice); // Should be 540
    });

    it('should calculate yearly price correctly (with discount)', () => {
      const price = calculatePrice(basePrice, 'yearly');
      // Base * 12 months * (1 - 15% discount) = 100 * 12 * 0.85 = 1020
      const expectedPrice = Math.round(basePrice * 12 * (1 - STRIPE_CONFIG.discounts.yearly));
      expect(price).toBe(expectedPrice); // Should be 1020
    });
  });

  describe('getPricePerMonth', () => {
    it('should calculate effective monthly price for monthly billing', () => {
      const pricePerMonth = getPricePerMonth(basePrice, 'monthly');
      expect(pricePerMonth).toBe(100); // 100 * (1 - 0)
    });

    it('should calculate effective monthly price for six-month billing', () => {
      const pricePerMonth = getPricePerMonth(basePrice, 'six_months');
      const expectedPrice = Math.round(basePrice * (1 - STRIPE_CONFIG.discounts.six_months));
      expect(pricePerMonth).toBe(expectedPrice); // Should be 90 (100 * 0.9)
    });

    it('should calculate effective monthly price for yearly billing', () => {
      const pricePerMonth = getPricePerMonth(basePrice, 'yearly');
       const expectedPrice = Math.round(basePrice * (1 - STRIPE_CONFIG.discounts.yearly));
      expect(pricePerMonth).toBe(expectedPrice); // Should be 85 (100 * 0.85)
    });
  });
});