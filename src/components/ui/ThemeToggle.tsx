// src/components/ui/ThemeToggle.tsx
import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  Settings,
  Check,
  ChevronDown 
} from 'lucide-react';
import { useTheme, ThemeMode, ThemeVariant } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';

interface ThemeToggleProps {
  variant?: 'simple' | 'full';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'simple', 
  size = 'md',
  showLabel = false 
}) => {
  const { theme, setTheme, toggleMode } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  if (variant === 'simple') {
    return (
      <Button
        variant="ghost"
        size={size}
        onClick={toggleMode}
        className="text-primary hover:bg-primary-10"
        title={`Switch to ${theme.mode === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme.mode === 'dark' ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
        {showLabel && (
          <span className="ml-2 capitalize">{theme.mode}</span>
        )}
      </Button>
    );
  }

  const modeOptions: { mode: ThemeMode; icon: React.ReactNode; label: string }[] = [
    { mode: 'dark', icon: <Moon className="h-4 w-4" />, label: 'Dark' },
    { mode: 'light', icon: <Sun className="h-4 w-4" />, label: 'Light' },
  ];

  const variantOptions: { variant: ThemeVariant; label: string; description: string }[] = [
    { variant: 'matrix', label: 'Matrix', description: 'Classic green matrix theme' },
    { variant: 'minimal', label: 'Minimal', description: 'Clean and simple' },
    { variant: 'cyber', label: 'Cyber', description: 'Futuristic cyberpunk' },
  ];

  const intensityOptions = [
    { value: 'low', label: 'Low', description: 'Subtle effects' },
    { value: 'medium', label: 'Medium', description: 'Balanced effects' },
    { value: 'high', label: 'High', description: 'Intense effects' },
  ] as const;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size={size}
        onClick={() => setShowDropdown(!showDropdown)}
        className="text-primary hover:bg-primary-10 flex items-center gap-2"
      >
        <Palette className="h-4 w-4" />
        {showLabel && <span>Theme</span>}
        <ChevronDown className="h-3 w-3" />
      </Button>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border rounded-lg shadow-lg z-50 backdrop-blur-sm">
            <div className="p-4 space-y-4">
              {/* Mode Selection */}
              <div>
                <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Mode
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {modeOptions.map((option) => (
                    <button
                      key={option.mode}
                      onClick={() => setTheme({ mode: option.mode })}
                      className={`flex items-center gap-2 p-2 rounded border transition-all ${
                        theme.mode === option.mode
                          ? 'bg-primary-20 border-primary text-primary'
                          : 'bg-surface border-border text-text-secondary hover:bg-primary-10 hover:border-primary-50'
                      }`}
                    >
                      {option.icon}
                      <span className="text-sm">{option.label}</span>
                      {theme.mode === option.mode && (
                        <Check className="h-3 w-3 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Variant Selection */}
              <div>
                <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Style
                </h4>
                <div className="space-y-1">
                  {variantOptions.map((option) => (
                    <button
                      key={option.variant}
                      onClick={() => setTheme({ variant: option.variant })}
                      className={`w-full flex items-center justify-between p-2 rounded border transition-all text-left ${
                        theme.variant === option.variant
                          ? 'bg-primary-20 border-primary text-primary'
                          : 'bg-surface border-border text-text-secondary hover:bg-primary-10 hover:border-primary-50'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-medium">{option.label}</div>
                        <div className="text-xs opacity-70">{option.description}</div>
                      </div>
                      {theme.variant === option.variant && (
                        <Check className="h-3 w-3" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Matrix Intensity (only for matrix variant) */}
              {theme.variant === 'matrix' && (
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Matrix Intensity
                  </h4>
                  <div className="grid grid-cols-3 gap-1">
                    {intensityOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setTheme({ matrixIntensity: option.value })}
                        className={`p-2 rounded border transition-all text-center ${
                          theme.matrixIntensity === option.value
                            ? 'bg-primary-20 border-primary text-primary'
                            : 'bg-surface border-border text-text-secondary hover:bg-primary-10'
                        }`}
                        title={option.description}
                      >
                        <div className="text-xs font-medium">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Animation Toggle */}
              <div>
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">Animations</span>
                  <button
                    onClick={() => setTheme({ animations: !theme.animations })}
                    className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${
                      theme.animations ? 'bg-primary' : 'bg-border'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                        theme.animations ? 'translate-x-4' : 'translate-x-0.5'
                      } mt-0.5`}
                    />
                  </button>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border p-3 bg-primary-10 rounded-b-lg">
              <p className="text-xs text-text-secondary text-center">
                Theme preferences are saved automatically
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeToggle;