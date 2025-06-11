import React, { useState, useEffect, useRef, useCallback } from 'react';
import RGL, { WidthProvider, Layout } from 'react-grid-layout';
import ChartRenderer, { ChartRendererRef } from '@/features/charts/components/chartRenderer';
import { Plus, Settings, BarChart3 } from 'lucide-react';
import DashboardEditorModal from '@/components/analytics/DashboardEditorModal';
// Ensure these CSS files are imported correctly and accessible
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import { debounce } from 'lodash';
import { useResponsive } from '@/hooks/useResponsive';

// WidthProvider wraps RGL to automatically provide width
const ReactGridLayout = WidthProvider(RGL);

interface DashboardLayoutItem extends Layout {
  chartType: 'line' | 'bar' | 'pie' | 'number' | 'table';
  title?: string;
  isLive?: boolean;
  // Ensure 'i' is always present and unique
  i: string;
}

interface Dashboard {
  id?: string;
  name: string;
  description?: string;
  layout: DashboardLayoutItem[];
}

// Track grid item dimensions in pixels
interface GridItemDimensions {
  [key: string]: { width: number; height: number };
}

const AnalyticsDashboard = () => {
  const { isMobile, isTablet } = useResponsive();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  // Layout state stores the grid configuration (x, y, w, h, etc.)
  const [layout, setLayout] = useState<DashboardLayoutItem[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isEmptyState, setIsEmptyState] = useState(true);

  // Store refs to individual chart components for imperative updates (like resize)
  const chartRefs = useRef<Record<string, ChartRendererRef | null>>({});

  // Store calculated pixel dimensions for each grid item
  const [gridItemDimensions, setGridItemDimensions] = useState<GridItemDimensions>({});

  // Ref for the immediate container of ReactGridLayout
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // --- Removed windowWidth state and effect, relying on WidthProvider ---

  // Callback ref function to store chart refs
  const setChartRef = useCallback(
    (itemId: string, el: ChartRendererRef | null) => {
      chartRefs.current[itemId] = el;
      // Immediately attempt size update if dimensions are already known
      if (el && gridItemDimensions[itemId]) {
        const { width, height } = gridItemDimensions[itemId];
        el.updateSize(width, height);
      }
    },
    [gridItemDimensions]
  ); // Dependency ensures this runs if dimensions update

  // Clean up refs when items are removed from the layout
  useEffect(() => {
    const currentKeys = layout.map((item) => item.i);
    Object.keys(chartRefs.current).forEach((key) => {
      if (!currentKeys.includes(key)) {
        delete chartRefs.current[key];
      }
    });
  }, [layout]); // Re-run when layout changes

  // Determine empty state based on dashboard data
  useEffect(() => {
    setIsEmptyState(!dashboard || !dashboard.layout || dashboard.layout.length === 0);
  }, [dashboard]);

  // Function to calculate and update grid item dimensions in pixels
  const updateGridItemDimensions = useCallback(() => {
    if (!gridContainerRef.current) return;

    // Query all rendered grid items within the container
    const gridItems = gridContainerRef.current.querySelectorAll('.react-grid-item');
    const newDimensions: GridItemDimensions = {};

    gridItems.forEach((item) => {
      const element = item as HTMLElement;
      // Retrieve the unique identifier ('i') for the grid item
      // Use data-grid-id attribute added manually for robustness
      const itemId = element.getAttribute('data-grid-id');

      if (itemId) {
        const width = element.clientWidth;
        const height = element.clientHeight;
        newDimensions[itemId] = { width, height };

        // Update the corresponding chart's size via its ref
        const chartRef = chartRefs.current[itemId];
        if (chartRef) {
          chartRef.updateSize(width, height);
          // console.log(`Updated ${itemId} size: ${width}x${height}`); // Optional: for debugging
        }
      }
    });

    // Update the state containing all item dimensions
    setGridItemDimensions(newDimensions);
  }, []); // No dependencies needed as it reads current DOM/refs

  // Run dimension calculation after layout state changes (debounced slightly)
  useEffect(() => {
    if (layout.length > 0) {
      // Use timeouts to wait for DOM updates after layout change
      const timer1 = setTimeout(updateGridItemDimensions, 150);
      const timer2 = setTimeout(updateGridItemDimensions, 500); // A second longer delay as a fallback
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [layout, updateGridItemDimensions]); // Rerun if layout changes

  // Function to initialize layout with potentially missing grid properties (x, y, w, h)
  const createInitialLayout = useCallback((items: DashboardLayoutItem[]): DashboardLayoutItem[] => {
    // Responsive grid configuration
    const cols = isMobile ? 1 : isTablet ? 2 : 12; // 1 column on mobile, 2 on tablet, 12 on desktop
    const defaultWidth = isMobile ? 1 : isTablet ? 1 : 4; // Full width on mobile/tablet
    const defaultHeight = isMobile ? 6 : isTablet ? 5 : 4; // Taller on mobile for better visibility
    const itemsPerRow = Math.floor(cols / defaultWidth);

    return items.map((item, index) => {
      // Ensure every item has a unique 'i'
      const uniqueId = item.i || `chart-${Date.now()}-${index}`;
      return {
        ...item,
        i: uniqueId,
        // Assign position/size only if not already defined in the input item
        x: item.x ?? (index % itemsPerRow) * defaultWidth,
        y: item.y ?? Math.floor(index / itemsPerRow) * defaultHeight,
        w: item.w || defaultWidth,
        h: item.h || defaultHeight,
        isDraggable: item.isDraggable !== undefined ? item.isDraggable : true,
        isResizable: item.isResizable !== undefined ? item.isResizable : true,
        // Reset static property if undefined
        static: item.static === true ? true : false,
      };
    });
  }, [isMobile, isTablet]); // Re-run when screen size changes

  // Handler for when RGL reports a layout change (drag, resize)
  const onLayoutChange = (newRglLayout: Layout[]) => {
    // Update our layout state, preserving chartType etc.
    setLayout((currentInternalLayout) =>
      currentInternalLayout.map((internalItem) => {
        const rglUpdate = newRglLayout.find((rglItem) => rglItem.i === internalItem.i);
        return rglUpdate
          ? {
              ...internalItem, // Keep chartType, title, etc.
              x: rglUpdate.x,
              y: rglUpdate.y,
              w: rglUpdate.w,
              h: rglUpdate.h,
              isDraggable: rglUpdate.isDraggable,
              isResizable: rglUpdate.isResizable,
              static: rglUpdate.static,
            }
          : internalItem; // Should not happen if IDs match
      })
    );

    // It's often better to trigger dimension updates *after* drag/resize stops
    // but a quick update here can sometimes help intermediate states.
    setTimeout(updateGridItemDimensions, 50); // Quick update
  };

  // Debounced function to save the layout (e.g., to backend)
  const debouncedSaveLayout = useCallback(
    debounce((layoutToSave: DashboardLayoutItem[]) => {
      if (!dashboard?.id) {
        console.warn('Cannot save layout changes - no active dashboard ID.');
        return;
      }
      const updatedDashboardForSave: Dashboard = {
        ...dashboard,
        // Corrected line: Assign the layout directly as it already has the correct type
        layout: layoutToSave,
      };
      console.log('Debounced Save - Saving dashboard layout:', updatedDashboardForSave);
      // TODO: Replace with actual API call: saveDashboardLayout(dashboard.id, updatedDashboardForSave.layout);
    }, 1000),
    [dashboard]
  ); // Recreate debounce function if dashboard context changes

  // Handler when resizing stops
  const handleResizeStop = useCallback(
    (
      _currentRglLayout: Layout[], // The layout array *after* resize
      _oldItem: Layout, // Item layout *before* resize
      resizedItem: Layout // Item layout *after* resize
    ) => {
      // Update dimensions accurately after resize operation completes
      updateGridItemDimensions();

      // Optional: Force one more update slightly later for safety
      setTimeout(updateGridItemDimensions, 100);

      // Trigger the debounced save with the latest layout state
      // Note: layout state is updated via onLayoutChange
      // We access the *current* layout state here.
      setLayout((currentLayout) => {
        debouncedSaveLayout(currentLayout);
        return currentLayout; // No state change here, just accessing for save
      });
    },
    [debouncedSaveLayout, updateGridItemDimensions]
  ); // Dependencies for the handler

  // Handler when dragging stops
  const handleDragStop = useCallback(
    (
      _currentRglLayout: Layout[] // Layout after drag
      // _oldItem: Layout,        // Item before drag
      // draggedItem: Layout      // Item after drag
    ) => {
      // Update dimensions for potential position changes affecting DOM layout
      updateGridItemDimensions();

      // Trigger the debounced save with the latest layout state
      setLayout((currentLayout) => {
        debouncedSaveLayout(currentLayout);
        return currentLayout; // No state change here, just accessing for save
      });
    },
    [debouncedSaveLayout, updateGridItemDimensions]
  ); // Dependencies for the handler

  // Use ResizeObserver to recalculate dimensions if the main grid container resizes
  useEffect(() => {
    let observer: ResizeObserver | null = null;
    const elem = gridContainerRef.current; // Capture ref value

    if (elem) {
      // Debounce the observer callback to avoid excessive updates
      const debouncedCallback = debounce(() => {
        // console.log("Grid container resize detected, updating dimensions."); // Optional: debug logging
        updateGridItemDimensions();
      }, 200);

      observer = new ResizeObserver(debouncedCallback);
      observer.observe(elem);

      // Initial calculation on mount after observer setup
      updateGridItemDimensions();

      return () => {
        if (observer) {
          observer.unobserve(elem); // Clean up observer
          observer.disconnect();
        }
        debouncedCallback.cancel(); // Clean up debounce timer
      };
    }
    return () => {}; // Return empty cleanup if elem is null initially
  }, [updateGridItemDimensions]); // Re-run if the update function identity changes

  // Handler for saving dashboard from modal (create or update)
  const handleSaveDashboard = (dashboardDataFromModal: any) => {
    const newRawLayout = (dashboardDataFromModal.layout || []) as Omit<DashboardLayoutItem, 'i'>[]; // Assume modal provides basic items
    const newDashboardId = dashboard?.id || `dashboard-${Date.now()}`;

    // Ensure layout items have unique IDs and basic grid props
    const initializedLayout = createInitialLayout(
      newRawLayout.map((item, index) => ({
        ...item,
        // Ensure 'i' is present before passing to createInitialLayout
        i: item.i || `new-${Date.now()}-${index}`,
      }))
    );

    const updatedDashboard: Dashboard = {
      id: newDashboardId,
      name: dashboardDataFromModal.name,
      description: dashboardDataFromModal.description,
      layout: initializedLayout, // Store the fully initialized layout
    };

    console.log('Saving/Updating dashboard:', updatedDashboard);

    setDashboard(updatedDashboard);
    setLayout(initializedLayout); // Set the grid layout state
    setIsEmptyState(false);
    setIsEditorOpen(false);

    // Clear old dimensions and trigger recalculation for the new layout
    setGridItemDimensions({});
    // Delay update slightly to allow grid rendering
    setTimeout(updateGridItemDimensions, 300);
  };

  const handleCreateNewDashboard = () => {
    setDashboard(null); // Clear current dashboard data
    setLayout([]); // Clear layout
    setGridItemDimensions({}); // Clear dimensions
    setIsEditorOpen(true); // Open modal for creation
  };

  const handleEditCurrentDashboard = () => {
    if (dashboard) {
      setIsEditorOpen(true); // Open modal with current dashboard data
    } else {
      console.warn('Attempted to edit, but no dashboard is loaded.');
    }
  };

  return (
    <div className="h-full flex flex-col text-text relative" style={{backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
      {/* Black Background matching chart opacity */}
      <div className="absolute inset-0 bg-black/70"></div>
      
      {/* Modern Header - Mobile Responsive */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 md:p-6 border-b border-border/30 flex-shrink-0 glass-morphism gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent truncate pr-2" title={dashboard?.name}>
            {dashboard?.name || 'Analytics Dashboard'}
          </h2>
          <p className="text-xs md:text-sm text-text-secondary line-clamp-1">
            {dashboard?.description || 'Create and customize your analytics dashboard'}
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 w-full sm:w-auto">
          {!isEmptyState && dashboard && (
            <button
              onClick={handleEditCurrentDashboard}
              className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium glass-morphism border border-border/30 rounded-xl hover:border-primary/50 text-text-secondary hover:text-primary transition-all duration-300 hover:shadow-modern flex-1 sm:flex-none justify-center"
            >
              <Settings size={isMobile ? 14 : 16} />
              <span className={isMobile ? 'hidden' : 'block'}>Edit Dashboard</span>
              {isMobile && <span>Edit</span>}
            </button>
          )}
          <button
            onClick={handleCreateNewDashboard}
            className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium bg-primary/10 border border-primary/20 rounded-xl hover:bg-primary/15 text-primary transition-all duration-300 shadow-modern flex-1 sm:flex-none justify-center"
          >
            <Plus size={isMobile ? 14 : 16} />
            <span className={isMobile ? 'hidden' : 'block'}>New Dashboard</span>
            {isMobile && <span>New</span>}
          </button>
        </div>
      </div>

      {/* Modern Grid Container */}
      <div className="relative z-10 flex-1 overflow-hidden">
        {isEmptyState ? (
          <div className="h-full flex flex-col items-center justify-center p-4 md:p-8">
            {/* Modern Empty State - Mobile Optimized */}
            <div className="text-center max-w-md w-full space-y-4 md:space-y-6">
              <div className={`${isMobile ? 'w-16 h-16' : 'w-24 h-24'} glass-morphism rounded-3xl flex items-center justify-center mx-auto border border-primary/20 shadow-modern`}>
                <BarChart3 className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} text-primary`} />
              </div>
              
              <div className="space-y-2 md:space-y-3">
                <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-text`}>Create Your First Dashboard</h3>
                <p className={`text-text-secondary leading-relaxed ${isMobile ? 'text-sm' : 'text-base'}`}>
                  Build powerful analytics dashboards with customizable widgets and real-time data visualization.
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleCreateNewDashboard}
                  className={`flex items-center gap-2 md:gap-3 ${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3'} bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 mx-auto w-full sm:w-auto justify-center`}
                >
                  <Plus size={isMobile ? 18 : 20} />
                  <span>Create New Dashboard</span>
                </button>
                
                <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-text-secondary`}>
                  Start with pre-built templates or create from scratch
                </p>
              </div>
            </div>
          </div>
        ) : (
          // This container's size determines the width RGL receives via WidthProvider
          <div ref={gridContainerRef} className={`h-full w-full ${isMobile ? 'p-2' : 'p-4'} overflow-auto`}>
            <style>{`
                            /* Ensure RGL styles are loaded. These are additions/overrides */
                            .react-grid-layout {
                                position: relative; /* Needed for item positioning */
                                transition: height 200ms ease;
                                /* width: 100%; /* WidthProvider handles this */
                            }
                            .react-grid-item {
                                transition: all 200ms ease;
                                transition-property: left, top, width, height;
                                background: rgba(255, 255, 255, 0.05);
                                backdrop-filter: blur(16px) saturate(180%);
                                border: 1px solid rgba(255, 255, 255, 0.1);
                                border-radius: 16px;
                                overflow: hidden;
                                box-sizing: border-box;
                                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 15px rgba(0, 0, 0, 0.10);
                            }
                            
                            .theme-light .react-grid-item {
                                background: rgba(255, 255, 255, 0.7);
                                backdrop-filter: blur(16px) saturate(180%);
                                border: 1px solid rgba(255, 255, 255, 0.2);
                            }
                            .react-grid-item.cssTransforms {
                                transition-property: transform, width, height; /* Use transforms if enabled */
                            }
                            .react-grid-item.resizing {
                                z-index: 3; /* Bring to front while resizing */
                                opacity: 0.7;
                            }
                            .react-grid-item.react-draggable-dragging {
                                transition: none; /* Disable transition while dragging actively */
                                z-index: 3; /* Bring to front */
                                opacity: 0.8;
                                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* Modern shadow while dragging */
                                transform: rotate(2deg); /* Slight rotation while dragging */
                            }

                            /* --- CRUCIAL FOR RESIZING --- */
                            /* This targets the handle created by react-resizable */
                            .react-grid-item > .react-resizable-handle {
                                position: absolute;
                                width: 20px; /* Size of the clickable area */
                                height: 20px;
                                bottom: 0;
                                right: 0;
                                cursor: se-resize; /* Diagonal resize cursor */
                                padding: 0 4px 4px 0; /* Padding affects background position */
                                /* Visual indicator using SVG */
                                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 6" style="background-color:%2300000000" fill="none" stroke="%23888" stroke-width="1"><path d="M 6 0 L 0 6 M 4 0 L 0 4 M 6 2 L 2 6 M 6 4 L 4 6"/></svg>');
                                background-position: bottom right;
                                background-repeat: no-repeat;
                                background-origin: content-box; /* Position relative to content area */
                                box-sizing: border-box;
                                z-index: 10; /* Ensure handle is clickable above item content */
                                opacity: 0.7; /* Make it slightly transparent */
                                transition: opacity 0.2s ease;
                            }
                            .react-grid-item:hover > .react-resizable-handle {
                                opacity: 1; /* Fully visible on hover */
                            }
                            /* --- End Resizing CSS --- */

                            /* Ensure the direct child fills the grid item for ChartRenderer */
                             .chart-grid-item > div { /* Targetting the container of ChartRenderer */
                                height: 100%;
                                width: 100%;
                                overflow: hidden; /* Prevent chart overflow issues */
                                display: flex; /* Optional: if ChartRenderer needs flex */
                                flex-direction: column; /* Optional: if ChartRenderer needs flex */
                             }
                        `}</style>
            <ReactGridLayout
              // Let WidthProvider manage width. Ensure gridContainerRef has w-full.
              className="layout"
              layout={layout} // Current layout state
              cols={isMobile ? 1 : isTablet ? 2 : 12} // Responsive grid columns
              rowHeight={isMobile ? 40 : 50} // Smaller row height on mobile
              isDraggable={!isMobile} // Disable dragging on mobile for better UX
              isResizable={!isMobile} // Disable resizing on mobile for better UX
              onLayoutChange={onLayoutChange} // Callback when layout changes
              onResizeStop={handleResizeStop} // Callback when resize finishes
              onDragStop={handleDragStop} // Callback when drag finishes
              useCSSTransforms={true} // Better performance generally
              compactType={isMobile ? 'vertical' : null} // Compact vertically on mobile
              preventCollision={isMobile} // Prevent collisions on mobile
              // **IMPORTANT**: Defines the available resize handles. 'se' = bottom-right corner (diagonal resize)
              resizeHandles={isMobile ? [] : ['se']} // No resize handles on mobile
              margin={isMobile ? [8, 8] : [15, 15]} // Smaller margins on mobile
              containerPadding={isMobile ? [4, 4] : [5, 5]} // Smaller padding on mobile
              measureBeforeMount={false} // Usually false is fine
              // Key forces remount if dashboard ID changes or responsive state changes
              key={`${dashboard?.id || 'empty-dashboard-layout'}-${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`}
            >
              {layout.map((item) => {
                // Get the latest calculated dimensions for this item
                const dimensions = gridItemDimensions[item.i];
                return (
                  // This div gets styled by RGL (position, size)
                  <div
                    key={item.i}
                    className="chart-grid-item" // Use this class for potential inner styling
                    data-grid-id={item.i} // Add attribute for easier querying in updateGridItemDimensions
                  >
                    {/* Render the actual content (chart) inside */}
                    {/* Pass calculated dimensions down to the chart */}
                    <ChartRenderer
                      ref={(el) => setChartRef(item.i, el)} // Assign ref
                      chartId={item.i}
                      chartType={item.chartType}
                      title={item.title}
                      isLive={item.isLive}
                      // Pass pixel dimensions if available, otherwise undefined
                      gridWidth={dimensions?.width}
                      gridHeight={dimensions?.height}
                    />
                  </div>
                );
              })}
            </ReactGridLayout>
          </div>
        )}
      </div>

      {/* Dashboard Editor Modal */}
      <DashboardEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveDashboard}
        initialDashboard={dashboard} // Pass current dashboard data for editing
        isEditing={!isEmptyState && !!dashboard} // Determine if modal is in "edit" mode
      />
    </div>
  );
};

export default AnalyticsDashboard;
