// src/pages/dashboard/AnalyticsDashboard.tsx
import React, { useState } from 'react';
import RGL, { WidthProvider, Layout } from 'react-grid-layout';
import { ChartRenderer } from '@/features/charts/components/chartRenderer'; // Import the Highcharts version
import '/node_modules/react-grid-layout/css/styles.css'; 
import '/node_modules/react-resizable/css/styles.css'; 
// No need to import Card here unless you want to wrap the grid item itself

const ReactGridLayout = WidthProvider(RGL);

// Define layout type including chart configuration needed by ChartRenderer
interface DashboardLayoutItem extends Layout {
  chartType: 'line' | 'bar' | 'pie' | 'number' | 'table' | 'gauge'; 
  title?: string;
  isLive?: boolean; 
}

// TODO: Fetch this layout and chart configurations from your backend API
// Replace chart IDs (item.i) with actual UUIDs from your backend charts
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
  // TODO: Use useQuery to fetch initialLayout from backend
  const [layout, setLayout] = useState<DashboardLayoutItem[]>(initialLayout);

  const onLayoutChange = (newLayout: Layout[]) => {
    // TODO: Debounce and save layout via useMutation
    console.log('Layout changed (needs saving):', newLayout);
    // Simple update for now - assumes order and 'i' match. Robust solution needs merging config.
    setLayout(currentLayout => currentLayout.map(item => {
        const updatedItem = newLayout.find(newItem => newItem.i === item.i);
        return updatedItem ? { ...item, ...updatedItem } : item;
    }));
  };


  return (
    <div className="p-4 dashboard-grid">
      <h1 className="text-3xl mb-6 text-matrix-green">Analytics Dashboard</h1>

       {/* Grid Styles (ensure these are applied, maybe in index.css or App.css) */}
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
             .react-grid-item > .chart-wrapper { width: 100%; height: 100%; overflow: hidden; }
        `}</style>

      <ReactGridLayout
        className="layout"
        layout={layout} // Use the state layout
        cols={12} 
        rowHeight={100} // Base height unit for 'h' in layout
        // width handled by WidthProvider
        // draggableHandle=".drag-handle" // CSS selector for drag handle
        isDraggable={true}
        isResizable={true}
        onLayoutChange={onLayoutChange}
        useCSSTransforms={true}
         compactType="vertical" // Or 'horizontal' or null
         preventCollision={false} // Set true if you want items to move others out of the way
         margin={[10, 10]} // Margin between items [horizontal, vertical]
         containerPadding={[10, 10]} // Padding inside the grid container [horizontal, vertical]
      >
        {layout.map((item) => (
          // IMPORTANT: The key MUST be item.i for react-grid-layout to work correctly
          <div key={item.i} className="bg-transparent"> 
              {/* Optional: Add Card or other wrapper inside if needed */}
              {/* Example drag handle element */}
              {/* <div className="drag-handle cursor-move p-1 absolute top-0 left-0 z-10 text-matrix-green/50">⠿ Handle</div> */}
              <div className='chart-wrapper'> 
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
  );
};

export default AnalyticsDashboard;