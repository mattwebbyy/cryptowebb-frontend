// Token detail page — stats header, socials, holders/transfers tabs.
// No price chart yet: the indexer doesn't expose OHLC candles; the chart
// slots in here when that endpoint ships.
import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Coins,
  ExternalLink,
  Globe,
  Github,
  MessageCircle,
  Send,
  Twitter,
  Copy,
  Check,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  useTokenStats,
  useTokenHolders,
  useTokenTransfers,
  useTokenSocials,
  PriceStalenessBadge,
} from '@/features/indexer';
import type { HolderInfo, TokenTransfer } from '@/features/indexer';
import {
  EM_DASH,
  etherscanAddressUrl,
  etherscanTxUrl,
  formatCompact,
  formatPriceMaybe,
  formatUSDSane,
  shortenAddress,
  timeAgo,
} from '@/lib/format';

type Tab = 'holders' | 'transfers';

const StatItem: React.FC<{ label: string; value: string; loading?: boolean }> = ({
  label,
  value,
  loading,
}) => (
  <div className="p-3 bg-surface-2 rounded-lg">
    <div className="text-xs text-text-secondary">{label}</div>
    {loading ? (
      <Skeleton className="mt-1.5 h-4 w-20" />
    ) : (
      <div className="mt-0.5 font-mono tabular-nums font-semibold">{value}</div>
    )}
  </div>
);

const SOCIAL_ICONS: { key: 'website' | 'twitter' | 'telegram' | 'discord' | 'github'; icon: React.ElementType; label: string }[] = [
  { key: 'website', icon: Globe, label: 'Website' },
  { key: 'twitter', icon: Twitter, label: 'Twitter' },
  { key: 'telegram', icon: Send, label: 'Telegram' },
  { key: 'discord', icon: MessageCircle, label: 'Discord' },
  { key: 'github', icon: Github, label: 'GitHub' },
];

function formatTokenAmount(raw: string, decimals: number): string {
  // Balances arrive as integer strings that overflow Number — use BigInt.
  try {
    const value = BigInt(raw);
    const base = BigInt(10) ** BigInt(decimals);
    const whole = value / base;
    if (whole > BigInt(Number.MAX_SAFE_INTEGER)) return whole.toLocaleString();
    const frac = Number(value % base) / Number(base);
    return formatCompact(Number(whole) + frac);
  } catch {
    return raw;
  }
}

const TokenPage: React.FC = () => {
  const { address = '' } = useParams<{ address: string }>();
  const [tab, setTab] = useState<Tab>('holders');
  const [copied, setCopied] = useState(false);

  const { data: stats, isLoading: statsLoading } = useTokenStats(address, {
    refetchInterval: 15000,
  });
  const { data: socials } = useTokenSocials(address);
  const { data: holders, isLoading: holdersLoading } = useTokenHolders(
    address,
    { limit: 100 },
    { enabled: tab === 'holders' }
  );
  const { data: transfers, isLoading: transfersLoading } = useTokenTransfers(
    address,
    { limit: 100 },
    { enabled: tab === 'transfers' }
  );

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const decimals = stats?.decimals ?? 18;

  const holderColumns = useMemo<ColumnDef<HolderInfo, unknown>[]>(
    () => [
      {
        header: '#',
        id: 'rank',
        enableSorting: false,
        cell: ({ row }) => <span className="text-text-secondary">{row.index + 1}</span>,
      },
      {
        header: 'Holder',
        accessorKey: 'address',
        enableSorting: false,
        cell: ({ row }) => (
          <Link
            to={`/wallet/${row.original.address}`}
            className="font-mono text-sm hover:text-primary transition-colors"
          >
            {shortenAddress(row.original.address, 8)}
          </Link>
        ),
      },
      {
        header: 'Balance',
        accessorKey: 'balance',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="font-mono tabular-nums">
            {formatTokenAmount(row.original.balance, decimals)}
          </span>
        ),
      },
    ],
    [decimals]
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
        header: 'From',
        accessorKey: 'from',
        enableSorting: false,
        cell: ({ row }) => (
          <Link
            to={`/wallet/${row.original.from}`}
            className="font-mono text-sm hover:text-primary transition-colors"
          >
            {shortenAddress(row.original.from)}
          </Link>
        ),
      },
      {
        header: 'To',
        accessorKey: 'to',
        enableSorting: false,
        cell: ({ row }) => (
          <Link
            to={`/wallet/${row.original.to}`}
            className="font-mono text-sm hover:text-primary transition-colors"
          >
            {shortenAddress(row.original.to)}
          </Link>
        ),
      },
      {
        header: 'Amount',
        accessorKey: 'value',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="font-mono tabular-nums">
            {formatTokenAmount(row.original.value, decimals)}
          </span>
        ),
      },
    ],
    [decimals]
  );

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
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Coins className="w-7 h-7" />
            {statsLoading ? 'Loading…' : stats ? `${stats.name} (${stats.symbol})` : 'Token'}
          </h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-text-secondary">
            <span className="font-mono">{shortenAddress(address, 8)}</span>
            <button
              onClick={copyAddress}
              className="p-1 rounded hover:bg-surface-2 transition-colors"
              aria-label="Copy token address"
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
        </div>

        <div className="flex items-center gap-3">
          {socials &&
            SOCIAL_ICONS.filter(({ key }) => socials[key]).map(({ key, icon: Icon, label }) => (
              <a
                key={key}
                href={socials[key] as string}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-surface-2 text-text-secondary hover:text-primary transition-colors"
                aria-label={label}
                title={label}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          <div className="flex flex-col items-end gap-1">
            <div className="text-2xl font-bold font-mono tabular-nums">
              {formatPriceMaybe(stats?.price_usd)}
            </div>
            <PriceStalenessBadge asOf={stats?.prices_as_of} />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatItem
          label="Market cap"
          value={formatUSDSane(stats?.market_cap_usd)}
          loading={statsLoading}
        />
        <StatItem
          label="Liquidity"
          value={formatUSDSane(stats?.liquidity_usd)}
          loading={statsLoading}
        />
        <StatItem
          label="24h volume"
          value={stats ? formatUSDSane(stats.volume_24h_usd) : EM_DASH}
          loading={statsLoading}
        />
        <StatItem
          label="Holders"
          value={stats ? formatCompact(stats.holder_count, 0) : EM_DASH}
          loading={statsLoading}
        />
        <StatItem
          label="Transfers"
          value={stats ? formatCompact(stats.transfer_count, 0) : EM_DASH}
          loading={statsLoading}
        />
        <StatItem
          label="First seen"
          value={stats?.first_seen_timestamp ? timeAgo(stats.first_seen_timestamp) : EM_DASH}
          loading={statsLoading}
        />
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-lg border border-border overflow-hidden">
        {(['holders', 'transfers'] as Tab[]).map((t) => (
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
        {tab === 'holders' ? (
          <DataTable
            data={holders ?? []}
            columns={holderColumns}
            isLoading={holdersLoading}
            emptyMessage="No holder data yet."
            rowKey={(h) => h.address}
            virtualized
            height={560}
          />
        ) : (
          <DataTable
            data={transfers ?? []}
            columns={transferColumns}
            isLoading={transfersLoading}
            emptyMessage="No transfers indexed yet."
            rowKey={(t) => `${t.tx_hash}:${t.block_number}`}
            virtualized
            height={560}
          />
        )}
      </Card>
    </motion.div>
  );
};

export default TokenPage;
