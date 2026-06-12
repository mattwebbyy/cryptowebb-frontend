// src/pages/shared/EmbedDashboard.tsx — chrome-less iframe-embeddable view of a shared dashboard.
import { useParams } from 'react-router-dom';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { SharedChartGrid, useSharedDashboard } from './PublicDashboard';

const EmbedDashboard = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const { data: dashboard, isLoading, error } = useSharedDashboard(shareToken || '');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"
          role="status"
          aria-label="Loading dashboard"
        />
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-center">
        <div>
          <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-warning" aria-hidden="true" />
          <p className="text-sm text-text-secondary">
            {error instanceof Error ? error.message : 'Dashboard unavailable.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h1 className="text-sm font-semibold truncate">{dashboard.name}</h1>
        <a
          href={`/shared/${shareToken}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-primary"
        >
          CryptoWebb
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
        </a>
      </div>

      {dashboard.charts.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-8 text-center text-sm text-text-secondary">
          This dashboard has no charts yet.
        </div>
      ) : (
        <SharedChartGrid charts={dashboard.charts} />
      )}
    </div>
  );
};

export default EmbedDashboard;
