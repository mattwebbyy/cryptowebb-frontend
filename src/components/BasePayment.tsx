import React, { useState, useEffect } from 'react';
import { pay, getPaymentStatus } from '@base-org/account';
import { motion } from 'framer-motion';
import { FaLock, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'sonner';

interface BasePaymentProps {
  amount: string; // USD amount (will be converted to USDC)
  planTier: 'basic' | 'pro' | 'enterprise';
  billingCycle: 'monthly' | 'six_months' | 'yearly';
  userEmail?: string;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
  testnet?: boolean;
}

interface PaymentState {
  status: 'idle' | 'processing' | 'polling' | 'completed' | 'failed';
  paymentId: string | null;
  error: string | null;
}

const BasePayment: React.FC<BasePaymentProps> = ({
  amount,
  planTier,
  billingCycle,
  userEmail,
  onSuccess,
  onCancel,
  testnet = false,
}) => {
  const [paymentState, setPaymentState] = useState<PaymentState>({
    status: 'idle',
    paymentId: null,
    error: null,
  });

  // Poll for payment status
  useEffect(() => {
    if (paymentState.status === 'polling' && paymentState.paymentId) {
      const pollInterval = setInterval(async () => {
        try {
          const { status } = await getPaymentStatus({
            id: paymentState.paymentId!,
            testnet,
          });

          console.log(`Payment status: ${status}`);

          if (status === 'completed') {
            clearInterval(pollInterval);
            setPaymentState((prev) => ({ ...prev, status: 'completed' }));
            toast.success('Payment completed successfully!');

            // Notify parent component
            setTimeout(() => {
              onSuccess(paymentState.paymentId!);
            }, 1500);
          } else if (status === 'failed' || (status as string) === 'cancelled') {
            clearInterval(pollInterval);
            setPaymentState({
              status: 'failed',
              paymentId: paymentState.paymentId,
              error: `Payment ${status}`,
            });
            toast.error(`Payment ${status}`);
          }
        } catch (error) {
          console.error('Status check failed:', error);
          // Continue polling on errors (might be network issues)
        }
      }, 2000); // Poll every 2 seconds

      // Stop polling after 5 minutes
      const timeout = setTimeout(() => {
        clearInterval(pollInterval);
        if (paymentState.status === 'polling') {
          setPaymentState({
            status: 'failed',
            paymentId: paymentState.paymentId,
            error: 'Payment verification timeout',
          });
          toast.error('Payment verification timeout. Please contact support.');
        }
      }, 300000); // 5 minutes

      return () => {
        clearInterval(pollInterval);
        clearTimeout(timeout);
      };
    }
  }, [paymentState.status, paymentState.paymentId, testnet, onSuccess]);

  const handlePayment = async () => {
    setPaymentState({ status: 'processing', paymentId: null, error: null });

    try {
      // Get recipient address from environment variable
      const recipientAddress = import.meta.env.VITE_BASE_PAY_RECIPIENT_ADDRESS;

      if (!recipientAddress) {
        throw new Error('Base Pay recipient address not configured');
      }

      console.log(`Initiating Base Pay payment: $${amount} USDC`);

      // Collect user information (optional)
      const paymentConfig: Parameters<typeof pay>[0] = {
        amount,
        to: recipientAddress,
        testnet,
      };

      // Optionally collect email if provided
      if (userEmail) {
        paymentConfig.payerInfo = {
          requests: [
            { type: 'email' },
          ],
        };
      }

      // Trigger payment popup
      const payment = await pay(paymentConfig);

      console.log(`Payment initiated! ID: ${payment.id}`);

      // Log collected user information if available
      if (payment.payerInfoResponses?.email) {
        console.log(`Payer email: ${payment.payerInfoResponses.email}`);
      }

      // Store payment ID and start polling
      setPaymentState({
        status: 'polling',
        paymentId: payment.id,
        error: null,
      });

      toast.info('Payment submitted. Waiting for confirmation...');

    } catch (error) {
      console.error('Payment failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setPaymentState({
        status: 'failed',
        paymentId: null,
        error: errorMessage,
      });
      toast.error(errorMessage);
    }
  };

  const getStatusIcon = () => {
    switch (paymentState.status) {
      case 'processing':
      case 'polling':
        return <FaSpinner className="animate-spin text-primary w-6 h-6" />;
      case 'completed':
        return <FaCheck className="text-success w-6 h-6" />;
      case 'failed':
        return <FaTimes className="text-error w-6 h-6" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (paymentState.status) {
      case 'processing':
        return 'Opening payment popup...';
      case 'polling':
        return 'Confirming payment on Base...';
      case 'completed':
        return 'Payment completed successfully!';
      case 'failed':
        return paymentState.error || 'Payment failed';
      default:
        return '';
    }
  };

  const isProcessing = paymentState.status === 'processing' || paymentState.status === 'polling';
  const isCompleted = paymentState.status === 'completed';
  const isFailed = paymentState.status === 'failed';

  return (
    <div className="space-y-6">
      {/* Base Pay Info */}
      <div className="p-6 border-2 border-primary/30 rounded-xl bg-gradient-to-r from-blue-500/10 to-primary/10">
        <div className="flex items-start space-x-4">
          <div className="text-5xl">⚡</div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-primary mb-2">
              Base Pay - Fast USDC Payment
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-center">
                <FaCheck className="w-4 h-4 text-success mr-2" />
                One-tap payment in seconds
              </li>
              <li className="flex items-center">
                <FaCheck className="w-4 h-4 text-success mr-2" />
                Pay with USDC on Base (stablecoin = $1 USD)
              </li>
              <li className="flex items-center">
                <FaCheck className="w-4 h-4 text-success mr-2" />
                No merchant fees - we keep 100%
              </li>
              <li className="flex items-center">
                <FaCheck className="w-4 h-4 text-success mr-2" />
                Instant settlement (~2 seconds)
              </li>
              <li className="flex items-center">
                <FaCheck className="w-4 h-4 text-success mr-2" />
                20% crypto discount applied!
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Amount Summary */}
      <div className="p-4 bg-surface-2 rounded-lg border border-border">
        <div className="flex justify-between items-center mb-2">
          <span className="text-text-secondary">Plan:</span>
          <span className="font-semibold text-primary capitalize">
            {planTier} - {billingCycle === 'yearly' ? 'Yearly' : billingCycle === 'six_months' ? '6 Months' : 'Monthly'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Amount (USDC):</span>
          <span className="text-2xl font-bold text-primary">
            ${amount}
          </span>
        </div>
      </div>

      {/* Status Display */}
      {paymentState.status !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border-2 ${
            isCompleted
              ? 'bg-success/10 border-success'
              : isFailed
                ? 'bg-error/10 border-error'
                : 'bg-primary/10 border-primary'
          }`}
        >
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <span className={`text-sm font-medium ${
              isCompleted ? 'text-success' : isFailed ? 'text-error' : 'text-primary'
            }`}>
              {getStatusText()}
            </span>
          </div>
        </motion.div>
      )}

      {/* Payment Button */}
      <motion.button
        onClick={handlePayment}
        disabled={isProcessing || isCompleted}
        whileHover={{ scale: isProcessing || isCompleted ? 1 : 1.02 }}
        whileTap={{ scale: isProcessing || isCompleted ? 1 : 0.98 }}
        className={`w-full p-4 rounded-lg font-bold text-lg transition-all ${
          isProcessing || isCompleted
            ? 'bg-surface-2 text-text-secondary cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-primary dark:from-blue-500 dark:to-primary text-white hover:shadow-lg hover:shadow-primary/50'
        }`}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <FaSpinner className="animate-spin mr-2" />
            {paymentState.status === 'processing' ? 'Opening Wallet...' : 'Confirming Payment...'}
          </span>
        ) : isCompleted ? (
          <span className="flex items-center justify-center">
            <FaCheck className="mr-2" />
            Payment Completed
          </span>
        ) : (
          `Pay $${amount} with Base Pay`
        )}
      </motion.button>

      {/* Cancel Button */}
      {!isCompleted && (
        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="w-full p-3 border border-border rounded-lg font-semibold text-text-secondary hover:bg-surface-2 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      )}

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-text-secondary text-sm">
        <FaLock className="w-4 h-4" />
        <span>Secure onchain payment powered by Base</span>
      </div>

      {/* Testnet Warning */}
      {testnet && (
        <div className="p-3 bg-warning/10 border border-warning/40 rounded-lg text-warning text-sm text-center">
          ⚠️ Running on Base Sepolia Testnet
        </div>
      )}
    </div>
  );
};

export default BasePayment;
