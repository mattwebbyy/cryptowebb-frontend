import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/config';
import {
  NewContractsResponse,
  TrendingTokensResponse,
  TokenDetailsResponse,
  NewContractsParams,
  TrendingTokensParams,
  NewContract,
  TrendingToken,
  TokenDetails,
} from '../../../types/blockchain';

const BACKEND_URL = API_BASE_URL;

// API functions
const fetchNewContracts = async (params?: NewContractsParams): Promise<NewContract[]> => {
  const { data } = await axios.get<NewContractsResponse>(
    `${BACKEND_URL}/api/v1/blockchain/contracts/new`,
    { params }
  );
  return data.data;
};

const fetchTrendingTokens = async (params?: TrendingTokensParams): Promise<TrendingToken[]> => {
  const { data } = await axios.get<TrendingTokensResponse>(
    `${BACKEND_URL}/api/v1/blockchain/tokens/trending`,
    { params }
  );
  return data.data;
};

const fetchTokenDetails = async (address: string): Promise<TokenDetails> => {
  const { data } = await axios.get<TokenDetailsResponse>(
    `${BACKEND_URL}/api/v1/blockchain/tokens/${address}`
  );
  return data.data;
};

// React Query Hooks

/**
 * Fetch newly deployed contracts/tokens
 * @param params Query parameters (limit, timeframe)
 * @param options React Query options
 */
export const useNewContracts = (
  params?: NewContractsParams,
  options?: { enabled?: boolean; refetchInterval?: number }
): UseQueryResult<NewContract[], Error> => {
  return useQuery({
    queryKey: ['blockchain', 'new-contracts', params],
    queryFn: () => fetchNewContracts(params),
    staleTime: 30000, // 30 seconds
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled,
  });
};

/**
 * Fetch trending/hot tokens
 * @param params Query parameters (limit, sortBy)
 * @param options React Query options
 */
export const useTrendingTokens = (
  params?: TrendingTokensParams,
  options?: { enabled?: boolean; refetchInterval?: number }
): UseQueryResult<TrendingToken[], Error> => {
  return useQuery({
    queryKey: ['blockchain', 'trending-tokens', params],
    queryFn: () => fetchTrendingTokens(params),
    staleTime: 30000, // 30 seconds
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled,
  });
};

/**
 * Fetch detailed information about a specific token
 * @param address Token contract address
 * @param options React Query options
 */
export const useTokenDetails = (
  address: string,
  options?: { enabled?: boolean }
): UseQueryResult<TokenDetails, Error> => {
  return useQuery({
    queryKey: ['blockchain', 'token-details', address],
    queryFn: () => fetchTokenDetails(address),
    staleTime: 60000, // 1 minute
    enabled: options?.enabled && !!address,
  });
};
