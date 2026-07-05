// src/pages/analytics/CipherMatrix.tsx — token surveillance screen, composed from features/cipher.
import { useCallback, useState } from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import TokenDetailModal from '@/features/cipher/components/token-detail/TokenDetailModal';
import { Token } from '@/features/cipher/types';
import { mockTokens } from '@/features/cipher/mockTokens';
import { useTokenFilters } from '@/features/cipher/useTokenFilters';
import { TokenFilters } from '@/features/cipher/components/TokenFilters';
import { TokenTable } from '@/features/cipher/components/TokenTable';
import { TokenCardList } from '@/features/cipher/components/TokenCardList';

const CipherMatrix = () => {
  // TODO: replace the mock fixture with the backend token feed when it ships.
  const [tokens] = useState<Token[]>(mockTokens);
  const filters = useTokenFilters(tokens);

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isTokenDetailOpen, setIsTokenDetailOpen] = useState(false);

  const { isMobile } = useResponsive();

  const showTokenDetails = useCallback((token: Token) => {
    setSelectedToken(token);
    setIsTokenDetailOpen(true);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg md:text-xl font-semibold tracking-tight mb-4">Token surveillance</h2>
        <TokenFilters
          filters={filters}
          showAdvanced={showAdvancedFilters}
          onToggleAdvanced={() => setShowAdvancedFilters(!showAdvancedFilters)}
        />
      </div>

      {/* Token list */}
      <div className="flex-1 overflow-auto">
        {isMobile ? (
          <TokenCardList tokens={filters.sortedTokens} onShowDetails={showTokenDetails} />
        ) : (
          <TokenTable
            tokens={filters.sortedTokens}
            onSort={filters.handleSort}
            onShowDetails={showTokenDetails}
          />
        )}
      </div>

      {/* Footer with stats */}
      <div className="p-3 border-t border-border text-sm text-text-secondary flex justify-between">
        <div>Displaying {filters.sortedTokens.length} tokens</div>
        <div>Last updated: {new Date().toLocaleTimeString()}</div>
      </div>

      <TokenDetailModal
        isOpen={isTokenDetailOpen}
        onClose={() => setIsTokenDetailOpen(false)}
        token={selectedToken}
      />
    </div>
  );
};

export default CipherMatrix;
