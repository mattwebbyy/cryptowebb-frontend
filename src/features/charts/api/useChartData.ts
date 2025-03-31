// src/features/charts/api/useChartData.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import { ChartData, ChartDataRow } from '@/types/data'; // Import shared types

// --- Mock Data Generation ---
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const generateMockLineData = (points = 20): ChartData => {
  const data: ChartData = [];
  const startTime = Date.now() - points * 60 * 1000; // Start `points` minutes ago
  for (let i = 0; i < points; i++) {
    data.push({
      timestamp: startTime + i * 60 * 1000,
      valueA: Math.random() * 100 + 50,
      valueB: Math.random() * 80 + 20,
    });
  }
  return data;
};

const generateMockBarData = (categories = 5): ChartData => {
    const data: ChartData = [];
    const cats = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta']
    for (let i = 0; i < categories; i++) {
         data.push({
            category: cats[i % cats.length] || `Cat ${i+1}`,
            users: Math.floor(Math.random() * 500) + 10,
            sessions: Math.floor(Math.random() * 1000) + 50,
        });
    }
    return data;
};

 const generateMockPieData = (segments = 4): ChartData => {
    const data: ChartData = [];
    const names = ['Active', 'Inactive', 'Pending', 'Failed', 'Other'];
    for (let i = 0; i < segments; i++) {
         data.push({
            name: names[i % names.length] || `Segment ${i+1}`,
            value: Math.floor(Math.random() * 100) + 10,
        });
    }
    return data;
};

const generateMockGaugeData = (): ChartData => {
    return [{ value: Math.round(Math.random() * 100) }];
};

const generateMockTableData = (rows = 10): ChartData => {
     const data: ChartData = [];
     for(let i=0; i<rows; i++) {
         data.push({
             id: `id_${i+1}`,
             event_name: Math.random() > 0.5 ? 'login_success' : 'page_view',
             user_email: `user${i}@example.com`,
             timestamp: new Date(Date.now() - Math.random() * 10000000).toISOString(),
             value: Math.random() * 10,
         })
     }
     return data;
};


const getMockDataForChart = (chartId: string): ChartData => {
    // Simple logic: return different mock data based on keywords in chartId (or use chartType if available)
    if (chartId.includes('line')) return generateMockLineData();
    if (chartId.includes('bar')) return generateMockBarData();
    if (chartId.includes('pie')) return generateMockPieData();
    if (chartId.includes('gauge') || chartId.includes('number')) return generateMockGaugeData(); // Use gauge for number too
    if (chartId.includes('table')) return generateMockTableData();
    return generateMockLineData(); // Default
}
// --- End Mock Data ---


const fetchChartData = async (chartId: string): Promise<ChartData> => {
    if (!chartId) {
        console.warn("fetchChartData called without chartId");
        return []; 
    }
    console.debug(`Workspaceing real data for chart: ${chartId}`);
    const data: ChartData = await apiClient.get(`/api/v1/charts/${chartId}/data`); 
    return data || []; 
  };
  
  export const useChartData = (chartId: string | undefined) => {
    return useQuery<ChartData, Error>({ 
      queryKey: ['chartData', chartId], 
      queryFn: async () => {
          if (!chartId) return []; 
          if (USE_MOCK_DATA) {
              console.log(`Using MOCK data for chart: ${chartId}`);
              await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500)); 
              return getMockDataForChart(chartId);
          } else {
              return fetchChartData(chartId);
          }
      }, 
      enabled: !!chartId, 
      staleTime: USE_MOCK_DATA ? Infinity : 5 * 60 * 1000, 
      refetchInterval: false, 
      refetchOnWindowFocus: !USE_MOCK_DATA, 
    });
  };