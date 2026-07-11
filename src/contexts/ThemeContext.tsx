// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'dark' | 'light';
// 'default' is the modern analytics look; 'matrix' is the legacy green
// hacker theme, kept as an opt-in easter egg.
export type ThemeVariant = 'default' | 'matrix';

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
  variant: 'default',
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

const normalizeVariant = (variant: unknown): ThemeVariant =>
  variant === 'matrix' ? 'matrix' : 'default';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            ...defaultTheme,
            ...parsed,
            variant: normalizeVariant(parsed.variant),
          };
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

    root.classList.remove(
      'dark', 'light',
      'theme-dark', 'theme-light',
      'variant-default', 'variant-matrix',
      'intensity-low', 'intensity-medium', 'intensity-high',
      'animations-enabled', 'animations-disabled',
      'motion-reduced'
    );

    if (theme.mode === 'dark') {
      root.classList.add('dark');
    }

    root.classList.add(`theme-${theme.mode}`);
    root.classList.add(`variant-${theme.variant}`);
    root.classList.add(`intensity-${theme.matrixIntensity}`);
    root.classList.add(theme.animations ? 'animations-enabled' : 'animations-disabled');

    if (theme.reducedMotion) {
      root.classList.add('motion-reduced');
    }

    const styles = getThemeStyles(theme);
    Object.entries(styles).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  };

  useEffect(() => {
    applyTheme();
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
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

interface Palette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surface2: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
}

// Categorical ramp for chart series; blue-led to match the slate/blue UI,
// distinct enough that series never blend into interactive chrome.
const CHART_RAMP = ['#4c8dff', '#37b6c9', '#9a7bff', '#e8a13c', '#3fb68b', '#e0557e', '#c9a227', '#7ea1c4'];

const palettes: Record<ThemeMode, Record<ThemeVariant, Palette>> = {
  dark: {
    default: {
      primary: '#4c8dff',       // restrained financial blue
      secondary: '#3b6fd6',
      accent: '#6ea8ff',
      background: '#0d1117',    // slate near-black
      surface: '#12161d',
      surface2: '#1a212b',
      text: '#e6edf3',
      textSecondary: '#8d96a0',
      border: '#232c38',        // hairline
      error: '#f6465d',
      warning: '#d9a13c',
      success: '#3fb68b',
    },
    matrix: {
      primary: '#33ff33',
      secondary: '#00ff00',
      accent: '#66ff66',
      background: '#000000',
      surface: '#001100',
      surface2: '#002200',
      text: '#33ff33',
      textSecondary: '#22aa22',
      border: '#1a5a1a',
      error: '#ff3333',
      warning: '#ffaa33',
      success: '#33ff33',
    },
  },
  light: {
    default: {
      primary: '#2f6fed',
      secondary: '#2456bd',
      accent: '#4c8dff',
      background: '#f7f9fb',
      surface: '#ffffff',
      surface2: '#eef1f5',
      text: '#1c2430',
      textSecondary: '#5b6572',
      border: '#d9e0e8',
      error: '#dd3d4c',
      warning: '#b57b1e',
      success: '#1a9e6e',
    },
    matrix: {
      primary: '#0d7377',
      secondary: '#14a085',
      accent: '#40a69f',
      background: '#fafefe',
      surface: '#ffffff',
      surface2: '#f0fdfa',
      text: '#1a202c',
      textSecondary: '#4a5568',
      border: '#e2e8f0',
      error: '#e53e3e',
      warning: '#dd6b20',
      success: '#38a169',
    },
  },
};

// Theme styles generator
function getThemeStyles(theme: ThemeConfig): Record<string, string> {
  const { mode, variant, matrixIntensity } = theme;
  const colors = palettes[mode][variant] ?? palettes[mode].default;

  const intensity = {
    low: { opacity: '0.6', blur: '1px', glow: '2px' },
    medium: { opacity: '0.8', blur: '2px', glow: '4px' },
    high: { opacity: '1.0', blur: '3px', glow: '8px' },
  }[matrixIntensity];

  const styles: Record<string, string> = {
    '--color-primary': colors.primary,
    '--color-secondary': colors.secondary,
    '--color-accent': colors.accent,
    '--color-background': colors.background,
    '--color-surface': colors.surface,
    '--color-surface-2': colors.surface2,
    '--color-text': colors.text,
    '--color-text-secondary': colors.textSecondary,
    '--color-border': colors.border,
    '--color-error': colors.error,
    '--color-warning': colors.warning,
    '--color-success': colors.success,

    // Financial deltas
    '--color-gain': mode === 'dark' ? '#3fb68b' : '#1a9e6e',
    '--color-loss': mode === 'dark' ? '#f6465d' : '#dd3d4c',

    // Matrix-specific effects (only consumed under variant-matrix)
    '--matrix-opacity': intensity.opacity,
    '--matrix-blur': intensity.blur,
    '--matrix-glow': intensity.glow,

    // Computed colors with opacity variations
    '--color-primary-10': `${colors.primary}1a`,
    '--color-primary-20': `${colors.primary}33`,
    '--color-primary-30': `${colors.primary}4d`,
    '--color-primary-50': `${colors.primary}80`,
    '--color-primary-70': `${colors.primary}b3`,
    '--color-primary-90': `${colors.primary}e6`,
  };

  CHART_RAMP.forEach((color, i) => {
    styles[`--chart-${i + 1}`] = variant === 'matrix' && i === 0 ? colors.primary : color;
  });

  return styles;
}

export default ThemeProvider;
