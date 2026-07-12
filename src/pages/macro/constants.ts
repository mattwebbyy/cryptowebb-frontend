// Selector values for the macro metrics dashboard. Exchange slugs were
// verified against the live indexer (`/metrics/exchange_netflow?asset=<slug>:ETH`).
export const EXCHANGES = [
  { label: 'Binance', value: 'binance' },
  { label: 'Coinbase', value: 'coinbase' },
  { label: 'Kraken', value: 'kraken' },
  { label: 'OKX', value: 'okx' },
  { label: 'Bybit', value: 'bybit' },
  { label: 'KuCoin', value: 'kucoin' },
  { label: 'Gemini', value: 'gemini' },
  { label: 'Bitfinex', value: 'bitfinex' },
] as const;

export const ASSETS = ['ETH', 'WETH', 'USDT', 'USDC', 'DAI'] as const;

export const RANGES = [
  { label: '30d', value: 30 },
  { label: '90d', value: 90 },
  { label: '180d', value: 180 },
  { label: '1y', value: 365 },
] as const;

export type MacroMetric = 'exchange_netflow' | 'exchange_reserve_delta';

export const METRICS: {
  value: MacroMetric;
  label: string;
  description: string;
}[] = [
  {
    value: 'exchange_netflow',
    label: 'Exchange netflow',
    description:
      'Daily net token flow into an exchange. Positive = net deposits (potential sell pressure), negative = net withdrawals.',
  },
  {
    value: 'exchange_reserve_delta',
    label: 'Reserve delta',
    description: 'Daily change in the tokens an exchange holds on-chain.',
  },
];
