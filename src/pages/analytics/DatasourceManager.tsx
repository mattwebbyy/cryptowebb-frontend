// src/pages/dashboard/DatasourceManager.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Database, Edit, Trash2 } from 'lucide-react';
import { useDatasources, useDeleteDatasource } from '@/features/datasources/api/useDatasources'; // Import the hook
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button'; // Assuming you have this component
import { toast } from 'react-toastify';

const DatasourceManager = () => {
  const { data: datasources, isLoading, error } = useDatasources();
  const deleteMutation = useDeleteDatasource();

  const handleDelete = (id: string, name: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete the datasource "${name}"? This cannot be undone.`
      )
    ) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success(`Datasource "${name}" deleted.`);
        },
        onError: (err) => {
          toast.error(`Failed to delete datasource: ${err.message}`);
        },
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-mono text-matrix-green">Manage Datasources</h1>
        <Button
          onClick={() => {
            /* TODO: Open create modal/form */ alert("Open 'Create Datasource' form/modal");
          }}
          className="bg-matrix-green hover:bg-matrix-green/80 text-black font-mono"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Datasource
        </Button>
      </div>

      <Card className="bg-black/50 border border-matrix-green/50 p-4 md:p-6">
        {isLoading && (
          <div className="text-center py-4 text-matrix-green">Loading datasources...</div>
        )}
        {error && (
          <div className="text-center py-4 text-red-500">
            Error loading datasources: {error.message}
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-4">
            {datasources && datasources.length > 0 ? (
              datasources.map((ds) => (
                <div
                  key={ds.id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-black/30 border border-matrix-green/30 rounded hover:border-matrix-green/70 transition-colors"
                >
                  <div className="mb-2 md:mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Database className="w-5 h-5 text-matrix-green" />
                      <span className="text-lg font-semibold text-matrix-green">{ds.name}</span>
                    </div>
                    <span className="text-sm text-matrix-green/70 ml-7 capitalize">{ds.type}</span>
                    {/* Maybe show non-sensitive options like host/db from ds.options */}
                    {/* {ds.options?.host && <span className="text-xs text-gray-500 ml-2">({ds.options.host})</span>} */}
                  </div>
                  <div className="flex space-x-2 self-end md:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        /* TODO: Open edit modal */ alert(`Edit ${ds.name}`);
                      }}
                      className="border-matrix-green/50 hover:border-matrix-green hover:bg-matrix-green/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(ds.id, ds.name)}
                      disabled={deleteMutation.isPending && deleteMutation.variables === ds.id}
                      className="border-red-500/50 text-red-500 hover:border-red-500 hover:bg-red-500/10"
                    >
                      {deleteMutation.isPending && deleteMutation.variables === ds.id ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-matrix-green/70">
                No datasources configured yet.
              </div>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default DatasourceManager;
