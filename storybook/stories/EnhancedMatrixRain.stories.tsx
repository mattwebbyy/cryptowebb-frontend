import type { Meta, StoryObj } from '@storybook/react';
import { EnhancedMatrixRain } from '../../src/components/matrix/EnhancedMatrixRain';

const meta: Meta<typeof EnhancedMatrixRain> = {
  title: 'Matrix/EnhancedMatrixRain',
  component: EnhancedMatrixRain,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black relative">
        <Story />
        
        {/* Content overlay to show rain effect behind content */}
        <div className="relative z-10 p-8 text-matrix-green">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-center">Enhanced Matrix Rain</h1>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-black/70 border border-matrix-green/30 p-6 rounded backdrop-blur-sm">
                <h2 className="text-xl mb-4">Features</h2>
                <ul className="text-matrix-green/70 space-y-2 text-sm">
                  <li>• Smooth 60fps animation</li>
                  <li>• Interactive mouse effects</li>
                  <li>• Random glitch effects</li>
                  <li>• Customizable colors and characters</li>
                  <li>• Performance optimized</li>
                  <li>• Responsive canvas sizing</li>
                </ul>
              </div>
              
              <div className="bg-black/70 border border-matrix-green/30 p-6 rounded backdrop-blur-sm">
                <h2 className="text-xl mb-4">Controls</h2>
                <div className="text-matrix-green/70 space-y-2 text-sm">
                  <p><strong>Mouse:</strong> Move around to see interactive effects</p>
                  <p><strong>Glitch:</strong> Random glitch effects occur automatically</p>
                  <p><strong>Characters:</strong> Japanese characters, numbers, and symbols</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-matrix-green/50 text-sm">
                Move your mouse around to see the interactive effects
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HighDensity: Story = {
  args: {
    density: 1.5,
    speed: 1.2
  }
};

export const LowDensity: Story = {
  args: {
    density: 0.3,
    speed: 0.8
  }
};

export const FastSpeed: Story = {
  args: {
    speed: 2,
    showGlitch: true
  }
};

export const SlowSpeed: Story = {
  args: {
    speed: 0.5,
    showGlitch: false
  }
};

export const LargeFontSize: Story = {
  args: {
    fontSize: 20,
    density: 0.6
  }
};

export const SmallFontSize: Story = {
  args: {
    fontSize: 10,
    density: 1.2
  }
};

export const NoGlitch: Story = {
  args: {
    showGlitch: false
  }
};

export const NonInteractive: Story = {
  args: {
    interactive: false,
    showGlitch: true
  }
};

export const CustomColors: Story = {
  args: {
    colors: ['#ff0000', '#ff3333', '#ff6666', '#ff9999', '#ffcccc']
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black relative">
        <Story />
        
        <div className="relative z-10 p-8 text-red-400">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Red Matrix Rain</h1>
            <p className="text-red-300/70">
              Custom color scheme using red tones instead of the traditional green
            </p>
          </div>
        </div>
      </div>
    ),
  ],
};

export const CustomCharacters: Story = {
  args: {
    characters: '01',
    colors: ['#00ff00', '#33ff33']
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black relative">
        <Story />
        
        <div className="relative z-10 p-8 text-matrix-green">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Binary Rain</h1>
            <p className="text-matrix-green/70">
              Matrix rain effect using only binary digits (0 and 1)
            </p>
          </div>
        </div>
      </div>
    ),
  ],
};

export const MinimalDemo: Story = {
  args: {
    density: 0.8,
    speed: 1,
    fontSize: 14
  },
  decorators: [
    (Story) => (
      <div className="h-96 bg-black relative border border-matrix-green/30 rounded overflow-hidden">
        <Story />
        
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="text-center bg-black/50 p-4 rounded border border-matrix-green/30 backdrop-blur-sm">
            <h2 className="text-xl text-matrix-green mb-2">Matrix Rain Demo</h2>
            <p className="text-matrix-green/60 text-sm">Interactive canvas animation</p>
          </div>
        </div>
      </div>
    ),
  ],
};