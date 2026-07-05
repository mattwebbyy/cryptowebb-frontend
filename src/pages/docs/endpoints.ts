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
];
