import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import {
  FaCheck,
  FaCreditCard,
  FaLock,
  FaRocket,
  FaCrown,
  FaBuilding,
  FaHistory,
  FaTimes,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { STRIPE_CONFIG, calculatePrice, getPricePerMonth } from '../config/stripe';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';

type BillingCycle = 'monthly' | 'six_months' | 'yearly';
type PlanTier = 'basic' | 'pro' | 'enterprise';

interface SelectedPlan {
  tier: PlanTier;
  name: string;
  basePrice: number;
  features: string[];
  popular?: boolean;
  icon: React.ElementType;
}

interface UserSubscription {
  id: string;
  tier: PlanTier;
  status: string;
  currentPeriodEnd: string;
  currentPeriodStart: string;
  cancelAtPeriodEnd: boolean;
  priceId: string;
}

interface SubscriptionHistory {
  id: string;
  tier: PlanTier;
  status: string;
  startDate: string;
  endDate: string;
  amount: number;
}

const planIcons: Record<PlanTier, React.ElementType> = {
  basic: FaRocket,
  pro: FaCrown,
  enterprise: FaBuilding,
};

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-black border-2 border-matrix-green rounded-xl p-6 max-w-2xl w-full m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-matrix-green">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-matrix-green">
            <FaTimes />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [selectedTier, setSelectedTier] = useState<PlanTier | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');
  const [promoCode, setPromoCode] = useState('');
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState<SubscriptionHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [isChangingPlan, setIsChangingPlan] = useState(false);

  const determineTier = (priceId: string): PlanTier | null => {
    const id = priceId.toLowerCase();
    const priceMap: Record<string, PlanTier> = {
      'price_1qoar4ehgug1cYsgzmwqvzsn': 'basic',
      'price_1qojfhehgug1cysgsovk83rz': 'basic',
      'price_1qojgeehgug1cysga6vrix4o': 'basic',
      'price_1qoas7ehgug1cysg0pybroux': 'pro',
      'price_1qojilehgug1cysghjvxwsbz': 'pro',
      'price_1qojjpehgug1cysgchmvtzsw': 'enterprise',
      'price_1qojjsehgug1cysgzaa4stjq': 'enterprise',
      'price_1qojkmehgug1cysgjllrgpov': 'enterprise',
    };

    const normalizedId = priceId.toLowerCase().replace(/[_-]/g, '');

    for (const [key, tier] of Object.entries(priceMap)) {
      if (normalizedId.includes(key.replace(/[_-]/g, ''))) {
        return tier;
      }
    }

    return null;
  };

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!user) {
        console.log('No user, skipping fetch');
        return;
      }

      try {
        console.log('Starting subscription fetch...');
        const subResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/subscriptions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        console.log('Response received:', subResponse.status);
        const responseText = await subResponse.text();
        console.log('Raw response:', responseText);

        if (subResponse.ok) {
          const data = JSON.parse(responseText);
          console.log('Parsed data:', data);

          const tier = determineTier(data.plan_id);
          console.log('Determined tier from price ID:', data.plan_id, '→', tier);

          if (tier) {
            const subscriptionData = {
              id: data.id,
              tier,
              status: data.status,
              currentPeriodEnd: data.current_period_end,
              currentPeriodStart: data.current_period_start,
              cancelAtPeriodEnd: data.cancel_at_period_end,
              priceId: data.plan_id,
            };

            console.log('Setting subscription data:', subscriptionData);
            setCurrentSubscription(subscriptionData);
          } else {
            console.error('Could not determine tier from price ID:', data.plan_id);
          }
        }
      } catch (error) {
        console.error('Subscription fetch error:', error);
      }
    };

    fetchSubscriptionData();
  }, [user]);

  useEffect(() => {
    console.log('Current subscription state:', currentSubscription);
  }, [currentSubscription]);

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

  const handleCancelSubscription = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/subscriptions/${currentSubscription?.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      toast.success('Subscription cancelled successfully');
      setShowCancelModal(false);
      window.location.reload();
    } catch (error) {
      console.error('Cancel error:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangePlan = async () => {
    if (!selectedPlan) return;

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

  const getAnnualSavings = (): number => {
    if (!selectedPlan) return 0;
    const monthlyTotal = selectedPlan.basePrice * 12;
    const actualTotal = calculatePrice(selectedPlan.basePrice, billingCycle);
    return Math.round(monthlyTotal - actualTotal);
  };

  const getSubscriptionTimeRemaining = () => {
    if (!currentSubscription?.currentPeriodEnd) return null;
    const endDate = new Date(currentSubscription.currentPeriodEnd);
    const now = new Date();
    const days = Math.ceil(
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  const isDowngrade = (newTier: PlanTier) => {
    const tierValues = { basic: 0, pro: 1, enterprise: 2 };
    return currentSubscription && tierValues[newTier] < tierValues[currentSubscription.tier];
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !selectedPlan) {
      setError('Please select a plan');
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
      const { error: cardError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (cardError) {
        throw cardError;
      }

      if (!paymentMethod) {
        throw new Error('Payment method creation failed');
      }

      const formData = {
        priceId: STRIPE_CONFIG.prices[selectedPlan.tier][billingCycle],
        paymentMethodId: paymentMethod.id,
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

      try {
        console.log('Sending request with data:', formData);

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/subscriptions`, {
          method: 'POST',
          headers,
          body: JSON.stringify(formData),
          credentials: 'include',
        });

        const responseText = await response.text();
        console.log('Raw server response:', responseText);

        if (!response.ok) {
          let errorMessage = 'Failed to create subscription';

          if (responseText) {
            try {
              const errorData = JSON.parse(responseText);
              errorMessage = errorData.error || errorMessage;
            } catch (parseError) {
              console.error('Failed to parse error response:', parseError);
              errorMessage = responseText || 'Server error';
            }
          }

          throw new Error(errorMessage);
        }

        toast.success('Subscription created successfully!');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } catch (err) {
        console.error('Subscription error:', err);
        const errorMessage =
          err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (stripeErr) {
      console.error('Stripe error:', stripeErr);
      const errorMessage =
        stripeErr instanceof Error ? stripeErr.message : 'Failed to process payment method';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFreeTrialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!stripe || !elements || !selectedPlan) {
      setError('Please select a plan');
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
      const { error: cardError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
  
      if (cardError) {
        throw cardError;
      }
  
      if (!paymentMethod) {
        throw new Error('Payment method creation failed');
      }
  
      const formData = {
        priceId: STRIPE_CONFIG.prices[selectedPlan.tier][billingCycle],
        paymentMethodId: paymentMethod.id,
        email: user ? undefined : email,
        billingCycle,
        // DO NOT pass trialPeriodDays from client; free trial is forced on backend.
      };
  
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (user) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      }
  
      console.log('Sending free trial request with data:', formData);
  
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/subscriptions/free-trial`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
        credentials: 'include',
      });
  
      const responseText = await response.text();
      console.log('Raw server response (free trial):', responseText);
  
      if (!response.ok) {
        let errorMessage = 'Failed to create free trial subscription';
        if (responseText) {
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorMessage;
          } catch (parseError) {
            console.error('Failed to parse error response:', parseError);
            errorMessage = responseText || 'Server error';
          }
        }
        throw new Error(errorMessage);
      }
  
      toast.success('Free trial subscription created successfully!');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err) {
      console.error('Free trial subscription error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };
  

  return (
    <div className="relative w-full min-h-screen text-matrix-green">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-xl">Scale your capabilities with our flexible pricing</p>

            {currentSubscription && (
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={() => setShowHistory(true)}
                  className="px-4 py-2 bg-matrix-green/20 text-matrix-green rounded hover:bg-matrix-green/30"
                >
                  <FaHistory className="inline mr-2" />
                  Subscription History
                </button>
                {!currentSubscription.cancelAtPeriodEnd && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="px-4 py-2 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30"
                  >
                    <FaTimes className="inline mr-2" />
                    Cancel Subscription
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Plan Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {Object.entries(STRIPE_CONFIG.plans).map(([tier, plan]) => {
              const Icon = planIcons[tier as PlanTier];
              const isCurrentSub = currentSubscription?.tier === tier;
              const daysRemaining = getSubscriptionTimeRemaining();

              return (
                <motion.div
                  key={tier}
                  whileHover={{ scale: isCurrentSub ? 1 : 1.01 }}
                  className={`relative rounded-xl border-2 ${
                    isCurrentSub ? 'cursor-default border-matrix-green/50' : 'cursor-pointer'
                  } ${plan.popular ? 'border-matrix-green' : 'border-gray-700'} ${
                    selectedTier === tier ? 'border-matrix-green bg-matrix-green/10' : ''
                  } ${isCurrentSub ? 'border-matrix-green/50' : ''} bg-black p-6 shadow-xl flex flex-col`}
                  onClick={() => handleSelectPlan(tier as PlanTier)}
                >
                  {isCurrentSub && (
                    <>
                      <div className="absolute top-4 right-4 px-2 py-1 bg-matrix-green text-black text-sm rounded-full">
                        Current Plan
                      </div>
                      {currentSubscription.cancelAtPeriodEnd && (
                        <div className="absolute top-14 right-4 px-2 py-1 bg-red-500/20 text-red-500 text-xs rounded-full">
                          Cancels at period end
                        </div>
                      )}
                      {daysRemaining && (
                        <div className="absolute top-20 right-4 px-2 py-1 text-matrix-green text-xs">
                          {daysRemaining} days remaining
                        </div>
                      )}
                    </>
                  )}
<div className="flex-grow">
                  <div className="text-center mb-8">
                    <Icon className="w-12 h-12 mx-auto mb-4 text-matrix-green" />
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold mb-4">
                      ${getPricePerMonth(plan.basePrice, billingCycle)}
                      <span className="text-lg font-normal">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <FaCheck className="w-5 h-5 text-matrix-green mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  </div>
                  <div className="mt-auto"> 
                  <button
                    className={`w-full py-3 rounded-lg font-semibold ${
                      isCurrentSub
                        ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                        : selectedTier === tier
                        ? 'bg-matrix-green text-black'
                        : 'border border-matrix-green text-matrix-green hover:bg-matrix-green/10'
                    }`}
                    disabled={isCurrentSub}
                  >
                    {isCurrentSub
                      ? 'Current Plan'
                      : selectedTier === tier
                      ? 'Selected'
                      : isDowngrade(tier as PlanTier)
                      ? 'Downgrade'
                      : currentSubscription
                      ? 'Upgrade'
                      : 'Select Plan'}
                  </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Payment Form */}
          {showPaymentForm && selectedPlan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto mb-12"
            >
              <div className="bg-black/30 border-2 border-matrix-green rounded-xl p-8 space-y-8">
                {/* Billing Cycle Selection */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">Billing Cycle</h3>
                  <div className="space-y-3">
                    {['monthly', 'six_months', 'yearly'].map((cycle) => (
                      <label
                        key={cycle}
                        className="flex items-center justify-between p-3 border border-gray-700 rounded cursor-pointer hover:border-matrix-green"
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            checked={billingCycle === cycle}
                            onChange={() => setBillingCycle(cycle as BillingCycle)}
                            className="mr-3"
                          />
                          <span>
                            {cycle === 'monthly'
                              ? 'Monthly'
                              : cycle === 'six_months'
                              ? '6 Months'
                              : 'Yearly'}
                          </span>
                        </div>
                        <span>${getPricePerMonth(selectedPlan.basePrice, cycle as BillingCycle)}/mo</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Account Creation (if not logged in) */}
                {!user && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Create Account</h3>
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 bg-black rounded border border-gray-700 text-matrix-green focus:border-matrix-green focus:ring-1 focus:ring-matrix-green"
                    />
                  </div>
                )}

                {/* Payment Method */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Payment Method</h3>
                  <div className="p-4 border border-gray-700 rounded">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#10B981',
                            '::placeholder': {
                              color: '#6B7280',
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                {/* Promo Code */}
                {!showPromoInput ? (
                  <button
                    onClick={() => setShowPromoInput(true)}
                    className="text-matrix-green hover:text-matrix-green/80"
                  >
                    Apply promo code
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1 p-2 bg-black border border-gray-700 rounded text-matrix-green"
                    />
                    <button className="px-4 py-2 bg-matrix-green text-black rounded hover:bg-matrix-green/90">
                      Apply
                    </button>
                  </div>
                )}

                {/* Summary */}
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between mb-2">
                    <span>
                      {selectedPlan.name} Plan{' '}
                      {billingCycle === 'yearly'
                        ? 'Yearly'
                        : billingCycle === 'six_months'
                        ? '6 Months'
                        : 'Monthly'}
                    </span>
                    <span>${calculatePrice(selectedPlan.basePrice, billingCycle)}</span>
                  </div>

                  {billingCycle !== 'monthly' && (
                    <div className="flex justify-between text-green-400">
                      <span>Annual Savings</span>
                      <span>-${getAnnualSavings()}</span>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  onClick={handleSubmit}
                  disabled={isProcessing || !stripe}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-3 bg-matrix-green text-black font-bold rounded hover:bg-matrix-green/90 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Subscribe Now'}
                </motion.button>

                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <FaLock className="w-4 h-4" />
                  <span className="text-sm">Secure payment</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Modals */}
          <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} title="Cancel Subscription">
            <div className="space-y-4">
              <p className="text-gray-300">
                Are you sure you want to cancel your subscription? Your subscription will remain active until the end of your current billing period.
              </p>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-800"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {isProcessing ? 'Canceling...' : 'Confirm Cancel'}
                </button>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={showChangeModal}
            onClose={() => setShowChangeModal(false)}
            title={`${isDowngrade(selectedTier as PlanTier) ? 'Downgrade' : 'Upgrade'} Plan`}
          >
            <div className="space-y-6">
              <p className="text-gray-300">
                {isDowngrade(selectedTier as PlanTier)
                  ? 'Are you sure you want to downgrade your plan? You may lose access to some features.'
                  : 'Upgrade your plan to access more features and higher limits.'}
              </p>

              {/* Billing Cycle Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-matrix-green">Billing Cycle</h3>
                <div className="space-y-3">
                  {['monthly', 'six_months', 'yearly'].map((cycle) => (
                    <label
                      key={cycle}
                      className="flex items-center justify-between p-3 border border-gray-700 rounded cursor-pointer hover:border-matrix-green"
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          checked={billingCycle === cycle}
                          onChange={() => setBillingCycle(cycle as BillingCycle)}
                          className="mr-3"
                        />
                        <span>
                          {cycle === 'monthly'
                            ? 'Monthly'
                            : cycle === 'six_months'
                            ? '6 Months'
                            : 'Yearly'}
                        </span>
                      </div>
                      <span className="text-matrix-green">
                        ${getPricePerMonth(selectedPlan?.basePrice || 0, cycle as BillingCycle)}/mo
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Promo Code */}
              {!showPromoInput ? (
                <button onClick={() => setShowPromoInput(true)} className="text-matrix-green hover:text-matrix-green/80">
                  Apply promo code
                </button>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 p-2 bg-black border border-gray-700 rounded text-matrix-green"
                  />
                  <button className="px-4 py-2 bg-matrix-green text-black rounded hover:bg-matrix-green/90">
                    Apply
                  </button>
                </div>
              )}

              {/* Summary */}
              <div className="border-t border-gray-700 pt-4 space-y-3">
                <div className="flex justify-between text-lg">
                  <span>New Plan Summary</span>
                </div>
                <div className="flex justify-between">
                  <div className="flex justify-between">
                    <span>
                      {selectedPlan?.name} Plan{' '}
                      {billingCycle === 'yearly'
                        ? 'Yearly'
                        : billingCycle === 'six_months'
                        ? '6 Months'
                        : 'Monthly'}
                    </span>
                    <span>${calculatePrice(selectedPlan?.basePrice || 0, billingCycle)}</span>
                  </div>
                  {billingCycle !== 'monthly' && (
                    <div className="flex justify-between text-green-400">
                      <span>Annual Savings</span>
                      <span>-${getAnnualSavings()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowChangeModal(false)}
                  className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePlan}
                  disabled={isChangingPlan}
                  className="px-4 py-2 bg-matrix-green text-black rounded hover:bg-matrix-green/90 disabled:opacity-50"
                >
                  {isChangingPlan ? 'Processing...' : 'Confirm Change'}
                </button>
              </div>
            </div>
          </Modal>

          <Modal isOpen={showHistory} onClose={() => setShowHistory(false)} title="Subscription History">
            <div className="space-y-4 max-h-96 ">
              {subscriptionHistory.length === 0 ? (
                <p className="text-gray-400">No subscription history available.</p>
              ) : (
                subscriptionHistory.map((sub) => (
                  <div key={sub.id} className="border border-gray-700 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">{sub.tier.toUpperCase()} Plan</span>
                      <span className="text-matrix-green">${sub.amount}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      <div>Start: {format(new Date(sub.startDate), 'PPP')}</div>
                      <div>End: {format(new Date(sub.endDate), 'PPP')}</div>
                      <div className="capitalize">Status: {sub.status}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Modal>
        </div>
      </div>
  );
};

export default PricingPage;
