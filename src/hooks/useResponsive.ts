// src/hooks/useResponsive.ts
import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '../config/responsive';

interface BreakpointConfig {
  xs: number;    // 0px (mobile)
  sm: number;    // 640px (tablet)
  md: number;    // 768px (laptop)
  lg: number;    // 1024px (desktop)
  xl: number;    // 1280px (large desktop)
  '2xl': number; // 1536px (ultra-wide)
}

// Aligned with our responsive configuration
const defaultBreakpoints: BreakpointConfig = {
  xs: BREAKPOINTS.mobile.min,
  sm: BREAKPOINTS.tablet.min,
  md: BREAKPOINTS.laptop.min,
  lg: BREAKPOINTS.desktop.min,
  xl: BREAKPOINTS.xl.min,
  '2xl': BREAKPOINTS.xxl.min,
};

export type BreakpointKey = keyof BreakpointConfig;

interface ResponsiveState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  currentBreakpoint: BreakpointKey;
  isLandscape: boolean;
  isPortrait: boolean;
  devicePixelRatio: number;
  isTouchDevice: boolean;
}

export const useResponsive = (breakpoints: Partial<BreakpointConfig> = {}) => {
  const mergedBreakpoints = { ...defaultBreakpoints, ...breakpoints };
  
  const [state, setState] = useState<ResponsiveState>(() => {
    if (typeof window === 'undefined') {
      return {
        width: 1024,
        height: 768,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        currentBreakpoint: 'lg' as BreakpointKey,
        isLandscape: true,
        isPortrait: false,
        devicePixelRatio: 1,
        isTouchDevice: false,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return {
      width,
      height,
      isMobile: width < mergedBreakpoints.md,
      isTablet: width >= mergedBreakpoints.md && width < mergedBreakpoints.lg,
      isDesktop: width >= mergedBreakpoints.lg,
      currentBreakpoint: getCurrentBreakpoint(width, mergedBreakpoints),
      isLandscape: width > height,
      isPortrait: height > width,
      devicePixelRatio: window.devicePixelRatio || 1,
      isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateResponsiveState = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setState({
        width,
        height,
        isMobile: width < mergedBreakpoints.md,
        isTablet: width >= mergedBreakpoints.md && width < mergedBreakpoints.lg,
        isDesktop: width >= mergedBreakpoints.lg,
        currentBreakpoint: getCurrentBreakpoint(width, mergedBreakpoints),
        isLandscape: width > height,
        isPortrait: height > width,
        devicePixelRatio: window.devicePixelRatio || 1,
        isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      });
    };

    // Debounce resize events for performance
    let timeoutId: NodeJS.Timeout;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateResponsiveState, 100);
    };

    window.addEventListener('resize', debouncedUpdate);
    window.addEventListener('orientationchange', updateResponsiveState);

    return () => {
      window.removeEventListener('resize', debouncedUpdate);
      window.removeEventListener('orientationchange', updateResponsiveState);
      clearTimeout(timeoutId);
    };
  }, [mergedBreakpoints]);

  return state;
};

// Helper function to determine current breakpoint
function getCurrentBreakpoint(width: number, breakpoints: BreakpointConfig): BreakpointKey {
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
}

// Utility hook for specific breakpoint checks
export const useBreakpoint = (breakpoint: BreakpointKey) => {
  const { currentBreakpoint, width } = useResponsive();
  const breakpoints = defaultBreakpoints;
  
  const isAbove = width >= breakpoints[breakpoint];
  const isBelow = width < breakpoints[breakpoint];
  const isExact = currentBreakpoint === breakpoint;
  
  return {
    isAbove,
    isBelow,
    isExact,
    currentBreakpoint,
  };
};

// Utility hook for media queries
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
};

export default useResponsive;