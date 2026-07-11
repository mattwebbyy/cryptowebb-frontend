import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { apiClient } from '@/lib/axios';
import {
  APIResponse,
  TokenInfo,
  TokenStats,
  TopToken,
  NewToken,
  SearchResult,
  HolderInfo,
  SocialLinks,
  Portfolio,
  TokenTransfer,
  PnLSummary,
  TokenPosition,
  TokenIndicators,
  WhaleTransfer,
  ExchangeFlow,
  SmartMoneyWallet,
  ProtocolTVL,
  PoolTVL,
  DefiStats,
  IndexerStatus,
  PriceData,
  AddressProfile,
  LabeledAddress,
  LabelStats,
  MetricRow,
  TokensParams,
  NewTokensParams,
  TransfersParams,
  WhalesParams,
  TopTradersParams,
  IndicatorHistoryParams,
  ExchangeFlowsParams,
  DefiStatsHistoryParams,
  TokenHourlyStatsParams,
  LabelsParams,
  MetricParams,
} from '../types';

const BASE_PATH = '/api/v1/indexer';

// Endpoints whose upstream queries can outrun the axios instance's 15s
// timeout (observed: /tokens/new >25s cold). The backend caches + serves
// stale, but non-default filter combos can still hit a cold upstream query.
const SLOW_ENDPOINTS = ['/tokens/new', '/tokens/top'];

// Generic fetch helper — goes through apiClient so the auth interceptor
// covers the gated routes (whales/flows/smart-money/portfolio).
async function fetchFromIndexer<T>(endpoint: string, params?: object): Promise<T> {
  const timeout = SLOW_ENDPOINTS.some((p) => endpoint.startsWith(p)) ? 45_000 : undefined;
  const res = await apiClient.get<APIResponse<T>>(`${BASE_PATH}${endpoint}`, { params, timeout });
  return res.data;
}

/**
 * True when the backend answered 503 for an endpoint the indexer registers
 * but hasn't rebuilt yet (pnl/indicators/tvl/stats) — render "coming soon".
 */
export function isComingSoon(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 503;
}

/** Don't hammer endpoints that are 503-stubbed upstream. */
function retryUnlessComingSoon(failureCount: number, error: Error): boolean {
  if (isComingSoon(error)) return false;
  return failureCount < 2;
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
    staleTime: 5000,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled,
  });
};

export const useTokenSearch = (
  query: string,
  options?: { enabled?: boolean }
): UseQueryResult<SearchResult[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'tokens', 'search', query],
    queryFn: () => fetchFromIndexer<SearchResult[]>('/tokens/search', { q: query }),
    staleTime: 60000,
    enabled: (options?.enabled ?? true) && query.length >= 2,
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
    enabled: (options?.enabled ?? true) && !!address,
  });
};

export const useTokenStats = (
  address: string,
  options?: { enabled?: boolean; refetchInterval?: number }
): UseQueryResult<TokenStats, Error> => {
  return useQuery({
    queryKey: ['indexer', 'token', address, 'stats'],
    queryFn: () => fetchFromIndexer<TokenStats>(`/token/${address}/stats`),
    staleTime: 15000,
    refetchInterval: options?.refetchInterval,
    enabled: (options?.enabled ?? true) && !!address,
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
    enabled: (options?.enabled ?? true) && !!address,
  });
};

export const useTokenHolders = (
  address: string,
  params?: TokensParams,
  options?: { enabled?: boolean }
): UseQueryResult<HolderInfo[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'token', address, 'holders', params],
    queryFn: () => fetchFromIndexer<HolderInfo[]>(`/token/${address}/holders`, params),
    staleTime: 60000,
    enabled: (options?.enabled ?? true) && !!address,
  });
};

export const useTokenSocials = (
  address: string,
  options?: { enabled?: boolean }
): UseQueryResult<SocialLinks, Error> => {
  return useQuery({
    queryKey: ['indexer', 'token', address, 'socials'],
    queryFn: () => fetchFromIndexer<SocialLinks>(`/token/${address}/socials`),
    staleTime: 300000,
    enabled: (options?.enabled ?? true) && !!address,
  });
};

// ---- Portfolio & Address (gated: requires login) ----

export const usePortfolio = (
  address: string,
  options?: { enabled?: boolean; refetchInterval?: number }
): UseQueryResult<Portfolio, Error> => {
  return useQuery({
    queryKey: ['indexer', 'portfolio', address],
    queryFn: () => fetchFromIndexer<Portfolio>(`/portfolio/${address}`),
    staleTime: 30000,
    refetchInterval: options?.refetchInterval,
    enabled: (options?.enabled ?? true) && !!address,
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
    enabled: (options?.enabled ?? true) && !!address,
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
    enabled: (options?.enabled ?? true) && !!address,
  });
};

// ---- Labels ----

export const useLabels = (
  params?: LabelsParams,
  options?: { enabled?: boolean }
): UseQueryResult<LabeledAddress[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'labels', params],
    queryFn: () => fetchFromIndexer<LabeledAddress[]>('/labels', params),
    staleTime: 300000,
    enabled: options?.enabled,
  });
};

export const useLabel = (
  address: string,
  options?: { enabled?: boolean }
): UseQueryResult<LabeledAddress | null, Error> => {
  return useQuery({
    queryKey: ['indexer', 'labels', 'address', address],
    queryFn: () => fetchFromIndexer<LabeledAddress | null>(`/labels/${address}`),
    staleTime: 300000,
    enabled: (options?.enabled ?? true) && !!address,
  });
};

export const useLabelStats = (options?: {
  enabled?: boolean;
}): UseQueryResult<LabelStats, Error> => {
  return useQuery({
    queryKey: ['indexer', 'labels', 'stats'],
    queryFn: () => fetchFromIndexer<LabelStats>('/labels/stats'),
    staleTime: 300000,
    enabled: options?.enabled,
  });
};

// ---- Whales, Flows & Smart Money (gated: requires login) ----

export const useWhaleTransfers = (
  params?: WhalesParams,
  options?: { enabled?: boolean; refetchInterval?: number }
): UseQueryResult<WhaleTransfer[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'whales', params],
    queryFn: () => fetchFromIndexer<WhaleTransfer[]>('/whales', params),
    staleTime: 10000,
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
    staleTime: 30000,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled,
  });
};

export const useSmartMoney = (
  params?: TokensParams,
  options?: { enabled?: boolean; refetchInterval?: number }
): UseQueryResult<SmartMoneyWallet[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'smart-money', params],
    queryFn: () => fetchFromIndexer<SmartMoneyWallet[]>('/smart-money', params),
    staleTime: 60000,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled,
  });
};

// ---- Macro metrics ----

export const useIndexerMetric = (
  metric: string,
  params?: MetricParams,
  options?: { enabled?: boolean }
): UseQueryResult<MetricRow[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'metrics', metric, params],
    queryFn: () => fetchFromIndexer<MetricRow[]>(`/metrics/${metric}`, params),
    staleTime: 60000,
    enabled: (options?.enabled ?? true) && !!metric,
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

// ---- Upstream-stubbed endpoints ----
// Our backend returns 503 for these until the indexer ships them; hooks
// don't retry on 503 and callers use isComingSoon(error) for the UI state.

export const usePnLSummary = (
  address: string,
  options?: { enabled?: boolean }
): UseQueryResult<PnLSummary, Error> => {
  return useQuery({
    queryKey: ['indexer', 'pnl', address],
    queryFn: () => fetchFromIndexer<PnLSummary>(`/pnl/${address}`),
    staleTime: 60000,
    retry: retryUnlessComingSoon,
    enabled: (options?.enabled ?? true) && !!address,
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
    retry: retryUnlessComingSoon,
    enabled: (options?.enabled ?? true) && !!address,
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
    retry: retryUnlessComingSoon,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled,
  });
};

export const useTokenIndicators = (
  address: string,
  options?: { enabled?: boolean; refetchInterval?: number }
): UseQueryResult<TokenIndicators, Error> => {
  return useQuery({
    queryKey: ['indexer', 'indicators', address],
    queryFn: () => fetchFromIndexer<TokenIndicators>(`/indicators/${address}`),
    staleTime: 60000,
    retry: retryUnlessComingSoon,
    refetchInterval: options?.refetchInterval,
    enabled: (options?.enabled ?? true) && !!address,
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
    retry: retryUnlessComingSoon,
    enabled: (options?.enabled ?? true) && !!address,
  });
};

export const useProtocolTVL = (
  options?: { enabled?: boolean; refetchInterval?: number }
): UseQueryResult<ProtocolTVL[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'tvl'],
    queryFn: () => fetchFromIndexer<ProtocolTVL[]>('/tvl'),
    staleTime: 60000,
    retry: retryUnlessComingSoon,
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
    retry: retryUnlessComingSoon,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled,
  });
};

export const useDefiStats = (
  options?: { enabled?: boolean; refetchInterval?: number }
): UseQueryResult<DefiStats, Error> => {
  return useQuery({
    queryKey: ['indexer', 'stats', 'defi'],
    queryFn: () => fetchFromIndexer<DefiStats>('/stats/defi'),
    staleTime: 60000,
    retry: retryUnlessComingSoon,
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
    retry: retryUnlessComingSoon,
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
    retry: retryUnlessComingSoon,
    enabled: (options?.enabled ?? true) && !!address,
  });
};

export const useTokenHourlyStats = (
  address: string,
  params?: TokenHourlyStatsParams,
  options?: { enabled?: boolean }
): UseQueryResult<Record<string, unknown>[], Error> => {
  return useQuery({
    queryKey: ['indexer', 'stats', 'token', address, 'hourly', params],
    queryFn: () =>
      fetchFromIndexer<Record<string, unknown>[]>(`/stats/token/${address}/hourly`, params),
    staleTime: 60000,
    retry: retryUnlessComingSoon,
    enabled: (options?.enabled ?? true) && !!address,
  });
};
