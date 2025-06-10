// src/features/alerts/components/AlertForm.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Alert, 
  AlertFormData, 
  AlertCondition, 
  AlertFrequency, 
  NotificationMethod 
} from '../types';
import { useCreateAlert, useUpdateAlert } from '../api/alertsApi';

interface AlertFormProps {
  alert?: Alert; // If provided, we're editing; otherwise creating
  onSuccess: () => void;
  onCancel: () => void;
}

const AlertForm: React.FC<AlertFormProps> = ({ alert, onSuccess, onCancel }) => {
  const createAlertMutation = useCreateAlert();
  const updateAlertMutation = useUpdateAlert();

  const [formData, setFormData] = useState<AlertFormData>({
    metricID: alert?.metricID || '',
    condition: alert?.condition || 'ABOVE',
    threshold: alert?.threshold?.toString() || '',
    frequency: alert?.frequency || 'ONCE',
    notificationMethod: alert?.notificationMethod || 'EMAIL',
    webhookURL: alert?.webhookURL || '',
    message: alert?.message || '',
  });

  const [errors, setErrors] = useState<Partial<AlertFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<AlertFormData> = {};

    if (!formData.metricID.trim()) {
      newErrors.metricID = 'Metric ID is required';
    }

    if (!formData.threshold.trim()) {
      newErrors.threshold = 'Threshold is required';
    } else if (isNaN(Number(formData.threshold))) {
      newErrors.threshold = 'Threshold must be a valid number';
    }

    if (formData.notificationMethod === 'WEBHOOK' && !formData.webhookURL.trim()) {
      newErrors.webhookURL = 'Webhook URL is required for webhook notifications';
    }

    if (formData.webhookURL && formData.notificationMethod === 'WEBHOOK') {
      try {
        new URL(formData.webhookURL);
      } catch {
        newErrors.webhookURL = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const alertData = {
        metricID: formData.metricID.trim(),
        condition: formData.condition,
        threshold: Number(formData.threshold),
        frequency: formData.frequency,
        notificationMethod: formData.notificationMethod,
        webhookURL: formData.webhookURL.trim() || undefined,
        message: formData.message.trim() || undefined,
      };

      if (alert) {
        // Update existing alert
        await updateAlertMutation.mutateAsync({
          alertId: alert.id,
          updates: alertData,
        });
      } else {
        // Create new alert
        await createAlertMutation.mutateAsync(alertData);
      }

      onSuccess();
    } catch (error) {
      console.error('Failed to save alert:', error);
    }
  };

  const handleInputChange = (
    field: keyof AlertFormData,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isLoading = createAlertMutation.isPending || updateAlertMutation.isPending;

  return (
    <Card className="p-6 border border-matrix-green/30">
      <h3 className="text-lg font-mono text-matrix-green mb-6">
        {alert ? 'Edit Alert' : 'Create New Alert'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Metric ID */}
        <div>
          <label className="block text-sm font-medium text-matrix-green mb-2">
            Metric ID *
          </label>
          <input
            type="text"
            value={formData.metricID}
            onChange={(e) => handleInputChange('metricID', e.target.value)}
            className="w-full px-3 py-2 bg-black/50 border border-matrix-green/50 rounded text-matrix-green placeholder-matrix-green/50 focus:outline-none focus:border-matrix-green"
            placeholder="e.g., btc_price, eth_volume"
            disabled={!!alert} // Don't allow changing metric ID when editing
          />
          {errors.metricID && (
            <p className="text-red-400 text-sm mt-1">{errors.metricID}</p>
          )}
        </div>

        {/* Condition and Threshold */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-matrix-green mb-2">
              Condition *
            </label>
            <select
              value={formData.condition}
              onChange={(e) => handleInputChange('condition', e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-matrix-green/50 rounded text-matrix-green focus:outline-none focus:border-matrix-green"
            >
              <option value="ABOVE">Above (&gt;)</option>
              <option value="BELOW">Below (&lt;)</option>
              <option value="EQUALS">Equals (=)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-matrix-green mb-2">
              Threshold *
            </label>
            <input
              type="number"
              step="any"
              value={formData.threshold}
              onChange={(e) => handleInputChange('threshold', e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-matrix-green/50 rounded text-matrix-green placeholder-matrix-green/50 focus:outline-none focus:border-matrix-green"
              placeholder="0.00"
            />
            {errors.threshold && (
              <p className="text-red-400 text-sm mt-1">{errors.threshold}</p>
            )}
          </div>
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm font-medium text-matrix-green mb-2">
            Frequency *
          </label>
          <select
            value={formData.frequency}
            onChange={(e) => handleInputChange('frequency', e.target.value)}
            className="w-full px-3 py-2 bg-black/50 border border-matrix-green/50 rounded text-matrix-green focus:outline-none focus:border-matrix-green"
          >
            <option value="ONCE">Once</option>
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
          </select>
        </div>

        {/* Notification Method */}
        <div>
          <label className="block text-sm font-medium text-matrix-green mb-2">
            Notification Method *
          </label>
          <select
            value={formData.notificationMethod}
            onChange={(e) => handleInputChange('notificationMethod', e.target.value)}
            className="w-full px-3 py-2 bg-black/50 border border-matrix-green/50 rounded text-matrix-green focus:outline-none focus:border-matrix-green"
          >
            <option value="EMAIL">Email</option>
            <option value="SMS">SMS</option>
            <option value="PUSH">Push Notification</option>
            <option value="WEBHOOK">Webhook</option>
          </select>
        </div>

        {/* Webhook URL (conditional) */}
        {formData.notificationMethod === 'WEBHOOK' && (
          <div>
            <label className="block text-sm font-medium text-matrix-green mb-2">
              Webhook URL *
            </label>
            <input
              type="url"
              value={formData.webhookURL}
              onChange={(e) => handleInputChange('webhookURL', e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-matrix-green/50 rounded text-matrix-green placeholder-matrix-green/50 focus:outline-none focus:border-matrix-green"
              placeholder="https://your-webhook-endpoint.com/alerts"
            />
            {errors.webhookURL && (
              <p className="text-red-400 text-sm mt-1">{errors.webhookURL}</p>
            )}
          </div>
        )}

        {/* Custom Message */}
        <div>
          <label className="block text-sm font-medium text-matrix-green mb-2">
            Custom Message (Optional)
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-black/50 border border-matrix-green/50 rounded text-matrix-green placeholder-matrix-green/50 focus:outline-none focus:border-matrix-green resize-vertical"
            placeholder="Custom message to include in the alert notification..."
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
            className="text-matrix-green hover:bg-matrix-green/10"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-matrix-green text-black hover:bg-matrix-green/80"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-black border-t-transparent rounded-full animate-spin" />
                {alert ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              alert ? 'Update Alert' : 'Create Alert'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AlertForm;