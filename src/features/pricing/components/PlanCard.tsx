// src/features/pricing/components/PlanCard.tsx — a single plan in the pricing grid.
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { getPricePerMonth, getCryptoPricePerMonth } from '@/config/stripe';
import { BillingCycle, PaymentMethod, PlanTier, planIcons } from '../types';

interface PlanCardProps {
  tier: PlanTier;
  name: string;
  basePrice: number;
  features: string[];
  popular?: boolean;
  paymentMethod: PaymentMethod;
  billingCycle: BillingCycle;
  selected: boolean;
  isCurrentSub: boolean;
  cancelAtPeriodEnd?: boolean;
  daysRemaining?: number | null;
  isDowngrade: boolean;
  hasSubscription: boolean;
  onSelect: (tier: PlanTier) => void;
}

export const PlanCard = ({
  tier,
  name,
  basePrice,
  features,
  popular,
  paymentMethod,
  billingCycle,
  selected,
  isCurrentSub,
  cancelAtPeriodEnd,
  daysRemaining,
  isDowngrade,
  hasSubscription,
  onSelect,
}: PlanCardProps) => {
  const Icon = planIcons[tier];

  return (
    <motion.div
      whileHover={{ scale: isCurrentSub ? 1 : 1.01 }}
      className={`relative rounded-2xl border bg-surface p-6 flex flex-col transition-colors ${
        isCurrentSub ? 'cursor-default border-primary/50' : 'cursor-pointer hover:border-primary/40'
      } ${popular ? 'border-primary' : 'border-border'} ${
        selected ? 'border-primary ring-2 ring-primary/20' : ''
      }`}
      onClick={() => onSelect(tier)}
    >
      {popular && !isCurrentSub && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-white text-xs font-medium rounded-full">
          Most popular
        </div>
      )}

      {isCurrentSub && (
        <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
          <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">Current plan</span>
          {cancelAtPeriodEnd && (
            <span className="px-2 py-1 bg-error/10 text-error text-xs rounded-full">
              Cancels at period end
            </span>
          )}
          {daysRemaining != null && (
            <span className="px-2 py-1 text-text-secondary text-xs">
              {daysRemaining} days remaining
            </span>
          )}
        </div>
      )}

      <div className="flex-grow">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold tracking-tight mb-2">{name}</h3>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums mb-4">
            {paymentMethod === 'crypto' ? (
              <>
                <span className="line-through text-text-secondary text-xl mr-2">
                  ${getPricePerMonth(basePrice, billingCycle)}
                </span>
                ${getCryptoPricePerMonth(basePrice, billingCycle)}
              </>
            ) : (
              `$${getPricePerMonth(basePrice, billingCycle)}`
            )}
            <span className="text-base font-sans font-normal text-text-secondary">/month</span>
            {paymentMethod === 'crypto' && (
              <div className="text-sm font-sans text-success font-normal">
                20% crypto discount applied
              </div>
            )}
          </div>
        </div>

        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check
                className="w-4 h-4 text-success mr-2.5 mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="text-sm text-text-secondary">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto">
        <button
          className={`w-full py-3 rounded-lg font-semibold min-h-[44px] text-sm transition-colors ${
            isCurrentSub
              ? 'bg-surface-2 text-text-secondary cursor-not-allowed'
              : selected
                ? 'bg-primary text-white'
                : 'border border-primary text-primary hover:bg-primary/10'
          }`}
          disabled={isCurrentSub}
        >
          {isCurrentSub
            ? 'Current plan'
            : selected
              ? 'Selected'
              : isDowngrade
                ? 'Downgrade'
                : hasSubscription
                  ? 'Upgrade'
                  : 'Select plan'}
        </button>
      </div>
    </motion.div>
  );
};
