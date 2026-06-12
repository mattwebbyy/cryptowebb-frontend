// src/pages/analytics/IndexerDashboard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Sparkles,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Search,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  useTopTokens,
  useNewTokens,
  useWhaleTransfers,
  useDefiStats,
  usePrices,
  useIndexerStatus,
  useExchangeFlows,
  useSmartMoney,
  usePortfolio,
} from '@/features/indexer';
import type {
  TopToken,
  NewToken,
  WhaleTransfer,
  ExchangeFlow,
  PnLSummary,
} from '@/features/indexer';

// Helper to format numbers
const formatNumber = (num: number, decimals = 2): string => {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(decimals)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(decimals)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(decimals)}K`;
  return num.toFixed(decimals);
};

// Helper to format USD
const formatUSD = (num: number): string => {
  return `$${formatNumber(num)}`;
};

// Helper to shorten address
const shortenAddress = (addr: string): string => {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

// Helper to format time ago
const timeAgo = (timestamp: number): string => {
  const seconds = Math.floor(Date.now() / 1000 - timestamp);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

// Stats Card Component
const StatsCard: React.FC<{
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
}> = ({ title, value, change, icon }) => (
  <Card className="p-4">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-text-secondary">{title}</p>
        <p className="text-2xl font-bold mt-1 font-mono tabular-nums">{value}</p>
        {change !== undefined && (
          <div
            className={`flex items-center mt-1 text-sm ${change >= 0 ? 'text-gain' : 'text-loss'}`}
          >
            {change >= 0 ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span>{Math.abs(change).toFixed(2)}%</span>
          </div>
        )}
      </div>
      <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
    </div>
  </Card>
);

// Top Tokens Table
const TopTokensTable: React.FC<{ tokens: TopToken[] }> = ({ tokens }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="text-left text-text-secondary text-sm border-b border-border">
          <th className="pb-2 font-mono">#</th>
          <th className="pb-2 font-mono">Token</th>
          <th className="pb-2 font-mono text-right">Price</th>
          <th className="pb-2 font-mono text-right">Volume 24h</th>
          <th className="pb-2 font-mono text-right">Transfers</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((token, i) => (
          <tr
            key={token.address}
            className="border-b border-border hover:bg-primary/5 transition-colors"
          >
            <td className="py-3 text-text-secondary">{i + 1}</td>
            <td className="py-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{token.symbol}</span>
                <span className="text-xs text-text-secondary">{shortenAddress(token.address)}</span>
              </div>
            </td>
            <td className="py-3 text-right text-primary">
              {token.price_usd ? formatUSD(token.price_usd) : '-'}
            </td>
            <td className="py-3 text-right text-primary">
              {token.volume_24h_usd ? formatUSD(token.volume_24h_usd) : '-'}
            </td>
            <td className="py-3 text-right text-text-secondary">
              {formatNumber(token.transfer_count, 0)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// New Tokens List
const NewTokensList: React.FC<{ tokens: NewToken[] }> = ({ tokens }) => (
  <div className="space-y-3">
    {tokens.map((token) => (
      <div
        key={token.address}
        className="p-3 bg-surface-2 border border-border rounded-lg hover:border-primary/30 transition-colors"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-warning" />
            <span className="font-semibold">{token.symbol}</span>
            <span className="text-xs text-text-secondary">{token.name}</span>
          </div>
          <span className="text-xs text-text-secondary">{timeAgo(token.timestamp)}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-text-secondary">DEX:</span>{' '}
            <span>{token.dex}</span>
          </div>
          <div>
            <span className="text-text-secondary">Liq:</span>{' '}
            <span>{formatUSD(token.initial_liquidity_usd)}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Whale Transfers List
const WhaleTransfersList: React.FC<{ transfers: WhaleTransfer[] }> = ({ transfers }) => (
  <div className="space-y-2">
    {transfers.map((tx, i) => (
      <div
        key={`${tx.transaction_hash}-${i}`}
        className="p-3 bg-surface-2 border border-border rounded-lg"
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{tx.token_symbol}</span>
            <span className="text-lg font-bold text-warning">{formatUSD(tx.value_usd)}</span>
          </div>
          <span className="text-xs text-text-secondary">{timeAgo(tx.timestamp)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span>{tx.from_label || shortenAddress(tx.from_address)}</span>
          <ArrowUpRight className="w-3 h-3" />
          <span>{tx.to_label || shortenAddress(tx.to_address)}</span>
        </div>
      </div>
    ))}
  </div>
);

// Exchange Flows Component
const ExchangeFlowsCard: React.FC<{ flows: ExchangeFlow[] }> = ({ flows }) => (
  <div className="space-y-3">
    {flows.slice(0, 5).map((flow) => (
      <div key={flow.exchange} className="flex items-center justify-between">
        <span className="font-mono">{flow.exchange}</span>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-text-secondary">In</div>
            <div className="text-gain text-sm">{formatUSD(flow.inflow_usd)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-text-secondary">Out</div>
            <div className="text-loss text-sm">{formatUSD(flow.outflow_usd)}</div>
          </div>
          <div className="text-right min-w-[80px]">
            <div className="text-xs text-text-secondary">Net</div>
            <div
              className={`text-sm font-semibold ${flow.net_flow_usd >= 0 ? 'text-gain' : 'text-loss'}`}
            >
              {formatUSD(flow.net_flow_usd)}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Smart Money Leaderboard
const SmartMoneyList: React.FC<{ traders: PnLSummary[] }> = ({ traders }) => (
  <div className="space-y-2">
    {traders.slice(0, 5).map((trader, i) => (
      <div
        key={trader.address}
        className="flex items-center justify-between p-2 bg-surface-2 rounded"
      >
        <div className="flex items-center gap-3">
          <span className="text-text-secondary w-5">{i + 1}</span>
          <div>
            <div className="text-sm font-mono">
              {shortenAddress(trader.address)}
            </div>
            <div className="text-xs text-text-secondary">{trader.smart_money_tier}</div>
          </div>
        </div>
        <div className="text-right">
          <div
            className={`text-sm font-semibold ${trader.total_pnl >= 0 ? 'text-gain' : 'text-loss'}`}
          >
            {formatUSD(trader.total_pnl)}
          </div>
          <div className="text-xs text-text-secondary">
            {trader.win_rate.toFixed(1)}% win rate
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Portfolio Lookup Component
const PortfolioLookup: React.FC = () => {
  const [address, setAddress] = useState('');
  const [searchAddress, setSearchAddress] = useState('');

  const { data: portfolio, isLoading, error } = usePortfolio(searchAddress, {
    enabled: !!searchAddress && searchAddress.length === 42,
  });

  const handleSearch = () => {
    if (address.length === 42) {
      setSearchAddress(address);
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter wallet address (0x...)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="flex-1 rounded-lg bg-surface-2 border border-border px-3 py-2 text-sm text-text placeholder:text-text-secondary/50 transition-colors hover:border-primary/30 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
        />
        <Button
          onClick={handleSearch}
          variant="primary" aria-label="Search portfolio"
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {isLoading && (
        <div className="text-center py-4 text-text-secondary">Loading portfolio...</div>
      )}

      {error && (
        <div className="text-center py-4 text-loss">Failed to load portfolio</div>
      )}

      {portfolio && (
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-primary/10 rounded">
            <span className="text-text-secondary">Total Value</span>
            <span className="text-xl font-bold font-mono tabular-nums">
              {formatUSD(portfolio.total_value_usd)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-surface-2 rounded">
              <div className="text-text-secondary">ETH Balance</div>
              <div>
                {portfolio.eth_balance_formatted.toFixed(4)} ETH
              </div>
            </div>
            <div className="p-2 bg-surface-2 rounded">
              <div className="text-text-secondary">Tokens</div>
              <div>{portfolio.token_count}</div>
            </div>
          </div>
          {portfolio.tokens.length > 0 && (
            <div className="max-h-48 overflow-y-auto space-y-1">
              {portfolio.tokens.slice(0, 10).map((token) => (
                <div
                  key={token.token_address}
                  className="flex justify-between p-2 bg-surface-2 rounded text-sm"
                >
                  <span>{token.symbol}</span>
                  <span className="text-text-secondary">
                    {token.value_usd ? formatUSD(token.value_usd) : '-'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Main Dashboard Component
const IndexerDashboard: React.FC = () => {
  const { data: status } = useIndexerStatus({ refetchInterval: 10000 });
  const { data: prices } = usePrices({ refetchInterval: 15000 });
  const { data: defiStats } = useDefiStats({ refetchInterval: 60000 });
  const { data: topTokens, refetch: refetchTokens } = useTopTokens(
    { limit: 10 },
    { refetchInterval: 30000 }
  );
  const { data: newTokens, refetch: refetchNew } = useNewTokens(
    { limit: 5, hours: 24 },
    { refetchInterval: 30000 }
  );
  const { data: whales, refetch: refetchWhales } = useWhaleTransfers(
    { limit: 10 },
    { refetchInterval: 30000 }
  );
  const { data: exchangeFlows } = useExchangeFlows({ hours: 24 }, { refetchInterval: 60000 });
  const { data: smartMoney } = useSmartMoney({ limit: 5 }, { refetchInterval: 60000 });

  const handleRefreshAll = () => {
    refetchTokens();
    refetchNew();
    refetchWhales();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Zap className="w-8 h-8" />
            Indexer analytics
          </h1>
          <p className="text-text-secondary mt-1">
            Real-time data from your blockchain indexer
          </p>
        </div>
        <div className="flex items-center gap-4">
          {status && (
            <div className="text-sm text-text-secondary">
              Block #{status.indexed_block?.toLocaleString()}
            </div>
          )}
          <Button
            onClick={handleRefreshAll}
            variant="outline"
            
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="ETH Price"
          value={prices?.eth_price ? formatUSD(prices.eth_price) : '-'}
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
        />
        <StatsCard
          title="24h Volume"
          value={defiStats?.total_volume_usd ? formatUSD(defiStats.total_volume_usd) : '-'}
          icon={<Activity className="w-5 h-5 text-primary" />}
        />
        <StatsCard
          title="Active Addresses"
          value={
            defiStats?.unique_active_addresses
              ? formatNumber(defiStats.unique_active_addresses, 0)
              : '-'
          }
          icon={<Wallet className="w-5 h-5 text-primary" />}
        />
        <StatsCard
          title="New Tokens (24h)"
          value={
            defiStats?.new_tokens_launched
              ? defiStats.new_tokens_launched.toString()
              : '-'
          }
          icon={<Sparkles className="w-5 h-5 text-primary" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Tokens - Takes 2 columns */}
        <Card className="lg:col-span-2 p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Top Tokens by Activity
          </h2>
          {topTokens ? (
            <TopTokensTable tokens={topTokens} />
          ) : (
            <div className="text-center py-8 text-text-secondary">Loading tokens...</div>
          )}
        </Card>

        {/* New Tokens */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            New Tokens
          </h2>
          {newTokens ? (
            <NewTokensList tokens={newTokens} />
          ) : (
            <div className="text-center py-8 text-text-secondary">Loading...</div>
          )}
        </Card>

        {/* Whale Transfers */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Whale Transfers
          </h2>
          {whales ? (
            <WhaleTransfersList transfers={whales} />
          ) : (
            <div className="text-center py-8 text-text-secondary">Loading...</div>
          )}
        </Card>

        {/* Exchange Flows */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5" />
            Exchange Flows (24h)
          </h2>
          {exchangeFlows ? (
            <ExchangeFlowsCard flows={exchangeFlows} />
          ) : (
            <div className="text-center py-8 text-text-secondary">Loading...</div>
          )}
        </Card>

        {/* Smart Money */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Smart Money Leaderboard
          </h2>
          {smartMoney ? (
            <SmartMoneyList traders={smartMoney} />
          ) : (
            <div className="text-center py-8 text-text-secondary">Loading...</div>
          )}
        </Card>
      </div>

      {/* Portfolio Lookup */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Search className="w-5 h-5" />
          Portfolio Lookup
        </h2>
        <PortfolioLookup />
      </Card>
    </motion.div>
  );
};

export default IndexerDashboard;
