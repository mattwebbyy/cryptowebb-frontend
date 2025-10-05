import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

// Matrix-styled Header Component
const MatrixHeader = ({ 
  isAuthenticated = false,
  user = null,
  showNav = true,
  className = ''
}: any) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={`bg-black border-b-2 border-matrix-green relative ${className}`}>
      {/* Matrix scan line effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-matrix-green to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-matrix-green font-mono font-bold text-xl uppercase tracking-wider">
              CRYPTOWEBB
            </div>
            <div className="ml-3 text-matrix-green/60 text-xs font-mono">
              [MATRIX_v3.0]
            </div>
          </div>

          {/* Navigation */}
          {showNav && (
            <nav className="hidden md:flex items-center space-x-8">
              {['ANALYTICS', 'PORTFOLIO', 'DATA', 'ALERTS'].map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(`Navigate to ${item}`);
                  }}
                  className="
                    text-matrix-green/70 hover:text-matrix-green
                    font-mono text-sm uppercase tracking-wider
                    border-b border-transparent hover:border-matrix-green/50
                    pb-1 transition-all duration-300
                    hover:shadow-[0_0_5px_rgba(0,255,0,0.3)]
                  "
                >
                  {item}
                </a>
              ))}
            </nav>
          )}

          {/* User section */}
          <div className="flex items-center space-x-4">
            {/* Connection status */}
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-2 h-2 bg-matrix-green rounded-full animate-pulse"></div>
              <span className="text-matrix-green/60 font-mono text-xs">ONLINE</span>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="text-matrix-green font-mono text-sm">
                  USER: {user?.name || 'ANONYMOUS'}
                </div>
                <button
                  onClick={() => console.log('Logout')}
                  className="
                    bg-transparent border border-matrix-green text-matrix-green
                    hover:bg-matrix-green hover:text-black
                    font-mono text-xs uppercase tracking-wider
                    px-3 py-1 transition-all duration-300
                    hover:shadow-[0_0_10px_rgba(0,255,0,0.5)]
                  "
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => console.log('Login')}
                  className="
                    bg-transparent border border-matrix-green text-matrix-green
                    hover:bg-matrix-green hover:text-black
                    font-mono text-xs uppercase tracking-wider
                    px-3 py-1 transition-all duration-300
                    hover:shadow-[0_0_10px_rgba(0,255,0,0.5)]
                  "
                >
                  LOGIN
                </button>
                <button
                  onClick={() => console.log('Register')}
                  className="
                    bg-matrix-green text-black border border-matrix-green
                    hover:bg-black hover:text-matrix-green
                    font-mono text-xs uppercase tracking-wider
                    px-3 py-1 transition-all duration-300
                    hover:shadow-[0_0_10px_rgba(0,255,0,0.5)]
                  "
                >
                  REGISTER
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-matrix-green hover:text-matrix-green p-2"
            >
              <div className="w-6 h-6 relative">
                <div className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 top-3' : 'top-1'}`}></div>
                <div className={`absolute h-0.5 w-6 bg-current transition-all duration-300 top-3 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></div>
                <div className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 top-3' : 'top-5'}`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-matrix-green/30 py-4 space-y-2">
            {['ANALYTICS', 'PORTFOLIO', 'DATA', 'ALERTS'].map((item) => (
              <a
                key={item}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  console.log(`Navigate to ${item}`);
                }}
                className="
                  block text-matrix-green/70 hover:text-matrix-green
                  font-mono text-sm uppercase tracking-wider
                  py-2 px-4 hover:bg-matrix-green/10
                  transition-all duration-300
                "
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

const meta: Meta<typeof MatrixHeader> = {
  title: 'Layout/Header',
  component: MatrixHeader,
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
      <div className="min-h-screen bg-black">
        <Story />
        <div className="pt-24 px-6 text-matrix-green">
          <h1 className="text-2xl mb-4">Page Content</h1>
          <p>This shows how the header appears above page content.</p>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const UnauthenticatedUser: Story = {
  args: {
    isAuthenticated: false,
    user: null
  }
};

export const AuthenticatedUser: Story = {
  args: {
    isAuthenticated: true,
    user: { name: 'MATRIX_USER_001', email: 'agent@matrix.net' }
  }
};

export const CompactHeader: Story = {
  args: {
    isAuthenticated: true,
    user: { name: 'CIPHER', email: 'cipher@cryptowebb.net' },
    showNav: false
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black">
        <Story />
        <div className="pt-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-matrix-green font-mono text-center mb-8">
              <h1 className="text-3xl font-bold uppercase tracking-wider mb-4">
                MATRIX TERMINAL ACCESS
              </h1>
              <div className="text-matrix-green/60 text-sm">
                [ AUTHENTICATION_SUCCESSFUL ]
              </div>
            </div>
            <div className="bg-black border border-matrix-green/30 p-6">
              <div className="text-matrix-green font-mono text-sm">
                {'> '}Accessing encrypted blockchain data...
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  ],
};

export const FullScreenMatrix: Story = {
  args: {
    isAuthenticated: true,
    user: { name: 'NEO', email: 'neo@matrix.net' }
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Matrix background effect */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        
        <Story />
        
        <div className="relative z-10 pt-24 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-black border border-matrix-green/30 p-6">
                <h3 className="text-matrix-green font-mono font-bold uppercase text-lg mb-4">
                  SYSTEM STATUS
                </h3>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-matrix-green/60">CONNECTION:</span>
                    <span className="text-matrix-green">SECURE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-matrix-green/60">ENCRYPTION:</span>
                    <span className="text-matrix-green">AES-256</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-matrix-green/60">LATENCY:</span>
                    <span className="text-matrix-green">12ms</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-black border border-matrix-green/30 p-6">
                <h3 className="text-matrix-green font-mono font-bold uppercase text-lg mb-4">
                  ACTIVE PROTOCOLS
                </h3>
                <div className="space-y-2 text-sm font-mono text-matrix-green/60">
                  <div>• BLOCKCHAIN_ANALYSIS_v3.1</div>
                  <div>• REAL_TIME_MONITORING</div>
                  <div>• THREAT_DETECTION_AI</div>
                  <div>• QUANTUM_ENCRYPTION</div>
                </div>
              </div>
              
              <div className="bg-black border border-matrix-green/30 p-6">
                <h3 className="text-matrix-green font-mono font-bold uppercase text-lg mb-4">
                  USER ACCESS
                </h3>
                <div className="text-sm font-mono">
                  <div className="text-matrix-green mb-2">CLEARANCE: LEVEL_9</div>
                  <div className="text-matrix-green/60">PERMISSIONS: FULL_ACCESS</div>
                  <div className="text-matrix-green/60 mt-4">
                    [ WELCOME_TO_THE_MATRIX ]
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};