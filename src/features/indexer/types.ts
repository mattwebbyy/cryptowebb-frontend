// Indexer API types — mirror the Go backend's proxy responses
// (internal/services/indexer/client.go), which in turn mirror the live
// blockchain-indexer wire format. Nullable upstream fields are `| null`:
// fresh launches and un-backfilled ranges legitimately lack values.

// Backend proxy wraps every payload as { data: T }
export interface APIResponse<T> {
  data: T;
  error?: string;
}

// ---- Status & Prices ----

export interface IndexerStatus {
  latest_indexed_block: number;
  latest_chain_block: number;
  blocks_behind: number;
  logs_count: number;
  transfers_count: number;
  swaps_count: number;
  is_syncing: boolean;
}

export interface TokenPrice {
  address: string;
  price_usd: number;
}

export interface PriceData {
  eth_usd: number;
  as_of: number | null;
  all: TokenPrice[];
}

// ---- Tokens ----

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  price_usd?: number | null;
  prices_as_of?: number | null;
  transfer_count: number;
}

export interface TokenStats {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  total_supply: number | null;
  holder_count: number;
  transfer_count: number;
  swap_count_24h: number;
  volume_24h_usd: number;
  price_usd: number | null;
  price_eth: number | null;
  market_cap_usd: number | null;
  liquidity_usd: number | null;
  first_seen_block: number;
  first_seen_timestamp: number;
  prices_as_of: number | null;
}

export interface TopToken {
  address: string;
  transfer_count: number;
}

/** Launch-feed row from /tokens/new */
export interface NewToken {
  token_address: string;
  symbol: string;
  name: string;
  decimals: number;
  pair_address: string;
  dex: string;
  paired_with: string;
  created_at: number;
  age_minutes: number;
  block_number: number;
  swaps: number;
  buys: number;
  sells: number;
  unique_buyers: number;
  unique_sellers: number;
  volume_usd: number | null;
  holder_count: number | null;
  liquidity_usd: number | null;
  price_usd: number | null;
  total_supply: number | null;
  market_cap_usd: number | null;
  deployer: string | null;
  deployer_pct: number | null;
  deployer_contracts: number | null;
}

export interface SearchResult {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

export interface HolderInfo {
  address: string;
  balance: string;
}

export interface SocialLinks {
  telegram: string | null;
  twitter: string | null;
  website: string | null;
  github: string | null;
  discord: string | null;
}

// ---- Transfers ----

export interface TokenTransfer {
  block_number: number;
  tx_hash: string;
  token: string;
  from: string;
  to: string;
  value: string;
}

// ---- Portfolio & Address ----

export interface Portfolio {
  address: string;
  eth_balance: string;
  eth_balance_formatted: number;
  eth_value_usd: number;
  tokens: PortfolioToken[];
  total_value_usd: number;
  token_count: number;
  prices_as_of: number | null;
}

export interface PortfolioToken {
  token_address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balance_formatted: number;
  price_usd?: number | null;
  value_usd?: number | null;
}

export interface AddressProfile {
  address: string;
  label: LabeledAddress | null;
  eth_balance: number;
  eth_value_usd: number;
  first_seen_block: number | null;
  last_active_block: number | null;
  total_transfers_in: number;
  total_transfers_out: number;
  /** Placeholder upstream (always 0) until indexer Phase 4/5 — hide in UI */
  total_swaps: number;
  unique_tokens: number;
  total_usd_volume: number;
  is_contract: boolean;
}

// ---- Labels ----

export interface LabeledAddress {
  address: string;
  name: string;
  category: string;
  subcategory: string | null;
  tags: string[];
  source: string;
  confidence: number;
}

export interface LabelStats {
  total_labels: number;
  by_category: Record<string, number>;
}

// ---- Whales, Flows & Smart Money ----

export interface WhaleTransfer {
  block_number: number;
  transaction_hash: string;
  token_address: string;
  token_symbol: string;
  from_address: string;
  to_address: string;
  from_label: string | null;
  to_label: string | null;
  from_category: string;
  to_category: string;
  value_usd: number;
  is_exchange_deposit: boolean;
  is_exchange_withdrawal: boolean;
}

export interface ExchangeFlow {
  exchange: string;
  token_address: string;
  token_symbol: string;
  deposit_usd: number;
  withdrawal_usd: number;
  net_flow_usd: number;
  tx_count: number;
}

export type SmartMoneyTier = 'whale' | 'serious' | 'active';

export interface SmartMoneyWallet {
  address: string;
  label: string | null;
  total_trades: number;
  winning_trades: number;
  win_rate: number;
  total_pnl_usd: number;
  avg_trade_size_usd: number;
  score: number;
  tier: SmartMoneyTier;
}

// ---- Macro metrics ----

export interface MetricRow {
  asset: string;
  day: string;
  value: number;
}

// ---- WS feed events (relayed by the backend hub) ----

/** {"type":"new_token"} hub message payload */
export interface NewTokenAlert {
  token_address: string;
  symbol: string;
  name: string;
  pair_address: string;
  paired_with: string;
  initial_liquidity_usd: number;
  risk_score: number;
  risk_level: string;
  dex: string;
  block_number: number;
  transaction_hash: string;
  timestamp: number;
}

/** {"type":"whale_alert"} hub message payload (authenticated clients only) */
export interface WhaleAlert {
  token_address: string;
  symbol: string;
  from_address: string;
  to_address: string;
  value: string;
  value_usd: number;
  block_number: number;
  transaction_hash: string;
  alert_type: 'transfer' | 'swap' | 'liquidity_add' | 'liquidity_remove';
}

// ---- Upstream-stubbed shapes (P&L / indicators / TVL / DeFi stats) ----
// These endpoints currently return 503 from our backend ("coming soon").

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

// ---- Query Parameters ----

export interface TokensParams {
  limit?: number;
}

export type NewTokensSort = 'age' | 'liquidity' | 'swaps' | 'volume' | 'mcap';

export interface NewTokensParams {
  limit?: number;
  hours?: number;
  sort?: NewTokensSort;
  min_liquidity_usd?: number;
}

export interface TransfersParams {
  limit?: number;
  offset?: number;
}

export interface WhalesParams {
  hours?: number;
  min_usd?: number;
  limit?: number;
}

export interface ExchangeFlowsParams {
  hours?: number;
  exchange?: string;
  token?: string;
}

export interface MetricParams {
  asset?: string;
  days?: number;
}

export interface TopTradersParams {
  limit?: number;
  order_by?: 'total_pnl' | 'roi_percent' | 'win_rate' | 'volume' | 'smart_money_score';
}

export interface IndicatorHistoryParams {
  limit?: number;
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
