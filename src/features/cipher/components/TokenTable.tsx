// src/features/cipher/components/TokenTable.tsx — desktop table view of the token list.
import { motion } from 'framer-motion';
import { ArrowUpDown, Copy, ExternalLink, Eye, Zap } from 'lucide-react';
import { Sparkline } from '@/components/charts/Sparkline';
import { Token, formatCurrency, formatPrice, isNewLaunch, shortAddress } from '../types';
import { AuditBadge, PriceChange, RiskBadge, TeamBadge, VerifiedIcon } from './badges';

interface SortHeaderProps {
  label: string;
  onClick: () => void;
  align?: 'left' | 'right' | 'center';
}

const SortHeader = ({ label, onClick, align = 'left' }: SortHeaderProps) => (
  <button
    onClick={onClick}
    className={`flex items-center text-text-secondary hover:text-text transition-colors ${
      align === 'right' ? 'justify-end w-full' : align === 'center' ? 'justify-center w-full' : ''
    }`}
  >
    {label} <ArrowUpDown size={14} className="ml-1" aria-hidden="true" />
  </button>
);

interface TokenTableProps {
  tokens: Token[];
  onSort: (key: keyof Token) => void;
  onShowDetails: (token: Token) => void;
}

export const TokenTable = ({ tokens, onSort, onShowDetails }: TokenTableProps) => (
  <table className="w-full text-sm">
    <thead className="sticky top-0 bg-surface/95 backdrop-blur-sm border-b border-border z-10">
      <tr>
        <th className="px-4 py-3 text-left font-medium">
          <SortHeader label="Token" onClick={() => onSort('name')} />
        </th>
        <th className="px-4 py-3 text-right font-medium">
          <SortHeader label="Price" onClick={() => onSort('price')} align="right" />
        </th>
        <th className="px-4 py-3 text-right font-medium">
          <SortHeader label="24h" onClick={() => onSort('priceChange24h')} align="right" />
        </th>
        <th className="px-4 py-3 text-right font-medium">
          <SortHeader label="Market cap" onClick={() => onSort('marketCap')} align="right" />
        </th>
        <th className="px-4 py-3 text-right font-medium">
          <SortHeader label="Holders" onClick={() => onSort('holders')} align="right" />
        </th>
        <th className="px-4 py-3 text-center font-medium">
          <SortHeader label="Risk" onClick={() => onSort('riskScore')} align="center" />
        </th>
        <th className="px-4 py-3 text-right font-medium">
          <SortHeader label="Launched" onClick={() => onSort('launchDate')} align="right" />
        </th>
        <th className="px-4 py-3 text-right font-medium">Actions</th>
      </tr>
    </thead>
    <tbody>
      {tokens.length > 0 ? (
        tokens.map((token) => (
          <motion.tr
            key={token.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-b border-border hover:bg-surface-2/60 transition-colors"
          >
            <td className="px-4 py-3">
              <div className="flex items-center">
                <span className="mr-2">
                  <VerifiedIcon verified={token.verified} />
                </span>
                <div>
                  <div className="font-semibold">{token.name}</div>
                  <div className="text-sm text-text-secondary flex items-center gap-1.5 flex-wrap">
                    <span>{token.symbol}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                      {token.chainName}
                    </span>
                    <AuditBadge token={token} />
                    <TeamBadge token={token} />
                  </div>
                  <div className="text-xs text-text-secondary/70 font-mono mt-1 flex items-center gap-1">
                    {shortAddress(token.address)}
                    <button
                      onClick={() => navigator.clipboard.writeText(token.address)}
                      className="hover:text-text"
                      title="Copy address"
                      aria-label={`Copy ${token.symbol} address`}
                    >
                      <Copy size={11} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </td>

            <td className="px-4 py-3">
              <div>
                <div className="font-mono tabular-nums text-right">{formatPrice(token.price)}</div>
                {token.priceHistory && token.priceHistory.length > 0 && (
                  <div className="h-10 mt-1 flex justify-end">
                    <Sparkline
                      data={token.priceHistory.slice(-20)}
                      width={80}
                      height={30}
                      fill={false}
                      color={token.priceChange24h >= 0 ? 'var(--color-gain)' : 'var(--color-loss)'}
                    />
                  </div>
                )}
              </div>
            </td>

            <td className="px-4 py-3 text-right">
              <PriceChange change={token.priceChange24h} />
            </td>

            <td className="px-4 py-3 text-right font-mono tabular-nums">
              {formatCurrency(token.marketCap)}
            </td>
            <td className="px-4 py-3 text-right font-mono tabular-nums">
              {token.holders.toLocaleString()}
            </td>

            <td className="px-4 py-3">
              <RiskBadge token={token} />
            </td>

            <td className="px-4 py-3 text-right">
              <div className="text-text-secondary">
                {new Date(token.launchDate).toLocaleDateString()}
              </div>
              {isNewLaunch(token.launchDate) && (
                <span className="inline-flex items-center mt-1 px-1.5 py-0.5 rounded-full text-xs bg-primary text-white">
                  <Zap size={10} className="mr-0.5" aria-hidden="true" />
                  New
                </span>
              )}
            </td>

            <td className="px-4 py-3 text-right">
              <div className="flex justify-end gap-2">
                <button
                  onClick={() =>
                    window.open(`https://etherscan.io/token/${token.address}`, '_blank')
                  }
                  className="p-1.5 rounded-full bg-surface-2 border border-border hover:border-primary/40 hover:bg-primary/10 transition-colors"
                  title="View on blockchain explorer"
                  aria-label={`View ${token.symbol} on blockchain explorer`}
                >
                  <ExternalLink size={14} className="text-text-secondary" aria-hidden="true" />
                </button>

                <button
                  onClick={() => onShowDetails(token)}
                  className="p-1.5 rounded-full bg-surface-2 border border-border hover:border-primary/40 hover:bg-primary/10 transition-colors"
                  title="View details"
                  aria-label={`View ${token.symbol} details`}
                >
                  <Eye size={14} className="text-text-secondary" aria-hidden="true" />
                </button>
              </div>
            </td>
          </motion.tr>
        ))
      ) : (
        <tr>
          <td colSpan={8} className="px-4 py-8 text-center text-text-secondary">
            No tokens match your search criteria
          </td>
        </tr>
      )}
    </tbody>
  </table>
);
