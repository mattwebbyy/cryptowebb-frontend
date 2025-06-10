// src/features/alerts/api/alertsApi.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';

// Types for alerts
export interface Alert {
  id: string;
  userID: string;
  metricID: string;
  condition: 'ABOVE' | 'BELOW' | 'EQUALS';
  threshold: number;
  frequency: 'ONCE' | 'DAILY' | 'WEEKLY';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastTriggered?: string;
  notificationMethod: 'EMAIL' | 'SMS' | 'PUSH' | 'WEBHOOK';
  webhookURL?: string;
  message?: string;
}

export interface CreateAlertRequest {
  metricID: string;
  condition: 'ABOVE' | 'BELOW' | 'EQUALS';
  threshold: number;
  frequency: 'ONCE' | 'DAILY' | 'WEEKLY';
  notificationMethod: 'EMAIL' | 'SMS' | 'PUSH' | 'WEBHOOK';
  webhookURL?: string;
  message?: string;
}

export interface UpdateAlertRequest {
  condition?: 'ABOVE' | 'BELOW' | 'EQUALS';
  threshold?: number;
  frequency?: 'ONCE' | 'DAILY' | 'WEEKLY';
  isActive?: boolean;
  notificationMethod?: 'EMAIL' | 'SMS' | 'PUSH' | 'WEBHOOK';
  webhookURL?: string;
  message?: string;
}

// API functions
const fetchAlerts = async (): Promise<Alert[]> => {
  return apiClient.get('/api/v1/alerts');
};

const fetchAlert = async (alertId: string): Promise<Alert> => {
  return apiClient.get(`/api/v1/alerts/${alertId}`);
};

const createAlert = async (alert: CreateAlertRequest): Promise<Alert> => {
  return apiClient.post('/api/v1/alerts', alert);
};

const updateAlert = async (alertId: string, updates: UpdateAlertRequest): Promise<Alert> => {
  return apiClient.put(`/api/v1/alerts/${alertId}`, updates);
};

const deleteAlert = async (alertId: string): Promise<void> => {
  return apiClient.delete(`/api/v1/alerts/${alertId}`);
};

const toggleAlert = async (alertId: string, isActive: boolean): Promise<Alert> => {
  return apiClient.put(`/api/v1/alerts/${alertId}`, { isActive });
};

const testAlert = async (alertId: string): Promise<{ success: boolean; message: string }> => {
  return apiClient.post(`/api/v1/alerts/${alertId}/test`);
};

// React Query hooks
export const useAlerts = () => {
  return useQuery<Alert[], Error>({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

export const useAlert = (alertId: string | undefined) => {
  return useQuery<Alert, Error>({
    queryKey: ['alerts', alertId],
    queryFn: () => fetchAlert(alertId!),
    enabled: !!alertId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateAlert = () => {
  const queryClient = useQueryClient();

  return useMutation<Alert, Error, CreateAlertRequest>({
    mutationFn: createAlert,
    onSuccess: () => {
      // Invalidate and refetch alerts list
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};

export const useUpdateAlert = () => {
  const queryClient = useQueryClient();

  return useMutation<Alert, Error, { alertId: string; updates: UpdateAlertRequest }>({
    mutationFn: ({ alertId, updates }) => updateAlert(alertId, updates),
    onSuccess: (updatedAlert) => {
      // Update the specific alert in cache
      queryClient.setQueryData(['alerts', updatedAlert.id], updatedAlert);
      // Invalidate alerts list to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};

export const useDeleteAlert = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteAlert,
    onSuccess: (_, alertId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['alerts', alertId] });
      // Invalidate alerts list
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};

export const useToggleAlert = () => {
  const queryClient = useQueryClient();

  return useMutation<Alert, Error, { alertId: string; isActive: boolean }>({
    mutationFn: ({ alertId, isActive }) => toggleAlert(alertId, isActive),
    onSuccess: (updatedAlert) => {
      // Update the specific alert in cache
      queryClient.setQueryData(['alerts', updatedAlert.id], updatedAlert);
      // Invalidate alerts list to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};

export const useTestAlert = () => {
  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: testAlert,
  });
};