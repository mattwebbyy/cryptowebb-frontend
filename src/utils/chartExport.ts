// src/utils/chartExport.ts
// CSV download + filename helpers for chart exports. Image (PNG) export is
// handled by ECharts directly via chart.getDataURL in ChartContainer.

import { toast } from 'sonner';

export type ExportFormat = 'png' | 'jpeg' | 'pdf' | 'svg' | 'csv';

export function exportToCSV(data: Record<string, unknown>[], filename = 'chart-data'): void {
  try {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('CSV export failed:', error);
    toast.error('CSV export failed. Please try again.');
  }
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/\s+/g, '_')
    .toLowerCase();
}

export function generateExportFilename(
  prefix: string,
  metricName?: string,
  format = 'png'
): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const base = metricName ? `${prefix}_${metricName}` : prefix;
  return sanitizeFilename(`${base}_${timestamp}.${format}`);
}
