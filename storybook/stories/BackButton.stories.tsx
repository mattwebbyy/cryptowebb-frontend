import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// Elite Matrix Back Navigation - Advanced Cyberpunk Design
const CyberpunkBackButton = ({ 
  onClick = () => console.log('◀ MATRIX NAVIGATION: PREVIOUS_SECTOR'), 
  className = '',
  variant = 'quantum',
  size = 'default',
  disabled = false
}: { 
  onClick?: () => void;
  className?: string;
  variant?: 'quantum' | 'stealth' | 'danger' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  const baseStyles = `
    relative inline-flex items-center justify-center gap-3
    font-mono font-bold text-sm tracking-[0.15em] uppercase
    transition-all duration-300 ease-out cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-[#00ff00]/50 focus:ring-offset-2 focus:ring-offset-black
    disabled:pointer-events-none disabled:opacity-30
    select-none overflow-hidden group
    transform-gpu backface-visibility-hidden
  `;

  const variants = {
    quantum: `
      bg-black border-2 border-[#00ff00] text-[#00ff00]
      shadow-[0_0_15px_rgba(0,255,0,0.3),inset_0_0_15px_rgba(0,255,0,0.1)]
      hover:shadow-[0_0_25px_rgba(0,255,0,0.6),inset_0_0_25px_rgba(0,255,0,0.2)]
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-[#00ff00]/15 before:to-transparent
      before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-600
    `,
    stealth: `
      bg-[#001100] border border-[#00ff00]/40 text-[#00ff00]/80
      hover:border-[#00ff00] hover:text-[#00ff00] hover:bg-[#002200]
      hover:shadow-[0_0_12px_rgba(0,255,0,0.3)]
    `,
    danger: `
      bg-black border-2 border-[#ff0040] text-[#ff0040]
      shadow-[0_0_15px_rgba(255,0,64,0.3),inset_0_0_15px_rgba(255,0,64,0.1)]
      hover:shadow-[0_0_25px_rgba(255,0,64,0.6),inset_0_0_25px_rgba(255,0,64,0.2)]
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-[#ff0040]/15 before:to-transparent
      before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-600
    `,
    minimal: `
      bg-transparent border border-[#00ff00]/20 text-[#00ff00]/60
      hover:border-[#00ff00]/60 hover:text-[#00ff00] hover:bg-[#00ff00]/5
    `
  };

  const sizes = {
    sm: 'h-10 px-4 text-xs min-w-[100px]',
    default: 'h-12 px-6 text-sm min-w-[120px]',
    lg: 'h-16 px-8 text-base min-w-[160px]'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {/* Matrix Digital Grid Background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_3px,rgba(0,255,0,0.02)_3px,rgba(0,255,0,0.02)_6px)]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,255,0,0.02)_3px,rgba(0,255,0,0.02)_6px)]" />
      </div>
      
      {/* Quantum Holographic Brackets */}
      <div className="absolute top-1 left-1 w-5 h-5">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-current group-hover:shadow-[0_0_4px_currentColor] transition-all duration-300" />
        <div className="absolute top-0 left-0 w-0.5 h-full bg-current group-hover:shadow-[0_0_4px_currentColor] transition-all duration-300" />
        <div className="absolute top-1 left-1 w-2 h-px bg-current/50" />
        <div className="absolute top-1 left-1 w-px h-2 bg-current/50" />
      </div>
      <div className="absolute top-1 right-1 w-5 h-5">
        <div className="absolute top-0 right-0 w-full h-0.5 bg-current group-hover:shadow-[0_0_4px_currentColor] transition-all duration-300" />
        <div className="absolute top-0 right-0 w-0.5 h-full bg-current group-hover:shadow-[0_0_4px_currentColor] transition-all duration-300" />
        <div className="absolute top-1 right-1 w-2 h-px bg-current/50" />
        <div className="absolute top-1 right-1 w-px h-2 bg-current/50" />
      </div>
      <div className="absolute bottom-1 left-1 w-5 h-5">
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-current group-hover:shadow-[0_0_4px_currentColor] transition-all duration-300" />
        <div className="absolute bottom-0 left-0 w-0.5 h-full bg-current group-hover:shadow-[0_0_4px_currentColor] transition-all duration-300" />
        <div className="absolute bottom-1 left-1 w-2 h-px bg-current/50" />
        <div className="absolute bottom-1 left-1 w-px h-2 bg-current/50" />
      </div>
      <div className="absolute bottom-1 right-1 w-5 h-5">
        <div className="absolute bottom-0 right-0 w-full h-0.5 bg-current group-hover:shadow-[0_0_4px_currentColor] transition-all duration-300" />
        <div className="absolute bottom-0 right-0 w-0.5 h-full bg-current group-hover:shadow-[0_0_4px_currentColor] transition-all duration-300" />
        <div className="absolute bottom-1 right-1 w-2 h-px bg-current/50" />
        <div className="absolute bottom-1 right-1 w-px h-2 bg-current/50" />
      </div>
      
      {/* Energy Pulse Effect */}
      <div className={`absolute inset-0 bg-current/10 transition-all duration-150 ${isPressed ? 'opacity-100 scale-95' : 'opacity-0 scale-100'}`} />
      
      {/* Animated Arrow */}
      <div className={`relative transition-all duration-300 ${isHovered ? '-translate-x-1 scale-110' : 'translate-x-0 scale-100'}`}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="drop-shadow-[0_0_6px_currentColor]"
        >
          <path
            d="M19 12H5M5 12L12 19M5 12L12 5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          {/* Double arrow effect for emphasis */}
          <path
            d="M15 12H3M3 12L8 17M3 12L8 7"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="square"
            strokeLinejoin="miter"
            opacity="0.4"
          />
        </svg>
      </div>
      
      {/* Text with glow effect */}
      <span className="relative z-10 tracking-[0.15em] drop-shadow-[0_0_6px_currentColor]">
        BACK
      </span>
      
      {/* Quantum data stream line */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-current/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Secondary glow for hover state */}
      {isHovered && (
        <div className="absolute inset-0 bg-current/5 animate-pulse" />
      )}
    </button>
  );
};

const meta: Meta<typeof CyberpunkBackButton> = {
  title: 'UI/BackButton',
  component: CyberpunkBackButton,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const QuantumNavigation: Story = {
  args: {
    variant: 'quantum',
    size: 'default'
  },
};

export const StealthMode: Story = {
  args: {
    variant: 'stealth',
    size: 'default'
  },
};

export const DangerAlert: Story = {
  args: {
    variant: 'danger',
    size: 'default'
  },
};

export const MinimalInterface: Story = {
  args: {
    variant: 'minimal',
    size: 'default'
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-8 items-end p-8 bg-black">
      <div className="text-center">
        <CyberpunkBackButton size="sm" />
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2">sm</div>
      </div>
      <div className="text-center">
        <CyberpunkBackButton size="default" />
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2">default</div>
      </div>
      <div className="text-center">
        <CyberpunkBackButton size="lg" />
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2">lg</div>
      </div>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 p-8 bg-black max-w-2xl">
      <div className="text-center">
        <CyberpunkBackButton variant="quantum" />
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2 uppercase tracking-wider">quantum</div>
      </div>
      <div className="text-center">
        <CyberpunkBackButton variant="stealth" />
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2 uppercase tracking-wider">stealth</div>
      </div>
      <div className="text-center">
        <CyberpunkBackButton variant="danger" />
        <div className="text-[#ff0040]/60 text-xs font-mono mt-2 uppercase tracking-wider">danger</div>
      </div>
      <div className="text-center">
        <CyberpunkBackButton variant="minimal" />
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2 uppercase tracking-wider">minimal</div>
      </div>
    </div>
  ),
};

export const InteractiveDemo: Story = {
  args: {
    onClick: () => alert('◀ QUANTUM NAVIGATION: Returning to previous sector...')
  },
  render: (args) => (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Matrix rain background */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_40px,rgba(0,255,0,0.01)_40px,rgba(0,255,0,0.01)_42px)] opacity-30" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_40px,rgba(0,255,0,0.01)_40px,rgba(0,255,0,0.01)_42px)] opacity-30" />
      
      <div className="relative z-10 p-8">
        <CyberpunkBackButton {...args} variant="quantum" />
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-[#00ff00] max-w-2xl">
          <h1 className="text-4xl mb-6 font-mono font-bold uppercase tracking-[0.3em]">
            ◢◤ MATRIX INTERFACE ◥◣
          </h1>
          <p className="text-[#00ff00]/70 font-mono text-lg tracking-wider mb-8">
            Click the Quantum Navigation Button
          </p>
          <div className="p-6 border-2 border-[#00ff00]/30 bg-black/50">
            <div className="text-sm font-mono text-[#00ff00]/60 tracking-wider">
              [ SECURE_QUANTUM_CONNECTION_ESTABLISHED ]
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export const CyberSecurityDashboard: Story = {
  render: () => (
    <div className="min-h-screen bg-black p-8">
      <div className="flex items-center justify-between mb-8">
        <CyberpunkBackButton variant="quantum" size="lg" />
        <div className="text-[#00ff00] font-mono text-sm tracking-wider">
          [ SESSION_ID: QX7-4N9-M2P-8K1 ]
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-[#00ff00] font-mono text-3xl font-bold tracking-[0.2em] mb-4">
            CRYPTOWEBB SECURITY TERMINAL
          </h1>
          <div className="text-[#00ff00]/60 font-mono text-sm tracking-wider">
            [ BLOCKCHAIN_ANALYSIS_PROTOCOL_v4.0 ]
          </div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00ff00] to-transparent mt-4" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-black border-2 border-[#00ff00]/30 p-6">
            <h3 className="text-[#00ff00] font-mono font-bold text-lg mb-4 uppercase tracking-wider">
              SYSTEM STATUS
            </h3>
            <div className="space-y-3 text-sm font-mono">
              <div className="flex justify-between">
                <span className="text-[#00ff00]/60">ENCRYPTION:</span>
                <span className="text-[#00ff00]">QUANTUM_AES_512</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#00ff00]/60">FIREWALL:</span>
                <span className="text-[#00ff00]">ACTIVE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#00ff00]/60">INTRUSION:</span>
                <span className="text-[#00ff00]">NONE_DETECTED</span>
              </div>
            </div>
          </div>
          
          <div className="bg-black border-2 border-[#00ff00]/30 p-6">
            <h3 className="text-[#00ff00] font-mono font-bold text-lg mb-4 uppercase tracking-wider">
              ACTIVE PROTOCOLS
            </h3>
            <div className="space-y-2 text-sm font-mono text-[#00ff00]/70">
              <div>• REAL_TIME_MONITORING</div>
              <div>• THREAT_DETECTION_AI</div>
              <div>• QUANTUM_ENCRYPTION</div>
              <div>• NEURAL_DEFENSE_GRID</div>
            </div>
          </div>
          
          <div className="bg-black border-2 border-[#00ff00]/30 p-6">
            <h3 className="text-[#00ff00] font-mono font-bold text-lg mb-4 uppercase tracking-wider">
              NETWORK ACCESS
            </h3>
            <div className="text-sm font-mono">
              <div className="text-[#00ff00] mb-2">CLEARANCE: LEVEL_OMEGA</div>
              <div className="text-[#00ff00]/60">PERMISSIONS: FULL_ACCESS</div>
              <div className="text-[#00ff00]/60 mt-4">
                [ MATRIX_AUTHENTICATED ]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const DisabledState: Story = {
  args: {
    variant: 'danger',
    disabled: true
  },
};