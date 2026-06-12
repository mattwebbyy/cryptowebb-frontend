// src/features/cipher/components/TokenFilters.tsx — search, quick filters, advanced filter panel.
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Sliders } from 'lucide-react';
import { Input, Label, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { RiskLevel } from '../types';
import type { TokenFiltersState } from '../useTokenFilters';

interface TokenFiltersProps {
  filters: TokenFiltersState;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
}

export const TokenFilters = ({ filters, showAdvanced, onToggleAdvanced }: TokenFiltersProps) => {
  const {
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
    resetFilters,
  } = filters;

  return (
    <>
      {/* Search and basic filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary"
            aria-hidden="true"
          />
          <Input
            type="text"
            placeholder="Search by name, symbol, or address…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label="Search tokens"
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={filterVerified === null ? '' : filterVerified ? 'verified' : 'unverified'}
            onChange={(e) => {
              if (e.target.value === '') setFilterVerified(null);
              else setFilterVerified(e.target.value === 'verified');
            }}
            aria-label="Verification filter"
            className="w-auto"
          >
            <option value="">All tokens</option>
            <option value="verified">Verified only</option>
            <option value="unverified">Unverified only</option>
          </Select>

          <Select
            value={filterRisk || ''}
            onChange={(e) => setFilterRisk((e.target.value as RiskLevel) || null)}
            aria-label="Risk filter"
            className="w-auto"
          >
            <option value="">All risk levels</option>
            <option value="low">Low risk</option>
            <option value="medium">Medium risk</option>
            <option value="high">High risk</option>
          </Select>

          <Button variant="outline" onClick={onToggleAdvanced} aria-expanded={showAdvanced}>
            <Sliders size={14} className="mr-1.5" aria-hidden="true" />
            Advanced
          </Button>
        </div>
      </div>

      {/* Advanced filters */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 border border-border rounded-xl bg-surface-2 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cipher-chain">Chain</Label>
                  <Select
                    id="cipher-chain"
                    value={filterChain || 'all'}
                    onChange={(e) =>
                      setFilterChain(e.target.value === 'all' ? null : e.target.value)
                    }
                  >
                    <option value="all">All chains</option>
                    <option value="Ethereum">Ethereum</option>
                    <option value="BSC">BSC</option>
                    <option value="Polygon">Polygon</option>
                    <option value="Solana">Solana</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="cipher-audit">Audit status</Label>
                  <Select
                    id="cipher-audit"
                    value={filterAudited === null ? 'all' : filterAudited ? 'audited' : 'unaudited'}
                    onChange={(e) => {
                      if (e.target.value === 'all') setFilterAudited(null);
                      else setFilterAudited(e.target.value === 'audited');
                    }}
                  >
                    <option value="all">All tokens</option>
                    <option value="audited">Audited only</option>
                    <option value="unaudited">Unaudited only</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="cipher-team">Team identity</Label>
                  <Select
                    id="cipher-team"
                    value={filterDoxxed === null ? 'all' : filterDoxxed ? 'doxxed' : 'anon'}
                    onChange={(e) => {
                      if (e.target.value === 'all') setFilterDoxxed(null);
                      else setFilterDoxxed(e.target.value === 'doxxed');
                    }}
                  >
                    <option value="all">All teams</option>
                    <option value="doxxed">Doxxed teams only</option>
                    <option value="anon">Anonymous teams only</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="cipher-holders">Min. holders</Label>
                  <Select
                    id="cipher-holders"
                    value={filterMinHolders === null ? 'all' : filterMinHolders.toString()}
                    onChange={(e) => {
                      if (e.target.value === 'all') setFilterMinHolders(null);
                      else setFilterMinHolders(parseInt(e.target.value));
                    }}
                  >
                    <option value="all">Any number</option>
                    <option value="100">100+</option>
                    <option value="500">500+</option>
                    <option value="1000">1,000+</option>
                    <option value="5000">5,000+</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="cipher-liquidity">Min. liquidity</Label>
                  <Select
                    id="cipher-liquidity"
                    value={filterMinLiquidity === null ? 'all' : filterMinLiquidity.toString()}
                    onChange={(e) => {
                      if (e.target.value === 'all') setFilterMinLiquidity(null);
                      else setFilterMinLiquidity(parseInt(e.target.value));
                    }}
                  >
                    <option value="all">Any amount</option>
                    <option value="10000">$10K+</option>
                    <option value="50000">$50K+</option>
                    <option value="100000">$100K+</option>
                    <option value="500000">$500K+</option>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button variant="outline" className="w-full" onClick={resetFilters}>
                    Reset all filters
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
