// src/components/analytics/TokenDetailModal.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { X, Shield, AlertTriangle, ExternalLink, TrendingUp, TrendingDown, Github as GitHub, Twitter, FileText, Lock, Unlock, Users, DollarSign, Percent, Activity, BarChart2 } from 'lucide-react';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';

// Use the enhanced Token interface from CipherMatrix.tsx
interface Token {
  id: string;
  name: string;
  symbol: string;
  address: string;
  chainId: string;
  chainName: string; // e.g., "Ethereum", "BSC"
  launchDate: string; // ISO string format recommended
  marketCap: number;
  price: number;
  priceChange24h: number; // Percentage change
  holders: number;
  liquidity: number; // In USD
  riskScore: number; // e.g., 0-100
  riskFactors: string[];
  verified: boolean; // If contract source is verified
  priceHistory: number[]; // Array of prices for sparkline
  totalSupply: number;
  circulatingSupply: number;
  lockupPeriod?: number; // In days
  lockupPercentage?: number; // Percentage of supply locked
  team: {
    name: string;
    isDoxxed: boolean;
    hasPriorProjects: boolean;
  };
  auditStatus: {
    isAudited: boolean;
    auditCompany?: string;
    auditUrl?: string;
    score?: number; // Optional audit score
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
  // Potential TODO: Add explorer base URL based on chainId/chainName
  // explorerBaseUrl: string;
}

interface TokenDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: Token | null;
}

const TokenDetailModal: React.FC<TokenDetailModalProps> = ({ isOpen, onClose, token }) => {
  if (!isOpen || !token) return null;

  // Helper functions
  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    }
    return value.toLocaleString();
  };

  const formatPrice = (price: number) => {
    if (price < 0.00001 && price > 0) { // Handle potential zero price
      return `$${price.toExponential(4)}`;
    }
    return `$${price.toFixed(6)}`;
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-400';
    if (score < 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskBgColor = (score: number) => {
    if (score < 30) return 'bg-green-400/10';
    if (score < 60) return 'bg-yellow-400/10';
    return 'bg-red-400/10';
  };

  const getRiskText = (score: number) => {
    if (score < 30) return 'Low Risk';
    if (score < 60) return 'Medium Risk';
    return 'High Risk';
  };

  // TODO: Replace with a function that gets the correct explorer URL based on chainName/chainId
  const getExplorerUrl = (address: string, chainName: string) => {
      // Simple example, expand as needed
      if (chainName.toLowerCase().includes('ethereum')) {
          return `https://etherscan.io/token/${address}`;
      }
      if (chainName.toLowerCase().includes('bsc') || chainName.toLowerCase().includes('binance')) {
          return `https://bscscan.com/token/${address}`;
      }
      // Add more chains (Polygon, Arbitrum, etc.)
      return `https://etherscan.io/token/${address}`; // Default fallback
  }

  const calculateUnlockDate = (launch: string, period: number) => {
      try {
          const launchDate = new Date(launch);
          const unlockTimestamp = launchDate.getTime() + period * 24 * 60 * 60 * 1000;
          return new Date(unlockTimestamp).toLocaleDateString();
      } catch (e) {
          console.error("Error calculating unlock date:", e);
          return "Invalid Date";
      }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-black border border-matrix-green rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-lg shadow-matrix-green/20"
      >
        {/* Header */}
        <div className="p-4 border-b border-matrix-green/30 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            {token.verified ? (
              <Shield className="text-green-400" size={20} aria-label="Verified Token" />
            ) : (
              <AlertTriangle className="text-yellow-400" size={20} aria-label="Unverified Token" />
            )}
            <h2 className="text-xl font-mono text-matrix-green flex items-center gap-2">
              {token.name} <span className="text-matrix-green/70 text-base">({token.symbol})</span>
            </h2>
            <span className="text-xs px-2 py-1 rounded bg-matrix-green/10 text-matrix-green/80">{token.chainName}</span>
          </div>
          <button
            onClick={onClose}
            className="text-matrix-green/70 hover:text-matrix-green transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-matrix-green/50 scrollbar-track-black/30">
          {/* Price and Chart Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price Info */}
            <div className="bg-black/30 border border-matrix-green/30 rounded-lg p-4">
              <h3 className="text-lg font-medium text-matrix-green mb-4">Price Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-matrix-green/70">Current Price:</span>
                  <span className="text-matrix-green font-mono font-bold">{formatPrice(token.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-matrix-green/70">24h Change:</span>
                  <span className={`font-mono font-bold flex items-center gap-1 ${token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {token.priceChange24h >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-matrix-green/70">Market Cap:</span>
                  <span className="text-matrix-green font-mono">{formatCurrency(token.marketCap)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-matrix-green/70">Liquidity:</span>
                  <span className="text-matrix-green font-mono">{formatCurrency(token.liquidity)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-matrix-green/70">Holders:</span>
                  <span className="text-matrix-green font-mono">{formatNumber(token.holders)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-matrix-green/70">Launch Date:</span>
                  <span className="text-matrix-green">{new Date(token.launchDate).toLocaleDateString()}</span>
                </div>
                {/* --- FIX 1: Added opening <a> tag --- */}
                <div className="pt-2 mt-2 border-t border-matrix-green/20">
                  <a
                    href={getExplorerUrl(token.address, token.chainName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-matrix-green hover:underline text-sm transition-colors"
                  >
                    <ExternalLink size={12} />
                    <span>View on {token.chainName} Explorer</span>
                  </a>
                </div>
                {/* --- End Fix 1 --- */}
              </div>
            </div>

            {/* Price Chart */}
            <div className="md:col-span-2 bg-black/30 border border-matrix-green/30 rounded-lg p-4">
              <h3 className="text-lg font-medium text-matrix-green mb-4">Price History (7d - Placeholder)</h3>
              <div className="h-40">
                {token.priceHistory && token.priceHistory.length > 1 ? ( // Need at least 2 points to draw a line
                  <Sparklines data={token.priceHistory} margin={10} height={120}>
                    <SparklinesLine
                      color={token.priceHistory[token.priceHistory.length -1] >= token.priceHistory[0] ? '#10b981' : '#ef4444'} // Color based on start vs end
                      style={{ strokeWidth: 2, fill: "none" }}
                    />
                    <SparklinesSpots size={3} style={{ fill: '#0f0' }} />
                  </Sparklines>
                ) : (
                  <div className="h-full flex items-center justify-center text-matrix-green/50">
                    No price history data available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Token Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Supply Information */}
            <div className="bg-black/30 border border-matrix-green/30 rounded-lg p-4">
              <h3 className="text-lg font-medium text-matrix-green mb-4">Supply Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-matrix-green/70">Total Supply:</span>
                  <span className="text-matrix-green font-mono">{formatNumber(token.totalSupply)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-matrix-green/70">Circulating Supply:</span>
                  <span className="text-matrix-green font-mono">{formatNumber(token.circulatingSupply)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-matrix-green/70">Circulation Ratio:</span>
                  <span className="text-matrix-green font-mono">
                    {token.totalSupply > 0 ? ((token.circulatingSupply / token.totalSupply) * 100).toFixed(2) : '0.00'}%
                  </span>
                </div>

                {token.lockupPeriod !== undefined && token.lockupPercentage !== undefined && ( // Check both exist
                  <>
                    <div className="border-t border-matrix-green/20 my-2 pt-2">
                      <div className="flex items-center gap-1 text-matrix-green mb-2">
                        <Lock size={14} />
                        <span className="font-semibold">Token Lockup</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-matrix-green/70">Locked Tokens:</span>
                          <span className="text-matrix-green font-mono">{token.lockupPercentage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-matrix-green/70">Lock Duration:</span>
                          <span className="text-matrix-green font-mono">{token.lockupPeriod} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-matrix-green/70">Unlock Date:</span>
                          <span className="text-matrix-green font-mono">
                             {calculateUnlockDate(token.launchDate, token.lockupPeriod)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Team & Project Information */}
            <div className="bg-black/30 border border-matrix-green/30 rounded-lg p-4">
              <h3 className="text-lg font-medium text-matrix-green mb-4">Team & Audit</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-matrix-green/70">Team Name:</span>
                  <span className="text-matrix-green">{token.team.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-matrix-green/70">Identity Status:</span>
                  <span className={`${token.team.isDoxxed ? 'text-green-400' : 'text-yellow-400'} flex items-center gap-1`}>
                    {token.team.isDoxxed ? (
                      <>
                        <Unlock size={14} />
                        <span>Doxxed</span>
                      </>
                    ) : (
                      <>
                        <Lock size={14} />
                        <span>Anonymous</span>
                      </>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-matrix-green/70">Prior Projects:</span>
                  <span className={`${token.team.hasPriorProjects ? 'text-yellow-400' : 'text-green-400'}`}> {/* Often prior projects by anon teams are negative */}
                    {token.team.hasPriorProjects ? 'Yes' : 'No'}
                  </span>
                </div>

                <div className="border-t border-matrix-green/20 my-2 pt-2">
                  <div className="flex items-center gap-1 text-matrix-green mb-2">
                    <Shield size={14} />
                    <span className="font-semibold">Security Audit</span>
                  </div>

                  {token.auditStatus.isAudited ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-matrix-green/70">Audit Status:</span>
                        <span className="text-green-400">Audited</span>
                      </div>
                      {token.auditStatus.auditCompany && (
                        <div className="flex justify-between">
                          <span className="text-matrix-green/70">Audit Company:</span>
                          <span className="text-matrix-green">{token.auditStatus.auditCompany}</span>
                        </div>
                      )}
                      {token.auditStatus.score !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-matrix-green/70">Audit Score:</span>
                          <span className={`${token.auditStatus.score > 70 ? 'text-green-400' : token.auditStatus.score > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {token.auditStatus.score}/100
                          </span>
                        </div>
                      )}
                      {/* --- FIX 2: Added opening <a> tag --- */}
                      {token.auditStatus.auditUrl && (
                        <div className="mt-1">
                          <a
                            href={token.auditStatus.auditUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-matrix-green hover:underline text-sm transition-colors"
                          >
                            <FileText size={12} />
                            <span>View Audit Report</span>
                          </a>
                        </div>
                      )}
                      {/* --- End Fix 2 --- */}
                    </div>
                  ) : (
                    <div className="text-yellow-400 flex items-center gap-1">
                      <AlertTriangle size={14} />
                      <span>Not Audited</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Social & Community Metrics */}
            <div className="bg-black/30 border border-matrix-green/30 rounded-lg p-4">
              <h3 className="text-lg font-medium text-matrix-green mb-4">Community Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-matrix-green/70 flex items-center gap-1">
                    <Twitter size={14} />
                    <span>Twitter:</span>
                  </span>
                  <span className="text-matrix-green font-mono">{formatNumber(token.socialMetrics.twitterFollowers)} followers</span>
                </div>
                <div className="flex justify-between">
                   {/* Assuming Discord Icon isn't directly available in lucide, using Users */}
                   <span className="text-matrix-green/70 flex items-center gap-1"><Users size={14} /> Discord:</span>
                   <span className="text-matrix-green font-mono">{formatNumber(token.socialMetrics.discordMembers)} members</span>
                </div>
                <div className="flex justify-between">
                   {/* Assuming Telegram Icon isn't directly available in lucide, using Users */}
                   <span className="text-matrix-green/70 flex items-center gap-1"><Users size={14} /> Telegram:</span>
                   <span className="text-matrix-green font-mono">{formatNumber(token.socialMetrics.telegramMembers)} members</span>
                </div>

                {token.socialMetrics.githubStats && (
                  <div className="border-t border-matrix-green/20 my-2 pt-2">
                    <div className="flex items-center gap-1 text-matrix-green mb-2">
                      <GitHub size={14} />
                      <span className="font-semibold">GitHub Activity</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-matrix-green/70">Stars:</span>
                        <span className="text-matrix-green font-mono">{formatNumber(token.socialMetrics.githubStats.stars)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-matrix-green/70">Forks:</span>
                        <span className="text-matrix-green font-mono">{formatNumber(token.socialMetrics.githubStats.forks)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-matrix-green/70">Contributors:</span>
                        <span className="text-matrix-green font-mono">{formatNumber(token.socialMetrics.githubStats.contributors)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-matrix-green/70">Commits (all time):</span>
                        <span className="text-matrix-green font-mono">{formatNumber(token.socialMetrics.githubStats.commits)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Risk Assessment Section */}
          <div className="bg-black/30 border border-matrix-green/30 rounded-lg p-4">
            <h3 className="text-lg font-medium text-matrix-green mb-4">Risk Assessment</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRiskBgColor(token.riskScore)} ${getRiskColor(token.riskScore)} border ${getRiskColor(token.riskScore)}`}>
                    <span className="text-xl font-bold">{token.riskScore}</span>
                  </div>
                  <div>
                    <div className={`font-bold text-lg ${getRiskColor(token.riskScore)}`}>
                      {getRiskText(token.riskScore)}
                    </div>
                    <div className="text-sm text-matrix-green/70">Overall Risk Score (0-100)</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-matrix-green">Identified Risk Factors:</h4>
                  {token.riskFactors && token.riskFactors.length > 0 ? (
                    <ul className="space-y-1 pl-1">
                      {token.riskFactors.map((factor, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <AlertTriangle size={14} className="text-yellow-400 flex-shrink-0 mt-1" />
                          <span className="text-matrix-green/90 text-sm">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                     <div className="flex items-start gap-2 text-green-400">
                         <Shield size={14} className="flex-shrink-0 mt-1" />
                         <span className="text-sm">No major specific risk factors identified based on available data.</span>
                     </div>
                  )}
                </div>
              </div>

              {/* Risk Breakdown Bars - Simplified example */}
              <div className="space-y-4">
                <h4 className="font-medium text-matrix-green">Risk Breakdown (Illustrative):</h4>
                <div className="space-y-3">
                   {/* Team Risk */}
                   <div>
                       <div className="flex justify-between mb-1">
                           <span className="text-sm text-matrix-green/70">Team Risk (Anon/Doxxed)</span>
                           <span className="text-sm text-matrix-green/70">
                               {token.team.isDoxxed ? 'Low' : 'Medium'}
                           </span>
                       </div>
                       <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-matrix-green/20">
                           <div
                               className={`h-full ${token.team.isDoxxed ? 'bg-green-400' : 'bg-yellow-400'}`}
                               style={{ width: token.team.isDoxxed ? '30%' : '60%' }}
                           ></div>
                       </div>
                   </div>

                   {/* Code Security Risk */}
                   <div>
                       <div className="flex justify-between mb-1">
                           <span className="text-sm text-matrix-green/70">Code Security (Audit Status)</span>
                           <span className="text-sm text-matrix-green/70">
                               {token.auditStatus.isAudited ? (token.auditStatus.score !== undefined && token.auditStatus.score < 50 ? 'Medium' : 'Low') : 'High'}
                           </span>
                       </div>
                       <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-matrix-green/20">
                           <div
                               className={`h-full ${token.auditStatus.isAudited ? (token.auditStatus.score !== undefined && token.auditStatus.score < 50 ? 'bg-yellow-400' : 'bg-green-400') : 'bg-red-400'}`}
                               style={{ width: token.auditStatus.isAudited ? (token.auditStatus.score !== undefined && token.auditStatus.score < 50 ? '50%' : '20%') : '80%' }}
                           ></div>
                       </div>
                   </div>

                   {/* Tokenomics Risk */}
                   <div>
                       <div className="flex justify-between mb-1">
                           <span className="text-sm text-matrix-green/70">Tokenomics (Lockup)</span>
                           <span className="text-sm text-matrix-green/70">
                               {token.lockupPeriod && token.lockupPeriod > 30 ? 'Low' : 'Medium'} {/* Simplified */}
                           </span>
                       </div>
                       <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-matrix-green/20">
                           <div
                               className={`h-full ${token.lockupPeriod && token.lockupPeriod > 30 ? 'bg-green-400' : 'bg-yellow-400'}`}
                               style={{ width: token.lockupPeriod && token.lockupPeriod > 30 ? '25%' : '50%' }}
                           ></div>
                       </div>
                   </div>

                   {/* Market Volatility Risk */}
                   <div>
                       <div className="flex justify-between mb-1">
                           <span className="text-sm text-matrix-green/70">Market Volatility (24h Change)</span>
                           <span className="text-sm text-matrix-green/70">
                               {Math.abs(token.priceChange24h) > 25 ? 'High' : Math.abs(token.priceChange24h) > 10 ? 'Medium' : 'Low'}
                           </span>
                       </div>
                       <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-matrix-green/20">
                           <div
                               className={`h-full ${Math.abs(token.priceChange24h) > 25 ? 'bg-red-400' : Math.abs(token.priceChange24h) > 10 ? 'bg-yellow-400' : 'bg-green-400'}`}
                               style={{ width: Math.abs(token.priceChange24h) > 25 ? '75%' : Math.abs(token.priceChange24h) > 10 ? '50%' : '25%' }}
                           ></div>
                       </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-matrix-green/30 flex justify-between items-center flex-shrink-0">
          <div className="text-sm text-matrix-green/60 overflow-hidden text-ellipsis whitespace-nowrap pr-4">
            Token address: <span className="font-mono">{token.address}</span>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(token.address)}
            className="px-3 py-1 bg-matrix-green/10 border border-matrix-green/30 rounded text-matrix-green text-sm hover:bg-matrix-green/20 transition-colors flex-shrink-0"
          >
            Copy Address
          </button>
        </div>
      </motion.div> {/* This is the closing tag for the main motion.div */}
    </div>
  );
};

export default TokenDetailModal;