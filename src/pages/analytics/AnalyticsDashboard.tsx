// src/pages/analytics/AnalyticsDashboard.tsx
import React, { useState } from 'react';
import RGL, { WidthProvider, Layout } from 'react-grid-layout';
import { ChartRenderer } from '@/features/charts/components/chartRenderer';
import '/node_modules/react-grid-layout/css/styles.css'; 
import '/node_modules/react-resizable/css/styles.css'; 

const ReactGridLayout = WidthProvider(RGL);

// Define layout type including chart configuration needed by ChartRenderer
interface DashboardLayoutItem extends Layout {
  chartType: 'line' | 'bar' | 'pie' | 'number' | 'table' | 'gauge'; 
  title?: string;
  isLive?: boolean; 
}

// TODO: Fetch this layout and chart configurations from your backend API
const initialLayout: DashboardLayoutItem[] = [
    { i: 'chart-uuid-backend-1', x: 0, y: 0, w: 6, h: 3, chartType: 'line', title: 'Static Line Chart', isLive: false },
    { i: 'chart-uuid-backend-2', x: 6, y: 0, w: 6, h: 3, chartType: 'bar', title: 'Static Bar Chart', isLive: false },
    { i: 'chart-uuid-backend-3', x: 0, y: 3, w: 4, h: 3, chartType: 'pie', title: 'Static Pie Chart', isLive: false },
    { i: 'chart-uuid-backend-4', x: 4, y: 3, w: 4, h: 1, chartType: 'number', title: 'Static Number', isLive: false },
    { i: 'chart-uuid-backend-5', x: 4, y: 4, w: 8, h: 3, chartType: 'table', title: 'Static Table', isLive: false },
    { i: 'live-chart-uuid-1', x: 8, y: 3, w: 4, h: 1, chartType: 'gauge', title: 'Live Gauge', isLive: true }, 
    { i: 'live-chart-uuid-2', x: 0, y: 6, w: 12, h: 3, chartType: 'line', title: 'Live Line Chart', isLive: true }, 
];

const AnalyticsDashboard = () => {
  const [layout, setLayout] = useState<DashboardLayoutItem[]>(initialLayout);

  const onLayoutChange = (newLayout: Layout[]) => {
    // TODO: Debounce and save layout via useMutation
    console.log('Layout changed (needs saving):', newLayout);
    setLayout(currentLayout => currentLayout.map(item => {
        const updatedItem = newLayout.find(newItem => newItem.i === item.i);
        return updatedItem ? { ...item, ...updatedItem } : item;
    }));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Minimal header that doesn't waste space */}
      <div className="flex justify-between items-center p-2 border-b border-matrix-green/30">
        <h2 className="text-lg font-mono text-matrix-green">Main Dashboard</h2>
        <div className="flex space-x-2">
          <button className="px-2 py-1 text-xs bg-matrix-green/10 border border-matrix-green/30 rounded hover:bg-matrix-green/20">
            Edit Layout
          </button>
          <button className="px-2 py-1 text-xs bg-matrix-green/10 border border-matrix-green/30 rounded hover:bg-matrix-green/20">
            Add Chart
          </button>
        </div>
      </div>
      
      {/* Full-height grid container */}
      <div className="flex-1 overflow-auto">
        {/* Grid Styles */}
        <style>{`
            .react-grid-layout { position: relative; transition: height 200ms ease; }
            .react-grid-item { transition: all 200ms ease; transition-property: left, top; box-sizing: border-box; }
            .react-grid-item.cssTransforms { transition-property: transform; }
            .react-grid-item.resizing { opacity: 0.9; z-index: 3; }
            .react-grid-item.react-draggable-dragging { transition: none; z-index: 3; }
            .react-grid-item.react-grid-placeholder { background: #33ff33; opacity: 0.1; transition-duration: 100ms; z-index: 2; -webkit-user-select: none; user-select: none; border: 1px dashed rgba(51, 255, 51, 0.5); }
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
        `}</style>

        <ReactGridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={90} // Slightly smaller for more compact display
          isDraggable={true}
          isResizable={true}
          onLayoutChange={onLayoutChange}
          useCSSTransforms={true}
          compactType="vertical"
          preventCollision={false}
          margin={[6, 6]} // Tighter margins
          containerPadding={[6, 6]} // Smaller padding
        >
          {layout.map((item) => (
            <div key={item.i} className="bg-transparent">
              <div className="chart-wrapper">
                <ChartRenderer
                  chartId={item.i}
                  chartType={item.chartType}
                  title={item.title}
                  isLive={item.isLive}
                />
              </div>
            </div>
          ))}
        </ReactGridLayout>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;