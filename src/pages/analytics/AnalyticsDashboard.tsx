// src/pages/analytics/AnalyticsDashboard.tsx
import React, { useState, useEffect } from 'react';
import RGL, { WidthProvider, Layout } from 'react-grid-layout';
import { ChartRenderer } from '@/features/charts/components/chartRenderer';
import { Plus, Settings, Save } from 'lucide-react';
import DashboardEditorModal from '@/components/analytics/DashboardEditorModal';
import '/node_modules/react-grid-layout/css/styles.css'; 
import '/node_modules/react-resizable/css/styles.css'; 

const ReactGridLayout = WidthProvider(RGL);

// Define layout type including chart configuration needed by ChartRenderer
interface DashboardLayoutItem extends Layout {
  chartType: 'line' | 'bar' | 'pie' | 'number' | 'table' | 'gauge'; 
  title?: string;
  isLive?: boolean; 
}

interface Dashboard {
  id?: string;
  name: string;
  description?: string;
  layout: DashboardLayoutItem[];
}

const AnalyticsDashboard = () => {
  const [layout, setLayout] = useState<DashboardLayoutItem[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isEmptyState, setIsEmptyState] = useState(true);

  // Check if we should show the empty state or load a dashboard
  useEffect(() => {
    // In a real app, you'd check URL params for a dashboard ID and load it
    // For now, we'll just show the empty state initially
    setIsEmptyState(layout.length === 0);
  }, [layout]);

  const onLayoutChange = (newLayout: Layout[]) => {
    if (layout.length === 0) return; // Skip if no layout is loaded yet
    
    // TODO: Debounce and save layout via useMutation
    console.log('Layout changed (needs saving):', newLayout);
    setLayout(currentLayout => currentLayout.map(item => {
        const updatedItem = newLayout.find(newItem => newItem.i === item.i);
        return updatedItem ? { ...item, ...updatedItem } : item;
    }));
  };

  const handleSaveDashboard = (dashboardData: any) => {
    console.log('Saving dashboard:', dashboardData);
    
    // Update the state with the new dashboard data
    setDashboard({
      id: dashboard?.id || `dashboard-${Date.now()}`,
      name: dashboardData.name,
      description: dashboardData.description,
      layout: dashboardData.layout
    });
    
    // Update the layout for the grid
    setLayout(dashboardData.layout);
    setIsEmptyState(false);
    
    // In a real app, you'd save this to your backend
    // saveDashboardMutation.mutate(dashboardData);
  };

  const handleCreateNewDashboard = () => {
    setIsEditorOpen(true);
  };

  const handleEditCurrentDashboard = () => {
    setIsEditorOpen(true);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b border-matrix-green/30">
        <h2 className="text-lg font-mono text-matrix-green">
          {dashboard?.name || 'Dashboard'}
        </h2>
        <div className="flex space-x-2">
          {!isEmptyState && (
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
      <div className="flex-1 overflow-auto">
        {isEmptyState ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="text-center p-6 max-w-lg">
              <h3 className="text-xl font-mono text-matrix-green mb-4">No Dashboard Loaded</h3>
              <p className="text-matrix-green/70 mb-8">
                Create a new dashboard to start visualizing your data with customizable charts and metrics.
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
          <>
            {/* Grid Styles */}
            <style>{`
                .react-grid-layout { position: relative; transition: height 200ms ease; }
                .react-grid-item { transition: all 200ms ease; transition-property: left, top; box-sizing: border-box; }
                .react-grid-item.cssTransforms { transition-property: transform; }
                .react-grid-item.resizing { opacity: 0.9; z-index: 3; }
                .react-grid-item.react-draggable-dragging { transition: none; z-index: 3; }
                .react-grid-item.react-grid-placeholder { 
                  background: #33ff33; opacity: 0.1; transition-duration: 100ms; z-index: 2; 
                  -webkit-user-select: none; user-select: none; border: 1px dashed rgba(51, 255, 51, 0.5); 
                }
                .react-grid-item > .react-resizable-handle { 
                    position: absolute; width: 20px; height: 20px; bottom: 0; right: 0; cursor: nwse-resize; padding: 0 4px 4px 0; 
                    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 6" style="background-color:%2300000000" fill="none" stroke="%2333ff33" stroke-width=".5"><path d="M 6 0 L 0 6 M 4 0 L 0 4 M 6 2 L 2 6 M 6 4 L 4 6"/></svg>');
                    background-position: bottom right; background-repeat: no-repeat; background-origin: content-box; box-sizing: border-box; 
                }
                .react-grid-item > .chart-wrapper { 
                    width: 100%; 
                    height: 100%; 
                    overflow: hidden; 
                    border: 1px solid rgba(51, 255, 51, 0.2);
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 2px;
                }
                .chart-title {
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  padding: 4px 8px;
                  font-size: 12px;
                  font-weight: 500;
                  text-align: left;
                  background: rgba(0, 0, 0, 0.6);
                  border-bottom: 1px solid rgba(51, 255, 51, 0.2);
                  color: rgba(51, 255, 51, 0.8);
                  z-index: 1;
                }
            `}</style>

            <ReactGridLayout
              className="layout"
              layout={layout}
              cols={12}
              rowHeight={90}
              isDraggable={true}
              isResizable={true}
              onLayoutChange={onLayoutChange}
              useCSSTransforms={true}
              compactType="vertical"
              preventCollision={false}
              margin={[6, 6]}
              containerPadding={[6, 6]}
            >
              {layout.map((item) => (
                <div key={item.i} className="bg-transparent">
                  <div className="chart-wrapper">
                    <div className="chart-title">{item.title}</div>
                    <div className="pt-6">
                      <ChartRenderer
                        chartId={item.i}
                        chartType={item.chartType}
                        title={item.title}
                        isLive={item.isLive}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </ReactGridLayout>
          </>
        )}
      </div>
      
      {/* Dashboard Editor Modal */}
      <DashboardEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveDashboard}
        initialLayout={layout}
        isEditing={!isEmptyState}
      />
    </div>
  );
};

export default AnalyticsDashboard;