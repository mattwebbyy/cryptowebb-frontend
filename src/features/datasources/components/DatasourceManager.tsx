// src/features/datasources/components/DatasourceManager.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { GlitchButton } from '@/components/ui/GlitchEffects';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useDatasources, useDeleteDatasource } from '../api/useDatasources';
import { DataSource } from '../types';
import { 
  Plus,
  Database,
  Globe,
  FileText,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

export const DatasourceManager: React.FC = () => {
  const { data: datasources = [], isLoading, error } = useDatasources();
  const deleteMutation = useDeleteDatasource();
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  const getStatusIcon = (status: DataSource['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'disconnected':
        return <XCircle className="w-5 h-5 text-gray-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: DataSource['type']) => {
    switch (type) {
      case 'api':
        return <Globe className="w-5 h-5 text-blue-500" />;
      case 'database':
        return <Database className="w-5 h-5 text-purple-500" />;
      case 'file':
        return <FileText className="w-5 h-5 text-orange-500" />;
      case 'realtime':
        return <Zap className="w-5 h-5 text-green-500" />;
      default:
        return <Database className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-mono text-teal-600 dark:text-matrix-green">
            Data Sources
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your data connections and sources
          </p>
        </div>
        
        <GlitchButton
          onClick={() => setShowCreateForm(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Source
        </GlitchButton>
      </div>

      {/* Data Sources Grid */}
      {datasources.length === 0 ? (
        <Card className="p-12 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green text-center">
          <Database className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            No Data Sources
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Connect your first data source to start building dashboards
          </p>
          <GlitchButton onClick={() => setShowCreateForm(true)}>
            Add Data Source
          </GlitchButton>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasources.map((datasource) => (
            <motion.div
              key={datasource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(datasource.type)}
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                        {datasource.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {datasource.type}
                      </p>
                    </div>
                  </div>
                  {getStatusIcon(datasource.status)}
                </div>

                {datasource.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {datasource.description}
                  </p>
                )}

                <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                  <div>Created: {new Date(datasource.createdAt).toLocaleDateString()}</div>
                  {datasource.lastSync && (
                    <div>Last sync: {new Date(datasource.lastSync).toLocaleString()}</div>
                  )}
                  {datasource.metrics && (
                    <div>Requests: {datasource.metrics.totalRequests}</div>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    Configure
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={deleteMutation.isPending && deleteMutation.variables === datasource.id}
                    onClick={() => deleteMutation.mutate(datasource.id)}
                  >
                    {deleteMutation.isPending && deleteMutation.variables === datasource.id ? '...' : 'Delete'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 bg-white/95 dark:bg-black/95 border-teal-600 dark:border-matrix-green max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-teal-600 dark:text-matrix-green mb-4">
              Add Data Source
            </h3>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
              Data source creation form will be implemented here
            </p>
            <Button
              variant="outline"
              onClick={() => setShowCreateForm(false)}
              className="w-full"
            >
              Close
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DatasourceManager;
