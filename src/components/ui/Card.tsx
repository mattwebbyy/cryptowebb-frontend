// src/components/ui/Card.tsx
import clsx from 'clsx';
import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated' | 'outlined';
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, variant = 'default', hover = true, ...props }, ref) => {
    const variants = {
      default: 'bg-surface/80 border border-border/50 backdrop-blur-sm',
      glass: 'glass-morphism border border-border/30',
      elevated: 'bg-surface shadow-modern-lg border border-border/20',
      outlined: 'bg-transparent border border-border hover:bg-surface/30'
    };

    const hoverEffects = hover
      ? 'hover:shadow-modern-lg hover:border-primary/20 hover:-translate-y-1'
      : '';

    return (
      <motion.div
        ref={ref}
        className={clsx(
          'rounded-xl transition-all duration-300 ease-out',
          variants[variant],
          hoverEffects,
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.4, 
          ease: [0.21, 0.47, 0.32, 0.98] // Custom easing for modern feel
        }}
        whileHover={hover ? { y: -4 } : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
