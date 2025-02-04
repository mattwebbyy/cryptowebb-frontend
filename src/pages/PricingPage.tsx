// src/pages/PricingPage.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { FaCheck, FaTimes, FaCrown, FaRocket, FaBuilding } from 'react-icons/fa';
import { STRIPE_CONFIG } from '../config/stripe';
import { useAuth } from '../hooks/useAuth';

const pricingPlans = [
  {
    tier: 'basic',
    name: 'Basic',
    price: 29,
    priceId: STRIPE_CONFIG.prices.basic,
    icon: FaRocket,
    features: [
      '10,000 API Calls',
      '5GB Storage',
      'Basic Analytics',
      'Standard Support',
      'Up to 3 Team Members',
    ],
  },
  {
    tier: 'pro',
    name: 'Pro',
    price: 99,
    priceId: STRIPE_CONFIG.prices.pro,
    icon: FaCrown,
    popular: true,
    features: [
      '100,000 API Calls',
      '20GB Storage',
      'Advanced Analytics',
      'Priority Support',
      'Up to 10 Team Members',
      'Custom Domain',
    ],
  },
  {
    tier: 'enterprise',
    name: 'Enterprise',
    price: 299,
    priceId: STRIPE_CONFIG.prices.enterprise,
    icon: FaBuilding,
    features: [
      '1,000,000 API Calls',
      '100GB Storage',
      'Advanced Analytics',
      'Dedicated Support',
      'Up to 100 Team Members',
      'Custom Domain',
    ],
  },
];

export const PricingPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !selectedPlan) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: cardError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });

      if (cardError) {
        throw new Error(cardError.message);
      }

      // Create subscription
      const response = await fetch('http://localhost:8080/api/v1/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          priceId: selectedPlan,
          paymentMethodId: paymentMethod.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-matrix-green p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl">Scale your capabilities with our flexible pricing</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.tier}
              whileHover={{ scale: 1.02 }}
              className={`relative rounded-xl border ${
                plan.popular ? 'border-matrix-green border-2' : 'border-gray-700'
              } bg-black p-6 shadow-xl`}
              onClick={() => setSelectedPlan(plan.priceId)}
            >
              {/* Plan content */}
              <div className="text-center mb-8">
                <plan.icon className="w-12 h-12 mx-auto mb-4 text-matrix-green" />
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold mb-4">
                  ${plan.price}
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
                  selectedPlan === plan.priceId
                    ? 'bg-matrix-green text-black'
                    : 'border border-matrix-green text-matrix-green'
                }`}
              >
                {selectedPlan === plan.priceId ? 'Selected' : 'Select Plan'}
              </button>
            </motion.div>
          ))}
        </div>

        {selectedPlan && (
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="p-4 border border-matrix-green rounded-lg bg-black/30">
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

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <motion.button
                type="submit"
                disabled={!stripe || isProcessing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-3 bg-matrix-green text-black font-bold rounded 
                         hover:bg-matrix-green/90 transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Subscribe Now'}
              </motion.button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};