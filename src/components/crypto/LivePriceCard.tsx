// src/components/crypto/LivePriceCard.tsx
import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Wifi, WifiOff, Activity } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { LiveDataPoint } from '@/hooks/useCryptoWebSocket';

interface LivePriceCardProps {
  metricId: number;
  metricName: string;
  data?: LiveDataPoint;
  isConnected: boolean;
  connectionError?: string | null;
  className?: string;
  showChart?: boolean;
  showStatus?: boolean;
}

export const LivePriceCard: React.FC<LivePriceCardProps> = ({
  metricId,
  metricName,
  data,
  isConnected,
  connectionError,
  className = '',
  showChart = false,
  showStatus = true,
}) => {
  const [priceHistory, setPriceHistory] = useState<{ value: number; timestamp: string }[]>([]);

  // Track price history for mini chart
  useEffect(() => {
    if (data?.value !== null && data?.value !== undefined) {
      setPriceHistory(prev => {
        const newHistory = [...prev, {
          value: data.value!,
          timestamp: data.timestamp
        }];
        // Keep only last 20 data points
        return newHistory.slice(-20);
      });
    }
  }, [data]);

  const formatPrice = (value: number | null) => {
    if (value === null || value === undefined) return '--';
    
    // Format based on value magnitude
    if (value >= 1000) {
      return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (value >= 1) {
      return `$${value.toFixed(4)}`;
    } else {
      return `$${value.toFixed(6)}`;
    }
  };

  const formatChange = (change: number | null) => {
    if (change === null || change === undefined) return null;
    const isPositive = change >= 0;
    return {
      value: Math.abs(change),
      isPositive,
      formatted: `${isPositive ? '+' : '-'}${Math.abs(change).toFixed(2)}%`
    };
  };

  const getPriceDirection = () => {
    if (priceHistory.length < 2) return 'neutral';
    const current = priceHistory[priceHistory.length - 1]?.value;
    const previous = priceHistory[priceHistory.length - 2]?.value;
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'neutral';
  };

  const priceDirection = getPriceDirection();
  const changeData = formatChange(data?.changePerc ?? null);

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 ${className}`}>
      {/* Connection Status Indicator */}
      {showStatus && (
        <div className="absolute top-3 right-3 z-10">
          {isConnected ? (
            <div className="flex items-center gap-1 text-xs text-success">
              <Wifi className="w-3 h-3" />
              <span className="hidden sm:inline">Live</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-error">
              <WifiOff className="w-3 h-3" />
              <span className="hidden sm:inline">Offline</span>
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-text">{metricName}</h3>
            <p className="text-xs text-text-secondary">Metric ID: {metricId}</p>
          </div>
          
          {/* Price Direction Indicator */}
          <div className={`p-1 rounded-full transition-colors ${
            priceDirection === 'up' 
              ? 'bg-success/20 text-success' 
              : priceDirection === 'down' 
                ? 'bg-error/20 text-error' 
                : 'bg-primary/20 text-primary'
          }`}>
            {priceDirection === 'up' && <TrendingUp className="w-4 h-4" />}
            {priceDirection === 'down' && <TrendingDown className="w-4 h-4" />}
            {priceDirection === 'neutral' && <Activity className="w-4 h-4" />}
          </div>
        </div>

        {/* Current Price */}
        <div className="mb-3">
          <div className={`text-2xl font-bold transition-colors duration-300 ${
            priceDirection === 'up'
              ? 'text-success'
              : priceDirection === 'down'
                ? 'text-error'
                : 'text-text'
          }`}>
            {formatPrice(data?.value ?? null)}
          </div>
          
          {/* Price Change */}
          {changeData && (
            <div className={`text-sm flex items-center gap-1 ${
              changeData.isPositive ? 'text-success' : 'text-error'
            }`}>
              {changeData.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{changeData.formatted}</span>
            </div>
          )}
        </div>

        {/* Mini Chart */}
        {showChart && priceHistory.length > 1 && (
          <div className="h-16 mb-3">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 200 64"
              className="text-primary"
            >
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                points={priceHistory
                  .map((point, index) => {
                    const x = (index / (priceHistory.length - 1)) * 200;
                    const minPrice = Math.min(...priceHistory.map(p => p.value));
                    const maxPrice = Math.max(...priceHistory.map(p => p.value));
                    const priceRange = maxPrice - minPrice;
                    const y = priceRange > 0 
                      ? 64 - ((point.value - minPrice) / priceRange) * 64 
                      : 32;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
            </svg>
          </div>
        )}

        {/* Last Update */}
        <div className="text-xs text-text-secondary">
          {data ? (
            <>
              Last update: {new Date(data.timestamp).toLocaleTimeString()}
            </>
          ) : (
            <>
              {isConnected ? 'Waiting for data...' : 'Disconnected'}
            </>
          )}
        </div>

        {/* Error State */}
        {connectionError && (
          <div className="mt-2 text-xs text-error bg-error/10 p-2 rounded">
            Error: {connectionError}
          </div>
        )}
      </div>

      {/* Animated Background Effect */}
      {priceDirection !== 'neutral' && (
        <div 
          className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
            priceDirection === 'up' 
              ? 'bg-gradient-to-br from-success/5 to-transparent' 
              : 'bg-gradient-to-br from-error/5 to-transparent'
          }`}
          style={{
            animation: 'pulse 2s ease-in-out',
          }}
        />
      )}
    </Card>
  );
};

export default LivePriceCard;
