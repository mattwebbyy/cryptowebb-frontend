// src/features/alerts/components/AlertForm.tsx
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Label, Select, Textarea } from '@/components/ui/Input';
import { Alert, AlertFormData } from '../types';
import { useCreateAlert, useUpdateAlert } from '../api/alertsApi';

interface AlertFormProps {
  alert?: Alert; // If provided, we're editing; otherwise creating
  onSuccess: () => void;
  onCancel: () => void;
}

const FieldError = ({ id, message }: { id: string; message?: string }) =>
  message ? (
    <p id={id} className="text-error text-sm mt-1" role="alert">
      {message}
    </p>
  ) : null;

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

    if (formData.notificationMethod === 'WEBHOOK' && !formData.webhookURL?.trim()) {
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
        webhookURL: formData.webhookURL?.trim() || undefined,
        message: formData.message?.trim() || undefined,
      };

      if (alert) {
        await updateAlertMutation.mutateAsync({
          alertId: alert.id,
          updates: alertData,
        });
      } else {
        await createAlertMutation.mutateAsync(alertData);
      }

      onSuccess();
    } catch (error) {
      console.error('Failed to save alert:', error);
    }
  };

  const handleInputChange = (field: keyof AlertFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const isLoading = createAlertMutation.isPending || updateAlertMutation.isPending;

  return (
    <Card className="p-6" hover={false}>
      <h3 className="text-lg font-semibold tracking-tight mb-6">
        {alert ? 'Edit alert' : 'Create alert'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Metric ID */}
        <div>
          <Label htmlFor="alert-metric-id">Metric ID</Label>
          <Input
            id="alert-metric-id"
            type="text"
            value={formData.metricID}
            onChange={(e) => handleInputChange('metricID', e.target.value)}
            placeholder="e.g., btc_price, eth_volume"
            disabled={!!alert} // Metric can't change when editing
            aria-invalid={!!errors.metricID}
            aria-describedby={errors.metricID ? 'alert-metric-id-error' : undefined}
          />
          <FieldError id="alert-metric-id-error" message={errors.metricID} />
        </div>

        {/* Condition and Threshold */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="alert-condition">Condition</Label>
            <Select
              id="alert-condition"
              value={formData.condition}
              onChange={(e) => handleInputChange('condition', e.target.value)}
            >
              <option value="ABOVE">Above (&gt;)</option>
              <option value="BELOW">Below (&lt;)</option>
              <option value="EQUALS">Equals (=)</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="alert-threshold">Threshold</Label>
            <Input
              id="alert-threshold"
              type="number"
              step="any"
              value={formData.threshold}
              onChange={(e) => handleInputChange('threshold', e.target.value)}
              placeholder="0.00"
              aria-invalid={!!errors.threshold}
              aria-describedby={errors.threshold ? 'alert-threshold-error' : undefined}
            />
            <FieldError id="alert-threshold-error" message={errors.threshold} />
          </div>
        </div>

        {/* Frequency */}
        <div>
          <Label htmlFor="alert-frequency">Frequency</Label>
          <Select
            id="alert-frequency"
            value={formData.frequency}
            onChange={(e) => handleInputChange('frequency', e.target.value)}
          >
            <option value="ONCE">Once</option>
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
          </Select>
        </div>

        {/* Notification Method */}
        <div>
          <Label htmlFor="alert-method">Notification method</Label>
          <Select
            id="alert-method"
            value={formData.notificationMethod}
            onChange={(e) => handleInputChange('notificationMethod', e.target.value)}
          >
            <option value="EMAIL">Email</option>
            <option value="SMS">SMS</option>
            <option value="PUSH">Push notification</option>
            <option value="WEBHOOK">Webhook</option>
          </Select>
        </div>

        {/* Webhook URL (conditional) */}
        {formData.notificationMethod === 'WEBHOOK' && (
          <div>
            <Label htmlFor="alert-webhook">Webhook URL</Label>
            <Input
              id="alert-webhook"
              type="url"
              value={formData.webhookURL}
              onChange={(e) => handleInputChange('webhookURL', e.target.value)}
              placeholder="https://your-webhook-endpoint.com/alerts"
              aria-invalid={!!errors.webhookURL}
              aria-describedby={errors.webhookURL ? 'alert-webhook-error' : undefined}
            />
            <FieldError id="alert-webhook-error" message={errors.webhookURL} />
          </div>
        )}

        {/* Custom Message */}
        <div>
          <Label htmlFor="alert-message">
            Custom message <span className="text-text-secondary font-normal">(optional)</span>
          </Label>
          <Textarea
            id="alert-message"
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            rows={3}
            placeholder="Custom message to include in the alert notification..."
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading
              ? alert
                ? 'Updating…'
                : 'Creating…'
              : alert
                ? 'Update alert'
                : 'Create alert'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AlertForm;
