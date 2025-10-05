// src/features/datasources/types.ts
export interface DataSource {
  id: string;
  name: string;
  type: 'api' | 'database' | 'file' | 'realtime';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  description?: string;
  config: DataSourceConfig;
  createdAt: string;
  lastSync?: string;
  metrics?: DataSourceMetrics;
}

export interface DataSourceConfig {
  url?: string;
  apiKey?: string;
  database?: DatabaseConfig;
  file?: FileConfig;
  refresh_interval?: number;
  timeout?: number;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password?: string;
  ssl?: boolean;
}

export interface FileConfig {
  path: string;
  format: 'csv' | 'json' | 'xml';
  encoding?: string;
}

export interface DataSourceMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  lastError?: string;
}

export interface DataSourceConnection {
  id: string;
  datasourceId: string;
  status: 'connecting' | 'connected' | 'failed';
  connectedAt?: string;
  error?: string;
}