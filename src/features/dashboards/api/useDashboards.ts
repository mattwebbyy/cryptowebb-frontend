// src/features/dashboards/api/useDashboards.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import { DashboardConfig } from '@/types/data';

// Backend DashboardResponse — DashboardConfig plus share fields.
export interface SharedDashboardResponse extends DashboardConfig {
  isPublic: boolean;
  shareUrl?: string;
}

const fetchDashboards = async (): Promise<DashboardConfig[]> => {
  const data = await apiClient.get<DashboardConfig[]>('/api/v1/dashboards');
  return data || [];
};

export const useDashboards = () => {
  return useQuery<DashboardConfig[], Error>({
    queryKey: ['dashboards'],
    queryFn: fetchDashboards,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateDashboard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newDashboard: { name: string; layout?: string; isPublic?: boolean }) =>
      apiClient.post<DashboardConfig>('/api/v1/dashboards', {
        name: newDashboard.name,
        layout: newDashboard.layout ?? 'grid',
        isPublic: newDashboard.isPublic ?? false,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
    },
  });
};

export const useUpdateDashboard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updates }: { id: string; name?: string; layout?: string }) =>
      apiClient.put<DashboardConfig>(`/api/v1/dashboards/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
    },
  });
};

export const useDeleteDashboard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dashboardId: string) => apiClient.delete(`/api/v1/dashboards/${dashboardId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
    },
  });
};

// Marks the dashboard public and returns it with a stable shareUrl token.
export const useShareDashboard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dashboardId: string) =>
      apiClient.post<SharedDashboardResponse>(`/api/v1/dashboards/${dashboardId}/share`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
    },
  });
};
