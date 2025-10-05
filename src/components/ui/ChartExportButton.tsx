// src/components/ui/ChartExportButton.tsx
import React, { useState } from 'react';
import { Download, FileImage, FileText, Code, Database } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EXPORT_FORMATS, ExportFormat } from '@/utils/chartExport';

interface ChartExportButtonProps {
  onExport: (format: ExportFormat) => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export const ChartExportButton: React.FC<ChartExportButtonProps> = ({
  onExport,
  disabled = false,
  className
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    setShowDropdown(false);
    
    try {
      await onExport(format);
    } catch (error) {
      console.error('Export failed:', error);
      // Could integrate with toast system here
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case 'png':
        return <FileImage className="h-4 w-4" />;
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'svg':
        return <Code className="h-4 w-4" />;
      case 'csv':
        return <Database className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={disabled || isExporting}
        className="bg-matrix-green/10 text-matrix-green border border-matrix-green/50 hover:bg-matrix-green/20 h-10 px-3"
        title="Export Chart"
      >
        {isExporting ? (
          <div className="w-4 h-4 border border-matrix-green border-t-transparent rounded-full animate-spin flex-shrink-0" />
        ) : (
          <Download className="h-4 w-4 flex-shrink-0" />
        )}
        <span className="ml-2 leading-none">Export</span>
      </Button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-black/90 border border-matrix-green/50 rounded-lg shadow-lg shadow-matrix-green/20 z-20 backdrop-blur-sm">
            <div className="py-2">
              {EXPORT_FORMATS.map((format) => (
                <button
                  key={format.value}
                  onClick={() => handleExport(format.value)}
                  disabled={isExporting}
                  className="w-full flex items-center px-4 py-2 text-sm text-matrix-green hover:bg-matrix-green/10 transition-colors disabled:opacity-50"
                >
                  {getFormatIcon(format.value)}
                  <span className="ml-3">{format.label}</span>
                  <span className="ml-auto text-xs text-matrix-green/60">
                    {format.icon}
                  </span>
                </button>
              ))}
            </div>
            
            <div className="border-t border-matrix-green/20 px-4 py-2">
              <p className="text-xs text-matrix-green/60">
                High-resolution exports with Matrix theme
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChartExportButton;