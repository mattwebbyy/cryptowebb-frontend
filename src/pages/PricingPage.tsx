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
import { STRIPE_CONFIG, calculatePrice, getPricePerMonth, calculateCryptoPrice, getCryptoPricePerMonth } from '../config/stripe';
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 dark:bg-black/90 backdrop-blur-md border-2 border-teal-600 dark:border-matrix-green rounded-xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-teal-600 dark:text-matrix-green">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-600 dark:text-gray-300 hover:bg-teal-600/20 dark:hover:bg-matrix-green/20 text-teal-600 dark:text-matrix-green p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors"
          >
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
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'crypto'>('stripe');

  // Using Tailwind's dark: modifier instead of custom theme logic

  const determineTier = (priceId: string): PlanTier | null => {
    const id = priceId.toLowerCase();
    const priceMap: Record<string, PlanTier> = {
      price_1qoar4ehgug1cYsgzmwqvzsn: 'basic',
      price_1qojfhehgug1cysgsovk83rz: 'basic',
      price_1qojgeehgug1cysga6vrix4o: 'basic',
      price_1qoas7ehgug1cysg0pybroux: 'pro',
      price_1qojilehgug1cysghjvxwsbz: 'pro',
      price_1qojjpehgug1cysgchmvtzsw: 'enterprise',
      price_1qojjsehgug1cysgzaa4stjq: 'enterprise',
      price_1qojkmehgug1cysgjllrgpov: 'enterprise',
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
        console.log('No user logged in, skipping subscription fetch.');
        setCurrentSubscription(null); // Ensure it's null if no user
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No auth token found, cannot fetch subscription.');
        setCurrentSubscription(null);
        return;
      }

      try {
        console.log('Fetching current subscription data...');
        const subResponse = await fetch(
          // *** CORRECTED ENDPOINT ***
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/subscriptions/current`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Subscription fetch response status:', subResponse.status);

        // Handle cases where no active subscription is found (e.g., 404)
        if (subResponse.status === 404) {
          console.log('No active subscription found for user.');
          setCurrentSubscription(null);
          return; // Exit successfully, no active subscription
        }

        // Handle other potential errors
        if (!subResponse.ok) {
          const errorText = await subResponse.text();
          console.error('Subscription fetch failed:', subResponse.status, errorText);
          // Optionally: toast.error(`Failed to fetch subscription: ${subResponse.status}`);
          setCurrentSubscription(null); // Set to null on error
          return; // Exit on error
        }

        // Parse the successful response
        const data = await subResponse.json();
        console.log('Successfully fetched subscription data:', data); // Log the received data

        // *** Add Robust Tier Determination Here (if not done on backend) ***
        // Replace or augment the existing determineTier logic as discussed previously.
        // For now, using the existing determineTier as an example:
        const tier = determineTier(data.plan_id); // data.plan_id is the Stripe Price ID
        console.log('Determined Tier:', tier);

        if (tier) {
          // Convert Unix timestamps (assuming backend sends them) to ISO strings or Date objects
          // GORM/Go often use time.Time, which marshals to RFC3339Nano (ISO8601) by default in JSON
          const subscriptionData = {
            id: data.id, // Stripe Subscription ID
            tier,
            status: data.status, // e.g., 'active', 'trialing', 'canceled'
            // Ensure these are valid Date objects or ISO strings
            currentPeriodEnd: data.current_period_end
              ? new Date(data.current_period_end * 1000).toISOString()
              : '',
            currentPeriodStart: data.current_period_start
              ? new Date(data.current_period_start * 1000).toISOString()
              : '',
            cancelAtPeriodEnd: data.cancel_at_period_end,
            priceId: data.plan_id,
            // Add trial_end if backend sends it
            trialEnd: data.trial_end ? new Date(data.trial_end * 1000).toISOString() : null,
          };
          console.log('Setting current subscription:', subscriptionData);
          setCurrentSubscription(subscriptionData);
        } else {
          console.error('Could not determine plan tier from price ID:', data.plan_id);
          setCurrentSubscription(null); // Set null if tier determination fails
        }
      } catch (error) {
        console.error('Subscription fetch network/parsing error:', error);
        // Optionally: toast.error('Error fetching subscription details.');
        setCurrentSubscription(null); // Set to null on error
      }
    };

    fetchSubscriptionData();
  }, [user]); // Re-fetch when user logs in/out

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
    // Ensure we have a subscription to cancel
    if (!currentSubscription) {
      toast.error('No active subscription found to cancel.');
      return;
    }

    setIsProcessing(true); // Indicate processing starts

    try {
      // Send the DELETE request to the backend
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/subscriptions/${currentSubscription.id}`, // Use the ID from state
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Check if the backend request itself failed
      if (!response.ok) {
        let errorMsg = 'Failed to request subscription cancellation.';
        try {
          const body = await response.json();
          errorMsg = body.error || body.message || errorMsg;
        } catch (e) {
          // Ignore parsing error if body is not JSON or empty
          console.warn('Could not parse error response from cancellation endpoint.');
        }
        throw new Error(errorMsg);
      }

      // --- SUCCESS ---
      toast.success('Subscription cancellation scheduled successfully!');
      setShowCancelModal(false);

      // *** Update Frontend State Immediately ***
      // Update the local state to reflect cancellation pending at period end
      setCurrentSubscription((prevSub) => {
        if (!prevSub) return null;
        // Return a new object with the updated property
        return {
          ...prevSub,
          cancelAtPeriodEnd: true, // Set this immediately in the UI state
        };
      });

      // *** REMOVED: window.location.reload(); ***
      // The state update above will trigger a re-render
    } catch (error) {
      console.error('Cancel error:', error);
      const message = error instanceof Error ? error.message : 'Failed to cancel subscription';
      toast.error(message);
    } finally {
      setIsProcessing(false); // Indicate processing finished
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
    const days = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
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

  const handleCryptoPayment = async () => {
    if (!selectedPlan) {
      setError('Please select a plan');
      return;
    }

    if (!email && !user) {
      setError('Please enter your email');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const cryptoPrice = calculateCryptoPrice(selectedPlan.basePrice, billingCycle);
      
      const formData = {
        planTier: selectedPlan.tier,
        billingCycle,
        amount: cryptoPrice.toString(),
        currency: 'USD',
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (user) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/crypto/charges`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create crypto payment');
      }

      const { hostedUrl } = await response.json();
      
      // Redirect to Coinbase Commerce hosted checkout
      window.location.href = hostedUrl;
    } catch (err) {
      console.error('Crypto payment error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
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
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
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

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/subscriptions/free-trial`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(formData),
          credentials: 'include',
        }
      );

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
    <div className="relative w-full min-h-screen text-gray-800 dark:text-matrix-green">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800 dark:text-matrix-green">Choose Your Plan</h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">Scale your capabilities with our flexible pricing</p>

          {currentSubscription && (
            <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                onClick={() => setShowHistory(true)}
                className="px-4 py-3 bg-teal-600/20 dark:bg-matrix-green/20 text-teal-600 dark:text-matrix-green rounded hover:bg-teal-600/20 dark:hover:bg-matrix-green/20 min-h-[44px] flex items-center justify-center transition-colors"
              >
                <FaHistory className="inline mr-2" />
                Subscription History
              </button>
              {!currentSubscription.cancelAtPeriodEnd && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-3 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 min-h-[44px] flex items-center justify-center transition-colors"
                >
                  <FaTimes className="inline mr-2" />
                  Cancel Subscription
                </button>
              )}
            </div>
          )}

          {/* Payment Method and Billing Cycle Toggles */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-6 mb-8">
            {/* Payment Method Toggle */}
            <div className="flex flex-col items-center">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Payment Method</label>
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setPaymentMethod('stripe')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    paymentMethod === 'stripe'
                      ? 'bg-teal-600 dark:bg-matrix-green text-white dark:text-black'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                  }`}
                >
                  💳 Card (USD)
                </button>
                <button
                  onClick={() => setPaymentMethod('crypto')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    paymentMethod === 'crypto'
                      ? 'bg-teal-600 dark:bg-matrix-green text-white dark:text-black'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                  }`}
                >
                  ₿ Crypto (-20%)
                </button>
              </div>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="flex flex-col items-center">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Billing Cycle</label>
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-teal-600 dark:bg-matrix-green text-white dark:text-black'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('six_months')}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    billingCycle === 'six_months'
                      ? 'bg-teal-600 dark:bg-matrix-green text-white dark:text-black'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                  }`}
                >
                  6 Months
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    billingCycle === 'yearly'
                      ? 'bg-teal-600 dark:bg-matrix-green text-white dark:text-black'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Selection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 sm:mb-12">
          {Object.entries(STRIPE_CONFIG.plans).map(([tier, plan]) => {
            const Icon = planIcons[tier as PlanTier];
            const isCurrentSub = currentSubscription?.tier === tier;
            const daysRemaining = getSubscriptionTimeRemaining();

            return (
              <motion.div
                key={tier}
                whileHover={{ scale: isCurrentSub ? 1 : 1.01 }}
                className={`relative rounded-xl border-2 ${
                  isCurrentSub ? 'cursor-default border-teal-600/50 dark:border-matrix-green/50' : 'cursor-pointer'
                } ${plan.popular ? 'border-teal-600 dark:border-matrix-green' : 'border-gray-200 dark:border-gray-700'} ${
                  selectedTier === tier ? 'border-teal-600 dark:border-matrix-green bg-teal-600/20 dark:bg-matrix-green/20' : ''
                } ${isCurrentSub ? 'border-teal-600/50 dark:border-matrix-green/50' : ''} bg-white/10 dark:bg-black/40 backdrop-blur-md border border-teal-600/20 dark:border-matrix-green/20 p-6 shadow-xl flex flex-col`}
                onClick={() => handleSelectPlan(tier as PlanTier)}
              >
                {isCurrentSub && (
                  <>
                    <div className="absolute top-4 right-4 px-2 py-1 bg-teal-600 dark:bg-matrix-green text-white dark:text-black text-sm rounded-full">
                      Current Plan
                    </div>
                    {currentSubscription.cancelAtPeriodEnd && (
                      <div className="absolute top-14 right-4 px-2 py-1 bg-red-500/20 text-red-500 text-xs rounded-full">
                        Cancels at period end
                      </div>
                    )}
                    {daysRemaining && (
                      <div className="absolute top-20 right-4 px-2 py-1 text-teal-600 dark:text-matrix-green text-xs">
                        {daysRemaining} days remaining
                      </div>
                    )}
                  </>
                )}
                <div className="flex-grow">
                  <div className="text-center mb-6 sm:mb-8">
                    <Icon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-teal-600 dark:text-matrix-green" />
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800 dark:text-matrix-green">{plan.name}</h3>
                    <div className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800 dark:text-matrix-green">
                      {paymentMethod === 'crypto' ? (
                        <>
                          <span className="line-through text-gray-500 dark:text-gray-400 text-xl mr-2">
                            ${getPricePerMonth(plan.basePrice, billingCycle)}
                          </span>
                          ${getCryptoPricePerMonth(plan.basePrice, billingCycle)}
                        </>
                      ) : (
                        `$${getPricePerMonth(plan.basePrice, billingCycle)}`
                      )}
                      <span className="text-base sm:text-lg font-normal text-gray-600 dark:text-gray-300">/month</span>
                      {paymentMethod === 'crypto' && (
                        <div className="text-sm text-green-500 font-normal">
                          20% crypto discount applied!
                        </div>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheck className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 dark:text-matrix-green mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto">
                  <button
                    className={`w-full py-3 rounded-lg font-semibold min-h-[44px] text-sm sm:text-base transition-colors ${
                      isCurrentSub
                        ? 'bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed'
                        : selectedTier === tier
                          ? 'bg-teal-600 dark:bg-matrix-green text-white dark:text-black'
                          : 'border border-teal-600 dark:border-matrix-green text-teal-600 dark:text-matrix-green hover:bg-teal-600/20 dark:hover:bg-matrix-green/20'
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
            className="max-w-3xl mx-auto mb-8 sm:mb-12"
          >
            <div className="bg-white/10 dark:bg-black/30 border-teal-600/30 dark:border-matrix-green backdrop-blur-md border-2 rounded-xl p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
              {/* Billing Cycle Selection */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Billing Cycle</h3>
                <div className="space-y-3">
                  {['monthly', 'six_months', 'yearly'].map((cycle) => (
                    <label
                      key={cycle}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded cursor-pointer hover:border-teal-600 dark:hover:border-matrix-green"
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
                      <span>
                        ${getPricePerMonth(selectedPlan.basePrice, cycle as BillingCycle)}/mo
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Account Creation (if not logged in) */}
              {!user && (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-semibold">Create Account</h3>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 sm:p-4 bg-white dark:bg-black rounded border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-matrix-green focus:border-teal-600 dark:focus:border-matrix-green focus:ring-1 focus:ring-teal-600 dark:focus:ring-matrix-green text-base min-h-[44px]"
                  />
                </div>
              )}

              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Payment Method</h3>
                {paymentMethod === 'stripe' ? (
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded">
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
                ) : (
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded bg-gradient-to-r from-orange-500/10 to-yellow-500/10">
                    <div className="flex items-center justify-center space-x-4 py-4">
                      <div className="text-4xl">₿</div>
                      <div>
                        <h4 className="font-semibold text-orange-500">Cryptocurrency Payment</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Pay with Bitcoin, Ethereum, Litecoin, and other cryptocurrencies
                        </p>
                        <p className="text-xs text-green-500 font-medium">
                          20% discount automatically applied!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Promo Code */}
              {!showPromoInput ? (
                <button
                  onClick={() => setShowPromoInput(true)}
                  className="text-teal-600 dark:text-matrix-green hover:text-teal-600/80 dark:hover:text-matrix-green/80"
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
                    className="flex-1 p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded text-gray-800 dark:text-matrix-green"
                  />
                  <button className="px-4 py-2 bg-teal-600 dark:bg-matrix-green text-white dark:text-black rounded hover:bg-teal-600/90 dark:hover:bg-matrix-green/90">
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
                  <span>
                    {paymentMethod === 'crypto' ? (
                      <>
                        <span className="line-through text-gray-500 text-sm mr-2">
                          ${calculatePrice(selectedPlan.basePrice, billingCycle)}
                        </span>
                        ${calculateCryptoPrice(selectedPlan.basePrice, billingCycle)}
                      </>
                    ) : (
                      `$${calculatePrice(selectedPlan.basePrice, billingCycle)}`
                    )}
                  </span>
                </div>

                {paymentMethod === 'crypto' && (
                  <div className="flex justify-between text-green-400">
                    <span>Crypto Discount (20%)</span>
                    <span>-${calculatePrice(selectedPlan.basePrice, billingCycle) - calculateCryptoPrice(selectedPlan.basePrice, billingCycle)}</span>
                  </div>
                )}

                {billingCycle !== 'monthly' && paymentMethod === 'stripe' && (
                  <div className="flex justify-between text-green-400">
                    <span>Annual Savings</span>
                    <span>-${getAnnualSavings()}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                onClick={paymentMethod === 'crypto' ? handleCryptoPayment : handleSubmit}
                disabled={isProcessing || (paymentMethod === 'stripe' && !stripe)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-3 bg-teal-600 dark:bg-matrix-green text-white dark:text-black font-bold rounded hover:bg-teal-600/90 dark:hover:bg-matrix-green/90 transition-colors disabled:opacity-50"
              >
                {isProcessing 
                  ? 'Processing...' 
                  : paymentMethod === 'crypto' 
                    ? 'Pay with Crypto' 
                    : 'Subscribe Now'
                }
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
        <Modal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Cancel Subscription"
        >
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to cancel your subscription? Your subscription will remain
              active until the end of your current billing period.
            </p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
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
            <p className="text-gray-600 dark:text-gray-300">
              {isDowngrade(selectedTier as PlanTier)
                ? 'Are you sure you want to downgrade your plan? You may lose access to some features.'
                : 'Upgrade your plan to access more features and higher limits.'}
            </p>

            {/* Billing Cycle Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-teal-600 dark:text-matrix-green">Billing Cycle</h3>
              <div className="space-y-3">
                {['monthly', 'six_months', 'yearly'].map((cycle) => (
                  <label
                    key={cycle}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded cursor-pointer hover:border-teal-600 dark:hover:border-matrix-green"
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
                    <span className="text-teal-600 dark:text-matrix-green">
                      ${getPricePerMonth(selectedPlan?.basePrice || 0, cycle as BillingCycle)}/mo
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Promo Code */}
            {!showPromoInput ? (
              <button
                onClick={() => setShowPromoInput(true)}
                className="text-teal-600 dark:text-matrix-green hover:text-teal-600/80 dark:hover:text-matrix-green/80"
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
                  className="flex-1 p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded text-gray-800 dark:text-matrix-green"
                />
                <button className="px-4 py-2 bg-teal-600 dark:bg-matrix-green text-white dark:text-black rounded hover:bg-teal-600/90 dark:hover:bg-matrix-green/90">
                  Apply
                </button>
              </div>
            )}

            {/* Summary */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
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
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePlan}
                disabled={isChangingPlan}
                className="px-4 py-2 bg-teal-600 dark:bg-matrix-green text-white dark:text-black rounded hover:bg-teal-600/90 dark:hover:bg-matrix-green/90 disabled:opacity-50"
              >
                {isChangingPlan ? 'Processing...' : 'Confirm Change'}
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          title="Subscription History"
        >
          <div className="space-y-4 max-h-96 ">
            {subscriptionHistory.length === 0 ? (
              <p className="text-gray-400">No subscription history available.</p>
            ) : (
              subscriptionHistory.map((sub) => (
                <div key={sub.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">{sub.tier.toUpperCase()} Plan</span>
                    <span className="text-teal-600 dark:text-matrix-green">${sub.amount}</span>
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
