import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

// Matrix-styled Theme Toggle Component
const MatrixThemeToggle = ({ 
  className = '',
  size = 'md'
}: any) => {
  const [isDark, setIsDark] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsDark(!isDark);
      setIsAnimating(false);
    }, 300);
  };

  const sizes = {
    sm: 'w-12 h-6',
    md: 'w-16 h-8',
    lg: 'w-20 h-10'
  };

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <span className="text-matrix-green font-mono text-sm uppercase tracking-wider">
        {isDark ? 'MATRIX MODE' : 'LIGHT MODE'}
      </span>
      
      <button
        onClick={handleToggle}
        className={`
          ${sizes[size]}
          relative border-2 border-matrix-green bg-black
          transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,0,0.5)]
          ${isAnimating ? 'animate-pulse' : ''}
        `}
        aria-label="Toggle theme"
      >
        {/* Toggle Track */}
        <div className="absolute inset-1 bg-matrix-green/10"></div>
        
        {/* Toggle Switch */}
        <div className={`
          absolute top-1 w-4 h-4 bg-matrix-green
          transition-all duration-300 ease-out
          ${isDark ? 'left-1' : `left-[calc(100%-1.25rem)]`}
          ${isAnimating ? 'animate-spin' : ''}
        `}>
          <div className="w-full h-full bg-matrix-green shadow-[0_0_10px_rgba(0,255,0,0.8)]">
            {/* Matrix character in the switch */}
            <div className="flex items-center justify-center h-full text-black text-xs font-mono font-bold">
              {isDark ? '1' : '0'}
            </div>
          </div>
        </div>
        
        {/* Matrix rain effect on toggle */}
        {isAnimating && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-matrix-green/20 to-transparent animate-pulse"></div>
          </div>
        )}
      </button>
      
      <div className="text-matrix-green/60 font-mono text-xs">
        {isDark ? '[SECURE]' : '[EXPOSED]'}
      </div>
    </div>
  );
};

const meta: Meta<typeof MatrixThemeToggle> = {
  title: 'UI/ThemeToggle',
  component: MatrixThemeToggle,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[400px] bg-black p-6 flex items-start justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md'
  }
};

export const Small: Story = {
  args: {
    size: 'sm'
  }
};

export const Large: Story = {
  args: {
    size: 'lg'
  }
};

export const MatrixInterface: Story = {
  render: () => (
    <div className="bg-black border-2 border-matrix-green p-8 w-96">
      <div className="text-center mb-6">
        <h2 className="text-matrix-green font-mono font-bold text-lg uppercase tracking-wider mb-2">
          SYSTEM INTERFACE
        </h2>
        <div className="text-matrix-green/60 font-mono text-xs">
          [ SECURITY_PROTOCOL_ENABLED ]
        </div>
      </div>
      
      <div className="space-y-4">
        <MatrixThemeToggle size="md" />
        
        <div className="border-t border-matrix-green/30 pt-4">
          <div className="text-matrix-green/60 font-mono text-xs">
            STATUS: ACTIVE | ENCRYPTION: AES-256 | MODE: STEALTH
          </div>
        </div>
      </div>
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="min-h-[400px] bg-black p-6 flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
};