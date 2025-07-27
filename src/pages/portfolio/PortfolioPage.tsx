// src/pages/analytics/PortfolioPage.tsx
import React from 'react';
import { PortfolioTracker } from '@/features/portfolio/components/PortfolioTracker';
import { EnhancedSEO } from '@/components/EnhancedSEO';

export const PortfolioPage: React.FC = () => {
  return (
    <>
      <EnhancedSEO
        title="Portfolio Tracker | CryptoWebb Analytics"
        description="Track your cryptocurrency portfolio with wallet integration, real-time P&L calculations, and advanced analytics. Connect MetaMask and other wallets to monitor your holdings."
        keywords={['portfolio tracker', 'crypto portfolio', 'wallet integration', 'metamask', 'portfolio analytics', 'crypto holdings']}
      />
      <PortfolioTracker />
    </>
  );
};

export default PortfolioPage;