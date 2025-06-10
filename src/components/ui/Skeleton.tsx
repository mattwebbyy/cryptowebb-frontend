// src/components/ui/Skeleton.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'default' | 'matrix' | 'pulse';
  rounded?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width,
  height,
  variant = 'matrix',
  rounded = true,
  ...props
}) => {
  const baseClasses = "block";
  
  const variantClasses = {
    default: "bg-gray-300 animate-pulse",
    matrix: "bg-gradient-to-r from-matrix-green/10 via-matrix-green/20 to-matrix-green/10 animate-pulse",
    pulse: "bg-matrix-green/20 animate-bounce"
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        rounded && "rounded",
        className
      )}
      style={style}
      {...props}
    />
  );
};

// Chart skeleton for dashboard loading
export const ChartSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("bg-black/50 border border-matrix-green/30 rounded-lg p-4", className)}>
    {/* Chart title skeleton */}
    <div className="mb-4">
      <Skeleton className="h-5 w-48 mb-2" />
      <Skeleton className="h-3 w-32" />
    </div>
    
    {/* Chart area skeleton */}
    <div className="space-y-2 mb-4">
      {/* Y-axis labels */}
      <div className="flex items-end justify-between h-32">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-8"
            height={Math.random() * 80 + 20}
          />
        ))}
      </div>
      
      {/* X-axis */}
      <div className="flex justify-between">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-12" />
        ))}
      </div>
    </div>
    
    {/* Legend */}
    <div className="flex gap-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  </div>
);

// Table skeleton for data loading
export const TableSkeleton: React.FC<{ 
  rows?: number; 
  columns?: number; 
  className?: string;
}> = ({ 
  rows = 5, 
  columns = 4, 
  className 
}) => (
  <div className={cn("bg-black/50 border border-matrix-green/30 rounded-lg overflow-hidden", className)}>
    {/* Table header */}
    <div className="border-b border-matrix-green/20 p-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
    
    {/* Table rows */}
    <div className="divide-y divide-matrix-green/10">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton 
                key={colIndex} 
                className="h-4"
                width={Math.random() * 40 + 60 + '%'}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Metrics list skeleton
export const MetricsListSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("space-y-4", className)}>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="bg-black/50 border border-matrix-green/30 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j}>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
            
            <div className="mt-3 p-2 bg-matrix-green/5 rounded border border-matrix-green/10">
              <Skeleton className="h-3 w-12 mb-1" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          
          <div className="flex gap-2 ml-4">
            {Array.from({ length: 4 }).map((_, k) => (
              <Skeleton key={k} className="h-8 w-8 rounded" />
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Dashboard grid skeleton
export const DashboardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4", className)}>
    {Array.from({ length: 6 }).map((_, i) => (
      <ChartSkeleton key={i} className="h-64" />
    ))}
  </div>
);

// Sidebar skeleton
export const SidebarSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("space-y-6 p-4", className)}>
    {/* Navigation section */}
    <div>
      <Skeleton className="h-3 w-16 mb-3" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center p-3 rounded-lg">
            <Skeleton className="h-5 w-5 mr-3" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
    
    {/* Data metrics section */}
    <div>
      <Skeleton className="h-3 w-20 mb-3" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg">
            <div className="flex items-center">
              <Skeleton className="h-5 w-5 mr-3" />
              <div>
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
            <Skeleton className="h-4 w-4" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Matrix-themed card skeleton
export const MatrixCardSkeleton: React.FC<{ 
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => (
  <div className={cn(
    "bg-black/50 border border-matrix-green/30 rounded-lg p-6 relative overflow-hidden",
    className
  )}>
    {/* Matrix scan line effect */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-matrix-green/5 to-transparent animate-pulse" />
    
    {children || (
      <div className="relative z-10">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    )}
  </div>
);

export default Skeleton;