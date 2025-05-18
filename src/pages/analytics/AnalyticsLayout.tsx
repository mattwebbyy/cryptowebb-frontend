import React, { useState, useMemo } from 'react';
import { Outlet, NavLink, useNavigate, useParams } from 'react-router-dom';
import {
  Home,
  Database,
  LayoutDashboard,
  ChevronLeft,
  Menu,
  BarChart4,
  Eye,
  Settings,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useDataMetricsList } from '@/features/dataMetrics/api/useDataMetrics';
import type { DataMetric } from '@/types/metricsData';
import { MatrixLoader } from '@/components/ui/MatrixLoader';

/**
 * Layout component for the analytics section.
 * Includes a sidebar for navigation and a main content area rendered via Outlet.
 */
const AnalyticsLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Transactions'])); // Start with one category expanded
  const navigate = useNavigate();
  
  // Get metricId from URL to highlight the active metric in the sidebar
  const { metricId: activeMetricIdFromParams } = useParams<{ metricId: string }>();

  // Fetch the list of all available data metrics
  const { data: metricsList, isLoading: isLoadingMetrics, error: errorMetrics } = useDataMetricsList();

  // Group metrics by category
  const categorizedMetrics = useMemo(() => {
    if (!metricsList || metricsList.length === 0) return {};
    
    const grouped = metricsList.reduce((acc, metric) => {
      const category = metric.Category || 'Other'; // Default to 'Other' if no category
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
   * Navigates to the specific metric's chart page.
   * @param metricId - The ID of the selected metric.
   */
  const handleMetricSelect = (metricId: number) => {
    navigate(`/analytics/metrics/${metricId}`);
  };

  /**
   * Toggles the expanded state of a category
   * @param category - The category to toggle
   */
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Common NavLink class generation
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-2 rounded-md whitespace-nowrap transition-colors duration-150 ease-in-out
     ${isActive
      ? 'bg-matrix-green/20 text-matrix-green font-semibold shadow-sm shadow-matrix-green/50'
      : 'text-matrix-green/70 hover:bg-matrix-green/10 hover:text-matrix-green'
    }`;
  
  const getMetricButtonClass = (metricId: number) =>
    `w-full flex items-center p-2 pl-8 rounded-md whitespace-nowrap text-left transition-colors duration-150 ease-in-out
     ${activeMetricIdFromParams === String(metricId)
      ? 'bg-matrix-green/25 text-matrix-green font-semibold shadow-sm shadow-matrix-green/50'
      : 'text-matrix-green/70 hover:bg-matrix-green/15 hover:text-matrix-green'
    }`;

  const getCategoryButtonClass = (category: string) =>
    `w-full flex items-center justify-between p-2 rounded-md whitespace-nowrap text-left transition-colors duration-150 ease-in-out
     text-matrix-green/80 hover:bg-matrix-green/10 hover:text-matrix-green focus:outline-none focus:ring-2 focus:ring-matrix-green/50`;

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-black text-matrix-green font-mono">
      {/* Header Bar */}
      <header className="bg-black/80 border-b border-matrix-green/50 p-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-matrix-green/20 text-matrix-green focus:outline-none focus:ring-2 focus:ring-matrix-green"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <ChevronLeft size={22} /> : <Menu size={22} />}
          </button>
          <h1 className="ml-3 text-xl font-bold tracking-wider">ANALYTICS PLATFORM</h1>
        </div>
        <NavLink to="/" className={getNavLinkClass({isActive: false}) + " mr-2"}>
            <Home size={18} className="mr-2"/> Home
        </NavLink>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            ${sidebarOpen ? 'w-64 p-3' : 'w-0'} 
            bg-black/50 border-r border-matrix-green/30
            transition-all duration-300 ease-in-out
            overflow-hidden flex flex-col flex-shrink-0 
          `}
        >
          {sidebarOpen && (
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-matrix-green/50 scrollbar-track-black/30 space-y-6">
              {/* Standard Navigation */}
              <nav>
                <h3 className="px-2 py-1 text-xs font-semibold text-matrix-green/60 uppercase tracking-wider mb-1">
                  Overview
                </h3>
                <ul className="space-y-1">
                  <li><NavLink to="/analytics" end className={getNavLinkClass}><LayoutDashboard size={18} className="mr-3 flex-shrink-0" />Dashboards</NavLink></li>
                  <li><NavLink to="/analytics/datasources" className={getNavLinkClass}><Database size={18} className="mr-3 flex-shrink-0" />Data Sources</NavLink></li>
                  <li><NavLink to="/analytics/cipher-matrix" className={getNavLinkClass}><Eye size={18} className="mr-3 flex-shrink-0" />Cipher Matrix</NavLink></li>
                  <li><NavLink to="/analytics/manage" className={getNavLinkClass}><Settings size={18} className="mr-3 flex-shrink-0" />Manage</NavLink></li>
                </ul>
              </nav>

              {/* Categorized Data Metrics Section */}
              <nav>
                <h3 className="px-2 py-1 text-xs font-semibold text-matrix-green/60 uppercase tracking-wider mb-1">
                  Data Metrics
                </h3>
                {isLoadingMetrics ? (
                  <div className="p-2 flex items-center justify-center">
                    <MatrixLoader />
                  </div>
                ) : errorMetrics ? (
                  <div className="p-2 text-red-400 text-sm">Error loading metrics.</div>
                ) : Object.keys(categorizedMetrics).length > 0 ? (
                  <div className="space-y-1">
                    {Object.entries(categorizedMetrics).map(([category, metrics]) => (
                      <div key={category}>
                        {/* Category Header */}
                        <button
                          onClick={() => toggleCategory(category)}
                          className={getCategoryButtonClass(category)}
                          aria-expanded={expandedCategories.has(category)}
                          aria-controls={`category-${category}`}
                        >
                          <span className="flex items-center">
                            <BarChart4 size={16} className="mr-2 flex-shrink-0" />
                            <span className="font-medium">{category}</span>
                            <span className="ml-1 text-xs text-matrix-green/60">
                              ({metrics.length})
                            </span>
                          </span>
                          {expandedCategories.has(category) ? (
                            <ChevronDown size={16} className="flex-shrink-0" />
                          ) : (
                            <ChevronRight size={16} className="flex-shrink-0" />
                          )}
                        </button>
                        
                        {/* Category Metrics */}
                        {expandedCategories.has(category) && (
                          <div
                            id={`category-${category}`}
                            className="mt-1 space-y-1 animate-in slide-in-from-top-1 duration-200"
                          >
                            {metrics.map((metric: DataMetric) => (
                              <button
                                key={metric.MetricID}
                                onClick={() => handleMetricSelect(metric.MetricID)}
                                className={getMetricButtonClass(metric.MetricID)}
                                title={`${metric.MetricName} - ${metric.Description}`}
                              >
                                <BarChart4 size={16} className="mr-3 flex-shrink-0 text-matrix-green/60" />
                                <span className="truncate text-sm">{metric.MetricName}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-2 text-matrix-green/60 text-sm">No metrics available.</div>
                )}
              </nav>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-black/60 p-0 md:p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AnalyticsLayout;
