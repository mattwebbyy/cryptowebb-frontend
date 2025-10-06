import { useId, useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  CalendarDays,
  Download,
  Share2,
} from 'lucide-react';

type Timeframe = '1W' | '1M' | '3M' | 'YTD' | '1Y';

type PerformancePoint = {
  label: string;
  value: number;
};

type Holding = {
  symbol: string;
  name: string;
  amount: number;
  currentPrice: number;
  costBasis: number;
  dayChangePct: number;
};

type TransactionType = 'buy' | 'sell' | 'stake' | 'rebalance';

type Transaction = {
  id: string;
  symbol: string;
  type: TransactionType;
  quantity: number;
  price: number;
  date: string;
  counterparty?: string;
  notes?: string;
};

type Portfolio = {
  id: string;
  name: string;
  description: string;
  baseCurrency: string;
  performance: Record<Timeframe, PerformancePoint[]>;
  holdings: Holding[];
  lastUpdated: string;
};

const TIMEFRAMES: Timeframe[] = ['1W', '1M', '3M', 'YTD', '1Y'];

const MOCK_PORTFOLIOS: Portfolio[] = [
  {
    id: 'core-crypto',
    name: 'Core Crypto Holdings',
    description: 'Long-term allocation across major layer 1 and DeFi assets.',
    baseCurrency: 'USD',
    lastUpdated: '2024-05-21T14:05:00Z',
    performance: {
      '1W': [
        { label: 'Mon', value: 187_500 },
        { label: 'Tue', value: 188_300 },
        { label: 'Wed', value: 189_120 },
        { label: 'Thu', value: 190_450 },
        { label: 'Fri', value: 191_260 },
        { label: 'Sat', value: 192_840 },
        { label: 'Sun', value: 194_200 },
      ],
      '1M': [
        { label: 'Week 1', value: 176_400 },
        { label: 'Week 2', value: 181_250 },
        { label: 'Week 3', value: 188_100 },
        { label: 'Week 4', value: 194_200 },
      ],
      '3M': [
        { label: 'Mar', value: 149_000 },
        { label: 'Apr', value: 162_500 },
        { label: 'May', value: 194_200 },
      ],
      YTD: [
        { label: 'Jan', value: 132_000 },
        { label: 'Feb', value: 141_350 },
        { label: 'Mar', value: 149_000 },
        { label: 'Apr', value: 162_500 },
        { label: 'May', value: 194_200 },
      ],
      '1Y': [
        { label: 'Q3 23', value: 96_000 },
        { label: 'Q4 23', value: 118_400 },
        { label: 'Q1 24', value: 149_000 },
        { label: 'Q2 24', value: 194_200 },
      ],
    },
    holdings: [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        amount: 0.85,
        currentPrice: 63_400,
        costBasis: 41_500,
        dayChangePct: 2.1,
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        amount: 8.6,
        currentPrice: 3_240,
        costBasis: 2_120,
        dayChangePct: 1.4,
      },
      {
        symbol: 'SOL',
        name: 'Solana',
        amount: 120,
        currentPrice: 158,
        costBasis: 88,
        dayChangePct: 3.6,
      },
      {
        symbol: 'LINK',
        name: 'Chainlink',
        amount: 420,
        currentPrice: 16.3,
        costBasis: 7.1,
        dayChangePct: 2.9,
      },
      {
        symbol: 'AAVE',
        name: 'Aave',
        amount: 55,
        currentPrice: 98,
        costBasis: 62,
        dayChangePct: -0.8,
      },
    ],
  },
  {
    id: 'emerging-adoption',
    name: 'Emerging Adoption',
    description: 'Focused on AI, real-world assets, and staking yield plays.',
    baseCurrency: 'USD',
    lastUpdated: '2024-05-21T12:20:00Z',
    performance: {
      '1W': [
        { label: 'Mon', value: 72_400 },
        { label: 'Tue', value: 71_950 },
        { label: 'Wed', value: 73_120 },
        { label: 'Thu', value: 74_010 },
        { label: 'Fri', value: 74_480 },
        { label: 'Sat', value: 75_860 },
        { label: 'Sun', value: 76_540 },
      ],
      '1M': [
        { label: 'Week 1', value: 66_100 },
        { label: 'Week 2', value: 68_020 },
        { label: 'Week 3', value: 72_340 },
        { label: 'Week 4', value: 76_540 },
      ],
      '3M': [
        { label: 'Mar', value: 54_000 },
        { label: 'Apr', value: 62_500 },
        { label: 'May', value: 76_540 },
      ],
      YTD: [
        { label: 'Jan', value: 41_200 },
        { label: 'Feb', value: 47_880 },
        { label: 'Mar', value: 54_000 },
        { label: 'Apr', value: 62_500 },
        { label: 'May', value: 76_540 },
      ],
      '1Y': [
        { label: 'Q3 23', value: 29_400 },
        { label: 'Q4 23', value: 36_800 },
        { label: 'Q1 24', value: 54_000 },
        { label: 'Q2 24', value: 76_540 },
      ],
    },
    holdings: [
      {
        symbol: 'FET',
        name: 'Fetch.ai',
        amount: 3_400,
        currentPrice: 2.1,
        costBasis: 0.94,
        dayChangePct: 4.8,
      },
      {
        symbol: 'RNDR',
        name: 'Render',
        amount: 1_250,
        currentPrice: 10.2,
        costBasis: 4.9,
        dayChangePct: 2.2,
      },
      {
        symbol: 'INJ',
        name: 'Injective',
        amount: 410,
        currentPrice: 29.5,
        costBasis: 12.4,
        dayChangePct: 3.1,
      },
      {
        symbol: 'RWA',
        name: 'Maple Finance',
        amount: 600,
        currentPrice: 13.4,
        costBasis: 6.8,
        dayChangePct: 1.9,
      },
    ],
  },
];

const TRANSACTIONS: Record<string, Transaction[]> = {
  'core-crypto': [
    {
      id: 'tx-201',
      symbol: 'BTC',
      type: 'buy',
      quantity: 0.35,
      price: 39_500,
      date: '2024-03-18',
      notes: 'Added on dip after CPI print',
    },
    {
      id: 'tx-202',
      symbol: 'ETH',
      type: 'stake',
      quantity: 4,
      price: 0,
      date: '2024-02-28',
      counterparty: 'Lido',
      notes: 'Moved to liquid staking to earn 4.1% APR',
    },
    {
      id: 'tx-203',
      symbol: 'SOL',
      type: 'buy',
      quantity: 60,
      price: 112,
      date: '2024-01-11',
    },
    {
      id: 'tx-204',
      symbol: 'AAVE',
      type: 'rebalance',
      quantity: 15,
      price: 89,
      date: '2023-12-20',
      notes: 'Trimmed to keep risk weights in line',
    },
  ],
  'emerging-adoption': [
    {
      id: 'tx-301',
      symbol: 'FET',
      type: 'buy',
      quantity: 1_800,
      price: 1.15,
      date: '2024-04-05',
    },
    {
      id: 'tx-302',
      symbol: 'RNDR',
      type: 'buy',
      quantity: 600,
      price: 7.4,
      date: '2024-02-16',
    },
    {
      id: 'tx-303',
      symbol: 'INJ',
      type: 'buy',
      quantity: 210,
      price: 18.8,
      date: '2024-01-22',
    },
  ],
};

const formatCurrency = (value: number, currency: string) =>
  value.toLocaleString(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: value >= 1 ? 2 : 4,
  });

const formatPercent = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

const Sparkline = ({ points, positive }: { points: PerformancePoint[]; positive: boolean }) => {
  const gradientId = useId();

  if (points.length === 0) {
    return (
      <div className="flex h-24 w-full items-center justify-center text-sm text-text-secondary">
        No performance data yet
      </div>
    );
  }

  const width = 320;
  const height = 96;
  const values = points.map((point) => point.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const linePath = points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * width;
      const y = height - ((point.value - min) / range) * height;
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');

  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg
      className="w-full"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop
            offset="0%"
            stopColor={positive ? 'rgba(20,184,166,0.45)' : 'rgba(239,68,68,0.45)'}
          />
          <stop offset="100%" stopColor="rgba(15,23,42,0)" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} opacity={0.65} />
      <path
        d={linePath}
        fill="none"
        stroke={positive ? '#14b8a6' : '#ef4444'}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const HoldingsTable = ({ holdings, currency }: { holdings: Holding[]; currency: string }) => (
  <Card className="overflow-hidden border-border/60">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border/60 text-left">
        <thead className="bg-surface/70">
          <tr className="text-xs uppercase tracking-wide text-text-secondary">
            <th className="px-5 py-3 font-medium">Asset</th>
            <th className="px-5 py-3 font-medium">Holdings</th>
            <th className="px-5 py-3 font-medium">Price</th>
            <th className="px-5 py-3 font-medium">Value</th>
            <th className="px-5 py-3 font-medium">Cost Basis</th>
            <th className="px-5 py-3 font-medium">Unrealized P&amp;L</th>
            <th className="px-5 py-3 font-medium">24h</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40 text-sm">
          {holdings.map((holding) => {
            const marketValue = holding.amount * holding.currentPrice;
            const costBasis = holding.amount * holding.costBasis;
            const unrealized = marketValue - costBasis;
            const unrealizedPct = costBasis > 0 ? (unrealized / costBasis) * 100 : 0;

            return (
              <tr key={holding.symbol} className="hover:bg-surface/60">
                <td className="whitespace-nowrap px-5 py-4 font-medium text-text">
                  <div>
                    {holding.symbol}
                    <span className="block text-xs font-normal text-text-secondary">
                      {holding.name}
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-text-secondary">
                  {holding.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-text">
                  {formatCurrency(holding.currentPrice, currency)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-text">
                  {formatCurrency(marketValue, currency)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-text-secondary">
                  {formatCurrency(costBasis, currency)}
                </td>
                <td
                  className={`whitespace-nowrap px-5 py-4 font-medium ${
                    unrealized >= 0 ? 'text-success' : 'text-error'
                  }`}
                >
                  {formatCurrency(unrealized, currency)}
                  <span className="ml-2 text-xs font-normal">
                    ({formatPercent(unrealizedPct)})
                  </span>
                </td>
                <td
                  className={`whitespace-nowrap px-5 py-4 font-medium ${
                    holding.dayChangePct >= 0 ? 'text-success' : 'text-error'
                  }`}
                >
                  {formatPercent(holding.dayChangePct)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </Card>
);

const AllocationList = ({ holdings, currency }: { holdings: Holding[]; currency: string }) => {
  const totalValue = holdings.reduce(
    (sum, holding) => sum + holding.amount * holding.currentPrice,
    0,
  );

  return (
    <div className="space-y-4">
      {holdings.map((holding) => {
        const value = holding.amount * holding.currentPrice;
        const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;

        return (
          <div key={holding.symbol} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="font-medium text-text">
                {holding.symbol}
                <span className="ml-2 text-xs font-normal text-text-secondary">
                  {holding.name}
                </span>
              </div>
              <div className="text-right text-text-secondary">
                {formatCurrency(value, currency)}
                <span className="ml-2 font-medium text-text">{percentage.toFixed(1)}%</span>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-border/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary/80 to-secondary"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const TransactionsList = ({
  transactions,
  currency,
}: {
  transactions: Transaction[];
  currency: string;
}) => {
  if (transactions.length === 0) {
    return (
      <Card className="flex items-center justify-center border-dashed border-border/60 py-12 text-text-secondary">
        No transactions recorded yet. Connect a wallet or import trades to get started.
      </Card>
    );
  }

  const typeLabel: Record<TransactionType, string> = {
    buy: 'Buy',
    sell: 'Sell',
    stake: 'Stake',
    rebalance: 'Rebalance',
  };

  return (
    <Card className="space-y-6 border-border/60 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text">Recent activity</h3>
          <p className="text-sm text-text-secondary">
            The latest on-chain trades and adjustments across this portfolio
          </p>
        </div>
        <Button variant="outline" size="sm">
          View all
        </Button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => {
          const isBuyLike = transaction.type === 'buy' || transaction.type === 'stake';
          const iconBg = isBuyLike ? 'bg-success/10 text-success' : 'bg-error/10 text-error';

          return (
            <div
              key={transaction.id}
              className="flex items-start justify-between rounded-lg border border-border/60 bg-surface/70 p-4"
            >
              <div className="flex items-start gap-3">
                <div className={`rounded-xl p-2 ${iconBg}`}>
                  {isBuyLike ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-text">
                    {typeLabel[transaction.type]}
                    <span className="text-text-secondary">•</span>
                    <span>{transaction.symbol}</span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    {transaction.quantity.toLocaleString(undefined, { maximumFractionDigits: 4 })}{' '}
                    units @ {transaction.price > 0 ? formatCurrency(transaction.price, currency) : 'On-chain'}
                  </p>
                  <p className="text-xs text-text-secondary/80">
                    {new Date(transaction.date).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                    {transaction.counterparty ? ` • ${transaction.counterparty}` : ''}
                  </p>
                  {transaction.notes && (
                    <p className="mt-2 text-xs text-text-secondary/90">{transaction.notes}</p>
                  )}
                </div>
              </div>
              <div className="text-right text-sm font-medium text-text">
                {transaction.price > 0
                  ? formatCurrency(transaction.quantity * transaction.price, currency)
                  : 'Yield strategy'}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export const PortfolioTracker = () => {
  const [activePortfolioId, setActivePortfolioId] = useState<string>(MOCK_PORTFOLIOS[0]?.id ?? '');
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');

  const activePortfolio = useMemo(
    () => MOCK_PORTFOLIOS.find((portfolio) => portfolio.id === activePortfolioId),
    [activePortfolioId],
  );

  const summary = useMemo(() => {
    if (!activePortfolio) return null;

    const totalValue = activePortfolio.holdings.reduce(
      (sum, holding) => sum + holding.amount * holding.currentPrice,
      0,
    );

    const totalCost = activePortfolio.holdings.reduce(
      (sum, holding) => sum + holding.amount * holding.costBasis,
      0,
    );

    const dayChangeValue = activePortfolio.holdings.reduce((sum, holding) => {
      const value = holding.amount * holding.currentPrice;
      return sum + value * (holding.dayChangePct / 100);
    }, 0);

    const totalReturnPct = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;

    return {
      totalValue,
      totalCost,
      dayChangeValue,
      totalReturnPct,
    };
  }, [activePortfolio]);

  if (!activePortfolio || !summary) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          We could not locate a portfolio configuration. Please add portfolio data or try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const performancePoints = activePortfolio.performance[timeframe] ?? [];
  const transactions = TRANSACTIONS[activePortfolio.id] ?? [];
  const isDayGainPositive = summary.dayChangeValue >= 0;

  return (
    <div className="w-full space-y-8 text-left">
      <header className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-primary">
              Portfolio intelligence
            </p>
            <h1 className="mt-1 text-3xl font-bold text-text">{activePortfolio.name}</h1>
            <p className="mt-2 max-w-xl text-sm text-text-secondary">
              {activePortfolio.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2" onClick={() => undefined}>
              <Wallet className="h-4 w-4" />
              Connect wallet
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="primary" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share snapshot
            </Button>
          </div>
        </div>

        {MOCK_PORTFOLIOS.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">
              Portfolio
            </span>
            <div className="flex flex-wrap gap-2">
              {MOCK_PORTFOLIOS.map((portfolio) => (
                <Button
                  key={portfolio.id}
                  size="sm"
                  variant={portfolio.id === activePortfolioId ? 'primary' : 'outline'}
                  onClick={() => setActivePortfolioId(portfolio.id)}
                  className="whitespace-nowrap"
                >
                  {portfolio.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Alert className="border-border/60 bg-surface/70 text-text">
          <AlertDescription>
            Data shown here is simulated to illustrate the CryptoWebb portfolio experience. Connect a wallet or import
            fills when ready to transition this dashboard to live balances.
          </AlertDescription>
        </Alert>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border/60 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Total value</p>
              <p className="mt-3 text-3xl font-semibold text-text">
                {formatCurrency(summary.totalValue, activePortfolio.baseCurrency)}
              </p>
              <p className="mt-2 text-xs text-text-secondary">
                Updated {new Date(activePortfolio.lastUpdated).toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-5 text-sm text-text-secondary">
            Cost basis {formatCurrency(summary.totalCost, activePortfolio.baseCurrency)}
          </p>
        </Card>

        <Card className="border-border/60 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Daily change</p>
              <p
                className={`mt-3 text-3xl font-semibold ${
                  isDayGainPositive ? 'text-success' : 'text-error'
                }`}
              >
                {formatCurrency(summary.dayChangeValue, activePortfolio.baseCurrency)}
              </p>
              <p className="mt-2 text-xs text-text-secondary">
                {isDayGainPositive ? 'Gain' : 'Drawdown'} in the last 24 hours
              </p>
            </div>
            <div className={`rounded-2xl p-3 ${isDayGainPositive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
              {isDayGainPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            </div>
          </div>
        </Card>

        <Card className="border-border/60 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Total return</p>
              <p className="mt-3 text-3xl font-semibold text-text">
                {formatPercent(summary.totalReturnPct)}
              </p>
              <p className="mt-2 text-xs text-text-secondary">Unrealized performance relative to cost basis</p>
            </div>
            <div className="rounded-2xl bg-secondary/10 p-3 text-secondary">
              <PieChart className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-border/60 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Rebalancing window</p>
              <p className="mt-3 text-lg font-semibold text-text">Every 30 days</p>
              <p className="mt-2 text-xs text-text-secondary">Next review June 1st, 2024</p>
            </div>
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <CalendarDays className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="border-border/60 p-6 xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-text">Performance</h2>
              <p className="text-sm text-text-secondary">
                Track cumulative returns for the selected timeframe.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {TIMEFRAMES.map((frame) => (
                <Button
                  key={frame}
                  size="sm"
                  variant={timeframe === frame ? 'primary' : 'outline'}
                  onClick={() => setTimeframe(frame)}
                  className="whitespace-nowrap"
                >
                  {frame}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Sparkline points={performancePoints} positive={summary.totalReturnPct >= 0} />
          </div>
        </Card>

        <Card className="border-border/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text">Allocation</h2>
              <p className="text-sm text-text-secondary">Relative weighting across the active portfolio.</p>
            </div>
            <div className="rounded-2xl bg-secondary/10 p-3 text-secondary">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <AllocationList holdings={activePortfolio.holdings} currency={activePortfolio.baseCurrency} />
          </div>
        </Card>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text">Holdings</h2>
            <p className="text-sm text-text-secondary">
              Snapshot of each component with mark-to-market valuation and unrealized impact.
            </p>
          </div>
          <Button variant="outline" size="sm">
            Export holdings
          </Button>
        </div>

        <HoldingsTable holdings={activePortfolio.holdings} currency={activePortfolio.baseCurrency} />
      </section>

      <TransactionsList transactions={transactions} currency={activePortfolio.baseCurrency} />
    </div>
  );
};

export default PortfolioTracker;
