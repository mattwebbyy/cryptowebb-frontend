// src/components/ui/Card.tsx — flat, hairline-bordered surface.
// Deliberately no entrance animation, hover lift, blur, or glow: data
// products read as chrome-less panels, not floating marketing cards.
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
      default: 'bg-surface border border-border',
      glass: 'bg-surface border border-border',
      elevated: 'bg-surface-2 border border-border',
      outlined: 'bg-transparent border border-border',
    };

    const hoverEffects = hover ? 'transition-colors hover:border-text-secondary/40' : '';

    return (
      <motion.div
        ref={ref}
        className={clsx('rounded-md', variants[variant], hoverEffects, className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
