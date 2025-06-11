// src/config/responsive.ts
/**
 * Standard viewport breakpoints for consistent responsive design
 * Based on industry standards and Tailwind CSS defaults
 */

export const BREAKPOINTS = {
  // Mobile devices (phones)
  mobile: {
    min: 0,
    max: 639,
    tailwind: '', // Default (no prefix)
  },
  
  // Tablet devices 
  tablet: {
    min: 640,
    max: 767,
    tailwind: 'sm:', // Small screens and up
  },
  
  // Laptop/small desktop
  laptop: {
    min: 768,
    max: 1023,
    tailwind: 'md:', // Medium screens and up
  },
  
  // Desktop/large screens
  desktop: {
    min: 1024,
    max: 1279,
    tailwind: 'lg:', // Large screens and up
  },
  
  // Large desktop
  xl: {
    min: 1280,
    max: 1535,
    tailwind: 'xl:', // Extra large screens and up
  },
  
  // Ultra-wide
  xxl: {
    min: 1536,
    max: Infinity,
    tailwind: '2xl:', // 2X large screens and up
  }
} as const;

/**
 * Responsive utility classes for common patterns
 */
export const RESPONSIVE_CLASSES = {
  // Container widths
  container: {
    mobile: 'w-full px-4',
    tablet: 'w-full px-6', 
    laptop: 'w-full px-8 max-w-6xl mx-auto',
    desktop: 'w-full px-12 max-w-7xl mx-auto',
  },
  
  // Text sizes
  text: {
    heading: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
    subheading: 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
    body: 'text-sm sm:text-base md:text-lg',
    small: 'text-xs sm:text-sm md:text-base',
  },
  
  // Spacing
  spacing: {
    section: 'py-8 sm:py-12 md:py-16 lg:py-20',
    component: 'p-4 sm:p-6 md:p-8',
    gap: 'gap-4 sm:gap-6 md:gap-8',
  },
  
  // Grid layouts
  grid: {
    responsive2: 'grid-cols-1 sm:grid-cols-2',
    responsive3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    responsive4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  },
  
  // Touch targets (minimum 44px for mobile)
  touch: {
    button: 'min-h-[44px] sm:min-h-[40px] md:min-h-[36px]',
    input: 'min-h-[44px] sm:min-h-[40px] md:min-h-[36px]',
  }
} as const;

/**
 * Hook for getting current breakpoint in components
 */
export const useBreakpoint = () => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width < BREAKPOINTS.tablet.min) return 'mobile';
  if (width < BREAKPOINTS.laptop.min) return 'tablet';
  if (width < BREAKPOINTS.desktop.min) return 'laptop';
  if (width < BREAKPOINTS.xl.min) return 'desktop';
  if (width < BREAKPOINTS.xxl.min) return 'xl';
  return 'xxl';
};

/**
 * Utility function to generate responsive classes
 */
export const responsive = (classes: Record<string, string>) => {
  return Object.entries(classes)
    .map(([breakpoint, className]) => {
      const bp = BREAKPOINTS[breakpoint as keyof typeof BREAKPOINTS];
      return bp ? `${bp.tailwind}${className}` : className;
    })
    .join(' ');
};