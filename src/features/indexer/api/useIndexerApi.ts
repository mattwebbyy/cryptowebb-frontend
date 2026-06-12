import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/config';
import {
  APIResponse,
  TokenInfo,
  TokenStats,
  TopToken,
  NewToken,
  Portfolio,
  TokenTransfer,
  PnLSummary,
  TokenPosition,
  TokenIndicators,
  WhaleTransfer,
  ExchangeFlow,
  ProtocolTVL,
  PoolTVL,
  DefiStats,
  IndexerStatus,
  PriceData,
  AddressProfile,
  WalletLabel,
  TokensParams,
  NewTokensParams,
  TransfersParams,
  TopTradersParams,
  IndicatorHistoryParams,
  ExchangeFlowsParams,
  DefiStatsHistoryParams,
  TokenHourlyStatsParams,
  LabelsParams,
} from '../types';

const BACKEND_URL = API_BASE_URL;
const BASE_PATH = '/api/v1/indexer';

// Generic fetch helper
async function fetchFromIndexer<T>(endpoint: string, params?: object): Promise<T> {
  const { data } = await axios.get<APIResponse<T>>(`${BACKEND_URL}${BASE_PATH}${endpoint}`, { params });
  return data.data;
}

// ---- Status & Prices ----

export const useIndexerStatus = (
  options?: { enabled?: boolean; refetchInterval?: number }
): UseQueryResult<IndexerStatus, Error> => {
  return useQuery({
    queryKey: ['indexer', 'status'],
    queryFn: () => fetchFromIndexer<IndexerStatus>('/status'),
    staleTime: 10000,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled,
  });
};

export const usePrices = (
  options?: { enabled?: boolean; refetchInterval?: number }
): UseQueryResult<PriceData, Error> => {
  return useQuery({
    queryKey: ['indexer', 'prices'],
    queryFn: () => fetchFromIndexer<PriceData>('/prices'),
    staleTime: 15000,
    refetchInterval: options?.refetchInterval ?? 15000,
    enabled: options?.enabled,
  });
};

// ---- Tokens ----

export const useTopTokens = (
  params?: TokensParams,
  options?: { enabled?: boolean; refetchInterval?: number }
): UseQueryResult<TopToken[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'tokens', 'top', params],
    queryFn: () => fetchFromIndexer<TopToken[]>('/tokens/top', params),
    staleTime: 30000,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled,
  });
};

export const useNewTokens = (
  params?: NewTokensParams,
  options?: { enabled?: boolean; refetchInterval?: number }
): UseQueryResult<NewToken[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'tokens', 'new', params],
    queryFn: () => fetchFromIndexer<NewToken[]>('/tokens/new', params),
    staleTime: 30000,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled,
  });
};

export const useTokenSearch = (
  query: string,
  options?: { enabled?: boolean }
): UseQueryResult<TokenInfo[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'tokens', 'search', query],
    queryFn: () => fetchFromIndexer<TokenInfo[]>('/tokens/search', { q: query }),
    staleTime: 60000,
    enabled: options?.enabled && query.length >= 2,
  });
};

export const useTokenInfo = (
  address: string,
  options?: { enabled?: boolean }
): UseQueryResult<TokenInfo, Error> => {
  return useQuery({
    queryKey: ['indexer', 'token', address, 'info'],
    queryFn: () => fetchFromIndexer<TokenInfo>(`/token/${address}`),
    staleTime: 60000,
    enabled: options?.enabled && !!address,
  });
};

export const useTokenStats = (
  address: string,
  options?: { enabled?: boolean; refetchInterval?: number }
): UseQueryResult<TokenStats, Error> => {
  return useQuery({
    queryKey: ['indexer', 'token', address, 'stats'],
    queryFn: () => fetchFromIndexer<TokenStats>(`/token/${address}/stats`),
    staleTime: 30000,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled && !!address,
  });
};

export const useTokenTransfers = (
  address: string,
  params?: TransfersParams,
  options?: { enabled?: boolean }
): UseQueryResult<TokenTransfer[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'token', address, 'transfers', params],
    queryFn: () => fetchFromIndexer<TokenTransfer[]>(`/token/${address}/transfers`, params),
    staleTime: 30000,
    enabled: options?.enabled && !!address,
  });
};

export const useTokenHolders = (
  address: string,
  params?: TokensParams,
  options?: { enabled?: boolean }
): UseQueryResult<Record<string, unknown>[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'token', address, 'holders', params],
    queryFn: () => fetchFromIndexer<Record<string, unknown>[]>(`/token/${address}/holders`, params),
    staleTime: 60000,
    enabled: options?.enabled && !!address,
  });
};

// ---- Portfolio & Address ----

export const usePortfolio = (
  address: string,
  options?: { enabled?: boolean; refetchInterval?: number }
): UseQueryResult<Portfolio, Error> => {
  return useQuery({
    queryKey: ['indexer', 'portfolio', address],
    queryFn: () => fetchFromIndexer<Portfolio>(`/portfolio/${address}`),
    staleTime: 30000,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled && !!address,
  });
};

export const useAddressTransfers = (
  address: string,
  params?: TransfersParams,
  options?: { enabled?: boolean }
): UseQueryResult<TokenTransfer[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'address', address, 'transfers', params],
    queryFn: () => fetchFromIndexer<TokenTransfer[]>(`/address/${address}/transfers`, params),
    staleTime: 30000,
    enabled: options?.enabled && !!address,
  });
};

export const useAddressProfile = (
  address: string,
  options?: { enabled?: boolean }
): UseQueryResult<AddressProfile, Error> => {
  return useQuery({
    queryKey: ['indexer', 'address', address, 'profile'],
    queryFn: () => fetchFromIndexer<AddressProfile>(`/address/${address}/profile`),
    staleTime: 60000,
    enabled: options?.enabled && !!address,
  });
};

// ---- P&L ----

export const usePnLSummary = (
  address: string,
  options?: { enabled?: boolean }
): UseQueryResult<PnLSummary, Error> => {
  return useQuery({
    queryKey: ['indexer', 'pnl', address],
    queryFn: () => fetchFromIndexer<PnLSummary>(`/pnl/${address}`),
    staleTime: 60000,
    enabled: options?.enabled && !!address,
  });
};

export const usePnLPositions = (
  address: string,
  options?: { enabled?: boolean }
): UseQueryResult<TokenPosition[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'pnl', address, 'positions'],
    queryFn: () => fetchFromIndexer<TokenPosition[]>(`/pnl/${address}/positions`),
    staleTime: 60000,
    enabled: options?.enabled && !!address,
  });
};

export const useTopTraders = (
  params?: TopTradersParams,
  options?: { enabled?: boolean; refetchInterval?: number }
): UseQueryResult<PnLSummary[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'pnl', 'top-traders', params],
    queryFn: () => fetchFromIndexer<PnLSummary[]>('/pnl/top-traders', params),
    staleTime: 60000,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled,
  });
};

export const useSmartMoney = (
  params?: TokensParams,
  options?: { enabled?: boolean; refetchInterval?: number }
): UseQueryResult<PnLSummary[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'smart-money', params],
    queryFn: () => fetchFromIndexer<PnLSummary[]>('/smart-money', params),
    staleTime: 60000,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled,
  });
};

// ---- Indicators ----

export const useTokenIndicators = (
  address: string,
  options?: { enabled?: boolean; refetchInterval?: number }
): UseQueryResult<TokenIndicators, Error> => {
  return useQuery({
    queryKey: ['indexer', 'indicators', address],
    queryFn: () => fetchFromIndexer<TokenIndicators>(`/indicators/${address}`),
    staleTime: 60000,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled && !!address,
  });
};

export const useIndicatorHistory = (
  address: string,
  params?: IndicatorHistoryParams,
  options?: { enabled?: boolean }
): UseQueryResult<TokenIndicators[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'indicators', address, 'history', params],
    queryFn: () => fetchFromIndexer<TokenIndicators[]>(`/indicators/${address}/history`, params),
    staleTime: 60000,
    enabled: options?.enabled && !!address,
  });
};

// ---- Whales & Exchange Flows ----

export const useWhaleTransfers = (
  params?: TokensParams,
  options?: { enabled?: boolean; refetchInterval?: number }
): UseQueryResult<WhaleTransfer[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'whales', params],
    queryFn: () => fetchFromIndexer<WhaleTransfer[]>('/whales', params),
    staleTime: 30000,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled,
  });
};

export const useExchangeFlows = (
  params?: ExchangeFlowsParams,
  options?: { enabled?: boolean; refetchInterval?: number }
): UseQueryResult<ExchangeFlow[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'exchange-flows', params],
    queryFn: () => fetchFromIndexer<ExchangeFlow[]>('/exchange-flows', params),
    staleTime: 60000,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled,
  });
};

// ---- TVL ----

export const useProtocolTVL = (
  options?: { enabled?: boolean; refetchInterval?: number }
): UseQueryResult<ProtocolTVL[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'tvl'],
    queryFn: () => fetchFromIndexer<ProtocolTVL[]>('/tvl'),
    staleTime: 60000,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled,
  });
};

export const useTopPools = (
  params?: TokensParams,
  options?: { enabled?: boolean; refetchInterval?: number }
): UseQueryResult<PoolTVL[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'tvl', 'pools', params],
    queryFn: () => fetchFromIndexer<PoolTVL[]>('/tvl/pools', params),
    staleTime: 60000,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled,
  });
};

// ---- DeFi Stats ----

export const useDefiStats = (
  options?: { enabled?: boolean; refetchInterval?: number }
): UseQueryResult<DefiStats, Error> => {
  return useQuery({
    queryKey: ['indexer', 'stats', 'defi'],
    queryFn: () => fetchFromIndexer<DefiStats>('/stats/defi'),
    staleTime: 60000,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled,
  });
};

export const useDefiStatsHistory = (
  params?: DefiStatsHistoryParams,
  options?: { enabled?: boolean }
): UseQueryResult<DefiStats[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'stats', 'defi', 'history', params],
    queryFn: () => fetchFromIndexer<DefiStats[]>('/stats/defi/history', params),
    staleTime: 300000,
    enabled: options?.enabled,
  });
};

export const useTokenStatsSummary = (
  address: string,
  options?: { enabled?: boolean }
): UseQueryResult<Record<string, unknown>, Error> => {
  return useQuery({
    queryKey: ['indexer', 'stats', 'token', address],
    queryFn: () => fetchFromIndexer<Record<string, unknown>>(`/stats/token/${address}`),
    staleTime: 60000,
    enabled: options?.enabled && !!address,
  });
};

export const useTokenHourlyStats = (
  address: string,
  params?: TokenHourlyStatsParams,
  options?: { enabled?: boolean }
): UseQueryResult<Record<string, unknown>[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'stats', 'token', address, 'hourly', params],
    queryFn: () => fetchFromIndexer<Record<string, unknown>[]>(`/stats/token/${address}/hourly`, params),
    staleTime: 60000,
    enabled: options?.enabled && !!address,
  });
};

// ---- Labels ----

export const useLabels = (
  params?: LabelsParams,
  options?: { enabled?: boolean }
): UseQueryResult<WalletLabel[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'labels', params],
    queryFn: () => fetchFromIndexer<WalletLabel[]>('/labels', params),
    staleTime: 300000,
    enabled: options?.enabled,
  });
};

// ---- Recent Transfers ----

export const useRecentTransfers = (
  params?: TokensParams,
  options?: { enabled?: boolean; refetchInterval?: number }
): UseQueryResult<TokenTransfer[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'transfers', 'recent', params],
    queryFn: () => fetchFromIndexer<TokenTransfer[]>('/transfers/recent', params),
    staleTime: 15000,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled,
  });
};
