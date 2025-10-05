// src/features/charts/components/AdvancedChartTypes.tsx
import React, { useMemo, useRef, forwardRef, useImperativeHandle } from 'react';
import Highcharts from 'highcharts';
import HighchartsStock from 'highcharts/modules/stock';
import HighchartsMore from 'highcharts/highcharts-more';
import HeatmapModule from 'highcharts/modules/heatmap';
import TreemapModule from 'highcharts/modules/treemap';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@/components/ui/Card';
import { ChartErrorBoundary } from '@/components/ErrorBoundary';

// Initialize Highcharts modules
if (typeof Highcharts === 'object') {
  try {
    if (HighchartsStock && typeof HighchartsStock === 'function') {
      HighchartsStock(Highcharts);
    }
    if (HighchartsMore && typeof HighchartsMore === 'function') {
      HighchartsMore(Highcharts);
    }
    if (HeatmapModule && typeof HeatmapModule === 'function') {
      HeatmapModule(Highcharts);
    }
    if (TreemapModule && typeof TreemapModule === 'function') {
      TreemapModule(Highcharts);
    }
  } catch (error) {
    console.warn('Error initializing Highcharts modules:', error);
  }
}

// Chart data interfaces
export interface OHLCData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface HeatmapDataPoint {
  x: number;
  y: number;
  value: number;
  name?: string;
}

export interface TreemapDataPoint {
  name: string;
  value: number;
  colorValue?: number;
  parent?: string;
}

export interface VolumeProfileData {
  price: number;
  volume: number;
  buyVolume: number;
  sellVolume: number;
}

// Advanced Chart Types
export type AdvancedChartType = 
  | 'candlestick'
  | 'volume-profile'
  | 'heatmap'
  | 'treemap'
  | 'bollinger-bands'
  | 'rsi'
  | 'macd'
  | 'correlation-matrix';

export interface AdvancedChartProps {
  chartType: AdvancedChartType;
  data: any;
  title?: string;
  height?: number;
  indicators?: TechnicalIndicatorConfig[];
  onPointSelect?: (point: any) => void;
  className?: string;
}

export interface TechnicalIndicatorConfig {
  type: 'sma' | 'ema' | 'bollinger' | 'rsi' | 'macd' | 'stochastic';
  period: number;
  color?: string;
  visible?: boolean;
  params?: Record<string, any>;
}

export interface AdvancedChartRef {
  getChart: () => Highcharts.Chart | undefined;
  exportChart: (format: 'png' | 'pdf' | 'svg' | 'csv') => Promise<void>;
  addIndicator: (config: TechnicalIndicatorConfig) => void;
  removeIndicator: (type: string) => void;
  updateData: (data: any) => void;
}

// Technical Indicator Calculations
export class TechnicalIndicators {
  static calculateSMA(data: number[], period: number): number[] {
    const sma: number[] = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
    return sma;
  }

  static calculateEMA(data: number[], period: number): number[] {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);
    ema[0] = data[0];
    
    for (let i = 1; i < data.length; i++) {
      ema[i] = (data[i] - ema[i - 1]) * multiplier + ema[i - 1];
    }
    return ema;
  }

  static calculateBollingerBands(data: number[], period: number, multiplier: number = 2) {
    const sma = this.calculateSMA(data, period);
    const bands = { upper: [], lower: [], middle: sma };
    
    for (let i = period - 1; i < data.length; i++) {
      const slice = data.slice(i - period + 1, i + 1);
      const mean = sma[i - period + 1];
      const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
      const stdDev = Math.sqrt(variance);
      
      bands.upper.push(mean + (stdDev * multiplier));
      bands.lower.push(mean - (stdDev * multiplier));
    }
    
    return bands;
  }

  static calculateRSI(data: number[], period: number = 14): number[] {
    const rsi: number[] = [];
    const gains: number[] = [];
    const losses: number[] = [];
    
    for (let i = 1; i < data.length; i++) {
      const change = data[i] - data[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }
    
    let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
    let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
    
    for (let i = period; i < gains.length; i++) {
      avgGain = ((avgGain * (period - 1)) + gains[i]) / period;
      avgLoss = ((avgLoss * (period - 1)) + losses[i]) / period;
      
      const rs = avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
    }
    
    return rsi;
  }

  static calculateMACD(data: number[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9) {
    const fastEMA = this.calculateEMA(data, fastPeriod);
    const slowEMA = this.calculateEMA(data, slowPeriod);
    const macdLine: number[] = [];
    
    for (let i = 0; i < Math.min(fastEMA.length, slowEMA.length); i++) {
      macdLine.push(fastEMA[i] - slowEMA[i]);
    }
    
    const signalLine = this.calculateEMA(macdLine, signalPeriod);
    const histogram: number[] = [];
    
    for (let i = 0; i < Math.min(macdLine.length, signalLine.length); i++) {
      histogram.push(macdLine[i] - signalLine[i]);
    }
    
    return { macdLine, signalLine, histogram };
  }
}

// Advanced Chart Component
export const AdvancedChart = forwardRef<AdvancedChartRef, AdvancedChartProps>(
  ({ chartType, data, title, height = 400, indicators = [], onPointSelect, className }, ref) => {
    const chartRef = useRef<HighchartsReact.RefObject>(null);

    // Chart options based on type
    const chartOptions: Highcharts.Options = useMemo(() => {
      const baseOptions: Highcharts.Options = {
        chart: {
          backgroundColor: 'transparent',
          height,
          style: {
            fontFamily: 'monospace'
          }
        },
        title: {
          text: title,
          style: {
            color: 'var(--color-primary)',
            fontFamily: 'monospace'
          }
        },
        credits: { enabled: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          borderColor: 'var(--color-primary)',
          style: {
            color: 'var(--color-text)',
            fontFamily: 'monospace'
          }
        }
      };

      switch (chartType) {
        case 'candlestick':
          return {
            ...baseOptions,
            chart: {
              ...baseOptions.chart,
              type: undefined // Let Highcharts Stock handle this
            },
            rangeSelector: {
              enabled: true,
              buttons: [
                { count: 1, type: 'day', text: '1D' },
                { count: 7, type: 'day', text: '7D' },
                { count: 30, type: 'day', text: '30D' },
                { count: 90, type: 'day', text: '3M' },
                { type: 'all', text: 'All' }
              ],
              buttonTheme: {
                fill: 'transparent',
                stroke: 'var(--color-primary)',
                'stroke-width': 1,
                style: {
                  color: 'var(--color-primary)',
                  fontFamily: 'monospace'
                }
              }
            },
            navigator: {
              enabled: true,
              series: {
                color: 'var(--color-primary)'
              }
            },
            scrollbar: {
              enabled: true,
              barBackgroundColor: 'var(--color-primary)',
              barBorderColor: 'var(--color-primary)',
              buttonBackgroundColor: 'var(--color-primary)',
              buttonBorderColor: 'var(--color-primary)',
              rifleColor: 'var(--color-background)',
              trackBackgroundColor: 'rgba(255, 255, 255, 0.1)'
            },
            series: [
              {
                type: 'candlestick',
                name: 'Price',
                data: (data as OHLCData[]).map(d => [d.timestamp, d.open, d.high, d.low, d.close]),
                color: '#ff4444', // Red for bearish
                upColor: '#00ff88', // Green for bullish
                lineColor: '#ff4444',
                upLineColor: '#00ff88'
              },
              ...(data[0]?.volume ? [{
                type: 'column' as const,
                name: 'Volume',
                data: (data as OHLCData[]).map(d => [d.timestamp, d.volume]),
                yAxis: 1,
                color: 'var(--color-primary)',
                opacity: 0.5
              }] : [])
            ],
            yAxis: [
              {
                title: { text: 'Price', style: { color: 'var(--color-primary)' } },
                height: data[0]?.volume ? '70%' : '100%',
                lineWidth: 1,
                lineColor: 'var(--color-border)',
                gridLineColor: 'var(--color-border)',
                labels: { style: { color: 'var(--color-text-secondary)' } }
              },
              ...(data[0]?.volume ? [{
                title: { text: 'Volume', style: { color: 'var(--color-primary)' } },
                top: '75%',
                height: '25%',
                lineWidth: 1,
                lineColor: 'var(--color-border)',
                gridLineColor: 'var(--color-border)',
                labels: { style: { color: 'var(--color-text-secondary)' } }
              }] : [])
            ],
            xAxis: {
              type: 'datetime',
              lineColor: 'var(--color-border)',
              tickColor: 'var(--color-border)',
              labels: { style: { color: 'var(--color-text-secondary)' } }
            }
          };

        case 'volume-profile':
          const volumeData = data as VolumeProfileData[];
          return {
            ...baseOptions,
            chart: {
              ...baseOptions.chart,
              type: 'bar'
            },
            xAxis: {
              title: { text: 'Volume', style: { color: 'var(--color-primary)' } },
              lineColor: 'var(--color-border)',
              labels: { style: { color: 'var(--color-text-secondary)' } }
            },
            yAxis: {
              title: { text: 'Price', style: { color: 'var(--color-primary)' } },
              reversed: true,
              lineColor: 'var(--color-border)',
              gridLineColor: 'var(--color-border)',
              labels: { style: { color: 'var(--color-text-secondary)' } }
            },
            series: [
              {
                name: 'Buy Volume',
                type: 'bar',
                data: volumeData.map(d => [d.buyVolume, d.price]),
                color: '#00ff88'
              },
              {
                name: 'Sell Volume',
                type: 'bar',
                data: volumeData.map(d => [-d.sellVolume, d.price]),
                color: '#ff4444'
              }
            ],
            plotOptions: {
              bar: {
                stacking: 'normal',
                dataLabels: { enabled: false }
              }
            }
          };

        case 'heatmap':
          const heatmapData = data as HeatmapDataPoint[];
          return {
            ...baseOptions,
            chart: {
              ...baseOptions.chart,
              type: 'heatmap'
            },
            colorAxis: {
              min: Math.min(...heatmapData.map(d => d.value)),
              max: Math.max(...heatmapData.map(d => d.value)),
              stops: [
                [0, '#ff4444'],
                [0.5, '#ffff44'],
                [1, '#00ff88']
              ]
            },
            series: [{
              type: 'heatmap',
              name: 'Correlation',
              data: heatmapData.map(d => [d.x, d.y, d.value]),
              dataLabels: {
                enabled: true,
                color: '#000000',
                format: '{point.value:.2f}'
              }
            }],
            xAxis: {
              categories: Array.from(new Set(heatmapData.map(d => d.x))).sort((a, b) => a - b),
              lineColor: 'var(--color-border)',
              labels: { style: { color: 'var(--color-text-secondary)' } }
            },
            yAxis: {
              categories: Array.from(new Set(heatmapData.map(d => d.y))).sort((a, b) => a - b),
              lineColor: 'var(--color-border)',
              gridLineColor: 'var(--color-border)',
              labels: { style: { color: 'var(--color-text-secondary)' } }
            }
          };

        case 'treemap':
          const treemapData = data as TreemapDataPoint[];
          return {
            ...baseOptions,
            chart: {
              ...baseOptions.chart,
              type: 'treemap'
            },
            colorAxis: {
              minColor: '#ff4444',
              maxColor: '#00ff88'
            },
            series: [{
              type: 'treemap',
              name: 'Portfolio',
              data: treemapData.map(d => ({
                name: d.name,
                value: d.value,
                colorValue: d.colorValue || d.value
              })),
              dataLabels: {
                enabled: true,
                style: {
                  color: '#ffffff',
                  fontFamily: 'monospace',
                  textOutline: '1px contrast'
                },
                format: '{point.name}<br/>{point.value:.2f}'
              },
              levels: [{
                level: 1,
                dataLabels: {
                  enabled: true
                },
                borderWidth: 3,
                borderColor: 'var(--color-primary)'
              }]
            }]
          };

        case 'rsi':
          const rsiData = TechnicalIndicators.calculateRSI(data);
          return {
            ...baseOptions,
            yAxis: {
              title: { text: 'RSI', style: { color: 'var(--color-primary)' } },
              min: 0,
              max: 100,
              plotLines: [
                { value: 70, color: '#ff4444', dashStyle: 'dash', width: 1 },
                { value: 30, color: '#00ff88', dashStyle: 'dash', width: 1 }
              ],
              lineColor: 'var(--color-border)',
              gridLineColor: 'var(--color-border)',
              labels: { style: { color: 'var(--color-text-secondary)' } }
            },
            xAxis: {
              type: 'datetime',
              lineColor: 'var(--color-border)',
              labels: { style: { color: 'var(--color-text-secondary)' } }
            },
            series: [{
              type: 'line',
              name: 'RSI',
              data: rsiData.map((value, index) => [Date.now() - (rsiData.length - index) * 86400000, value]),
              color: 'var(--color-primary)',
              zones: [
                { value: 30, color: '#00ff88' },
                { value: 70, color: '#ffff44' },
                { color: '#ff4444' }
              ]
            }]
          };

        case 'macd':
          const macdData = TechnicalIndicators.calculateMACD(data);
          return {
            ...baseOptions,
            yAxis: [
              {
                title: { text: 'MACD', style: { color: 'var(--color-primary)' } },
                height: '70%',
                lineColor: 'var(--color-border)',
                gridLineColor: 'var(--color-border)',
                labels: { style: { color: 'var(--color-text-secondary)' } }
              },
              {
                title: { text: 'Histogram', style: { color: 'var(--color-primary)' } },
                top: '75%',
                height: '25%',
                lineColor: 'var(--color-border)',
                gridLineColor: 'var(--color-border)',
                labels: { style: { color: 'var(--color-text-secondary)' } }
              }
            ],
            xAxis: {
              type: 'datetime',
              lineColor: 'var(--color-border)',
              labels: { style: { color: 'var(--color-text-secondary)' } }
            },
            series: [
              {
                type: 'line',
                name: 'MACD',
                data: macdData.macdLine.map((value, index) => [Date.now() - (macdData.macdLine.length - index) * 86400000, value]),
                color: '#00ff88'
              },
              {
                type: 'line',
                name: 'Signal',
                data: macdData.signalLine.map((value, index) => [Date.now() - (macdData.signalLine.length - index) * 86400000, value]),
                color: '#ff4444'
              },
              {
                type: 'column',
                name: 'Histogram',
                data: macdData.histogram.map((value, index) => [Date.now() - (macdData.histogram.length - index) * 86400000, value]),
                yAxis: 1,
                color: 'var(--color-primary)',
                opacity: 0.7
              }
            ]
          };

        default:
          return baseOptions;
      }
    }, [chartType, data, title, height]);

    // Expose chart methods
    useImperativeHandle(ref, () => ({
      getChart: () => chartRef.current?.chart,
      exportChart: async (format: 'png' | 'pdf' | 'svg' | 'csv') => {
        const chart = chartRef.current?.chart;
        if (!chart) throw new Error('Chart not available');
        
        if (format === 'csv') {
          // Export data as CSV
          const csvData = chart.getCSV();
          const blob = new Blob([csvData], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${title || 'chart'}.csv`;
          a.click();
          URL.revokeObjectURL(url);
        } else {
          chart.exportChart({ 
            type: format === 'pdf' ? 'application/pdf' : `image/${format}`,
            filename: title || 'chart'
          });
        }
      },
      addIndicator: (config: TechnicalIndicatorConfig) => {
        // Implementation for adding indicators dynamically
        console.log('Adding indicator:', config);
      },
      removeIndicator: (type: string) => {
        // Implementation for removing indicators
        console.log('Removing indicator:', type);
      },
      updateData: (newData: any) => {
        const chart = chartRef.current?.chart;
        if (chart && chart.series[0]) {
          chart.series[0].setData(newData, true);
        }
      }
    }), [title]);

    if (!data || (Array.isArray(data) && data.length === 0)) {
      return (
        <Card className={`h-full flex items-center justify-center ${className}`}>
          <p className="text-gray-500 dark:text-gray-400">No data available for {chartType} chart</p>
        </Card>
      );
    }

    return (
      <ChartErrorBoundary>
        <Card className={`h-full ${className}`}>
          <HighchartsReact
            highcharts={chartType === 'candlestick' ? Highcharts : Highcharts}
            constructorType={chartType === 'candlestick' ? 'stockChart' : 'chart'}
            options={chartOptions}
            ref={chartRef}
          />
        </Card>
      </ChartErrorBoundary>
    );
  }
);

AdvancedChart.displayName = 'AdvancedChart';

export default AdvancedChart;