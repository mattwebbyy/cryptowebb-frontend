// src/features/alerts/components/AlertsList.tsx
import React, { useState } from 'react';
import { Bell, Plus, Edit, Trash2, Power, TestTube } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { MatrixLoader } from '@/components/ui/MatrixLoader';
import { MetricsListSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { 
  useAlerts, 
  useToggleAlert, 
  useDeleteAlert, 
  useTestAlert 
} from '../api/alertsApi';
import { 
  Alert, 
  getAlertStatusColor, 
  getAlertStatusText, 
  formatAlertCondition, 
  formatFrequency, 
  formatNotificationMethod 
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
        // Show success message - could integrate with toast system
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
            <Bell className="h-5 w-5 text-matrix-green" />
            <h2 className="text-xl font-mono text-matrix-green">Alerts</h2>
          </div>
          <div className="w-24 h-8 bg-matrix-green/20 rounded animate-pulse" />
        </div>
        <MetricsListSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-red-500/50">
        <div className="text-center text-red-500">
          <h3 className="text-lg font-semibold mb-2">Error Loading Alerts</h3>
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
          <Bell className="h-5 w-5 text-matrix-green" />
          <h2 className="text-xl font-mono text-matrix-green">Alerts</h2>
          <span className="text-sm text-matrix-green/70">
            ({Array.isArray(alerts) ? alerts.length : 0} total)
          </span>
        </div>
        <Button
          onClick={onCreateAlert}
          className="bg-matrix-green text-black hover:bg-matrix-green/80"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
      </div>

      {/* Alerts List */}
      {!Array.isArray(alerts) || alerts.length === 0 ? (
        <Card className="p-8 text-center">
          <Bell className="h-12 w-12 text-matrix-green/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-matrix-green mb-2">
            No Alerts Configured
          </h3>
          <p className="text-matrix-green/70 mb-4">
            Create your first alert to get notified when metrics exceed your thresholds.
          </p>
          <Button
            onClick={onCreateAlert}
            className="bg-matrix-green text-black hover:bg-matrix-green/80"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {alerts.map((alert) => (
            <Card key={alert.id} className="p-4 border border-matrix-green/30">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          alert.isActive ? 'bg-matrix-green' : 'bg-gray-500'
                        }`}
                      />
                      <span className={`text-sm font-medium ${getAlertStatusColor(alert)}`}>
                        {getAlertStatusText(alert)}
                      </span>
                    </div>
                    <span className="text-xs text-matrix-green/60">
                      ID: {alert.metricID}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-matrix-green/70">Condition:</span>
                      <div className="text-matrix-green font-mono">
                        {formatAlertCondition(alert.condition, alert.threshold)}
                      </div>
                    </div>
                    <div>
                      <span className="text-matrix-green/70">Frequency:</span>
                      <div className="text-matrix-green">
                        {formatFrequency(alert.frequency)}
                      </div>
                    </div>
                    <div>
                      <span className="text-matrix-green/70">Method:</span>
                      <div className="text-matrix-green">
                        {formatNotificationMethod(alert.notificationMethod)}
                      </div>
                    </div>
                    <div>
                      <span className="text-matrix-green/70">Last Triggered:</span>
                      <div className="text-matrix-green text-xs">
                        {alert.lastTriggered 
                          ? new Date(alert.lastTriggered).toLocaleDateString()
                          : 'Never'
                        }
                      </div>
                    </div>
                  </div>

                  {alert.message && (
                    <div className="mt-3 p-2 bg-matrix-green/10 rounded border border-matrix-green/20">
                      <span className="text-xs text-matrix-green/70">Message:</span>
                      <div className="text-sm text-matrix-green">{alert.message}</div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTestAlert(alert.id)}
                    disabled={testingAlert === alert.id}
                    className="text-matrix-green hover:bg-matrix-green/10"
                    title="Test Alert"
                  >
                    {testingAlert === alert.id ? (
                      <div className="w-4 h-4 border border-matrix-green border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <TestTube className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleAlert(alert)}
                    disabled={toggleAlertMutation.isPending}
                    className={`${
                      alert.isActive 
                        ? 'text-matrix-green hover:bg-matrix-green/10' 
                        : 'text-gray-500 hover:bg-gray-500/10'
                    }`}
                    title={alert.isActive ? 'Disable Alert' : 'Enable Alert'}
                  >
                    <Power className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditAlert(alert)}
                    className="text-matrix-green hover:bg-matrix-green/10"
                    title="Edit Alert"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAlert(alert.id)}
                    disabled={deleteAlertMutation.isPending}
                    className="text-red-400 hover:bg-red-400/10"
                    title="Delete Alert"
                  >
                    <Trash2 className="h-4 w-4" />
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