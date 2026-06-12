import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useTrendingTokens } from '../api/useBlockchainData';
import { TrendingToken } from '../../../types/blockchain';

interface TrendingTokensCardProps {
  limit?: number;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

export const TrendingTokensCard: React.FC<TrendingTokensCardProps> = ({
  limit = 20,
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
}) => {
  const [sortBy, setSortBy] = useState<
    'volume' | 'liquidity' | 'transactions' | 'marketCap' | 'momentum'
  >('volume');

  const {
    data: tokens,
    isLoading,
    isError,
    error,
  } = useTrendingTokens(
    { limit, sortBy },
    { refetchInterval: autoRefresh ? refreshInterval : undefined }
  );

  if (isError) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold mb-4">Trending tokens</h2>
        <div className="text-error text-center py-8">
          Error loading trending tokens: {error?.message}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-3 mb-4 flex-wrap">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Flame className="w-5 h-5 text-warning" aria-hidden="true" />
          Trending tokens
        </h2>

        {/* Sort By Selector */}
        <div className="flex gap-1.5 flex-wrap" role="group" aria-label="Sort tokens by">
          {(['volume', 'liquidity', 'transactions', 'momentum'] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              aria-pressed={sortBy === sort}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                sortBy === sort
                  ? 'bg-primary text-white'
                  : 'bg-surface-2 text-text-secondary hover:text-text border border-border'
              }`}
            >
              {sort.charAt(0).toUpperCase() + sort.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-surface-2 rounded-lg"></div>
            </div>
          ))}
        </div>
      )}

      {/* Tokens List */}
      {!isLoading && tokens && (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {tokens.length === 0 ? (
            <div className="text-text-secondary text-center py-8">No trending tokens found</div>
          ) : (
            tokens.map((token, index) => (
              <TokenCard key={token.address} token={token} index={index} />
            ))
          )}
        </div>
      )}

      {/* Footer */}
      {!isLoading && tokens && tokens.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border text-xs text-text-secondary text-center">
          Showing {tokens.length} tokens sorted by {sortBy}
          {autoRefresh && ' • Auto-refresh enabled'}
        </div>
      )}
    </div>
  );
};

interface TokenCardProps {
  token: TrendingToken;
  index: number;
}

const TokenCard: React.FC<TokenCardProps> = ({ token, index }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  const formatPrice = (price: number): string => {
    if (price < 0.000001) {
      return `$${price.toExponential(2)}`;
    } else if (price < 1) {
      return `$${price.toFixed(6)}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change: number): { text: string; color: string } => {
    const isPositive = change >= 0;
    return {
      text: `${isPositive ? '+' : ''}${change.toFixed(2)}%`,
      color: isPositive ? 'text-gain' : 'text-loss',
    };
  };

  const volumeChange = formatChange(token.volumeChange);
  const priceChange = formatChange(token.priceChange24h);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-surface-2 border border-border rounded-lg p-4 hover:border-primary/30 transition-colors"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-text-secondary/60 text-xs font-mono tabular-nums">
              #{index + 1}
            </span>
            <h3 className="font-semibold">{token.symbol}</h3>
          </div>
          <p className="text-text-secondary text-sm truncate">{token.name}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="font-semibold font-mono tabular-nums">{formatPrice(token.priceUSD)}</div>
          <div className={`text-xs font-mono tabular-nums ${priceChange.color}`}>
            {priceChange.text}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mt-3 pt-3 border-t border-border">
        <div>
          <div className="text-text-secondary text-xs">Volume 24h</div>
          <div className="font-mono tabular-nums text-sm">{formatNumber(token.volume24h)}</div>
          <div className={`text-xs font-mono tabular-nums ${volumeChange.color}`}>
            {volumeChange.text}
          </div>
        </div>
        <div>
          <div className="text-text-secondary text-xs">Liquidity</div>
          <div className="font-mono tabular-nums text-sm">{formatNumber(token.liquidityUSD)}</div>
        </div>
        <div>
          <div className="text-text-secondary text-xs">TX 24h</div>
          <div className="font-mono tabular-nums text-sm">{token.txCount24h.toLocaleString()}</div>
          <div className="text-xs font-mono tabular-nums text-text-secondary">
            <span className="text-gain">{token.buyCount24h}</span>/
            <span className="text-loss">{token.sellCount24h}</span>
          </div>
        </div>
        <div>
          <div className="text-text-secondary text-xs">Market cap</div>
          <div className="font-mono tabular-nums text-sm">
            {token.marketCap ? formatNumber(token.marketCap) : 'N/A'}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <div className="text-text-secondary/60 text-xs font-mono break-all">{token.address}</div>
      </div>
    </motion.div>
  );
};
