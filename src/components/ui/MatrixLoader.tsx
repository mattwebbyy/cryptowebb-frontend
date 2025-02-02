// src/components/ui/MatrixLoader.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const MatrixLoader = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl mb-4 font-mono text-matrix-green"
            style={{ textShadow: '0 0 10px #33ff33' }}>
          INITIALIZING SYSTEM
          <span className="inline-block w-16 text-left">{dots}</span>
        </h2>
        
        <div className="w-64 h-2 bg-matrix-dark border border-matrix-green relative">
          <motion.div
            className="absolute top-0 left-0 h-full bg-matrix-green/50"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        </div>

        <div className="mt-4 font-mono text-sm text-matrix-green/70 max-w-md">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-2"
          >
            `&gt;` Establishing secure connection
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mb-2"
          >
            `&gt;` Loading matrix protocols
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mb-2"
          >
            `&gt;` Decrypting data streams
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};