// src/components/ui/Button.tsx
import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'variant'> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...props
}, ref) => {
  const baseStyles = 'matrix-button font-mono transition-all duration-300';
  
  const variants = {
    default: 'border-matrix-green hover:bg-matrix-green hover:text-black',
    outline: 'border-matrix-green bg-transparent hover:bg-matrix-green/10',
    ghost: 'border-transparent hover:border-matrix-green hover:bg-matrix-green/10',
  };
  
  const sizes = {
    sm: 'px-4 py-1 text-sm',
    md: 'px-6 py-2',
    lg: 'px-8 py-3 text-lg',
  };

  const motionProps = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  };

  return (
    <motion.button
      ref={ref}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';