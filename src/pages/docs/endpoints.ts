// src/pages/docs/endpoints.ts — API documentation data (types + endpoint catalogue).
// Types for API Documentation
export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  category: string;
  auth: 'none' | 'jwt' | 'apikey' | 'admin';
  parameters?: ApiParameter[];
  queryParams?: ApiParameter[];
  requestBody?: ApiRequestBody;
  responses: ApiResponse[];
  examples: ApiExample[];
}

export interface ApiParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

// Documentation payloads are illustrative JSON blobs rendered with
// JSON.stringify — they have no useful static shape beyond "JSON".
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface ApiRequestBody {
  contentType: string;
  schema: JsonValue;
  example: JsonValue;
}

export interface ApiResponse {
  status: number;
  description: string;
  schema?: JsonValue;
  example?: JsonValue;
}

export interface ApiExample {
  title: string;
  request: {
    url: string;
    method: string;
    headers?: Record<string, string>;
    body?: JsonValue;
  };
  response: {
    status: number;
    body: JsonValue;
  };
}

// API Documentation Data
export const API_ENDPOINTS: ApiEndpoint[] = [
  // Data & Charts
  {
    id: 'list-metrics',
    method: 'GET',
    path: '/api/v1/data/metrics',
    description: 'List all available cryptocurrency metrics',
    category: 'Data & Charts',
    auth: 'none',
    queryParams: [
      {
        name: 'limit',
        type: 'integer',
        required: false,
        description: 'Maximum number of metrics to return',
        example: '50',
      },
      {
        name: 'offset',
        type: 'integer',
        required: false,
        description: 'Number of metrics to skip',
        example: '0',
      },
    ],
    responses: [
      {
        status: 200,
        description: 'List of available metrics',
        example: {
          metrics: [
            { id: 1, name: 'bitcoin-price', symbol: 'BTC', description: 'Bitcoin USD Price' },
            { id: 2, name: 'ethereum-price', symbol: 'ETH', description: 'Ethereum USD Price' },
          ],
        },
      },
    ],
    examples: [
      {
        title: 'Get all metrics',
        request: { url: '/api/v1/data/metrics', method: 'GET' },
        response: {
          status: 200,
          body: { metrics: [{ id: 1, name: 'bitcoin-price', symbol: 'BTC' }] },
        },
      },
    ],
  },
  {
    id: 'get-metric-info',
    method: 'GET',
    path: '/api/v1/data/metrics/:metric_id/info',
    description: 'Get detailed information about a specific metric',
    category: 'Data & Charts',
    auth: 'none',
    parameters: [
      {
        name: 'metric_id',
        type: 'integer',
        required: true,
        description: 'Unique identifier for the metric',
        example: '1',
      },
    ],
    responses: [
      {
        status: 200,
        description: 'Metric information',
        example: {
          id: 1,
          name: 'bitcoin-price',
          symbol: 'BTC',
          description: 'Bitcoin USD Price',
          unit: 'USD',
          category: 'Price',
          lastUpdated: '2024-01-15T10:30:00Z',
        },
      },
    ],
    examples: [
      {
        title: 'Get Bitcoin price metric info',
        request: { url: '/api/v1/data/metrics/1/info', method: 'GET' },
        response: { status: 200, body: { id: 1, name: 'bitcoin-price', symbol: 'BTC' } },
      },
    ],
  },
  {
    id: 'get-timeseries-data',
    method: 'GET',
    path: '/api/v1/data/metrics/:metric_id/timeseries',
    description: 'Get time-series data for chart visualization',
    category: 'Data & Charts',
    auth: 'none',
    parameters: [
      {
        name: 'metric_id',
        type: 'integer',
        required: true,
        description: 'Unique identifier for the metric',
        example: '1',
      },
    ],
    queryParams: [
      {
        name: 'granularity',
        type: 'string',
        required: true,
        description: 'Time granularity (1m, 5m, 1h, 1d)',
        example: '1d',
      },
      {
        name: 'start_time',
        type: 'string',
        required: false,
        description: 'Start time (Unix timestamp or RFC3339)',
        example: '1704067200',
      },
      {
        name: 'end_time',
        type: 'string',
        required: false,
        description: 'End time (Unix timestamp or RFC3339)',
        example: '1704153600',
      },
      {
        name: 'limit',
        type: 'integer',
        required: false,
        description: 'Maximum number of data points',
        example: '1000',
      },
      {
        name: 'offset',
        type: 'integer',
        required: false,
        description: 'Number of data points to skip',
        example: '0',
      },
    ],
    responses: [
      {
        status: 200,
        description: 'Time-series data points',
        example: {
          data: [
            { timestamp: '2024-01-15T00:00:00Z', value: 42000.5 },
            { timestamp: '2024-01-16T00:00:00Z', value: 43250.75 },
          ],
        },
      },
    ],
    examples: [
      {
        title: 'Get Bitcoin daily prices',
        request: {
          url: '/api/v1/data/metrics/1/timeseries?granularity=1d&limit=30',
          method: 'GET',
        },
        response: {
          status: 200,
          body: { data: [{ timestamp: '2024-01-15T00:00:00Z', value: 42000.5 }] },
        },
      },
    ],
  },

  // Technical Indicators
  {
    id: 'get-sma',
    method: 'GET',
    path: '/api/v1/indicators/sma/:metricID',
    description: 'Calculate Simple Moving Average for a metric',
    category: 'Technical Indicators',
    auth: 'none',
    parameters: [
      {
        name: 'metricID',
        type: 'integer',
        required: true,
        description: 'Metric ID to calculate SMA for',
        example: '1',
      },
    ],
    queryParams: [
      {
        name: 'period',
        type: 'integer',
        required: false,
        description: 'Moving average period',
        example: '20',
      },
      {
        name: 'granularity',
        type: 'string',
        required: false,
        description: 'Time granularity',
        example: '1d',
      },
      {
        name: 'start_time',
        type: 'string',
        required: false,
        description: 'Start time',
        example: '2024-01-01T00:00:00Z',
      },
      {
        name: 'end_time',
        type: 'string',
        required: false,
        description: 'End time',
        example: '2024-01-31T00:00:00Z',
      },
    ],
    responses: [
      {
        status: 200,
        description: 'SMA calculation results',
        example: {
          indicator: 'SMA',
          metricID: 1,
          period: 20,
          data: [
            { timestamp: '2024-01-15T00:00:00Z', value: 41500.25 },
            { timestamp: '2024-01-16T00:00:00Z', value: 41750.5 },
          ],
        },
      },
    ],
    examples: [
      {
        title: 'Get 20-day SMA for Bitcoin',
        request: { url: '/api/v1/indicators/sma/1?period=20&granularity=1d', method: 'GET' },
        response: { status: 200, body: { indicator: 'SMA', period: 20, data: [] } },
      },
    ],
  },
  {
    id: 'get-rsi',
    method: 'GET',
    path: '/api/v1/indicators/rsi/:metricID',
    description: 'Calculate Relative Strength Index (RSI)',
    category: 'Technical Indicators',
    auth: 'none',
    parameters: [
      {
        name: 'metricID',
        type: 'integer',
        required: true,
        description: 'Metric ID to calculate RSI for',
        example: '1',
      },
    ],
    queryParams: [
      {
        name: 'period',
        type: 'integer',
        required: false,
        description: 'RSI period (default: 14)',
        example: '14',
      },
      {
        name: 'granularity',
        type: 'string',
        required: false,
        description: 'Time granularity',
        example: '1d',
      },
    ],
    responses: [
      {
        status: 200,
        description: 'RSI calculation results',
        example: {
          indicator: 'RSI',
          metricID: 1,
          period: 14,
          data: [
            { timestamp: '2024-01-15T00:00:00Z', value: 65.4 },
            { timestamp: '2024-01-16T00:00:00Z', value: 67.2 },
          ],
        },
      },
    ],
    examples: [
      {
        title: 'Get 14-day RSI for Bitcoin',
        request: { url: '/api/v1/indicators/rsi/1?period=14', method: 'GET' },
        response: { status: 200, body: { indicator: 'RSI', period: 14, data: [] } },
      },
    ],
  },

  // Authentication
  {
    id: 'user-login',
    method: 'POST',
    path: '/api/v1/auth/login',
    description: 'Authenticate user and receive JWT token',
    category: 'Authentication',
    auth: 'none',
    requestBody: {
      contentType: 'application/json',
      schema: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
        required: ['email', 'password'],
      },
      example: {
        email: 'user@example.com',
        password: 'securepassword123',
      },
    },
    responses: [
      {
        status: 200,
        description: 'Login successful',
        example: {
          message: 'Login successful',
          user: { id: 1, email: 'user@example.com', role: 'user' },
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'refresh_token_here',
        },
      },
      {
        status: 401,
        description: 'Invalid credentials',
        example: { error: 'Invalid email or password' },
      },
    ],
    examples: [
      {
        title: 'User login',
        request: {
          url: '/api/v1/auth/login',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: { email: 'user@example.com', password: 'password123' },
        },
        response: { status: 200, body: { message: 'Login successful', token: 'jwt_token_here' } },
      },
    ],
  },

  // User Profile
  {
    id: 'get-profile',
    method: 'GET',
    path: '/api/v1/users/me',
    description: 'Get current user profile information',
    category: 'User Management',
    auth: 'jwt',
    responses: [
      {
        status: 200,
        description: 'User profile data',
        example: {
          id: 1,
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          createdAt: '2024-01-01T00:00:00Z',
          subscription: {
            plan: 'pro',
            status: 'active',
            expiresAt: '2024-12-31T23:59:59Z',
          },
        },
      },
    ],
    examples: [
      {
        title: 'Get user profile',
        request: {
          url: '/api/v1/users/me',
          method: 'GET',
          headers: { Authorization: 'Bearer jwt_token_here' },
        },
        response: { status: 200, body: { id: 1, email: 'user@example.com', role: 'user' } },
      },
    ],
  },

  // ── Blockchain Intelligence (indexer-backed) ─────────────────────────────
  {
    id: 'indexer-new-tokens',
    method: 'GET',
    path: '/api/v1/indexer/tokens/new',
    description:
      'Token launch feed: every new DEX pair with liquidity, volume, holder counts and deployer risk signals. Fresh launches may return null for price/liquidity until their first swaps are indexed.',
    category: 'Blockchain Intelligence',
    auth: 'none',
    queryParams: [
      { name: 'limit', type: 'number', required: false, description: 'Max rows (≤100)', example: '50' },
      { name: 'hours', type: 'number', required: false, description: 'Lookback window (≤168)', example: '24' },
      { name: 'sort', type: 'string', required: false, description: 'age | liquidity | swaps | volume | mcap', example: 'liquidity' },
      { name: 'min_liquidity_usd', type: 'number', required: false, description: 'Liquidity floor in USD', example: '10000' },
    ],
    responses: [
      {
        status: 200,
        description: 'Array of launches',
        example: {
          data: [
            {
              token_address: '0xe76c…5de1',
              symbol: 'H',
              name: 'Humanity',
              dex: 'uniswap_v4',
              paired_with: 'USDC',
              age_minutes: 4,
              buys: 12,
              sells: 3,
              holder_count: 5517,
              liquidity_usd: 359455.96,
              price_usd: 0.059,
              market_cap_usd: 590116132.29,
              deployer_pct: 0.0,
            },
          ],
        },
      },
    ],
    examples: [
      {
        title: 'Newest launches with ≥$10K liquidity',
        request: { url: '/api/v1/indexer/tokens/new?sort=age&min_liquidity_usd=10000', method: 'GET' },
        response: { status: 200, body: { data: ['…'] } },
      },
    ],
  },
  {
    id: 'indexer-token-stats',
    method: 'GET',
    path: '/api/v1/indexer/token/:address/stats',
    description:
      'Full token statistics: supply, holders, transfer/swap counts, price, market cap and liquidity. Related: /token/:address/holders, /transfers, /socials.',
    category: 'Blockchain Intelligence',
    auth: 'none',
    parameters: [
      { name: 'address', type: 'string', required: true, description: 'Token contract address', example: '0xc02a…6cc2' },
    ],
    responses: [
      {
        status: 200,
        description: 'Token statistics',
        example: {
          data: {
            address: '0xc02a…6cc2',
            name: 'Wrapped Ether',
            symbol: 'WETH',
            holder_count: 306106,
            transfer_count: 34549393,
            price_usd: 3451.49,
            prices_as_of: 1719546480,
          },
        },
      },
    ],
    examples: [
      {
        title: 'WETH stats',
        request: { url: '/api/v1/indexer/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/stats', method: 'GET' },
        response: { status: 200, body: { data: { symbol: 'WETH' } } },
      },
    ],
  },
  {
    id: 'indexer-whales',
    method: 'GET',
    path: '/api/v1/indexer/whales',
    description:
      'Large transfers with wallet labels and CEX deposit/withdrawal classification. Account required.',
    category: 'Blockchain Intelligence',
    auth: 'jwt',
    queryParams: [
      { name: 'hours', type: 'number', required: false, description: 'Lookback window (≤168)', example: '24' },
      { name: 'min_usd', type: 'number', required: false, description: 'Value floor (default 100000)', example: '1000000' },
      { name: 'limit', type: 'number', required: false, description: 'Max rows (≤200)', example: '50' },
    ],
    responses: [
      {
        status: 200,
        description: 'Array of whale transfers',
        example: {
          data: [
            {
              token_symbol: 'USDT',
              value_usd: 25000000,
              from_label: 'Binance 14',
              to_label: null,
              is_exchange_withdrawal: true,
              block_number: 25390930,
            },
          ],
        },
      },
    ],
    examples: [
      {
        title: '≥$1M transfers, last 24h',
        request: {
          url: '/api/v1/indexer/whales?min_usd=1000000',
          method: 'GET',
          headers: { Authorization: 'Bearer jwt_token_here' },
        },
        response: { status: 200, body: { data: ['…'] } },
      },
    ],
  },
  {
    id: 'indexer-exchange-flows',
    method: 'GET',
    path: '/api/v1/indexer/exchange-flows',
    description:
      'Per-exchange, per-token deposit/withdrawal totals and net flow. Positive net flow = money moving onto exchanges. Account required.',
    category: 'Blockchain Intelligence',
    auth: 'jwt',
    queryParams: [
      { name: 'hours', type: 'number', required: false, description: 'Lookback window (≤168)', example: '24' },
      { name: 'exchange', type: 'string', required: false, description: 'Filter by exchange', example: 'binance' },
      { name: 'token', type: 'string', required: false, description: 'Filter by token address', example: '0xdac1…1ec7' },
    ],
    responses: [
      {
        status: 200,
        description: 'Array of flows',
        example: {
          data: [
            {
              exchange: 'binance',
              token_symbol: 'USDT',
              deposit_usd: 768019995.6,
              withdrawal_usd: 664263080.36,
              net_flow_usd: 103756915.24,
              tx_count: 36853,
            },
          ],
        },
      },
    ],
    examples: [
      {
        title: 'All flows, last 24h',
        request: {
          url: '/api/v1/indexer/exchange-flows',
          method: 'GET',
          headers: { Authorization: 'Bearer jwt_token_here' },
        },
        response: { status: 200, body: { data: ['…'] } },
      },
    ],
  },
  {
    id: 'indexer-smart-money',
    method: 'GET',
    path: '/api/v1/indexer/smart-money',
    description:
      'Smart-money wallet leaderboard ranked by realized on-chain performance (win rate, P&L, composite score). Account required.',
    category: 'Blockchain Intelligence',
    auth: 'jwt',
    queryParams: [
      { name: 'limit', type: 'number', required: false, description: 'Max rows (≤200)', example: '50' },
    ],
    responses: [
      {
        status: 200,
        description: 'Ranked wallets',
        example: {
          data: [
            {
              address: '0xed23…9aca',
              total_trades: 2696,
              win_rate: 0.88,
              total_pnl_usd: 882526.94,
              score: 4.93,
              tier: 'serious',
            },
          ],
        },
      },
    ],
    examples: [
      {
        title: 'Top 50 wallets',
        request: {
          url: '/api/v1/indexer/smart-money',
          method: 'GET',
          headers: { Authorization: 'Bearer jwt_token_here' },
        },
        response: { status: 200, body: { data: ['…'] } },
      },
    ],
  },
  {
    id: 'indexer-portfolio',
    method: 'GET',
    path: '/api/v1/indexer/portfolio/:address',
    description:
      'Real indexed holdings with USD valuations for any address. Account required.',
    category: 'Blockchain Intelligence',
    auth: 'jwt',
    parameters: [
      { name: 'address', type: 'string', required: true, description: 'Wallet address', example: '0x28c6…d60' },
    ],
    responses: [
      {
        status: 200,
        description: 'Portfolio with token holdings',
        example: {
          data: {
            address: '0x28c6…d60',
            eth_balance_formatted: 251940.42,
            eth_value_usd: 869569856.68,
            total_value_usd: 1024117203.11,
            token_count: 143,
            tokens: ['…'],
          },
        },
      },
    ],
    examples: [
      {
        title: 'Portfolio lookup',
        request: {
          url: '/api/v1/indexer/portfolio/0x28c6c06298d514db089934071355e5743bf21d60',
          method: 'GET',
          headers: { Authorization: 'Bearer jwt_token_here' },
        },
        response: { status: 200, body: { data: { token_count: 143 } } },
      },
    ],
  },
  {
    id: 'indexer-status',
    method: 'GET',
    path: '/api/v1/indexer/status',
    description:
      'Indexer sync status: indexed vs chain head block, dataset counts. Public — also powers the /status trust page.',
    category: 'Blockchain Intelligence',
    auth: 'none',
    responses: [
      {
        status: 200,
        description: 'Sync status',
        example: {
          data: {
            latest_indexed_block: 25406626,
            latest_chain_block: 25473664,
            blocks_behind: 67038,
            transfers_count: 521316196,
            swaps_count: 85870631,
            is_syncing: true,
          },
        },
      },
    ],
    examples: [
      {
        title: 'Check sync progress',
        request: { url: '/api/v1/indexer/status', method: 'GET' },
        response: { status: 200, body: { data: { is_syncing: true } } },
      },
    ],
  },
];
