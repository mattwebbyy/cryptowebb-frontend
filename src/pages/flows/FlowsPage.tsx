// Exchange flows dashboard — per-exchange net deposit/withdrawal pressure
// with a per-token breakdown table. Positive net flow = money moving ONTO
// exchanges (potential sell pressure); negative = accumulation/withdrawal.
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { EChart } from '@/components/charts/EChart';
import { getGainLossColors } from '@/features/charts/theme';
import { useExchangeFlows, GlobalPriceStalenessBadge } from '@/features/indexer';
import type { ExchangeFlow } from '@/features/indexer';
import { formatUSD, isJunkUSD, shortenAddress } from '@/lib/format';

const HOURS_OPTIONS = [
  { label: '24h', value: 24 },
  { label: '3d', value: 72 },
  { label: '7d', value: 168 },
];

interface ExchangeAgg {
  exchange: string;
  deposit_usd: number;
  withdrawal_usd: number;
  net_flow_usd: number;
}

/** USD cell that renders stale-price artifacts (absurd values) as an em dash. */
const FlowUSDCell: React.FC<{ value: number; tone: string; bold?: boolean }> = ({
  value,
  tone,
  bold,
}) => {
  if (isJunkUSD(value)) {
    return (
      <span
        className="font-mono tabular-nums text-text-secondary"
        title="USD value unreliable — stale price on a thin token"
      >
        —
      </span>
    );
  }
  return (
    <span className={`font-mono tabular-nums ${bold ? 'font-semibold ' : ''}${tone}`}>
      {formatUSD(value)}
    </span>
  );
};

const FlowsPage: React.FC = () => {
  const [hours, setHours] = useState(24);
  const [exchangeFilter, setExchangeFilter] = useState<string>('');

  const { data, isLoading } = useExchangeFlows({ hours }, { refetchInterval: 30000 });

  const byExchange = useMemo<ExchangeAgg[]>(() => {
    const map = new Map<string, ExchangeAgg>();
    for (const f of data ?? []) {
      // One junk-valued micro-cap (stale price artifact) would dwarf every
      // real bar; keep such rows in the table but out of the aggregates.
      if (isJunkUSD(f.net_flow_usd) || isJunkUSD(f.deposit_usd) || isJunkUSD(f.withdrawal_usd)) {
        continue;
      }
      const agg = map.get(f.exchange) ?? {
        exchange: f.exchange,
        deposit_usd: 0,
        withdrawal_usd: 0,
        net_flow_usd: 0,
      };
      agg.deposit_usd += f.deposit_usd;
      agg.withdrawal_usd += f.withdrawal_usd;
      agg.net_flow_usd += f.net_flow_usd;
      map.set(f.exchange, agg);
    }
    return [...map.values()].sort((a, b) => Math.abs(b.net_flow_usd) - Math.abs(a.net_flow_usd));
  }, [data]);

  const chartOption = useMemo(() => {
    const { gain, loss } = getGainLossColors();
    const rows = [...byExchange].reverse(); // largest at top of the bar chart
    return {
      grid: { left: 8, right: 24, top: 8, bottom: 8, containLabel: true },
      tooltip: {
        trigger: 'axis' as const,
        axisPointer: { type: 'shadow' as const },
        valueFormatter: (v: unknown) => formatUSD(Number(v)),
      },
      xAxis: {
        type: 'value' as const,
        axisLabel: { formatter: (v: number) => formatUSD(v) },
      },
      yAxis: { type: 'category' as const, data: rows.map((r) => r.exchange) },
      series: [
        {
          name: 'Net flow',
          type: 'bar' as const,
          data: rows.map((r) => ({
            value: r.net_flow_usd,
            itemStyle: { color: r.net_flow_usd >= 0 ? loss : gain },
          })),
          barMaxWidth: 26,
        },
      ],
    };
  }, [byExchange]);

  const exchanges = useMemo(
    () => [...new Set((data ?? []).map((f) => f.exchange))].sort(),
    [data]
  );

  const tableRows = useMemo(
    () => (data ?? []).filter((f) => !exchangeFilter || f.exchange === exchangeFilter),
    [data, exchangeFilter]
  );

  const columns = useMemo<ColumnDef<ExchangeFlow, unknown>[]>(
    () => [
      {
        header: 'Exchange',
        accessorKey: 'exchange',
        cell: ({ row }) => <span className="font-medium capitalize">{row.original.exchange}</span>,
      },
      {
        header: 'Token',
        accessorKey: 'token_symbol',
        cell: ({ row }) => (
          <span className="font-semibold">
            {row.original.token_symbol || shortenAddress(row.original.token_address)}
          </span>
        ),
      },
      {
        header: 'Deposits',
        accessorKey: 'deposit_usd',
        cell: ({ row }) => <FlowUSDCell value={row.original.deposit_usd} tone="text-loss" />,
      },
      {
        header: 'Withdrawals',
        accessorKey: 'withdrawal_usd',
        cell: ({ row }) => <FlowUSDCell value={row.original.withdrawal_usd} tone="text-gain" />,
      },
      {
        header: 'Net flow',
        accessorKey: 'net_flow_usd',
        cell: ({ row }) => (
          <FlowUSDCell
            value={row.original.net_flow_usd}
            tone={row.original.net_flow_usd >= 0 ? 'text-loss' : 'text-gain'}
            bold
          />
        ),
      },
      {
        header: 'Transfers',
        accessorKey: 'tx_count',
        cell: ({ row }) => (
          <span className="font-mono tabular-nums text-text-secondary">
            {row.original.tx_count.toLocaleString()}
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
      className="mx-auto max-w-screen-2xl p-4 md:p-6 space-y-4"
    >
      <PageHeader
        icon={ArrowLeftRight}
        title="Exchange flows"
        description={
          <>
            Deposits vs withdrawals per exchange.{' '}
            <span className="text-loss">Red = onto exchanges</span> (sell pressure),{' '}
            <span className="text-gain">green = off exchanges</span> (accumulation).
          </>
        }
        actions={
          <>
            <GlobalPriceStalenessBadge />
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
          </>
        }
      />

      <Card className="p-4" hover={false}>
        <h2 className="text-lg font-semibold mb-2">Net flow by exchange</h2>
        {isLoading || byExchange.length > 0 ? (
          <EChart
            option={chartOption}
            loading={isLoading}
            style={{ height: Math.max(200, byExchange.length * 44 + 60) }}
          />
        ) : (
          <div className="py-12 text-center text-sm text-text-secondary">
            No flow data for this window.
          </div>
        )}
      </Card>

      <Card className="p-0 overflow-hidden" hover={false}>
        <div className="flex items-center justify-between p-3 border-b border-border">
          <h2 className="text-lg font-semibold">Token breakdown</h2>
          <select
            value={exchangeFilter}
            onChange={(e) => setExchangeFilter(e.target.value)}
            aria-label="Filter by exchange"
            className="rounded-lg bg-surface-2 border border-border px-3 py-1.5 text-sm text-text focus:outline-none focus:border-primary/60"
          >
            <option value="">All exchanges</option>
            {exchanges.map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))}
          </select>
        </div>
        <DataTable
          data={tableRows}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No flows match this filter."
          rowKey={(f) => `${f.exchange}:${f.token_address}`}
          initialSorting={[{ id: 'net_flow_usd', desc: true }]}
          virtualized
          height={520}
        />
      </Card>
    </motion.div>
  );
};

export default FlowsPage;
