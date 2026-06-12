// Living style guide: every token and core component state on one page.
// Dev-facing route (/design) used to verify the design system at a glance.
import { useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EChart } from '@/components/charts/EChart';
import { Sparkline } from '@/components/charts/Sparkline';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';

const tokenSwatches = [
  ['primary', 'var(--color-primary)'],
  ['secondary', 'var(--color-secondary)'],
  ['accent', 'var(--color-accent)'],
  ['background', 'var(--color-background)'],
  ['surface', 'var(--color-surface)'],
  ['surface-2', 'var(--color-surface-2)'],
  ['border', 'var(--color-border)'],
  ['text', 'var(--color-text)'],
  ['text-secondary', 'var(--color-text-secondary)'],
  ['success', 'var(--color-success)'],
  ['warning', 'var(--color-warning)'],
  ['error', 'var(--color-error)'],
  ['gain', 'var(--color-gain)'],
  ['loss', 'var(--color-loss)'],
] as const;

const chartSwatches = Array.from({ length: 8 }, (_, i) => `var(--chart-${i + 1})`);

const buttonVariants = ['default', 'primary', 'outline', 'ghost', 'gradient', 'glass', 'destructive'] as const;

const demoSeries = Array.from({ length: 48 }, (_, i) => 50 + Math.sin(i / 4) * 20 + Math.random() * 8);

const DesignPlayground = () => {
  const { theme, setTheme, toggleMode } = useTheme();

  const lineOption = useMemo(
    () => ({
      tooltip: { trigger: 'axis' },
      grid: { left: 40, right: 16, top: 24, bottom: 28 },
      xAxis: { type: 'category', data: demoSeries.map((_, i) => `${i}:00`) },
      yAxis: { type: 'value' },
      series: [
        { type: 'line', name: 'BTC', data: demoSeries, smooth: true, showSymbol: false, areaStyle: { opacity: 0.15 } },
        { type: 'line', name: 'ETH', data: demoSeries.map((v) => v * 0.7 + 5), smooth: true, showSymbol: false },
      ],
    }),
    []
  );

  const barOption = useMemo(
    () => ({
      tooltip: { trigger: 'axis' },
      grid: { left: 40, right: 16, top: 24, bottom: 28 },
      xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: [120, 200, 150, 80, 170], itemStyle: { borderRadius: [4, 4, 0, 0] } }],
    }),
    []
  );

  const pieOption = useMemo(
    () => ({
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'pie',
          radius: ['45%', '70%'],
          itemStyle: { borderRadius: 6, borderWidth: 2, borderColor: 'var(--color-surface)' },
          label: { show: false },
          data: [
            { value: 40, name: 'BTC' },
            { value: 25, name: 'ETH' },
            { value: 20, name: 'SOL' },
            { value: 15, name: 'Other' },
          ],
        },
      ],
    }),
    []
  );

  return (
    <div className="min-h-screen px-6 py-10 max-w-6xl mx-auto space-y-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Design System</h1>
          <p className="text-text-secondary mt-1">
            Tokens, components, and chart styling — the living style guide.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={toggleMode}>
            Mode: {theme.mode}
          </Button>
          <Button
            variant="outline"
            onClick={() => setTheme({ variant: theme.variant === 'matrix' ? 'default' : 'matrix' })}
          >
            Variant: {theme.variant}
          </Button>
        </div>
      </header>

      <section aria-labelledby="tokens-heading">
        <h2 id="tokens-heading" className="text-xl font-semibold mb-4">Color tokens</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {tokenSwatches.map(([name, value]) => (
            <div key={name} className="space-y-1.5">
              <div className="h-14 rounded-lg border border-border" style={{ backgroundColor: value }} />
              <div className="text-xs text-text-secondary font-mono">{name}</div>
            </div>
          ))}
        </div>
        <h3 className="text-sm font-semibold mt-6 mb-2 text-text-secondary">Chart ramp</h3>
        <div className="flex gap-2">
          {chartSwatches.map((value, i) => (
            <div key={i} className="h-10 flex-1 rounded-md" style={{ backgroundColor: value }} title={`chart-${i + 1}`} />
          ))}
        </div>
      </section>

      <section aria-labelledby="type-heading">
        <h2 id="type-heading" className="text-xl font-semibold mb-4">Typography</h2>
        <Card className="p-6 space-y-3" hover={false}>
          <p className="text-3xl font-bold">Heading 32 — Inter Bold</p>
          <p className="text-2xl font-semibold">Heading 24 — Inter Semibold</p>
          <p className="text-xl font-semibold">Heading 20</p>
          <p className="text-base">Body 16 — readable paragraph text in Inter.</p>
          <p className="text-sm text-text-secondary">Secondary 14 — supporting copy.</p>
          <p className="font-mono text-sm tabular-nums">
            mono/tabular: 0x3390…9989 · $42,690.18 · +3.42%
          </p>
          <p className="font-mono text-sm tabular-nums">
            <span className="text-gain">▲ +1,284.55</span>{' '}
            <span className="text-loss">▼ −402.10</span>
          </p>
        </Card>
      </section>

      <section aria-labelledby="buttons-heading">
        <h2 id="buttons-heading" className="text-xl font-semibold mb-4">Buttons</h2>
        <Card className="p-6 space-y-4" hover={false}>
          <div className="flex flex-wrap gap-3">
            {buttonVariants.map((variant) => (
              <Button key={variant} variant={variant} onClick={() => toast.success(`${variant} clicked`)}>
                {variant}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="xs">xs</Button>
            <Button size="sm">sm</Button>
            <Button size="md">md</Button>
            <Button size="lg">lg</Button>
            <Button isLoading>loading</Button>
            <Button disabled>disabled</Button>
          </div>
        </Card>
      </section>

      <section aria-labelledby="states-heading">
        <h2 id="states-heading" className="text-xl font-semibold mb-4">Loading & feedback</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="p-6 space-y-3" hover={false}>
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-24 w-full" />
          </Card>
          <Card className="p-6 space-y-3" hover={false}>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => toast.success('Saved successfully')}>success</Button>
              <Button variant="outline" onClick={() => toast.error('Something broke')}>error</Button>
              <Button variant="outline" onClick={() => toast.warning('Careful now')}>warning</Button>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <Sparkline data={demoSeries} />
              <Sparkline data={[...demoSeries].reverse()} color="var(--color-loss)" />
            </div>
          </Card>
        </div>
      </section>

      <section aria-labelledby="charts-heading">
        <h2 id="charts-heading" className="text-xl font-semibold mb-4">Charts (ECharts)</h2>
        <div className="grid lg:grid-cols-2 gap-4">
          <Card className="p-4 h-72" hover={false}>
            <EChart option={lineOption} />
          </Card>
          <Card className="p-4 h-72" hover={false}>
            <EChart option={barOption} />
          </Card>
          <Card className="p-4 h-72 lg:col-span-2" hover={false}>
            <EChart option={pieOption} />
          </Card>
        </div>
      </section>
    </div>
  );
};

export default DesignPlayground;
