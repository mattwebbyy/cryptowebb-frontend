// Blockchain Analytics Types

export interface NewContract {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  priceUSD: number;
  priceETH: number;
  marketCap?: number;
  volume24h: number;
  pairCount: number;
  createdAt: string;
  age: string; // Human-readable age like "2h ago"
  liquidityUSD: number;
}

export interface TrendingToken {
  address: string;
  name: string;
  symbol: string;
  priceUSD: number;
  priceETH: number;
  marketCap?: number;
  volume24h: number;
  volume7d: number;
  volumeChange: number; // Percentage change
  priceChange24h: number; // Percentage change
  holders?: number;
  liquidityUSD: number;
  txCount24h: number;
  buyCount24h: number;
  sellCount24h: number;
}

export interface Token {
  id: string;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply?: number;
  priceUSD: number;
  priceETH: number;
  marketCap?: number;
  volume24h: number;
  volume7d: number;
  volumeAll: number;
}

export interface TradingPair {
  id: string;
  address: string;
  factoryID: string;
  token0ID: string;
  token1ID: string;
  reserve0: number;
  reserve1: number;
  reserveUSD: number;
  token0Price: number;
  token1Price: number;
  volumeToken0: number;
  volumeToken1: number;
  volumeUSD: number;
  feesUSD: number;
  createdAt: string;
  createdAtBlock: number;
  token0?: Token;
  token1?: Token;
}

export interface LiquidityPool {
  id: string;
  address: string;
  factoryID: string;
  token0ID: string;
  token1ID: string;
  fee: number;
  tickSpacing: number;
  liquidity: number;
  sqrtPrice: number;
  tick: number;
  volumeToken0: number;
  volumeToken1: number;
  volumeUSD: number;
  feesUSD: number;
  collectedFeesToken0: number;
  collectedFeesToken1: number;
  totalValueLockedToken0: number;
  totalValueLockedToken1: number;
  totalValueLockedUSD: number;
  apr24h?: number;
  apr7d?: number;
  createdAt: string;
  createdAtBlock: number;
  token0?: Token;
  token1?: Token;
}

export interface TokenDetails extends Token {
  pairs: TradingPair[];
  pools: LiquidityPool[];
  totalPairs: number;
  totalPools: number;
  totalLiquidity: number;
}

// API Response types
export interface NewContractsResponse {
  data: NewContract[];
  meta: {
    count: number;
    timeframe: string;
    limit: number;
  };
}

export interface TrendingTokensResponse {
  data: TrendingToken[];
  meta: {
    count: number;
    sortBy: string;
    limit: number;
  };
}

export interface TokenDetailsResponse {
  data: TokenDetails;
}

// Query parameters
export interface NewContractsParams {
  limit?: number; // Number of results (default 50, max 100)
  timeframe?: '1h' | '6h' | '12h' | '24h' | '7d'; // Default: 24h
}

export interface TrendingTokensParams {
  limit?: number; // Number of results (default 50, max 100)
  sortBy?: 'volume' | 'liquidity' | 'transactions' | 'marketCap' | 'momentum'; // Default: volume
}
