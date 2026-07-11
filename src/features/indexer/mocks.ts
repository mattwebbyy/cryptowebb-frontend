// src/features/indexer/mocks.ts — generated demo data for every indexer
// endpoint, used when the `mockData` flag is on (VITE_USE_MOCK_DATA or a
// runtime override). Deterministic (seeded PRNG) so the universe is stable
// across reloads, but time-relative fields tick like a live chain.
//
// Generators honor the same query params as the real API (hours, sort,
// min_usd, limit, …) so every filter in the UI stays functional.
import type {
  IndexerStatus,
  PriceData,
  TokenInfo,
  TokenStats,
  TopToken,
  NewToken,
  NewTokensParams,
  SearchResult,
  HolderInfo,
  SocialLinks,
  TokenTransfer,
  Portfolio,
  PortfolioToken,
  AddressProfile,
  LabeledAddress,
  LabelStats,
  WhaleTransfer,
  WhalesParams,
  ExchangeFlow,
  ExchangeFlowsParams,
  SmartMoneyWallet,
  SmartMoneyTier,
  MetricRow,
  NewTokenAlert,
  WhaleAlert,
} from './types';

/** Thrown for endpoints that are 503-stubbed in production, so demo mode
 *  shows the same "coming soon" states as the real backend. */
export class ComingSoonError extends Error {
  readonly comingSoon = true;
  constructor(endpoint: string) {
    super(`${endpoint} is being rebuilt upstream`);
    this.name = 'ComingSoonError';
  }
}

// ---- Seeded PRNG (mulberry32) ----

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hashStr = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const hexFrom = (rng: () => number, len: number): string => {
  let out = '';
  for (let i = 0; i < len; i++) out += Math.floor(rng() * 16).toString(16);
  return out;
};

const addr = (rng: () => number) => `0x${hexFrom(rng, 40)}`;
const txHash = (rng: () => number) => `0x${hexFrom(rng, 64)}`;
const pick = <T>(rng: () => number, arr: readonly T[]): T =>
  arr[Math.floor(rng() * arr.length)];

// ---- Chain clock ----

const GENESIS_BLOCK = 21_480_000;
const GENESIS_TS = 1_751_500_000; // fixed epoch anchor (2026-07-03)
const nowSec = () => Math.floor(Date.now() / 1000);
const currentBlock = () => GENESIS_BLOCK + Math.floor((nowSec() - GENESIS_TS) / 12);
const blockAt = (ts: number) => GENESIS_BLOCK + Math.floor((ts - GENESIS_TS) / 12);

// ---- Universe: majors, memecoins, labeled wallets, exchanges ----

const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
const ETH_USD = 3842.5;

interface UniverseToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  price_usd: number;
}

const MAJORS: UniverseToken[] = [
  { address: WETH, symbol: 'WETH', name: 'Wrapped Ether', decimals: 18, price_usd: ETH_USD },
  { address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', symbol: 'USDC', name: 'USD Coin', decimals: 6, price_usd: 1.0 },
  { address: '0xdac17f958d2ee523a2206206994597c13d831ec7', symbol: 'USDT', name: 'Tether USD', decimals: 6, price_usd: 1.0 },
  { address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', symbol: 'WBTC', name: 'Wrapped BTC', decimals: 8, price_usd: 98_450 },
  { address: '0x6982508145454ce325ddbe47a25d4ec3d2311933', symbol: 'PEPE', name: 'Pepe', decimals: 18, price_usd: 0.0000212 },
  { address: '0x514910771af9ca656af840dff83e8264ecf986ca', symbol: 'LINK', name: 'ChainLink Token', decimals: 18, price_usd: 24.85 },
  { address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', symbol: 'UNI', name: 'Uniswap', decimals: 18, price_usd: 13.4 },
  { address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0', symbol: 'MATIC', name: 'Polygon', decimals: 18, price_usd: 0.72 },
];

const MEME_PREFIX = ['MOON', 'TURBO', 'BASED', 'PEPE', 'WOJAK', 'GIGA', 'SHIB', 'DOGE', 'CHAD', 'FROG', 'APE', 'SIGMA', 'HYPER', 'MEGA', 'ULTRA', 'ZOOM'];
const MEME_SUFFIX = ['INU', 'AI', '2.0', 'X', 'CAT', 'COIN', 'ETH', 'FI', 'DAO', 'BOT', 'PUMP', 'ROCKET'];
const DEXES = ['uniswap_v2', 'uniswap_v3', 'uniswap_v4', 'curve', 'sushiswap'] as const;
const PAIRED = ['WETH', 'USDC', 'USDT'] as const;

const EXCHANGES: { name: string; address: string }[] = [
  { name: 'Binance 14', address: '0x28c6c06298d514db089934071355e5743bf21d60' },
  { name: 'Coinbase 10', address: '0xa9d1e08c7793af67e9d92fe308d5697fb81d3e43' },
  { name: 'Kraken 4', address: '0x267be1c1d684f78cb4f6a176c4911b741e4ffdc0' },
  { name: 'OKX', address: '0x6cc5f688a315f3dc28a7781717a9a798a59fda7b' },
  { name: 'Bybit', address: '0xf89d7b9c864f589bbf53a82105107622b35eaa40' },
];

const FUNDS = ['Wintermute', 'Jump Trading', 'a16z', 'Paradigm', 'GSR Markets', 'Alameda Remnant'];

// Deterministic universe built once per session.
const uniRng = mulberry32(0xc0ffee);

const memeTokens: UniverseToken[] = Array.from({ length: 60 }, () => {
  const symbol = `${pick(uniRng, MEME_PREFIX)}${pick(uniRng, MEME_SUFFIX)}`;
  return {
    address: addr(uniRng),
    symbol,
    name: symbol.charAt(0) + symbol.slice(1).toLowerCase(),
    decimals: 18,
    price_usd: Math.pow(10, -2 - uniRng() * 6) * (1 + uniRng() * 9),
  };
});

const ALL_TOKENS = [...MAJORS, ...memeTokens];

const labeledWallets: LabeledAddress[] = [
  ...EXCHANGES.map((e) => ({
    address: e.address,
    name: e.name,
    category: 'cex',
    subcategory: 'hot_wallet',
    tags: ['exchange'],
    source: 'curated',
    confidence: 0.99,
  })),
  ...FUNDS.map((name) => ({
    address: addr(uniRng),
    name,
    category: 'fund',
    subcategory: 'market_maker',
    tags: ['smart_money'],
    source: 'curated',
    confidence: 0.92,
  })),
];

const anonWallets: string[] = Array.from({ length: 40 }, () => addr(uniRng));

const tokenByAddress = (address: string): UniverseToken | undefined =>
  ALL_TOKENS.find((t) => t.address.toLowerCase() === address.toLowerCase());

const labelFor = (address: string): LabeledAddress | null =>
  labeledWallets.find((w) => w.address.toLowerCase() === address.toLowerCase()) ?? null;

// ---- Launches ----

/** Stable launch universe: ~200 pairs spread over the past 7 days.
 *  Regenerated lazily so ages stay current between calls. */
function buildLaunches(): NewToken[] {
  const rng = mulberry32(0xbeef);
  const now = nowSec();
  return Array.from({ length: 200 }, (_, i) => {
    const symbol = `${pick(rng, MEME_PREFIX)}${pick(rng, MEME_SUFFIX)}`;
    // Denser near "now": quadratic bias toward recent launches.
    const ageMin = Math.floor(Math.pow(rng(), 2) * 7 * 24 * 60) + Math.floor(rng() * 10);
    const createdAt = now - ageMin * 60;
    const hasStats = rng() > 0.25; // fresh launches legitimately lack stats
    const liquidity = hasStats ? Math.pow(10, 2.5 + rng() * 3.5) : null;
    const swaps = hasStats ? Math.floor(rng() * 900) + 3 : 0;
    const buys = Math.floor(swaps * (0.45 + rng() * 0.3));
    const price = hasStats ? Math.pow(10, -3 - rng() * 6) : null;
    const supply = 1e9 * (1 + Math.floor(rng() * 100));
    return {
      token_address: addr(rng),
      symbol,
      name: symbol.charAt(0) + symbol.slice(1).toLowerCase(),
      decimals: 18,
      pair_address: addr(rng),
      dex: pick(rng, DEXES),
      paired_with: pick(rng, PAIRED),
      created_at: createdAt,
      age_minutes: ageMin,
      block_number: blockAt(createdAt),
      swaps,
      buys,
      sells: swaps - buys,
      unique_buyers: Math.floor(buys * (0.5 + rng() * 0.4)),
      unique_sellers: Math.floor((swaps - buys) * (0.5 + rng() * 0.4)),
      volume_usd: hasStats && liquidity ? liquidity * (0.2 + rng() * 4) : null,
      holder_count: hasStats ? Math.floor(rng() * 800) + 5 : null,
      liquidity_usd: liquidity,
      price_usd: price,
      total_supply: supply,
      market_cap_usd: price ? price * supply : null,
      deployer: addr(rng),
      deployer_pct: rng() > 0.5 ? rng() * 0.6 : rng() * 0.1,
      deployer_contracts: Math.floor(rng() * 12),
      _seedIndex: i,
    } as NewToken & { _seedIndex: number };
  });
}

function mockNewTokens(params: NewTokensParams = {}): NewToken[] {
  const { limit = 100, hours = 24, sort = 'age', min_liquidity_usd } = params;
  const cutoffMin = hours * 60;
  let rows = buildLaunches().filter((t) => t.age_minutes <= cutoffMin);
  if (min_liquidity_usd) {
    rows = rows.filter((t) => (t.liquidity_usd ?? 0) >= min_liquidity_usd);
  }
  const key: Record<string, (t: NewToken) => number> = {
    age: (t) => -t.age_minutes,
    liquidity: (t) => t.liquidity_usd ?? 0,
    swaps: (t) => t.swaps,
    volume: (t) => t.volume_usd ?? 0,
    mcap: (t) => t.market_cap_usd ?? 0,
  };
  const k = key[sort] ?? key.age;
  rows.sort((a, b) => k(b) - k(a));
  return rows.slice(0, limit);
}

// ---- Whales & flows ----

function buildWhales(hours: number): WhaleTransfer[] {
  const rng = mulberry32(0xfeed);
  const now = nowSec();
  const count = Math.min(400, Math.max(40, hours * 12));
  return Array.from({ length: count }, () => {
    const token = pick(rng, ALL_TOKENS.slice(0, 12));
    const cexSide = rng();
    const exchange = pick(rng, EXCHANGES);
    const anon = pick(rng, anonWallets);
    const fund = pick(rng, labeledWallets.filter((w) => w.category === 'fund'));
    const isDeposit = cexSide < 0.35;
    const isWithdrawal = !isDeposit && cexSide < 0.6;
    const from = isDeposit ? (rng() > 0.4 ? anon : fund.address) : isWithdrawal ? exchange.address : anon;
    const to = isDeposit ? exchange.address : isWithdrawal ? (rng() > 0.4 ? anon : fund.address) : pick(rng, anonWallets);
    const ts = now - Math.floor(rng() * hours * 3600);
    return {
      block_number: blockAt(ts),
      transaction_hash: txHash(rng),
      token_address: token.address,
      token_symbol: token.symbol,
      from_address: from,
      to_address: to,
      from_label: labelFor(from)?.name ?? null,
      to_label: labelFor(to)?.name ?? null,
      from_category: labelFor(from)?.category ?? '',
      to_category: labelFor(to)?.category ?? '',
      value_usd: Math.pow(10, 5 + rng() * 2.3), // $100K … ~$20M
      is_exchange_deposit: isDeposit,
      is_exchange_withdrawal: isWithdrawal,
    };
  }).sort((a, b) => b.block_number - a.block_number);
}

function mockWhales(params: WhalesParams = {}): WhaleTransfer[] {
  const { hours = 24, min_usd = 100_000, limit = 100 } = params;
  return buildWhales(hours)
    .filter((w) => w.value_usd >= min_usd)
    .slice(0, limit);
}

function mockExchangeFlows(params: ExchangeFlowsParams = {}): ExchangeFlow[] {
  const rng = mulberry32(0xf10e ^ (params.hours ?? 24));
  const rows: ExchangeFlow[] = [];
  for (const ex of EXCHANGES) {
    for (const token of ALL_TOKENS.slice(0, 6)) {
      const deposit = Math.pow(10, 5 + rng() * 2.2);
      const withdrawal = Math.pow(10, 5 + rng() * 2.2);
      rows.push({
        exchange: ex.name,
        token_address: token.address,
        token_symbol: token.symbol,
        deposit_usd: deposit,
        withdrawal_usd: withdrawal,
        net_flow_usd: deposit - withdrawal,
        tx_count: Math.floor(rng() * 400) + 10,
      });
    }
  }
  let out = rows;
  if (params.exchange) {
    out = out.filter((r) => r.exchange.toLowerCase().includes(params.exchange!.toLowerCase()));
  }
  if (params.token) {
    out = out.filter((r) => r.token_symbol.toLowerCase() === params.token!.toLowerCase());
  }
  return out;
}

// ---- Smart money ----

function mockSmartMoney(limit = 100): SmartMoneyWallet[] {
  const rng = mulberry32(0x5a5a);
  const rows = Array.from({ length: 60 }, (_, i) => {
    const score = 95 - i * 1.2 - rng() * 3;
    const tier: SmartMoneyTier = score > 75 ? 'whale' : score > 50 ? 'serious' : 'active';
    const trades = Math.floor(rng() * 900) + 40;
    const winRate = 0.45 + rng() * 0.4;
    const fund = rng() > 0.75 ? pick(rng, FUNDS) : null;
    return {
      address: fund
        ? labeledWallets.find((w) => w.name === fund)?.address ?? addr(rng)
        : pick(rng, anonWallets),
      label: fund,
      total_trades: trades,
      winning_trades: Math.floor(trades * winRate),
      win_rate: winRate,
      total_pnl_usd: Math.pow(10, 4.5 + rng() * 2.5) * (rng() > 0.12 ? 1 : -1),
      avg_trade_size_usd: Math.pow(10, 3.5 + rng() * 1.8),
      score,
      tier,
    };
  });
  return rows.slice(0, limit);
}

// ---- Per-token / per-address ----

function mockTokenStats(address: string): TokenStats {
  const known = tokenByAddress(address);
  const rng = mulberry32(hashStr(address));
  const price = known?.price_usd ?? Math.pow(10, -2 - rng() * 6);
  const supply = known ? 1e8 : 1e9 * (1 + Math.floor(rng() * 50));
  const firstSeenTs = GENESIS_TS - Math.floor(rng() * 3600 * 24 * 400);
  return {
    address,
    name: known?.name ?? 'Demo Token',
    symbol: known?.symbol ?? `DEMO${Math.floor(rng() * 99)}`,
    decimals: known?.decimals ?? 18,
    total_supply: supply,
    holder_count: Math.floor(rng() * 50_000) + 100,
    transfer_count: Math.floor(rng() * 2_000_000) + 1000,
    swap_count_24h: Math.floor(rng() * 20_000),
    volume_24h_usd: price * supply * rng() * 0.05,
    price_usd: price,
    price_eth: price / ETH_USD,
    market_cap_usd: price * supply,
    liquidity_usd: price * supply * (0.005 + rng() * 0.05),
    first_seen_block: blockAt(firstSeenTs),
    first_seen_timestamp: firstSeenTs,
    prices_as_of: nowSec() - 30,
  };
}

function mockTokenInfo(address: string): TokenInfo {
  const s = mockTokenStats(address);
  return {
    address,
    name: s.name,
    symbol: s.symbol,
    decimals: s.decimals,
    price_usd: s.price_usd,
    prices_as_of: s.prices_as_of,
    transfer_count: s.transfer_count,
  };
}

function mockHolders(address: string, limit = 100): HolderInfo[] {
  const rng = mulberry32(hashStr(address) ^ 0x401d);
  return Array.from({ length: Math.min(limit, 100) }, (_, i) => ({
    address: i < 3 ? EXCHANGES[i].address : pick(rng, anonWallets),
    // Zipf-ish distribution, raw base units (18 decimals)
    balance: BigInt(Math.floor((1e9 / (i + 1)) * (0.6 + rng() * 0.8)) || 1)
      .toString()
      .concat('000000000000000000'),
  }));
}

function mockTransfers(token: string, limit = 50): TokenTransfer[] {
  const rng = mulberry32(hashStr(token) ^ 0x7a5f);
  const now = nowSec();
  return Array.from({ length: Math.min(limit, 100) }, (_, i) => {
    const ts = now - i * Math.floor(60 + rng() * 900);
    return {
      block_number: blockAt(ts),
      tx_hash: txHash(rng),
      token,
      from: pick(rng, anonWallets),
      to: rng() > 0.8 ? pick(rng, EXCHANGES).address : pick(rng, anonWallets),
      value: BigInt(Math.floor(rng() * 1e6) + 1).toString().concat('000000000000000000'),
    };
  });
}

function mockAddressTransfers(address: string, limit = 50): TokenTransfer[] {
  const rng = mulberry32(hashStr(address) ^ 0x0add);
  const now = nowSec();
  return Array.from({ length: Math.min(limit, 100) }, (_, i) => {
    const token = pick(rng, ALL_TOKENS.slice(0, 10));
    const incoming = rng() > 0.5;
    const ts = now - i * Math.floor(300 + rng() * 3600);
    return {
      block_number: blockAt(ts),
      tx_hash: txHash(rng),
      token: token.address,
      from: incoming ? pick(rng, anonWallets) : address,
      to: incoming ? address : pick(rng, anonWallets),
      value: BigInt(Math.floor(rng() * 1e5) + 1).toString().concat('000000000000000000'),
    };
  });
}

function mockPortfolio(address: string): Portfolio {
  const rng = mulberry32(hashStr(address) ^ 0xf0f0);
  const ethBalance = rng() * 120;
  const tokens: PortfolioToken[] = ALL_TOKENS.slice(1, 2 + Math.floor(rng() * 8)).map((t) => {
    const balance = rng() * 1e6;
    return {
      token_address: t.address,
      symbol: t.symbol,
      name: t.name,
      decimals: t.decimals,
      balance: BigInt(Math.floor(balance * 10 ** Math.min(t.decimals, 9))).toString(),
      balance_formatted: balance,
      price_usd: t.price_usd,
      value_usd: balance * t.price_usd,
    };
  });
  const tokensValue = tokens.reduce((sum, t) => sum + (t.value_usd ?? 0), 0);
  return {
    address,
    eth_balance: BigInt(Math.floor(ethBalance * 1e9)).toString().concat('000000000'),
    eth_balance_formatted: ethBalance,
    eth_value_usd: ethBalance * ETH_USD,
    tokens,
    total_value_usd: ethBalance * ETH_USD + tokensValue,
    token_count: tokens.length,
    prices_as_of: nowSec() - 30,
  };
}

function mockAddressProfile(address: string): AddressProfile {
  const rng = mulberry32(hashStr(address) ^ 0x9906);
  const ethBalance = rng() * 400;
  return {
    address,
    label: labelFor(address),
    eth_balance: ethBalance,
    eth_value_usd: ethBalance * ETH_USD,
    first_seen_block: GENESIS_BLOCK - Math.floor(rng() * 4_000_000),
    last_active_block: currentBlock() - Math.floor(rng() * 2000),
    total_transfers_in: Math.floor(rng() * 8000),
    total_transfers_out: Math.floor(rng() * 8000),
    total_swaps: 0, // placeholder upstream too — UI hides it
    unique_tokens: 0,
    total_usd_volume: Math.pow(10, 5 + rng() * 3),
    is_contract: rng() > 0.85,
  };
}

function mockMetric(metric: string, days = 30): MetricRow[] {
  const rng = mulberry32(hashStr(metric));
  const base = Math.pow(10, 3 + rng() * 6);
  const out: MetricRow[] = [];
  let value = base;
  for (let i = days - 1; i >= 0; i--) {
    value *= 0.97 + rng() * 0.07;
    const day = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
    out.push({ asset: 'ETH', day, value });
  }
  return out;
}

// ---- Stream events (live feed simulation) ----

let streamSeq = 0;

export function nextMockNewTokenAlert(): NewTokenAlert {
  const rng = mulberry32(0xa1e7 ^ streamSeq++ ^ Date.now());
  const symbol = `${pick(rng, MEME_PREFIX)}${pick(rng, MEME_SUFFIX)}`;
  return {
    token_address: addr(rng),
    symbol,
    name: symbol.charAt(0) + symbol.slice(1).toLowerCase(),
    pair_address: addr(rng),
    paired_with: pick(rng, PAIRED),
    initial_liquidity_usd: rng() > 0.3 ? Math.pow(10, 3 + rng() * 2.5) : 0,
    risk_score: Math.floor(rng() * 100),
    risk_level: pick(rng, ['low', 'medium', 'high'] as const),
    dex: pick(rng, DEXES),
    block_number: currentBlock(),
    transaction_hash: txHash(rng),
    timestamp: nowSec(),
  };
}

export function nextMockWhaleAlert(): WhaleAlert {
  const rng = mulberry32(0x3a1e ^ streamSeq++ ^ Date.now());
  const token = pick(rng, ALL_TOKENS.slice(0, 8));
  return {
    token_address: token.address,
    symbol: token.symbol,
    from_address: pick(rng, anonWallets),
    to_address: rng() > 0.5 ? pick(rng, EXCHANGES).address : pick(rng, anonWallets),
    value: BigInt(Math.floor(rng() * 1e6) + 1).toString().concat('000000000000000000'),
    value_usd: Math.pow(10, 5 + rng() * 2),
    block_number: currentBlock(),
    transaction_hash: txHash(rng),
    alert_type: 'transfer',
  };
}

// ---- Endpoint resolver ----

type Params = Record<string, unknown> | undefined;

const STUBBED_PREFIXES = ['/pnl', '/indicators', '/tvl', '/stats'];

/**
 * Resolve a mock response for an indexer endpoint. Mirrors the backend proxy
 * routes; throws ComingSoonError for endpoints stubbed upstream so demo mode
 * behaves exactly like production.
 */
export function resolveIndexerMock(endpoint: string, params?: object): unknown {
  const p = (params ?? {}) as Params & {
    limit?: number;
    hours?: number;
    q?: string;
    days?: number;
    category?: string;
  };

  if (STUBBED_PREFIXES.some((s) => endpoint.startsWith(s))) {
    throw new ComingSoonError(endpoint);
  }

  if (endpoint === '/status') {
    return {
      latest_indexed_block: currentBlock() - 45,
      latest_chain_block: currentBlock(),
      blocks_behind: 45,
      logs_count: 2_845_120_334,
      transfers_count: 1_204_551_902,
      swaps_count: 312_400_118,
      is_syncing: true,
    } satisfies IndexerStatus;
  }

  if (endpoint === '/prices') {
    return {
      eth_usd: ETH_USD,
      as_of: nowSec() - 20,
      all: ALL_TOKENS.map((t) => ({ address: t.address, price_usd: t.price_usd })),
    } satisfies PriceData;
  }

  if (endpoint === '/tokens/top') {
    const rng = mulberry32(0x707);
    return ALL_TOKENS.slice(0, p.limit ?? 50).map(
      (t): TopToken => ({ address: t.address, transfer_count: Math.floor(rng() * 5e6) + 1e4 })
    );
  }

  if (endpoint === '/tokens/new') return mockNewTokens(p as NewTokensParams);

  if (endpoint === '/tokens/search') {
    const q = (p.q ?? '').toString().toLowerCase();
    return ALL_TOKENS.filter(
      (t) => t.symbol.toLowerCase().includes(q) || t.name.toLowerCase().includes(q)
    )
      .slice(0, p.limit ?? 20)
      .map(
        (t): SearchResult => ({
          address: t.address,
          name: t.name,
          symbol: t.symbol,
          decimals: t.decimals,
        })
      );
  }

  let m = endpoint.match(/^\/token\/([^/]+)(?:\/(\w+))?$/);
  if (m) {
    const [, address, sub] = m;
    switch (sub) {
      case undefined:
        return mockTokenInfo(address);
      case 'stats':
        return mockTokenStats(address);
      case 'holders':
        return mockHolders(address, p.limit);
      case 'transfers':
        return mockTransfers(address, p.limit);
      case 'socials':
        return {
          telegram: null,
          twitter: 'https://x.com/cryptowebb',
          website: 'https://cryptowebb.com',
          github: null,
          discord: null,
        } satisfies SocialLinks;
    }
  }

  m = endpoint.match(/^\/portfolio\/([^/]+)$/);
  if (m) return mockPortfolio(m[1]);

  m = endpoint.match(/^\/address\/([^/]+)\/(transfers|profile)$/);
  if (m) {
    return m[2] === 'profile' ? mockAddressProfile(m[1]) : mockAddressTransfers(m[1], p.limit);
  }

  if (endpoint === '/labels') {
    let rows = labeledWallets;
    if (p.category) rows = rows.filter((w) => w.category === p.category);
    return rows.slice(0, p.limit ?? 100);
  }
  if (endpoint === '/labels/stats') {
    const byCat: Record<string, number> = {};
    for (const w of labeledWallets) byCat[w.category] = (byCat[w.category] ?? 0) + 1;
    return { total_labels: labeledWallets.length, by_category: byCat } satisfies LabelStats;
  }
  m = endpoint.match(/^\/labels\/([^/]+)$/);
  if (m && m[1] !== 'stats') return labelFor(m[1]);

  if (endpoint === '/exchanges') return EXCHANGES.map((e) => e.name);
  if (endpoint === '/whales') return mockWhales(p as WhalesParams);
  if (endpoint === '/exchange-flows') return mockExchangeFlows(p as ExchangeFlowsParams);
  if (endpoint === '/smart-money') return mockSmartMoney(p.limit);
  if (endpoint === '/transfers/recent') return mockTransfers(WETH, p.limit ?? 50);

  m = endpoint.match(/^\/metrics\/([^/]+)$/);
  if (m) return mockMetric(m[1], p.days);

  if (endpoint === '/health') return { status: 'ok' };

  // Unknown endpoint in mock mode — treat like an upstream stub.
  throw new ComingSoonError(endpoint);
}

/** Small realistic latency so loading states remain visible in demos. */
export const mockLatency = () => new Promise((r) => setTimeout(r, 120 + Math.random() * 280));
