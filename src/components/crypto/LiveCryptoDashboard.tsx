// src/components/crypto/LiveCryptoDashboard.tsx
import React, { useEffect, useState } from 'react';
import { RefreshCw, Settings, TrendingUp } from 'lucide-react';
import { LivePriceCard } from './LivePriceCard';
import { Button } from '@/components/ui/Button';
import { useCryptoWebSocket } from '@/hooks/useCryptoWebSocket';
import { useDataMetricsList } from '@/features/dataMetrics/api/useDataMetrics';

interface LiveCryptoDashboardProps {
  className?: string;
  maxItems?: number;
  showControls?: boolean;
  autoRefresh?: boolean;
}

export const LiveCryptoDashboard: React.FC<LiveCryptoDashboardProps> = ({
  className = '',
  maxItems = 12,
  showControls = true,
  autoRefresh = true,
}) => {
  const { data: metrics, isLoading, refetch } = useDataMetricsList();
  const [selectedMetrics, setSelectedMetrics] = useState<number[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const {
    isConnected,
    liveData,
    connectionError,
    connect,
    disconnect,
  } = useCryptoWebSocket();

  // Initialize with first few metrics
  useEffect(() => {
    if (metrics && metrics.length > 0 && selectedMetrics.length === 0) {
      const defaultMetrics = metrics.slice(0, Math.min(maxItems, metrics.length))
        .map(metric => metric.MetricID);
      setSelectedMetrics(defaultMetrics);
    }
  }, [metrics, selectedMetrics.length, maxItems]);

  const handleMetricToggle = (metricId: number) => {
    setSelectedMetrics(prev => {
      if (prev.includes(metricId)) {
        return prev.filter(id => id !== metricId);
      } else if (prev.length < maxItems) {
        return [...prev, metricId];
      } else {
        // Replace the last metric if at max capacity
        return [...prev.slice(0, -1), metricId];
      }
    });
  };

  const getConnectionStatus = () => {
    if (isConnected) return { status: 'Connected', color: 'text-success' };
    if (connectionError) return { status: 'Error', color: 'text-error' };
    return { status: 'Connecting...', color: 'text-warning' };
  };

  const connectionStatus = getConnectionStatus();

  // Calculate dashboard statistics
  const dashboardStats = React.useMemo(() => {
    const liveMetrics = selectedMetrics
      .map(id => liveData[id])
      .filter(Boolean);

    const totalGainers = liveMetrics.filter(data => 
      data.changePerc && data.changePerc > 0
    ).length;

    const totalLosers = liveMetrics.filter(data => 
      data.changePerc && data.changePerc < 0
    ).length;

    const averageChange = liveMetrics.length > 0
      ? liveMetrics.reduce((sum, data) => sum + (data.changePerc || 0), 0) / liveMetrics.length
      : 0;

    return {
      totalMetrics: selectedMetrics.length,
      gainers: totalGainers,
      losers: totalLosers,
      averageChange,
      dataPoints: liveMetrics.length,
    };
  }, [selectedMetrics, liveData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-text-secondary">Loading metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text mb-2">Live Crypto Feed</h2>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span className={connectionStatus.color}>
              ● {connectionStatus.status}
            </span>
            <span>{dashboardStats.dataPoints} / {dashboardStats.totalMetrics} metrics active</span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {dashboardStats.gainers}↑ {dashboardStats.losers}↓
            </span>
          </div>
        </div>

        {showControls && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="text-primary hover:bg-primary-10"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-primary hover:bg-primary-10"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={isConnected ? disconnect : connect}
              className={isConnected ? 'text-error hover:bg-error/10' : 'text-success hover:bg-success/10'}
            >
              {isConnected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        )}
      </div>

      {/* Dashboard Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-lg p-3">
          <div className="text-sm text-text-secondary">Active Metrics</div>
          <div className="text-xl font-bold text-primary">{dashboardStats.totalMetrics}</div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-3">
          <div className="text-sm text-text-secondary">Gainers</div>
          <div className="text-xl font-bold text-success">{dashboardStats.gainers}</div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-3">
          <div className="text-sm text-text-secondary">Losers</div>
          <div className="text-xl font-bold text-error">{dashboardStats.losers}</div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-3">
          <div className="text-sm text-text-secondary">Avg Change</div>
          <div className={`text-xl font-bold ${
            dashboardStats.averageChange >= 0 ? 'text-success' : 'text-error'
          }`}>
            {dashboardStats.averageChange >= 0 ? '+' : ''}{dashboardStats.averageChange.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Metric Selection Panel */}
      {showSettings && (
        <div className="bg-surface border border-border rounded-lg p-4">
          <h3 className="font-semibold text-text mb-3">Select Metrics ({selectedMetrics.length}/{maxItems})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {metrics?.map(metric => (
              <button
                key={metric.MetricID}
                onClick={() => handleMetricToggle(metric.MetricID)}
                className={`p-2 text-left text-sm rounded border transition-all ${
                  selectedMetrics.includes(metric.MetricID)
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-background border-border text-text-secondary hover:bg-primary/10'
                }`}
              >
                <div className="font-medium truncate">{metric.MetricName}</div>
                <div className="text-xs opacity-70">{metric.Blockchain}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Live Price Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {selectedMetrics.map(metricId => {
          const metric = metrics?.find(m => m.MetricID === metricId);
          if (!metric) return null;

          return (
            <LivePriceCard
              key={metricId}
              metricId={metricId}
              metricName={metric.MetricName}
              showChart={true}
              showStatus={false}
              className="h-full"
            />
          );
        })}
      </div>

      {/* Empty State */}
      {selectedMetrics.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="w-12 h-12 mx-auto text-text-secondary mb-4" />
          <h3 className="text-lg font-semibold text-text mb-2">No Metrics Selected</h3>
          <p className="text-text-secondary mb-4">
            Click the settings button above to select crypto metrics to monitor.
          </p>
          <Button
            onClick={() => setShowSettings(true)}
            className="bg-primary text-white hover:bg-primary-90"
          >
            <Settings className="w-4 h-4 mr-2" />
            Select Metrics
          </Button>
        </div>
      )}

      {/* Connection Error */}
      {connectionError && (
        <div className="bg-error/10 border border-error/30 rounded-lg p-4">
          <h4 className="font-semibold text-error mb-2">Connection Error</h4>
          <p className="text-error text-sm mb-3">{connectionError}</p>
          <Button
            onClick={connect}
            variant="ghost"
            size="sm"
            className="text-error hover:bg-error/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Connection
          </Button>
        </div>
      )}
    </div>
  );
};

export default LiveCryptoDashboard;