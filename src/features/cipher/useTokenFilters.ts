// src/features/cipher/useTokenFilters.ts — search/filter/sort state for the token table.
import { useMemo, useState } from 'react';
import { RiskLevel, Token } from './types';

export interface SortConfig {
  key: keyof Token;
  direction: 'asc' | 'desc';
}

export const useTokenFilters = (tokens: Token[]) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerified, setFilterVerified] = useState<boolean | null>(null);
  const [filterRisk, setFilterRisk] = useState<RiskLevel | null>(null);
  const [filterChain, setFilterChain] = useState<string | null>(null);
  const [filterAudited, setFilterAudited] = useState<boolean | null>(null);
  const [filterDoxxed, setFilterDoxxed] = useState<boolean | null>(null);
  const [filterMinHolders, setFilterMinHolders] = useState<number | null>(null);
  const [filterMinLiquidity, setFilterMinLiquidity] = useState<number | null>(null);

  const handleSort = (key: keyof Token) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedTokens = useMemo(() => {
    let filteredTokens = [...tokens];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredTokens = filteredTokens.filter(
        (token) =>
          token.name.toLowerCase().includes(query) ||
          token.symbol.toLowerCase().includes(query) ||
          token.address.toLowerCase().includes(query)
      );
    }

    if (filterVerified !== null) {
      filteredTokens = filteredTokens.filter((token) => token.verified === filterVerified);
    }

    if (filterRisk !== null) {
      filteredTokens = filteredTokens.filter((token) => {
        if (filterRisk === 'low') return token.riskScore < 30;
        if (filterRisk === 'medium') return token.riskScore >= 30 && token.riskScore < 60;
        return token.riskScore >= 60;
      });
    }

    if (filterChain !== null && filterChain !== 'all') {
      filteredTokens = filteredTokens.filter((token) => token.chainName === filterChain);
    }

    if (filterAudited !== null) {
      filteredTokens = filteredTokens.filter(
        (token) => token.auditStatus.isAudited === filterAudited
      );
    }

    if (filterDoxxed !== null) {
      filteredTokens = filteredTokens.filter((token) => token.team.isDoxxed === filterDoxxed);
    }

    if (filterMinHolders !== null) {
      filteredTokens = filteredTokens.filter((token) => token.holders >= filterMinHolders);
    }

    if (filterMinLiquidity !== null) {
      filteredTokens = filteredTokens.filter((token) => token.liquidity >= filterMinLiquidity);
    }

    if (sortConfig !== null) {
      filteredTokens.sort((a, b) => {
        const aValue = a[sortConfig.key] as string | number;
        const bValue = b[sortConfig.key] as string | number;

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredTokens;
  }, [
    tokens,
    sortConfig,
    searchQuery,
    filterVerified,
    filterRisk,
    filterChain,
    filterAudited,
    filterDoxxed,
    filterMinHolders,
    filterMinLiquidity,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setFilterVerified(null);
    setFilterRisk(null);
    setFilterChain(null);
    setFilterAudited(null);
    setFilterDoxxed(null);
    setFilterMinHolders(null);
    setFilterMinLiquidity(null);
    setSortConfig(null);
  };

  return {
    sortedTokens,
    handleSort,
    resetFilters,
    searchQuery,
    setSearchQuery,
    filterVerified,
    setFilterVerified,
    filterRisk,
    setFilterRisk,
    filterChain,
    setFilterChain,
    filterAudited,
    setFilterAudited,
    filterDoxxed,
    setFilterDoxxed,
    filterMinHolders,
    setFilterMinHolders,
    filterMinLiquidity,
    setFilterMinLiquidity,
  };
};

export type TokenFiltersState = ReturnType<typeof useTokenFilters>;
