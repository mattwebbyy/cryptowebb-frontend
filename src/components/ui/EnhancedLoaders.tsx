// src/components/ui/EnhancedLoaders.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Matrix Terminal Loader
export const MatrixTerminalLoader: React.FC<{ 
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  text?: string;
}> = ({ 
  size = 'md', 
  showText = true,
  text = 'INITIALIZING SYSTEM'
}) => {
  const [dots, setDots] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Establishing secure connection',
    'Loading matrix protocols', 
    'Decrypting data streams',
    'Initializing neural networks',
    'Synchronizing blockchain nodes'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);

    return () => clearInterval(stepInterval);
  }, [steps.length]);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  const progressBarHeight = {
    sm: 'h-1',
    md: 'h-2', 
    lg: 'h-3'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        {showText && (
          <h2
            className={`${sizeClasses[size]} mb-4 font-mono text-teal-600 dark:text-matrix-green font-bold tracking-wider`}
            style={{ textShadow: '0 0 10px currentColor' }}
          >
            {text}
            <span className="inline-block w-16 text-left">{dots}</span>
          </h2>
        )}

        {/* Progress Bar */}
        <div className={`w-64 ${progressBarHeight[size]} bg-gray-200 dark:bg-gray-800 border border-teal-600 dark:border-matrix-green relative overflow-hidden rounded-full`}>
          <motion.div
            className={`absolute top-0 left-0 ${progressBarHeight[size]} bg-gradient-to-r from-teal-600 to-teal-400 dark:from-matrix-green dark:to-green-300 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          {/* Glowing effect */}
          <motion.div
            className={`absolute top-0 left-0 ${progressBarHeight[size]} bg-white/50 rounded-full`}
            initial={{ x: '-100%', width: '30%' }}
            animate={{ x: '350%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Terminal Steps */}
        <div className="mt-6 font-mono text-sm text-teal-600/70 dark:text-matrix-green/70 max-w-md">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <span className="text-teal-600 dark:text-matrix-green">&gt;</span>
              {steps[currentStep]}
              <motion.span
                className="inline-block w-2 h-4 bg-teal-600 dark:bg-matrix-green ml-1"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

// Glitch Loading Spinner
export const GlitchSpinner: React.FC<{ 
  size?: number;
  color?: string;
}> = ({ 
  size = 40,
  color = 'currentColor'
}) => {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
      >
        {/* Main spinner */}
        <motion.div
          className="absolute inset-0 border-2 border-transparent border-t-teal-600 dark:border-t-matrix-green rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Glitch effects */}
        <motion.div
          className="absolute inset-0 border-2 border-transparent border-r-red-500 rounded-full"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            rotate: { duration: 1.5, repeat: Infinity, ease: 'linear' },
            scale: { duration: 0.3, repeat: Infinity, repeatDelay: 2 },
            opacity: { duration: 0.3, repeat: Infinity, repeatDelay: 2 }
          }}
        />
        
        {/* Inner dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-teal-600 dark:bg-matrix-green rounded-full transform -translate-x-1/2 -translate-y-1/2"
          animate={{ 
            scale: [0.8, 1.2, 0.8],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
};

// Skeleton Loader Components
export const SkeletonCard: React.FC<{ 
  lines?: number;
  showImage?: boolean;
  imageHeight?: string;
}> = ({ 
  lines = 3, 
  showImage = true,
  imageHeight = 'h-48'
}) => {
  return (
    <div className="animate-pulse bg-white/90 dark:bg-black/90 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {showImage && (
        <div className={`${imageHeight} bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700`}>
          <motion.div
            className="h-full w-full bg-gradient-to-r from-transparent via-white/20 dark:via-gray-500/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      )}
      <div className="p-6">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded mb-3 relative overflow-hidden ${
              index === 0 ? 'w-3/4' : index === lines - 1 ? 'w-1/2' : 'w-full'
            }`}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-500/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: 'easeInOut',
                delay: index * 0.1
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Data Table Skeleton
export const SkeletonTable: React.FC<{ 
  rows?: number;
  columns?: number;
}> = ({ 
  rows = 5, 
  columns = 4
}) => {
  return (
    <div className="bg-white/90 dark:bg-black/90 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <div
              key={index}
              className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-500/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: 'easeInOut',
                  delay: index * 0.1
                }}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="border-b border-gray-100 dark:border-gray-800 p-4 last:border-b-0">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded relative overflow-hidden"
                style={{ width: Math.random() * 40 + 60 + '%' }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-500/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: 'easeInOut',
                    delay: (rowIndex * columns + colIndex) * 0.05
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Chart Skeleton
export const SkeletonChart: React.FC<{ 
  height?: string;
  showLegend?: boolean;
}> = ({ 
  height = 'h-80',
  showLegend = true
}) => {
  return (
    <div className="bg-white/90 dark:bg-black/90 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      {/* Chart title */}
      <div className="h-6 w-1/3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded mb-6 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-500/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      
      {/* Chart area */}
      <div className={`${height} bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded relative overflow-hidden mb-4`}>
        {/* Simulated chart lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <motion.path
            d="M 0 80 Q 100 40 200 60 T 400 50"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-teal-600 dark:text-matrix-green"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
        
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-gray-600/10 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      
      {/* Legend */}
      {showLegend && (
        <div className="flex gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full" />
              <div className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-500/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: 'easeInOut',
                    delay: index * 0.2
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Progressive Loading Component
export const ProgressiveLoader: React.FC<{
  steps: Array<{ label: string; progress: number }>;
  currentStep: number;
}> = ({ steps, currentStep }) => {
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Step indicator */}
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
              index < currentStep 
                ? 'bg-teal-600 dark:bg-matrix-green border-teal-600 dark:border-matrix-green text-white dark:text-black'
                : index === currentStep
                ? 'border-teal-600 dark:border-matrix-green text-teal-600 dark:text-matrix-green'
                : 'border-gray-300 dark:border-gray-600 text-gray-400'
            }`}>
              {index < currentStep ? '✓' : index + 1}
            </div>
            
            {/* Step label and progress */}
            <div className="flex-1">
              <div className={`text-sm font-medium ${
                index <= currentStep 
                  ? 'text-gray-800 dark:text-gray-200' 
                  : 'text-gray-400 dark:text-gray-600'
              }`}>
                {step.label}
              </div>
              
              {index === currentStep && (
                <div className="mt-1">
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-teal-600 dark:bg-matrix-green rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${step.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {step.progress}%
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Floating Action Loader (for button states)
export const FloatingActionLoader: React.FC<{ 
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ 
  text = 'Processing',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-sm py-1 px-3',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-3 px-6'
  };

  return (
    <motion.div
      className={`inline-flex items-center gap-2 ${sizeClasses[size]} bg-teal-600 dark:bg-matrix-green text-white dark:text-black rounded-lg font-mono`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="flex gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <motion.div
            key={index}
            className="w-1 h-1 bg-current rounded-full"
            animate={{ 
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2
            }}
          />
        ))}
      </motion.div>
      <span>{text}</span>
    </motion.div>
  );
};

export default {
  MatrixTerminalLoader,
  GlitchSpinner,
  SkeletonCard,
  SkeletonTable,
  SkeletonChart,
  ProgressiveLoader,
  FloatingActionLoader
};