// src/features/pricing/components/CheckoutPanel.tsx — checkout form for a selected plan
// (Stripe card or Base Pay crypto), including promo code and order summary.
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { STRIPE_CONFIG, calculatePrice, calculateCryptoPrice } from '@/config/stripe';
import { useAuth } from '@/hooks/useAuth';
import BasePayment from '@/components/BasePayment';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BillingCycle, PaymentMethod, SelectedPlan, billingCycleLabel } from '../types';
import { BillingCycleRadios } from './BillingToggle';

interface PromoCodeFieldProps {
  promoCode: string;
  setPromoCode: (code: string) => void;
}

export const PromoCodeField = ({ promoCode, setPromoCode }: PromoCodeFieldProps) => {
  const [showInput, setShowInput] = useState(false);

  if (!showInput) {
    return (
      <button
        type="button"
        onClick={() => setShowInput(true)}
        className="text-sm text-primary hover:underline"
      >
        Apply promo code
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        value={promoCode}
        onChange={(e) => setPromoCode(e.target.value)}
        placeholder="Enter promo code"
        aria-label="Promo code"
      />
      <Button type="button" variant="outline">
        Apply
      </Button>
    </div>
  );
};

interface OrderSummaryProps {
  plan: SelectedPlan;
  billingCycle: BillingCycle;
  paymentMethod: PaymentMethod;
}

export const OrderSummary = ({ plan, billingCycle, paymentMethod }: OrderSummaryProps) => {
  const fullPrice = calculatePrice(plan.basePrice, billingCycle);
  const cryptoPrice = calculateCryptoPrice(plan.basePrice, billingCycle);
  const annualSavings = Math.round(plan.basePrice * 12 - fullPrice);

  return (
    <div className="border-t border-border pt-4 space-y-2 text-sm">
      <div className="flex justify-between">
        <span>
          {plan.name} Plan — {billingCycleLabel(billingCycle)}
        </span>
        <span className="font-mono tabular-nums">
          {paymentMethod === 'crypto' ? (
            <>
              <span className="line-through text-text-secondary mr-2">${fullPrice}</span>$
              {cryptoPrice}
            </>
          ) : (
            `$${fullPrice}`
          )}
        </span>
      </div>

      {paymentMethod === 'crypto' && (
        <div className="flex justify-between text-success">
          <span>Crypto discount (20%)</span>
          <span className="font-mono tabular-nums">-${fullPrice - cryptoPrice}</span>
        </div>
      )}

      {billingCycle !== 'monthly' && paymentMethod === 'stripe' && (
        <div className="flex justify-between text-success">
          <span>Annual savings</span>
          <span className="font-mono tabular-nums">-${annualSavings}</span>
        </div>
      )}
    </div>
  );
};

interface CheckoutPanelProps {
  plan: SelectedPlan;
  billingCycle: BillingCycle;
  setBillingCycle: (cycle: BillingCycle) => void;
  paymentMethod: PaymentMethod;
  onBasePaySuccess: (paymentId: string, payerEmail: string) => void;
  onBasePayCancel: () => void;
}

export const CheckoutPanel = ({
  plan,
  billingCycle,
  setBillingCycle,
  paymentMethod,
  onBasePaySuccess,
  onBasePayCancel,
}: CheckoutPanelProps) => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Payment system is not ready yet.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found');
      return;
    }

    if (!email && !user) {
      setError('Please enter your email');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: cardError, paymentMethod: stripePaymentMethod } =
        await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

      if (cardError) throw cardError;
      if (!stripePaymentMethod) throw new Error('Payment method creation failed');

      const formData = {
        priceId: STRIPE_CONFIG.prices[plan.tier][billingCycle],
        paymentMethodId: stripePaymentMethod.id,
        email: user ? undefined : email,
        billingCycle,
        ...(promoCode && { promoCode }),
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (user) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/subscriptions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = 'Failed to create subscription';
        if (responseText) {
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorMessage;
          } catch {
            errorMessage = responseText || 'Server error';
          }
        }
        throw new Error(errorMessage);
      }

      toast.success('Subscription created successfully!');
      setTimeout(() => {
        window.location.href = '/settings';
      }, 1500);
    } catch (err) {
      console.error('Subscription error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto mb-12"
    >
      <div className="bg-surface border border-border rounded-2xl p-6 lg:p-8 space-y-6">
        {/* Billing Cycle Selection */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold tracking-tight">Billing cycle</h3>
          <BillingCycleRadios
            value={billingCycle}
            onChange={setBillingCycle}
            basePrice={plan.basePrice}
          />
        </div>

        {/* Account Creation (if not logged in) */}
        {!user && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold tracking-tight">Create account</h3>
            <Input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              aria-label="Email address"
            />
          </div>
        )}

        {/* Payment Method */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold tracking-tight">Payment</h3>
          {paymentMethod === 'stripe' ? (
            <div className="rounded-lg bg-surface-2 border border-border px-3 py-3 transition-colors focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '15px',
                      color: '#e4e4e7',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      '::placeholder': { color: '#71717a' },
                      iconColor: '#a78bfa',
                    },
                    invalid: { color: '#f87171', iconColor: '#f87171' },
                  },
                }}
              />
            </div>
          ) : (
            <BasePayment
              amount={calculateCryptoPrice(plan.basePrice, billingCycle).toString()}
              planTier={plan.tier}
              billingCycle={billingCycle}
              userEmail={user?.email || email}
              onSuccess={(paymentId: string) => onBasePaySuccess(paymentId, user?.email || email)}
              onCancel={onBasePayCancel}
              testnet={import.meta.env.VITE_BASE_PAY_TESTNET === 'true'}
            />
          )}
        </div>

        {/* Promo Code */}
        <PromoCodeField promoCode={promoCode} setPromoCode={setPromoCode} />

        {/* Summary */}
        <OrderSummary plan={plan} billingCycle={billingCycle} paymentMethod={paymentMethod} />

        {/* Submit — only for Stripe payments (Base Pay has its own flow) */}
        {paymentMethod === 'stripe' && (
          <>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleSubmit}
              disabled={isProcessing || !stripe}
            >
              {isProcessing ? 'Processing…' : 'Subscribe now'}
            </Button>

            {error && (
              <div role="alert" className="text-error text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-text-secondary">
              <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="text-xs">Secure payment</span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};
