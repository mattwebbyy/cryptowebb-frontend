// src/pages/shared/PublicDashboard.tsx — read-only public view of a shared dashboard.
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, ExternalLink, Globe, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ChartRenderer } from '@/features/charts/components/chartRenderer';
import type { WidgetChartType } from '@/features/charts/components/chartData';
import { API_BASE_URL } from '@/lib/config';
import { toast } from 'sonner';

export interface SharedChart {
  id: string;
  name: string;
  type: string;
  isLive: boolean;
  position: number;
}

export interface SharedDashboard {
  id: string;
  name: string;
  layout: string;
  isPublic: boolean;
  charts: SharedChart[];
  updatedAt: string;
}

export const useSharedDashboard = (shareToken: string) =>
  useQuery<SharedDashboard>({
    queryKey: ['public-dashboard', shareToken],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/v1/public/dashboards/${shareToken}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('This dashboard does not exist or is no longer shared.');
        }
        throw new Error(`Failed to load dashboard (${response.status}).`);
      }
      return response.json();
    },
    enabled: !!shareToken,
    retry: false,
  });

export const SharedChartGrid = ({ charts }: { charts: SharedChart[] }) => (
  <div className="grid gap-5 md:grid-cols-2">
    {[...charts]
      .sort((a, b) => a.position - b.position)
      .map((chart, index) => (
        <motion.div
          key={chart.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <ChartRenderer
            chartId={chart.id}
            chartType={chart.type as WidgetChartType}
            title={chart.name}
            isLive={chart.isLive}
          />
        </motion.div>
      ))}
  </div>
);

const PublicDashboard = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const { data: dashboard, isLoading, error } = useSharedDashboard(shareToken || '');

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: dashboard?.name, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    } catch {
      // User cancelled the share sheet — nothing to do.
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto mb-4"
            role="status"
            aria-label="Loading dashboard"
          />
          <p className="text-text-secondary">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="rounded-2xl border border-border bg-surface p-10 max-w-md w-full text-center">
          <AlertTriangle className="w-10 h-10 mx-auto mb-4 text-warning" aria-hidden="true" />
          <h2 className="text-xl font-semibold tracking-tight mb-2">Dashboard unavailable</h2>
          <p className="text-text-secondary mb-6">
            {error instanceof Error
              ? error.message
              : 'The requested dashboard could not be found or may have been removed.'}
          </p>
          <Button variant="outline" onClick={() => window.history.back()}>
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-surface/90 border-b border-border sticky top-0 z-40 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight truncate">{dashboard.name}</h1>
            <div className="mt-1 flex items-center gap-3 text-xs text-text-secondary">
              <span className="inline-flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                Public dashboard
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                Updated {new Date(dashboard.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Share
          </Button>
        </div>
      </div>

      {/* Charts */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {dashboard.charts.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-12 text-center text-text-secondary">
            This dashboard has no charts yet.
          </div>
        ) : (
          <SharedChartGrid charts={dashboard.charts} />
        )}
      </div>

      {/* Branding */}
      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-center gap-2 text-xs text-text-secondary">
          <span>Powered by</span>
          <a
            href="https://cryptowebb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium hover:underline inline-flex items-center gap-1"
          >
            CryptoWebb
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PublicDashboard;
