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
  Wallet,
  BookOpen,
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
      ? 'bg-primary/20 text-primary font-semibold shadow-sm shadow-primary/50'
      : 'text-text-secondary hover:bg-primary/10 hover:text-primary'
    }`;
  
  const getMetricButtonClass = (metricId: number) =>
    `w-full flex items-center ${isMobile ? 'p-4 min-h-[48px]' : 'p-3'} rounded-lg text-left transition-all duration-200 ease-in-out group
     ${activeMetricIdFromParams === String(metricId)
      ? 'bg-primary/25 text-primary font-semibold shadow-sm shadow-primary/50'
      : 'text-text-secondary hover:bg-primary/15 hover:text-primary'
    }`;

  const getCategoryButtonClass = () =>
    `w-full flex items-center justify-between ${isMobile ? 'p-4 min-h-[48px]' : 'p-3'} rounded-lg text-left transition-all duration-200 ease-in-out group
     text-text-secondary hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50`;

  const getBackButtonClass = () =>
    `w-full flex items-center ${isMobile ? 'p-4 min-h-[48px]' : 'p-3'} rounded-lg text-left transition-all duration-200 ease-in-out group mb-4
     text-text-secondary hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50
     border border-border hover:border-primary/50`;

  const getMobileNavClass = () =>
    `flex items-center gap-1.5 py-2.5 px-2 rounded-md transition-all duration-200 min-h-[40px] text-xs font-medium border border-primary/30 bg-black/50 text-text-secondary hover:text-primary hover:bg-primary/15 hover:border-primary/50`;

  // Animation classes
  const getContentClass = () =>
    `flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-surface/30 space-y-6 p-4
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
            className={`w-full flex items-center gap-3 ${isMobile ? 'p-4 min-h-[48px]' : 'p-3'} bg-primary/5 border border-border rounded-lg hover:bg-primary/10 transition-all duration-200 text-text-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
            title="Open command palette"
          >
            <Command size={20} className="flex-shrink-0" />
            <div className="flex-1 text-left">
              <div className="font-medium text-sm">Command Palette</div>
              <div className="text-xs text-text-secondary/60">Quick actions & search</div>
            </div>
            <kbd className="text-xs bg-primary/10 px-2 py-1 rounded border border-border">
              ⌘K
            </kbd>
          </button>
        </div>
      )}

      {/* Standard Navigation */}
      <nav>
        <h3 className="px-2 py-1 text-xs font-semibold text-text-secondary/60 uppercase tracking-wider mb-3">
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
            <NavLink to="/analytics/portfolio" className={getNavLinkClass}>
              <Wallet size={20} className="mr-3 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className="transition-all duration-200">Portfolio</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/analytics/api-docs" className={getNavLinkClass}>
              <BookOpen size={20} className="mr-3 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className="transition-all duration-200">API Docs</span>
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
        <h3 className="px-2 py-1 text-xs font-semibold text-text-secondary/60 uppercase tracking-wider mb-3">
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
                    className="mr-3 flex-shrink-0 text-text-secondary/60 transition-all duration-200 group-hover:text-primary group-hover:scale-110" 
                  />
                  <span className="font-medium transition-colors duration-200">
                    {category}
                  </span>
                  <span className="ml-2 text-xs text-text-secondary/60 transition-all duration-200 group-hover:text-primary/80">
                    ({metrics.length})
                  </span>
                </span>
                <ChevronRight 
                  size={20} 
                  className="flex-shrink-0 text-text-secondary/60 transition-all duration-200 group-hover:text-primary group-hover:translate-x-1" 
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="p-3 text-text-secondary/60 text-sm text-center bg-primary/5 rounded-lg border border-border">
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
        <h3 className="text-lg font-semibold text-primary flex items-center">
          <BarChart4 size={24} className="mr-3 text-primary" />
          {category}
        </h3>
        <p className="text-sm text-text-secondary/60 mt-1">
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
                className="mr-3 flex-shrink-0 text-text-secondary/60 transition-all duration-200 group-hover:text-primary group-hover:scale-110" 
              />
              <div className="flex-1 text-left">
                <div className="font-medium text-sm transition-all duration-200">
                  {metric.MetricName}
                </div>
                <div className="text-xs text-text-secondary/50 transition-all duration-200 group-hover:text-primary/70 mt-1">
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
        ${isOpen ? (isMobile ? 'w-full max-w-sm' : 'w-64') + ' opacity-100' : 'w-0 opacity-0'} 
        bg-surface/98 border-r border-border backdrop-blur-md
        transition-all duration-300 ease-in-out
        overflow-hidden flex flex-col flex-shrink-0 
        shadow-lg shadow-primary/10 h-full
        ${isMobile ? 'fixed left-0 top-0 z-[60] border-r-0 shadow-2xl h-screen max-h-screen' : 'relative'}
      `}
    >
      <div className={isMobile ? 'flex-1 bg-black/[0.98] p-0 overflow-hidden flex flex-col' : getContentClass()}>
        {isMobile ? (
          // Mobile compact layout
          <div className="p-3 space-y-3 flex-1 flex flex-col overflow-hidden">
            {/* Command Palette - Mobile */}
            {onOpenCommandPalette && (
              <div className="text-center">
                <button
                  onClick={onOpenCommandPalette}
                  className="w-full py-2 px-3 bg-primary/10 border border-primary/30 rounded-md hover:bg-primary/15 transition-all duration-200 text-primary text-xs font-medium min-h-[40px] flex items-center justify-center gap-2"
                  title="Open command palette"
                >
                  <Command size={12} />
                  <span>Search (⌘K)</span>
                </button>
              </div>
            )}

            {/* Analytics Overview - Compact Grid */}
            <div>
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 text-center">
                Analytics
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                <NavLink to="/analytics" end className={`${getMobileNavClass()} justify-center`}>
                  <LayoutDashboard size={12} />
                  <span>Dashboards</span>
                </NavLink>
                <NavLink to="/analytics/datasources" className={`${getMobileNavClass()} justify-center`}>
                  <Database size={12} />
                  <span>Sources</span>
                </NavLink>
                <NavLink to="/analytics/cipher-matrix" className={`${getMobileNavClass()} justify-center`}>
                  <Eye size={12} />
                  <span>Cipher</span>
                </NavLink>
                <NavLink to="/analytics/live-crypto" className={`${getMobileNavClass()} justify-center`}>
                  <Zap size={12} />
                  <span>Live</span>
                </NavLink>
                <NavLink to="/analytics/alerts" className={`${getMobileNavClass()} justify-center`}>
                  <Bell size={12} />
                  <span>Alerts</span>
                </NavLink>
                <NavLink to="/analytics/portfolio" className={`${getMobileNavClass()} justify-center`}>
                  <Wallet size={12} />
                  <span>Portfolio</span>
                </NavLink>
                <NavLink to="/analytics/api-docs" className={`${getMobileNavClass()} justify-center`}>
                  <BookOpen size={12} />
                  <span>API Docs</span>
                </NavLink>
                <NavLink to="/analytics/manage" className={`${getMobileNavClass()} justify-center`}>
                  <Settings size={12} />
                  <span>Manage</span>
                </NavLink>
              </div>
            </div>

            {/* Data Metrics - Show All Categories */}
            {Object.keys(categorizedMetrics).length > 0 && (
              <div className="pt-2 border-t border-primary/30">
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 text-center">
                  Metrics ({Object.keys(categorizedMetrics).length})
                </h3>
                <div className="grid grid-cols-2 gap-1.5 max-h-[200px] overflow-y-auto">
                  {Object.entries(categorizedMetrics).map(([category, metrics]) => (
                    <button
                      key={category}
                      onClick={() => {
                        switchToCategory(category);
                        // Auto-close sidebar on mobile after selection
                        if (isMobile && onMetricSelect) {
                          // Note: We don't have a close function here, but the parent will handle it
                        }
                      }}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-md transition-all duration-200 min-h-[40px] text-xs font-medium border border-primary/30 bg-black/50 text-text-secondary hover:text-primary hover:bg-primary/15 hover:border-primary/50"
                      title={`${category} - ${Array.isArray(metrics) ? metrics.length : 0} metrics`}
                    >
                      <BarChart4 size={12} />
                      <span className="truncate">{category.length > 8 ? category.slice(0, 8) + '...' : category}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Individual Metrics - Show when category is selected */}
            {currentView !== 'main' && isMobile && (
              <div className="pt-2 border-t border-primary/30 flex-1 flex flex-col overflow-hidden">
                <button
                  onClick={() => setCurrentView('main')}
                  className="w-full py-2 px-3 mb-2 bg-primary/10 border border-primary/30 rounded-md hover:bg-primary/15 transition-all duration-200 text-primary text-xs font-medium min-h-[40px] flex items-center justify-center gap-2 flex-shrink-0"
                >
                  <ArrowLeft size={12} />
                  <span>Back to Categories</span>
                </button>
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 text-center flex-shrink-0">
                  {currentView} Metrics ({categorizedMetrics[currentView]?.length || 0})
                </h3>
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-surface/30">
                  <div className="grid grid-cols-1 gap-1.5 pb-4">
                    {categorizedMetrics[currentView]?.map((metric, index) => (
                      <button
                        key={metric.MetricID}
                        onClick={() => {
                          handleMetricSelect(metric.MetricID);
                        }}
                        className="flex items-start gap-2 py-3 px-3 rounded-md transition-all duration-200 min-h-[48px] text-xs font-medium border border-primary/30 bg-black/50 text-text-secondary hover:text-primary hover:bg-primary/15 hover:border-primary/50 text-left active:scale-95"
                        title={metric.Description}
                        style={{
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        <BarChart4 size={14} className="mt-0.5 flex-shrink-0 text-primary/60" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm leading-tight mb-1">{metric.MetricName}</div>
                          <div className="text-xs text-text-secondary/60 leading-tight">
                            {metric.DataSourceType} • {metric.Blockchain}
                          </div>
                          {metric.Description && (
                            <div className="text-xs text-text-secondary/50 mt-1 line-clamp-2">
                              {metric.Description}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Desktop layout
          currentView === 'main' 
            ? renderMainContent() 
            : renderCategoryContent(currentView)
        )}
      </div>
    </aside>
  );
};

export default AnalyticsSidebar;