// src/types/data.ts

// Row structure - adjust keys based on your actual data
export interface ChartDataRow {
  [key: string]: string | number | Date | null | undefined | boolean;
}

export type ChartData = ChartDataRow[];

export interface ChartConfig {
  id: string;
  dashboardId: string;
  name: string;
  type: 'line' | 'bar' | 'pie' | 'number' | 'table' | 'gauge';
  datasourceId: string;
  query: string;
  options?: Record<string, any>;
  refreshRate?: number;
  isLive?: boolean;
  createdAt: string;
  updatedAt: string;
}
// Dashboard configuration
export interface DashboardConfig {
  id: string;
  userId: string;
  name: string;
  layout: string;
  charts: ChartConfig[]; // Or just IDs
  createdAt: string;
  updatedAt: string;
}

// Datasource configuration
export interface DatasourceConfig {
  id: string;
  userId: string;
  name: string;
  type: 'postgres' | 'clickhouse';
  options?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface WebSocketUpdate {
  type: 'APPEND' | 'UPDATE' | 'REPLACE';
  chartId: string;
  payload: ChartDataRow | ChartData;
}
