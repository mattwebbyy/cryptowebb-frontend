// src/pages/analytics/CipherMatrix.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, AlertTriangle, Shield, ArrowUpDown, ExternalLink } from 'lucide-react';

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
    verified: true
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
    verified: false
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
    verified: true
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
    verified: false
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
    verified: true
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
    
    // Sort tokens
    if (sortConfig !== null) {
      filteredTokens.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filteredTokens;
  }, [tokens, sortConfig, searchQuery, filterVerified, filterRisk]);

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

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-matrix-green/30">
        <h2 className="text-xl font-mono text-matrix-green mb-4">Cipher Matrix: Token Surveillance System</h2>
        
        {/* Search and filters */}
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
          </div>
        </div>
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
            </tr>
          </thead>
          <tbody>
            {sortedTokens.length > 0 ? (
              sortedTokens.map(token => (
                <motion.tr 
                  key={token.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-matrix-green/10 hover:bg-matrix-green/5"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {token.verified ? (
                        <Shield size={16} className="text-green-400 mr-2" />
                      ) : (
                        <AlertTriangle size={16} className="text-yellow-400 mr-2" />
                      )}
                      <div>
                        <div className="font-semibold text-matrix-green">{token.name}</div>
                        <div className="text-sm text-matrix-green/70 flex items-center gap-1">
                          <span>{token.symbol}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-matrix-green/10">{token.chainName}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{formatPrice(token.price)}</td>
                  <td className={`px-4 py-3 text-right font-mono ${token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{formatCurrency(token.marketCap)}</td>
                  <td className="px-4 py-3 text-right font-mono">{token.holders.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <span className={`px-2 py-1 rounded text-xs ${getRiskColor(token.riskScore)} bg-black/30 border border-current`}>
                        {getRiskText(token.riskScore)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-matrix-green/70">
                    {new Date(token.launchDate).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-matrix-green/50">
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
    </div>
  );
};

export default CipherMatrix;