// Wallet profiler — identity label, ETH position, portfolio holdings and
// transfer history for any address. Upstream placeholder stats (swaps,
// unique tokens) are hidden rather than shown as zeros.
import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, ExternalLink, Copy, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import {
  useAddressProfile,
  usePortfolio,
  useAddressTransfers,
  PriceStalenessBadge,
} from '@/features/indexer';
import type { PortfolioToken, TokenTransfer } from '@/features/indexer';
import {
  EM_DASH,
  etherscanAddressUrl,
  etherscanTxUrl,
  formatCompact,
  formatPriceMaybe,
  formatUSD,
  formatUSDSane,
  shortenAddress,
} from '@/lib/format';

type Tab = 'holdings' | 'activity';

const CATEGORY_COLORS: Record<string, string> = {
  cex: 'bg-primary/15 text-primary',
  dex: 'bg-chart-3/15 text-chart-3',
  mixer: 'bg-loss/15 text-loss',
  defi: 'bg-gain/15 text-gain',
};

const WalletPage: React.FC = () => {
  const { address = '' } = useParams<{ address: string }>();
  const [tab, setTab] = useState<Tab>('holdings');
  const [copied, setCopied] = useState(false);

  const { data: profile, isLoading: profileLoading } = useAddressProfile(address);
  const { data: portfolio, isLoading: portfolioLoading } = usePortfolio(address, {
    enabled: tab === 'holdings',
  });
  const { data: transfers, isLoading: transfersLoading } = useAddressTransfers(
    address,
    { limit: 100 },
    { enabled: tab === 'activity' }
  );

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const holdingColumns = useMemo<ColumnDef<PortfolioToken, unknown>[]>(
    () => [
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
          <span className="font-mono tabular-nums">
            {formatPriceMaybe(row.original.price_usd)}
          </span>
        ),
      },
      {
        header: 'Value',
        accessorKey: 'value_usd',
        cell: ({ row }) => (
          <span className="font-mono tabular-nums font-semibold">
            {formatUSDSane(row.original.value_usd)}
          </span>
        ),
      },
    ],
    []
  );

  const transferColumns = useMemo<ColumnDef<TokenTransfer, unknown>[]>(
    () => [
      {
        header: 'Block',
        accessorKey: 'block_number',
        cell: ({ row }) => (
          <a
            href={etherscanTxUrl(row.original.tx_hash)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono tabular-nums text-text-secondary hover:text-primary transition-colors"
          >
            {row.original.block_number.toLocaleString()}
            <ExternalLink className="w-3 h-3" />
          </a>
        ),
      },
      {
        header: 'Direction',
        id: 'direction',
        enableSorting: false,
        cell: ({ row }) => {
          const incoming = row.original.to.toLowerCase() === address.toLowerCase();
          return (
            <span
              className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${
                incoming ? 'bg-gain/10 text-gain' : 'bg-loss/10 text-loss'
              }`}
            >
              {incoming ? 'IN' : 'OUT'}
            </span>
          );
        },
      },
      {
        header: 'Token',
        accessorKey: 'token',
        enableSorting: false,
        cell: ({ row }) => (
          <Link
            to={`/token/${row.original.token}`}
            className="font-mono text-sm hover:text-primary transition-colors"
          >
            {shortenAddress(row.original.token)}
          </Link>
        ),
      },
      {
        header: 'Counterparty',
        id: 'counterparty',
        enableSorting: false,
        cell: ({ row }) => {
          const incoming = row.original.to.toLowerCase() === address.toLowerCase();
          const other = incoming ? row.original.from : row.original.to;
          return (
            <Link
              to={`/wallet/${other}`}
              className="font-mono text-sm hover:text-primary transition-colors"
            >
              {shortenAddress(other)}
            </Link>
          );
        },
      },
    ],
    [address]
  );

  const label = profile?.label;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-screen-xl p-4 md:p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 flex-wrap">
            <Wallet className="w-7 h-7" />
            {label ? label.name : shortenAddress(address, 6)}
            {label && (
              <Link
                to="/labels"
                className={`rounded px-2 py-0.5 text-xs font-medium hover:opacity-80 transition-opacity ${
                  CATEGORY_COLORS[label.category] ?? 'bg-surface-2 text-text-secondary'
                }`}
                title="Browse the labels directory"
              >
                {label.category}
                {label.subcategory ? ` · ${label.subcategory}` : ''}
              </Link>
            )}
            {profile?.is_contract && (
              <span className="rounded px-2 py-0.5 text-xs font-medium bg-surface-2 text-text-secondary">
                contract
              </span>
            )}
          </h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-text-secondary">
            <span className="font-mono">{shortenAddress(address, 10)}</span>
            <button
              onClick={copyAddress}
              className="p-1 rounded hover:bg-surface-2 transition-colors"
              aria-label="Copy address"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-gain" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <a
              href={etherscanAddressUrl(address)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded hover:bg-surface-2 transition-colors"
              aria-label="View on Etherscan"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          {label && label.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {label.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded px-1.5 py-0.5 text-[11px] bg-surface-2 text-text-secondary"
                >
                  {tag.replace('_', ' ')}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold font-mono tabular-nums">
            {profile ? formatUSD(profile.eth_value_usd) : profileLoading ? '…' : EM_DASH}
          </div>
          <div className="text-xs text-text-secondary">
            {profile ? `${formatCompact(profile.eth_balance)} ETH` : 'ETH value'}
          </div>
        </div>
      </div>

      {/* Profile stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-surface-2 rounded-lg">
          <div className="text-xs text-text-secondary">Transfers in</div>
          <div className="mt-0.5 font-mono tabular-nums font-semibold">
            {profile ? formatCompact(profile.total_transfers_in, 0) : EM_DASH}
          </div>
        </div>
        <div className="p-3 bg-surface-2 rounded-lg">
          <div className="text-xs text-text-secondary">Transfers out</div>
          <div className="mt-0.5 font-mono tabular-nums font-semibold">
            {profile ? formatCompact(profile.total_transfers_out, 0) : EM_DASH}
          </div>
        </div>
        <div className="p-3 bg-surface-2 rounded-lg">
          <div className="text-xs text-text-secondary">First seen block</div>
          <div className="mt-0.5 font-mono tabular-nums font-semibold">
            {profile?.first_seen_block ? profile.first_seen_block.toLocaleString() : EM_DASH}
          </div>
        </div>
        <div className="p-3 bg-surface-2 rounded-lg">
          <div className="text-xs text-text-secondary">Last active block</div>
          <div className="mt-0.5 font-mono tabular-nums font-semibold">
            {profile?.last_active_block ? profile.last_active_block.toLocaleString() : EM_DASH}
          </div>
        </div>
      </div>

      {/* Portfolio total */}
      {tab === 'holdings' && portfolio && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-primary/10 rounded-lg">
          <span className="text-text-secondary text-sm">
            Portfolio value ({portfolio.token_count} tokens + ETH)
          </span>
          <span className="inline-flex items-center gap-2">
            <PriceStalenessBadge asOf={portfolio.prices_as_of} />
            <span className="text-xl font-bold font-mono tabular-nums">
              {formatUSD(portfolio.total_value_usd)}
            </span>
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="inline-flex rounded-lg border border-border overflow-hidden">
        {(['holdings', 'activity'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={`px-4 py-1.5 text-sm capitalize transition-colors ${
              tab === t
                ? 'bg-primary/15 text-primary font-medium'
                : 'text-text-secondary hover:text-text hover:bg-surface-2'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <Card className="p-0 overflow-hidden" hover={false}>
        {tab === 'holdings' ? (
          <DataTable
            data={portfolio?.tokens ?? []}
            columns={holdingColumns}
            isLoading={portfolioLoading}
            emptyMessage="No token holdings found."
            rowKey={(t) => t.token_address}
            initialSorting={[{ id: 'value_usd', desc: true }]}
            virtualized
            height={520}
          />
        ) : (
          <DataTable
            data={transfers ?? []}
            columns={transferColumns}
            isLoading={transfersLoading}
            emptyMessage="No activity indexed yet."
            rowKey={(t) => `${t.tx_hash}:${t.token}:${t.value}`}
            virtualized
            height={520}
          />
        )}
      </Card>
    </motion.div>
  );
};

export default WalletPage;
