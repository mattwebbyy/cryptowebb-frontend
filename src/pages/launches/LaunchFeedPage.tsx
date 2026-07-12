// Token launch feed — the flagship surface. REST backfill from
// /tokens/new + live WS prepends relayed from the indexer, with
// null-tolerant cells (fresh launches lack price/liquidity for minutes).
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Radio, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { useNewTokens, GlobalPriceStalenessBadge } from '@/features/indexer';
import type { NewToken, NewTokenAlert, NewTokensSort } from '@/features/indexer';
import { useIndexerStream } from '@/hooks/useIndexerStream';
import {
  EM_DASH,
  formatAge,
  formatCompactMaybe,
  formatPriceMaybe,
  formatUSDMaybe,
  shortenAddress,
} from '@/lib/format';

const HOURS_OPTIONS = [
  { label: '1h', value: 1 },
  { label: '6h', value: 6 },
  { label: '24h', value: 24 },
  { label: '3d', value: 72 },
  { label: '7d', value: 168 },
];

const SORT_OPTIONS: { label: string; value: NewTokensSort }[] = [
  { label: 'Newest', value: 'age' },
  { label: 'Liquidity', value: 'liquidity' },
  { label: 'Swaps', value: 'swaps' },
  { label: 'Volume', value: 'volume' },
  { label: 'Market cap', value: 'mcap' },
];

const LIQUIDITY_OPTIONS = [
  { label: 'Any liquidity', value: 0 },
  { label: '≥ $1K', value: 1_000 },
  { label: '≥ $10K', value: 10_000 },
  { label: '≥ $100K', value: 100_000 },
];

/** deployer_pct above this fraction of supply gets flagged */
const DEPLOYER_FLAG_THRESHOLD = 0.2;

const DexBadge: React.FC<{ dex: string }> = ({ dex }) => (
  <span className="inline-block rounded px-1.5 py-0.5 text-[11px] font-medium bg-primary/10 text-primary whitespace-nowrap">
    {dex.replace('_', ' ')}
  </span>
);

function alertToRow(alert: NewTokenAlert): NewToken {
  return {
    token_address: alert.token_address,
    symbol: alert.symbol,
    name: alert.name,
    decimals: 18,
    pair_address: alert.pair_address,
    dex: alert.dex,
    paired_with: alert.paired_with,
    created_at: alert.timestamp,
    age_minutes: 0,
    block_number: alert.block_number,
    swaps: 0,
    buys: 0,
    sells: 0,
    unique_buyers: 0,
    unique_sellers: 0,
    volume_usd: null,
    holder_count: null,
    liquidity_usd: alert.initial_liquidity_usd > 0 ? alert.initial_liquidity_usd : null,
    price_usd: null,
    total_supply: null,
    market_cap_usd: null,
    deployer: null,
    deployer_pct: null,
    deployer_contracts: null,
  };
}

const LaunchFeedPage: React.FC = () => {
  const [hours, setHours] = useState(24);
  const [sort, setSort] = useState<NewTokensSort>('age');
  const [minLiquidity, setMinLiquidity] = useState(0);
  const [paused, setPaused] = useState(false);

  // 30s matches the backend cache TTL — the upstream launches query is
  // expensive (~30s), so the WS prepends carry the real-time freshness.
  const { data, isLoading, isError, refetch, dataUpdatedAt } = useNewTokens(
    { limit: 100, hours, sort, min_liquidity_usd: minLiquidity || undefined },
    { refetchInterval: 30000 }
  );

  const { newTokens: liveAlerts, isConnected, flushPending } = useIndexerStream({ paused });

  // Live events only make sense on the "Newest" view without filters that
  // the alert payload can't answer (liquidity floor).
  const liveMode = sort === 'age' && minLiquidity === 0;

  // One token can launch several pairs (and appear once per pair in the
  // feed), so rows key on token+pair.
  const rowKeyOf = (t: { token_address: string; pair_address: string }) =>
    `${t.token_address}:${t.pair_address}`;

  const rows = useMemo(() => {
    const base = data ?? [];
    if (!liveMode || liveAlerts.length === 0) return base;
    const seen = new Set(base.map(rowKeyOf));
    const prepended = liveAlerts
      .filter((a) => !seen.has(rowKeyOf(a)))
      .map(alertToRow);
    return [...prepended, ...base];
  }, [data, liveAlerts, liveMode]);

  const highlightedKeys = useMemo(() => {
    if (!liveMode) return undefined;
    // Flash rows that arrived over WS after the last REST refresh.
    const cutoff = Math.floor(dataUpdatedAt / 1000);
    return new Set(
      liveAlerts.filter((a) => a.timestamp >= cutoff).map(rowKeyOf)
    );
  }, [liveAlerts, liveMode, dataUpdatedAt]);

  const columns = useMemo<ColumnDef<NewToken, unknown>[]>(
    () => [
      {
        header: 'Age',
        accessorKey: 'age_minutes',
        cell: ({ row }) => (
          <span className="font-mono tabular-nums text-text-secondary">
            {formatAge(row.original.age_minutes)}
          </span>
        ),
      },
      {
        header: 'Token',
        accessorKey: 'symbol',
        cell: ({ row }) => (
          <Link
            to={`/token/${row.original.token_address}`}
            className="group flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-semibold group-hover:text-primary transition-colors">
              {row.original.symbol || EM_DASH}
            </span>
            <span className="text-xs text-text-secondary truncate max-w-[160px]">
              {row.original.name || shortenAddress(row.original.token_address)}
            </span>
          </Link>
        ),
      },
      {
        header: 'DEX',
        accessorKey: 'dex',
        meta: { className: 'hidden sm:table-cell' },
        cell: ({ row }) => <DexBadge dex={row.original.dex} />,
      },
      {
        header: 'Pair',
        accessorKey: 'paired_with',
        meta: { className: 'hidden lg:table-cell' },
        cell: ({ row }) => (
          <span className="text-text-secondary">{row.original.paired_with}</span>
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
        header: 'Liquidity',
        accessorKey: 'liquidity_usd',
        cell: ({ row }) => (
          <span className="font-mono tabular-nums">
            {formatUSDMaybe(row.original.liquidity_usd)}
          </span>
        ),
      },
      {
        header: 'MCap',
        accessorKey: 'market_cap_usd',
        meta: { className: 'hidden md:table-cell' },
        cell: ({ row }) => (
          <span className="font-mono tabular-nums">
            {formatUSDMaybe(row.original.market_cap_usd)}
          </span>
        ),
      },
      {
        header: 'Volume',
        accessorKey: 'volume_usd',
        meta: { className: 'hidden md:table-cell' },
        cell: ({ row }) => (
          <span className="font-mono tabular-nums">
            {formatUSDMaybe(row.original.volume_usd)}
          </span>
        ),
      },
      {
        header: 'Buys / Sells',
        accessorKey: 'swaps',
        meta: { className: 'hidden sm:table-cell' },
        cell: ({ row }) => (
          <span className="font-mono tabular-nums">
            <span className="text-gain">{row.original.buys}</span>
            <span className="text-text-secondary"> / </span>
            <span className="text-loss">{row.original.sells}</span>
          </span>
        ),
      },
      {
        header: 'Holders',
        accessorKey: 'holder_count',
        meta: { className: 'hidden lg:table-cell' },
        cell: ({ row }) => (
          <span className="font-mono tabular-nums">
            {formatCompactMaybe(row.original.holder_count)}
          </span>
        ),
      },
      {
        header: 'Deployer',
        accessorKey: 'deployer_pct',
        cell: ({ row }) => {
          const pct = row.original.deployer_pct;
          if (pct == null) return <span className="text-text-secondary">{EM_DASH}</span>;
          const flagged = pct >= DEPLOYER_FLAG_THRESHOLD;
          return (
            <span
              className={`inline-flex items-center gap-1 font-mono tabular-nums ${
                flagged ? 'text-warning' : 'text-text-secondary'
              }`}
              title={
                flagged
                  ? `Deployer holds ${(pct * 100).toFixed(1)}% of supply`
                  : 'Deployer share of supply'
              }
            >
              {flagged && <AlertTriangle className="w-3.5 h-3.5" />}
              {(pct * 100).toFixed(1)}%
            </span>
          );
        },
      },
    ],
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-screen-2xl p-4 md:p-6 space-y-4"
    >
      <PageHeader
        icon={Rocket}
        title="Token launches"
        description="Every new pair on Uniswap, Curve and friends — as it hits the chain."
        actions={
          <>
            <GlobalPriceStalenessBadge />
            <div
              aria-live="polite"
              className={`inline-flex items-center gap-1.5 text-sm ${
                isConnected && liveMode ? 'text-gain' : 'text-text-secondary'
              }`}
            >
              <Radio className="w-4 h-4" />
              {liveMode ? (isConnected ? 'Live' : 'Reconnecting…') : 'Live paused by filters'}
            </div>
          </>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg border border-border overflow-hidden">
          {HOURS_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => setHours(o.value)}
              aria-pressed={hours === o.value}
              className={`px-3 py-1.5 text-sm transition-colors ${
                hours === o.value
                  ? 'bg-primary/15 text-primary font-medium'
                  : 'text-text-secondary hover:text-text hover:bg-surface-2'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as NewTokensSort)}
          aria-label="Sort launches by"
          className="rounded-lg bg-surface-2 border border-border px-3 py-1.5 text-sm text-text focus:outline-none focus:border-primary/60"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              Sort: {o.label}
            </option>
          ))}
        </select>
        <select
          value={minLiquidity}
          onChange={(e) => setMinLiquidity(Number(e.target.value))}
          aria-label="Minimum liquidity"
          className="rounded-lg bg-surface-2 border border-border px-3 py-1.5 text-sm text-text focus:outline-none focus:border-primary/60"
        >
          {LIQUIDITY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <Card className="p-0 overflow-hidden" hover={false}>
        {/* Hovering pauses live prepends so rows don't shift under the cursor */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => {
            setPaused(false);
            flushPending();
          }}
        >
          <DataTable
            data={rows}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No launches in this window — try widening the time range."
            error={
              isError
                ? {
                    message:
                      'The launch indexer is taking longer than usual to answer. Live launches still stream in below as they happen.',
                    onRetry: () => refetch(),
                  }
                : null
            }
            rowKey={rowKeyOf}
            virtualized
            height={640}
            highlightedKeys={highlightedKeys}
          />
        </div>
      </Card>

      <p className="text-xs text-text-secondary">
        Fresh launches can show “—” for price/liquidity/volume until their first swaps are
        indexed. Deployer % flags wallets still holding a large share of supply.
      </p>
    </motion.div>
  );
};

export default LaunchFeedPage;
