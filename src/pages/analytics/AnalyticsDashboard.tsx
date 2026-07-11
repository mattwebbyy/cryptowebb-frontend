// src/pages/analytics/AnalyticsDashboard.tsx — API-backed dashboard viewer.
// Dashboards, charts and layout all persist through the backend; chart data
// is served by /api/v1/charts/:id/data against platform metrics.
import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Plus, LayoutDashboard, Trash2, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  useDashboards,
  useCreateDashboard,
  useCreateChart,
  useDeleteChart,
} from '@/features/dashboards/api/useDashboards';
import { useDatasources, useCreateDatasource } from '@/features/dashboards/api/useDatasources';
import { useDataMetricsList } from '@/features/dataMetrics/api/useDataMetrics';
import { ChartRenderer } from '@/features/charts/components/chartRenderer';
import type { WidgetChartType } from '@/features/charts/components/chartData';
import { Button } from '@/components/ui/Button';
import { Dialog, FormInput, DialogFooter } from '@/components/ui/Dialog';

type ChartType = 'line' | 'bar' | 'pie' | 'number' | 'table';

const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: 'line', label: 'Line chart' },
  { value: 'bar', label: 'Bar chart' },
  { value: 'number', label: 'Number' },
  { value: 'table', label: 'Table' },
  { value: 'pie', label: 'Pie chart' },
];

const GRANULARITIES = ['5m', '15m', '1h', '4h', '1d'];
const RANGES = ['24h', '7d', '30d', '90d'];

const selectClass =
  'w-full rounded-md bg-surface-2 border border-border px-3 py-2 text-sm text-text focus:outline-none focus:border-primary/60';

const AnalyticsDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: dashboards, isLoading, error } = useDashboards();
  const createDashboard = useCreateDashboard();
  const createChart = useCreateChart();
  const deleteChart = useDeleteChart();
  const { data: datasources } = useDatasources();
  const createDatasource = useCreateDatasource();
  const { data: metrics } = useDataMetricsList();

  const [isCreateDashOpen, setIsCreateDashOpen] = useState(false);
  const [dashName, setDashName] = useState('');

  const [isAddChartOpen, setIsAddChartOpen] = useState(false);
  const [chartName, setChartName] = useState('');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [metricId, setMetricId] = useState('');
  const [granularity, setGranularity] = useState('1h');
  const [range, setRange] = useState('30d');
  const [live, setLive] = useState(false);

  const selected = useMemo(() => {
    if (!dashboards || dashboards.length === 0) return null;
    const wanted = searchParams.get('d');
    return dashboards.find((d) => d.id === wanted) ?? dashboards[0];
  }, [dashboards, searchParams]);

  const charts = selected?.charts ?? [];

  const handleCreateDashboard = () => {
    if (!dashName.trim()) {
      toast.error('Dashboard name is required');
      return;
    }
    createDashboard.mutate(
      { name: dashName.trim() },
      {
        onSuccess: (created) => {
          toast.success(`Dashboard "${dashName.trim()}" created`);
          setIsCreateDashOpen(false);
          setDashName('');
          if (created?.id) setSearchParams({ d: created.id });
        },
        onError: (err) => toast.error(`Failed to create dashboard: ${err.message}`),
      }
    );
  };

  // Charts require a datasource ID upstream; platform-metric charts don't
  // actually read from one, so we lazily provision a placeholder once.
  const resolveDatasourceId = async (): Promise<string> => {
    const existing = datasources?.[0];
    if (existing) return existing.id;
    const created = await createDatasource.mutateAsync({
      name: 'Platform metrics',
      type: 'api',
      description: 'Built-in CryptoWebb metric store',
      config: {},
    });
    return created.id;
  };

  const handleAddChart = async () => {
    if (!selected) return;
    if (!chartName.trim()) {
      toast.error('Chart name is required');
      return;
    }
    if (!metricId) {
      toast.error('Pick a metric to chart');
      return;
    }
    try {
      const datasourceId = await resolveDatasourceId();
      const agg = chartType === 'number' ? 'last' : 'avg';
      await createChart.mutateAsync({
        dashboardId: selected.id,
        name: chartName.trim(),
        type: chartType,
        datasourceId,
        query: `metric:${metricId} granularity:${granularity} range:${range} agg:${agg}`,
        isLive: live,
        position: charts.length,
      });
      toast.success(`Chart "${chartName.trim()}" added`);
      setIsAddChartOpen(false);
      setChartName('');
      setMetricId('');
    } catch (err) {
      toast.error(`Failed to add chart: ${err instanceof Error ? err.message : 'unknown error'}`);
    }
  };

  const handleDeleteChart = (chartId: string, name: string) => {
    if (!window.confirm(`Remove chart "${name}"?`)) return;
    deleteChart.mutate(chartId, {
      onSuccess: () => toast.success(`Chart "${name}" removed`),
      onError: (err) => toast.error(`Failed to remove chart: ${err.message}`),
    });
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center text-sm text-text-secondary">Loading dashboards…</div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center text-sm text-error">
        Failed to load dashboards: {error.message}
      </div>
    );
  }

  return (
    <div className="py-4 space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {dashboards && dashboards.length > 0 && (
          <select
            value={selected?.id ?? ''}
            onChange={(e) => setSearchParams({ d: e.target.value })}
            aria-label="Select dashboard"
            className="rounded-md bg-surface-2 border border-border px-3 py-1.5 text-sm text-text focus:outline-none focus:border-primary/60 min-w-[180px]"
          >
            {dashboards.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        )}
        {selected && (
          <Button variant="primary" size="sm" onClick={() => setIsAddChartOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Add chart
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => setIsCreateDashOpen(true)}>
          New dashboard
        </Button>
        <div className="flex-1" />
        <Link
          to="/analytics/manage"
          className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text transition-colors"
        >
          <Settings2 className="w-3.5 h-3.5" aria-hidden="true" />
          Rename, share &amp; delete
        </Link>
      </div>

      {/* Content */}
      {!selected ? (
        <div className="rounded-md border border-border bg-surface py-20 text-center">
          <LayoutDashboard className="w-8 h-8 mx-auto mb-3 text-text-secondary" aria-hidden="true" />
          <h2 className="text-base font-semibold mb-1">No dashboards yet</h2>
          <p className="text-[13px] text-text-secondary mb-5">
            Create a dashboard, then add charts from any platform metric.
          </p>
          <Button variant="primary" size="sm" onClick={() => setIsCreateDashOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Create dashboard
          </Button>
        </div>
      ) : charts.length === 0 ? (
        <div className="rounded-md border border-border bg-surface py-20 text-center">
          <h2 className="text-base font-semibold mb-1">“{selected.name}” is empty</h2>
          <p className="text-[13px] text-text-secondary mb-5">
            Add your first chart — pick a metric, a chart type and a time window.
          </p>
          <Button variant="primary" size="sm" onClick={() => setIsAddChartOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Add chart
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {charts.map((chart) => (
            <div key={chart.id} className="relative group min-h-[280px]">
              <button
                onClick={() => handleDeleteChart(chart.id, chart.name)}
                className="absolute top-2 right-2 z-10 p-1.5 rounded-md text-text-secondary opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-error hover:bg-error/10 transition-all"
                title={`Remove ${chart.name}`}
                aria-label={`Remove chart ${chart.name}`}
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <ChartRenderer
                chartId={chart.id}
                chartType={chart.type as WidgetChartType}
                title={chart.name}
                isLive={chart.isLive}
              />
            </div>
          ))}
        </div>
      )}

      {/* Create dashboard dialog */}
      <Dialog
        isOpen={isCreateDashOpen}
        onClose={() => setIsCreateDashOpen(false)}
        title="Create dashboard"
      >
        <FormInput
          label="Dashboard name"
          placeholder="e.g. ETH overview"
          value={dashName}
          onChange={(e) => setDashName(e.target.value)}
          autoFocus
        />
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsCreateDashOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateDashboard}
            disabled={createDashboard.isPending}
          >
            {createDashboard.isPending ? 'Creating…' : 'Create'}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Add chart dialog */}
      <Dialog
        isOpen={isAddChartOpen}
        onClose={() => setIsAddChartOpen(false)}
        title="Add chart"
      >
        <div className="space-y-4">
          <FormInput
            label="Chart name"
            placeholder="e.g. Gas price (7d)"
            value={chartName}
            onChange={(e) => setChartName(e.target.value)}
            autoFocus
          />

          <div>
            <span className="block mb-1.5 text-sm font-medium">Metric</span>
            <select
              value={metricId}
              onChange={(e) => setMetricId(e.target.value)}
              className={selectClass}
              aria-label="Metric"
            >
              <option value="">Select a metric…</option>
              {(metrics ?? []).map((m) => (
                <option key={m.MetricID} value={m.MetricID}>
                  {m.Category ? `${m.Category} — ` : ''}
                  {m.MetricName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="block mb-1.5 text-sm font-medium">Chart type</span>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as ChartType)}
                className={selectClass}
                aria-label="Chart type"
              >
                {CHART_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className="block mb-1.5 text-sm font-medium">Granularity</span>
              <select
                value={granularity}
                onChange={(e) => setGranularity(e.target.value)}
                className={selectClass}
                aria-label="Granularity"
              >
                {GRANULARITIES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className="block mb-1.5 text-sm font-medium">Time range</span>
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className={selectClass}
                aria-label="Time range"
              >
                {RANGES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-end gap-2 pb-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={live}
                onChange={(e) => setLive(e.target.checked)}
                className="accent-[var(--color-primary)]"
              />
              Live updates
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsAddChartOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddChart} disabled={createChart.isPending}>
            {createChart.isPending ? 'Adding…' : 'Add chart'}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default AnalyticsDashboard;
