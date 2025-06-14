// src/components/ui/ExportButton.tsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { GlitchButton } from '@/components/ui/GlitchEffects';
import { 
  Download,
  FileText,
  Image,
  FileSpreadsheet,
  Code,
  Settings,
  AlertTriangle,
  CheckCircle,
  Loader,
  X,
  Info
} from 'lucide-react';
import { 
  DashboardExporter, 
  ExportOptions, 
  DashboardExportData,
  exportDashboard,
  exportDashboardData
} from '@/utils/dashboardExport';

// Types
export interface ExportButtonProps {
  dashboardId: string;
  dashboardTitle: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'dropdown' | 'modal';
  userPlan?: string;
  allowedFormats?: ExportFormat[];
  onExportStart?: (format: ExportFormat) => void;
  onExportComplete?: (format: ExportFormat, success: boolean) => void;
}

export type ExportFormat = 'pdf' | 'png' | 'jpeg' | 'csv' | 'json';

export interface ExportProgress {
  isExporting: boolean;
  format?: ExportFormat;
  progress?: number;
  status?: string;
  error?: string;
}

// Export Button Component
export const ExportButton: React.FC<ExportButtonProps> = ({
  dashboardId,
  dashboardTitle,
  className = '',
  size = 'md',
  variant = 'dropdown',
  userPlan = 'free',
  allowedFormats,
  onExportStart,
  onExportComplete
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress>({ isExporting: false });
  const [exportOptions, setExportOptions] = useState<Partial<ExportOptions>>({
    quality: DashboardExporter.getExportQuality(userPlan),
    includeMetadata: true
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Available export formats with metadata
  const exportFormats = [
    {
      format: 'pdf' as ExportFormat,
      label: 'PDF Document',
      description: 'High-quality PDF with multiple pages',
      icon: FileText,
      color: 'text-red-600',
      minPlan: 'free'
    },
    {
      format: 'png' as ExportFormat,
      label: 'PNG Image',
      description: 'High-resolution PNG image',
      icon: Image,
      color: 'text-blue-600',
      minPlan: 'free'
    },
    {
      format: 'jpeg' as ExportFormat,
      label: 'JPEG Image',
      description: 'Compressed JPEG image',
      icon: Image,
      color: 'text-green-600',
      minPlan: 'basic'
    },
    {
      format: 'csv' as ExportFormat,
      label: 'CSV Data',
      description: 'Raw data in CSV format',
      icon: FileSpreadsheet,
      color: 'text-emerald-600',
      minPlan: 'basic'
    },
    {
      format: 'json' as ExportFormat,
      label: 'JSON Data',
      description: 'Structured data in JSON format',
      icon: Code,
      color: 'text-purple-600',
      minPlan: 'pro'
    }
  ];

  // Filter formats based on user plan and allowed formats
  const availableFormats = exportFormats.filter(format => {
    if (allowedFormats && !allowedFormats.includes(format.format)) return false;
    return getPlanLevel(userPlan) >= getPlanLevel(format.minPlan);
  });

  const handleExport = async (format: ExportFormat, customOptions?: Partial<ExportOptions>) => {
    try {
      setExportProgress({ isExporting: true, format, status: 'Preparing export...' });
      onExportStart?.(format);

      const options = { ...exportOptions, ...customOptions };
      const filename = DashboardExporter.generateExportFilename(dashboardTitle, format);

      if (['pdf', 'png', 'jpeg'].includes(format)) {
        // Visual export
        setExportProgress(prev => ({ ...prev, status: 'Capturing dashboard...' }));
        
        const dashboardElement = document.getElementById(dashboardId);
        if (!dashboardElement) {
          throw new Error('Dashboard element not found');
        }

        // Estimate file size
        if (format !== 'csv' && format !== 'json') {
          const sizeEstimate = DashboardExporter.estimateExportSize(
            dashboardElement, 
            format as 'pdf' | 'png' | 'jpeg', 
            options.quality || 0.8
          );
          
          if (sizeEstimate.warning) {
            setExportProgress(prev => ({ ...prev, status: sizeEstimate.warning }));
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        setExportProgress(prev => ({ ...prev, status: 'Generating file...' }));
        
        await exportDashboard(dashboardId, format, {
          ...options,
          filename
        });
      } else {
        // Data export
        setExportProgress(prev => ({ ...prev, status: 'Collecting data...' }));
        
        const dashboardData = await fetchDashboardData(dashboardId);
        
        setExportProgress(prev => ({ ...prev, status: 'Generating file...' }));
        
        await exportDashboardData(dashboardData, format, filename);
      }

      setExportProgress({ isExporting: false });
      onExportComplete?.(format, true);
      setShowDropdown(false);
      setShowModal(false);
    } catch (error) {
      console.error('Export failed:', error);
      setExportProgress({ 
        isExporting: false, 
        error: error instanceof Error ? error.message : 'Export failed' 
      });
      onExportComplete?.(format, false);
    }
  };

  const fetchDashboardData = async (dashboardId: string): Promise<DashboardExportData> => {
    // This would typically fetch from your API
    // For now, return mock data structure
    return {
      title: dashboardTitle,
      description: 'Exported dashboard data',
      exportedAt: new Date().toISOString(),
      widgets: [], // Would be populated from actual dashboard data
      metadata: {
        totalViews: 0,
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      }
    };
  };

  const getPlanLevel = (plan: string): number => {
    const levels = { free: 0, basic: 1, pro: 2, enterprise: 3 };
    return levels[plan as keyof typeof levels] || 0;
  };

  const renderButton = () => {
    const buttonSizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    if (variant === 'button') {
      return (
        <GlitchButton
          onClick={() => handleExport('pdf')}
          disabled={exportProgress.isExporting}
          className={`gap-2 ${buttonSizes[size]} ${className}`}
        >
          {exportProgress.isExporting ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Export
            </>
          )}
        </GlitchButton>
      );
    }

    return (
      <div className="relative" ref={dropdownRef}>
        <GlitchButton
          onClick={() => variant === 'modal' ? setShowModal(true) : setShowDropdown(!showDropdown)}
          disabled={exportProgress.isExporting}
          className={`gap-2 ${buttonSizes[size]} ${className}`}
        >
          {exportProgress.isExporting ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              {exportProgress.status || 'Exporting...'}
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Export
            </>
          )}
        </GlitchButton>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {showDropdown && !exportProgress.isExporting && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-64 z-50"
            >
              <Card className="p-2 bg-white/95 dark:bg-black/95 border-teal-600 dark:border-matrix-green shadow-lg">
                <div className="space-y-1">
                  {availableFormats.map((formatInfo) => (
                    <button
                      key={formatInfo.format}
                      onClick={() => handleExport(formatInfo.format)}
                      className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                    >
                      <formatInfo.icon className={`w-5 h-5 ${formatInfo.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 dark:text-gray-200">
                          {formatInfo.label}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {formatInfo.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                  <button
                    onClick={() => {
                      setShowModal(true);
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm text-gray-600 dark:text-gray-400"
                  >
                    <Settings className="w-4 h-4" />
                    Advanced Options
                  </button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {renderButton()}

      {/* Export Progress */}
      <AnimatePresence>
        {exportProgress.isExporting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <Card className="p-6 bg-white/95 dark:bg-black/95 border-teal-600 dark:border-matrix-green max-w-sm w-full mx-4">
              <div className="text-center">
                <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-teal-600 dark:text-matrix-green" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Exporting {exportProgress.format?.toUpperCase()}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {exportProgress.status}
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Error */}
      <AnimatePresence>
        {exportProgress.error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <Card className="p-6 bg-white/95 dark:bg-black/95 border-red-500 max-w-sm w-full mx-4">
              <div className="text-center">
                <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-red-500" />
                <h3 className="text-lg font-semibold text-red-600 mb-2">
                  Export Failed
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {exportProgress.error}
                </p>
                <Button
                  onClick={() => setExportProgress({ isExporting: false })}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Options Modal */}
      <AnimatePresence>
        {showModal && (
          <ExportOptionsModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            availableFormats={availableFormats}
            exportOptions={exportOptions}
            onExportOptionsChange={setExportOptions}
            onExport={handleExport}
            userPlan={userPlan}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// Export Options Modal
const ExportOptionsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  availableFormats: any[];
  exportOptions: Partial<ExportOptions>;
  onExportOptionsChange: (options: Partial<ExportOptions>) => void;
  onExport: (format: ExportFormat, options?: Partial<ExportOptions>) => void;
  userPlan: string;
}> = ({ 
  isOpen, 
  onClose, 
  availableFormats, 
  exportOptions, 
  onExportOptionsChange, 
  onExport,
  userPlan 
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [localOptions, setLocalOptions] = useState(exportOptions);

  if (!isOpen) return null;

  const updateOption = (key: keyof ExportOptions, value: any) => {
    const newOptions = { ...localOptions, [key]: value };
    setLocalOptions(newOptions);
    onExportOptionsChange(newOptions);
  };

  const handleExport = () => {
    onExport(selectedFormat, localOptions);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md"
      >
        <Card className="p-6 bg-white/95 dark:bg-black/95 border-teal-600 dark:border-matrix-green">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-teal-600 dark:text-matrix-green">
              Export Options
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
                Export Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableFormats.map((format) => (
                  <button
                    key={format.format}
                    onClick={() => setSelectedFormat(format.format)}
                    className={`flex items-center gap-2 p-3 rounded-md border-2 transition-colors ${
                      selectedFormat === format.format
                        ? 'border-teal-600 dark:border-matrix-green bg-teal-50 dark:bg-teal-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <format.icon className={`w-4 h-4 ${format.color}`} />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {format.format.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Settings (for image formats) */}
            {['pdf', 'png', 'jpeg'].includes(selectedFormat) && (
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Quality: {Math.round((localOptions.quality || 0.8) * 100)}%
                </label>
                <input
                  type="range"
                  min="0.3"
                  max="1.0"
                  step="0.1"
                  value={localOptions.quality || 0.8}
                  onChange={(e) => updateOption('quality', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <span>Smaller file</span>
                  <span>Better quality</span>
                </div>
              </div>
            )}

            {/* Metadata Option */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Include Metadata
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Add export date and dashboard info
                </p>
              </div>
              <button
                onClick={() => updateOption('includeMetadata', !localOptions.includeMetadata)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  localOptions.includeMetadata ? 'bg-teal-600 dark:bg-matrix-green' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    localOptions.includeMetadata ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Plan-specific notice */}
            {userPlan === 'free' && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Free Plan</AlertTitle>
                <AlertDescription>
                  Upgrade to access higher quality exports and additional formats.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <GlitchButton
              onClick={handleExport}
              className="flex-1 gap-2"
            >
              <Download className="w-4 h-4" />
              Export {selectedFormat.toUpperCase()}
            </GlitchButton>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ExportButton;