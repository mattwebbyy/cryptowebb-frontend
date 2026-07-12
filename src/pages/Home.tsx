// src/pages/Home.tsx — marketing landing. Flat, data-first, no gradient
// theater: the live product does the selling. The hero panel is a real
// launch ticker fed by the indexer (REST seed + WS prepends); every number
// in the stats strip is real, with static fallbacks if the API is away.
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
  Radio,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNewTokens, useIndexerStatus } from '@/features/indexer';
import { useIndexerStream } from '@/hooks/useIndexerStream';
import { formatAge, formatCompact } from '@/lib/format';

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

const TICKER_ROWS = 8;

interface TickerRow {
  address: string;
  symbol: string;
  name: string;
  dex: string;
  ageMinutes: number;
  live: boolean;
}

/**
 * Real launch ticker: seeded over REST, prepended over WS. Never shows an
 * error — an unreachable indexer collapses to a calm "listening" state.
 * No USD figures here: fresh pairs price in later, and the landing page
 * shouldn't open with em dashes.
 */
const LiveLaunchTicker = () => {
  const { data } = useNewTokens(
    { limit: TICKER_ROWS, hours: 24, sort: 'age' },
    { refetchInterval: 60000 }
  );
  const { newTokens: liveAlerts, isConnected } = useIndexerStream({ bufferSize: 16 });

  const rows = useMemo<TickerRow[]>(() => {
    const nowSec = Math.floor(Date.now() / 1000);
    const seen = new Set<string>();
    const out: TickerRow[] = [];
    for (const a of liveAlerts) {
      if (seen.has(a.token_address)) continue;
      seen.add(a.token_address);
      out.push({
        address: a.token_address,
        symbol: a.symbol,
        name: a.name,
        dex: a.dex,
        ageMinutes: Math.max(0, (nowSec - a.timestamp) / 60),
        live: true,
      });
    }
    for (const t of data ?? []) {
      if (seen.has(t.token_address)) continue;
      seen.add(t.token_address);
      out.push({
        address: t.token_address,
        symbol: t.symbol,
        name: t.name,
        dex: t.dex,
        ageMinutes: t.age_minutes,
        live: false,
      });
    }
    return out.slice(0, TICKER_ROWS);
  }, [data, liveAlerts]);

  return (
    <div className="rounded-md border border-border bg-surface overflow-hidden">
      <div className="flex items-center gap-2 px-4 h-9 border-b border-border">
        <span className="text-xs text-text-secondary font-mono">New pairs · Ethereum</span>
        <span
          className={`ml-auto inline-flex items-center gap-1.5 text-xs ${
            isConnected ? 'text-gain' : 'text-text-secondary'
          }`}
        >
          <Radio className="w-3 h-3" aria-hidden="true" />
          {isConnected ? 'Live' : 'Connecting…'}
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="h-56 md:h-72 flex flex-col items-center justify-center gap-2 text-text-secondary">
          <span className="w-1.5 h-1.5 rounded-full bg-gain animate-pulse" aria-hidden="true" />
          <span className="text-sm">Listening for new pairs…</span>
        </div>
      ) : (
        <ul className="divide-y divide-border/60">
          {rows.map((row) => (
            <li key={row.address} className={row.live ? 'animate-row-flash' : undefined}>
              <Link
                to={`/token/${row.address}`}
                className="flex items-center gap-3 px-4 py-2 hover:bg-surface-2/60 transition-colors"
              >
                <span className="w-14 shrink-0 text-xs font-mono tabular-nums text-text-secondary">
                  {formatAge(row.ageMinutes)}
                </span>
                <span className="min-w-0 flex-1 truncate">
                  <span className="text-[13px] font-semibold">{row.symbol || '·'}</span>
                  {row.name && (
                    <span className="ml-2 text-xs text-text-secondary">{row.name}</span>
                  )}
                </span>
                <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium bg-primary/10 text-primary whitespace-nowrap">
                  {row.dex.replace('_', ' ')}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="border-t border-border">
        <Link
          to="/launches"
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs text-text-secondary hover:text-primary transition-colors"
        >
          Open the full launch feed
          <ArrowRight className="w-3 h-3" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};

const Home = () => {
  const { data: status } = useIndexerStatus({ refetchInterval: 30000 });

  // Real infrastructure numbers with static fallbacks — never zeros.
  const stats = [
    {
      value: status ? `${formatCompact(status.transfers_count, 0)}` : '500M+',
      label: 'Transfers indexed',
    },
    {
      value: status ? `${formatCompact(status.swaps_count, 0)}` : '85M+',
      label: 'DEX swaps decoded',
    },
    { value: '10s', label: 'Launch detection' },
    { value: 'REST + WS', label: 'Developer API' },
  ];

  const syncPct =
    status && status.latest_chain_block > 0
      ? Math.min(100, (status.latest_indexed_block / status.latest_chain_block) * 100)
      : null;

  return (
    <div className="relative">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-14">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Link
              to="/status"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary hover:border-primary/40 hover:text-text transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gain animate-pulse" aria-hidden="true" />
              {status
                ? `Live · ${formatCompact(status.blocks_behind, 0)} blocks behind chain head`
                : 'Indexing Ethereum mainnet, live'}
            </Link>
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
              <Link to="/trial">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Start free trial
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-text-secondary">
              Launch feed and token pages are free — no account needed.
            </p>
          </div>

          {/* Product visual: the actual launch feed, not a mockup */}
          <LiveLaunchTicker />
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

      {/* Trust band: honest sync progress */}
      {syncPct != null && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <Link
            to="/status"
            className="group flex flex-col sm:flex-row sm:items-center gap-3 rounded-md border border-border bg-surface px-5 py-4 hover:border-text-secondary/40 transition-colors"
          >
            <span className="text-[13px] text-text-secondary shrink-0">
              Chain sync{' '}
              <span className="font-mono tabular-nums text-text">{syncPct.toFixed(2)}%</span>
            </span>
            <span
              className="h-1.5 flex-1 rounded-full bg-surface-2 overflow-hidden"
              aria-hidden="true"
            >
              <span
                className="block h-full rounded-full bg-gain"
                style={{ width: `${syncPct}%` }}
              />
            </span>
            <span className="text-[13px] text-text-secondary shrink-0 group-hover:text-primary transition-colors">
              Full status →
            </span>
          </Link>
        </section>
      )}

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
