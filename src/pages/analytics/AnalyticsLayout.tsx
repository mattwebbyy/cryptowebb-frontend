import React, { useState } from 'react';
import { Outlet, NavLink, useParams } from 'react-router-dom';
import {
  Home,
  ChevronLeft,
  Menu,
  Command,
} from 'lucide-react';
import AnalyticsSidebar from '@/components/layout/AnalyticsSidebar';
import { AnalyticsBreadcrumb } from '@/components/ui/Breadcrumb';
import { useDataMetricInfo } from '@/features/dataMetrics/api/useDataMetrics';
import { AnalyticsErrorBoundary } from '@/components/ErrorBoundary';
import { useResponsive } from '@/hooks/useResponsive';
import { useKeyboardShortcuts, getModifierKey } from '@/hooks/useKeyboardShortcuts';
import { CommandPalette } from '@/components/ui/CommandPalette';

/**
 * Layout component for the analytics section.
 * Includes an animated sidebar for navigation and a main content area rendered via Outlet.
 */
const AnalyticsLayout: React.FC = () => {
  const { isMobile, isTablet, isTouchDevice } = useResponsive();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile); // Start closed on mobile
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const { metricId } = useParams<{ metricId: string }>();
  
  // Fetch metric info for breadcrumb display
  const { data: metricInfo } = useDataMetricInfo(metricId || null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      [getModifierKey()]: true,
      action: () => setCommandPaletteOpen(true),
      description: 'Open command palette',
      category: 'General',
    },
    {
      key: 'b',
      [getModifierKey()]: true,
      action: toggleSidebar,
      description: 'Toggle sidebar',
      category: 'Navigation',
    },
    {
      key: 'h',
      [getModifierKey()]: true,
      action: () => window.location.href = '/',
      description: 'Go to home',
      category: 'Navigation',
    },
  ]);

  // Auto-close sidebar on mobile when navigating
  React.useEffect(() => {
    if (isMobile && sidebarOpen) {
      // Close sidebar when route changes on mobile
      const handleRouteChange = () => setSidebarOpen(false);
      window.addEventListener('popstate', handleRouteChange);
      return () => window.removeEventListener('popstate', handleRouteChange);
    }
  }, [isMobile, sidebarOpen]);

  // Common NavLink class generation for header
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-2 rounded-md whitespace-nowrap transition-all duration-200 ease-in-out transform hover:scale-105
     ${isActive
      ? 'bg-primary/20 text-primary font-semibold shadow-sm shadow-primary/50'
      : 'text-text-secondary hover:bg-primary/10 hover:text-primary'
    }`;

  const handleMetricSelect = (metricId: number) => {
    // Optional: Add any additional logic when a metric is selected
    console.log(`Selected metric: ${metricId}`);
  };

  return (
    <AnalyticsErrorBoundary>
      <div className="h-screen w-full flex flex-col overflow-hidden text-text font-mono relative" style={{backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
        {/* Black Background with same opacity as charts */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        
        {/* Header Bar */}
      <header className="relative z-10 glass-morphism border-b border-border/30 p-3 flex items-center justify-between flex-shrink-0 shadow-modern">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className={`
              p-2 rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out transform hover:scale-110
              ${sidebarOpen ? 'hover:bg-primary/20' : 'hover:bg-primary/15'}
            `}
            aria-label="Toggle sidebar"
          >
            <div className={`transition-transform duration-300 ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`}>
              {sidebarOpen ? <ChevronLeft size={22} /> : <Menu size={22} />}
            </div>
          </button>
          <h1 className="ml-3 text-xl font-bold tracking-wider transition-all duration-300 hover:text-primary">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ANALYTICS PLATFORM
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <NavLink to="/" className={getNavLinkClass({isActive: false})}>
            <Home size={18} className="mr-2 transition-transform duration-200" /> 
            <span className="transition-all duration-200">Home</span>
          </NavLink>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile backdrop overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-[50] backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          />
        )}

        {/* Animated Sidebar with slide-out panels */}
        <AnalyticsSidebar 
          isOpen={sidebarOpen} 
          onMetricSelect={(metricId) => {
            handleMetricSelect(metricId);
            // Auto-close sidebar on mobile after selection
            if (isMobile) setSidebarOpen(false);
          }}
          isMobile={isMobile}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />

        {/* Main Content Area */}
        <main 
          className={`
            relative z-10 flex-1 flex flex-col overflow-hidden
            transition-all duration-300 ease-in-out
          `}
        >
          {/* Breadcrumb Navigation */}
          <div className="glass-morphism border-b border-border/30 flex-shrink-0">
            <div className="px-4 py-3">
              <AnalyticsBreadcrumb 
                metricName={metricInfo?.MetricName}
                metricId={metricId}
              />
            </div>
          </div>
          
          {/* Content Area - Let individual pages handle their own scrolling */}
          <div className="flex-1 overflow-hidden">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
    </AnalyticsErrorBoundary>
  );
};

export default AnalyticsLayout;