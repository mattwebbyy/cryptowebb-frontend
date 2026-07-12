// Macro metrics dashboard — daily exchange netflow / reserve deltas straight
// from the indexer's materialized views. Values are token amounts (not USD):
// the price backfill frontier makes USD conversion unreliable, token units
// are exact.
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { EChart } from '@/components/charts/EChart';
import { PageHeader } from '@/components/ui/PageHeader';
import { useIndexerMetric } from '@/features/indexer';
import { getGainLossColors } from '@/features/charts/theme';
import { EM_DASH, formatCompact } from '@/lib/format';
import { ASSETS, EXCHANGES, METRICS, RANGES, MacroMetric } from './constants';

const signedCompact = (v: number) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${formatCompact(Math.abs(v))}`;

const StatTile: React.FC<{
  label: string;
  value: number | null;
  asset: string;
  invertTone?: boolean;
}> = ({ label, value, asset, invertTone = false }) => {
  // Netflow: positive = deposits = bearish (loss tone). invertTone flips for
  // metrics where positive is good.
  const tone =
    value == null || value === 0
      ? 'text-text'
      : (value > 0) !== invertTone
        ? 'text-loss'
        : 'text-gain';
  return (
    <div className="p-3 bg-surface-2 rounded-lg">
      <div className="text-xs text-text-secondary">{label}</div>
      <div className={`mt-0.5 font-mono tabular-nums font-semibold ${tone}`}>
        {value == null ? EM_DASH : `${signedCompact(value)} ${asset}`}
      </div>
    </div>
  );
};

const selectClass =
  'rounded-lg bg-surface-2 border border-border px-3 py-1.5 text-sm text-text focus:outline-none focus:border-primary/60';

const MacroPage: React.FC = () => {
  const [metric, setMetric] = useState<MacroMetric>('exchange_netflow');
  const [exchange, setExchange] = useState<string>('binance');
  const [asset, setAsset] = useState<string>('ETH');
  const [days, setDays] = useState<number>(90);

  const { data, isLoading, isError, refetch } = useIndexerMetric(metric, {
    asset: `${exchange}:${asset}`,
    days,
  });

  const rows = useMemo(
    () => [...(data ?? [])].sort((a, b) => a.day.localeCompare(b.day)),
    [data]
  );

  const metricMeta = METRICS.find((m) => m.value === metric)!;
  const latestDay = rows.length > 0 ? rows[rows.length - 1].day : null;

  const summary = useMemo(() => {
    if (rows.length === 0) return null;
    const sumLast = (n: number) =>
      rows.slice(-n).reduce((acc, r) => acc + r.value, 0);
    const largest = rows.reduce((a, b) => (Math.abs(b.value) > Math.abs(a.value) ? b : a));
    return {
      last7: sumLast(7),
      last30: sumLast(30),
      largestDay: largest,
    };
  }, [rows]);

  const chartOption = useMemo(() => {
    const { gain, loss } = getGainLossColors();
    const daysAxis = rows.map((r) => r.day);
    const values = rows.map((r) => r.value);

    const common = {
      grid: { left: 8, right: 16, top: 32, bottom: days >= 180 ? 56 : 8, containLabel: true },
      tooltip: {
        trigger: 'axis' as const,
        valueFormatter: (v: unknown) => `${signedCompact(Number(v))} ${asset}`,
      },
      xAxis: { type: 'category' as const, data: daysAxis },
      yAxis: {
        type: 'value' as const,
        axisLabel: { formatter: (v: number) => formatCompact(v) },
      },
      dataZoom:
        days >= 180
          ? [
              { type: 'inside' as const },
              { type: 'slider' as const, height: 20, bottom: 8 },
            ]
          : undefined,
    };

    if (metric === 'exchange_netflow') {
      // Diverging bars (deposits red / withdrawals green) + running total.
      let acc = 0;
      const cumulative = values.map((v) => (acc += v));
      return {
        ...common,
        legend: { top: 0 },
        series: [
          {
            name: 'Daily netflow',
            type: 'bar' as const,
            data: values.map((v) => ({
              value: v,
              itemStyle: { color: v >= 0 ? loss : gain },
            })),
            barMaxWidth: 14,
          },
          {
            name: 'Cumulative',
            type: 'line' as const,
            data: cumulative,
            showSymbol: false,
            lineStyle: { width: 1.5 },
            emphasis: { focus: 'series' as const },
          },
        ],
      };
    }

    // Reserve delta: area, colored per-day by sign via bar-like coloring is
    // noisy — a single area with a zero markline reads better.
    return {
      ...common,
      series: [
        {
          name: 'Reserve delta',
          type: 'line' as const,
          data: values,
          showSymbol: false,
          areaStyle: { opacity: 0.15 },
          lineStyle: { width: 1.5 },
          markLine: {
            silent: true,
            symbol: 'none',
            label: { show: false },
            lineStyle: { type: 'dashed' as const, opacity: 0.4 },
            data: [{ yAxis: 0 }],
          },
        },
      ],
    };
  }, [rows, metric, days, asset]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-screen-xl p-4 md:p-6 space-y-4"
    >
      <PageHeader
        icon={LineChart}
        title="Macro metrics"
        description={metricMeta.description}
        actions={
          latestDay && (
            <span className="text-xs text-text-secondary">
              Data through <span className="font-mono">{latestDay}</span> (backfill in
              progress)
            </span>
          )
        }
      />

      {/* Selectors */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg border border-border overflow-hidden">
          {METRICS.map((m) => (
            <button
              key={m.value}
              onClick={() => setMetric(m.value)}
              aria-pressed={metric === m.value}
              className={`px-3 py-1.5 text-sm transition-colors ${
                metric === m.value
                  ? 'bg-primary/15 text-primary font-medium'
                  : 'text-text-secondary hover:text-text hover:bg-surface-2'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <select
          value={exchange}
          onChange={(e) => setExchange(e.target.value)}
          aria-label="Exchange"
          className={selectClass}
        >
          {EXCHANGES.map((ex) => (
            <option key={ex.value} value={ex.value}>
              {ex.label}
            </option>
          ))}
        </select>
        <select
          value={asset}
          onChange={(e) => setAsset(e.target.value)}
          aria-label="Asset"
          className={selectClass}
        >
          {ASSETS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <div className="inline-flex rounded-lg border border-border overflow-hidden">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setDays(r.value)}
              aria-pressed={days === r.value}
              className={`px-3 py-1.5 text-sm transition-colors ${
                days === r.value
                  ? 'bg-primary/15 text-primary font-medium'
                  : 'text-text-secondary hover:text-text hover:bg-surface-2'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatTile label="Net, last 7 indexed days" value={summary?.last7 ?? null} asset={asset} />
        <StatTile
          label="Net, last 30 indexed days"
          value={summary?.last30 ?? null}
          asset={asset}
        />
        <div className="p-3 bg-surface-2 rounded-lg col-span-2 md:col-span-1">
          <div className="text-xs text-text-secondary">Largest single day</div>
          <div className="mt-0.5 font-mono tabular-nums font-semibold">
            {summary ? (
              <>
                {signedCompact(summary.largestDay.value)} {asset}
                <span className="ml-2 text-xs font-normal text-text-secondary">
                  {summary.largestDay.day}
                </span>
              </>
            ) : (
              EM_DASH
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <Card className="p-4" hover={false}>
        {isError ? (
          <div className="h-[380px] flex flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-text-secondary">
              Could not load {metricMeta.label.toLowerCase()} for {exchange} · {asset}.
            </p>
            <button
              onClick={() => refetch()}
              className="rounded-lg border border-border bg-surface-2 px-4 py-1.5 text-sm text-text hover:border-primary/60 hover:text-primary transition-colors"
            >
              Retry
            </button>
          </div>
        ) : !isLoading && rows.length === 0 ? (
          <div className="h-[380px] flex items-center justify-center text-sm text-text-secondary">
            No {metricMeta.label.toLowerCase()} indexed yet for {exchange} · {asset}.
          </div>
        ) : (
          <EChart option={chartOption} loading={isLoading} style={{ height: 380 }} />
        )}
      </Card>

      <p className="text-xs text-text-secondary">
        Values are token amounts, not USD — exact on-chain quantities unaffected by the price
        backfill. Positive netflow means tokens moved onto the exchange; negative means they
        left.
      </p>
    </motion.div>
  );
};

export default MacroPage;
