import React, { useState, useEffect, useRef, useCallback } from 'react';
import RGL, { WidthProvider, Layout } from 'react-grid-layout';
import ChartRenderer, { ChartRendererRef } from '@/features/charts/components/chartRenderer';
import { Plus, Settings } from 'lucide-react';
import DashboardEditorModal from '@/components/analytics/DashboardEditorModal';
// Ensure these CSS files are imported correctly and accessible
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import { debounce } from 'lodash';

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
    const cols = 12; // Match the `cols` prop of ReactGridLayout
    const defaultWidth = 4; // Default width in grid units
    const defaultHeight = 4; // Default height in grid units (adjust based on rowHeight)
    const itemsPerRow = Math.floor(cols / defaultWidth); // e.g., 12 / 4 = 3

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
  }, []); // No dependencies needed for this pure function

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
    <div className="h-full flex flex-col bg-black/50 text-matrix-green">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b border-matrix-green/30 flex-shrink-0">
        <h2 className="text-lg font-mono text-matrix-green truncate pr-4" title={dashboard?.name}>
          {dashboard?.name || 'No Dashboard Loaded'}
        </h2>
        <div className="flex space-x-2 flex-shrink-0">
          {!isEmptyState && dashboard && (
            <button
              onClick={handleEditCurrentDashboard}
              className="px-3 py-1.5 text-sm flex items-center gap-1 bg-matrix-green/10 border border-matrix-green/30 rounded hover:bg-matrix-green/20"
            >
              <Settings size={14} />
              <span>Edit</span>
            </button>
          )}
          <button
            onClick={handleCreateNewDashboard}
            className="px-3 py-1.5 text-sm flex items-center gap-1 bg-matrix-green/10 border border-matrix-green/30 rounded hover:bg-matrix-green/20"
          >
            <Plus size={14} />
            <span>New Dashboard</span>
          </button>
        </div>
      </div>

      {/* Grid container */}
      <div className="flex-1 overflow-auto relative">
        {isEmptyState ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            {/* Empty State Content... */}
            <div className="text-center p-6 max-w-lg">
              <h3 className="text-xl font-mono text-matrix-green mb-4">No Dashboard Loaded</h3>
              <p className="text-matrix-green/70 mb-8">
                Create a new dashboard to start visualizing your data.
              </p>
              <button
                onClick={handleCreateNewDashboard}
                className="px-4 py-2 bg-matrix-green text-black font-mono rounded hover:bg-matrix-green/80 flex items-center gap-2 mx-auto"
              >
                <Plus size={18} />
                <span>Create New Dashboard</span>
              </button>
            </div>
          </div>
        ) : (
          // This container's size determines the width RGL receives via WidthProvider
          <div ref={gridContainerRef} className="h-full w-full p-2.5">
            {' '}
            {/* Added padding for visual spacing from edge */}
            <style>{`
                            /* Ensure RGL styles are loaded. These are additions/overrides */
                            .react-grid-layout {
                                position: relative; /* Needed for item positioning */
                                transition: height 200ms ease;
                                /* width: 100%; /* WidthProvider handles this */
                            }
                            .react-grid-item {
                                transition: all 200ms ease;
                                transition-property: left, top, width, height; /* Animate position and size */
                                background: rgba(0, 25, 0, 0.3); /* Dark green background */
                                border: 1px dashed rgba(51, 255, 51, 0.2); /* Dashed green border */
                                overflow: hidden; /* Clip content within the grid item div */
                                box-sizing: border-box;
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
                                opacity: 0.6;
                                box-shadow: 0 5px 15px rgba(51, 255, 51, 0.3); /* Add shadow while dragging */
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
                                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 6" style="background-color:%2300000000" fill="none" stroke="%2333ff33" stroke-width=".5"><path d="M 6 0 L 0 6 M 4 0 L 0 4 M 6 2 L 2 6 M 6 4 L 4 6"/></svg>');
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
              cols={12} // Grid columns
              rowHeight={50} // Height of one 'h' unit in pixels
              isDraggable={true} // Allow dragging globally
              isResizable={true} // Allow resizing globally
              onLayoutChange={onLayoutChange} // Callback when layout changes
              onResizeStop={handleResizeStop} // Callback when resize finishes
              onDragStop={handleDragStop} // Callback when drag finishes
              useCSSTransforms={true} // Better performance generally
              compactType={null} // **IMPORTANT**: Allows free horizontal placement
              preventCollision={false} // Allow items to overlap if dragged/resized over each other
              // **IMPORTANT**: Defines the available resize handles. 'se' = bottom-right corner (diagonal resize)
              resizeHandles={['se']}
              margin={[15, 15]} // Margin between grid items [horizontal, vertical]
              containerPadding={[5, 5]} // Padding inside the grid container [horizontal, vertical]
              measureBeforeMount={false} // Usually false is fine
              // Key forces remount if dashboard ID changes, useful for full reset
              key={dashboard?.id || 'empty-dashboard-layout'}
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
