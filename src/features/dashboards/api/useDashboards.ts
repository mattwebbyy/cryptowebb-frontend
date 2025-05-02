// src/features/dashboards/api/useDashboards.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import { DashboardConfig } from '@/types/data';

// Fetch Function
const fetchDashboards = async (): Promise<DashboardConfig[]> => {
  console.debug('Fetching dashboards...');
  // Adjust endpoint if needed
  const data = await apiClient.get<DashboardConfig[]>('/api/v1/dashboards');
  return data || [];
};

// Custom Hook for fetching
export const useDashboards = () => {
  return useQuery<DashboardConfig[], Error>({
    queryKey: ['dashboards'],
    queryFn: fetchDashboards,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// --- Placeholder Mutations (Implement later) ---

export const useCreateDashboard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      newDashboard: Omit<DashboardConfig, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'charts'>
    ) => {
      console.warn('useCreateDashboard mutationFn not implemented', newDashboard);
      await new Promise((res) => setTimeout(res, 500));
      return { id: `new_${Date.now()}`, ...newDashboard };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
    },
  });
};

export const useDeleteDashboard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dashboardId: string) => {
      console.warn('useDeleteDashboard mutationFn not implemented', dashboardId);
      await new Promise((res) => setTimeout(res, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
    },
  });
};
