// src/features/alerts/components/AlertsList.tsx
import React, { useState } from 'react';
import { Bell, Plus, Edit, Trash2, Power, TestTube } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { MetricsListSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { useAlerts, useToggleAlert, useDeleteAlert, useTestAlert } from '../api/alertsApi';
import {
  Alert,
  getAlertStatusColor,
  getAlertStatusText,
  formatAlertCondition,
  formatFrequency,
  formatNotificationMethod,
} from '../types';

interface AlertsListProps {
  onCreateAlert: () => void;
  onEditAlert: (alert: Alert) => void;
}

const AlertsList: React.FC<AlertsListProps> = ({ onCreateAlert, onEditAlert }) => {
  const { data: alerts, isLoading, error } = useAlerts();
  const toggleAlertMutation = useToggleAlert();
  const deleteAlertMutation = useDeleteAlert();
  const testAlertMutation = useTestAlert();

  const [testingAlert, setTestingAlert] = useState<string | null>(null);

  const handleToggleAlert = async (alert: Alert) => {
    try {
      await toggleAlertMutation.mutateAsync({
        alertId: alert.id,
        isActive: !alert.isActive,
      });
    } catch (error) {
      console.error('Failed to toggle alert:', error);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        await deleteAlertMutation.mutateAsync(alertId);
      } catch (error) {
        console.error('Failed to delete alert:', error);
      }
    }
  };

  const handleTestAlert = async (alertId: string) => {
    setTestingAlert(alertId);
    try {
      const result = await testAlertMutation.mutateAsync(alertId);
      if (result.success) {
        console.log('Alert test successful:', result.message);
      }
    } catch (error) {
      console.error('Failed to test alert:', error);
    } finally {
      setTestingAlert(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-xl font-semibold tracking-tight">Alerts</h2>
          </div>
          <div className="w-24 h-8 bg-surface-2 rounded animate-pulse" />
        </div>
        <MetricsListSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-error/50" hover={false}>
        <div className="text-center text-error">
          <h3 className="text-lg font-semibold mb-2">Error loading alerts</h3>
          <p className="text-sm">{error.message}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-xl font-semibold tracking-tight">Alerts</h2>
          <span className="text-sm text-text-secondary">
            ({Array.isArray(alerts) ? alerts.length : 0} total)
          </span>
        </div>
        <Button onClick={onCreateAlert} variant="primary" size="sm">
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Create alert
        </Button>
      </div>

      {/* Alerts List */}
      {!Array.isArray(alerts) || alerts.length === 0 ? (
        <Card className="p-8 text-center" hover={false}>
          <Bell className="h-12 w-12 text-text-secondary/50 mx-auto mb-4" aria-hidden="true" />
          <h3 className="text-lg font-semibold mb-2">No alerts configured</h3>
          <p className="text-text-secondary mb-4">
            Create your first alert to get notified when metrics exceed your thresholds.
          </p>
          <Button onClick={onCreateAlert} variant="primary">
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Create alert
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {alerts.map((alert) => (
            <Card key={alert.id} className="p-4" hover={false}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          alert.isActive ? 'bg-success' : 'bg-text-secondary/40'
                        }`}
                        aria-hidden="true"
                      />
                      <span className={`text-sm font-medium ${getAlertStatusColor(alert)}`}>
                        {getAlertStatusText(alert)}
                      </span>
                    </div>
                    <span className="text-xs text-text-secondary font-mono">{alert.metricID}</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-text-secondary">Condition</span>
                      <div className="font-mono tabular-nums">
                        {formatAlertCondition(alert.condition, alert.threshold)}
                      </div>
                    </div>
                    <div>
                      <span className="text-text-secondary">Frequency</span>
                      <div>{formatFrequency(alert.frequency)}</div>
                    </div>
                    <div>
                      <span className="text-text-secondary">Method</span>
                      <div>{formatNotificationMethod(alert.notificationMethod)}</div>
                    </div>
                    <div>
                      <span className="text-text-secondary">Last triggered</span>
                      <div className="text-xs pt-0.5">
                        {alert.lastTriggered
                          ? new Date(alert.lastTriggered).toLocaleDateString()
                          : 'Never'}
                      </div>
                    </div>
                  </div>

                  {alert.message && (
                    <div className="mt-3 p-2 bg-surface-2 rounded-lg border border-border">
                      <span className="text-xs text-text-secondary">Message</span>
                      <div className="text-sm">{alert.message}</div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTestAlert(alert.id)}
                    disabled={testingAlert === alert.id}
                    title="Test alert"
                    aria-label="Test alert"
                  >
                    {testingAlert === alert.id ? (
                      <div
                        className="w-4 h-4 border border-primary border-t-transparent rounded-full animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <TestTube className="h-4 w-4" aria-hidden="true" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleAlert(alert)}
                    disabled={toggleAlertMutation.isPending}
                    className={alert.isActive ? '' : 'text-text-secondary'}
                    title={alert.isActive ? 'Disable alert' : 'Enable alert'}
                    aria-label={alert.isActive ? 'Disable alert' : 'Enable alert'}
                  >
                    <Power className="h-4 w-4" aria-hidden="true" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditAlert(alert)}
                    title="Edit alert"
                    aria-label="Edit alert"
                  >
                    <Edit className="h-4 w-4" aria-hidden="true" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAlert(alert.id)}
                    disabled={deleteAlertMutation.isPending}
                    className="text-error hover:bg-error/10"
                    title="Delete alert"
                    aria-label="Delete alert"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsList;
