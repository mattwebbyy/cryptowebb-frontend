import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Bell, Wallet, Zap, ShieldCheck, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EChart } from '@/components/charts/EChart';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const stats = [
  { value: '250+', label: 'On-chain metrics' },
  { value: '<50ms', label: 'Query latency' },
  { value: '24/7', label: 'Live indexing' },
  { value: '99.9%', label: 'Uptime' },
];

const features = [
  {
    icon: LineChart,
    title: 'Real-time analytics',
    description:
      'Stream on-chain metrics into responsive dashboards with sub-second charts, technical indicators, and custom granularity.',
  },
  {
    icon: Bell,
    title: 'Smart alerts',
    description:
      'Set thresholds on any metric or indicator — price, RSI, whale transfers — and get notified by email or webhook the moment they trigger.',
  },
  {
    icon: Wallet,
    title: 'Portfolio tracking',
    description:
      'Connect wallets and track holdings, P&L, and exposure across chains with automatic valuation against live market data.',
  },
  {
    icon: Activity,
    title: 'Whale & flow intel',
    description:
      'Follow exchange flows, new contracts, and large transfers as they happen, indexed directly from archive nodes.',
  },
  {
    icon: Zap,
    title: 'Developer API',
    description:
      'Everything in the UI is available over a clean REST API with API-key auth, generous limits, and columnar responses built for charts.',
  },
  {
    icon: ShieldCheck,
    title: 'Built to scale',
    description:
      'Server-side aggregation, Redis caching, and ClickHouse-backed indexing keep dashboards fast at any data volume.',
  },
];

// Deterministic demo series so the hero chart renders identically every visit.
const heroSeries = Array.from({ length: 64 }, (_, i) => {
  const trend = 42000 + i * 95;
  const wave = Math.sin(i / 5.2) * 900 + Math.sin(i / 2.1) * 350;
  return Math.round(trend + wave);
});

const Home = () => {
  const heroOption = useMemo(
    () => ({
      grid: { left: 8, right: 8, top: 8, bottom: 8 },
      xAxis: { type: 'category', show: false, data: heroSeries.map((_, i) => i) },
      yAxis: { type: 'value', show: false, scale: true },
      tooltip: { trigger: 'axis', formatter: '${c0}' },
      series: [
        {
          type: 'line',
          data: heroSeries,
          showSymbol: false,
          smooth: true,
          lineStyle: { width: 2 },
          areaStyle: { opacity: 0.18 },
        },
      ],
    }),
    []
  );

  return (
    <div className="relative overflow-hidden">
      {/* Ambient hero glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 h-[36rem] opacity-60"
        style={{
          background:
            'radial-gradient(40rem 20rem at 50% 0%, var(--color-primary-20), transparent 70%)',
        }}
      />

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 pt-20 md:pt-28 pb-16 text-center">
        <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" aria-hidden="true" />
            Live indexing across Ethereum &amp; Base
          </span>
        </motion.div>

        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mt-6 text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]"
        >
          On-chain analytics,
          <br />
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            without the lag
          </span>
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-text-secondary leading-relaxed"
        >
          CryptoWebb turns raw blockchain data into real-time dashboards, alerts, and portfolio
          intelligence — indexed straight from the chain and served in milliseconds.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link to="/trial">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Start free trial
              <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
            </Button>
          </Link>
          <Link to="/pricing">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              View pricing
            </Button>
          </Link>
        </motion.div>

        {/* Product visual */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-14 mx-auto max-w-4xl"
        >
          <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur shadow-2xl shadow-primary/5 overflow-hidden">
            <div className="flex items-center gap-2 px-4 h-10 border-b border-border">
              <span className="w-2.5 h-2.5 rounded-full bg-border" aria-hidden="true" />
              <span className="w-2.5 h-2.5 rounded-full bg-border" aria-hidden="true" />
              <span className="w-2.5 h-2.5 rounded-full bg-border" aria-hidden="true" />
              <span className="ml-3 text-xs text-text-secondary font-mono">BTC / USD · 1h</span>
              <span className="ml-auto text-xs font-mono tabular-nums text-gain">+4.62%</span>
            </div>
            <div className="h-64 md:h-80 p-2">
              <EChart option={heroOption} />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative border-y border-border bg-surface/50">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold font-mono tabular-nums">{stat.value}</div>
              <div className="mt-1 text-sm text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Everything you need to read the chain
          </h2>
          <p className="mt-3 text-text-secondary">
            One platform for analytics, monitoring, and portfolio intelligence — built for traders,
            funds, and builders.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: (index % 3) * 0.06 }}
              className="group rounded-xl border border-border bg-surface p-6 transition-colors hover:border-primary/30"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative max-w-6xl mx-auto px-6 pb-24">
        <div className="relative rounded-2xl border border-border bg-surface overflow-hidden px-6 py-14 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              background:
                'radial-gradient(32rem 14rem at 50% 100%, var(--color-primary-20), transparent 70%)',
            }}
          />
          <h2 className="relative text-2xl md:text-3xl font-bold tracking-tight">
            Start exploring the chain today
          </h2>
          <p className="relative mt-3 text-text-secondary max-w-xl mx-auto">
            Free trial, no credit card required. Upgrade when you need more metrics, alerts, and API
            throughput.
          </p>
          <div className="relative mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/trial">
              <Button variant="primary" size="lg">
                Get started free
                <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost" size="lg">
                Talk to us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
