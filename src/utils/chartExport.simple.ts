// src/utils/chartExport.simple.ts
// Simplified chart export utility without Highcharts modules dependency

export interface ExportOptions {
  filename?: string;
  format?: 'png' | 'jpeg' | 'pdf' | 'svg';
  width?: number;
  height?: number;
  scale?: number;
  backgroundColor?: string;
  theme?: 'matrix' | 'light';
}

// Export format type alias
export type ExportFormat = 'png' | 'jpeg' | 'pdf' | 'svg' | 'csv';

// Export formats configuration
export const EXPORT_FORMATS: Array<{
  value: ExportFormat;
  label: string;
  description: string;
}> = [
  {
    value: 'png',
    label: 'PNG Image',
    description: 'High-quality raster image format'
  },
  {
    value: 'jpeg',
    label: 'JPEG Image', 
    description: 'Compressed raster image format'
  },
  {
    value: 'pdf',
    label: 'PDF Document',
    description: 'Portable document format'
  },
  {
    value: 'svg',
    label: 'SVG Vector',
    description: 'Scalable vector graphics'
  },
  {
    value: 'csv',
    label: 'CSV Data',
    description: 'Comma-separated values data file'
  }
];

export class ChartExporter {
  // For now, provide a simple fallback that doesn't break the app
  static async exportChart(chart: any, options: ExportOptions = {}): Promise<void> {
    console.warn('Chart export temporarily disabled. Highcharts exporting modules need to be properly configured.');
    
    // Fallback: try to use browser's built-in functionality if available
    try {
      if (chart && chart.exportChart) {
        chart.exportChart({
          type: options.format || 'png',
          filename: options.filename || 'chart-export',
        });
      } else {
        // If all else fails, show a helpful message
        alert('Chart export is temporarily unavailable. Please take a screenshot as an alternative.');
      }
    } catch (error) {
      console.error('Chart export failed:', error);
      alert('Chart export failed. Please try again or take a screenshot.');
    }
  }

  static async exportToPNG(chart: any, options: Omit<ExportOptions, 'format'> = {}): Promise<void> {
    return this.exportChart(chart, { ...options, format: 'png' });
  }

  static async exportToPDF(chart: any, options: Omit<ExportOptions, 'format'> = {}): Promise<void> {
    return this.exportChart(chart, { ...options, format: 'pdf' });
  }

  static async exportToSVG(chart: any, options: Omit<ExportOptions, 'format'> = {}): Promise<void> {
    return this.exportChart(chart, { ...options, format: 'svg' });
  }

  static async exportToCSV(data: any[], filename: string = 'chart-data'): Promise<void> {
    try {
      if (!data || data.length === 0) {
        throw new Error('No data to export');
      }

      // Convert data to CSV format
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            // Handle values that might contain commas or quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      // Create and download the file
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
      alert('CSV export failed. Please try again.');
    }
  }

  // Matrix-themed export options
  static getMatrixTheme(): Partial<ExportOptions> {
    return {
      backgroundColor: '#000000',
      theme: 'matrix',
    };
  }

  static getLightTheme(): Partial<ExportOptions> {
    return {
      backgroundColor: '#ffffff',
      theme: 'light',
    };
  }
}

// Utility function to format chart titles for export
export function formatChartTitleForExport(title: string, metricName?: string): string {
  const timestamp = new Date().toLocaleDateString();
  
  if (metricName) {
    return `${title} - ${metricName} (${timestamp})`;
  }
  
  return `${title} (${timestamp})`;
}

// Additional utility functions that might be needed
export function sanitizeFilename(filename: string): string {
  // Remove or replace characters that are invalid in filenames
  return filename
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/\s+/g, '_')
    .toLowerCase();
}

export function generateExportFilename(prefix: string, metricName?: string, format: string = 'png'): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const base = metricName ? `${prefix}_${metricName}` : prefix;
  return sanitizeFilename(`${base}_${timestamp}.${format}`);
}

export default ChartExporter;