import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { FaCheck, FaCreditCard, FaLock, FaRocket, FaCrown, FaBuilding } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { STRIPE_CONFIG, calculatePrice, getPricePerMonth } from '../config/stripe';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
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

const planIcons: Record<PlanTier, React.ElementType> = {
  basic: FaRocket,
  pro: FaCrown,
  enterprise: FaBuilding,
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
  const [currentSubscription, setCurrentSubscription] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`${import.meta.env.backend}/api/v1/subscriptions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCurrentSubscription(data.tier);
        }
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
      }
    };

    fetchSubscription();
  }, [user]);

  const selectedPlan: SelectedPlan | null = selectedTier ? {
    tier: selectedTier,
    name: STRIPE_CONFIG.plans[selectedTier].name,
    basePrice: STRIPE_CONFIG.plans[selectedTier].basePrice,
    features: STRIPE_CONFIG.plans[selectedTier].features,
    popular: STRIPE_CONFIG.plans[selectedTier].popular,
    icon: planIcons[selectedTier],
  } : null;

  const getAnnualSavings = (): number => {
    if (!selectedPlan) return 0;
    const monthlyTotal = selectedPlan.basePrice * 12;
    const actualTotal = calculatePrice(selectedPlan.basePrice, billingCycle);
    return Math.round(monthlyTotal - actualTotal);
  };

  const handleSelectPlan = (tier: PlanTier) => {
    if (currentSubscription === tier) return;
    setSelectedTier(tier);
    setShowPaymentForm(true);
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
        
        // Use the correct backend URL
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/subscriptions`, {
          method: 'POST',
          headers,
          body: JSON.stringify(formData),
          credentials: 'include', // Add this for cookies if needed
        });

        // Log the full response details for debugging
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

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

        let data;
        try {
          data = responseText ? JSON.parse(responseText) : {};
          console.log('Subscription created successfully:', data);
          
          toast.success('Subscription created successfully!');
          
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);
          
        } catch (parseError) {
          console.error('Failed to parse success response:', parseError);
          // Only redirect if we got a successful response
          if (response.ok) {
            window.location.href = '/dashboard';
          } else {
            throw new Error('Invalid server response');
          }
        }

      } catch (err) {
        console.error('Subscription error:', err);
        
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsProcessing(false);
      }
    } catch (stripeErr) {
      console.error('Stripe error:', stripeErr);
      const errorMessage = stripeErr instanceof Error ? stripeErr.message : 'Failed to process payment method';
      setError(errorMessage);
      toast.error(errorMessage);
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen text-matrix-green">
      <div className="absolute inset-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-xl">Scale your capabilities with our flexible pricing</p>
          </div>

          {/* Plan Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {Object.entries(STRIPE_CONFIG.plans).map(([tier, plan]) => {
              const Icon = planIcons[tier as PlanTier];
              const isCurrentPlan = currentSubscription === tier;
              return (
                <motion.div
                  key={tier}
                  whileHover={{ scale: isCurrentPlan ? 1 : 1.02 }}
                  className={`relative rounded-xl border-2 ${
                    isCurrentPlan ? 'cursor-default' : 'cursor-pointer'
                  } ${
                    plan.popular ? 'border-matrix-green' : 'border-gray-700'
                  } ${selectedTier === tier ? 'border-matrix-green bg-matrix-green/10' : ''}
                  ${isCurrentPlan ? 'border-matrix-green/50 opacity-75' : ''}
                  bg-black p-6 shadow-xl`}
                  onClick={() => !isCurrentPlan && handleSelectPlan(tier as PlanTier)}
                >
                  {isCurrentPlan && (
                    <div className="absolute top-4 right-4 px-2 py-1 bg-matrix-green text-black text-sm rounded-full">
                      Current Plan
                    </div>
                  )}
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

                  <button
                    className={`w-full py-3 rounded-lg font-semibold ${
                      isCurrentPlan
                        ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                        : selectedTier === tier
                        ? 'bg-matrix-green text-black'
                        : 'border border-matrix-green text-matrix-green hover:bg-matrix-green/10'
                    }`}
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan 
                      ? 'Current Plan' 
                      : selectedTier === tier 
                        ? 'Selected' 
                        : 'Select Plan'}
                  </button>
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
                        className="flex items-center justify-between p-3 border border-gray-700 rounded cursor-pointer 
                                 hover:border-matrix-green"
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
                      className="w-full p-3 bg-black rounded border border-gray-700 text-matrix-green 
                               focus:border-matrix-green focus:ring-1 focus:ring-matrix-green"
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
                    <button 
                      className="px-4 py-2 bg-matrix-green text-black rounded hover:bg-matrix-green/90"
                    >
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
                  className="w-full p-3 bg-matrix-green text-black font-bold rounded 
                           hover:bg-matrix-green/90 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Subscribe Now'}
                </motion.button>

                {error && (
                  <div className="text-red-500 text-sm mt-2">{error}</div>
                )}

                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <FaLock className="w-4 h-4" />
                  <span className="text-sm">Secure payment</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;