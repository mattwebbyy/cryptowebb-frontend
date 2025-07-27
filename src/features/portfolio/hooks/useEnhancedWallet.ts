// src/features/portfolio/hooks/useEnhancedWallet.ts
import { useState, useCallback } from 'react';

export interface EnhancedTokenHolding {
  address: string;
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  price: number;
  value: number;
  change24h: number;
  logo?: string;
}

export interface NetworkConfig {
  chainId: number;
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  tokens: {
    [address: string]: {
      symbol: string;
      name: string;
      decimals: number;
    };
  };
}

// Popular token contracts for different networks
export const SUPPORTED_NETWORKS: Record<number, NetworkConfig> = {
  1: { // Ethereum Mainnet
    chainId: 1,
    name: 'Ethereum',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    tokens: {
      '0xA0b86a33E6E6Ca61F4d84eEa21b2d4C57a9B60e7': {
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6
      },
      '0xdAC17F958D2ee523a2206206994597C13D831ec7': {
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6
      },
      '0x6B175474E89094C44Da98b954EedeAC495271d0F': {
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        decimals: 18
      },
      '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984': {
        symbol: 'UNI',
        name: 'Uniswap',
        decimals: 18
      },
      '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9': {
        symbol: 'AAVE',
        name: 'Aave Token',
        decimals: 18
      },
      '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': {
        symbol: 'WBTC',
        name: 'Wrapped BTC',
        decimals: 8
      },
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': {
        symbol: 'WETH',
        name: 'Wrapped Ether',
        decimals: 18
      }
    }
  },
  137: { // Polygon
    chainId: 137,
    name: 'Polygon',
    nativeCurrency: { name: 'Polygon', symbol: 'MATIC', decimals: 18 },
    tokens: {
      '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': {
        symbol: 'USDC',
        name: 'USD Coin (PoS)',
        decimals: 6
      },
      '0xc2132D05D31c914a87C6611C10748AEb04B58e8F': {
        symbol: 'USDT',
        name: 'Tether USD (PoS)',
        decimals: 6
      }
    }
  },
  56: { // BSC
    chainId: 56,
    name: 'BNB Smart Chain',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    tokens: {
      '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d': {
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 18
      },
      '0x55d398326f99059fF775485246999027B3197955': {
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 18
      }
    }
  }
};

// ERC-20 ABI for balance and basic token info
const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  }
];

export const useEnhancedWallet = () => {
  const [tokens, setTokens] = useState<EnhancedTokenHolding[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch prices from CoinGecko
  const fetchTokenPrices = useCallback(async (symbols: string[]) => {
    try {
      const symbolsParam = symbols.map(s => s.toLowerCase()).join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${symbolsParam}&vs_currencies=usd&include_24hr_change=true`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Price fetch error:', error);
      return {};
    }
  }, []);

  // Get token balance using Web3
  const getTokenBalance = useCallback(async (
    tokenAddress: string, 
    walletAddress: string
  ): Promise<string> => {
    if (!window.ethereum) {
      throw new Error('No Web3 provider available');
    }

    try {
      // Create contract instance
      const contract = new (window as any).web3.eth.Contract(ERC20_ABI, tokenAddress);
      
      // Get balance
      const balance = await contract.methods.balanceOf(walletAddress).call();
      return balance;
    } catch (error) {
      console.error(`Error fetching balance for ${tokenAddress}:`, error);
      return '0';
    }
  }, []);

  // Convert Wei to human readable format
  const formatTokenBalance = useCallback((balance: string, decimals: number): string => {
    if (balance === '0') return '0';
    
    const divisor = Math.pow(10, decimals);
    const formattedBalance = parseFloat(balance) / divisor;
    return formattedBalance.toString();
  }, []);

  // Fetch ETH balance
  const getETHBalance = useCallback(async (walletAddress: string): Promise<string> => {
    if (!window.ethereum) {
      throw new Error('No Web3 provider available');
    }

    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [walletAddress, 'latest']
      });

      // Convert from Wei to ETH
      const ethBalance = parseInt(balance, 16) / 1e18;
      return ethBalance.toString();
    } catch (error) {
      console.error('Error fetching ETH balance:', error);
      return '0';
    }
  }, []);

  // Main function to fetch all wallet tokens
  const fetchWalletTokens = useCallback(async (walletAddress: string, chainId?: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const currentChainId = chainId || 1; // Default to Ethereum mainnet
      const networkConfig = SUPPORTED_NETWORKS[currentChainId];
      
      if (!networkConfig) {
        throw new Error(`Unsupported network: ${currentChainId}`);
      }

      const tokenHoldings: EnhancedTokenHolding[] = [];

      // 1. Get native currency balance (ETH, MATIC, BNB)
      const nativeBalance = await getETHBalance(walletAddress);
      if (parseFloat(nativeBalance) > 0) {
        tokenHoldings.push({
          address: 'native',
          symbol: networkConfig.nativeCurrency.symbol,
          name: networkConfig.nativeCurrency.name,
          balance: nativeBalance,
          decimals: networkConfig.nativeCurrency.decimals,
          price: 0, // Will be filled by price service
          value: 0,
          change24h: 0
        });
      }

      // 2. Get ERC-20 token balances
      const tokenPromises = Object.entries(networkConfig.tokens).map(async ([address, tokenInfo]) => {
        try {
          const balance = await getTokenBalance(address, walletAddress);
          const formattedBalance = formatTokenBalance(balance, tokenInfo.decimals);
          
          if (parseFloat(formattedBalance) > 0) {
            return {
              address,
              symbol: tokenInfo.symbol,
              name: tokenInfo.name,
              balance: formattedBalance,
              decimals: tokenInfo.decimals,
              price: 0, // Will be filled by price service
              value: 0,
              change24h: 0
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching ${tokenInfo.symbol} balance:`, error);
          return null;
        }
      });

      const tokenResults = await Promise.all(tokenPromises);
      const validTokens = tokenResults.filter(token => token !== null) as EnhancedTokenHolding[];
      
      tokenHoldings.push(...validTokens);

      // 3. Fetch prices for all tokens
      if (tokenHoldings.length > 0) {
        const symbols = tokenHoldings.map(token => {
          // Map symbols to CoinGecko IDs
          const symbolMap: Record<string, string> = {
            'ETH': 'ethereum',
            'MATIC': 'matic-network',
            'BNB': 'binancecoin',
            'USDC': 'usd-coin',
            'USDT': 'tether',
            'DAI': 'dai',
            'UNI': 'uniswap',
            'AAVE': 'aave',
            'WBTC': 'wrapped-bitcoin',
            'WETH': 'weth'
          };
          return symbolMap[token.symbol] || token.symbol.toLowerCase();
        });

        const prices = await fetchTokenPrices(symbols);

        // Update token holdings with price data
        tokenHoldings.forEach(token => {
          const symbolId = symbols[tokenHoldings.indexOf(token)];
          const priceData = prices[symbolId];
          
          if (priceData) {
            token.price = priceData.usd || 0;
            token.value = parseFloat(token.balance) * token.price;
            token.change24h = priceData.usd_24h_change || 0;
          }
        });
      }

      // Sort by value (highest first)
      tokenHoldings.sort((a, b) => b.value - a.value);
      
      setTokens(tokenHoldings);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch wallet tokens');
      console.error('Enhanced wallet fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [getETHBalance, getTokenBalance, formatTokenBalance, fetchTokenPrices]);

  // Get total portfolio value
  const getTotalValue = useCallback(() => {
    return tokens.reduce((total, token) => total + token.value, 0);
  }, [tokens]);

  // Get portfolio allocation percentages
  const getPortfolioAllocation = useCallback(() => {
    const totalValue = getTotalValue();
    if (totalValue === 0) return tokens;

    return tokens.map(token => ({
      ...token,
      allocation: (token.value / totalValue) * 100
    }));
  }, [tokens, getTotalValue]);

  return {
    tokens,
    isLoading,
    error,
    fetchWalletTokens,
    getTotalValue,
    getPortfolioAllocation,
    supportedNetworks: SUPPORTED_NETWORKS
  };
};

export default useEnhancedWallet;