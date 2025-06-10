// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'dark' | 'light';
export type ThemeVariant = 'matrix' | 'minimal' | 'cyber';

export interface ThemeConfig {
  mode: ThemeMode;
  variant: ThemeVariant;
  matrixIntensity: 'low' | 'medium' | 'high';
  animations: boolean;
  reducedMotion: boolean;
}

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: Partial<ThemeConfig>) => void;
  toggleMode: () => void;
  resetTheme: () => void;
  applyTheme: () => void;
}

const defaultTheme: ThemeConfig = {
  mode: 'dark',
  variant: 'matrix',
  matrixIntensity: 'medium',
  animations: true,
  reducedMotion: false,
};

const THEME_STORAGE_KEY = 'cryptowebb-theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeConfig>(() => {
    // Load theme from localStorage on initialization
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return { ...defaultTheme, ...parsed };
        }
      } catch (error) {
        console.warn('Failed to load theme from localStorage:', error);
      }
    }
    return defaultTheme;
  });

  const setTheme = (newTheme: Partial<ThemeConfig>) => {
    setThemeState(prev => {
      const updated = { ...prev, ...newTheme };
      
      // Save to localStorage
      try {
        localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
      
      return updated;
    });
  };

  const toggleMode = () => {
    setTheme({ mode: theme.mode === 'dark' ? 'light' : 'dark' });
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
  };

  // Apply theme to document
  const applyTheme = () => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove(
      'theme-dark', 'theme-light',
      'variant-matrix', 'variant-minimal', 'variant-cyber',
      'intensity-low', 'intensity-medium', 'intensity-high',
      'animations-enabled', 'animations-disabled',
      'motion-reduced'
    );

    // Apply new theme classes
    root.classList.add(`theme-${theme.mode}`);
    root.classList.add(`variant-${theme.variant}`);
    root.classList.add(`intensity-${theme.matrixIntensity}`);
    root.classList.add(theme.animations ? 'animations-enabled' : 'animations-disabled');
    
    if (theme.reducedMotion) {
      root.classList.add('motion-reduced');
    }

    // Set CSS custom properties for dynamic theming
    const styles = getThemeStyles(theme);
    Object.entries(styles).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  };

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme();
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (!stored) {
        setTheme({ mode: e.matches ? 'dark' : 'light' });
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Listen for reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme({ reducedMotion: e.matches });
    };

    // Set initial value
    setTheme({ reducedMotion: mediaQuery.matches });

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleMode,
    resetTheme,
    applyTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Theme styles generator
function getThemeStyles(theme: ThemeConfig): Record<string, string> {
  const { mode, variant, matrixIntensity } = theme;

  // Base colors
  const colors = {
    dark: {
      matrix: {
        primary: '#33ff33',      // Matrix green
        secondary: '#00ff00',    // Bright green
        accent: '#66ff66',       // Light green
        background: '#000000',   // Pure black
        surface: '#001100',      // Very dark green
        text: '#33ff33',         // Matrix green text
        textSecondary: '#22aa22', // Dimmer green
        border: '#1a5a1a',       // Green border
        error: '#ff3333',        // Red
        warning: '#ffaa33',      // Orange
        success: '#33ff33',      // Green
      },
      minimal: {
        primary: '#00ff88',      // Cyan-green
        secondary: '#44ffaa',    // Light cyan-green
        accent: '#88ffcc',       // Very light cyan
        background: '#0a0a0a',   // Near black
        surface: '#1a1a1a',      // Dark gray
        text: '#00ff88',         // Cyan-green text
        textSecondary: '#44aa77', // Dimmer cyan
        border: '#2a4a3a',       // Gray-green border
        error: '#ff4444',        // Red
        warning: '#ffbb44',      // Orange
        success: '#00ff88',      // Cyan-green
      },
    },
    light: {
      matrix: {
        primary: '#006600',      // Dark green
        secondary: '#008800',    // Medium green
        accent: '#00aa00',       // Bright green
        background: '#f8fff8',   // Very light green
        surface: '#ffffff',      // Pure white
        text: '#003300',         // Very dark green
        textSecondary: '#006600', // Dark green
        border: '#cceecc',       // Light green border
        error: '#cc0000',        // Dark red
        warning: '#cc6600',      // Dark orange
        success: '#006600',      // Dark green
      },
      minimal: {
        primary: '#004455',      // Dark teal
        secondary: '#006677',    // Medium teal
        accent: '#008899',       // Bright teal
        background: '#fafafa',   // Light gray
        surface: '#ffffff',      // Pure white
        text: '#1a1a1a',         // Dark gray
        textSecondary: '#666666', // Medium gray
        border: '#e0e0e0',       // Light border
        error: '#cc0000',        // Dark red
        warning: '#cc6600',      // Dark orange
        success: '#004455',      // Dark teal
      },
    },
  };

  const themeColors = colors[mode][variant] || colors[mode].matrix;

  // Intensity adjustments for matrix effects
  const intensity = {
    low: { opacity: '0.6', blur: '1px', glow: '2px' },
    medium: { opacity: '0.8', blur: '2px', glow: '4px' },
    high: { opacity: '1.0', blur: '3px', glow: '8px' },
  }[matrixIntensity];

  return {
    '--color-primary': themeColors.primary,
    '--color-secondary': themeColors.secondary,
    '--color-accent': themeColors.accent,
    '--color-background': themeColors.background,
    '--color-surface': themeColors.surface,
    '--color-text': themeColors.text,
    '--color-text-secondary': themeColors.textSecondary,
    '--color-border': themeColors.border,
    '--color-error': themeColors.error,
    '--color-warning': themeColors.warning,
    '--color-success': themeColors.success,
    
    // Matrix-specific effects
    '--matrix-opacity': intensity.opacity,
    '--matrix-blur': intensity.blur,
    '--matrix-glow': intensity.glow,
    
    // Computed colors with opacity variations
    '--color-primary-10': `${themeColors.primary}1a`,
    '--color-primary-20': `${themeColors.primary}33`,
    '--color-primary-30': `${themeColors.primary}4d`,
    '--color-primary-50': `${themeColors.primary}80`,
    '--color-primary-70': `${themeColors.primary}b3`,
    '--color-primary-90': `${themeColors.primary}e6`,
  };
}

export default ThemeProvider;