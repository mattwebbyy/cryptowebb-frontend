import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { FaRocket, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { STRIPE_CONFIG } from '../config/stripe';
import { useAuth } from '../hooks/useAuth';

const TrialPage = () => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Default to Pro plan for trial
  const selectedPlan = {
    tier: 'pro',
    name: STRIPE_CONFIG.plans.pro.name,
    basePrice: STRIPE_CONFIG.plans.pro.basePrice,
    features: STRIPE_CONFIG.plans.pro.features,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError('Stripe not initialized');
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

      if (cardError) throw cardError;

      const formData = {
        priceId: STRIPE_CONFIG.prices.pro.monthly, // Always use monthly for trials
        paymentMethodId: paymentMethod.id,
        email: user ? undefined : email,
        billingCycle: 'monthly',
      };

      const headers = {
        'Content-Type': 'application/json',
        ...(user && { Authorization: `Bearer ${localStorage.getItem('token')}` }),
      };

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/subscriptions/free-trial`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(formData),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start trial');
      }

      toast.success('Trial started successfully!');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err) {
      console.error('Trial error:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen w-full text-matrix-green p-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Start Your 14-Day Free Trial</h1>
          <p className="text-xl mb-8">Experience the full power of our Pro plan</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-black/30 border-2 border-matrix-green rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">What You Get</h3>
              <ul className="space-y-4">
                {selectedPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <FaRocket className="w-5 h-5 text-matrix-green mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-black/30 border-2 border-matrix-green rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Trial Details</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <FaRocket className="w-5 h-5 text-matrix-green mr-2" />
                  <span>14 days of full Pro access</span>
                </li>
                <li className="flex items-center">
                  <FaRocket className="w-5 h-5 text-matrix-green mr-2" />
                  <span>No charges during trial</span>
                </li>
                <li className="flex items-center">
                  <FaRocket className="w-5 h-5 text-matrix-green mr-2" />
                  <span>Cancel anytime</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-black/30 border-2 border-matrix-green rounded-xl p-8 space-y-6">
              {!user && (
                <div className="space-y-2">
                  <label className="block text-matrix-green">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-black rounded border border-gray-700 text-matrix-green"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-matrix-green">Card Details</label>
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

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <motion.button
                type="submit"
                disabled={isProcessing || !stripe}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-matrix-green text-black font-bold rounded hover:bg-matrix-green/90 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Start Free Trial'}
              </motion.button>

              <div className="flex items-center justify-center gap-2 text-gray-400">
                <FaLock className="w-4 h-4" />
                <span className="text-sm">Secure card storage</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialPage;