// Public network/status page — the "trust page": honest sync progress,
// dataset counts, and price freshness for the indexer powering the product.
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Database, Repeat, TrendingUp, CheckCircle2, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { useIndexerStatus, usePrices } from '@/features/indexer';
import { formatCompact, formatUSD, timeAgo } from '@/lib/format';

/** "5m ago" for fresh timestamps, a plain date once it's clearly historical. */
function freshnessLabel(unixSeconds: number): string {
  const ageDays = (Date.now() / 1000 - unixSeconds) / 86400;
  if (ageDays < 7) return timeAgo(unixSeconds);
  return new Date(unixSeconds * 1000).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const StatCard: React.FC<{ title: string; value: string; sub?: string; icon: React.ReactNode }> = ({
  title,
  value,
  sub,
  icon,
}) => (
  <Card className="p-4">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-text-secondary">{title}</p>
        <p className="text-2xl font-bold mt-1 font-mono tabular-nums">{value}</p>
        {sub && <p className="text-xs text-text-secondary mt-1">{sub}</p>}
      </div>
      <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
    </div>
  </Card>
);

const StatusPage: React.FC = () => {
  const { data: status, isLoading } = useIndexerStatus({ refetchInterval: 10000 });
  const { data: prices } = usePrices({ refetchInterval: 15000 });

  const syncPct =
    status && status.latest_chain_block > 0
      ? Math.min(100, (status.latest_indexed_block / status.latest_chain_block) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-5xl p-4 md:p-6 space-y-6"
    >
      <PageHeader
        icon={Activity}
        title="Network status"
        description="Live health of the CryptoWebb indexing pipeline. We publish this openly — if data looks partial, this page tells you why."
      />

      {/* Sync state */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Chain sync</h2>
          {status &&
            (status.is_syncing ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-warning">
                <Loader2 className="w-4 h-4 animate-spin" />
                Syncing — {status.blocks_behind.toLocaleString()} blocks behind
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm text-gain">
                <CheckCircle2 className="w-4 h-4" />
                In sync
              </span>
            ))}
        </div>
        {isLoading || !status ? (
          <div className="h-3 rounded-full bg-surface-2 animate-pulse" />
        ) : (
          <>
            <div
              className="h-3 rounded-full bg-surface-2 overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.round(syncPct)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Chain sync progress"
            >
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${syncPct}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-text-secondary font-mono tabular-nums">
              <span>Indexed #{status.latest_indexed_block.toLocaleString()}</span>
              <span>{syncPct.toFixed(2)}%</span>
              <span>Chain head #{status.latest_chain_block.toLocaleString()}</span>
            </div>
          </>
        )}
      </Card>

      {/* Dataset counts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="ERC-20 transfers indexed"
          value={status ? formatCompact(status.transfers_count, 1) : '—'}
          icon={<Database className="w-5 h-5 text-primary" />}
        />
        <StatCard
          title="DEX swaps indexed"
          value={status ? formatCompact(status.swaps_count, 1) : '—'}
          icon={<Repeat className="w-5 h-5 text-primary" />}
        />
        <StatCard
          title="ETH price"
          value={prices ? formatUSD(prices.eth_usd) : '—'}
          sub={prices?.as_of ? `as of ${freshnessLabel(prices.as_of)}` : undefined}
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
        />
      </div>

      {/* Price backfill honesty */}
      {prices?.as_of != null && Date.now() / 1000 - prices.as_of > 86400 && (
        <Card className="p-5 border-warning/30">
          <h2 className="text-lg font-semibold mb-1 text-warning">Price backfill in progress</h2>
          <p className="text-sm text-text-secondary">
            The price engine's frontier is currently at{' '}
            <span className="font-mono text-text">{freshnessLabel(prices.as_of)}</span> and
            advancing as the historical backfill completes. Until it reaches the chain head, USD
            valuations across the site are computed from that era's prices — dollar figures on
            thin tokens can be wrong, and obviously absurd values are shown as “—” instead.
          </p>
        </Card>
      )}

      {/* Honest caveats */}
      <Card className="p-5">
        <h2 className="text-lg font-semibold mb-2">Data coverage</h2>
        <ul className="space-y-2 text-sm text-text-secondary list-disc pl-5">
          <li>
            Realtime indexing follows the chain head; historical backfill is in progress. Metrics
            over older ranges may be partial until it completes.
          </li>
          <li>
            Very fresh token launches can show missing price, liquidity, or volume for a few
            minutes while their first swaps are processed — cells render “—” rather than fake
            zeros.
          </li>
          <li>
            P&amp;L, on-chain indicators (MVRV and friends), and protocol TVL are being rebuilt on
            the canonical data layer and appear here as “coming soon”.
          </li>
        </ul>
      </Card>
    </motion.div>
  );
};

export default StatusPage;
