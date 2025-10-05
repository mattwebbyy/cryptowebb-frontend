// src/pages/shared/PublicDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ChartRenderer } from '@/features/charts/components/chartRenderer';
import { AdvancedChart } from '@/features/charts/components/AdvancedChartTypes';
import { 
  Download,
  ExternalLink,
  Shield,
  AlertTriangle,
  Eye,
  Clock,
  Share2,
  Lock,
  Globe
} from 'lucide-react';

// Types
interface PublicDashboardData {
  id: string;
  title: string;
  description?: string;
  widgets: PublicWidget[];
  layout: DashboardLayout;
  settings: PublicDashboardSettings;
  metadata: {
    createdAt: string;
    lastUpdated: string;
    viewCount: number;
    isPasswordProtected: boolean;
    expiresAt?: string;
  };
}

interface PublicWidget {
  id: string;
  type: 'chart' | 'metric' | 'text';
  title: string;
  config: any;
  position: { x: number; y: number; w: number; h: number };
  data?: any;
}

interface DashboardLayout {
  cols: number;
  rowHeight: number;
  margin: [number, number];
  containerPadding: [number, number];
}

interface PublicDashboardSettings {
  showBranding: boolean;
  allowDownloads: boolean;
  customTheme?: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
}

// Public Dashboard Hook
const usePublicDashboard = (shareToken: string, password?: string) => {
  const [dashboard, setDashboard] = useState<PublicDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requiresPassword, setRequiresPassword] = useState(false);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (password) {
        headers['X-Dashboard-Password'] = password;
      }

      const response = await fetch(`/api/v1/public/dashboards/${shareToken}`, {
        headers
      });

      if (response.status === 401) {
        setRequiresPassword(true);
        setIsLoading(false);
        return;
      }

      if (response.status === 403) {
        throw new Error('Access denied. This dashboard may have expired or been revoked.');
      }

      if (!response.ok) {
        throw new Error(`Failed to load dashboard: ${response.statusText}`);
      }

      const data = await response.json();
      setDashboard(data);
      setRequiresPassword(false);

      // Track view
      trackDashboardView(shareToken);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const trackDashboardView = async (token: string) => {
    try {
      await fetch(`/api/v1/public/dashboards/${token}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          referrer: document.referrer,
          userAgent: navigator.userAgent
        })
      });
    } catch (error) {
      // Silent fail for analytics
      console.warn('Failed to track dashboard view:', error);
    }
  };

  useEffect(() => {
    if (shareToken) {
      fetchDashboard();
    }
  }, [shareToken, password]);

  return {
    dashboard,
    isLoading,
    error,
    requiresPassword,
    refetch: fetchDashboard
  };
};

// Main Public Dashboard Component
export const PublicDashboard: React.FC = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const {
    dashboard,
    isLoading,
    error,
    requiresPassword,
    refetch
  } = usePublicDashboard(shareToken || '', password);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const downloadDashboard = async (format: 'pdf' | 'png') => {
    if (!dashboard?.settings.allowDownloads) return;

    try {
      const response = await fetch(`/api/v1/public/dashboards/${shareToken}/export/${format}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(password && { 'X-Dashboard-Password': password })
        }
      });

      if (!response.ok) {
        throw new Error('Failed to export dashboard');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dashboard.title || 'dashboard'}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 dark:border-matrix-green mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Password required
  if (requiresPassword || showPasswordForm) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="p-8 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green max-w-md w-full">
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 mx-auto mb-4 text-teal-600 dark:text-matrix-green" />
            <h2 className="text-2xl font-bold text-teal-600 dark:text-matrix-green mb-2">
              Protected Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              This dashboard is password protected. Please enter the password to continue.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                placeholder="Enter dashboard password"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={!password.trim()}>
              <Lock className="w-4 h-4 mr-2" />
              Access Dashboard
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="p-8 bg-white/90 dark:bg-black/90 border-red-500 dark:border-red-400 max-w-md w-full text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  // Dashboard not found
  if (!dashboard) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="p-8 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green max-w-md w-full text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Dashboard Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The requested dashboard could not be found or may have been removed.
          </p>
        </Card>
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

  return (
    <div 
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      style={themeStyle}
    >
      {/* Header */}
      <div className="bg-white/90 dark:bg-black/90 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-teal-600 dark:text-matrix-green font-mono">
                  {dashboard.title}
                </h1>
                {dashboard.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {dashboard.description}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Globe className="w-4 h-4" />
                <span>Public Dashboard</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{dashboard.metadata.viewCount} views</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Updated {new Date(dashboard.metadata.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {dashboard.settings.allowDownloads && (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadDashboard('png')}
                    className="gap-1"
                  >
                    <Download className="w-4 h-4" />
                    PNG
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadDashboard('pdf')}
                    className="gap-1"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </Button>
                </div>
              )}
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.share ? 
                    navigator.share({ 
                      title: dashboard.title, 
                      url: window.location.href 
                    }) :
                    navigator.clipboard.writeText(window.location.href);
                }}
                className="gap-1"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Expiration Warning */}
      {dashboard.metadata.expiresAt && (
        <div className="max-w-7xl mx-auto px-4 py-2">
          <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800 dark:text-yellow-200">
              Limited Time Access
            </AlertTitle>
            <AlertDescription className="text-yellow-700 dark:text-yellow-300">
              This dashboard will expire on {new Date(dashboard.metadata.expiresAt).toLocaleString()}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <motion.div 
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${dashboard.layout.cols}, 1fr)`,
            gridAutoRows: `${dashboard.layout.rowHeight}px`
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {dashboard.widgets.map((widget) => (
            <motion.div
              key={widget.id}
              className="relative"
              style={{
                gridColumn: `span ${widget.position.w}`,
                gridRow: `span ${widget.position.h}`
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.3, 
                delay: dashboard.widgets.indexOf(widget) * 0.1 
              }}
            >
              <PublicWidget widget={widget} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Branding */}
      {dashboard.settings.showBranding && (
        <div className="bg-white/90 dark:bg-black/90 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Powered by</span>
              <a 
                href="https://cryptowebb.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-teal-600 dark:text-matrix-green font-semibold hover:underline flex items-center gap-1"
              >
                CryptoWebb
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Public Widget Component
const PublicWidget: React.FC<{ widget: PublicWidget }> = ({ widget }) => {
  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'chart':
        if (widget.config.chartType === 'candlestick' || widget.config.chartType === 'heatmap' || widget.config.chartType === 'treemap') {
          return (
            <AdvancedChart
              chartType={widget.config.chartType}
              data={widget.data}
              title={widget.title}
              height={300}
            />
          );
        } else {
          return (
            <ChartRenderer
              chartId={widget.config.chartId}
              chartType={widget.config.chartType}
              title={widget.title}
              isLive={widget.config.isLive}
            />
          );
        }

      case 'metric':
        return (
          <Card className="h-full flex flex-col justify-center items-center bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
            {widget.title && (
              <h3 className="text-lg font-semibold text-teal-600 dark:text-matrix-green mb-2 text-center">
                {widget.title}
              </h3>
            )}
            <div className="text-4xl font-bold text-teal-600 dark:text-matrix-green">
              {widget.data?.value || '0'}
            </div>
            {widget.data?.change && (
              <div className={`text-sm mt-2 ${
                widget.data.change >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {widget.data.change >= 0 ? '+' : ''}{widget.data.change}%
              </div>
            )}
          </Card>
        );

      case 'text':
        return (
          <Card className="h-full p-4 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
            {widget.title && (
              <h3 className="text-lg font-semibold text-teal-600 dark:text-matrix-green mb-3">
                {widget.title}
              </h3>
            )}
            <div 
              className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"
              dangerouslySetInnerHTML={{ __html: widget.data?.content || '' }}
            />
          </Card>
        );

      default:
        return (
          <Card className="h-full flex items-center justify-center bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
            <p className="text-gray-500 dark:text-gray-400">
              Unknown widget type: {widget.type}
            </p>
          </Card>
        );
    }
  };

  return renderWidgetContent();
};

export default PublicDashboard;