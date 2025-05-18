import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useParams } from 'react-router-dom';
import {
  Home,
  Database,
  LayoutDashboard,
  ChevronLeft,
  Menu,
  BarChart4, // Icon for Data Metrics
  Eye,
  Settings,
  BarChart, // Alternative icon
  Activity, // Another alternative icon
} from 'lucide-react';
import { useDataMetricsList } from '@/features/dataMetrics/api/useDataMetrics';
import type { DataMetric } from '@/types/metricsData';
import { MatrixLoader } from '@/components/ui/MatrixLoader'; // Assuming this component exists

/**
 * Layout component for the analytics section.
 * Includes a sidebar for navigation and a main content area rendered via Outlet.
 */
const AnalyticsLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  // Get metricId from URL to highlight the active metric in the sidebar
  const { metricId: activeMetricIdFromParams } = useParams<{ metricId: string }>();

  // Fetch the list of all available data metrics
  const { data: metricsList, isLoading: isLoadingMetrics, error: errorMetrics } = useDataMetricsList();

  /**
   * Handles selection of a metric from the sidebar.
   * Navigates to the specific metric's chart page.
   * @param metricId - The ID of the selected metric.
   */
  const handleMetricSelect = (metricId: number) => {
    navigate(`/analytics/metrics/${metricId}`);
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
    `w-full flex items-center p-2 rounded-md whitespace-nowrap text-left transition-colors duration-150 ease-in-out
     ${activeMetricIdFromParams === String(metricId)
      ? 'bg-matrix-green/25 text-matrix-green font-semibold shadow-sm shadow-matrix-green/50'
      : 'text-matrix-green/70 hover:bg-matrix-green/15 hover:text-matrix-green'
    }`;


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

              {/* Data Metrics Section */}
              <nav>
                <h3 className="px-2 py-1 text-xs font-semibold text-matrix-green/60 uppercase tracking-wider mb-1">
                  Data Metrics
                </h3>
                {isLoadingMetrics ? (
                  <div className="p-2 flex items-center justify-center"> <MatrixLoader /> </div>
                ) : errorMetrics ? (
                  <div className="p-2 text-red-400 text-sm">Error loading metrics.</div>
                ) : (
                  <ul className="space-y-1">
                    {metricsList && metricsList.length > 0 ? (
                      metricsList.map((metric: DataMetric) => (
                        <li key={metric.MetricID}>
                          <button
                            onClick={() => handleMetricSelect(metric.MetricID)}
                            className={getMetricButtonClass(metric.MetricID)}
                            title={metric.MetricName}
                          >
                            <BarChart4 size={18} className="mr-3 flex-shrink-0" />
                            <span className="truncate">{metric.MetricName}</span>
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-matrix-green/60 text-sm">No metrics available.</li>
                    )}
                  </ul>
                )}
              </nav>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-black/60 p-0 md:p-0"> {/* Removed padding for full-width chart page */}
          <Outlet /> {/* Renders the child route's component, e.g., DataMetricChartPage */}
        </main>
      </div>
    </div>
  );
};

export default AnalyticsLayout;
