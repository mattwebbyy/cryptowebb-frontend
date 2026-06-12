// src/pages/analytics/AlertsPage.tsx
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import AlertsList from '@/features/alerts/components/AlertsList';
import AlertForm from '@/features/alerts/components/AlertForm';
import { Alert } from '@/features/alerts/types';

type ViewMode = 'list' | 'create' | 'edit';

const AlertsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);

  const handleCreateAlert = () => {
    setEditingAlert(null);
    setViewMode('create');
  };

  const handleEditAlert = (alert: Alert) => {
    setEditingAlert(alert);
    setViewMode('edit');
  };

  const handleFormSuccess = () => {
    setViewMode('list');
    setEditingAlert(null);
  };

  const handleFormCancel = () => {
    setViewMode('list');
    setEditingAlert(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-border flex-shrink-0">
        {viewMode !== 'list' && (
          <Button variant="ghost" onClick={() => setViewMode('list')}>
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Back to alerts
          </Button>
        )}

        <h1 className="text-xl font-semibold tracking-tight">
          {viewMode === 'list' && 'Alerts'}
          {viewMode === 'create' && 'Create alert'}
          {viewMode === 'edit' && 'Edit alert'}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {viewMode === 'list' && (
          <AlertsList
            onCreateAlert={handleCreateAlert}
            onEditAlert={handleEditAlert}
          />
        )}

        {(viewMode === 'create' || viewMode === 'edit') && (
          <div className="max-w-2xl mx-auto">
            <AlertForm
              alert={editingAlert || undefined}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;