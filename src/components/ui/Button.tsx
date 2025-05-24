// src/components/ui/Button.tsx
import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';
import { clsx } from 'clsx'; // Or your cn utility if preferred

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'variant'> {
  variant?: 'default' | 'outline' | 'ghost' | 'primary'; // Added 'primary'
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean; // Added isLoading prop
  children: ReactNode; // Explicitly type children
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant = 'default', size = 'md', isLoading = false, ...props }, ref) => {
    const baseStyles = 'matrix-button font-mono transition-all duration-300 flex items-center justify-center'; // Added flex for spinner

    const variants = {
      default: 'border-matrix-green hover:bg-matrix-green hover:text-black text-matrix-green',
      outline: 'border-matrix-green bg-transparent hover:bg-matrix-green/10 text-matrix-green',
      ghost: 'border-transparent hover:border-matrix-green hover:bg-matrix-green/10 text-matrix-green',
      primary: 'bg-matrix-green text-black border border-matrix-green hover:bg-opacity-80 hover:border-opacity-80', // Style for primary
    };

    const sizes = {
      sm: 'px-4 py-1 text-sm',
      md: 'px-6 py-2',
      lg: 'px-8 py-3 text-lg',
    };

    const motionProps = {
      whileHover: { scale: !isLoading ? 1.05 : 1 }, // Disable hover effect when loading
      whileTap: { scale: !isLoading ? 0.95 : 1 },   // Disable tap effect when loading
    };

    return (
      <motion.button
        ref={ref}
        className={clsx(
          baseStyles,
          variants[variant || 'default'], // Fallback to default if variant is undefined
          sizes[size || 'md'],             // Fallback to md if size is undefined
          isLoading && 'opacity-75 cursor-not-allowed', // Styles for loading state
          className
        )}
        disabled={isLoading || props.disabled} // Disable button if loading or explicitly disabled
        {...motionProps}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';