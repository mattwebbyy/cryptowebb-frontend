// src/features/dashboards/components/ShareableDashboard.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { GlitchButton } from '@/components/ui/GlitchEffects';
import { AdvancedChart } from '@/features/charts/components/AdvancedChartTypes';
import { PortfolioTracker } from '@/features/portfolio/components/PortfolioTracker';
import { 
  Share2, 
  Link2, 
  Eye, 
  EyeOff, 
  Copy, 
  Download,
  Code,
  Settings,
  Users,
  Clock,
  Shield,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  QrCode
} from 'lucide-react';

// Types
export interface ShareableDashboard {
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  shareToken: string;
  embedToken: string;
  createdAt: string;
  lastAccessed?: string;
  accessCount: number;
  expiresAt?: string;
  allowedDomains: string[];
  widgets: DashboardWidget[];
  layout: DashboardLayout;
  settings: ShareSettings;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'portfolio' | 'metric' | 'text';
  title: string;
  config: any;
  position: { x: number; y: number; w: number; h: number };
}

export interface DashboardLayout {
  cols: number;
  rowHeight: number;
  margin: [number, number];
  containerPadding: [number, number];
}

export interface ShareSettings {
  allowEmbedding: boolean;
  showBranding: boolean;
  allowDownloads: boolean;
  passwordProtected: boolean;
  password?: string;
  customTheme?: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
}

export interface ShareableLink {
  id: string;
  type: 'public' | 'private' | 'embed';
  url: string;
  qrCode?: string;
  expiresAt?: string;
  accessCount: number;
  isActive: boolean;
}

// Shareable Dashboard Hook
export const useShareableDashboard = (dashboardId: string) => {
  const [dashboard, setDashboard] = useState<ShareableDashboard | null>(null);
  const [shareLinks, setShareLinks] = useState<ShareableLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/v1/dashboards/${dashboardId}/share`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard');
      }

      const data = await response.json();
      setDashboard(data.dashboard);
      setShareLinks(data.shareLinks || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateShareSettings = async (settings: Partial<ShareSettings>) => {
    try {
      const response = await fetch(`/api/v1/dashboards/${dashboardId}/share/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Failed to update share settings');
      }

      const updatedDashboard = await response.json();
      setDashboard(updatedDashboard);
      return updatedDashboard;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const createShareLink = async (type: 'public' | 'private' | 'embed', options?: {
    expiresIn?: number;
    password?: string;
    allowedDomains?: string[];
  }) => {
    try {
      const response = await fetch(`/api/v1/dashboards/${dashboardId}/share/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ type, ...options })
      });

      if (!response.ok) {
        throw new Error('Failed to create share link');
      }

      const newLink = await response.json();
      setShareLinks(prev => [...prev, newLink]);
      return newLink;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const revokeShareLink = async (linkId: string) => {
    try {
      const response = await fetch(`/api/v1/dashboards/${dashboardId}/share/links/${linkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to revoke share link');
      }

      setShareLinks(prev => prev.filter(link => link.id !== linkId));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (dashboardId) {
      fetchDashboard();
    }
  }, [dashboardId]);

  return {
    dashboard,
    shareLinks,
    isLoading,
    error,
    updateShareSettings,
    createShareLink,
    revokeShareLink,
    refetch: fetchDashboard
  };
};

// Main Shareable Dashboard Component
export const ShareableDashboardManager: React.FC<{ dashboardId: string }> = ({ dashboardId }) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'links' | 'embed' | 'analytics'>('settings');
  const [showCreateLink, setShowCreateLink] = useState(false);
  const [showEmbedCode, setShowEmbedCode] = useState(false);

  const {
    dashboard,
    shareLinks,
    isLoading,
    error,
    updateShareSettings,
    createShareLink,
    revokeShareLink
  } = useShareableDashboard(dashboardId);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!dashboard) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Dashboard Not Found</AlertTitle>
        <AlertDescription>The requested dashboard could not be found.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-mono text-teal-600 dark:text-matrix-green">
            Share Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {dashboard.title}
          </p>
        </div>

        <div className="flex gap-2">
          <GlitchButton
            variant="secondary"
            onClick={() => setShowCreateLink(true)}
            className="gap-2"
          >
            <Link2 className="w-4 h-4" />
            Create Link
          </GlitchButton>
          
          <GlitchButton
            onClick={() => setShowEmbedCode(true)}
            className="gap-2"
          >
            <Code className="w-4 h-4" />
            Get Embed Code
          </GlitchButton>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        {[
          { id: 'settings', label: 'Share Settings', icon: Settings },
          { id: 'links', label: 'Share Links', icon: Link2 },
          { id: 'embed', label: 'Embed Code', icon: Code },
          { id: 'analytics', label: 'Analytics', icon: Users }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors font-mono text-sm ${
              activeTab === tab.id
                ? 'bg-teal-600 dark:bg-matrix-green text-white dark:text-black'
                : 'text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-matrix-green'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'settings' && (
            <ShareSettingsPanel 
              dashboard={dashboard} 
              onUpdateSettings={updateShareSettings} 
            />
          )}
          
          {activeTab === 'links' && (
            <ShareLinksPanel 
              shareLinks={shareLinks}
              onCreateLink={createShareLink}
              onRevokeLink={revokeShareLink}
            />
          )}
          
          {activeTab === 'embed' && (
            <EmbedCodePanel dashboard={dashboard} />
          )}
          
          {activeTab === 'analytics' && (
            <ShareAnalyticsPanel dashboard={dashboard} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Create Link Modal */}
      <AnimatePresence>
        {showCreateLink && (
          <CreateShareLinkModal
            isOpen={showCreateLink}
            onClose={() => setShowCreateLink(false)}
            onCreateLink={createShareLink}
          />
        )}
      </AnimatePresence>

      {/* Embed Code Modal */}
      <AnimatePresence>
        {showEmbedCode && (
          <EmbedCodeModal
            isOpen={showEmbedCode}
            onClose={() => setShowEmbedCode(false)}
            dashboard={dashboard}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Share Settings Panel
const ShareSettingsPanel: React.FC<{
  dashboard: ShareableDashboard;
  onUpdateSettings: (settings: Partial<ShareSettings>) => Promise<ShareableDashboard>;
}> = ({ dashboard, onUpdateSettings }) => {
  const [settings, setSettings] = useState(dashboard.settings);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (newSettings: Partial<ShareSettings>) => {
    try {
      setIsUpdating(true);
      await onUpdateSettings(newSettings);
      setSettings({ ...settings, ...newSettings });
    } catch (error) {
      console.error('Failed to update settings:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
        <h3 className="text-lg font-semibold text-teal-600 dark:text-matrix-green mb-4">
          Privacy Settings
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Public Access
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Allow anyone with the link to view
              </p>
            </div>
            <button
              onClick={() => handleUpdate({ allowEmbedding: !settings.allowEmbedding })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                dashboard.isPublic ? 'bg-teal-600 dark:bg-matrix-green' : 'bg-gray-200 dark:bg-gray-700'
              }`}
              disabled={isUpdating}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  dashboard.isPublic ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Allow Embedding
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Enable iframe embedding on other sites
              </p>
            </div>
            <button
              onClick={() => handleUpdate({ allowEmbedding: !settings.allowEmbedding })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.allowEmbedding ? 'bg-teal-600 dark:bg-matrix-green' : 'bg-gray-200 dark:bg-gray-700'
              }`}
              disabled={isUpdating}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.allowEmbedding ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Show CryptoWebb Branding
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Display "Powered by CryptoWebb" on shared dashboards
              </p>
            </div>
            <button
              onClick={() => handleUpdate({ showBranding: !settings.showBranding })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.showBranding ? 'bg-teal-600 dark:bg-matrix-green' : 'bg-gray-200 dark:bg-gray-700'
              }`}
              disabled={isUpdating}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.showBranding ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Allow Downloads
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Enable PDF and CSV exports for viewers
              </p>
            </div>
            <button
              onClick={() => handleUpdate({ allowDownloads: !settings.allowDownloads })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.allowDownloads ? 'bg-teal-600 dark:bg-matrix-green' : 'bg-gray-200 dark:bg-gray-700'
              }`}
              disabled={isUpdating}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.allowDownloads ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
        <h3 className="text-lg font-semibold text-teal-600 dark:text-matrix-green mb-4">
          Security Options
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2 block">
              Allowed Domains
            </label>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Restrict embedding to specific domains (one per line)
            </p>
            <textarea
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-mono text-sm"
              rows={4}
              placeholder="example.com&#10;mydomain.org"
              defaultValue={dashboard.allowedDomains.join('\n')}
              onChange={(e) => {
                const domains = e.target.value.split('\n').filter(d => d.trim());
                handleUpdate({ allowedDomains: domains } as any);
              }}
            />
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
              Dashboard Statistics
            </h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <div className="text-2xl font-bold text-teal-600 dark:text-matrix-green">
                  {dashboard.accessCount}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Views</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <div className="text-2xl font-bold text-teal-600 dark:text-matrix-green">
                  {dashboard.lastAccessed ? new Date(dashboard.lastAccessed).toLocaleDateString() : 'Never'}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Last Accessed</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Share Links Panel
const ShareLinksPanel: React.FC<{
  shareLinks: ShareableLink[];
  onCreateLink: (type: 'public' | 'private' | 'embed', options?: any) => Promise<ShareableLink>;
  onRevokeLink: (linkId: string) => Promise<void>;
}> = ({ shareLinks, onCreateLink, onRevokeLink }) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const copyToClipboard = async (text: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(linkId);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="space-y-4">
      {shareLinks.length === 0 ? (
        <Card className="p-8 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green text-center">
          <Share2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            No Share Links Created
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create share links to allow others to view your dashboard
          </p>
          <GlitchButton onClick={() => onCreateLink('public')}>
            Create First Link
          </GlitchButton>
        </Card>
      ) : (
        <div className="space-y-3">
          {shareLinks.map((link) => (
            <Card key={link.id} className="p-4 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      link.type === 'public' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : link.type === 'private'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    }`}>
                      {link.type === 'public' && <Eye className="w-3 h-3 mr-1" />}
                      {link.type === 'private' && <Shield className="w-3 h-3 mr-1" />}
                      {link.type === 'embed' && <Code className="w-3 h-3 mr-1" />}
                      {link.type.toUpperCase()}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${link.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {link.accessCount} views
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono text-gray-800 dark:text-gray-200 truncate">
                      {link.url}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(link.url, link.id)}
                      className="flex-shrink-0"
                    >
                      {copiedLink === link.id ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  {link.expiresAt && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-600 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      Expires: {new Date(link.expiresAt).toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(link.url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onRevokeLink(link.id)}
                  >
                    Revoke
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Embed Code Panel
const EmbedCodePanel: React.FC<{ dashboard: ShareableDashboard }> = ({ dashboard }) => {
  const [embedOptions, setEmbedOptions] = useState({
    width: '100%',
    height: '600px',
    showBranding: dashboard.settings.showBranding,
    responsive: true
  });

  const generateEmbedCode = () => {
    const baseUrl = window.location.origin;
    const embedUrl = `${baseUrl}/embed/${dashboard.embedToken}`;
    
    return `<iframe
  src="${embedUrl}"
  width="${embedOptions.width}"
  height="${embedOptions.height}"
  frameborder="0"
  ${embedOptions.responsive ? 'style="width: 100%; min-height: 600px;"' : ''}
  allowfullscreen>
</iframe>`;
  };

  const copyEmbedCode = async () => {
    try {
      await navigator.clipboard.writeText(generateEmbedCode());
    } catch (error) {
      console.error('Failed to copy embed code:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
        <h3 className="text-lg font-semibold text-teal-600 dark:text-matrix-green mb-4">
          Embed Configuration
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
              Width
            </label>
            <input
              type="text"
              value={embedOptions.width}
              onChange={(e) => setEmbedOptions({ ...embedOptions, width: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              placeholder="100% or 800px"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
              Height
            </label>
            <input
              type="text"
              value={embedOptions.height}
              onChange={(e) => setEmbedOptions({ ...embedOptions, height: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              placeholder="600px"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={embedOptions.responsive}
              onChange={(e) => setEmbedOptions({ ...embedOptions, responsive: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-gray-800 dark:text-gray-200">Responsive</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={embedOptions.showBranding}
              onChange={(e) => setEmbedOptions({ ...embedOptions, showBranding: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-gray-800 dark:text-gray-200">Show Branding</span>
          </label>
        </div>
      </Card>

      <Card className="p-6 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-teal-600 dark:text-matrix-green">
            Embed Code
          </h3>
          <GlitchButton onClick={copyEmbedCode} size="sm" className="gap-2">
            <Copy className="w-4 h-4" />
            Copy Code
          </GlitchButton>
        </div>
        
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
          {generateEmbedCode()}
        </pre>
      </Card>

      <Card className="p-6 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
        <h3 className="text-lg font-semibold text-teal-600 dark:text-matrix-green mb-4">
          Preview
        </h3>
        <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-gray-50 dark:bg-gray-800">
          <iframe
            src={`${window.location.origin}/embed/${dashboard.embedToken}`}
            width={embedOptions.responsive ? '100%' : embedOptions.width}
            height="300px"
            frameBorder="0"
            style={{ minHeight: '300px' }}
            title="Dashboard Preview"
          />
        </div>
      </Card>
    </div>
  );
};

// Share Analytics Panel
const ShareAnalyticsPanel: React.FC<{ dashboard: ShareableDashboard }> = ({ dashboard }) => {
  // Mock analytics data - in real app this would come from API
  const analyticsData = {
    totalViews: dashboard.accessCount,
    uniqueViewers: Math.floor(dashboard.accessCount * 0.7),
    avgViewDuration: '2m 34s',
    topReferrers: [
      { domain: 'twitter.com', views: 45 },
      { domain: 'linkedin.com', views: 32 },
      { domain: 'direct', views: 28 }
    ]
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
        <h3 className="text-lg font-semibold text-teal-600 dark:text-matrix-green mb-4">
          View Statistics
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Total Views</span>
            <span className="text-2xl font-bold text-teal-600 dark:text-matrix-green">
              {analyticsData.totalViews}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Unique Viewers</span>
            <span className="text-2xl font-bold text-teal-600 dark:text-matrix-green">
              {analyticsData.uniqueViewers}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Avg. Duration</span>
            <span className="text-2xl font-bold text-teal-600 dark:text-matrix-green">
              {analyticsData.avgViewDuration}
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
        <h3 className="text-lg font-semibold text-teal-600 dark:text-matrix-green mb-4">
          Top Referrers
        </h3>
        
        <div className="space-y-3">
          {analyticsData.topReferrers.map((referrer, index) => (
            <div key={referrer.domain} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                  #{index + 1}
                </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {referrer.domain}
                </span>
              </div>
              <span className="text-teal-600 dark:text-matrix-green font-semibold">
                {referrer.views}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// Create Share Link Modal (placeholder)
const CreateShareLinkModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onCreateLink: (type: 'public' | 'private' | 'embed', options?: any) => Promise<ShareableLink>;
}> = ({ isOpen, onClose, onCreateLink }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="p-6 bg-white/95 dark:bg-black/95 border-teal-600 dark:border-matrix-green max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-teal-600 dark:text-matrix-green mb-4">
          Create Share Link
        </h3>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
          Share link creation form will be implemented here
        </p>
        <Button variant="outline" onClick={onClose} className="w-full">
          Close
        </Button>
      </Card>
    </div>
  );
};

// Embed Code Modal (placeholder)
const EmbedCodeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  dashboard: ShareableDashboard;
}> = ({ isOpen, onClose, dashboard }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="p-6 bg-white/95 dark:bg-black/95 border-teal-600 dark:border-matrix-green max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-teal-600 dark:text-matrix-green mb-4">
          Embed Dashboard
        </h3>
        <EmbedCodePanel dashboard={dashboard} />
        <div className="mt-6">
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ShareableDashboardManager;