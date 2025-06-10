// src/components/ui/Button.tsx
import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';
import { clsx } from 'clsx'; // Or your cn utility if preferred

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'variant'> {
  variant?: 'default' | 'outline' | 'ghost' | 'primary' | 'gradient' | 'glass';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  children: ReactNode;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant = 'default', size = 'md', rounded = 'lg', isLoading = false, ...props }, ref) => {
    const baseStyles = 'font-medium transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      default: 'bg-surface border border-border text-text hover:bg-primary/5 hover:border-primary/50 hover:text-primary',
      outline: 'border border-border bg-transparent hover:bg-primary/5 text-text hover:border-primary/50 hover:text-primary',
      ghost: 'border-transparent hover:bg-primary/5 text-text-secondary hover:text-primary',
      primary: 'bg-primary text-white border border-primary hover:bg-primary/90 shadow-sm hover:shadow-md',
      gradient: 'bg-gradient-to-r from-primary to-secondary text-white border-0 hover:shadow-lg hover:shadow-primary/25 hover:scale-105',
      glass: 'glass-morphism text-text hover:bg-primary/10 hover:text-primary border border-border/30',
    };

    const sizes = {
      xs: 'px-2.5 py-1.5 text-xs',
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
    };

    const roundedStyles = {
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    };

    const motionProps = {
      whileHover: !isLoading && variant !== 'gradient' ? { scale: 1.02 } : undefined,
      whileTap: !isLoading ? { scale: 0.98 } : undefined,
    };

    return (
      <motion.button
        ref={ref}
        className={clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          roundedStyles[rounded],
          isLoading && 'opacity-75 cursor-not-allowed',
          className
        )}
        disabled={isLoading || props.disabled}
        {...motionProps}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';