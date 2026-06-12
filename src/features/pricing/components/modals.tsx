// src/features/pricing/components/modals.tsx — cancel / change-plan / history dialogs.
import { useState } from 'react';
import { format } from 'date-fns';
import { calculatePrice } from '@/config/stripe';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogFooter } from '@/components/ui/Dialog';
import { BillingCycle, SelectedPlan, SubscriptionHistory, billingCycleLabel } from '../types';
import { BillingCycleRadios } from './BillingToggle';
import { PromoCodeField } from './CheckoutPanel';

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export const CancelSubscriptionModal = ({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
}: CancelSubscriptionModalProps) => (
  <Dialog isOpen={isOpen} onClose={onClose} title="Cancel subscription">
    <p className="text-text-secondary text-sm">
      Are you sure you want to cancel your subscription? Your subscription will remain active until
      the end of your current billing period.
    </p>
    <DialogFooter>
      <Button variant="ghost" onClick={onClose}>
        Keep subscription
      </Button>
      <Button variant="destructive" onClick={onConfirm} disabled={isProcessing}>
        {isProcessing ? 'Canceling…' : 'Confirm cancel'}
      </Button>
    </DialogFooter>
  </Dialog>
);

interface ChangePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SelectedPlan | null;
  isDowngrade: boolean;
  billingCycle: BillingCycle;
  setBillingCycle: (cycle: BillingCycle) => void;
  onConfirm: (promoCode: string) => void;
  isProcessing: boolean;
}

export const ChangePlanModal = ({
  isOpen,
  onClose,
  plan,
  isDowngrade,
  billingCycle,
  setBillingCycle,
  onConfirm,
  isProcessing,
}: ChangePlanModalProps) => {
  const [promoCode, setPromoCode] = useState('');
  const fullPrice = calculatePrice(plan?.basePrice || 0, billingCycle);
  const annualSavings = Math.round((plan?.basePrice || 0) * 12 - fullPrice);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`${isDowngrade ? 'Downgrade' : 'Upgrade'} plan`}
    >
      <div className="space-y-5">
        <p className="text-text-secondary text-sm">
          {isDowngrade
            ? 'Are you sure you want to downgrade your plan? You may lose access to some features.'
            : 'Upgrade your plan to access more features and higher limits.'}
        </p>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Billing cycle</h3>
          <BillingCycleRadios
            value={billingCycle}
            onChange={setBillingCycle}
            basePrice={plan?.basePrice || 0}
          />
        </div>

        <PromoCodeField promoCode={promoCode} setPromoCode={setPromoCode} />

        <div className="border-t border-border pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>
              {plan?.name} Plan — {billingCycleLabel(billingCycle)}
            </span>
            <span className="font-mono tabular-nums">${fullPrice}</span>
          </div>
          {billingCycle !== 'monthly' && (
            <div className="flex justify-between text-success">
              <span>Annual savings</span>
              <span className="font-mono tabular-nums">-${annualSavings}</span>
            </div>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => onConfirm(promoCode)} disabled={isProcessing}>
          {isProcessing ? 'Processing…' : 'Confirm change'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

interface SubscriptionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: SubscriptionHistory[];
}

export const SubscriptionHistoryModal = ({
  isOpen,
  onClose,
  history,
}: SubscriptionHistoryModalProps) => (
  <Dialog isOpen={isOpen} onClose={onClose} title="Subscription history">
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {history.length === 0 ? (
        <p className="text-text-secondary text-sm">No subscription history available.</p>
      ) : (
        history.map((sub) => (
          <div key={sub.id} className="border border-border rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">{sub.tier.toUpperCase()} Plan</span>
              <span className="font-mono tabular-nums">${sub.amount}</span>
            </div>
            <div className="text-sm text-text-secondary">
              <div>Start: {format(new Date(sub.startDate), 'PPP')}</div>
              <div>End: {format(new Date(sub.endDate), 'PPP')}</div>
              <div className="capitalize">Status: {sub.status}</div>
            </div>
          </div>
        ))
      )}
    </div>
  </Dialog>
);
