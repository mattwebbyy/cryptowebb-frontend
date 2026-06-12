import React, { useState, useEffect, useCallback } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Eye, EyeOff, Lock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { STRIPE_CONFIG } from '../config/stripe';
import { useAuth } from '../hooks/useAuth';
import { AuthResponse } from '../types/types';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const trialDetails = [
  'Full access to every Pro feature for the entire trial',
  'No charge until the trial ends — cancel anytime before',
  'Email reminder before your first billing date',
  'Keep your dashboards and alerts if you upgrade',
];

const TrialPage = () => {
  const { user, login } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // State for component logic
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEligible, setIsEligible] = useState<boolean | null>(null); // null = checking
  const [isChecking, setIsChecking] = useState(true);

  // Default to Pro plan for trial
  const trialPriceId = STRIPE_CONFIG.prices?.pro?.monthly;

  const selectedPlan = trialPriceId
    ? {
        tier: 'pro',
        name: STRIPE_CONFIG.plans.pro.name,
        basePrice: STRIPE_CONFIG.plans.pro.basePrice,
        features: STRIPE_CONFIG.plans.pro.features,
      }
    : null;

  // --- Eligibility Check ---
  const checkEligibility = useCallback(async () => {
    setIsChecking(true);
    setIsEligible(null);

    if (!user) {
      setIsEligible(true);
      setIsChecking(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsEligible(true);
        setIsChecking(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/subscriptions/check-trial-eligibility`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsEligible(data.eligible);
      } else {
        const errorText = await response.text();
        console.error('Eligibility check failed:', response.status, errorText);
        setIsEligible(false);
        toast.error('Could not verify trial eligibility.');
      }
    } catch (error) {
      console.error('Eligibility check network error:', error);
      setIsEligible(false);
      toast.error('Network error checking trial eligibility.');
    } finally {
      setIsChecking(false);
    }
  }, [user]);

  useEffect(() => {
    if (!trialPriceId) {
      console.error('Trial Price ID is not configured!');
      setError('Trial configuration error.');
      setIsEligible(false);
      setIsChecking(false);
    } else {
      checkEligibility();
    }
  }, [trialPriceId, checkEligibility]);

  // --- Form Submission ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements || !trialPriceId) {
      setError('System error: Payment system or trial plan not configured.');
      toast.error('System error: Payment system or trial plan not configured.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card details element not found.');
      toast.error('Card details element not found.');
      return;
    }

    setIsProcessing(true);

    let authToken = localStorage.getItem('token');

    try {
      // === STEP 1 & 2: Register & Login (if not logged in) ===
      if (!user) {
        if (!email || !password || !firstName || !lastName) {
          throw new Error(
            'Please fill in all required fields: Email, Password, First Name, Last Name.'
          );
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }

        const registerResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/register`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, firstName, lastName }),
          }
        );

        const registerBody = await registerResponse.json();

        if (!registerResponse.ok) {
          console.error('Registration failed:', registerBody);
          throw new Error(
            registerBody.message || registerBody.error || 'Account registration failed.'
          );
        }
        toast.success('Account created successfully!');

        // Auto-login to get the token for the subscription call
        try {
          const loginResponse = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
            }
          );
          const loginBody: AuthResponse = await loginResponse.json();

          if (!loginResponse.ok) {
            throw new Error(
              loginBody.message || loginBody.error || 'Auto-login failed after registration.'
            );
          }

          await login(loginBody);
          authToken = loginBody.token;
        } catch (loginErr) {
          console.error('Auto-login error:', loginErr);
          toast.warning(
            'Account created, but auto-login failed. Please log in manually to continue.'
          );
          throw new Error(
            'Auto-login failed after registration. Cannot proceed with trial setup without authentication.'
          );
        }
      }

      // === STEP 3: Create Stripe Payment Method ===
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: { email: user?.email || email },
      });

      if (pmError) throw new Error(pmError.message || 'Failed to process card details.');
      if (!paymentMethod) throw new Error('Payment method creation failed unexpectedly.');

      // === STEP 4: Create Trial Subscription (user is authenticated now) ===
      if (!authToken) {
        throw new Error('Authentication token is missing. Cannot create trial subscription.');
      }

      const subResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/subscriptions/free-trial`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            priceId: trialPriceId,
            paymentMethodId: paymentMethod.id,
            billingCycle: 'monthly',
          }),
        }
      );

      const subBody = await subResponse.json();

      if (!subResponse.ok) {
        console.error('Trial Subscription Creation Error:', subBody);
        throw new Error(
          subBody.message || subBody.error || `Failed to start trial: ${subResponse.status}`
        );
      }

      toast.success('Free trial started successfully!');

      setTimeout(() => {
        window.location.href = '/settings';
      }, 1500);
    } catch (err) {
      console.error('Overall Trial Submission Error:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center animate-pulse">
          <p className="text-lg font-medium">Checking trial eligibility…</p>
          <p className="mt-2 text-sm text-text-secondary">This only takes a moment.</p>
        </div>
      </div>
    );
  }

  if (isEligible === false) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
        <div className="text-center max-w-xl mx-auto rounded-2xl border border-border bg-surface p-10">
          <XCircle className="w-12 h-12 mx-auto mb-6 text-warning" aria-hidden="true" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Trial not available
          </h1>
          <p className="mb-3 text-text-secondary leading-relaxed">
            Looks like you may already have an active subscription or have used a free trial
            previously.
          </p>
          <p className="mb-8 text-text-secondary leading-relaxed">
            Visit our pricing page to choose a plan or manage your existing subscription.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            {user && (
              <Link to="/account/billing">
                <Button variant="outline">Manage subscription</Button>
              </Link>
            )}
            <Link to="/pricing">
              <Button variant="primary">
                View plans
                <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <p className="text-text-secondary">
          Trial configuration is currently unavailable. Please check back later.
        </p>
      </div>
    );
  }

  // --- Eligible Form Screen ---
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 h-[30rem] opacity-50"
        style={{
          background:
            'radial-gradient(34rem 16rem at 50% 0%, var(--color-primary-20), transparent 70%)',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 pt-16 md:pt-24 pb-20">
        {/* Hero */}
        <div className="text-center mb-12">
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.4 }}
            className="text-3xl md:text-5xl font-bold tracking-tight"
          >
            Try {selectedPlan.name} free for {STRIPE_CONFIG.freeTrialDays} days
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mt-4 max-w-xl mx-auto text-text-secondary leading-relaxed"
          >
            Full access to every Pro feature — real-time dashboards, alerts, portfolio tracking, and
            the developer API. No charge until the trial ends.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 items-start">
          {/* What you get */}
          <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }} className="space-y-6">
            <div className="rounded-xl border border-border bg-surface p-6">
              <h2 className="text-base font-semibold">What&apos;s included</h2>
              <ul className="mt-4 space-y-3">
                {selectedPlan.features.map((feature: string) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 mt-0.5 text-success shrink-0" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-surface p-6">
              <h2 className="text-base font-semibold">How the trial works</h2>
              <ul className="mt-4 space-y-3">
                {trialDetails.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-text-secondary">
                    <Check className="w-4 h-4 mt-0.5 text-primary shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.15 }}>
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border bg-surface p-6 md:p-8 space-y-5"
            >
              <h2 className="text-lg font-semibold tracking-tight">
                {user ? 'Confirm your details' : 'Create your account'}
              </h2>

              {!user && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="trial-firstName">First name</Label>
                      <Input
                        id="trial-firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Your first name"
                        autoComplete="given-name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="trial-lastName">Last name</Label>
                      <Input
                        id="trial-lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Your last name"
                        autoComplete="family-name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="trial-email">Email address</Label>
                    <Input
                      id="trial-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="trial-password">Create password</Label>
                    <div className="relative">
                      <Input
                        id="trial-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                        placeholder="Minimum 6 characters"
                        autoComplete="new-password"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-text-secondary hover:text-text"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <Eye className="w-4 h-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Card Details */}
              <div>
                <Label htmlFor="trial-card">Card details</Label>
                <div
                  id="trial-card"
                  className="rounded-lg bg-surface-2 border border-border px-3 py-3 transition-colors focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20"
                >
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
                      hidePostalCode: true,
                    }}
                  />
                </div>
                <p className="text-xs text-text-secondary pt-1.5">
                  Card required for trial activation, but won&apos;t be charged now.
                </p>
              </div>

              {/* Error Display */}
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error"
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isProcessing || !stripe || !elements}
              >
                {isProcessing
                  ? 'Processing…'
                  : `Start ${STRIPE_CONFIG.freeTrialDays}-day free trial`}
              </Button>

              <div className="flex items-center justify-center gap-2 text-text-secondary">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="text-xs">Secure payment processing via Stripe</span>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TrialPage;
