// src/features/cipher/components/TokenCardList.tsx — mobile card view of the token list.
import { memo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Copy, Eye } from 'lucide-react';
import { Token, formatCurrency, getRiskColor, getRiskText, shortAddress } from '../types';
import { AuditBadge, PriceChange, TeamBadge, VerifiedIcon } from './badges';

interface TokenCardProps {
  token: Token;
  onShowDetails: (token: Token) => void;
}

// Memoized for the same reason as TokenRow: filter changes keep token object
// identity, so unchanged cards skip re-rendering.
const TokenCard = memo(({ token, onShowDetails }: TokenCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-surface border border-border rounded-xl p-4 space-y-3"
  >
    {/* Token Header */}
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-2">
        <VerifiedIcon verified={token.verified} />
        <div>
          <div className="font-semibold text-base">{token.name}</div>
          <div className="text-sm text-text-secondary flex items-center gap-2">
            <span>{token.symbol}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {token.chainName}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() => onShowDetails(token)}
        className="p-2 bg-surface-2 border border-border hover:border-primary/40 rounded-lg transition-colors"
        aria-label={`View ${token.symbol} details`}
      >
        <Eye size={16} className="text-text-secondary" aria-hidden="true" />
      </button>
    </div>

    {/* Price and Change */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="text-xs text-text-secondary uppercase tracking-wide">Price</div>
        <div className="text-base font-mono tabular-nums">${token.price.toFixed(6)}</div>
      </div>
      <div>
        <div className="text-xs text-text-secondary uppercase tracking-wide">24h change</div>
        <div className="text-base">
          <PriceChange change={token.priceChange24h} iconSize={16} />
        </div>
      </div>
    </div>

    {/* Market Cap and Holders */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="text-xs text-text-secondary uppercase tracking-wide">Market cap</div>
        <div className="text-sm font-mono tabular-nums">{formatCurrency(token.marketCap)}</div>
      </div>
      <div>
        <div className="text-xs text-text-secondary uppercase tracking-wide">Holders</div>
        <div className="text-sm font-mono tabular-nums">{token.holders.toLocaleString()}</div>
      </div>
    </div>

    {/* Status Badges + Risk */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <AuditBadge token={token} />
        <TeamBadge token={token} />
      </div>
      <div className="text-xs text-text-secondary">
        Risk:{' '}
        <span className={`font-medium ${getRiskColor(token.riskScore)}`}>
          {getRiskText(token.riskScore)}
        </span>
      </div>
    </div>

    {/* Address */}
    <div className="text-xs text-text-secondary/70 font-mono flex items-center gap-1.5">
      {shortAddress(token.address, 10, 8)}
      <button
        onClick={() => navigator.clipboard.writeText(token.address)}
        className="hover:text-text"
        title="Copy address"
        aria-label={`Copy ${token.symbol} address`}
      >
        <Copy size={11} aria-hidden="true" />
      </button>
    </div>
  </motion.div>
));
TokenCard.displayName = 'TokenCard';

interface TokenCardListProps {
  tokens: Token[];
  onShowDetails: (token: Token) => void;
}

export const TokenCardList = ({ tokens, onShowDetails }: TokenCardListProps) => (
  <div className="p-4 space-y-4">
    {tokens.length > 0 ? (
      tokens.map((token) => (
        <TokenCard key={token.id} token={token} onShowDetails={onShowDetails} />
      ))
    ) : (
      <div className="text-center text-text-secondary py-12">
        <AlertTriangle size={40} className="mx-auto mb-4 opacity-50" aria-hidden="true" />
        <p>No tokens found matching your criteria</p>
      </div>
    )}
  </div>
);
