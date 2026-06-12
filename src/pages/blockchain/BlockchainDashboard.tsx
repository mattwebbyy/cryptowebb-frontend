import React from 'react';
import { NewContractsCard, TrendingTokensCard } from '../../features/blockchain';

export const BlockchainDashboard: React.FC = () => {
  return (
    <div className="min-h-screen max-w-7xl mx-auto p-6 pt-24">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Blockchain analytics</h1>
        <p className="text-text-secondary">
          Real-time data from the Ethereum blockchain, indexed by CryptoWebb.
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NewContractsCard limit={20} autoRefresh={true} refreshInterval={30000} />
        <TrendingTokensCard limit={20} autoRefresh={true} refreshInterval={30000} />
      </div>

      {/* Additional Info Section */}
      <div className="mt-8 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-base font-semibold mb-3">About this dashboard</h2>
        <div className="space-y-2 text-sm text-text-secondary leading-relaxed">
          <p>
            <strong className="text-text font-medium">New contracts:</strong> recently deployed
            ERC-20 tokens with their initial trading pairs — track the latest tokens entering the
            market with liquidity and volume data.
          </p>
          <p>
            <strong className="text-text font-medium">Trending tokens:</strong> hot tokens ranked by
            volume, liquidity, transactions, or momentum.
          </p>
          <p>
            <strong className="text-text font-medium">Data updates:</strong> everything refreshes
            automatically every 30 seconds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlockchainDashboard;
