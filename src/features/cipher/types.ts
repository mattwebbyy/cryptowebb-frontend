// src/features/cipher/types.ts — token surveillance domain types + display helpers.

export interface Token {
  id: string;
  name: string;
  symbol: string;
  address: string;
  chainId: string;
  chainName: string; // Ethereum, BSC, etc.
  launchDate: string;
  marketCap: number;
  price: number;
  priceChange24h: number;
  holders: number;
  liquidity: number;
  riskScore: number; // 0-100, higher means higher risk
  riskFactors: string[];
  verified: boolean;
  priceHistory: number[]; // For sparklines
  totalSupply: number;
  circulatingSupply: number;
  lockupPeriod?: number; // in days
  lockupPercentage?: number; // percentage of tokens locked
  team: {
    name: string;
    isDoxxed: boolean; // Whether team identities are public
    hasPriorProjects: boolean;
  };
  auditStatus: {
    isAudited: boolean;
    auditCompany?: string;
    auditUrl?: string;
    score?: number; // 0-100
  };
  socialMetrics: {
    twitterFollowers: number;
    discordMembers: number;
    telegramMembers: number;
    githubStats?: {
      stars: number;
      forks: number;
      commits: number;
      contributors: number;
    };
  };
}

export type RiskLevel = 'low' | 'medium' | 'high';

export const formatCurrency = (value: number) => {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(2)}B`;
  } else if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
};

export const formatCompactNumber = (value: number) => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(2)}B`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K`;
  }
  return value.toLocaleString();
};

// Block-explorer link per chain; defaults to Etherscan.
export const getExplorerUrl = (address: string, chainName: string) => {
  const chain = chainName.toLowerCase();
  if (chain.includes('bsc') || chain.includes('binance')) {
    return `https://bscscan.com/token/${address}`;
  }
  if (chain.includes('polygon')) {
    return `https://polygonscan.com/token/${address}`;
  }
  return `https://etherscan.io/token/${address}`;
};

export const formatPrice = (price: number) => {
  if (price < 0.00001) {
    return price.toExponential(2);
  }
  return `$${price.toFixed(6)}`;
};

export const getRiskColor = (score: number) => {
  if (score < 30) return 'text-success';
  if (score < 60) return 'text-warning';
  return 'text-error';
};

export const getRiskText = (score: number) => {
  if (score < 30) return 'Low';
  if (score < 60) return 'Medium';
  return 'High';
};

export const shortAddress = (address: string, lead = 6, tail = 4) =>
  `${address.substring(0, lead)}...${address.substring(address.length - tail)}`;

export const isNewLaunch = (launchDate: string) =>
  Date.now() - new Date(launchDate).getTime() < 1000 * 60 * 60 * 24 * 2;
