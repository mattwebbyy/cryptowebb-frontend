// Smart money leaderboard — highest-conviction wallets ranked by realized
// performance from the indexer's trade reconstruction.
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { useSmartMoney, GlobalPriceStalenessBadge } from '@/features/indexer';
import type { SmartMoneyWallet, SmartMoneyTier } from '@/features/indexer';
import { formatCompact, formatPercent, formatUSD, shortenAddress } from '@/lib/format';

const TIER_STYLES: Record<SmartMoneyTier, string> = {
  whale: 'bg-primary/15 text-primary',
  serious: 'bg-warning/15 text-warning',
  active: 'bg-surface-2 text-text-secondary',
};

const TierBadge: React.FC<{ tier: SmartMoneyTier }> = ({ tier }) => (
  <span
    className={`inline-block rounded px-1.5 py-0.5 text-[11px] font-medium capitalize ${
      TIER_STYLES[tier] ?? TIER_STYLES.active
    }`}
  >
    {tier}
  </span>
);

const SmartMoneyPage: React.FC = () => {
  const { data, isLoading } = useSmartMoney({ limit: 100 }, { refetchInterval: 60000 });

  const columns = useMemo<ColumnDef<SmartMoneyWallet, unknown>[]>(
    () => [
      {
        header: '#',
        id: 'rank',
        enableSorting: false,
        cell: ({ row }) => <span className="text-text-secondary">{row.index + 1}</span>,
      },
      {
        header: 'Wallet',
        accessorKey: 'address',
        enableSorting: false,
        cell: ({ row }) => (
          <Link
            to={`/wallet/${row.original.address}`}
            className="group inline-flex items-center gap-2"
          >
            <span className="font-mono text-sm group-hover:text-primary transition-colors">
              {shortenAddress(row.original.address, 6)}
            </span>
            {row.original.label && (
              <span className="rounded px-1.5 py-0.5 text-[11px] font-medium bg-primary/10 text-primary">
                {row.original.label}
              </span>
            )}
          </Link>
        ),
      },
      {
        header: 'Tier',
        accessorKey: 'tier',
        cell: ({ row }) => <TierBadge tier={row.original.tier} />,
      },
      {
        header: 'Score',
        accessorKey: 'score',
        cell: ({ row }) => (
          <span className="font-mono tabular-nums font-semibold">
            {row.original.score.toFixed(2)}
          </span>
        ),
      },
      {
        header: 'Total P&L',
        accessorKey: 'total_pnl_usd',
        cell: ({ row }) => (
          <span
            className={`font-mono tabular-nums font-semibold ${
              row.original.total_pnl_usd >= 0 ? 'text-gain' : 'text-loss'
            }`}
          >
            {formatUSD(row.original.total_pnl_usd)}
          </span>
        ),
      },
      {
        header: 'Win rate',
        accessorKey: 'win_rate',
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-2">
            <span className="hidden sm:block h-1.5 w-16 rounded-full bg-surface-2 overflow-hidden">
              <span
                className="block h-full rounded-full bg-primary"
                style={{ width: `${Math.min(100, row.original.win_rate * 100)}%` }}
              />
            </span>
            <span className="font-mono tabular-nums">{formatPercent(row.original.win_rate)}</span>
          </span>
        ),
      },
      {
        header: 'Trades',
        accessorKey: 'total_trades',
        meta: { className: 'hidden sm:table-cell' },
        cell: ({ row }) => (
          <span className="font-mono tabular-nums text-text-secondary">
            {formatCompact(row.original.total_trades, 0)}
          </span>
        ),
      },
      {
        header: 'Avg trade',
        accessorKey: 'avg_trade_size_usd',
        meta: { className: 'hidden md:table-cell' },
        cell: ({ row }) => (
          <span className="font-mono tabular-nums text-text-secondary">
            {formatUSD(row.original.avg_trade_size_usd)}
          </span>
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
      className="mx-auto max-w-screen-xl p-4 md:p-6 space-y-4"
    >
      <PageHeader
        icon={Brain}
        title="Smart money"
        description="Wallets ranked by realized on-chain performance. Click through to profile their holdings and activity."
        actions={<GlobalPriceStalenessBadge />}
      />

      <Card className="p-0 overflow-hidden" hover={false}>
        <DataTable
          data={data ?? []}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="Leaderboard is being computed — check back soon."
          rowKey={(w) => w.address}
          initialSorting={[{ id: 'score', desc: true }]}
          virtualized
          height={640}
        />
      </Card>
    </motion.div>
  );
};

export default SmartMoneyPage;
