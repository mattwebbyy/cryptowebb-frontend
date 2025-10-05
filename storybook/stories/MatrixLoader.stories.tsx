import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MatrixLoader } from '../../src/components/ui/MatrixLoader';

const meta: Meta<typeof MatrixLoader> = {
  title: 'UI/MatrixLoader',
  component: MatrixLoader,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

// Demo version that doesn't cover the entire screen
export const Demo: Story = {
  render: () => (
    <div style={{ 
      position: 'relative', 
      width: '600px', 
      height: '400px', 
      border: '1px solid #333',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <MatrixLoader />
    </div>
  ),
};

// Simulated loading states
export const WithSteps: Story = {
  render: () => {
    return (
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '500px',
        background: 'linear-gradient(135deg, #000000 0%, #001100 100%)'
      }}>
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center z-[9999]">
          <div className="text-center">
            <h2 
              className="text-2xl mb-4 font-mono text-green-400"
              style={{ textShadow: '0 0 10px currentColor' }}
            >
              INITIALIZING SYSTEM
              <span className="inline-block w-16 text-left">...</span>
            </h2>

            <div className="w-64 h-2 bg-gray-800 border border-green-400 relative mb-6">
              <div 
                className="absolute top-0 left-0 h-full bg-green-400/50"
                style={{ width: '75%' }}
              />
            </div>

            <div className="mt-4 font-mono text-sm text-green-400/70 max-w-md space-y-2">
              <p className="opacity-100">&gt; Establishing secure connection ✓</p>
              <p className="opacity-100">&gt; Loading matrix protocols ✓</p>
              <p className="opacity-75">&gt; Decrypting data streams...</p>
              <p className="opacity-25">&gt; Initializing dashboard</p>
            </div>
          </div>
        </div>
      </div>
    );
  },
};