// src/types/api.ts
// Canonical backend payload shapes shared across features. Field casing
// mirrors the Go API's JSON tags exactly — do not "fix" snake_case here.
//
// Feature-local request/response types (alerts, pricing, cipher, …) stay in
// their feature's types.ts; this module holds shapes used across features.

// ---------------------------------------------------------------------------
// Auth & user
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string;
  bio?: string;
  createdAt?: string;
  lastLogin?: string | null;
}

export interface AuthResponse {
  message?: string;
  error?: string;
  token: string;
  refreshToken: string;
  type: string;
  user: User;
}

// ---------------------------------------------------------------------------
// Blog (snake_case per backend JSON tags)
// ---------------------------------------------------------------------------

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  tags: string[];
  meta_desc: string;
  is_published: boolean;
  created_at: string;
  updated_at?: string;
  author_id: string;
}

export interface BlogListResponse {
  posts: BlogPost[];
  total: number;
}

// ---------------------------------------------------------------------------
// Chart data — GET /api/v1/charts/:id/data
// ---------------------------------------------------------------------------

export interface ChartPoint {
  /** Unix milliseconds */
  timestamp: number;
  value: number;
}

// ---------------------------------------------------------------------------
// Re-exports so consumers can import all payload shapes from '@/types/api'
// ---------------------------------------------------------------------------

export type {
  DataMetric,
  TimeseriesDataPoint,
  TimeseriesApiResponse,
  GranularityOption,
  TimeseriesRequestParams,
} from './metricsData';

export type {
  ChartDataRow,
  ChartData,
  ChartConfig,
  DashboardConfig,
  DatasourceConfig,
  WebSocketUpdate,
} from './data';
