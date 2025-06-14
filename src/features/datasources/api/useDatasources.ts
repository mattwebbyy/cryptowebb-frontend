// src/features/datasources/api/useDatasources.ts
import { useState, useEffect } from 'react';
import { DataSource } from '../types';

export const useDatasources = () => {
  const [datasources, setDatasources] = useState<DataSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDatasources = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/v1/datasources', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch datasources');
      }

      const data = await response.json();
      setDatasources(data.datasources || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createDatasource = async (datasource: Omit<DataSource, 'id' | 'createdAt' | 'status'>) => {
    try {
      const response = await fetch('/api/v1/datasources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(datasource)
      });

      if (!response.ok) {
        throw new Error('Failed to create datasource');
      }

      const newDatasource = await response.json();
      setDatasources(prev => [...prev, newDatasource]);
      return newDatasource;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteDatasource = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/datasources/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete datasource');
      }

      setDatasources(prev => prev.filter(ds => ds.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchDatasources();
  }, []);

  return {
    datasources,
    isLoading,
    error,
    createDatasource,
    deleteDatasource,
    refetch: fetchDatasources
  };
};