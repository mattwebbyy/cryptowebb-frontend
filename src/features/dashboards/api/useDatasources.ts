// src/features/dashboards/api/useDatasources.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { DataSource } from '@/features/datasources/types';
import {
  fetchDatasources,
  createDatasource as createDatasourceRequest,
  deleteDatasource as deleteDatasourceRequest,
} from '@/api/datasourceApi';

const QUERY_KEY = ['datasources'];

export const useDatasources = () => {
  return useQuery<DataSource[], Error>({
    queryKey: QUERY_KEY,
    queryFn: fetchDatasources,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateDatasource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDatasourceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useDeleteDatasource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDatasourceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
