// src/pages/analytics/CipherMatrix.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, AlertTriangle, Shield, ArrowUpDown, ExternalLink, Info, TrendingUp, TrendingDown, Zap, Clock, Lock, Unlock, Sliders, Eye, EyeOff } from 'lucide-react';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';
import TokenDetailModal from '@/components/analytics/TokenDetailModal';

// Token type definition
interface Token {
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

// Mock data for development
const mockTokens: Token[] = [
  {
    id: '1',
    name: 'NeoMatrix',
    symbol: 'NEO',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    chainId: '1',
    chainName: 'Ethereum',
    launchDate: '2025-04-15T10:00:00Z',
    marketCap: 1250000,
    price: 0.025,
    priceChange24h: 5.2,
    holders: 1520,
    liquidity: 350000,
    riskScore: 20,
    riskFactors: [],
    verified: true,
    priceHistory: [0.022, 0.023, 0.0225, 0.024, 0.0235, 0.0245, 0.025],
    totalSupply: 50000000,
    circulatingSupply: 12500000,
    lockupPeriod: 180,
    lockupPercentage: 40,
    team: {
      name: 'Matrix Labs',
      isDoxxed: true,
      hasPriorProjects: true,
    },
    auditStatus: {
      isAudited: true,
      auditCompany: 'CertiK',
      auditUrl: 'https://example.com/audit',
      score: 95,
    },
    socialMetrics: {
      twitterFollowers: 5600,
      discordMembers: 3200,
      telegramMembers: 8900,
      githubStats: {
        stars: 120,
        forks: 35,
        commits: 450,
        contributors: 8,
      },
    }
  },
  {
    id: '2',
    name: 'RedPillDAO',
    symbol: 'PILL',
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    chainId: '56',
    chainName: 'BSC',
    launchDate: '2025-04-17T14:30:00Z',
    marketCap: 750000,
    price: 0.0075,
    priceChange24h: 12.8,
    holders: 890,
    liquidity: 210000,
    riskScore: 35,
    riskFactors: ['New team', 'Unaudited'],
    verified: false,
    priceHistory: [0.0065, 0.0068, 0.007, 0.0072, 0.0073, 0.0074, 0.0075],
    totalSupply: 100000000,
    circulatingSupply: 25000000,
    lockupPeriod: 90,
    lockupPercentage: 30,
    team: {
      name: 'Red Collective',
      isDoxxed: false,
      hasPriorProjects: false,
    },
    auditStatus: {
      isAudited: false,
    },
    socialMetrics: {
      twitterFollowers: 2800,
      discordMembers: 1500,
      telegramMembers: 3200,
    }
  },
  {
    id: '3',
    name: 'MorphCoin',
    symbol: 'MORPH',
    address: '0x7890abcdef1234567890abcdef1234567890abcd',
    chainId: '1',
    chainName: 'Ethereum',
    launchDate: '2025-04-10T09:15:00Z',
    marketCap: 4250000,
    price: 0.085,
    priceChange24h: -2.7,
    holders: 3150,
    liquidity: 920000,
    riskScore: 15,
    riskFactors: [],
    verified: true,
    priceHistory: [0.088, 0.087, 0.086, 0.0855, 0.085, 0.0848, 0.085],
    totalSupply: 50000000,
    circulatingSupply: 35000000,
    team: {
      name: 'Morpheus Technology',
      isDoxxed: true,
      hasPriorProjects: true,
    },
    auditStatus: {
      isAudited: true,
      auditCompany: 'SlowMist',
      auditUrl: 'https://example.com/audit',
      score: 92,
    },
    socialMetrics: {
      twitterFollowers: 12000,
      discordMembers: 8500,
      telegramMembers: 15000,
      githubStats: {
        stars: 350,
        forks: 120,
        commits: 780,
        contributors: 15,
      },
    }
  },
  {
    id: '4',
    name: 'SentinelAI',
    symbol: 'SENT',
    address: '0xef1234567890abcdef1234567890abcdef123456',
    chainId: '1',
    chainName: 'Ethereum',
    launchDate: '2025-04-18T00:00:00Z',
    marketCap: 350000,
    price: 0.0032,
    priceChange24h: 175.2,
    holders: 425,
    liquidity: 85000,
    riskScore: 65,
    riskFactors: ['Concentrated holdings', 'Anonymous team', 'Unusual contract code'],
    verified: false,
    priceHistory: [0.001, 0.0012, 0.0015, 0.0018, 0.0022, 0.0028, 0.0032],
    totalSupply: 100000000,
    circulatingSupply: 5000000,
    team: {
      name: 'Sentinel Developers',
      isDoxxed: false,
      hasPriorProjects: false,
    },
    auditStatus: {
      isAudited: false,
    },
    socialMetrics: {
      twitterFollowers: 1200,
      discordMembers: 850,
      telegramMembers: 2100,
    }
  },
  {
    id: '5',
    name: 'ZionNetwork',
    symbol: 'ZION',
    address: '0x567890abcdef1234567890abcdef1234567890ab',
    chainId: '56',
    chainName: 'BSC',
    launchDate: '2025-04-14T12:00:00Z',
    marketCap: 2850000,
    price: 0.047,
    priceChange24h: 8.9,
    holders: 2370,
    liquidity: 475000,
    riskScore: 25,
    riskFactors: ['Unaudited'],
    verified: true,
    priceHistory: [0.042, 0.043, 0.044, 0.045, 0.046, 0.0465, 0.047],
    totalSupply: 60000000,
    circulatingSupply: 45000000,
    lockupPeriod: 60,
    lockupPercentage: 15,
    team: {
      name: 'Zion Labs',
      isDoxxed: true,
      hasPriorProjects: false,
    },
    auditStatus: {
      isAudited: false,
    },
    socialMetrics: {
      twitterFollowers: 4500,
      discordMembers: 2200,
      telegramMembers: 6300,
      githubStats: {
        stars: 75,
        forks: 18,
        commits: 240,
        contributors: 4,
      },
    }
  },
  {
    id: '6',
    name: 'DigitalTwin',
    symbol: 'TWIN',
    address: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    chainId: '1',
    chainName: 'Ethereum',
    launchDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
    marketCap: 580000,
    price: 0.018,
    priceChange24h: 43.5,
    holders: 760,
    liquidity: 190000,
    riskScore: 45,
    riskFactors: ['New project', 'High volatility'],
    verified: true,
    priceHistory: [0.012, 0.013, 0.014, 0.015, 0.016, 0.017, 0.018],
    totalSupply: 80000000,
    circulatingSupply: 8000000,
    lockupPeriod: 120,
    lockupPercentage: 60,
    team: {
      name: 'Digital Architects',
      isDoxxed: true,
      hasPriorProjects: true,
    },
    auditStatus: {
      isAudited: true,
      auditCompany: 'PeckShield',
      auditUrl: 'https://example.com/audit',
      score: 88,
    },
    socialMetrics: {
      twitterFollowers: 3800,
      discordMembers: 1700,
      telegramMembers: 5200,
      githubStats: {
        stars: 95,
        forks: 22,
        commits: 310,
        contributors: 6,
      },
    }
  },
];

const CipherMatrix = () => {
  const [tokens, setTokens] = useState<Token[]>(mockTokens);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Token;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerified, setFilterVerified] = useState<boolean | null>(null);
  const [filterRisk, setFilterRisk] = useState<'low' | 'medium' | 'high' | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isTokenDetailOpen, setIsTokenDetailOpen] = useState(false);

  // Function to format currency values
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  // Function to format token price values
  const formatPrice = (price: number) => {
    if (price < 0.00001) {
      return price.toExponential(2);
    }
    return `$${price.toFixed(6)}`;
  };

  // Function to determine risk level color
  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-400';
    if (score < 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Function to determine risk level text
  const getRiskText = (score: number) => {
    if (score < 30) return 'Low';
    if (score < 60) return 'Medium';
    return 'High';
  };

  // Show token details modal
  const showTokenDetails = (tokenId: string) => {
    const token = tokens.find(t => t.id === tokenId);
    if (token) {
      setSelectedToken(token);
      setIsTokenDetailOpen(true);
    }
  };

  // Advanced filters
  const [filterChain, setFilterChain] = useState<string | null>(null);
  const [filterAudited, setFilterAudited] = useState<boolean | null>(null);
  const [filterDoxxed, setFilterDoxxed] = useState<boolean | null>(null);
  const [filterMinHolders, setFilterMinHolders] = useState<number | null>(null);
  const [filterMinLiquidity, setFilterMinLiquidity] = useState<number | null>(null);

  // Sorting function
  const handleSort = (key: keyof Token) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort the tokens
  const sortedTokens = React.useMemo(() => {
    let filteredTokens = [...tokens];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredTokens = filteredTokens.filter(
        token => 
          token.name.toLowerCase().includes(query) || 
          token.symbol.toLowerCase().includes(query) ||
          token.address.toLowerCase().includes(query)
      );
    }
    
    // Apply verified filter
    if (filterVerified !== null) {
      filteredTokens = filteredTokens.filter(token => token.verified === filterVerified);
    }
    
    // Apply risk filter
    if (filterRisk !== null) {
      filteredTokens = filteredTokens.filter(token => {
        if (filterRisk === 'low') return token.riskScore < 30;
        if (filterRisk === 'medium') return token.riskScore >= 30 && token.riskScore < 60;
        return token.riskScore >= 60;
      });
    }

    // Apply advanced filters
    if (filterChain !== null && filterChain !== 'all') {
      filteredTokens = filteredTokens.filter(token => token.chainName === filterChain);
    }

    if (filterAudited !== null) {
      filteredTokens = filteredTokens.filter(token => token.auditStatus.isAudited === filterAudited);
    }

    if (filterDoxxed !== null) {
      filteredTokens = filteredTokens.filter(token => token.team.isDoxxed === filterDoxxed);
    }

    if (filterMinHolders !== null) {
      filteredTokens = filteredTokens.filter(token => token.holders >= filterMinHolders);
    }

    if (filterMinLiquidity !== null) {
      filteredTokens = filteredTokens.filter(token => token.liquidity >= filterMinLiquidity);
    }
    
    // Sort tokens
    if (sortConfig !== null) {
        filteredTokens.sort((a, b) => {
          const aValue = a[sortConfig.key] as any;
          const bValue = b[sortConfig.key] as any;
          
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
  }, [tokens, sortConfig, searchQuery, filterVerified, filterRisk, filterChain, filterAudited, filterDoxxed, filterMinHolders, filterMinLiquidity]);

  // Simplified API fetch simulation
  useEffect(() => {
    // In a real application, you would fetch from your backend API
    // const fetchTokens = async () => {
    //   const response = await fetch('/api/tokens');
    //   const data = await response.json();
    //   setTokens(data);
    // };
    // fetchTokens();
    
    // For demo purposes, we're using the mock data
    setTokens(mockTokens);
  }, []);

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

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-matrix-green/30">
        <h2 className="text-xl font-mono text-matrix-green mb-4">Cipher Matrix: Token Surveillance System</h2>
        
        {/* Search and basic filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-matrix-green/50" />
            <input
              type="text"
              placeholder="Search by name, symbol, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/50 border border-matrix-green/40 rounded text-matrix-green focus:border-matrix-green focus:outline-none focus:ring-1 focus:ring-matrix-green/50"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterVerified === null ? '' : filterVerified ? 'verified' : 'unverified'}
              onChange={(e) => {
                if (e.target.value === '') setFilterVerified(null);
                else setFilterVerified(e.target.value === 'verified');
              }}
              className="px-3 py-2 bg-black/50 border border-matrix-green/40 rounded text-matrix-green focus:border-matrix-green focus:outline-none"
            >
              <option value="">All Tokens</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
            
            <select
              value={filterRisk || ''}
              onChange={(e) => {
                setFilterRisk(e.target.value as 'low' | 'medium' | 'high' | null || null);
              }}
              className="px-3 py-2 bg-black/50 border border-matrix-green/40 rounded text-matrix-green focus:border-matrix-green focus:outline-none"
            >
              <option value="">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="px-3 py-2 flex items-center gap-1 bg-black/50 border border-matrix-green/40 rounded text-matrix-green hover:bg-matrix-green/10"
            >
              <Sliders size={14} />
              <span>Advanced</span>
            </button>
          </div>
        </div>

        {/* Advanced filters */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 border border-matrix-green/30 rounded-lg bg-black/30 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-matrix-green/80 mb-1 text-sm">Chain</label>
                    <select
                      value={filterChain || 'all'}
                      onChange={(e) => setFilterChain(e.target.value === 'all' ? null : e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-matrix-green/40 rounded text-matrix-green focus:border-matrix-green focus:outline-none"
                    >
                      <option value="all">All Chains</option>
                      <option value="Ethereum">Ethereum</option>
                      <option value="BSC">BSC</option>
                      <option value="Polygon">Polygon</option>
                      <option value="Solana">Solana</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-matrix-green/80 mb-1 text-sm">Audit Status</label>
                    <select
                      value={filterAudited === null ? 'all' : filterAudited ? 'audited' : 'unaudited'}
                      onChange={(e) => {
                        if (e.target.value === 'all') setFilterAudited(null);
                        else setFilterAudited(e.target.value === 'audited');
                      }}
                      className="w-full px-3 py-2 bg-black/50 border border-matrix-green/40 rounded text-matrix-green focus:border-matrix-green focus:outline-none"
                    >
                      <option value="all">All Tokens</option>
                      <option value="audited">Audited Only</option>
                      <option value="unaudited">Unaudited Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-matrix-green/80 mb-1 text-sm">Team Identity</label>
                    <select
                      value={filterDoxxed === null ? 'all' : filterDoxxed ? 'doxxed' : 'anon'}
                      onChange={(e) => {
                        if (e.target.value === 'all') setFilterDoxxed(null);
                        else setFilterDoxxed(e.target.value === 'doxxed');
                      }}
                      className="w-full px-3 py-2 bg-black/50 border border-matrix-green/40 rounded text-matrix-green focus:border-matrix-green focus:outline-none"
                    >
                      <option value="all">All Teams</option>
                      <option value="doxxed">Doxxed Teams Only</option>
                      <option value="anon">Anonymous Teams Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-matrix-green/80 mb-1 text-sm">Min. Holders</label>
                    <select
                      value={filterMinHolders === null ? 'all' : filterMinHolders.toString()}
                      onChange={(e) => {
                        if (e.target.value === 'all') setFilterMinHolders(null);
                        else setFilterMinHolders(parseInt(e.target.value));
                      }}
                      className="w-full px-3 py-2 bg-black/50 border border-matrix-green/40 rounded text-matrix-green focus:border-matrix-green focus:outline-none"
                    >
                      <option value="all">Any Number</option>
                      <option value="100">100+</option>
                      <option value="500">500+</option>
                      <option value="1000">1,000+</option>
                      <option value="5000">5,000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-matrix-green/80 mb-1 text-sm">Min. Liquidity</label>
                    <select
                      value={filterMinLiquidity === null ? 'all' : filterMinLiquidity.toString()}
                      onChange={(e) => {
                        if (e.target.value === 'all') setFilterMinLiquidity(null);
                        else setFilterMinLiquidity(parseInt(e.target.value));
                      }}
                      className="w-full px-3 py-2 bg-black/50 border border-matrix-green/40 rounded text-matrix-green focus:border-matrix-green focus:outline-none"
                    >
                      <option value="all">Any Amount</option>
                      <option value="10000">$10K+</option>
                      <option value="50000">$50K+</option>
                      <option value="100000">$100K+</option>
                      <option value="500000">$500K+</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={resetFilters}
                      className="w-full px-3 py-2 bg-matrix-green/10 hover:bg-matrix-green/20 border border-matrix-green/40 rounded text-matrix-green"
                    >
                      Reset All Filters
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Token table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-black/90 backdrop-blur-sm border-b border-matrix-green/30">
            <tr>
              <th className="px-4 py-3 text-left">
                <button 
                  onClick={() => handleSort('name')}
                  className="flex items-center text-matrix-green/80 hover:text-matrix-green"
                >
                  Token <ArrowUpDown size={14} className="ml-1" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button 
                  onClick={() => handleSort('price')}
                  className="flex items-center justify-end text-matrix-green/80 hover:text-matrix-green"
                >
                  Price <ArrowUpDown size={14} className="ml-1" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button 
                  onClick={() => handleSort('priceChange24h')}
                  className="flex items-center justify-end text-matrix-green/80 hover:text-matrix-green"
                >
                  24h <ArrowUpDown size={14} className="ml-1" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button 
                  onClick={() => handleSort('marketCap')}
                  className="flex items-center justify-end text-matrix-green/80 hover:text-matrix-green"
                >
                  Market Cap <ArrowUpDown size={14} className="ml-1" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button 
                  onClick={() => handleSort('holders')}
                  className="flex items-center justify-end text-matrix-green/80 hover:text-matrix-green"
                >
                  Holders <ArrowUpDown size={14} className="ml-1" />
                </button>
              </th>
              <th className="px-4 py-3 text-center">
                <button 
                  onClick={() => handleSort('riskScore')}
                  className="flex items-center justify-center text-matrix-green/80 hover:text-matrix-green"
                >
                  Risk Level <ArrowUpDown size={14} className="ml-1" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button 
                  onClick={() => handleSort('launchDate')}
                  className="flex items-center justify-end text-matrix-green/80 hover:text-matrix-green"
                >
                  Launch Date <ArrowUpDown size={14} className="ml-1" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTokens.length > 0 ? (
              sortedTokens.map((token) => (
                <motion.tr 
                  key={token.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-matrix-green/10 hover:bg-matrix-green/5"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {token.verified ? (
                        <Shield size={16} className="text-green-400 mr-2" aria-label="Verified Token" />
                      ) : (
                        <AlertTriangle size={16} className="text-yellow-400 mr-2" aria-label="Unverified Token" />
                      )}
                      <div>
                        <div className="font-semibold text-matrix-green">{token.name}</div>
                        <div className="text-sm text-matrix-green/70 flex items-center gap-1">
                          <span>{token.symbol}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-matrix-green/10">{token.chainName}</span>
                          
                          {/* Add check for code audit */}
                          {token.auditStatus?.isAudited && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 flex items-center gap-0.5">
                              <Shield size={10} />
                              <span>Audited</span>
                            </span>
                          )}
                          
                          {/* Add check for team doxxed status */}
                          {token.team?.isDoxxed ? (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 flex items-center gap-0.5">
                              <Unlock size={10} />
                              <span>Doxxed</span>
                            </span>
                          ) : (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 flex items-center gap-0.5">
                              <Lock size={10} />
                              <span>Anon</span>
                            </span>
                          )}
                        </div>
                        
                        {/* Short address display */}
                        <div className="text-xs text-matrix-green/50 mt-1">
                          {token.address.substring(0, 6)}...{token.address.substring(token.address.length - 4)}
                          <button 
                            onClick={() => navigator.clipboard.writeText(token.address)}
                            className="ml-1 hover:text-matrix-green"
                            title="Copy address"
                          >
                            📋
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Price column with sparkline */}
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-mono text-right">{formatPrice(token.price)}</div>
                      {token.priceHistory && token.priceHistory.length > 0 && (
                        <div className="h-10 mt-1">
                          <Sparklines data={token.priceHistory} limit={20} width={80} height={30}>
                            <SparklinesLine 
                              color={token.priceChange24h >= 0 ? '#22c55e' : '#ef4444'} 
                              style={{ fill: "none" }} 
                            />
                            <SparklinesSpots size={1} />
                          </Sparklines>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  {/* Enhanced 24h change column */}
                  <td className={`px-4 py-3 text-right font-mono ${token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    <div className="flex items-center justify-end gap-1">
                      {token.priceChange24h >= 0 ? (
                        <TrendingUp size={14} />
                      ) : (
                        <TrendingDown size={14} />
                      )}
                      <span>{token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%</span>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3 text-right font-mono">{formatCurrency(token.marketCap)}</td>
                  <td className="px-4 py-3 text-right font-mono">{token.holders.toLocaleString()}</td>
                  
                  {/* Risk Level column with tooltip */}
                  <td className="px-4 py-3">
                    <div className="flex justify-center relative group">
                      <span className={`px-2 py-1 rounded text-xs ${getRiskColor(token.riskScore)} bg-black/30 border border-current flex items-center gap-1`}>
                        {getRiskText(token.riskScore)}
                        <Info size={10} />
                      </span>
                      
                      {/* Tooltip that shows on hover */}
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-60 p-2 bg-black border border-matrix-green rounded shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="text-sm">
                          <div className="font-semibold mb-1 text-matrix-green">Risk Factors:</div>
                          {token.riskFactors && token.riskFactors.length > 0 ? (
                            <ul className="list-disc pl-4 space-y-0.5 text-xs">
                              {token.riskFactors.map((factor, idx) => (
                                <li key={idx}>{factor}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-green-400">No significant risk factors</p>
                          )}
                          
                          {token.lockupPeriod && (
                                                       <div className="mt-1.5 pt-1.5 border-t border-matrix-green/20">
                                                       <div className="text-xs flex gap-1 items-center">
                                                         <Lock size={10} />
                                                         <span>{token.lockupPercentage}% tokens locked for {token.lockupPeriod} days</span>
                                                       </div>
                                                     </div>
                                                   )}
                                                 </div>
                                               </div>
                                             </div>
                                           </td>
                                           
                                           {/* Enhanced Launch Date column with "New" badge for recent tokens */}
                                           <td className="px-4 py-3 text-right">
                                             <div>
                                               <div className="text-matrix-green/70">
                                                 {new Date(token.launchDate).toLocaleDateString()}
                                               </div>
                                               {Date.now() - new Date(token.launchDate).getTime() < 1000 * 60 * 60 * 24 * 2 && (
                                                 <span className="inline-flex items-center ml-2 px-1.5 py-0.5 rounded text-xs bg-matrix-green text-black">
                                                   <Zap size={10} className="mr-0.5" />
                                                   New
                                                 </span>
                                               )}
                                             </div>
                                           </td>
                                           
                                           {/* Actions column */}
                                           <td className="px-4 py-3 text-right">
                                             <div className="flex justify-end space-x-2">
                                               <button 
                                                 onClick={() => window.open(`https://etherscan.io/token/${token.address}`, '_blank')}
                                                 className="p-1.5 rounded-full bg-black/50 border border-matrix-green/30 hover:bg-matrix-green/20 hover:border-matrix-green/60"
                                                 title="View on Blockchain Explorer"
                                               >
                                                 <ExternalLink size={14} className="text-matrix-green" />
                                               </button>
                                               
                                               <button 
                                                 onClick={() => showTokenDetails(token.id)}
                                                 className="p-1.5 rounded-full bg-black/50 border border-matrix-green/30 hover:bg-matrix-green/20 hover:border-matrix-green/60"
                                                 title="View Details"
                                               >
                                                 <Eye size={14} className="text-matrix-green" />
                                               </button>
                                             </div>
                                           </td>
                                         </motion.tr>
                                       ))
                                     ) : (
                                       <tr>
                                         <td colSpan={8} className="px-4 py-8 text-center text-matrix-green/50">
                                           No tokens match your search criteria
                                         </td>
                                       </tr>
                                     )}
                                   </tbody>
                                 </table>
                               </div>
                               
                               {/* Footer with stats */}
                               <div className="p-3 border-t border-matrix-green/30 text-sm text-matrix-green/60 flex justify-between">
                                 <div>Displaying {sortedTokens.length} tokens</div>
                                 <div>Last updated: {new Date().toLocaleTimeString()}</div>
                               </div>
                         
                               {/* Token Detail Modal */}
                               <TokenDetailModal
                                 isOpen={isTokenDetailOpen}
                                 onClose={() => setIsTokenDetailOpen(false)}
                                 token={selectedToken}
                               />
                             </div>
                           );
                         };
                         
                         export default CipherMatrix;