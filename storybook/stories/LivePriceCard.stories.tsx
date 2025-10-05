import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Mock LivePriceCard for Storybook (simplified version without websocket dependencies)
const MockLivePriceCard = ({
  metricName = "Bitcoin",
  price = 45234.56,
  change = 2.45,
  isConnected = true,
  showChart = false,
  showStatus = true,
  priceDirection = 'up',
  connectionError = null
}: {
  metricName?: string;
  price?: number | null;
  change?: number | null;
  isConnected?: boolean;
  showChart?: boolean;
  showStatus?: boolean;
  priceDirection?: 'up' | 'down' | 'neutral';
  connectionError?: string | null;
}) => {
  // Icons
  const TrendingUp = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" />
      <polyline points="16,7 22,7 22,13" />
    </svg>
  );
  
  const TrendingDown = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22,17 13.5,8.5 8.5,13.5 2,7" />
      <polyline points="16,17 22,17 22,11" />
    </svg>
  );
  
  const Activity = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
    </svg>
  );
  
  const Wifi = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 13a10 10 0 0 1 14 0" />
      <path d="M8.5 16.5a5 5 0 0 1 7 0" />
      <path d="M12 20h.01" />
    </svg>
  );
  
  const WifiOff = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="2" x2="22" y1="2" y2="22" />
      <path d="M8.5 16.5a5 5 0 0 1 7 0" />
      <path d="M12 20h.01" />
    </svg>
  );

  const formatPrice = (value: number | null) => {
    if (value === null || value === undefined) return '--';
    
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

  const changeData = formatChange(change);

  // Generate mock chart data
  const generateChartData = () => {
    const points = [];
    let basePrice = price || 45000;
    for (let i = 0; i < 20; i++) {
      const variation = (Math.random() - 0.5) * 1000;
      points.push(basePrice + variation);
    }
    return points;
  };

  const chartData = showChart ? generateChartData() : [];

  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      background: 'rgba(0, 0, 0, 0.8)',
      border: '1px solid rgba(0, 255, 0, 0.3)',
      borderRadius: '12px',
      backdropFilter: 'blur(8px)',
      transition: 'all 0.3s ease',
      maxWidth: '350px'
    }}>
      {/* Connection Status Indicator */}
      {showStatus && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 10
        }}>
          {isConnected ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              color: '#00ff00'
            }}>
              <Wifi />
              <span>Live</span>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              color: '#ef4444'
            }}>
              <WifiOff />
              <span>Offline</span>
            </div>
          )}
        </div>
      )}

      <div style={{ padding: '16px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <div>
            <h3 style={{ 
              fontWeight: '600', 
              color: '#ffffff',
              margin: '0 0 4px 0',
              fontSize: '16px'
            }}>
              {metricName}
            </h3>
            <p style={{ 
              fontSize: '12px', 
              color: '#64748b',
              margin: 0
            }}>
              Metric ID: 1
            </p>
          </div>
          
          {/* Price Direction Indicator */}
          <div style={{
            padding: '4px',
            borderRadius: '50%',
            transition: 'colors 0.3s',
            backgroundColor: priceDirection === 'up' 
              ? 'rgba(0, 255, 0, 0.2)' 
              : priceDirection === 'down' 
                ? 'rgba(239, 68, 68, 0.2)' 
                : 'rgba(0, 255, 0, 0.2)',
            color: priceDirection === 'up' 
              ? '#00ff00' 
              : priceDirection === 'down' 
                ? '#ef4444' 
                : '#00ff00'
          }}>
            {priceDirection === 'up' && <TrendingUp />}
            {priceDirection === 'down' && <TrendingDown />}
            {priceDirection === 'neutral' && <Activity />}
          </div>
        </div>

        {/* Current Price */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{
            fontSize: '32px',
            fontWeight: 'bold',
            transition: 'color 0.3s',
            color: priceDirection === 'up' 
              ? '#00ff00' 
              : priceDirection === 'down' 
                ? '#ef4444' 
                : '#ffffff'
          }}>
            {formatPrice(price)}
          </div>
          
          {/* Price Change */}
          {changeData && (
            <div style={{
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: changeData.isPositive ? '#00ff00' : '#ef4444'
            }}>
              {changeData.isPositive ? <TrendingUp /> : <TrendingDown />}
              <span>{changeData.formatted}</span>
            </div>
          )}
        </div>

        {/* Mini Chart */}
        {showChart && chartData.length > 1 && (
          <div style={{ height: '64px', marginBottom: '12px' }}>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 200 64"
              style={{ color: '#00ff00' }}
            >
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                points={chartData
                  .map((point, index) => {
                    const x = (index / (chartData.length - 1)) * 200;
                    const minPrice = Math.min(...chartData);
                    const maxPrice = Math.max(...chartData);
                    const priceRange = maxPrice - minPrice;
                    const y = priceRange > 0 
                      ? 64 - ((point - minPrice) / priceRange) * 64 
                      : 32;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
            </svg>
          </div>
        )}

        {/* Last Update */}
        <div style={{ fontSize: '12px', color: '#64748b' }}>
          {price !== null ? (
            <>Last update: {new Date().toLocaleTimeString()}</>
          ) : (
            <>{isConnected ? 'Waiting for data...' : 'Disconnected'}</>
          )}
        </div>

        {/* Error State */}
        {connectionError && (
          <div style={{
            marginTop: '8px',
            fontSize: '12px',
            color: '#ef4444',
            background: 'rgba(239, 68, 68, 0.1)',
            padding: '8px',
            borderRadius: '4px'
          }}>
            Error: {connectionError}
          </div>
        )}
      </div>

      {/* Animated Background Effect */}
      {priceDirection !== 'neutral' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          transition: 'opacity 1s',
          background: priceDirection === 'up' 
            ? 'linear-gradient(135deg, rgba(0, 255, 0, 0.05) 0%, transparent 100%)' 
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, transparent 100%)',
          animation: 'pulse 2s ease-in-out'
        }} />
      )}
    </div>
  );
};

const meta: Meta<typeof MockLivePriceCard> = {
  title: 'Crypto/LivePriceCard',
  component: MockLivePriceCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  argTypes: {
    metricName: { control: 'text' },
    price: { control: 'number' },
    change: { control: 'number' },
    isConnected: { control: 'boolean' },
    showChart: { control: 'boolean' },
    showStatus: { control: 'boolean' },
    priceDirection: {
      control: 'select',
      options: ['up', 'down', 'neutral'],
    },
    connectionError: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    metricName: 'Bitcoin',
    price: 45234.56,
    change: 2.45,
    priceDirection: 'up',
  },
};

export const Negative: Story = {
  args: {
    metricName: 'Ethereum',
    price: 3124.78,
    change: -1.23,
    priceDirection: 'down',
  },
};

export const WithChart: Story = {
  args: {
    metricName: 'Cardano',
    price: 0.456789,
    change: 5.67,
    priceDirection: 'up',
    showChart: true,
  },
};

export const Disconnected: Story = {
  args: {
    metricName: 'Solana',
    price: null,
    change: null,
    isConnected: false,
    priceDirection: 'neutral',
  },
};

export const WithError: Story = {
  args: {
    metricName: 'Polygon',
    price: 0.8234,
    change: 0.45,
    connectionError: 'WebSocket connection failed',
    priceDirection: 'neutral',
  },
};

export const HighValue: Story = {
  args: {
    metricName: 'Gold (per oz)',
    price: 2045.67,
    change: 0.12,
    priceDirection: 'up',
    showChart: true,
  },
};

export const LowValue: Story = {
  args: {
    metricName: 'Dogecoin',
    price: 0.000123,
    change: -12.34,
    priceDirection: 'down',
    showChart: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
      <MockLivePriceCard
        metricName="Bitcoin"
        price={45234.56}
        change={2.45}
        priceDirection="up"
        showChart={true}
      />
      <MockLivePriceCard
        metricName="Ethereum"
        price={3124.78}
        change={-1.23}
        priceDirection="down"
        showChart={true}
      />
      <MockLivePriceCard
        metricName="Solana"
        price={null}
        change={null}
        isConnected={false}
        priceDirection="neutral"
      />
      <MockLivePriceCard
        metricName="Cardano"
        price={0.456789}
        change={5.67}
        priceDirection="up"
        connectionError="Rate limited"
      />
    </div>
  ),
};