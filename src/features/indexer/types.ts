// Indexer API Types

// Generic API Response wrapper
export interface APIResponse<T> {
  data: T;
  error?: string;
}

// Token Types
export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  total_supply?: string;
  price_usd?: number;
  price_eth?: number;
}

export interface TokenStats {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  total_supply?: string;
  holder_count: number;
  transfer_count: number;
  swap_count_24h: number;
  volume_24h_usd: number;
  price_usd: number;
  price_eth: number;
  market_cap_usd: number;
  liquidity_usd: number;
  first_seen_block: number;
  first_seen_timestamp: number;
}

export interface TopToken {
  address: string;
  symbol: string;
  name: string;
  transfer_count: number;
  price_usd?: number;
  volume_24h_usd?: number;
}

export interface NewToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  pair_address: string;
  paired_with: string;
  dex: string;
  initial_liquidity_eth: number;
  initial_liquidity_usd: number;
  block_number: number;
  transaction_hash: string;
  timestamp: number;
  creator?: string;
}

// Portfolio Types
export interface Portfolio {
  address: string;
  eth_balance: string;
  eth_balance_formatted: number;
  eth_value_usd: number;
  tokens: PortfolioToken[];
  total_value_usd: number;
  token_count: number;
}

export interface PortfolioToken {
  token_address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balance_formatted: number;
  price_usd?: number;
  value_usd?: number;
}

// Transfer Types
export interface TokenTransfer {
  block_number: number;
  transaction_hash: string;
  log_index: number;
  token_address: string;
  from_address: string;
  to_address: string;
  value: string;
  timestamp?: number;
  token_symbol?: string;
  token_name?: string;
  value_usd?: number;
}

// P&L Types
export interface PnLSummary {
  address: string;
  total_realized_pnl: number;
  total_unrealized_pnl: number;
  total_pnl: number;
  portfolio_value: number;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  total_buy_volume: number;
  total_sell_volume: number;
  unique_tokens: number;
  roi_percent: number;
  smart_money_score: number;
  smart_money_tier: string;
}

export interface TokenPosition {
  token_address: string;
  symbol: string;
  name: string;
  balance: number;
  avg_cost_basis: number;
  current_price: number;
  current_value: number;
  unrealized_pnl: number;
  unrealized_pnl_pct: number;
  total_bought: number;
  total_sold: number;
}

// Indicator Types
export interface TokenIndicators {
  token_address: string;
  block_number: number;
  timestamp: number;
  current_price_usd: number;
  market_cap: number;
  realized_cap: number;
  mvrv_ratio: number;
  mvrv_z_score?: number;
  mvrv_signal: string;
  market_phase: string;
  supply_in_profit_pct: number;
  realized_price_usd: number;
  price_to_realized_ratio: number;
  buy_volume_24h: number;
  sell_volume_24h: number;
  buy_sell_ratio: number;
  acc_dist_signal: string;
  health_score: number;
}

// Whale & Exchange Flow Types
export interface WhaleTransfer {
  block_number: number;
  transaction_hash: string;
  token_address: string;
  token_symbol: string;
  from_address: string;
  to_address: string;
  value: string;
  value_usd: number;
  from_label?: string;
  to_label?: string;
  timestamp: number;
}

export interface ExchangeFlow {
  exchange: string;
  inflow_usd: number;
  outflow_usd: number;
  net_flow_usd: number;
  period: string;
}

// TVL Types
export interface ProtocolTVL {
  protocol: string;
  category: string;
  tvl_usd: number;
  tvl_eth: number;
  change_24h_pct: number;
  change_7d_pct: number;
  block_number: number;
  timestamp: number;
}

export interface PoolTVL {
  pool_address: string;
  protocol: string;
  token0: string;
  token1: string;
  token0_symbol: string;
  token1_symbol: string;
  reserve0: number;
  reserve1: number;
  tvl_usd: number;
  volume_24h_usd: number;
  fee_tier?: number;
  block_number: number;
  timestamp: number;
}

// DeFi Stats Types
export interface DefiStats {
  day: string;
  total_transfers: number;
  total_swaps: number;
  unique_active_addresses: number;
  total_volume_usd: number;
  total_tvl_usd: number;
  new_tokens_launched: number;
  whale_transactions: number;
  exchange_inflow_usd: number;
  exchange_outflow_usd: number;
}

// Status Types
export interface IndexerStatus {
  latest_block: number;
  indexed_block: number;
  log_count: number;
  transfer_count: number;
  swap_count: number;
}

export interface PriceData {
  eth_price: number;
  token_prices?: Record<string, number>;
}

// Query Parameters
export interface TokensParams {
  limit?: number;
}

export interface NewTokensParams {
  limit?: number;
  hours?: number;
}

export interface TransfersParams {
  limit?: number;
  offset?: number;
}

export interface TopTradersParams {
  limit?: number;
  order_by?: 'total_pnl' | 'roi_percent' | 'win_rate' | 'volume' | 'smart_money_score';
}

export interface IndicatorHistoryParams {
  limit?: number;
}

export interface ExchangeFlowsParams {
  hours?: number;
}

export interface DefiStatsHistoryParams {
  limit?: number;
}

export interface TokenHourlyStatsParams {
  hours?: number;
}

export interface LabelsParams {
  category?: string;
  limit?: number;
}

// Address Profile
export interface AddressProfile {
  address: string;
  eth_balance: string;
  eth_balance_formatted: number;
  total_value_usd: number;
  token_count: number;
  first_tx_block?: number;
  last_tx_block?: number;
  tx_count?: number;
  labels?: string[];
}

// Wallet Label
export interface WalletLabel {
  address: string;
  label: string;
  category: string;
}
