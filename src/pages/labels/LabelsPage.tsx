// Labels directory — every known entity the indexer can name: exchanges,
// DEX routers, mixers, DeFi protocols. Category chips filter server-side,
// the text box filters client-side within the loaded set.
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tags, ExternalLink, Copy, Check, Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { useLabels, useLabelStats } from '@/features/indexer';
import type { LabeledAddress } from '@/features/indexer';
import { etherscanAddressUrl, formatCompact, shortenAddress } from '@/lib/format';

// Live categories: bridge, cex, contract, dex, fund, hacker, mev, mixer.
const CATEGORY_COLORS: Record<string, string> = {
  cex: 'bg-primary/15 text-primary',
  dex: 'bg-chart-3/15 text-chart-3',
  bridge: 'bg-chart-3/15 text-chart-3',
  fund: 'bg-gain/15 text-gain',
  defi: 'bg-gain/15 text-gain',
  mev: 'bg-warning/15 text-warning',
  mixer: 'bg-loss/15 text-loss',
  hacker: 'bg-loss/15 text-loss',
};

const categoryClass = (category: string) =>
  CATEGORY_COLORS[category] ?? 'bg-surface-2 text-text-secondary';

const CopyAddressButton: React.FC<{ address: string }> = ({ address }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async (e) => {
        e.stopPropagation();
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="p-1 rounded hover:bg-surface-2 transition-colors"
      aria-label={`Copy address ${shortenAddress(address)}`}
    >
      {copied ? (
        <Check className="w-3 h-3 text-gain" />
      ) : (
        <Copy className="w-3 h-3 text-text-secondary" />
      )}
    </button>
  );
};

const LabelsPage: React.FC = () => {
  const [category, setCategory] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  const { data: stats } = useLabelStats();
  const { data: labels, isLoading, isError, refetch } = useLabels({
    category: category ?? undefined,
    limit: 500,
  });

  const categories = useMemo(
    () =>
      Object.entries(stats?.by_category ?? {}).sort(
        ([, a], [, b]) => b - a
      ),
    [stats]
  );

  const rows = useMemo(() => {
    const base = labels ?? [];
    const q = filter.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q) ||
        l.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [labels, filter]);

  const columns = useMemo<ColumnDef<LabeledAddress, unknown>[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row }) => (
          <Link
            to={`/wallet/${row.original.address}`}
            className="font-semibold hover:text-primary transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {row.original.name}
          </Link>
        ),
      },
      {
        header: 'Address',
        accessorKey: 'address',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1">
            <span className="font-mono text-text-secondary">
              {shortenAddress(row.original.address, 6)}
            </span>
            <CopyAddressButton address={row.original.address} />
            <a
              href={etherscanAddressUrl(row.original.address)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded hover:bg-surface-2 transition-colors"
              aria-label="View on Etherscan"
            >
              <ExternalLink className="w-3 h-3 text-text-secondary" />
            </a>
          </span>
        ),
      },
      {
        header: 'Category',
        accessorKey: 'category',
        cell: ({ row }) => (
          <span
            className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${categoryClass(
              row.original.category
            )}`}
          >
            {row.original.category}
            {row.original.subcategory ? ` · ${row.original.subcategory}` : ''}
          </span>
        ),
      },
      {
        header: 'Tags',
        accessorKey: 'tags',
        enableSorting: false,
        meta: { className: 'hidden md:table-cell' },
        cell: ({ row }) => (
          <span className="flex flex-wrap gap-1 max-w-[260px]">
            {row.original.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded px-1.5 py-0.5 text-[11px] bg-surface-2 text-text-secondary"
              >
                {tag.replace('_', ' ')}
              </span>
            ))}
            {row.original.tags.length > 4 && (
              <span className="text-[11px] text-text-secondary/60">
                +{row.original.tags.length - 4}
              </span>
            )}
          </span>
        ),
      },
      {
        header: 'Confidence',
        accessorKey: 'confidence',
        meta: { className: 'hidden sm:table-cell' },
        cell: ({ row }) => {
          const pct = Math.round(row.original.confidence * 100);
          return (
            <span className="inline-flex items-center gap-2">
              <span
                className="hidden sm:block h-1.5 w-16 rounded-full bg-surface-2 overflow-hidden"
                aria-hidden
              >
                <span
                  className="block h-full rounded-full bg-primary"
                  style={{ width: `${pct}%` }}
                />
              </span>
              <span className="font-mono tabular-nums text-text-secondary">{pct}%</span>
            </span>
          );
        },
      },
      {
        header: 'Source',
        accessorKey: 'source',
        meta: { className: 'hidden lg:table-cell' },
        cell: ({ row }) => (
          <span className="text-xs text-text-secondary">{row.original.source}</span>
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
        icon={Tags}
        title="Labels directory"
        description={
          stats
            ? `${formatCompact(stats.total_labels, 0)} named addresses — exchanges, routers, mixers and protocols.`
            : 'Named addresses — exchanges, routers, mixers and protocols.'
        }
        actions={
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary pointer-events-none" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter by name, address, tag…"
              aria-label="Filter labels"
              className="w-56 rounded-lg bg-surface-2 border border-border pl-8 pr-3 py-1.5 text-sm text-text placeholder:text-text-secondary/60 focus:outline-none focus:border-primary/60"
            />
          </div>
        }
      />

      {/* Category chips (double as server-side filter) */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setCategory(null)}
          aria-pressed={category === null}
          className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
            category === null
              ? 'border-primary/60 bg-primary/15 text-primary font-medium'
              : 'border-border text-text-secondary hover:text-text hover:bg-surface-2'
          }`}
        >
          All
        </button>
        {categories.map(([cat, count]) => (
          <button
            key={cat}
            onClick={() => setCategory(category === cat ? null : cat)}
            aria-pressed={category === cat}
            className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
              category === cat
                ? 'border-primary/60 bg-primary/15 text-primary font-medium'
                : 'border-border text-text-secondary hover:text-text hover:bg-surface-2'
            }`}
          >
            {cat}
            <span className="ml-1.5 font-mono tabular-nums text-xs opacity-70">
              {formatCompact(count, 0)}
            </span>
          </button>
        ))}
      </div>

      <Card className="p-0 overflow-hidden" hover={false}>
        <DataTable
          data={rows}
          columns={columns}
          isLoading={isLoading}
          emptyMessage={
            filter.trim()
              ? `No labels match “${filter.trim()}”.`
              : 'No labels in this category yet.'
          }
          error={
            isError
              ? {
                  message: 'Could not load the labels directory right now.',
                  onRetry: () => refetch(),
                }
              : null
          }
          rowKey={(l) => l.address}
          initialSorting={[{ id: 'name', desc: false }]}
          virtualized
          height={560}
        />
      </Card>

      <p className="text-xs text-text-secondary">
        Labels power the whale feed and wallet profiler — click any row to open its wallet
        profile. Confidence reflects how sure the labelling source is about the attribution.
      </p>
    </motion.div>
  );
};

export default LabelsPage;
