// Portfolio — real holdings + USD values from the indexer for any address.
// Connect a wallet (address only) or paste one. P&L is upstream-stubbed and
// renders as "coming soon" until the indexer ships it.
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Search, Wallet as WalletIcon, Hourglass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EnhancedSEO } from '@/components/EnhancedSEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import { usePortfolio } from '@/features/indexer';
import type { PortfolioToken } from '@/features/indexer';
import {
  formatCompact,
  formatPriceMaybe,
  formatUSD,
  formatUSDMaybe,
  shortenAddress,
  timeAgo,
} from '@/lib/format';

const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

const holdingColumns: ColumnDef<PortfolioToken, unknown>[] = [
  {
    header: 'Token',
    accessorKey: 'symbol',
    cell: ({ row }) => (
      <Link to={`/token/${row.original.token_address}`} className="group flex flex-col">
        <span className="font-semibold group-hover:text-primary transition-colors">
          {row.original.symbol}
        </span>
        <span className="text-xs text-text-secondary truncate max-w-[180px]">
          {row.original.name}
        </span>
      </Link>
    ),
  },
  {
    header: 'Balance',
    accessorKey: 'balance_formatted',
    cell: ({ row }) => (
      <span className="font-mono tabular-nums">
        {formatCompact(row.original.balance_formatted)}
      </span>
    ),
  },
  {
    header: 'Price',
    accessorKey: 'price_usd',
    cell: ({ row }) => (
      <span className="font-mono tabular-nums">{formatPriceMaybe(row.original.price_usd)}</span>
    ),
  },
  {
    header: 'Value',
    accessorKey: 'value_usd',
    cell: ({ row }) => (
      <span className="font-mono tabular-nums font-semibold">
        {formatUSDMaybe(row.original.value_usd)}
      </span>
    ),
  },
];

export const PortfolioPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [address, setAddress] = useState('');
  const [connectError, setConnectError] = useState<string | null>(null);

  const { data: portfolio, isLoading, error } = usePortfolio(address, {
    enabled: ADDRESS_RE.test(address),
    refetchInterval: 30000,
  });

  const track = () => {
    const candidate = input.trim();
    if (ADDRESS_RE.test(candidate)) {
      setAddress(candidate);
      setConnectError(null);
    } else {
      setConnectError('Enter a valid 0x… address (42 characters).');
    }
  };

  const connectWallet = async () => {
    setConnectError(null);
    if (!window.ethereum) {
      setConnectError('No wallet detected — install MetaMask or paste an address.');
      return;
    }
    try {
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];
      if (accounts?.[0]) {
        setInput(accounts[0]);
        setAddress(accounts[0]);
      }
    } catch {
      setConnectError('Wallet connection was declined.');
    }
  };

  return (
    <>
      <EnhancedSEO
        title="Portfolio | CryptoWebb Analytics"
        description="Track any wallet's holdings with real indexed balances and USD valuations."
        keywords={['portfolio tracker', 'crypto portfolio', 'wallet analytics', 'holdings']}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-screen-xl p-4 md:p-6 space-y-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Briefcase className="w-7 h-7" />
            Portfolio
          </h1>
          <p className="text-text-secondary mt-1">
            Real indexed balances and valuations for any Ethereum address.
          </p>
        </div>

        {/* Address input */}
        <Card className="p-4" hover={false}>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Wallet address (0x…)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && track()}
              className="flex-1 rounded-lg bg-surface-2 border border-border px-3 py-2 text-sm font-mono text-text placeholder:text-text-secondary/50 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              aria-label="Wallet address"
            />
            <div className="flex gap-2">
              <Button onClick={track} variant="primary">
                <Search className="w-4 h-4 mr-1.5" />
                Track
              </Button>
              <Button onClick={connectWallet} variant="outline">
                <WalletIcon className="w-4 h-4 mr-1.5" />
                Connect wallet
              </Button>
            </div>
          </div>
          {connectError && <p className="mt-2 text-sm text-loss">{connectError}</p>}
        </Card>

        {error && (
          <Card className="p-4 border-loss/40" hover={false}>
            <p className="text-sm text-loss">Couldn’t load this portfolio — {error.message}</p>
          </Card>
        )}

        {portfolio && (
          <>
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 bg-primary/10 rounded-xl">
                <div className="text-sm text-text-secondary">Total value</div>
                <div className="mt-1 text-2xl font-bold font-mono tabular-nums">
                  {formatUSD(portfolio.total_value_usd)}
                </div>
                {portfolio.prices_as_of && (
                  <div className="text-xs text-text-secondary mt-1">
                    prices as of {timeAgo(portfolio.prices_as_of)}
                  </div>
                )}
              </div>
              <div className="p-4 bg-surface-2 rounded-xl">
                <div className="text-sm text-text-secondary">ETH</div>
                <div className="mt-1 text-2xl font-bold font-mono tabular-nums">
                  {formatCompact(portfolio.eth_balance_formatted, 4)}
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  {formatUSD(portfolio.eth_value_usd)}
                </div>
              </div>
              <div className="p-4 bg-surface-2 rounded-xl">
                <div className="text-sm text-text-secondary">Tokens held</div>
                <div className="mt-1 text-2xl font-bold font-mono tabular-nums">
                  {portfolio.token_count}
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  <Link to={`/wallet/${portfolio.address}`} className="hover:text-primary">
                    Full profile for {shortenAddress(portfolio.address)}
                  </Link>
                </div>
              </div>
            </div>

            {/* Holdings */}
            <Card className="p-0 overflow-hidden" hover={false}>
              <DataTable
                data={portfolio.tokens}
                columns={holdingColumns}
                isLoading={isLoading}
                emptyMessage="No token holdings found for this address."
                rowKey={(t) => t.token_address}
                initialSorting={[{ id: 'value_usd', desc: true }]}
                virtualized
                height={480}
              />
            </Card>

            {/* P&L coming soon */}
            <Card className="p-4" hover={false}>
              <div className="flex items-center gap-3 text-text-secondary">
                <Hourglass className="w-5 h-5" />
                <div>
                  <p className="font-medium text-text">Profit &amp; loss — coming soon</p>
                  <p className="text-sm">
                    Realized/unrealized P&amp;L, cost basis and win rate are being rebuilt on the
                    canonical data layer and will appear here automatically.
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}

        {!address && !error && (
          <Card className="p-8 text-center text-text-secondary" hover={false}>
            Paste an address or connect your wallet to see real holdings.
          </Card>
        )}
      </motion.div>
    </>
  );
};

export default PortfolioPage;
