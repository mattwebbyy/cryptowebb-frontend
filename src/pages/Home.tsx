// src/pages/Home.tsx — marketing landing. Flat, data-first, no gradient
// theater: the product visual and concrete surfaces do the selling.
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Rocket,
  Waves,
  ArrowLeftRight,
  Crosshair,
  Bell,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EChart } from '@/components/charts/EChart';

const stats = [
  { value: '15k+', label: 'Tokens priced live' },
  { value: '10s', label: 'Launch detection' },
  { value: '24/7', label: 'Chain indexing' },
  { value: 'REST + WS', label: 'Developer API' },
];

const surfaces = [
  {
    icon: Rocket,
    title: 'Token launches',
    to: '/launches',
    description:
      'Every new pair on Ethereum DEXes as it hits the chain — liquidity, buys/sells, holders and deployer risk flags.',
    public: true,
  },
  {
    icon: Waves,
    title: 'Whale tracking',
    to: '/whales',
    description:
      'Labeled large transfers in real time. See CEX deposits before they hit the order books.',
    public: false,
  },
  {
    icon: ArrowLeftRight,
    title: 'Exchange flows',
    to: '/flows',
    description:
      'Net deposit/withdrawal flow per exchange and per token — the classic CryptoQuant signal, on your own terms.',
    public: false,
  },
  {
    icon: Crosshair,
    title: 'Smart money',
    to: '/smart-money',
    description:
      'A ranked leaderboard of the most profitable wallets, with full profiles and holdings.',
    public: false,
  },
  {
    icon: Bell,
    title: 'Alerts',
    to: '/alerts',
    description:
      'Thresholds on any metric — get notified by email or webhook the moment they trigger.',
    public: false,
  },
  {
    icon: Zap,
    title: 'Developer API',
    to: '/docs',
    description:
      'Everything in the UI over clean REST + WebSocket with API-key auth and columnar responses.',
    public: true,
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
          lineStyle: { width: 1.5 },
          areaStyle: { opacity: 0.08 },
        },
      ],
    }),
    []
  );

  return (
    <div className="relative">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-14">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-gain animate-pulse" aria-hidden="true" />
              Indexing Ethereum mainnet, live
            </span>
            <h1 className="mt-5 text-3xl md:text-[2.75rem] font-semibold tracking-tight leading-[1.15]">
              Onchain intelligence,
              <br />
              straight from the chain
            </h1>
            <p className="mt-5 max-w-xl text-[15px] text-text-secondary leading-relaxed">
              Token launches, whale movements, exchange flows and smart-money wallets — indexed
              by our own infrastructure and streamed to you in seconds, not minutes.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row items-start gap-3">
              <Link to="/launches">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Explore live launches
                  <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View pricing
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-text-secondary">
              Launch feed and token pages are free — no account needed.
            </p>
          </div>

          {/* Product visual */}
          <div className="rounded-md border border-border bg-surface overflow-hidden">
            <div className="flex items-center gap-2 px-4 h-9 border-b border-border">
              <span className="text-xs text-text-secondary font-mono">ETH / USD · 1h</span>
              <span className="ml-auto text-xs font-mono tabular-nums text-gain">+4.62%</span>
            </div>
            <div className="h-56 md:h-72 p-2">
              <EChart option={heroOption} />
            </div>
            <div className="grid grid-cols-3 divide-x divide-border border-t border-border text-center">
              {[
                ['Whale alert', '$2.4M → Binance'],
                ['New launch', 'liquidity $180K'],
                ['Net flow', '-12,400 ETH'],
              ].map(([k, v]) => (
                <div key={k} className="px-2 py-2.5">
                  <div className="text-[10px] uppercase tracking-wider text-text-secondary">{k}</div>
                  <div className="text-xs font-mono tabular-nums mt-0.5 truncate">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-xl md:text-2xl font-semibold font-mono tabular-nums">
                {stat.value}
              </div>
              <div className="mt-0.5 text-[13px] text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Product surfaces */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="max-w-2xl">
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
            Everything you need to read the chain
          </h2>
          <p className="mt-2 text-[15px] text-text-secondary">
            One workspace for market intelligence, monitoring and portfolio tracking — built for
            traders, funds and builders.
          </p>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {surfaces.map((s) => (
            <Link
              key={s.title}
              to={s.to}
              className="group rounded-md border border-border bg-surface p-5 transition-colors hover:border-text-secondary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <div className="flex items-center justify-between">
                <s.icon className="w-[18px] h-[18px] text-primary" aria-hidden="true" />
                {!s.public && (
                  <span className="text-[10px] uppercase tracking-wider text-text-secondary border border-border rounded px-1.5 py-0.5">
                    Account
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-sm font-semibold group-hover:text-primary transition-colors">
                {s.title}
              </h3>
              <p className="mt-1.5 text-[13px] text-text-secondary leading-relaxed">
                {s.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="rounded-md border border-border bg-surface px-6 py-12 md:flex items-center justify-between gap-8">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
              Start exploring the chain today
            </h2>
            <p className="mt-2 text-[15px] text-text-secondary max-w-xl">
              The launch feed is open to everyone. Create a free account for whales, flows and
              smart money.
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex items-center gap-3 shrink-0">
            <Link to="/register">
              <Button variant="primary" size="lg">
                Get started free
                <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost" size="lg">Talk to us</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
