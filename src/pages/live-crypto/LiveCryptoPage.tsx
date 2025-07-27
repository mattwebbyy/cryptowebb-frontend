// src/pages/analytics/LiveCryptoPage.tsx
import React from 'react';
import { LiveCryptoDashboard } from '@/components/crypto/LiveCryptoDashboard';
import { Card } from '@/components/ui/Card';
import { Activity, Database, Zap } from 'lucide-react';

const LiveCryptoPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-text">Real-Time Crypto Data</h1>
        </div>
        <p className="text-text-secondary max-w-2xl">
          Monitor live cryptocurrency prices and metrics directly from our database. 
          This feed provides real-time updates without relying on third-party APIs.
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-text">Database-Driven</h3>
          </div>
          <p className="text-sm text-text-secondary">
            All price data comes directly from our internal database, ensuring consistency and reliability.
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-text">Real-Time Updates</h3>
          </div>
          <p className="text-sm text-text-secondary">
            WebSocket connections provide instant price updates as they occur in our system.
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-text">Live Analytics</h3>
          </div>
          <p className="text-sm text-text-secondary">
            Real-time price changes, trend indicators, and market movement analysis.
          </p>
        </Card>
      </div>

      {/* Main Dashboard */}
      <LiveCryptoDashboard 
        maxItems={16}
        showControls={true}
        autoRefresh={true}
        className="w-full"
      />

      {/* Technical Information */}
      <Card className="mt-8 p-6">
        <h3 className="text-lg font-semibold text-text mb-3">Technical Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-text-secondary">
          <div>
            <h4 className="font-medium text-text mb-2">WebSocket Endpoints</h4>
            <ul className="space-y-1 font-mono text-xs">
              <li>• <code>/api/v1/ws/live</code> - General live feed</li>
              <li>• <code>/api/v1/ws/metrics/:id/live</code> - Metric-specific feed</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-text mb-2">Data Sources</h4>
            <ul className="space-y-1">
              <li>• Internal PostgreSQL database</li>
              <li>• Real-time metric calculations</li>
              <li>• Historical price analysis</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LiveCryptoPage;