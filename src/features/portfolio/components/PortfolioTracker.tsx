// src/features/portfolio/components/PortfolioTracker.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { GlitchButton } from '@/components/ui/GlitchEffects';
import { AdvancedChart } from '../../charts/components/AdvancedChartTypes';
import { 
  Wallet, 
  Plus, 
  Trash2, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Settings,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

// Types
export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  totalValue: number;
  totalCost: number;
  dayChange: number;
  dayChangePercent: number;
  holdings: PortfolioHolding[];
}

export interface PortfolioHolding {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  totalCost: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  allocation: number; // Percentage of portfolio
  dayChange: number;
  dayChangePercent: number;
  lastUpdated: string;
}

export interface WalletConnection {
  id: string;
  address: string;
  walletType: 'metamask' | 'walletconnect' | 'manual' | 'exchange';
  name?: string;
  isConnected: boolean;
  lastSync: string;
  chainId?: number;
  balance?: number;
}

export interface Transaction {
  id: string;
  portfolioId: string;
  type: 'buy' | 'sell' | 'transfer_in' | 'transfer_out';
  symbol: string;
  amount: number;
  price: number;
  fee: number;
  timestamp: string;
  txHash?: string;
  exchange?: string;
  notes?: string;
}

// Wallet Integration Hook
export const useWalletIntegration = () => {
  const [wallets, setWallets] = useState<WalletConnection[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectMetaMask = useCallback(async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const chainId = await window.ethereum.request({ 
        method: 'eth_chainId' 
      });

      const wallet: WalletConnection = {
        id: `metamask_${accounts[0]}`,
        address: accounts[0],
        walletType: 'metamask',
        name: `MetaMask (${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)})`,
        isConnected: true,
        lastSync: new Date().toISOString(),
        chainId: parseInt(chainId, 16)
      };

      setWallets(prev => {
        const filtered = prev.filter(w => w.address !== accounts[0]);
        return [...filtered, wallet];
      });

      // Sync wallet holdings
      await syncWalletHoldings(wallet);
      
    } catch (err: any) {
      setError(err.message || 'Failed to connect MetaMask');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const syncWalletHoldings = async (wallet: WalletConnection) => {
    try {
      // This would call your backend API to fetch wallet holdings
      const response = await fetch('/api/v1/portfolio/sync-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          address: wallet.address,
          chainId: wallet.chainId,
          walletType: wallet.walletType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to sync wallet holdings');
      }

      const data = await response.json();
      return data.holdings;
    } catch (err) {
      console.error('Wallet sync error:', err);
      throw err;
    }
  };

  const disconnectWallet = useCallback((walletId: string) => {
    setWallets(prev => prev.filter(w => w.id !== walletId));
  }, []);

  return {
    wallets,
    isConnecting,
    error,
    connectMetaMask,
    disconnectWallet,
    syncWalletHoldings
  };
};

// Portfolio API Hook
export const usePortfolioData = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [activePortfolio, setActivePortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolios = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/v1/portfolio', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch portfolios');
      }

      const data = await response.json();
      setPortfolios(data.portfolios);
      
      // Set default portfolio as active
      const defaultPortfolio = data.portfolios.find((p: Portfolio) => p.isDefault);
      if (defaultPortfolio) {
        setActivePortfolio(defaultPortfolio);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPortfolio = useCallback(async (name: string, description?: string) => {
    try {
      const response = await fetch('/api/v1/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name, description })
      });

      if (!response.ok) {
        throw new Error('Failed to create portfolio');
      }

      const newPortfolio = await response.json();
      setPortfolios(prev => [...prev, newPortfolio]);
      return newPortfolio;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const response = await fetch('/api/v1/portfolio/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(transaction)
      });

      if (!response.ok) {
        throw new Error('Failed to add transaction');
      }

      // Refresh portfolio data
      await fetchPortfolios();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [fetchPortfolios]);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  return {
    portfolios,
    activePortfolio,
    setActivePortfolio,
    isLoading,
    error,
    createPortfolio,
    addTransaction,
    refetchPortfolios: fetchPortfolios
  };
};

// Main Portfolio Tracker Component
export const PortfolioTracker: React.FC = () => {
  const [viewMode, setViewMode] = useState<'overview' | 'holdings' | 'transactions' | 'analytics'>('overview');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showWalletConnect, setShowWalletConnect] = useState(false);

  const {
    portfolios,
    activePortfolio,
    setActivePortfolio,
    isLoading,
    error: portfolioError,
    createPortfolio,
    addTransaction,
    refetchPortfolios
  } = usePortfolioData();

  const {
    wallets,
    isConnecting,
    error: walletError,
    connectMetaMask,
    disconnectWallet
  } = useWalletIntegration();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (portfolioError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{portfolioError}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-mono text-teal-600 dark:text-matrix-green">
            Portfolio Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your crypto holdings and performance
          </p>
        </div>

        <div className="flex gap-2">
          <GlitchButton
            variant="secondary"
            onClick={() => setShowWalletConnect(true)}
            className="gap-2"
          >
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </GlitchButton>
          
          <GlitchButton
            onClick={() => setShowAddTransaction(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </GlitchButton>
        </div>
      </div>

      {/* Portfolio Selector */}
      {portfolios.length > 1 && (
        <Card className="p-4 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-teal-600 dark:text-matrix-green">Portfolio:</span>
            <select
              value={activePortfolio?.id || ''}
              onChange={(e) => {
                const portfolio = portfolios.find(p => p.id === e.target.value);
                if (portfolio) setActivePortfolio(portfolio);
              }}
              className="bg-transparent border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-teal-600 dark:text-matrix-green focus:ring-2 focus:ring-teal-600 dark:focus:ring-matrix-green"
            >
              {portfolios.map(portfolio => (
                <option key={portfolio.id} value={portfolio.id} className="bg-white dark:bg-black">
                  {portfolio.name} {portfolio.isDefault ? '(Default)' : ''}
                </option>
              ))}
            </select>
          </div>
        </Card>
      )}

      {/* Portfolio Overview Cards */}
      {activePortfolio && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
                <p className="text-2xl font-bold text-teal-600 dark:text-matrix-green">
                  ${activePortfolio.totalValue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-teal-600 dark:text-matrix-green opacity-60" />
            </div>
          </Card>

          <Card className="p-4 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total P&L</p>
                <p className={`text-2xl font-bold ${
                  (activePortfolio.totalValue - activePortfolio.totalCost) >= 0 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`}>
                  ${(activePortfolio.totalValue - activePortfolio.totalCost).toLocaleString()}
                </p>
              </div>
              {(activePortfolio.totalValue - activePortfolio.totalCost) >= 0 ? (
                <TrendingUp className="w-8 h-8 text-green-500 opacity-60" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-500 opacity-60" />
              )}
            </div>
          </Card>

          <Card className="p-4 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">24h Change</p>
                <p className={`text-2xl font-bold ${
                  activePortfolio.dayChange >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {activePortfolio.dayChangePercent >= 0 ? '+' : ''}
                  {activePortfolio.dayChangePercent.toFixed(2)}%
                </p>
              </div>
              {activePortfolio.dayChange >= 0 ? (
                <TrendingUp className="w-8 h-8 text-green-500 opacity-60" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-500 opacity-60" />
              )}
            </div>
          </Card>

          <Card className="p-4 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Holdings</p>
                <p className="text-2xl font-bold text-teal-600 dark:text-matrix-green">
                  {activePortfolio.holdings.length}
                </p>
              </div>
              <PieChart className="w-8 h-8 text-teal-600 dark:text-matrix-green opacity-60" />
            </div>
          </Card>
        </div>
      )}

      {/* View Mode Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: PieChart },
          { id: 'holdings', label: 'Holdings', icon: BarChart3 },
          { id: 'transactions', label: 'Transactions', icon: RefreshCw },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setViewMode(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors font-mono text-sm ${
              viewMode === tab.id
                ? 'bg-teal-600 dark:bg-matrix-green text-white dark:text-black'
                : 'text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-matrix-green'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* View Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === 'overview' && activePortfolio && (
            <PortfolioOverview portfolio={activePortfolio} />
          )}
          
          {viewMode === 'holdings' && activePortfolio && (
            <PortfolioHoldings holdings={activePortfolio.holdings} />
          )}
          
          {viewMode === 'transactions' && (
            <PortfolioTransactions portfolioId={activePortfolio?.id || ''} />
          )}
          
          {viewMode === 'analytics' && activePortfolio && (
            <PortfolioAnalytics portfolio={activePortfolio} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Connected Wallets */}
      {wallets.length > 0 && (
        <Card className="p-4 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
          <h3 className="text-lg font-semibold text-teal-600 dark:text-matrix-green mb-4">
            Connected Wallets
          </h3>
          <div className="space-y-2">
            {wallets.map(wallet => (
              <div key={wallet.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${wallet.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{wallet.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Last sync: {new Date(wallet.lastSync).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => disconnectWallet(wallet.id)}
                >
                  Disconnect
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Wallet Connection Modal */}
      <AnimatePresence>
        {showWalletConnect && (
          <WalletConnectModal
            isOpen={showWalletConnect}
            onClose={() => setShowWalletConnect(false)}
            onConnectMetaMask={connectMetaMask}
            isConnecting={isConnecting}
            error={walletError}
          />
        )}
      </AnimatePresence>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {showAddTransaction && (
          <AddTransactionModal
            isOpen={showAddTransaction}
            onClose={() => setShowAddTransaction(false)}
            portfolioId={activePortfolio?.id || ''}
            onAddTransaction={addTransaction}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Portfolio Overview Component
const PortfolioOverview: React.FC<{ portfolio: Portfolio }> = ({ portfolio }) => {
  const treemapData = portfolio.holdings.map(holding => ({
    name: holding.symbol,
    value: holding.totalValue,
    colorValue: holding.unrealizedPnLPercent
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-4 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
        <h3 className="text-lg font-semibold text-teal-600 dark:text-matrix-green mb-4">
          Portfolio Allocation
        </h3>
        <AdvancedChart
          chartType="treemap"
          data={treemapData}
          height={300}
        />
      </Card>

      <Card className="p-4 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
        <h3 className="text-lg font-semibold text-teal-600 dark:text-matrix-green mb-4">
          Top Holdings
        </h3>
        <div className="space-y-3">
          {portfolio.holdings
            .sort((a, b) => b.totalValue - a.totalValue)
            .slice(0, 5)
            .map(holding => (
              <div key={holding.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-600 dark:bg-matrix-green flex items-center justify-center text-white dark:text-black text-xs font-bold">
                    {holding.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{holding.symbol}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{holding.amount.toFixed(4)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    ${holding.totalValue.toLocaleString()}
                  </p>
                  <p className={`text-sm ${holding.unrealizedPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {holding.unrealizedPnL >= 0 ? '+' : ''}
                    {holding.unrealizedPnLPercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
};

// Portfolio Holdings Component
const PortfolioHoldings: React.FC<{ holdings: PortfolioHolding[] }> = ({ holdings }) => {
  return (
    <Card className="bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left p-4 font-mono text-teal-600 dark:text-matrix-green">Asset</th>
              <th className="text-right p-4 font-mono text-teal-600 dark:text-matrix-green">Amount</th>
              <th className="text-right p-4 font-mono text-teal-600 dark:text-matrix-green">Price</th>
              <th className="text-right p-4 font-mono text-teal-600 dark:text-matrix-green">Value</th>
              <th className="text-right p-4 font-mono text-teal-600 dark:text-matrix-green">P&L</th>
              <th className="text-right p-4 font-mono text-teal-600 dark:text-matrix-green">24h</th>
              <th className="text-right p-4 font-mono text-teal-600 dark:text-matrix-green">Allocation</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map(holding => (
              <tr key={holding.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-600 dark:bg-matrix-green flex items-center justify-center text-white dark:text-black text-xs font-bold">
                      {holding.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{holding.symbol}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{holding.name}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-right text-gray-800 dark:text-gray-200">
                  {holding.amount.toFixed(4)}
                </td>
                <td className="p-4 text-right text-gray-800 dark:text-gray-200">
                  ${holding.currentPrice.toFixed(2)}
                </td>
                <td className="p-4 text-right text-gray-800 dark:text-gray-200">
                  ${holding.totalValue.toLocaleString()}
                </td>
                <td className={`p-4 text-right ${holding.unrealizedPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {holding.unrealizedPnL >= 0 ? '+' : ''}${Math.abs(holding.unrealizedPnL).toLocaleString()}
                  <br />
                  <span className="text-sm">
                    ({holding.unrealizedPnLPercent >= 0 ? '+' : ''}{holding.unrealizedPnLPercent.toFixed(2)}%)
                  </span>
                </td>
                <td className={`p-4 text-right ${holding.dayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {holding.dayChangePercent >= 0 ? '+' : ''}{holding.dayChangePercent.toFixed(2)}%
                </td>
                <td className="p-4 text-right text-gray-800 dark:text-gray-200">
                  {holding.allocation.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// Portfolio Transactions Component (placeholder)
const PortfolioTransactions: React.FC<{ portfolioId: string }> = ({ portfolioId }) => {
  return (
    <Card className="p-4 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
      <p className="text-center text-gray-600 dark:text-gray-400">
        Transaction history will be displayed here
      </p>
    </Card>
  );
};

// Portfolio Analytics Component (placeholder)
const PortfolioAnalytics: React.FC<{ portfolio: Portfolio }> = ({ portfolio }) => {
  return (
    <Card className="p-4 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
      <p className="text-center text-gray-600 dark:text-gray-400">
        Advanced analytics charts will be displayed here
      </p>
    </Card>
  );
};

// Wallet Connect Modal (placeholder)
const WalletConnectModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConnectMetaMask: () => void;
  isConnecting: boolean;
  error: string | null;
}> = ({ isOpen, onClose, onConnectMetaMask, isConnecting, error }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="p-6 bg-white/95 dark:bg-black/95 border-teal-600 dark:border-matrix-green max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-teal-600 dark:text-matrix-green mb-4">
          Connect Wallet
        </h3>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <GlitchButton
            onClick={onConnectMetaMask}
            disabled={isConnecting}
            className="w-full justify-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            {isConnecting ? 'Connecting...' : 'MetaMask'}
          </GlitchButton>
          
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
};

// Add Transaction Modal (placeholder)
const AddTransactionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  portfolioId: string;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
}> = ({ isOpen, onClose, portfolioId, onAddTransaction }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="p-6 bg-white/95 dark:bg-black/95 border-teal-600 dark:border-matrix-green max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-teal-600 dark:text-matrix-green mb-4">
          Add Transaction
        </h3>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
          Transaction form will be implemented here
        </p>
        <Button
          variant="outline"
          onClick={onClose}
          className="w-full"
        >
          Close
        </Button>
      </Card>
    </div>
  );
};

export default PortfolioTracker;