// src/features/cipher/components/token-detail/TokenDetailModal.tsx — token deep-dive dialog.
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, X } from 'lucide-react';
import { Token } from '../../types';
import { VerifiedIcon } from '../badges';
import {
  CommunityCard,
  PriceHistoryCard,
  PriceInfoCard,
  RiskAssessmentCard,
  SupplyCard,
  TeamAuditCard,
} from './sections';

interface TokenDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: Token | null;
}

const TokenDetailModal: React.FC<TokenDetailModalProps> = ({ isOpen, onClose, token }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !token) return null;

  const copyAddress = async () => {
    await navigator.clipboard.writeText(token.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-background/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${token.name} details`}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.2 }}
        className="bg-surface border border-border rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <VerifiedIcon verified={token.verified} />
            <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
              {token.name}
              <span className="text-text-secondary text-base font-normal">({token.symbol})</span>
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {token.chainName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text transition-colors p-1 rounded-lg"
            aria-label="Close dialog"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <PriceInfoCard token={token} />
            <PriceHistoryCard token={token} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <SupplyCard token={token} />
            <TeamAuditCard token={token} />
            <CommunityCard token={token} />
          </div>

          <RiskAssessmentCard token={token} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-between items-center flex-shrink-0 gap-4">
          <div className="text-sm text-text-secondary truncate">
            Token address: <span className="font-mono">{token.address}</span>
          </div>
          <button
            onClick={copyAddress}
            className="px-3 py-1.5 bg-surface-2 border border-border rounded-lg text-sm hover:border-primary/40 transition-colors flex-shrink-0 inline-flex items-center gap-1.5"
          >
            {copied ? (
              <Check size={13} className="text-success" aria-hidden="true" />
            ) : (
              <Copy size={13} aria-hidden="true" />
            )}
            {copied ? 'Copied' : 'Copy address'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TokenDetailModal;
