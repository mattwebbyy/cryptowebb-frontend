import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTimesCircle, FaBitcoin, FaArrowLeft } from 'react-icons/fa';

const CryptoPaymentCancel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-surface border border-error/40 rounded-2xl p-8 text-center"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            <FaTimesCircle className="text-6xl text-error" />
          </motion.div>
        </div>

        <h1 className="text-2xl font-bold text-error mb-4">
          Payment Cancelled
        </h1>

        <p className="text-text-secondary mb-6">
          Your crypto payment was cancelled. No charges were made to your wallet.
        </p>

        <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-warning mb-2">
            <FaBitcoin className="text-xl" />
            <p className="font-semibold">Need Help?</p>
          </div>
          <p className="text-sm text-text-secondary">
            If you experienced any issues during checkout, please contact our support team.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/pricing')}
            className="w-full bg-primary hover:bg-primary/80 text-black font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <FaArrowLeft />
            Return to Pricing
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-transparent border border-primary text-primary hover:bg-primary/10 font-semibold py-3 px-6 rounded-lg transition-all"
          >
            Back to Home
          </button>
        </div>

        <p className="text-xs text-text-secondary/70 mt-6">
          You can try again anytime. We accept Bitcoin, Ethereum, USDC, and more.
        </p>
      </motion.div>
    </div>
  );
};

export default CryptoPaymentCancel;
