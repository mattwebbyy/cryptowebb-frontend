// src/api/datasourceApi.ts
import type { DataSource } from '../features/datasources/types';
import { apiClient } from './apiClient';

type CreateDatasourcePayload = Omit<DataSource, 'id' | 'createdAt' | 'status'> & {
  status?: DataSource['status'];
};

type RawDataSource = Partial<DataSource> & {
  ID?: string;
  Name?: string;
  Type?: DataSource['type'];
  Status?: DataSource['status'];
  Description?: string;
  Config?: DataSource['config'];
  CreatedAt?: string;
  LastSync?: string;
  Metrics?: DataSource['metrics'];
  datasourceId?: string;
  DatasourceID?: string;
  title?: string;
};

type DatasourceListResponse =
  | RawDataSource[]
  | {
      datasources?: RawDataSource[];
      items?: RawDataSource[];
    }
  | null;

const normaliseDatasource = (raw: RawDataSource): DataSource => {
  const id = raw.id || raw.ID || raw.datasourceId || raw.DatasourceID || '';
  const name = raw.name || raw.Name || raw.title || 'Untitled datasource';
  const type = raw.type || raw.Type || 'api';
  const status = raw.status || raw.Status || 'connected';
  const description = raw.description ?? raw.Description ?? undefined;
  const config = (raw.config ?? raw.Config ?? {}) as DataSource['config'];
  const createdAt = raw.createdAt || raw.CreatedAt || new Date().toISOString();
  const lastSync = raw.lastSync || raw.LastSync || undefined;
  const metrics = (raw.metrics ?? raw.Metrics) as DataSource['metrics'] | undefined;

  return {
    id,
    name,
    type,
    status,
    description,
    config,
    createdAt,
    lastSync,
    metrics,
  };
};

const extractDatasourceArray = (data: DatasourceListResponse): RawDataSource[] => {
  if (Array.isArray(data)) {
    return data;
  }
  if (data?.datasources && Array.isArray(data.datasources)) {
    return data.datasources;
  }
  if (data?.items && Array.isArray(data.items)) {
    return data.items;
  }
  return [];
};

export const fetchDatasources = async (): Promise<DataSource[]> => {
  const data = await apiClient.get<DatasourceListResponse>('/api/v1/datasources');
  const items = extractDatasourceArray(data);
  return items.map(normaliseDatasource);
};

export const createDatasource = async (
  payload: CreateDatasourcePayload
): Promise<DataSource> => {
  const body = {
    ...payload,
    status: payload.status ?? 'pending',
  };

  const data = await apiClient.post<RawDataSource>('/api/v1/datasources', body);
  return normaliseDatasource(data);
};

export const deleteDatasource = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/v1/datasources/${id}`);
};
