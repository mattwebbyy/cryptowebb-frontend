import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Elite Matrix Terminal Button - High-Tech Cyberpunk Design
const CyberpunkButton = ({ 
  children = 'EXECUTE', 
  variant = 'matrix', 
  size = 'default',
  isLoading = false,
  disabled = false,
  className = '',
  ...props 
}: any) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  const baseStyles = `
    relative inline-flex items-center justify-center
    font-mono font-bold text-sm tracking-[0.2em] uppercase
    transition-all duration-300 ease-out cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-[#00ff00]/50 focus:ring-offset-2 focus:ring-offset-black
    disabled:pointer-events-none disabled:opacity-30
    select-none overflow-hidden group
    transform-gpu backface-visibility-hidden perspective-1000
  `;

  const variants = {
    matrix: `
      bg-black border-2 border-[#00ff00] text-[#00ff00]
      shadow-[0_0_20px_rgba(0,255,0,0.3),inset_0_0_20px_rgba(0,255,0,0.1)]
      hover:shadow-[0_0_30px_rgba(0,255,0,0.6),inset_0_0_30px_rgba(0,255,0,0.2)]
      hover:text-[#00ff00] hover:border-[#00ff00]
      active:shadow-[0_0_40px_rgba(0,255,0,0.8),inset_0_0_40px_rgba(0,255,0,0.3)]
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-[#00ff00]/20 before:to-transparent
      before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
    `,
    primary: `
      bg-[#00ff00] border-2 border-[#00ff00] text-black
      shadow-[0_0_25px_rgba(0,255,0,0.5)]
      hover:bg-[#00cc00] hover:shadow-[0_0_35px_rgba(0,255,0,0.7)]
      active:bg-[#009900] active:shadow-[0_0_45px_rgba(0,255,0,0.9)]
    `,
    danger: `
      bg-black border-2 border-[#ff0040] text-[#ff0040]
      shadow-[0_0_20px_rgba(255,0,64,0.3),inset_0_0_20px_rgba(255,0,64,0.1)]
      hover:shadow-[0_0_30px_rgba(255,0,64,0.6),inset_0_0_30px_rgba(255,0,64,0.2)]
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-[#ff0040]/20 before:to-transparent
      before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
    `,
    ghost: `
      bg-transparent border border-[#00ff00]/30 text-[#00ff00]/70
      hover:border-[#00ff00] hover:text-[#00ff00] hover:bg-[#00ff00]/5
      hover:shadow-[0_0_15px_rgba(0,255,0,0.3)]
    `,
    stealth: `
      bg-[#001100] border border-[#00ff00]/20 text-[#00ff00]/60
      hover:border-[#00ff00]/60 hover:text-[#00ff00]/90 hover:bg-[#002200]
      hover:shadow-[0_0_10px_rgba(0,255,0,0.2)]
    `
  };

  const sizes = {
    sm: 'h-8 px-4 text-xs min-w-[80px]',
    default: 'h-12 px-8 text-sm min-w-[120px]', 
    lg: 'h-16 px-12 text-base min-w-[160px]',
    xl: 'h-20 px-16 text-lg min-w-[200px]'
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={isLoading || disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      {...props}
    >
      {/* Matrix Digital Rain Background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,255,0,0.03)_2px,rgba(0,255,0,0.03)_4px)] animate-pulse" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,0,0.03)_2px,rgba(0,255,0,0.03)_4px)]" />
      </div>
      
      {/* Holographic Scan Lines */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Corner Brackets - Cyberpunk Style */}
      <div className="absolute top-0 left-0 w-4 h-4">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-[#00ff00] group-hover:shadow-[0_0_5px_#00ff00]" />
        <div className="absolute top-0 left-0 w-0.5 h-full bg-[#00ff00] group-hover:shadow-[0_0_5px_#00ff00]" />
      </div>
      <div className="absolute top-0 right-0 w-4 h-4">
        <div className="absolute top-0 right-0 w-full h-0.5 bg-[#00ff00] group-hover:shadow-[0_0_5px_#00ff00]" />
        <div className="absolute top-0 right-0 w-0.5 h-full bg-[#00ff00] group-hover:shadow-[0_0_5px_#00ff00]" />
      </div>
      <div className="absolute bottom-0 left-0 w-4 h-4">
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00ff00] group-hover:shadow-[0_0_5px_#00ff00]" />
        <div className="absolute bottom-0 left-0 w-0.5 h-full bg-[#00ff00] group-hover:shadow-[0_0_5px_#00ff00]" />
      </div>
      <div className="absolute bottom-0 right-0 w-4 h-4">
        <div className="absolute bottom-0 right-0 w-full h-0.5 bg-[#00ff00] group-hover:shadow-[0_0_5px_#00ff00]" />
        <div className="absolute bottom-0 right-0 w-0.5 h-full bg-[#00ff00] group-hover:shadow-[0_0_5px_#00ff00]" />
      </div>
      
      {/* Energy Pulse Effect */}
      <div className={`absolute inset-0 bg-[#00ff00]/10 transition-all duration-150 ${isPressed ? 'opacity-100 scale-95' : 'opacity-0 scale-100'}`} />
      
      {/* Content Container */}
      <div className="relative z-10 flex items-center justify-center gap-3">
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span className="tracking-[0.3em]">PROCESSING</span>
          </>
        ) : (
          <>
            <span className="tracking-[0.2em] drop-shadow-[0_0_8px_currentColor]">{children}</span>
            {isHovered && (
              <span className="text-xs opacity-80 animate-pulse tracking-wider">▶</span>
            )}
          </>
        )}
      </div>
      
      {/* Data Stream Lines */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00ff00]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00ff00]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200" style={{ transform: 'translateY(2px)' }} />
    </button>
  );
};

const meta: Meta<typeof CyberpunkButton> = {
  title: 'UI/Button',
  component: CyberpunkButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['matrix', 'primary', 'danger', 'ghost', 'stealth'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'xl'],
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const MatrixTerminal: Story = {
  args: {
    children: 'ACCESS MATRIX',
    variant: 'matrix',
  },
};

export const PrimaryAction: Story = {
  args: {
    children: 'EXECUTE PROTOCOL',
    variant: 'primary',
  },
};

export const DangerZone: Story = {
  args: {
    children: 'TERMINATE PROCESS',
    variant: 'danger',
  },
};

export const GhostMode: Story = {
  args: {
    children: 'STEALTH MODE',
    variant: 'ghost',
  },
};

export const StealthOps: Story = {
  args: {
    children: 'INFILTRATE SYSTEM',
    variant: 'stealth',
  },
};

export const ProcessingState: Story = {
  args: {
    children: 'HACKING MAINFRAME',
    variant: 'matrix',
    isLoading: true,
  },
};

export const AccessDenied: Story = {
  args: {
    children: 'ACCESS DENIED',
    variant: 'danger',
    disabled: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-6 items-end flex-wrap p-8 bg-black">
      <div className="text-center">
        <CyberpunkButton size="sm">SMALL</CyberpunkButton>
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2">sm</div>
      </div>
      <div className="text-center">
        <CyberpunkButton size="default">DEFAULT</CyberpunkButton>
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2">default</div>
      </div>
      <div className="text-center">
        <CyberpunkButton size="lg">LARGE</CyberpunkButton>
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2">lg</div>
      </div>
      <div className="text-center">
        <CyberpunkButton size="xl">EXTRA LARGE</CyberpunkButton>
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2">xl</div>
      </div>
    </div>
  ),
};

export const HackerArsenal: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-black max-w-4xl">
      <CyberpunkButton variant="matrix">BREACH FIREWALL</CyberpunkButton>
      <CyberpunkButton variant="primary">INJECT PAYLOAD</CyberpunkButton>
      <CyberpunkButton variant="danger">DESTROY EVIDENCE</CyberpunkButton>
      <CyberpunkButton variant="ghost">GHOST PROTOCOL</CyberpunkButton>
      <CyberpunkButton variant="stealth">SHADOW NETWORK</CyberpunkButton>
      <CyberpunkButton variant="matrix" isLoading>CRACKING ENCRYPTION</CyberpunkButton>
    </div>
  ),
};

export const MatrixTerminalInterface: Story = {
  render: () => (
    <div className="bg-black border-2 border-[#00ff00] p-12 max-w-2xl relative overflow-hidden">
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(0,255,0,0.03)_20px,rgba(0,255,0,0.03)_22px)] opacity-50" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_20px,rgba(0,255,0,0.03)_20px,rgba(0,255,0,0.03)_22px)] opacity-50" />
      
      <div className="relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-[#00ff00] font-mono text-2xl font-bold tracking-[0.3em] mb-4">
            ◢◤ MATRIX TERMINAL ◥◣
          </h2>
          <div className="text-[#00ff00]/60 text-sm font-mono tracking-wider">
            [ QUANTUM_ENCRYPTION_PROTOCOL_ACTIVE ]
          </div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00ff00] to-transparent mt-4" />
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <CyberpunkButton variant="matrix" size="lg">
              INITIATE HACK
            </CyberpunkButton>
            <CyberpunkButton variant="primary" size="lg">
              UPLOAD VIRUS
            </CyberpunkButton>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <CyberpunkButton variant="danger" size="default">
              SELF DESTRUCT
            </CyberpunkButton>
            <CyberpunkButton variant="stealth" size="default">
              CLOAK MODE
            </CyberpunkButton>
          </div>
          
          <div className="w-full">
            <CyberpunkButton variant="ghost" className="w-full" size="default">
              ESTABLISH SECURE CONNECTION
            </CyberpunkButton>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-[#00ff00]/30">
          <div className="flex justify-between text-xs font-mono text-[#00ff00]/60">
            <span>STATUS: ONLINE</span>
            <span>SECURITY: MAXIMUM</span>
            <span>UPTIME: 99.97%</span>
          </div>
        </div>
      </div>
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black p-8 flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
};