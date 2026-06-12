import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useNewContracts } from '../api/useBlockchainData';
import { NewContract } from '../../../types/blockchain';

interface NewContractsCardProps {
  limit?: number;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

export const NewContractsCard: React.FC<NewContractsCardProps> = ({
  limit = 20,
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
}) => {
  const [timeframe, setTimeframe] = useState<'1h' | '6h' | '12h' | '24h' | '7d'>('24h');

  const {
    data: contracts,
    isLoading,
    isError,
    error,
  } = useNewContracts(
    { limit, timeframe },
    { refetchInterval: autoRefresh ? refreshInterval : undefined }
  );

  if (isError) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold mb-4">New contracts</h2>
        <div className="text-error text-center py-8">
          Error loading new contracts: {error?.message}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-3 mb-4 flex-wrap">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
          New contracts
        </h2>

        {/* Timeframe Selector */}
        <div className="flex gap-1.5" role="group" aria-label="Timeframe">
          {(['1h', '6h', '12h', '24h', '7d'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              aria-pressed={timeframe === tf}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                timeframe === tf
                  ? 'bg-primary text-white'
                  : 'bg-surface-2 text-text-secondary hover:text-text border border-border'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-surface-2 rounded-lg"></div>
            </div>
          ))}
        </div>
      )}

      {/* Contracts List */}
      {!isLoading && contracts && (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {contracts.length === 0 ? (
            <div className="text-text-secondary text-center py-8">
              No new contracts found in the last {timeframe}
            </div>
          ) : (
            contracts.map((contract, index) => (
              <ContractCard key={contract.address} contract={contract} index={index} />
            ))
          )}
        </div>
      )}

      {/* Footer */}
      {!isLoading && contracts && contracts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border text-xs text-text-secondary text-center">
          Showing {contracts.length} contracts from the last {timeframe}
          {autoRefresh && ' • Auto-refresh enabled'}
        </div>
      )}
    </div>
  );
};

interface ContractCardProps {
  contract: NewContract;
  index: number;
}

const ContractCard: React.FC<ContractCardProps> = ({ contract, index }) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-surface-2 border border-border rounded-lg p-4 hover:border-primary/30 transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-semibold">{contract.symbol}</h3>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {contract.age}
            </span>
          </div>
          <p className="text-text-secondary text-sm truncate">{contract.name}</p>
          <p className="text-text-secondary/60 text-xs font-mono mt-1 break-all">
            {contract.address}
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="font-semibold font-mono tabular-nums">
            {formatPrice(contract.priceUSD)}
          </div>
          <div className="text-text-secondary text-xs font-mono tabular-nums">
            {contract.priceETH.toFixed(6)} ETH
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-border">
        <div>
          <div className="text-text-secondary text-xs">Volume 24h</div>
          <div className="font-mono tabular-nums text-sm">{formatNumber(contract.volume24h)}</div>
        </div>
        <div>
          <div className="text-text-secondary text-xs">Liquidity</div>
          <div className="font-mono tabular-nums text-sm">
            {formatNumber(contract.liquidityUSD)}
          </div>
        </div>
        <div>
          <div className="text-text-secondary text-xs">Pairs</div>
          <div className="font-mono tabular-nums text-sm">{contract.pairCount}</div>
        </div>
      </div>
    </motion.div>
  );
};
