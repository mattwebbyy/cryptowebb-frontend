import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Simplified Skeleton component for Storybook (without external dependencies)
const MockSkeleton = ({
  className = '',
  width,
  height,
  variant = 'matrix',
  rounded = true,
}: {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'default' | 'matrix' | 'pulse';
  rounded?: boolean;
}) => {
  const variantStyles = {
    default: {
      background: '#d1d5db',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    },
    matrix: {
      background: 'linear-gradient(90deg, rgba(0, 255, 0, 0.1) 0%, rgba(0, 255, 0, 0.2) 50%, rgba(0, 255, 0, 0.1) 100%)',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    },
    pulse: {
      background: 'rgba(0, 255, 0, 0.2)',
      animation: 'bounce 1s infinite'
    }
  };

  const style: React.CSSProperties = {
    display: 'block',
    ...variantStyles[variant],
    borderRadius: rounded ? '4px' : '0',
  };

  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return <div className={className} style={style} />;
};

// Chart skeleton component
const ChartSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={className} style={{
    background: 'rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(0, 255, 0, 0.3)',
    borderRadius: '8px',
    padding: '16px'
  }}>
    {/* Chart title skeleton */}
    <div style={{ marginBottom: '16px' }}>
      <MockSkeleton height={20} width="192px" style={{ marginBottom: '8px' }} />
      <MockSkeleton height={12} width="128px" />
    </div>
    
    {/* Chart area skeleton */}
    <div style={{ marginBottom: '16px' }}>
      {/* Bars */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'end', 
        justifyContent: 'space-between', 
        height: '128px',
        gap: '4px'
      }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <MockSkeleton
            key={i}
            width="32px"
            height={Math.random() * 80 + 20}
          />
        ))}
      </div>
      
      {/* X-axis */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginTop: '8px'
      }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <MockSkeleton key={i} height={12} width="48px" />
        ))}
      </div>
    </div>
    
    {/* Legend */}
    <div style={{ display: 'flex', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <MockSkeleton height={12} width={12} rounded />
        <MockSkeleton height={12} width="64px" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <MockSkeleton height={12} width={12} rounded />
        <MockSkeleton height={12} width="80px" />
      </div>
    </div>
  </div>
);

// Table skeleton component
const TableSkeleton = ({ 
  rows = 5, 
  columns = 4, 
  className = '' 
}: { 
  rows?: number; 
  columns?: number; 
  className?: string;
}) => (
  <div className={className} style={{
    background: 'rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(0, 255, 0, 0.3)',
    borderRadius: '8px',
    overflow: 'hidden'
  }}>
    {/* Table header */}
    <div style={{
      borderBottom: '1px solid rgba(0, 255, 0, 0.2)',
      padding: '16px'
    }}>
      <div style={{ 
        display: 'grid', 
        gap: '16px',
        gridTemplateColumns: `repeat(${columns}, 1fr)`
      }}>
        {Array.from({ length: columns }).map((_, i) => (
          <MockSkeleton key={i} height={16} />
        ))}
      </div>
    </div>
    
    {/* Table rows */}
    <div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} style={{
          padding: '16px',
          borderBottom: rowIndex < rows - 1 ? '1px solid rgba(0, 255, 0, 0.1)' : 'none'
        }}>
          <div style={{ 
            display: 'grid', 
            gap: '16px',
            gridTemplateColumns: `repeat(${columns}, 1fr)`
          }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <MockSkeleton 
                key={colIndex} 
                height={16}
                width={`${Math.random() * 40 + 60}%`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Matrix card skeleton
const MatrixCardSkeleton = ({ 
  className = '',
  children 
}: { 
  className?: string;
  children?: React.ReactNode;
}) => (
  <div className={className} style={{
    background: 'rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(0, 255, 0, 0.3)',
    borderRadius: '8px',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* Matrix scan line effect */}
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, transparent 0%, rgba(0, 255, 0, 0.05) 50%, transparent 100%)',
      animation: 'pulse 2s ease-in-out infinite'
    }} />
    
    {children || (
      <div style={{ position: 'relative', zIndex: 10 }}>
        <MockSkeleton height={24} width="128px" style={{ marginBottom: '16px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <MockSkeleton height={16} />
          <MockSkeleton height={16} width="75%" />
          <MockSkeleton height={16} width="50%" />
        </div>
      </div>
    )}
  </div>
);

const meta: Meta<typeof MockSkeleton> = {
  title: 'UI/Skeleton',
  component: MockSkeleton,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark',
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'matrix', 'pulse'],
    },
    width: { control: 'text' },
    height: { control: 'text' },
    rounded: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'matrix',
    width: '200px',
    height: '20px',
  },
};

export const Matrix: Story = {
  args: {
    variant: 'matrix',
    width: '100%',
    height: '40px',
  },
};

export const Pulse: Story = {
  args: {
    variant: 'pulse',
    width: '150px',
    height: '30px',
  },
};

export const BasicShapes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <div>
        <h4 style={{ marginBottom: '8px', color: '#00ff00' }}>Text Lines</h4>
        <MockSkeleton height={24} width="80%" style={{ marginBottom: '8px' }} />
        <MockSkeleton height={16} width="60%" style={{ marginBottom: '8px' }} />
        <MockSkeleton height={16} width="40%" />
      </div>
      
      <div>
        <h4 style={{ marginBottom: '8px', color: '#00ff00' }}>Buttons & Elements</h4>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <MockSkeleton height={40} width="100px" />
          <MockSkeleton height={40} width="80px" />
        </div>
        <MockSkeleton height={60} width="100%" />
      </div>
      
      <div>
        <h4 style={{ marginBottom: '8px', color: '#00ff00' }}>Circular Elements</h4>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <MockSkeleton height={48} width={48} rounded />
          <div style={{ flex: 1 }}>
            <MockSkeleton height={16} width="70%" style={{ marginBottom: '4px' }} />
            <MockSkeleton height={12} width="50%" />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ChartSkeletonStory: Story = {
  render: () => <ChartSkeleton />,
  name: 'Chart Skeleton',
};

export const TableSkeletonStory: Story = {
  render: () => <TableSkeleton rows={4} columns={3} />,
  name: 'Table Skeleton',
};

export const MatrixCardSkeletonStory: Story = {
  render: () => <MatrixCardSkeleton />,
  name: 'Matrix Card Skeleton',
};

export const DashboardLayout: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
      <ChartSkeleton />
      <ChartSkeleton />
      <ChartSkeleton />
      <MatrixCardSkeleton>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <MockSkeleton height={20} width="120px" />
            <MockSkeleton height={32} width={32} rounded />
          </div>
          <MockSkeleton height={36} width="80px" style={{ marginBottom: '8px' }} />
          <MockSkeleton height={16} width="60%" />
        </div>
      </MatrixCardSkeleton>
    </div>
  ),
  name: 'Dashboard Layout',
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ marginBottom: '12px', color: '#00ff00' }}>Skeleton Variants</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <MockSkeleton variant="default" height={20} width="200px" />
          <MockSkeleton variant="matrix" height={20} width="200px" />
          <MockSkeleton variant="pulse" height={20} width="200px" />
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '12px', color: '#00ff00' }}>Complex Components</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <TableSkeleton rows={3} columns={2} />
          <MatrixCardSkeleton />
        </div>
      </div>
    </div>
  ),
};