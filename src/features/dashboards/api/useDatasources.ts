// src/features/datasources/api/useDatasources.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import { DatasourceConfig } from '@/types/data'; // Assuming type defined in shared types

// Fetch Function
const fetchDatasources = async (): Promise<DatasourceConfig[]> => {
    console.debug("Fetching datasources...");
    // Adjust endpoint if needed
    const data = await apiClient.get<DatasourceConfig[]>('/api/v1/datasources'); 
    return data || []; // Ensure array return
};

// Custom Hook for fetching
export const useDatasources = () => {
    return useQuery<DatasourceConfig[], Error>({
        queryKey: ['datasources'], // Query key for caching
        queryFn: fetchDatasources,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// --- Placeholder Mutations (Implement later) ---

// Example: Create Datasource Mutation Hook
export const useCreateDatasource = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newDatasource: Omit<DatasourceConfig, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
            // return await apiClient.post('/api/v1/datasources', newDatasource);
            console.warn("useCreateDatasource mutationFn not implemented", newDatasource);
            // Simulate success for now
             await new Promise(res => setTimeout(res, 500));
             return { id: `new_${Date.now()}`, ...newDatasource }; 
        },
        onSuccess: () => {
            // Invalidate and refetch the datasources list after creation
            queryClient.invalidateQueries({ queryKey: ['datasources'] });
        },
    });
};

// Example: Delete Datasource Mutation Hook
export const useDeleteDatasource = () => {
    const queryClient = useQueryClient();
    return useMutation({
         mutationFn: async (datasourceId: string) => {
             // return await apiClient.delete(`/api/v1/datasources/${datasourceId}`);
             console.warn("useDeleteDatasource mutationFn not implemented", datasourceId);
             // Simulate success for now
             await new Promise(res => setTimeout(res, 500));
             return { success: true };
        },
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['datasources'] });
        },
    });
};