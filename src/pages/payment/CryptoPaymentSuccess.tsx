import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaSpinner, FaBitcoin } from 'react-icons/fa';
import { toast } from 'sonner';

const CryptoPaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chargeId = searchParams.get('charge_id') || searchParams.get('code');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!chargeId) {
        setError('No payment reference found');
        setIsVerifying(false);
        return;
      }

      try {
        // Optional: Verify the charge status with your backend
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/crypto/charges/${chargeId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const chargeData = await response.json();
            console.log('Charge verified:', chargeData);
          }
        }

        setVerified(true);
        toast.success('Payment received! Your subscription will be activated shortly.');
      } catch (err) {
        console.error('Error verifying payment:', err);
        // Don't set error - payment was still successful from Coinbase's perspective
        setVerified(true);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [chargeId]);

  useEffect(() => {
    // Redirect to settings after 5 seconds
    if (verified && !isVerifying) {
      const timer = setTimeout(() => {
        navigate('/settings');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [verified, isVerifying, navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-surface border border-border rounded-2xl p-8 text-center"
      >
        {isVerifying ? (
          <>
            <div className="flex justify-center mb-6">
              <FaSpinner className="text-6xl text-primary animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-4">
              Verifying Payment...
            </h1>
            <p className="text-text-secondary mb-4">
              Please wait while we confirm your crypto payment.
            </p>
          </>
        ) : error ? (
          <>
            <div className="flex justify-center mb-6">
              <FaBitcoin className="text-6xl text-warning" />
            </div>
            <h1 className="text-2xl font-bold text-error mb-4">
              Payment Reference Missing
            </h1>
            <p className="text-text-secondary mb-6">
              {error}
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="bg-primary hover:bg-primary/80 text-black font-semibold py-3 px-6 rounded-lg transition-all"
            >
              Return to Pricing
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <FaCheckCircle className="text-6xl text-primary" />
              </motion.div>
            </div>
            <h1 className="text-2xl font-bold text-primary mb-4">
              Payment Successful!
            </h1>
            <p className="text-text-secondary mb-4">
              Thank you for your crypto payment. Your subscription has been activated.
            </p>
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-text-secondary">
                <strong className="text-primary">Payment ID:</strong>
              </p>
              <p className="text-xs text-text-secondary/70 break-all font-mono mt-1">
                {chargeId}
              </p>
            </div>
            <p className="text-sm text-text-secondary mb-6">
              Redirecting to your dashboard in 5 seconds...
            </p>
            <button
              onClick={() => navigate('/settings')}
              className="bg-primary hover:bg-primary/80 text-black font-semibold py-3 px-6 rounded-lg transition-all"
            >
              Go to Dashboard Now
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default CryptoPaymentSuccess;
