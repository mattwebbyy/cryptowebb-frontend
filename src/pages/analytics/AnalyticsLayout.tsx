import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  Home,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import AnalyticsSidebar from '@/components/layout/AnalyticsSidebar';

/**
 * Layout component for the analytics section.
 * Includes an animated sidebar for navigation and a main content area rendered via Outlet.
 */
const AnalyticsLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Common NavLink class generation for header
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-2 rounded-md whitespace-nowrap transition-all duration-200 ease-in-out transform hover:scale-105
     ${isActive
      ? 'bg-matrix-green/20 text-matrix-green font-semibold shadow-sm shadow-matrix-green/50'
      : 'text-matrix-green/70 hover:bg-matrix-green/10 hover:text-matrix-green'
    }`;

  const handleMetricSelect = (metricId: number) => {
    // Optional: Add any additional logic when a metric is selected
    console.log(`Selected metric: ${metricId}`);
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-black text-matrix-green font-mono">
      {/* Header Bar */}
      <header className="bg-black/80 border-b border-matrix-green/50 p-3 flex items-center justify-between flex-shrink-0 backdrop-blur-sm shadow-lg shadow-matrix-green/10">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className={`
              p-2 rounded-md text-matrix-green focus:outline-none focus:ring-2 focus:ring-matrix-green transition-all duration-200 ease-in-out transform hover:scale-110
              ${sidebarOpen ? 'hover:bg-matrix-green/20' : 'hover:bg-matrix-green/15'}
            `}
            aria-label="Toggle sidebar"
          >
            <div className={`transition-transform duration-300 ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`}>
              {sidebarOpen ? <ChevronLeft size={22} /> : <Menu size={22} />}
            </div>
          </button>
          <h1 className="ml-3 text-xl font-bold tracking-wider transition-all duration-300 hover:text-matrix-green">
            <span className="bg-gradient-to-r from-matrix-green to-green-400 bg-clip-text text-transparent">
              ANALYTICS PLATFORM
            </span>
          </h1>
        </div>
        <NavLink to="/" className={getNavLinkClass({isActive: false}) + " mr-2"}>
          <Home size={18} className="mr-2 transition-transform duration-200" /> 
          <span className="transition-all duration-200">Home</span>
        </NavLink>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Animated Sidebar with slide-out panels */}
        <AnalyticsSidebar 
          isOpen={sidebarOpen} 
          onMetricSelect={handleMetricSelect}
        />

        {/* Main Content Area */}
        <main 
          className={`
            flex-1 overflow-x-hidden overflow-y-auto bg-black/60 backdrop-blur-sm
            transition-all duration-300 ease-in-out relative z-0
          `}
        >
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsLayout;