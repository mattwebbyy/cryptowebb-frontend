import { describe, expect, it } from 'vitest';
import {
  calculateCryptoPrice,
  calculatePrice,
  getCryptoPricePerMonth,
  getPricePerMonth,
  STRIPE_CONFIG,
} from './stripe';

const billingCycles = [
  { cycle: 'monthly', months: 1 },
  { cycle: 'six_months', months: 6 },
  { cycle: 'yearly', months: 12 },
] as const;

describe('Stripe pricing helpers', () => {
  const basePrice = 100;
  const cryptoDiscountFactor = 1 - 0.2; // 20% crypto discount should apply everywhere

  describe.each(billingCycles)('$cycle billing', ({ cycle, months }) => {
    it('computes the bundled price using configured discounts', () => {
      const discount = STRIPE_CONFIG.discounts[cycle];
      const expected = Math.round(basePrice * months * (1 - discount));

      expect(calculatePrice(basePrice, cycle)).toBe(expected);
    });

    it('returns a per-month price that aligns with the bundled total', () => {
      const discount = STRIPE_CONFIG.discounts[cycle];
      const expectedPerMonth = Math.round(basePrice * (1 - discount));
      const bundledPrice = calculatePrice(basePrice, cycle);

      expect(getPricePerMonth(basePrice, cycle)).toBe(expectedPerMonth);
      expect(getPricePerMonth(basePrice, cycle)).toBe(Math.round(bundledPrice / months));
    });

    it('applies the crypto discount to the bundle total', () => {
      const standard = calculatePrice(basePrice, cycle);
      const expectedCrypto = Math.round(standard * cryptoDiscountFactor);

      expect(calculateCryptoPrice(basePrice, cycle)).toBe(expectedCrypto);
    });

    it('applies the crypto discount to the per-month price', () => {
      const standardPerMonth = getPricePerMonth(basePrice, cycle);
      const expectedCryptoPerMonth = Math.round(standardPerMonth * cryptoDiscountFactor);

      expect(getCryptoPricePerMonth(basePrice, cycle)).toBe(expectedCryptoPerMonth);
    });
  });

  it('rounds prices to the nearest whole number for fractional totals', () => {
    const priceWithFraction = calculatePrice(33, 'six_months');
    const perMonthWithFraction = getPricePerMonth(33, 'six_months');

    expect(priceWithFraction).toBe(Math.round(33 * 6 * (1 - STRIPE_CONFIG.discounts.six_months)));
    expect(perMonthWithFraction).toBe(Math.round(33 * (1 - STRIPE_CONFIG.discounts.six_months)));
  });
});
