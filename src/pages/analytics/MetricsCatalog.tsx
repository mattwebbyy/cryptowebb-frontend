// src/pages/analytics/MetricsCatalog.tsx — browsable catalog of platform
// metrics (replaces the old analytics sidebar's category tree).
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useDataMetricsList } from '@/features/dataMetrics/api/useDataMetrics';
import type { DataMetric } from '@/types/metricsData';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';

const MetricsCatalog = () => {
  const navigate = useNavigate();
  const { data: metrics, isLoading, error, refetch } = useDataMetricsList();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const categories = useMemo(() => {
    const set = new Set((metrics ?? []).map((m) => m.Category || 'Other'));
    return ['all', ...Array.from(set).sort()];
  }, [metrics]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (metrics ?? []).filter((m) => {
      if (category !== 'all' && (m.Category || 'Other') !== category) return false;
      if (!q) return true;
      return (
        m.MetricName.toLowerCase().includes(q) ||
        (m.Description ?? '').toLowerCase().includes(q)
      );
    });
  }, [metrics, query, category]);

  const columns = useMemo<ColumnDef<DataMetric, unknown>[]>(
    () => [
      {
        header: 'Metric',
        accessorKey: 'MetricName',
        cell: ({ row }) => (
          <div className="flex flex-col py-0.5">
            <span className="font-medium">{row.original.MetricName}</span>
            {row.original.Description && (
              <span className="text-xs text-text-secondary truncate max-w-[420px]">
                {row.original.Description}
              </span>
            )}
          </div>
        ),
      },
      {
        header: 'Category',
        accessorKey: 'Category',
        cell: ({ row }) => (
          <span className="rounded px-1.5 py-0.5 text-[11px] bg-surface-2 border border-border text-text-secondary">
            {row.original.Category || 'Other'}
          </span>
        ),
      },
      {
        header: 'Source',
        accessorKey: 'DataSourceType',
        meta: { className: 'hidden md:table-cell' },
        cell: ({ row }) => (
          <span className="text-text-secondary">{row.original.DataSourceType}</span>
        ),
      },
      {
        header: 'Chain',
        accessorKey: 'Blockchain',
        meta: { className: 'hidden md:table-cell' },
        cell: ({ row }) => (
          <span className="text-text-secondary">{row.original.Blockchain}</span>
        ),
      },
    ],
    []
  );

  return (
    <div className="py-4 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search metrics…"
            aria-label="Search metrics"
            className="rounded-md bg-surface-2 border border-border pl-8 pr-3 py-1.5 text-sm text-text w-64 focus:outline-none focus:border-primary/60"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
          className="rounded-md bg-surface-2 border border-border px-3 py-1.5 text-sm text-text focus:outline-none focus:border-primary/60"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === 'all' ? 'All categories' : c}
            </option>
          ))}
        </select>
        <span className="text-xs text-text-secondary ml-auto">
          {rows.length} metric{rows.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="rounded-md border border-border bg-surface overflow-hidden">
        <DataTable
          data={rows}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No metrics match your search."
          error={
            error ? { message: 'Failed to load metrics.', onRetry: () => refetch() } : null
          }
          rowKey={(m) => String(m.MetricID)}
          onRowClick={(m) => navigate(`/analytics/metrics/${m.MetricID}`)}
        />
      </div>
    </div>
  );
};

export default MetricsCatalog;
