import type { Meta, StoryObj } from '@storybook/react';
import { FloatingIcons } from '../../src/components/matrix/FloatingIcons';

const meta: Meta<typeof FloatingIcons> = {
  title: 'Matrix/FloatingIcons',
  component: FloatingIcons,
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
        
        {/* Content overlay to show icons floating over content */}
        <div className="relative z-10 p-8 text-matrix-green">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-center">Floating Matrix Icons</h1>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-black/50 border border-matrix-green/30 p-6 rounded">
                <h2 className="text-xl mb-4">About the Effect</h2>
                <p className="text-matrix-green/70 mb-4">
                  Matrix-themed floating icons that spawn randomly across the screen.
                  Icons move in gentle floating patterns and fade out over time.
                </p>
                <ul className="text-sm text-matrix-green/60 space-y-1">
                  <li>• Icons spawn every 2 seconds</li>
                  <li>• Each icon lasts 20 seconds</li>
                  <li>• Random positioning and movement</li>
                  <li>• Low opacity for subtle effect</li>
                </ul>
              </div>
              
              <div className="bg-black/50 border border-matrix-green/30 p-6 rounded">
                <h2 className="text-xl mb-4">Symbols Used</h2>
                <div className="grid grid-cols-4 gap-4 text-center">
                  {['∆', '◊', '○', '□', '∇', '×', '+'].map((symbol, index) => (
                    <div key={index} className="text-2xl text-matrix-green border border-matrix-green/20 p-2 rounded">
                      {symbol}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-matrix-green/50 text-sm">
                Watch for floating icons appearing randomly across the screen
              </p>
            </div>
          </div>
        </div>
        
        {/* Add some CSS for the float animation */}
        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translate(0, 0) scale(1);
              opacity: 0;
            }
            10% {
              opacity: 0.3;
            }
            50% {
              transform: translate(var(--moveX, 0px), var(--moveY, 0px)) scale(1.2);
              opacity: 0.3;
            }
            90% {
              opacity: 0.3;
            }
          }
          
          .animate-float {
            animation: float 20s ease-in-out infinite;
          }
        `}</style>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithContent: Story = {
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black relative">
        <Story />
        
        {/* Simulated page content */}
        <div className="relative z-10 p-8 text-matrix-green">
          <div className="max-w-2xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4">CryptoWebb</h1>
              <p className="text-xl text-matrix-green/70">Blockchain Analytics Platform</p>
            </header>
            
            <div className="space-y-8">
              <section className="bg-black/50 border border-matrix-green/30 p-6 rounded">
                <h2 className="text-2xl mb-4">Real-time Data</h2>
                <p className="text-matrix-green/70 mb-4">
                  Monitor blockchain transactions, analyze patterns, and detect anomalies 
                  in real-time with our advanced analytics platform.
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="border border-matrix-green/20 p-3 rounded">
                    <div className="text-lg font-bold">1,247</div>
                    <div className="text-sm text-matrix-green/60">Transactions</div>
                  </div>
                  <div className="border border-matrix-green/20 p-3 rounded">
                    <div className="text-lg font-bold">$2.3M</div>
                    <div className="text-sm text-matrix-green/60">Volume</div>
                  </div>
                  <div className="border border-matrix-green/20 p-3 rounded">
                    <div className="text-lg font-bold">99.9%</div>
                    <div className="text-sm text-matrix-green/60">Uptime</div>
                  </div>
                </div>
              </section>
              
              <section className="bg-black/50 border border-matrix-green/30 p-6 rounded">
                <h2 className="text-2xl mb-4">Security Features</h2>
                <ul className="space-y-2 text-matrix-green/70">
                  <li>• End-to-end encryption</li>
                  <li>• Multi-signature authentication</li>
                  <li>• Real-time threat detection</li>
                  <li>• Automated security protocols</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translate(0, 0) scale(1);
              opacity: 0;
            }
            10% {
              opacity: 0.3;
            }
            50% {
              transform: translate(var(--moveX, 0px), var(--moveY, 0px)) scale(1.2);
              opacity: 0.3;
            }
            90% {
              opacity: 0.3;
            }
          }
          
          .animate-float {
            animation: float 20s ease-in-out infinite;
          }
        `}</style>
      </div>
    ),
  ],
};

export const MinimalDemo: Story = {
  decorators: [
    (Story) => (
      <div className="h-96 bg-black relative border border-matrix-green/30 rounded">
        <Story />
        
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <h2 className="text-2xl text-matrix-green mb-2">Floating Icons Demo</h2>
            <p className="text-matrix-green/60 text-sm">Watch for symbols appearing randomly</p>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translate(0, 0) scale(1);
              opacity: 0;
            }
            10% {
              opacity: 0.3;
            }
            50% {
              transform: translate(var(--moveX, 0px), var(--moveY, 0px)) scale(1.2);
              opacity: 0.3;
            }
            90% {
              opacity: 0.3;
            }
          }
          
          .animate-float {
            animation: float 20s ease-in-out infinite;
          }
        `}</style>
      </div>
    ),
  ],
};