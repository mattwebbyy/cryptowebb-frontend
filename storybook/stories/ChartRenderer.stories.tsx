import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// Matrix-styled Chart Renderer Mock
const MatrixChartRenderer = ({ 
  chartId = 'crypto-chart',
  title = 'CRYPTO ANALYTICS',
  height = 400,
  className = ''
}: any) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentData, setCurrentData] = React.useState({ bitcoin: 45000, ethereum: 3000 });

  // Simulate data loading and real-time updates
  React.useEffect(() => {
    const loadingTimer = setTimeout(() => setIsLoading(false), 2000);
    
    const updateTimer = setInterval(() => {
      setCurrentData(prev => ({
        bitcoin: prev.bitcoin + (Math.random() - 0.5) * 1000,
        ethereum: prev.ethereum + (Math.random() - 0.5) * 100
      }));
    }, 3000);

    return () => {
      clearTimeout(loadingTimer);
      clearInterval(updateTimer);
    };
  }, []);

  if (isLoading) {
    return (
      <div className={`bg-black border-2 border-matrix-green p-6 ${className}`} style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-matrix-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-matrix-green font-mono font-bold uppercase tracking-wider">
              LOADING MATRIX DATA...
            </div>
            <div className="text-matrix-green/60 font-mono text-sm mt-2">
              [ CONNECTING TO BLOCKCHAIN NETWORK ]
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-black border-2 border-matrix-green relative overflow-hidden ${className}`} style={{ height }}>
      {/* Matrix grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>
      
      {/* Header */}
      <div className="relative z-10 p-4 border-b border-matrix-green/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-matrix-green font-mono font-bold uppercase tracking-wider text-lg">
              {title}
            </h3>
            <div className="text-matrix-green/60 font-mono text-xs mt-1">
              REAL-TIME MARKET DATA | ID: {chartId}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-matrix-green font-mono text-sm">BTC</div>
              <div className="text-matrix-green font-mono font-bold">
                ${currentData.bitcoin.toFixed(0)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-matrix-green font-mono text-sm">ETH</div>
              <div className="text-matrix-green font-mono font-bold">
                ${currentData.ethereum.toFixed(0)}
              </div>
            </div>
            <div className="w-3 h-3 bg-matrix-green rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative z-10 p-4 h-full">
        <div className="h-full flex items-center justify-center">
          {/* Simulated chart visualization */}
          <div className="w-full h-64 relative">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              {/* Chart lines */}
              <polyline
                fill="none"
                stroke="#00ff00"
                strokeWidth="2"
                points="20,180 80,120 140,140 200,80 260,60 320,40 380,20"
                className="opacity-80"
              />
              <polyline
                fill="none"
                stroke="#00cc00"
                strokeWidth="2"
                points="20,150 80,160 140,130 200,110 260,90 320,70 380,50"
                className="opacity-60"
              />
              
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <line
                  key={i}
                  x1="20"
                  y1={40 + i * 40}
                  x2="380"
                  y2={40 + i * 40}
                  stroke="rgba(0, 255, 0, 0.1)"
                  strokeWidth="1"
                />
              ))}
              
              {/* Data points */}
              {[20, 80, 140, 200, 260, 320, 380].map((x, i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={180 - i * 20 - Math.random() * 40}
                  r="3"
                  fill="#00ff00"
                  className="animate-pulse"
                />
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-matrix-green/10 border-t border-matrix-green/30 p-2">
        <div className="flex items-center justify-between text-xs font-mono text-matrix-green/60">
          <span>MATRIX_PROTOCOL_v3.0</span>
          <span>SYNC: {new Date().toLocaleTimeString()}</span>
          <span>LATENCY: 12ms</span>
        </div>
      </div>

      {/* Scanning line effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-matrix-green to-transparent animate-pulse"></div>
      </div>
    </div>
  );
};

const meta: Meta<typeof MatrixChartRenderer> = {
  title: 'Features/ChartRenderer',
  component: MatrixChartRenderer,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[500px] bg-black p-6">
        <div className="h-96 w-full">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const CryptoChart: Story = {
  args: {
    chartId: 'crypto-prices',
    title: 'CRYPTOCURRENCY ANALYTICS',
    height: 500
  }
};

export const CompactChart: Story = {
  args: {
    chartId: 'btc-price',
    title: 'BTC PRICE TRACKER',
    height: 300
  },
  decorators: [
    (Story) => (
      <div className="min-h-[400px] bg-black p-6">
        <div className="w-96 mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
};

export const FullScreenMatrix: Story = {
  args: {
    chartId: 'matrix-analytics',
    title: 'MATRIX BLOCKCHAIN ANALYTICS',
    height: 600
  },
  decorators: [
    (Story) => (
      <div className="fixed inset-0 bg-black p-8">
        <div className="h-full w-full">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export const MultiMetrics: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-6 bg-black min-h-screen">
      <MatrixChartRenderer chartId="btc-chart" title="BITCOIN ANALYTICS" height={300} />
      <MatrixChartRenderer chartId="eth-chart" title="ETHEREUM ANALYTICS" height={300} />
      <MatrixChartRenderer chartId="volume-chart" title="TRADING VOLUME" height={300} />
      <MatrixChartRenderer chartId="portfolio-chart" title="PORTFOLIO VALUE" height={300} />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};