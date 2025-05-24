// src/components/ui/Card.tsx
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { CSSProperties } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties; // Add this line to accept style prop
}

export const Card = ({ children, className, style }: CardProps) => {
  return (
    <motion.div
      className={clsx('border border-matrix-green bg-matrix-dark/30 p-6 rounded-none', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={style} // Add this line to pass the style prop
    >
      {children}
    </motion.div>
  );
};
