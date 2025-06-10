import React, { useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import {
  Database,
  LayoutDashboard,
  BarChart4,
  Eye,
  Settings,
  ChevronRight,
  ArrowLeft,
  Bell,
  Zap,
  Command,
} from 'lucide-react';
import { useDataMetricsList } from '@/features/dataMetrics/api/useDataMetrics';
import type { DataMetric } from '@/types/metricsData';
import { MatrixLoader } from '@/components/ui/MatrixLoader';

interface AnalyticsSidebarProps {
  isOpen: boolean;
  onMetricSelect?: (metricId: number) => void;
  isMobile?: boolean;
  onOpenCommandPalette?: () => void;
}

/**
 * Animated sidebar component with switching views.
 * Categories switch the entire sidebar content with smooth animations.
 */
const AnalyticsSidebar: React.FC<AnalyticsSidebarProps> = ({ 
  isOpen, 
  onMetricSelect,
  isMobile = false,
  onOpenCommandPalette
}) => {
  const [currentView, setCurrentView] = useState<'main' | string>('main');
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  
  // Get metricId from URL to highlight the active metric in the sidebar
  const { metricId: activeMetricIdFromParams } = useParams<{ metricId: string }>();

  // Fetch the list of all available data metrics
  const { data: metricsList, isLoading: isLoadingMetrics, error: errorMetrics } = useDataMetricsList();

  // Group metrics by category
  const categorizedMetrics = React.useMemo(() => {
    if (!metricsList || metricsList.length === 0) return {};
    
    const grouped = metricsList.reduce((acc, metric) => {
      const category = metric.Category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(metric);
      return acc;
    }, {} as Record<string, DataMetric[]>);
    
    // Sort categories alphabetically and metrics within each category
    const sortedGrouped: Record<string, DataMetric[]> = {};
    Object.keys(grouped)
      .sort()
      .forEach(category => {
        sortedGrouped[category] = grouped[category].sort((a, b) => 
          a.MetricName.localeCompare(b.MetricName)
        );
      });
    
    return sortedGrouped;
  }, [metricsList]);

  /**
   * Handles selection of a metric from the sidebar.
   */
  const handleMetricSelect = (metricId: number) => {
    navigate(`/analytics/metrics/${metricId}`);
    // Switch back to main view after selection
    switchToMain();
    onMetricSelect?.(metricId);
  };

  /**
   * Switches to a category view with animation
   */
  const switchToCategory = (category: string) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentView(category);
      setIsAnimating(false);
    }, 150); // Half of the total animation duration
  };

  /**
   * Switches back to main view with animation
   */
  const switchToMain = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentView('main');
      setIsAnimating(false);
    }, 150);
  };

  // Style classes
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-3 rounded-lg whitespace-nowrap transition-all duration-200 ease-in-out group
     ${isActive
      ? 'bg-matrix-green/20 text-matrix-green font-semibold shadow-sm shadow-matrix-green/50'
      : 'text-matrix-green/70 hover:bg-matrix-green/10 hover:text-matrix-green'
    }`;
  
  const getMetricButtonClass = (metricId: number) =>
    `w-full flex items-center p-3 rounded-lg text-left transition-all duration-200 ease-in-out group
     ${activeMetricIdFromParams === String(metricId)
      ? 'bg-matrix-green/25 text-matrix-green font-semibold shadow-sm shadow-matrix-green/50'
      : 'text-matrix-green/70 hover:bg-matrix-green/15 hover:text-matrix-green'
    }`;

  const getCategoryButtonClass = () =>
    `w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 ease-in-out group
     text-matrix-green/80 hover:bg-matrix-green/10 hover:text-matrix-green focus:outline-none focus:ring-2 focus:ring-matrix-green/50`;

  const getBackButtonClass = () =>
    `w-full flex items-center p-3 rounded-lg text-left transition-all duration-200 ease-in-out group mb-4
     text-matrix-green/80 hover:bg-matrix-green/10 hover:text-matrix-green focus:outline-none focus:ring-2 focus:ring-matrix-green/50
     border border-matrix-green/30 hover:border-matrix-green/50`;

  // Animation classes
  const getContentClass = () =>
    `flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-matrix-green/50 scrollbar-track-black/30 space-y-6 p-4
     transition-all duration-300 ease-in-out
     ${isOpen ? (isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0') : 'opacity-0 translate-x-4'}`;

  // Main navigation content
  const renderMainContent = () => (
    <>
      {/* Command Palette Section */}
      {onOpenCommandPalette && (
        <div className="mb-6">
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center gap-3 p-3 bg-matrix-green/5 border border-matrix-green/20 rounded-lg hover:bg-matrix-green/10 transition-all duration-200 text-matrix-green/80 hover:text-matrix-green focus:outline-none focus:ring-2 focus:ring-matrix-green/50"
            title="Open command palette"
          >
            <Command size={20} className="flex-shrink-0" />
            <div className="flex-1 text-left">
              <div className="font-medium text-sm">Command Palette</div>
              <div className="text-xs text-matrix-green/60">Quick actions & search</div>
            </div>
            <kbd className="text-xs bg-matrix-green/10 px-2 py-1 rounded border border-matrix-green/20">
              ⌘K
            </kbd>
          </button>
        </div>
      )}

      {/* Standard Navigation */}
      <nav>
        <h3 className="px-2 py-1 text-xs font-semibold text-matrix-green/60 uppercase tracking-wider mb-3">
          Overview
        </h3>
        <ul className="space-y-2">
          <li>
            <NavLink to="/analytics" end className={getNavLinkClass}>
              <LayoutDashboard size={20} className="mr-3 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className="transition-all duration-200">Dashboards</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/analytics/datasources" className={getNavLinkClass}>
              <Database size={20} className="mr-3 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className="transition-all duration-200">Data Sources</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/analytics/cipher-matrix" className={getNavLinkClass}>
              <Eye size={20} className="mr-3 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className="transition-all duration-200">Cipher Matrix</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/analytics/live-crypto" className={getNavLinkClass}>
              <Zap size={20} className="mr-3 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className="transition-all duration-200">Live Crypto</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/analytics/alerts" className={getNavLinkClass}>
              <Bell size={20} className="mr-3 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className="transition-all duration-200">Alerts</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/analytics/manage" className={getNavLinkClass}>
              <Settings size={20} className="mr-3 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className="transition-all duration-200">Manage</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Data Metrics Categories */}
      <nav>
        <h3 className="px-2 py-1 text-xs font-semibold text-matrix-green/60 uppercase tracking-wider mb-3">
          Data Metrics
        </h3>
        {isLoadingMetrics ? (
          <div className="p-4 flex items-center justify-center">
            <MatrixLoader />
          </div>
        ) : errorMetrics ? (
          <div className="p-3 text-red-400 text-sm text-center bg-red-900/10 rounded-lg border border-red-500/20">
            Error loading metrics.
          </div>
        ) : Object.keys(categorizedMetrics).length > 0 ? (
          <div className="space-y-2">
            {Object.entries(categorizedMetrics).map(([category, metrics]) => (
              <button
                key={category}
                onClick={() => switchToCategory(category)}
                className={getCategoryButtonClass()}
              >
                <span className="flex items-center">
                  <BarChart4 
                    size={20} 
                    className="mr-3 flex-shrink-0 text-matrix-green/60 transition-all duration-200 group-hover:text-matrix-green group-hover:scale-110" 
                  />
                  <span className="font-medium transition-colors duration-200">
                    {category}
                  </span>
                  <span className="ml-2 text-xs text-matrix-green/60 transition-all duration-200 group-hover:text-matrix-green/80">
                    ({metrics.length})
                  </span>
                </span>
                <ChevronRight 
                  size={20} 
                  className="flex-shrink-0 text-matrix-green/60 transition-all duration-200 group-hover:text-matrix-green group-hover:translate-x-1" 
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="p-3 text-matrix-green/60 text-sm text-center bg-matrix-green/5 rounded-lg border border-matrix-green/20">
            No metrics available.
          </div>
        )}
      </nav>
    </>
  );

  // Category content
  const renderCategoryContent = (category: string) => (
    <>
      {/* Back Button */}
      <button
        onClick={switchToMain}
        className={getBackButtonClass()}
        aria-label="Back to main menu"
      >
        <ArrowLeft size={20} className="mr-3 transition-transform duration-200 group-hover:-translate-x-1" />
        <span className="font-medium">Back to Menu</span>
      </button>

      {/* Category Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-matrix-green flex items-center">
          <BarChart4 size={24} className="mr-3 text-matrix-green" />
          {category}
        </h3>
        <p className="text-sm text-matrix-green/60 mt-1">
          {categorizedMetrics[category]?.length || 0} metrics available
        </p>
      </div>

      {/* Category Metrics */}
      <nav>
        <div className="space-y-2">
          {categorizedMetrics[category]?.map((metric: DataMetric, index) => (
            <button
              key={metric.MetricID}
              onClick={() => handleMetricSelect(metric.MetricID)}
              className={getMetricButtonClass(metric.MetricID)}
              title={metric.Description}
              style={{
                animationDelay: `${index * 30}ms`,
              }}
            >
              <BarChart4 
                size={18} 
                className="mr-3 flex-shrink-0 text-matrix-green/60 transition-all duration-200 group-hover:text-matrix-green group-hover:scale-110" 
              />
              <div className="flex-1 text-left">
                <div className="font-medium text-sm transition-all duration-200">
                  {metric.MetricName}
                </div>
                <div className="text-xs text-matrix-green/50 transition-all duration-200 group-hover:text-matrix-green/70 mt-1">
                  {metric.DataSourceType} • {metric.Blockchain}
                </div>
              </div>
            </button>
          ))}
        </div>
      </nav>
    </>
  );

  return (
    <aside
      className={`
        ${isOpen ? (isMobile ? 'w-80' : 'w-64') + ' opacity-100' : 'w-0 opacity-0'} 
        bg-black/90 border-r border-matrix-green/30 backdrop-blur-sm
        transition-all duration-300 ease-in-out
        overflow-hidden flex flex-col flex-shrink-0 
        shadow-lg shadow-matrix-green/10 h-full
        ${isMobile ? 'border-matrix-green/50' : ''}
      `}
    >
      <div className={getContentClass()}>
        {currentView === 'main' 
          ? renderMainContent() 
          : renderCategoryContent(currentView)
        }
      </div>
    </aside>
  );
};

export default AnalyticsSidebar;