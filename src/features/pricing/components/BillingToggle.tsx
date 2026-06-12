// src/features/pricing/components/BillingToggle.tsx — payment-method and billing-cycle pickers.
import { getPricePerMonth } from '@/config/stripe';
import { BillingCycle, PaymentMethod, billingCycleLabel } from '../types';

const segmentClasses = (active: boolean) =>
  `px-4 py-2 rounded-lg text-sm transition-colors ${
    active ? 'bg-primary text-white' : 'text-text-secondary hover:text-text'
  }`;

interface PaymentMethodToggleProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export const PaymentMethodToggle = ({ value, onChange }: PaymentMethodToggleProps) => (
  <div className="flex flex-col items-center">
    <span className="text-sm font-medium text-text-secondary mb-2">Payment method</span>
    <div className="flex bg-surface-2 rounded-lg p-1" role="group" aria-label="Payment method">
      <button
        onClick={() => onChange('stripe')}
        aria-pressed={value === 'stripe'}
        className={segmentClasses(value === 'stripe')}
      >
        💳 Card (USD)
      </button>
      <button
        onClick={() => onChange('crypto')}
        aria-pressed={value === 'crypto'}
        className={segmentClasses(value === 'crypto')}
      >
        ₿ Crypto (−20%)
      </button>
    </div>
  </div>
);

interface BillingCycleToggleProps {
  value: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}

export const BillingCycleToggle = ({ value, onChange }: BillingCycleToggleProps) => (
  <div className="flex flex-col items-center">
    <span className="text-sm font-medium text-text-secondary mb-2">Billing cycle</span>
    <div className="flex bg-surface-2 rounded-lg p-1" role="group" aria-label="Billing cycle">
      {(['monthly', 'six_months', 'yearly'] as const).map((cycle) => (
        <button
          key={cycle}
          onClick={() => onChange(cycle)}
          aria-pressed={value === cycle}
          className={segmentClasses(value === cycle)}
        >
          {billingCycleLabel(cycle)}
        </button>
      ))}
    </div>
  </div>
);

interface BillingCycleRadiosProps {
  value: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
  basePrice: number;
}

/** Radio-list variant used inside the checkout panel and plan-change modal. */
export const BillingCycleRadios = ({ value, onChange, basePrice }: BillingCycleRadiosProps) => (
  <div className="space-y-3">
    {(['monthly', 'six_months', 'yearly'] as const).map((cycle) => (
      <label
        key={cycle}
        className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer transition-colors hover:border-primary/40"
      >
        <div className="flex items-center">
          <input
            type="radio"
            name="billing-cycle"
            checked={value === cycle}
            onChange={() => onChange(cycle)}
            className="mr-3 accent-[var(--color-primary)]"
          />
          <span>{billingCycleLabel(cycle)}</span>
        </div>
        <span className="font-mono tabular-nums">${getPricePerMonth(basePrice, cycle)}/mo</span>
      </label>
    ))}
  </div>
);
