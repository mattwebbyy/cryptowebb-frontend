import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import {
  FaRocket,
  FaLock,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaCreditCard,
  FaTimes,
} from 'react-icons/fa'; // Added more icons
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { STRIPE_CONFIG } from '../config/stripe';
import { useAuth } from '../hooks/useAuth'; // Assuming login function is exported
import { Link } from 'react-router-dom';
import { AuthResponse } from '../types/types'; // Assuming this type is defined

const TrialPage = () => {
  const { user, login } = useAuth(); // Destructure login function
  const stripe = useStripe();
  const elements = useElements();

  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // --- ADD First/Last Name ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  // ---

  // State for component logic
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEligible, setIsEligible] = useState<boolean | null>(null); // null = checking, true = eligible, false = ineligible
  const [isChecking, setIsChecking] = useState(true);

  // Default to Pro plan for trial - Ensure you have a trial price ID configured
  const trialPriceId = STRIPE_CONFIG.prices?.pro?.monthly; // Example

  const selectedPlan = trialPriceId
    ? {
        tier: 'pro', // Assuming trial is for 'pro' tier
        name: STRIPE_CONFIG.plans.pro.name,
        basePrice: STRIPE_CONFIG.plans.pro.basePrice,
        features: STRIPE_CONFIG.plans.pro.features,
      }
    : null;

  // --- Eligibility Check ---
  const checkEligibility = useCallback(async () => {
    // Wrap in useCallback
    setIsChecking(true);
    setIsEligible(null);

    if (!user) {
      console.log('User not logged in, assuming eligible for form display.');
      setIsEligible(true);
      setIsChecking(false);
      return;
    }

    console.log('Logged-in user, checking trial eligibility via backend GET endpoint...');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found for eligibility check, assuming eligible.');
        setIsEligible(true); // Or false? Or redirect to login?
        setIsChecking(false);
        return;
      }

      const response = await fetch(
        // *** USE THE NEW DEDICATED GET ENDPOINT ***
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
        console.log('Eligibility check response:', data);
        setIsEligible(data.eligible); // Assuming backend returns { eligible: true/false }
        if (!data.eligible) {
          console.log('User is not eligible for trial.');
        }
      } else {
        const errorText = await response.text();
        console.error('Eligibility check failed:', response.status, errorText);
        setIsEligible(false); // Assume ineligible on check failure
        toast.error('Could not verify trial eligibility.');
      }
    } catch (error) {
      console.error('Eligibility check network error:', error);
      setIsEligible(false); // Assume ineligible on network error
      toast.error('Network error checking trial eligibility.');
    } finally {
      setIsChecking(false);
    }
  }, [user]); // Dependency: user

  useEffect(() => {
    if (!trialPriceId) {
      console.error('Trial Price ID is not configured!');
      setError('Trial configuration error.');
      setIsEligible(false);
      setIsChecking(false);
    } else {
      checkEligibility(); // Call the memoized function
    }
  }, [trialPriceId, checkEligibility]); // Dependency: checkEligibility

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

    let registrationSuccessful = false;
    let authToken = localStorage.getItem('token'); // Get current token (if any)

    try {
      // === STEP 1 & 2: Register & Login (if not logged in) ===
      if (!user) {
        if (!email || !password || !firstName || !lastName) {
          // Check names too
          throw new Error(
            'Please fill in all required fields: Email, Password, First Name, Last Name.'
          );
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }

        console.log('Attempting registration...');
        const registerResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/register`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, firstName, lastName }), // Send names
          }
        );

        const registerBody = await registerResponse.json();

        if (!registerResponse.ok) {
          console.error('Registration failed:', registerBody);
          throw new Error(
            registerBody.message || registerBody.error || 'Account registration failed.'
          );
        }
        console.log('Registration successful:', registerBody);
        toast.success('Account created successfully!');
        registrationSuccessful = true;

        // Now attempt to log in automatically to get the token
        // This depends on your /login endpoint and the login function in useAuth
        console.log('Attempting auto-login after registration...');
        try {
          const loginInput = { email, password };
          // Assuming your login endpoint returns data in AuthResponse format
          const loginResponse = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(loginInput),
            }
          );
          const loginBody: AuthResponse = await loginResponse.json(); // Expect AuthResponse structure

          if (!loginResponse.ok) {
            throw new Error(
              loginBody.message || loginBody.error || 'Auto-login failed after registration.'
            );
          }

          // Use the login function from useAuth to update context and local storage
          await login(loginBody);
          authToken = loginBody.token; // Get the new token
          console.log('Auto-login successful.');
        } catch (loginErr) {
          console.error('Auto-login error:', loginErr);
          // Don't throw here, maybe just warn and proceed? Or force manual login?
          toast.warn('Account created, but auto-login failed. Please log in manually to continue.');
          // Depending on flow, you might stop here or try to proceed without token
          throw new Error(
            'Auto-login failed after registration. Cannot proceed with trial setup without authentication.'
          ); // Safer to stop
        }
      }
      // === END STEP 1 & 2 ===

      // === STEP 3: Create Stripe Payment Method ===
      console.log('Creating Stripe Payment Method...');
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: { email: user?.email || email }, // Use final email
      });

      if (pmError) throw new Error(pmError.message || 'Failed to process card details.');
      if (!paymentMethod) throw new Error('Payment method creation failed unexpectedly.');
      console.log('Payment Method created:', paymentMethod.id);

      // === STEP 4: Create Trial Subscription (User MUST be authenticated now) ===
      if (!authToken) {
        // This case should ideally be prevented by the auto-login check above
        throw new Error('Authentication token is missing. Cannot create trial subscription.');
      }

      console.log('Sending request to create trial subscription...');
      const subPayload = {
        priceId: trialPriceId,
        paymentMethodId: paymentMethod.id,
        // No email/password needed here, user is authenticated
        billingCycle: 'monthly',
      };

      const subHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`, // Use the token obtained
      };

      const subResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/subscriptions/free-trial`,
        {
          method: 'POST',
          headers: subHeaders,
          body: JSON.stringify(subPayload),
        }
      );

      const subBody = await subResponse.json();

      if (!subResponse.ok) {
        console.error('Trial Subscription Creation Error:', subBody);
        throw new Error(
          subBody.message || subBody.error || `Failed to start trial: ${subResponse.status}`
        );
      }

      console.log('Trial started successfully (Backend response):', subBody);
      toast.success('Free trial started successfully!');

      // Redirect
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

  // --- Render Logic (mostly unchanged, just added First/Last Name inputs) ---

  if (isChecking) {
    // ... loading indicator ...
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-matrix-green  ">
        <div className="text-center">
          <div className="animate-pulse">
            <p className="text-xl mb-4">Initializing trial system...</p>
            <p className="text-sm text-matrix-green/70">Checking eligibility</p>
          </div>
        </div>
      </div>
    );
  }

  if (isEligible === false) {
    // ... ineligible screen ...
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-matrix-green  p-4 ">
        <div className="text-center max-w-2xl mx-auto bg-black/50 border-2 border-matrix-green rounded-xl p-8 shadow-lg">
          <FaTimesCircle className="w-16 h-16 mx-auto mb-6 text-red-500" /> {/* Changed Icon */}
          <h1 className="text-3xl font-bold mb-4">Trial Not Available</h1>
          <p className="mb-6 text-matrix-green/80">
            Looks like you may already have an active subscription or have used a free trial
            previously.
          </p>
          <p className="mb-8 text-matrix-green/80">
            Please visit our pricing page to choose a plan or manage your existing subscription.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {user && ( // Show manage button only if logged in
              <Link
                to="/account/billing" // Link to user's billing/account page
                className="inline-flex items-center gap-2 px-6 py-3 border border-matrix-green text-matrix-green font-bold rounded hover:bg-matrix-green/10 transition-colors"
              >
                Manage Subscription
              </Link>
            )}
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-matrix-green text-black font-bold rounded hover:bg-matrix-green/90 transition-colors"
            >
              View Plans <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedPlan) {
    // ... config error screen ...
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-matrix-green bg-black p-4">
        <p>Trial configuration is currently unavailable. Please check back later.</p>
      </div>
    );
  }

  // --- Eligible Form Screen ---
  return (
    <div className="min-h-screen w-full text-matrix-green bg-black p-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          {/* ... Same as before ... */}
          <motion.h1 /* ... */>Start Your {STRIPE_CONFIG.freeTrialDays}-Day Free Trial</motion.h1>
          <motion.p /* ... */>Experience the full power of our Pro plan, absolutely free.</motion.p>
        </div>

        {/* Feature/Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* ... Same as before ... */}
          <motion.div /* What You Get */> {/* ... */}</motion.div>
          <motion.div /* Trial Details */> {/* ... */}</motion.div>
        </div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <form
            onSubmit={handleSubmit}
            className="bg-black/40 border-2 border-matrix-green rounded-xl p-8 space-y-6 shadow-lg"
          >
            <h3 className="text-2xl font-semibold text-center mb-4 text-matrix-green">
              {user ? `Confirm Your Details & Start Trial` : `Create Account & Start Trial`}
            </h3>

            {/* === Fields for NEW users ONLY === */}
            {!user && (
              <>
                {/* First Name */}
                <div className="space-y-2">
                  <label htmlFor="trial-firstName" className="block text-matrix-green font-medium">
                    First Name
                  </label>
                  <input
                    id="trial-firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-3 bg-black rounded border border-gray-700 text-matrix-green focus:outline-none focus:border-matrix-green focus:ring-1 focus:ring-matrix-green"
                    placeholder="Your first name"
                    required
                  />
                </div>
                {/* Last Name */}
                <div className="space-y-2">
                  <label htmlFor="trial-lastName" className="block text-matrix-green font-medium">
                    Last Name
                  </label>
                  <input
                    id="trial-lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-3 bg-black rounded border border-gray-700 text-matrix-green focus:outline-none focus:border-matrix-green focus:ring-1 focus:ring-matrix-green"
                    placeholder="Your last name"
                    required
                  />
                </div>
                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="trial-email" className="block text-matrix-green font-medium">
                    Email Address
                  </label>
                  <input
                    id="trial-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-black rounded border border-gray-700 text-matrix-green focus:outline-none focus:border-matrix-green focus:ring-1 focus:ring-matrix-green"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="trial-password" className="block text-matrix-green font-medium">
                    Create Password
                  </label>
                  <div className="relative">
                    <input
                      id="trial-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 bg-black rounded border border-gray-700 text-matrix-green focus:outline-none focus:border-matrix-green focus:ring-1 focus:ring-matrix-green pr-10"
                      placeholder="Choose a secure password (min. 6 chars)"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-matrix-green/70 hover:text-matrix-green"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </>
            )}
            {/* === END Fields for NEW users ONLY === */}

            {/* Card Details (Always Shown) */}
            <div className="space-y-2">
              <label className="block text-matrix-green font-medium">Card Details</label>
              <div className="p-4 border border-gray-700 rounded bg-black">
                <CardElement
                  options={{
                    // ... style options ...
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#33ff33', // Matrix green
                        fontFamily: '"Courier New", Courier, monospace',
                        '::placeholder': { color: '#6B7280' },
                        iconColor: '#33ff33',
                      },
                      invalid: { color: '#EF4444', iconColor: '#EF4444' },
                    },
                    hidePostalCode: true,
                  }}
                />
              </div>
              <p className="text-xs text-matrix-green/60 pt-1">
                Card required for trial activation, but won't be charged now.
              </p>
            </div>

            {/* Error Display */}
            {error && <motion.div /* ... */ className="text-red-400 ...">{error}</motion.div>}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isProcessing || !stripe || !elements} // Disable if stripe not loaded
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full p-4 bg-matrix-green text-black font-bold rounded-lg hover:bg-matrix-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
            >
              {isProcessing
                ? 'Processing...'
                : `Start ${STRIPE_CONFIG.freeTrialDays}-Day Free Trial`}
            </motion.button>

            {/* Secure Payment Footer */}
            <div className="flex items-center justify-center gap-2 text-gray-400 pt-2">
              <FaLock className="w-4 h-4" />
              <span className="text-sm">Secure payment processing via Stripe</span>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default TrialPage;
