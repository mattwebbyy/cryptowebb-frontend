// Whale transfer feed — labeled large transfers with CEX deposit/withdrawal
// intelligence. REST backfill + live whale_alert prepends (auth-gated).
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Waves, Radio, ExternalLink, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { useWhaleTransfers, GlobalPriceStalenessBadge } from '@/features/indexer';
import type { WhaleTransfer, WhaleAlert } from '@/features/indexer';
import { useIndexerStream } from '@/hooks/useIndexerStream';
import { etherscanTxUrl, formatUSDSane, isJunkUSD, shortenAddress } from '@/lib/format';

const MIN_USD_OPTIONS = [
  { label: '≥ $100K', value: 100_000 },
  { label: '≥ $500K', value: 500_000 },
  { label: '≥ $1M', value: 1_000_000 },
  { label: '≥ $10M', value: 10_000_000 },
];

const HOURS_OPTIONS = [
  { label: '1h', value: 1 },
  { label: '6h', value: 6 },
  { label: '24h', value: 24 },
  { label: '3d', value: 72 },
];

const AddressCell: React.FC<{ address: string; label: string | null; category?: string }> = ({
  address,
  label,
  category,
}) => (
  <Link
    to={`/wallet/${address}`}
    className="group inline-flex items-center gap-1.5"
    onClick={(e) => e.stopPropagation()}
  >
    {label ? (
      <span className="rounded px-1.5 py-0.5 text-[11px] font-medium bg-primary/10 text-primary whitespace-nowrap">
        {label}
      </span>
    ) : (
      <span className="font-mono text-sm text-text-secondary group-hover:text-primary transition-colors">
        {shortenAddress(address)}
      </span>
    )}
    {category === 'cex' && !label && (
      <span className="text-[10px] uppercase text-text-secondary">cex</span>
    )}
  </Link>
);

function alertToRow(alert: WhaleAlert): WhaleTransfer {
  return {
    block_number: alert.block_number,
    transaction_hash: alert.transaction_hash,
    token_address: alert.token_address,
    token_symbol: alert.symbol,
    from_address: alert.from_address,
    to_address: alert.to_address,
    from_label: null,
    to_label: null,
    from_category: '',
    to_category: '',
    value_usd: alert.value_usd,
    is_exchange_deposit: false,
    is_exchange_withdrawal: false,
  };
}

const WhalesPage: React.FC = () => {
  const [minUsd, setMinUsd] = useState(100_000);
  const [hours, setHours] = useState(24);
  const [paused, setPaused] = useState(false);

  const { data, isLoading } = useWhaleTransfers(
    { hours, min_usd: minUsd, limit: 200 },
    { refetchInterval: 15000 }
  );

  const { whales: liveAlerts, isConnected, flushPending } = useIndexerStream({ paused });

  const rows = useMemo(() => {
    const base = data ?? [];
    const seen = new Set(base.map((t) => t.transaction_hash));
    const prepended = liveAlerts
      .filter((a) => a.value_usd >= minUsd && !seen.has(a.transaction_hash))
      .map(alertToRow);
    return [...prepended, ...base];
  }, [data, liveAlerts, minUsd]);

  const highlightedKeys = useMemo(
    () => new Set(liveAlerts.map((a) => a.transaction_hash)),
    [liveAlerts]
  );

  const columns = useMemo<ColumnDef<WhaleTransfer, unknown>[]>(
    () => [
      {
        header: 'Value',
        accessorKey: 'value_usd',
        cell: ({ row }) => {
          const junk = isJunkUSD(row.original.value_usd);
          return (
            <span
              className={`font-mono tabular-nums font-semibold ${
                junk ? 'text-text-secondary' : 'text-warning'
              }`}
              title={junk ? 'USD value unreliable — stale price on a thin token' : undefined}
            >
              {formatUSDSane(row.original.value_usd)}
            </span>
          );
        },
      },
      {
        header: 'Token',
        accessorKey: 'token_symbol',
        cell: ({ row }) => (
          <Link
            to={`/token/${row.original.token_address}`}
            className="font-semibold hover:text-primary transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {row.original.token_symbol || shortenAddress(row.original.token_address)}
          </Link>
        ),
      },
      {
        header: 'From',
        accessorKey: 'from_address',
        enableSorting: false,
        cell: ({ row }) => (
          <AddressCell
            address={row.original.from_address}
            label={row.original.from_label}
            category={row.original.from_category}
          />
        ),
      },
      {
        header: 'To',
        accessorKey: 'to_address',
        enableSorting: false,
        cell: ({ row }) => (
          <AddressCell
            address={row.original.to_address}
            label={row.original.to_label}
            category={row.original.to_category}
          />
        ),
      },
      {
        header: 'Flow',
        accessorKey: 'is_exchange_deposit',
        cell: ({ row }) => {
          if (row.original.is_exchange_deposit) {
            return (
              <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium bg-loss/10 text-loss">
                <ArrowDownToLine className="w-3 h-3" />
                CEX deposit
              </span>
            );
          }
          if (row.original.is_exchange_withdrawal) {
            return (
              <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium bg-gain/10 text-gain">
                <ArrowUpFromLine className="w-3 h-3" />
                CEX withdrawal
              </span>
            );
          }
          return <span className="text-text-secondary text-xs">transfer</span>;
        },
      },
      {
        header: 'Block',
        accessorKey: 'block_number',
        meta: { className: 'hidden md:table-cell' },
        cell: ({ row }) => (
          <a
            href={etherscanTxUrl(row.original.transaction_hash)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono tabular-nums text-text-secondary hover:text-primary transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {row.original.block_number.toLocaleString()}
            <ExternalLink className="w-3 h-3" />
          </a>
        ),
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
        icon={Waves}
        title="Whale feed"
        description="Large transfers with exchange labels — spot CEX deposits before they hit the books."
        actions={
          <>
            <GlobalPriceStalenessBadge />
            <div
              aria-live="polite"
              className={`inline-flex items-center gap-1.5 text-sm ${
                isConnected ? 'text-gain' : 'text-text-secondary'
              }`}
            >
              <Radio className="w-4 h-4" />
              {isConnected ? 'Live' : 'Reconnecting…'}
            </div>
          </>
        }
      />

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
          value={minUsd}
          onChange={(e) => setMinUsd(Number(e.target.value))}
          aria-label="Minimum transfer value"
          className="rounded-lg bg-surface-2 border border-border px-3 py-1.5 text-sm text-text focus:outline-none focus:border-primary/60"
        >
          {MIN_USD_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <Card className="p-0 overflow-hidden" hover={false}>
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
            emptyMessage="No whale transfers match these filters."
            rowKey={(t) => t.transaction_hash}
            virtualized
            height={640}
            highlightedKeys={highlightedKeys}
          />
        </div>
      </Card>
    </motion.div>
  );
};

export default WhalesPage;
