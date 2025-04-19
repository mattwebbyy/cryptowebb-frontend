// AnalyticsDashboard.tsx - Complete file

import React, { useState, useEffect, useRef, useCallback } from 'react';
import RGL, { WidthProvider, Layout } from 'react-grid-layout';
import ChartRenderer, { ChartRendererRef } from '@/features/charts/components/chartRenderer';
import { Plus, Settings } from 'lucide-react';
import DashboardEditorModal from '@/components/analytics/DashboardEditorModal';
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import { debounce } from 'lodash';

const ReactGridLayout = WidthProvider(RGL);

interface DashboardLayoutItem extends Layout {
    chartType: 'line' | 'bar' | 'pie' | 'number' | 'table';
    title?: string;
    isLive?: boolean;
}

interface Dashboard {
    id?: string;
    name: string;
    description?: string;
    layout: DashboardLayoutItem[];
}

// Track grid item dimensions
interface GridItemDimensions {
    [key: string]: { width: number; height: number };
}

const AnalyticsDashboard = () => {
    const [dashboard, setDashboard] = useState<Dashboard | null>(null);
    const [layout, setLayout] = useState<DashboardLayoutItem[]>([]);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [isEmptyState, setIsEmptyState] = useState(true);
    
    // Store refs to chart components
    const chartRefs = useRef<Record<string, ChartRendererRef | null>>({});
    
    // Track grid item dimensions
    const [gridItemDimensions, setGridItemDimensions] = useState<GridItemDimensions>({});
    
    // Track the grid container element
    const gridContainerRef = useRef<HTMLDivElement>(null);
    
    // Callback ref function
    const setChartRef = useCallback((itemId: string, el: ChartRendererRef | null) => {
        chartRefs.current[itemId] = el;
        
        // If we have dimensions for this item and the ref exists, update its size
        if (el && gridItemDimensions[itemId]) {
            const { width, height } = gridItemDimensions[itemId];
            el.updateSize(width, height);
        }
    }, [gridItemDimensions]);
    
    // Clean up refs when items are removed
    useEffect(() => {
        const currentKeys = layout.map(item => item.i);
        Object.keys(chartRefs.current).forEach(key => {
            if (!currentKeys.includes(key)) {
                delete chartRefs.current[key];
            }
        });
    }, [layout]);
    
    // Determine empty state
    useEffect(() => {
        setIsEmptyState(!dashboard || !dashboard.layout || dashboard.layout.length === 0);
    }, [dashboard]);
    
    // Function to calculate and update grid item dimensions
    const updateGridItemDimensions = useCallback(() => {
        if (!gridContainerRef.current) return;
        
        // Get all grid items by class
        const gridItems = gridContainerRef.current.querySelectorAll('.react-grid-item');
        const newDimensions: GridItemDimensions = {};
        
        gridItems.forEach((item) => {
            const element = item as HTMLElement;
            const itemId = element.getAttribute('data-grid-id') || element.getAttribute('data-i');
            
            if (itemId) {
                newDimensions[itemId] = {
                    width: element.clientWidth,
                    height: element.clientHeight
                };
                
                // If we have a chart ref for this item, update its size immediately
                const chartRef = chartRefs.current[itemId];
                if (chartRef) {
                    chartRef.updateSize(element.clientWidth, element.clientHeight);
                }
            }
        });
        
        setGridItemDimensions(newDimensions);
    }, []);
    
    // Run dimension calculation after layout changes
    useEffect(() => {
        if (layout.length > 0) {
            // Small delay to ensure grid has rendered
            setTimeout(updateGridItemDimensions, 100);
            
            // Second update for delayed renders
            setTimeout(updateGridItemDimensions, 500);
        }
    }, [layout, updateGridItemDimensions]);
    
    // Layout change handler
    const onLayoutChange = (newRglLayout: Layout[]) => {
        setLayout(currentLayout => 
            currentLayout.map(item => {
                const rglUpdate = newRglLayout.find(rglItem => rglItem.i === item.i);
                return rglUpdate ? {
                    ...item,
                    x: rglUpdate.x,
                    y: rglUpdate.y,
                    w: rglUpdate.w,
                    h: rglUpdate.h,
                    isDraggable: rglUpdate.isDraggable,
                    isResizable: rglUpdate.isResizable,
                    static: rglUpdate.static,
                } : item;
            })
        );
        
        // Update dimensions after layout changes
        setTimeout(updateGridItemDimensions, 100);
    };
    
    // Debounced save function
    const debouncedSaveLayout = useCallback(debounce((layoutToSave: DashboardLayoutItem[]) => {
        if (!dashboard?.id) {
            console.warn("Cannot save layout changes - no active dashboard ID.");
            return;
        }
        
        const updatedDashboardForSave: Dashboard = {
            ...dashboard,
            layout: layoutToSave
        };
        
        console.log('Saving dashboard layout:', updatedDashboardForSave);
        // TODO: Replace with actual save API call
    }, 1000), [dashboard]);
    
    // Resize handler
    const handleResizeStop = useCallback((
        _currentRglLayout: Layout[],
        _oldItem: Layout,
        resizedItem: Layout
    ) => {
        // Update dimensions directly after resize
        updateGridItemDimensions();
        
        // Additional targeted update for the specific resized item
        setTimeout(() => {
            if (!gridContainerRef.current) return;
            
            const gridItem = gridContainerRef.current.querySelector(
                `.react-grid-item[data-grid-id="${resizedItem.i}"], .react-grid-item[data-i="${resizedItem.i}"]`
            ) as HTMLElement;
            
            if (gridItem) {
                const width = gridItem.clientWidth;
                const height = gridItem.clientHeight;
                
                // Update the chart directly
                const chartRef = chartRefs.current[resizedItem.i];
                if (chartRef) {
                    chartRef.updateSize(width, height);
                    console.log(`Direct size update for ${resizedItem.i}: ${width}x${height}`);
                }
                
                // Update dimensions state
                setGridItemDimensions(prev => ({
                    ...prev,
                    [resizedItem.i]: { width, height }
                }));
            }
        }, 50);
        
        // Trigger save
        debouncedSaveLayout(layout);
    }, [debouncedSaveLayout, layout, updateGridItemDimensions]);
    
    // Drag handler
    const handleDragStop = useCallback(() => {
        // Update dimensions after drag
        updateGridItemDimensions();
        
        // Trigger save
        debouncedSaveLayout(layout);
    }, [debouncedSaveLayout, layout, updateGridItemDimensions]);
    
    // Resize observer for grid container
    useEffect(() => {
        if (!gridContainerRef.current) return;
        
        const resizeObserver = new ResizeObserver(debounce(() => {
            updateGridItemDimensions();
        }, 100));
        
        resizeObserver.observe(gridContainerRef.current);
        
        return () => {
            resizeObserver.disconnect();
        };
    }, [updateGridItemDimensions]);
    
    // Dashboard save handler
    const handleSaveDashboard = (dashboardDataFromModal: any) => {
        const newLayout = (dashboardDataFromModal.layout || []) as DashboardLayoutItem[];
        const newDashboardId = dashboard?.id || `dashboard-${Date.now()}`;
        
        const updatedDashboard: Dashboard = {
            id: newDashboardId,
            name: dashboardDataFromModal.name,
            description: dashboardDataFromModal.description,
            layout: newLayout.map(item => ({
                ...item,
                i: item.i || `chart-${Math.random().toString(36).substring(7)}`,
                x: item.x ?? 0,
                y: item.y ?? Infinity,
                w: item.w ?? 4,
                h: item.h ?? 3,
            }))
        };
        
        console.log('Saving/Updating dashboard:', updatedDashboard);
        
        setDashboard(updatedDashboard);
        setLayout(updatedDashboard.layout);
        setIsEmptyState(false);
        
        // Clear dimensions when loading a new dashboard
        setGridItemDimensions({});
        
        // Calculate dimensions once grid is rendered
        setTimeout(updateGridItemDimensions, 300);
    };
    
    // Create new dashboard handler
    const handleCreateNewDashboard = () => {
        setDashboard(null);
        setLayout([]);
        setIsEditorOpen(true);
    };
    
    // Edit dashboard handler
    const handleEditCurrentDashboard = () => {
        if (dashboard) {
            setIsEditorOpen(true);
        } else {
            console.warn("Attempted to edit, but no dashboard is loaded.");
        }
    };
    
    return (
        <div className="h-full flex flex-col bg-black text-matrix-green">
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
                    <div ref={gridContainerRef} className="h-full w-full">
                        <style>{`
                            .react-grid-layout {
                                position: relative;
                                transition: height 200ms ease;
                            }
                            .react-grid-item {
                                transition: all 200ms ease;
                                transition-property: left, top;
                            }
                            .react-grid-item.cssTransforms {
                                transition-property: transform;
                            }
                            .react-grid-item.resizing {
                                z-index: 3;
                            }
                            .react-grid-item.react-draggable-dragging {
                                transition: none;
                                z-index: 3;
                            }
                            .react-grid-item > .react-resizable-handle {
                                position: absolute;
                                width: 20px;
                                height: 20px;
                                bottom: 0;
                                right: 0;
                                cursor: nwse-resize;
                                padding: 0 4px 4px 0;
                                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 6" style="background-color:%2300000000" fill="none" stroke="%2333ff33" stroke-width=".5"><path d="M 6 0 L 0 6 M 4 0 L 0 4 M 6 2 L 2 6 M 6 4 L 4 6"/></svg>');
                                background-position: bottom right;
                                background-repeat: no-repeat;
                                background-origin: content-box;
                                box-sizing: border-box;
                                z-index: 10;
                            }
                            /* Better grid item containment */
                            .react-grid-item > div {
                                height: 100%;
                                width: 100%;
                                overflow: hidden;
                            }
                        `}</style>

                        <ReactGridLayout
                            className="layout"
                            layout={layout}
                            cols={12}
                            rowHeight={50}
                            isDraggable={true}
                            isResizable={true}
                            onLayoutChange={onLayoutChange}
                            onResizeStop={handleResizeStop}
                            onDragStop={handleDragStop}
                            useCSSTransforms={true}
                            compactType="vertical"
                            preventCollision={false}
                            margin={[10, 10]}
                            containerPadding={[10, 10]}
                            measureBeforeMount={true}
                            key={dashboard?.id || 'empty-dashboard-layout'}
                            // Add data attributes to help with size detection

                        >
                            {layout.map((item) => {
                                const dimensions = gridItemDimensions[item.i];
                                return (
                                  <div key={item.i} className="chart-grid-item" data-grid-id={item.i}>
                                  <ChartRenderer
                                      ref={(el) => setChartRef(item.i, el)}
                                      chartId={item.i}
                                      chartType={item.chartType}
                                      title={item.title}
                                      isLive={item.isLive}
                                      // Pass grid dimensions if available
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
                initialDashboard={dashboard}
                isEditing={!isEmptyState && !!dashboard}
            />
        </div>
    );
};

export default AnalyticsDashboard;