// src/features/charts/components/ChartRenderer.tsx
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Highcharts from 'highcharts'; // Still need Highcharts core
import HighchartsReact from 'highcharts-react-official'; // Need the wrapper

// --- REMOVED MODULE IMPORTS & INITIALIZATION for HCMore and HCSolidGauge ---

// --- Correct Type Imports (Ensure these are exported from types/data.ts) ---
import { useChartData, ChartData, ChartDataRow } from '../api/useChartData'; // Data fetching hook
import { WebSocketUpdate } from '@/types/data'; // Shared types

import { Card } from '@/components/ui/Card'; // Assuming Card component exists
import { useWebSocket } from '@/hooks/useWebSocket'; // WebSocket hook

// --- REMINDER: Highcharts Theme should be set globally in main.tsx or App.tsx ---

interface ChartRendererProps {
  chartId: string;
  // Temporarily removed 'gauge' from type as module is removed
  chartType: 'line' | 'bar' | 'pie' | 'number' | 'table'; 
  title?: string;
  isLive?: boolean; // Flag to enable WebSocket
}

// --- Data Transformation Logic ---
const transformDataForHighcharts = (
    data: ChartData | undefined | null,
    chartType: ChartRendererProps['chartType'],
    title?: string // Pass title for potential use in series names
): Highcharts.SeriesOptionsType[] => {
    if (!data || data.length === 0) return [];

    // Ensure data[0] exists before getting keys
    const keys = Object.keys(data[0]);
    // Explicitly type k as string
    const xKey = keys.find((k: string) => ['time', 'date', 'timestamp', 'category', 'name', 'label'].includes(k.toLowerCase())) || keys[0];
    // Explicitly type k as string
    const numericKeys = keys.filter((k: string) => k !== xKey && typeof data[0]?.[k] === 'number' && !k.toLowerCase().endsWith('id'));

    // Check if the identified xKey likely represents time
    const isTimeBased = xKey.toLowerCase().includes('time') || xKey.toLowerCase().includes('date');

    // Function to get the X value, parsing dates if necessary
    const getXValue = (row: ChartDataRow): number | string => {
        const rawValue: any = row[xKey]; // Use 'any' cautiously, ideally ChartDataRow has more specific types
        if (isTimeBased) {
            const date = new Date(rawValue);
            // Return timestamp if valid date, otherwise the original string
            return isNaN(date.getTime()) ? String(rawValue) : date.getTime();
        }
        return String(rawValue); // Treat as category otherwise
    };

    switch (chartType) {
        case 'line':
        case 'bar':
            // Explicitly type valueKey as string, return type, row type, point type
            return numericKeys.map((valueKey: string): Highcharts.SeriesLineOptions | Highcharts.SeriesColumnOptions => ({
                type: chartType === 'line' ? 'line' : 'column',
                name: valueKey, // Consider making this more user-friendly later
                // Explicitly type row as ChartDataRow
                data: data.map((row: ChartDataRow): [number | string, number | null] => [ // Add point type annotation
                    getXValue(row),
                    row[valueKey] as number | null // Assert type, handle potential nulls from DB
                ]),
                turboThreshold: 5000 // Optimization for large datasets in Highcharts
            }));
        case 'pie':
            // Explicitly type k as string
            const nameKeyPie = keys.find((k: string) => typeof data[0]?.[k] === 'string') || 'name';
            const valueKeyPie = numericKeys[0] || 'value'; // Use the first numeric key found
             if (!valueKeyPie) return []; // Need a value key for pie chart
             return [{
                 type: 'pie',
                 name: title || 'Segments', // Default name if title missing
                 // Explicitly type row and point structure
                 data: data.map((row: ChartDataRow): Highcharts.PointOptionsObject => ({
                     name: String(row[nameKeyPie] ?? 'Unknown'), // Handle potential null names
                     y: row[valueKeyPie] as number | null // Handle potential null values
                 }))
             }];
         // Case for 'gauge' removed temporarily
        default:
            return []; // Number and Table are handled directly in render logic
    }
};

// --- Component ---
export const ChartRenderer: React.FC<ChartRendererProps> = ({ chartId, chartType, title, isLive = false }) => {
  const { data: initialData, isLoading: isLoadingInitial, error, refetch } = useChartData(chartId);
  const [liveChartData, setLiveChartData] = useState<ChartData | null>(null);
  const highchartsChartRef = useRef<HighchartsReact.RefObject>(null);

  // Use the live data if available, otherwise fall back to the initial fetched data
  const displayData = useMemo(() => liveChartData ?? initialData, [liveChartData, initialData]);

  // --- WebSocket Handling ---
   const wsUrl = useMemo(() => {
       const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
       const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
       const wsBaseUrl = backendUrl.replace(/^http/, wsProtocol);
       // Example WS URL structure - adjust this to match your backend implementation!
       return isLive ? `${wsBaseUrl}/ws/live/${chartId}` : null;
   }, [isLive, chartId]);

   // Callback to handle incoming WebSocket messages
   // Explicitly type wsUpdate
   const handleWebSocketMessage = useCallback((wsUpdate: WebSocketUpdate) => {
     console.log(`WebSocket (${chartId}): Received update`, wsUpdate);
     // Ensure the update is for the correct chart
     if (wsUpdate.chartId !== chartId) return;

      setLiveChartData(currentData => {
         const baseData: ChartData = currentData ?? []; // Start with current live data or empty array
         const payload = wsUpdate.payload; // type depends on WebSocketUpdate definition

         switch(wsUpdate.type) {
             case 'APPEND':
                 // Assumes payload is ChartDataRow or ChartData (array of rows)
                 const pointsToAdd : ChartData = Array.isArray(payload) ? payload : [payload as ChartDataRow];
                 if (pointsToAdd.length === 0) return baseData; // No change if payload is empty
                 const appendedData = [...baseData, ...pointsToAdd];
                 // Optional: Limit the number of data points displayed (FIFO)
                 // const MAX_POINTS = 500;
                 // return appendedData.slice(-MAX_POINTS);
                 return appendedData;
             case 'REPLACE':
                  // Assumes payload is ChartData (a full array of rows)
                 return Array.isArray(payload) ? payload : [];
             case 'UPDATE':
                  // Requires more complex logic: find existing point (by ID or X value?) and update its Y value
                 console.warn("WebSocket UPDATE strategy not fully implemented in ChartRenderer");
                 // Example: Update based on matching xValue (assuming payload is ChartDataRow)
                 /*
                 if (!Array.isArray(payload)) {
                    const pointToUpdate = payload as ChartDataRow;
                    const xKey = Object.keys(pointToUpdate)[0]; // Assuming first key is identifier
                    return baseData.map(p => p[xKey] === pointToUpdate[xKey] ? {...p, ...pointToUpdate} : p);
                 }
                 */
                 return baseData; // Placeholder: return original data if update logic is missing
             default:
                 console.warn(`WebSocket (${chartId}): Unknown update type: ${wsUpdate.type}`);
                 return baseData;
         }
     });
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [chartId]); // Dependencies: only chartId needed here

   // Initialize WebSocket connection if isLive
   const { isConnected: isWsConnected } = useWebSocket<WebSocketUpdate>(wsUrl, handleWebSocketMessage, {
        onOpen: () => console.log(`WebSocket connected for chart ${chartId}`),
        onError: (err: Event) => console.error(`WebSocket error for chart ${chartId}:`, err), // Type err
        shouldReconnect: () => !!isLive // Ensure boolean, reconnect if supposed to be live
   });
   // --- End WebSocket Handling ---


   // Memoize Highcharts options calculation
  const chartOptions: Highcharts.Options = useMemo(() => {
    // Explicitly type series
    const series: Highcharts.SeriesOptionsType[] = transformDataForHighcharts(displayData, chartType, title);

    // Add explicit type for options
    const options: Highcharts.Options = {
         chart: {
             // --- Use boolean for animation ---
             animation: true,
             zooming: { type: 'x' }
         },
         // Inherit theme options (colors, fonts, etc.) from global setOptions
         title: { text: undefined }, // We use the Card title
         series: series,
         xAxis: {
             type: 'datetime', // Default for potentially time-based data
         },
         yAxis: {
             title: { text: '' } // Cleaner look without Y-axis title
         },
         plotOptions: {
             series: {
                 shadow: false,
                 animation: { // Control animation duration
                     duration: 500
                 }
             }
         },
         // Removed Gauge specific options as module was removed
         // Pie options
         ...(chartType === 'pie' && {
             plotOptions: {
                 pie: {
                     allowPointSelect: true,
                     cursor: 'pointer',
                     dataLabels: {
                         enabled: true,
                         format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                     }
                 }
             }
         })
    };
    return options;
  }, [displayData, chartType, title]); // Recalculate if data, type, or title changes


  // --- Render Logic ---
  const isLoading = isLoadingInitial && !displayData; // Show loading only if initial fetch ongoing AND no data yet

  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center min-h-[200px]">
         <div className='text-center'><p className="text-matrix-green text-sm animate-pulse">Loading Chart...</p></div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full flex flex-col items-center justify-center min-h-[200px] border-red-500/50">
         <p className="text-red-500 text-sm mb-2">Error loading chart:</p>
         <p className="text-red-500/80 text-xs mb-4">{error.message}</p>
         <button onClick={() => refetch()} className='text-xs text-matrix-green hover:underline'>Retry</button>
      </Card>
    );
  }

  // --- Table / Number Rendering (Explicit types) ---
   if (chartType === 'table' || chartType === 'number') {
       // Explicitly type dataToRender
       const dataToRender: ChartData = displayData || [];
       const keys = dataToRender.length > 0 ? Object.keys(dataToRender[0]) : [];

       if (chartType === 'number') {
           // Explicitly type k as string
            const valueKey = keys.find((k: string) => typeof dataToRender?.[0]?.[k] === 'number');
            const rawValue = valueKey ? dataToRender?.[0]?.[valueKey] : undefined;
            // Explicitly type displayValue
            const displayValue: string | number = typeof rawValue === 'number' ? Number(rawValue).toLocaleString() : 'N/A';
            return (
                 <Card className="h-full flex flex-col p-4 items-center justify-center relative" style={{ background: 'rgba(0, 20, 0, 0.5)' }}>
                    {title && <h3 className="text-md font-mono text-matrix-green mb-3 text-center">{title}</h3>}
                    <div className='text-4xl font-bold text-matrix-green'>{String(displayValue)}</div>
                    {isLive && <div className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${isWsConnected ? 'bg-matrix-green animate-pulse shadow-[0_0_8px_#33ff33]' : 'bg-red-600 shadow-[0_0_8px_#ff0000]'}`} title={isWsConnected ? 'Live' : 'Disconnected'}></div>}
                </Card>
            )
       }

        if (chartType === 'table') {
             return (
                 <Card className="h-full flex flex-col p-4 relative" style={{ background: 'rgba(0, 20, 0, 0.5)' }}>
                    {title && <h3 className="text-md font-mono text-matrix-green mb-3 text-center">{title}</h3>}
                    {isLive && <div className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${isWsConnected ? 'bg-matrix-green animate-pulse shadow-[0_0_8px_#33ff33]' : 'bg-red-600 shadow-[0_0_8px_#ff0000]'}`} title={isWsConnected ? 'Live' : 'Disconnected'}></div>}
                     <div className='overflow-auto flex-grow scrollbar-thin scrollbar-track-black/20 scrollbar-thumb-matrix-green/50'>
                        <table className='w-full text-left text-xs'>
                            <thead>
                                <tr className='border-b border-matrix-green/50'>
                                    {/* Explicitly type key */}
                                    {keys.map((key: string) => <th key={key} className='p-2 text-matrix-green font-normal sticky top-0 bg-black/80'>{key}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Explicitly type row and rowIndex */}
                                {dataToRender.map((row: ChartDataRow, rowIndex: number) => (
                                    <tr key={rowIndex} className='border-b border-matrix-green/20 hover:bg-matrix-green/5'>
                                        {/* Explicitly type key */}
                                        {keys.map((key: string) => <td key={`${rowIndex}-${key}`} className='p-2 text-matrix-green/80 whitespace-nowrap'>{String(row[key] ?? '')}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                     {dataToRender.length === 0 && <p className="text-matrix-green/70 text-sm text-center mt-4">No data available.</p>}
                </Card>
             )
        }
   }


  // --- Highcharts Rendering ---
   return (
    <Card className="h-full flex flex-col p-4 relative" style={{ background: 'rgba(0, 20, 0, 0.5)' }}>
       {title && <h3 className="text-md font-mono text-matrix-green mb-3 text-center">{title}</h3>}
       {/* Live indicator */}
       {isLive && (
            <div className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${isWsConnected ? 'bg-matrix-green animate-pulse shadow-[0_0_8px_#33ff33]' : 'bg-red-600 shadow-[0_0_8px_#ff0000]'}`} title={isWsConnected ? 'Live' : 'Disconnected'}></div>
       )}
       <div className="flex-grow h-[calc(100%-2rem)]"> {/* Ensure chart container takes remaining space */}
         <HighchartsReact
           highcharts={Highcharts}
           options={chartOptions}
           ref={highchartsChartRef}
           containerProps={{ style: { height: '100%', width: '100%' } }}
         />
       </div>
        {/* Show No Data message if applicable */}
        {(!displayData || displayData.length === 0) && !isLoading && !error &&
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-matrix-green/70 text-sm">No data available.</p>
            </div>
        }
     </Card>
  );
};

// Ensure default export if using React.lazy
export default ChartRenderer;