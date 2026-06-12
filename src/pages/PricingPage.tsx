// src/pages/PricingPage.tsx — plan grid + checkout, composed from features/pricing.
import React, { useState } from 'react';
import { History, X } from 'lucide-react';
import { toast } from 'sonner';
import { STRIPE_CONFIG, calculateCryptoPrice } from '../config/stripe';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/Button';
import {
  BillingCycle,
  PaymentMethod,
  PlanTier,
  SelectedPlan,
  SubscriptionHistory,
  isDowngradeFrom,
  planIcons,
} from '@/features/pricing/types';
import { useCurrentSubscription } from '@/features/pricing/useSubscription';
import {
  PaymentMethodToggle,
  BillingCycleToggle,
} from '@/features/pricing/components/BillingToggle';
import { PlanCard } from '@/features/pricing/components/PlanCard';
import { CheckoutPanel } from '@/features/pricing/components/CheckoutPanel';
import {
  CancelSubscriptionModal,
  ChangePlanModal,
  SubscriptionHistoryModal,
} from '@/features/pricing/components/modals';

const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const { subscription: currentSubscription, setSubscription } = useCurrentSubscription(!!user);

  const [selectedTier, setSelectedTier] = useState<PlanTier | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [showHistory, setShowHistory] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  // History endpoint not implemented yet; modal shows the empty state.
  const [subscriptionHistory] = useState<SubscriptionHistory[]>([]);

  const selectedPlan: SelectedPlan | null = selectedTier
    ? {
        tier: selectedTier,
        name: STRIPE_CONFIG.plans[selectedTier].name,
        basePrice: STRIPE_CONFIG.plans[selectedTier].basePrice,
        features: STRIPE_CONFIG.plans[selectedTier].features,
        popular: STRIPE_CONFIG.plans[selectedTier].popular,
        icon: planIcons[selectedTier],
      }
    : null;

  const getSubscriptionTimeRemaining = () => {
    if (!currentSubscription?.currentPeriodEnd) return null;
    const endDate = new Date(currentSubscription.currentPeriodEnd);
    const days = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const handleSelectPlan = (tier: PlanTier) => {
    if (currentSubscription?.tier === tier) return;

    setSelectedTier(tier);
    if (currentSubscription) {
      setShowChangeModal(true);
    } else {
      setShowPaymentForm(true);
    }
  };

  const handleCancelSubscription = async () => {
    if (!currentSubscription) {
      toast.error('No active subscription found to cancel.');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/subscriptions/${currentSubscription.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        let errorMsg = 'Failed to request subscription cancellation.';
        try {
          const body = await response.json();
          errorMsg = body.error || body.message || errorMsg;
        } catch {
          // Non-JSON error body — keep the default message.
        }
        throw new Error(errorMsg);
      }

      toast.success('Subscription cancellation scheduled successfully!');
      setShowCancelModal(false);
      setSubscription((prev) => (prev ? { ...prev, cancelAtPeriodEnd: true } : null));
    } catch (error) {
      console.error('Cancel error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to cancel subscription');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangePlan = async (promoCode: string) => {
    if (!selectedPlan) return;

    // Crypto plan changes require a fresh payment rather than a Stripe update.
    if (paymentMethod === 'crypto') {
      toast.info('Please complete payment to change your plan.');
      setShowChangeModal(false);
      setShowPaymentForm(true);
      return;
    }

    try {
      setIsChangingPlan(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/subscriptions/${currentSubscription?.id}/change`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            newPriceId: STRIPE_CONFIG.prices[selectedPlan.tier][billingCycle],
            promoCode: promoCode || undefined,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to change subscription plan');
      }

      toast.success('Subscription plan changed successfully');
      setShowChangeModal(false);
      window.location.reload();
    } catch (error) {
      console.error('Change plan error:', error);
      toast.error('Failed to change subscription plan');
    } finally {
      setIsChangingPlan(false);
    }
  };

  const handleBasePaySuccess = async (paymentId: string, payerEmail: string) => {
    if (!selectedPlan) return;

    setIsProcessing(true);

    try {
      const cryptoPrice = calculateCryptoPrice(selectedPlan.basePrice, billingCycle);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/base-pay/complete`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            paymentId,
            planTier: selectedPlan.tier,
            billingCycle,
            amount: cryptoPrice,
            payerEmail,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete subscription');
      }

      toast.success('Subscription activated successfully!');
      setTimeout(() => {
        window.location.href = '/analytics';
      }, 1500);
    } catch (err) {
      console.error('Subscription completion error:', err);
      toast.error(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBasePayCancel = () => {
    setShowPaymentForm(false);
    setSelectedTier(null);
  };

  return (
    <div className="relative w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12 pt-24">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Choose your plan</h1>
          <p className="text-lg text-text-secondary">
            Scale your capabilities with flexible pricing.
          </p>

          {currentSubscription && (
            <div className="mt-5 flex flex-col sm:flex-row justify-center gap-3">
              <Button variant="outline" onClick={() => setShowHistory(true)}>
                <History className="w-4 h-4 mr-2" aria-hidden="true" />
                Subscription history
              </Button>
              {!currentSubscription.cancelAtPeriodEnd && (
                <Button
                  variant="outline"
                  className="border-error/40 text-error hover:border-error hover:bg-error/10"
                  onClick={() => setShowCancelModal(true)}
                >
                  <X className="w-4 h-4 mr-2" aria-hidden="true" />
                  Cancel subscription
                </Button>
              )}
            </div>
          )}

          {/* Payment Method and Billing Cycle Toggles */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-8">
            <PaymentMethodToggle value={paymentMethod} onChange={setPaymentMethod} />
            <BillingCycleToggle value={billingCycle} onChange={setBillingCycle} />
          </div>
        </div>

        {/* Plan Selection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 pt-3">
          {Object.entries(STRIPE_CONFIG.plans).map(([tier, plan]) => (
            <PlanCard
              key={tier}
              tier={tier as PlanTier}
              name={plan.name}
              basePrice={plan.basePrice}
              features={plan.features}
              popular={plan.popular}
              paymentMethod={paymentMethod}
              billingCycle={billingCycle}
              selected={selectedTier === tier}
              isCurrentSub={currentSubscription?.tier === tier}
              cancelAtPeriodEnd={currentSubscription?.cancelAtPeriodEnd}
              daysRemaining={
                currentSubscription?.tier === tier ? getSubscriptionTimeRemaining() : null
              }
              isDowngrade={isDowngradeFrom(currentSubscription?.tier, tier as PlanTier)}
              hasSubscription={!!currentSubscription}
              onSelect={handleSelectPlan}
            />
          ))}
        </div>

        {/* Checkout */}
        {showPaymentForm && selectedPlan && (
          <CheckoutPanel
            plan={selectedPlan}
            billingCycle={billingCycle}
            setBillingCycle={setBillingCycle}
            paymentMethod={paymentMethod}
            onBasePaySuccess={handleBasePaySuccess}
            onBasePayCancel={handleBasePayCancel}
          />
        )}

        {/* Modals */}
        <CancelSubscriptionModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancelSubscription}
          isProcessing={isProcessing}
        />

        <ChangePlanModal
          isOpen={showChangeModal}
          onClose={() => setShowChangeModal(false)}
          plan={selectedPlan}
          isDowngrade={isDowngradeFrom(currentSubscription?.tier, selectedTier ?? 'basic')}
          billingCycle={billingCycle}
          setBillingCycle={setBillingCycle}
          onConfirm={handleChangePlan}
          isProcessing={isChangingPlan}
        />

        <SubscriptionHistoryModal
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          history={subscriptionHistory}
        />
      </div>
    </div>
  );
};

export default PricingPage;
