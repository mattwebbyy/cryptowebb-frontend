// src/features/alerts/types.ts
export type AlertCondition = 'ABOVE' | 'BELOW' | 'EQUALS';
export type AlertFrequency = 'ONCE' | 'DAILY' | 'WEEKLY';
export type NotificationMethod = 'EMAIL' | 'SMS' | 'PUSH' | 'WEBHOOK';

export interface Alert {
  id: string;
  userID: string;
  metricID: string;
  condition: AlertCondition;
  threshold: number;
  frequency: AlertFrequency;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastTriggered?: string;
  notificationMethod: NotificationMethod;
  webhookURL?: string;
  message?: string;
}

export interface CreateAlertRequest {
  metricID: string;
  condition: AlertCondition;
  threshold: number;
  frequency: AlertFrequency;
  notificationMethod: NotificationMethod;
  webhookURL?: string;
  message?: string;
}

export interface UpdateAlertRequest {
  condition?: AlertCondition;
  threshold?: number;
  frequency?: AlertFrequency;
  isActive?: boolean;
  notificationMethod?: NotificationMethod;
  webhookURL?: string;
  message?: string;
}

export interface AlertFormData {
  metricID: string;
  condition: AlertCondition;
  threshold: string; // Form input as string, converted to number
  frequency: AlertFrequency;
  notificationMethod: NotificationMethod;
  webhookURL?: string;
  message?: string;
}

// Alert status display helpers
export const getAlertStatusColor = (alert: Alert): string => {
  if (!alert.isActive) return 'text-gray-500';
  if (alert.lastTriggered) return 'text-red-400';
  return 'text-matrix-green';
};

export const getAlertStatusText = (alert: Alert): string => {
  if (!alert.isActive) return 'Inactive';
  if (alert.lastTriggered) return 'Triggered';
  return 'Active';
};

export const formatAlertCondition = (condition: AlertCondition, threshold: number): string => {
  switch (condition) {
    case 'ABOVE':
      return `> ${threshold}`;
    case 'BELOW':
      return `< ${threshold}`;
    case 'EQUALS':
      return `= ${threshold}`;
    default:
      return `${condition} ${threshold}`;
  }
};

export const formatFrequency = (frequency: AlertFrequency): string => {
  switch (frequency) {
    case 'ONCE':
      return 'Once';
    case 'DAILY':
      return 'Daily';
    case 'WEEKLY':
      return 'Weekly';
    default:
      return frequency;
  }
};

export const formatNotificationMethod = (method: NotificationMethod): string => {
  switch (method) {
    case 'EMAIL':
      return 'Email';
    case 'SMS':
      return 'SMS';
    case 'PUSH':
      return 'Push Notification';
    case 'WEBHOOK':
      return 'Webhook';
    default:
      return method;
  }
};