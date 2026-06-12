// src/pages/analytics/DatasourceManager.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Database, Edit, Trash2 } from 'lucide-react';
import {
  useDatasources,
  useDeleteDatasource,
  useCreateDatasource,
} from '@/features/dashboards/api/useDatasources';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Dialog, FormInput, FormSelect, DialogFooter } from '@/components/ui/Dialog';
import { toast } from 'sonner';

interface DatasourceFormData {
  name: string;
  type: string;
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
}

const DATASOURCE_TYPES = [
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'clickhouse', label: 'ClickHouse' },
  { value: 'timescaledb', label: 'TimescaleDB' },
  { value: 'influxdb', label: 'InfluxDB' },
  { value: 'api', label: 'REST API' },
];

const DatasourceManager = () => {
  const { data: datasources, isLoading, error } = useDatasources();
  const deleteMutation = useDeleteDatasource();
  const createMutation = useCreateDatasource();

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingDatasource, setEditingDatasource] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState<DatasourceFormData>({
    name: '',
    type: 'postgresql',
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'postgresql',
      host: '',
      port: '',
      database: '',
      username: '',
      password: '',
    });
  };

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

  const handleCreate = () => {
    if (!formData.name.trim()) {
      toast.error('Datasource name is required');
      return;
    }

    createMutation.mutate(
      {
        name: formData.name,
        type: formData.type as 'file' | 'api' | 'database' | 'realtime',
        config: {
          database: {
            host: formData.host,
            port: Number(formData.port) || 5432,
            database: formData.database,
            username: formData.username,
            password: formData.password,
          },
        },
      },
      {
        onSuccess: () => {
          toast.success(`Datasource "${formData.name}" created!`);
          setIsCreateOpen(false);
          resetForm();
        },
        onError: (err) => {
          toast.error(`Failed to create datasource: ${err.message}`);
        },
      }
    );
  };

  const handleOpenEdit = (id: string, name: string) => {
    setEditingDatasource({ id, name });
    setFormData((prev) => ({ ...prev, name }));
    setIsEditOpen(true);
  };

  const handleEdit = () => {
    if (!editingDatasource) return;
    // For now, just show a toast since the update mutation isn't implemented
    toast.info(`Editing datasource: ${editingDatasource.name} (coming soon)`);
    setIsEditOpen(false);
    setEditingDatasource(null);
    resetForm();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Datasources</h1>
        <Button
          variant="primary" onClick={() => setIsCreateOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> New datasource
        </Button>
      </div>

      <Card className="bg-surface border border-border p-4 md:p-6">
        {isLoading && (
          <div className="text-center py-6 text-text-secondary">Loading datasources...</div>
        )}
        {error && (
          <div className="text-center py-6 text-error">
            Error loading datasources: {error.message}
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-4">
            {datasources && datasources.length > 0 ? (
              datasources.map((ds) => (
                <div
                  key={ds.id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-surface-2 border border-border rounded-lg hover:border-primary/30 transition-colors"
                >
                  <div className="mb-2 md:mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Database className="w-5 h-5 text-primary" />
                      <span className="text-base font-semibold">{ds.name}</span>
                    </div>
                    <span className="text-sm text-text-secondary ml-7 capitalize">{ds.type}</span>
                  </div>
                  <div className="flex space-x-2 self-end md:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(ds.id, ds.name)}
                      
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(ds.id, ds.name)}
                      disabled={deleteMutation.isPending && deleteMutation.variables === ds.id}
                      className="border-error/40 text-error hover:border-error hover:bg-error/10"
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
              <div className="text-center py-10 text-text-secondary">
                No datasources configured yet.
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Create Datasource Modal */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          resetForm();
        }}
        title="Create New Datasource"
      >
        <FormInput
          label="Datasource Name"
          placeholder="Enter datasource name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          autoFocus
        />
        <FormSelect
          label="Type"
          value={formData.type}
          onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
          options={DATASOURCE_TYPES}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Host"
            placeholder="localhost"
            value={formData.host}
            onChange={(e) => setFormData((prev) => ({ ...prev, host: e.target.value }))}
          />
          <FormInput
            label="Port"
            placeholder="5432"
            value={formData.port}
            onChange={(e) => setFormData((prev) => ({ ...prev, port: e.target.value }))}
          />
        </div>
        <FormInput
          label="Database"
          placeholder="Enter database name"
          value={formData.database}
          onChange={(e) => setFormData((prev) => ({ ...prev, database: e.target.value }))}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Username"
            placeholder="Enter username"
            value={formData.username}
            onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
          />
          <FormInput
            label="Password"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsCreateOpen(false);
              resetForm();
            }}
            
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={createMutation.isPending}
            variant="primary"
          >
            {createMutation.isPending ? 'Creating...' : 'Create Datasource'}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit Datasource Modal */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingDatasource(null);
          resetForm();
        }}
        title="Edit Datasource"
      >
        <FormInput
          label="Datasource Name"
          placeholder="Enter datasource name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          autoFocus
        />
        <FormSelect
          label="Type"
          value={formData.type}
          onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
          options={DATASOURCE_TYPES}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Host"
            placeholder="localhost"
            value={formData.host}
            onChange={(e) => setFormData((prev) => ({ ...prev, host: e.target.value }))}
          />
          <FormInput
            label="Port"
            placeholder="5432"
            value={formData.port}
            onChange={(e) => setFormData((prev) => ({ ...prev, port: e.target.value }))}
          />
        </div>
        <FormInput
          label="Database"
          placeholder="Enter database name"
          value={formData.database}
          onChange={(e) => setFormData((prev) => ({ ...prev, database: e.target.value }))}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Username"
            placeholder="Enter username"
            value={formData.username}
            onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
          />
          <FormInput
            label="Password"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsEditOpen(false);
              setEditingDatasource(null);
              resetForm();
            }}
            
          >
            Cancel
          </Button>
          <Button onClick={handleEdit} variant="primary">
            Save Changes
          </Button>
        </DialogFooter>
      </Dialog>
    </motion.div>
  );
};

export default DatasourceManager;
