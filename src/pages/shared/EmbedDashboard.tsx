// src/pages/shared/EmbedDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { ChartRenderer } from '@/features/charts/components/chartRenderer';
import { AdvancedChart } from '@/features/charts/components/AdvancedChartTypes';
import { 
  ExternalLink,
  AlertTriangle,
  Shield,
  Eye
} from 'lucide-react';

// Types
interface EmbedDashboardData {
  id: string;
  title: string;
  widgets: EmbedWidget[];
  layout: EmbedLayout;
  settings: EmbedSettings;
  metadata: {
    allowedDomains: string[];
    isActive: boolean;
  };
}

interface EmbedWidget {
  id: string;
  type: 'chart' | 'metric' | 'text';
  title: string;
  config: any;
  position: { x: number; y: number; w: number; h: number };
  data?: any;
}

interface EmbedLayout {
  cols: number;
  rowHeight: number;
  margin: [number, number];
}

interface EmbedSettings {
  showBranding: boolean;
  customTheme?: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
  compact: boolean;
}

// Embed Dashboard Hook
const useEmbedDashboard = (embedToken: string) => {
  const [dashboard, setDashboard] = useState<EmbedDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if embedding is allowed from current domain
        const currentDomain = window.location.hostname;
        const isIframe = window !== window.top;

        const response = await fetch(`/api/v1/embed/dashboards/${embedToken}`, {
          headers: {
            'Content-Type': 'application/json',
            'X-Embed-Domain': currentDomain,
            'X-Is-Iframe': isIframe.toString()
          }
        });

        if (response.status === 403) {
          setIsBlocked(true);
          throw new Error('Embedding not allowed from this domain');
        }

        if (!response.ok) {
          throw new Error('Failed to load embedded dashboard');
        }

        const data = await response.json();
        setDashboard(data);

        // Track embed view
        trackEmbedView(embedToken, currentDomain);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (embedToken) {
      fetchDashboard();
    }
  }, [embedToken]);

  const trackEmbedView = async (token: string, domain: string) => {
    try {
      await fetch(`/api/v1/embed/dashboards/${token}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          domain,
          timestamp: new Date().toISOString(),
          referrer: document.referrer,
          userAgent: navigator.userAgent
        })
      });
    } catch (error) {
      // Silent fail for analytics
      console.warn('Failed to track embed view:', error);
    }
  };

  return { dashboard, isLoading, error, isBlocked };
};

// Main Embed Dashboard Component
export const EmbedDashboard: React.FC = () => {
  const { embedToken } = useParams<{ embedToken: string }>();
  const { dashboard, isLoading, error, isBlocked } = useEmbedDashboard(embedToken || '');
  const [isCompact, setIsCompact] = useState(false);

  // Detect if we're in a small iframe
  useEffect(() => {
    const checkSize = () => {
      const isSmall = window.innerHeight < 400 || window.innerWidth < 600;
      setIsCompact(isSmall);
    };

    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen w-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 dark:border-matrix-green mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Blocked state
  if (isBlocked) {
    return (
      <div className="h-screen w-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Shield className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
            Embedding Blocked
          </h2>
          <p className="text-red-600 dark:text-red-400 text-sm mb-4">
            This dashboard cannot be embedded on the current domain.
          </p>
          <a
            href={`${window.location.origin}/shared/${embedToken}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View in new window
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen w-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-red-600 dark:text-red-400 text-sm">
            {error}
          </p>
        </div>
      </div>
    );
  }

  // Dashboard not found
  if (!dashboard) {
    return (
      <div className="h-screen w-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Dashboard Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            The embedded dashboard could not be found.
          </p>
        </div>
      </div>
    );
  }

  // Apply custom theme if provided
  const customTheme = dashboard.settings.customTheme;
  const themeStyle = customTheme ? {
    '--color-primary': customTheme.primaryColor,
    '--color-background': customTheme.backgroundColor,
    '--color-text': customTheme.textColor
  } as React.CSSProperties : {};

  // Use compact layout for small embeds
  const effectiveSettings = {
    ...dashboard.settings,
    compact: isCompact || dashboard.settings.compact
  };

  return (
    <div 
      className={`h-screen w-full bg-gray-50 dark:bg-gray-900 overflow-auto ${
        effectiveSettings.compact ? 'p-2' : 'p-4'
      }`}
      style={themeStyle}
    >
      {/* Compact header for small embeds */}
      {!effectiveSettings.compact && (
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h1 className={`font-bold text-teal-600 dark:text-matrix-green font-mono ${
              effectiveSettings.compact ? 'text-lg' : 'text-2xl'
            }`}>
              {dashboard.title}
            </h1>
            
            <a
              href={`${window.location.origin}/shared/${embedToken}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-teal-600 dark:hover:text-matrix-green transition-colors"
              title="Open in new window"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="hidden sm:inline">Open</span>
            </a>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <motion.div 
        className={`grid gap-${effectiveSettings.compact ? '2' : '3'}`}
        style={{
          gridTemplateColumns: `repeat(${dashboard.layout.cols}, 1fr)`,
          gridAutoRows: `${effectiveSettings.compact ? dashboard.layout.rowHeight * 0.8 : dashboard.layout.rowHeight}px`
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {dashboard.widgets.map((widget) => (
          <motion.div
            key={widget.id}
            className="relative"
            style={{
              gridColumn: `span ${widget.position.w}`,
              gridRow: `span ${widget.position.h}`
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.2, 
              delay: dashboard.widgets.indexOf(widget) * 0.05 
            }}
          >
            <EmbedWidget widget={widget} compact={effectiveSettings.compact} />
          </motion.div>
        ))}
      </motion.div>

      {/* Branding */}
      {dashboard.settings.showBranding && (
        <div className={`border-t border-gray-200 dark:border-gray-700 ${
          effectiveSettings.compact ? 'mt-2 pt-1' : 'mt-4 pt-2'
        }`}>
          <div className={`text-center ${effectiveSettings.compact ? 'text-xs' : 'text-sm'} text-gray-500 dark:text-gray-400`}>
            <a 
              href="https://cryptowebb.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-teal-600 dark:text-matrix-green hover:underline font-medium inline-flex items-center gap-1"
            >
              Powered by CryptoWebb
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

// Embed Widget Component
const EmbedWidget: React.FC<{ widget: EmbedWidget; compact: boolean }> = ({ widget, compact }) => {
  const renderWidgetContent = () => {
    const titleSize = compact ? 'text-sm' : 'text-base';
    const padding = compact ? 'p-2' : 'p-3';

    switch (widget.type) {
      case 'chart':
        if (widget.config.chartType === 'candlestick' || widget.config.chartType === 'heatmap' || widget.config.chartType === 'treemap') {
          return (
            <Card className={`h-full bg-white/95 dark:bg-black/95 border-teal-600 dark:border-matrix-green ${padding} overflow-hidden`}>
              {widget.title && !compact && (
                <h3 className={`font-semibold text-teal-600 dark:text-matrix-green mb-2 ${titleSize}`}>
                  {widget.title}
                </h3>
              )}
              <div className="h-full">
                <AdvancedChart
                  chartType={widget.config.chartType}
                  data={widget.data}
                  title={compact ? undefined : widget.title}
                  height={compact ? 200 : 300}
                />
              </div>
            </Card>
          );
        } else {
          return (
            <ChartRenderer
              chartId={widget.config.chartId}
              chartType={widget.config.chartType}
              title={compact ? undefined : widget.title}
              isLive={false} // Disable live updates in embeds for performance
            />
          );
        }

      case 'metric':
        return (
          <Card className={`h-full flex flex-col justify-center items-center bg-white/95 dark:bg-black/95 border-teal-600 dark:border-matrix-green ${padding}`}>
            {widget.title && (
              <h3 className={`font-semibold text-teal-600 dark:text-matrix-green text-center mb-1 ${titleSize}`}>
                {widget.title}
              </h3>
            )}
            <div className={`font-bold text-teal-600 dark:text-matrix-green ${
              compact ? 'text-2xl' : 'text-3xl'
            }`}>
              {widget.data?.value || '0'}
            </div>
            {widget.data?.change && (
              <div className={`mt-1 ${compact ? 'text-xs' : 'text-sm'} ${
                widget.data.change >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {widget.data.change >= 0 ? '+' : ''}{widget.data.change}%
              </div>
            )}
          </Card>
        );

      case 'text':
        return (
          <Card className={`h-full bg-white/95 dark:bg-black/95 border-teal-600 dark:border-matrix-green ${padding} overflow-auto`}>
            {widget.title && (
              <h3 className={`font-semibold text-teal-600 dark:text-matrix-green mb-2 ${titleSize}`}>
                {widget.title}
              </h3>
            )}
            <div 
              className={`prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 ${
                compact ? 'prose-sm text-xs' : 'prose-sm'
              }`}
              dangerouslySetInnerHTML={{ __html: widget.data?.content || '' }}
            />
          </Card>
        );

      default:
        return (
          <Card className={`h-full flex items-center justify-center bg-white/95 dark:bg-black/95 border-teal-600 dark:border-matrix-green ${padding}`}>
            <p className={`text-gray-500 dark:text-gray-400 ${compact ? 'text-xs' : 'text-sm'}`}>
              Unknown widget
            </p>
          </Card>
        );
    }
  };

  return renderWidgetContent();
};

export default EmbedDashboard;