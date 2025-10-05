import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

// Elite Matrix Chart Export Terminal - Advanced Cyberpunk Design
const CyberpunkChartExportButton = ({ 
  onExport, 
  disabled = false, 
  className = '',
  variant = 'quantum',
  size = 'default'
}: any) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Elite Matrix Export Protocols
  const EXPORT_PROTOCOLS = [
    { value: 'png', label: 'QUANTUM_IMAGE', icon: '◢', format: 'PNG_MATRIX' },
    { value: 'pdf', label: 'NEURAL_DOCUMENT', icon: '◈', format: 'PDF_CORE' },
    { value: 'svg', label: 'VECTOR_STREAM', icon: '⬡', format: 'SVG_NET' },
    { value: 'csv', label: 'DATA_MATRIX', icon: '◣', format: 'CSV_GRID' }
  ];

  const handleExport = async (protocol: any) => {
    setIsExporting(true);
    setShowDropdown(false);
    
    try {
      console.log('◈ MATRIX EXPORT INITIATED:', protocol);
      await onExport(protocol);
    } catch (error) {
      console.error('◢ EXPORT PROTOCOL FAILED:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const baseStyles = `
    relative inline-flex items-center justify-center
    font-mono font-bold tracking-[0.15em] uppercase
    transition-all duration-300 ease-out cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-[#00ff00]/50 focus:ring-offset-2 focus:ring-offset-black
    disabled:pointer-events-none disabled:opacity-30
    select-none overflow-hidden group
    transform-gpu backface-visibility-hidden
  `;

  const variants = {
    quantum: `
      bg-black border-2 border-[#00ff00] text-[#00ff00]
      shadow-[0_0_20px_rgba(0,255,0,0.3),inset_0_0_20px_rgba(0,255,0,0.1)]
      hover:shadow-[0_0_30px_rgba(0,255,0,0.6),inset_0_0_30px_rgba(0,255,0,0.2)]
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-[#00ff00]/15 before:to-transparent
      before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
    `,
    stealth: `
      bg-[#001100] border border-[#00ff00]/40 text-[#00ff00]/80
      hover:border-[#00ff00] hover:text-[#00ff00] hover:bg-[#002200]
      hover:shadow-[0_0_15px_rgba(0,255,0,0.3)]
    `,
    danger: `
      bg-black border-2 border-[#ff0040] text-[#ff0040]
      shadow-[0_0_20px_rgba(255,0,64,0.3),inset_0_0_20px_rgba(255,0,64,0.1)]
      hover:shadow-[0_0_30px_rgba(255,0,64,0.6),inset_0_0_30px_rgba(255,0,64,0.2)]
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-[#ff0040]/15 before:to-transparent
      before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
    `
  };

  const sizes = {
    sm: 'h-10 px-4 text-xs min-w-[120px]',
    default: 'h-12 px-6 text-sm min-w-[150px]',
    lg: 'h-16 px-8 text-base min-w-[180px]'
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={disabled || isExporting}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
        `}
        title="Matrix Chart Export Protocol"
      >
        {/* Matrix Digital Grid Background */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_3px,rgba(0,255,0,0.02)_3px,rgba(0,255,0,0.02)_6px)]" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,255,0,0.02)_3px,rgba(0,255,0,0.02)_6px)]" />
        </div>
        
        {/* Quantum Corner Brackets */}
        <div className="absolute top-1 left-1 w-4 h-4">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-current group-hover:shadow-[0_0_4px_currentColor] transition-all duration-300" />
          <div className="absolute top-0 left-0 w-0.5 h-full bg-current group-hover:shadow-[0_0_4px_currentColor] transition-all duration-300" />
        </div>
        <div className="absolute bottom-1 right-1 w-4 h-4">
          <div className="absolute bottom-0 right-0 w-full h-0.5 bg-current group-hover:shadow-[0_0_4px_currentColor] transition-all duration-300" />
          <div className="absolute bottom-0 right-0 w-0.5 h-full bg-current group-hover:shadow-[0_0_4px_currentColor] transition-all duration-300" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center gap-3">
          {isExporting ? (
            <>
              <div className="w-5 h-5 border-2 border-current border-t-transparent animate-spin" />
              <span className="tracking-[0.2em] drop-shadow-[0_0_6px_currentColor]">EXPORTING</span>
            </>
          ) : (
            <>
              <span className={`text-lg transition-all duration-300 ${isHovered ? 'scale-110 animate-pulse' : ''}`}>
                ⬇
              </span>
              <span className="tracking-[0.15em] drop-shadow-[0_0_6px_currentColor]">
                EXPORT_CHART
              </span>
              {isHovered && (
                <span className="text-xs opacity-80 animate-pulse">▼</span>
              )}
            </>
          )}
        </div>
        
        {/* Data Stream Line */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-current/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </button>

      {/* Matrix Export Protocol Dropdown */}
      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          
          <div className="absolute right-0 top-full mt-2 w-80 bg-black border-2 border-[#00ff00] shadow-[0_0_30px_rgba(0,255,0,0.4)] z-20 overflow-hidden">
            {/* Matrix Grid Background */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(0,255,0,0.01)_8px,rgba(0,255,0,0.01)_10px)] opacity-50" />
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_8px,rgba(0,255,0,0.01)_8px,rgba(0,255,0,0.01)_10px)] opacity-50" />
            
            {/* Corner Brackets */}
            <div className="absolute top-1 left-1 w-5 h-5">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-[#00ff00] shadow-[0_0_4px_#00ff00]" />
              <div className="absolute top-0 left-0 w-0.5 h-full bg-[#00ff00] shadow-[0_0_4px_#00ff00]" />
            </div>
            <div className="absolute bottom-1 right-1 w-5 h-5">
              <div className="absolute bottom-0 right-0 w-full h-0.5 bg-[#00ff00] shadow-[0_0_4px_#00ff00]" />
              <div className="absolute bottom-0 right-0 w-0.5 h-full bg-[#00ff00] shadow-[0_0_4px_#00ff00]" />
            </div>
            
            <div className="relative z-10 p-6">
              <div className="text-[#00ff00] font-mono font-bold uppercase tracking-[0.2em] text-sm mb-6 border-b-2 border-[#00ff00] pb-3">
                ◈ EXPORT_PROTOCOLS
              </div>
              
              <div className="space-y-3">
                {EXPORT_PROTOCOLS.map((protocol) => (
                  <button
                    key={protocol.value}
                    onClick={() => handleExport(protocol.value)}
                    disabled={isExporting}
                    className="
                      w-full flex items-center justify-between p-4
                      bg-black border border-[#00ff00]/30 text-[#00ff00]
                      hover:bg-[#00ff00]/5 hover:border-[#00ff00] hover:shadow-[0_0_10px_rgba(0,255,0,0.3)]
                      font-mono transition-all duration-300 group
                      disabled:opacity-30 relative overflow-hidden
                    "
                  >
                    {/* Hover scan effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out bg-gradient-to-r from-transparent via-[#00ff00]/10 to-transparent" />
                    
                    <div className="relative flex items-center gap-4">
                      <span className="text-xl text-[#00ff00]/80 group-hover:text-[#00ff00] transition-colors duration-300 drop-shadow-[0_0_4px_currentColor]">
                        {protocol.icon}
                      </span>
                      <div className="text-left">
                        <div className="text-sm font-bold tracking-[0.1em]">{protocol.label}</div>
                        <div className="text-xs text-[#00ff00]/60 tracking-wider">{protocol.format}</div>
                      </div>
                    </div>
                    <span className="text-xs opacity-60 font-bold tracking-wider">
                      {protocol.value.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-[#00ff00]/30">
                <p className="text-xs text-[#00ff00]/60 font-mono tracking-wider text-center">
                  [ QUANTUM_RESOLUTION_MATRIX_EXPORTS ]
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const meta: Meta<typeof CyberpunkChartExportButton> = {
  title: 'UI/ChartExportButton',
  component: CyberpunkChartExportButton,
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
      <div className="min-h-[300px] bg-black p-6 flex items-start justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockQuantumExportHandler = async (protocol: string) => {
  console.log('◈ MATRIX EXPORT PROTOCOL INITIATED:', protocol);
  // Simulate quantum export processing
  await new Promise(resolve => setTimeout(resolve, 1500));
  console.log('◈ EXPORT PROTOCOL COMPLETED');
};

export const QuantumExport: Story = {
  args: {
    onExport: mockQuantumExportHandler,
    variant: 'quantum',
    size: 'default'
  }
};

export const StealthMode: Story = {
  args: {
    onExport: mockQuantumExportHandler,
    variant: 'stealth',
    size: 'default'
  }
};

export const DangerProtocol: Story = {
  args: {
    onExport: mockQuantumExportHandler,
    variant: 'danger',
    size: 'default'
  }
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-8 items-end p-8 bg-black">
      <div className="text-center">
        <CyberpunkChartExportButton 
          onExport={mockQuantumExportHandler}
          size="sm"
        />
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2">sm</div>
      </div>
      <div className="text-center">
        <CyberpunkChartExportButton 
          onExport={mockQuantumExportHandler}
          size="default"
        />
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2">default</div>
      </div>
      <div className="text-center">
        <CyberpunkChartExportButton 
          onExport={mockQuantumExportHandler}
          size="lg"
        />
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2">lg</div>
      </div>
    </div>
  ),
};

export const DisabledState: Story = {
  args: {
    onExport: mockQuantumExportHandler,
    disabled: true,
    variant: 'quantum'
  }
};

export const ProcessingState: Story = {
  args: {
    onExport: async (protocol) => {
      console.log('◈ LONG PROCESSING PROTOCOL:', protocol);
      // Extended delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 8000));
    },
    variant: 'quantum'
  }
};

export const MatrixChartInterface: Story = {
  render: () => (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-black border-2 border-[#00ff00]/30 p-8 relative overflow-hidden">
          {/* Matrix grid background */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(0,255,0,0.01)_20px,rgba(0,255,0,0.01)_22px)] opacity-40" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_20px,rgba(0,255,0,0.01)_20px,rgba(0,255,0,0.01)_22px)] opacity-40" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-[#00ff00] text-2xl font-mono font-bold tracking-[0.2em] mb-2">
                  ◈ BLOCKCHAIN_ANALYTICS_MATRIX
                </h2>
                <div className="text-[#00ff00]/60 font-mono text-sm tracking-wider">
                  [ REAL_TIME_QUANTUM_CHART_DATA ]
                </div>
              </div>
              <CyberpunkChartExportButton 
                onExport={mockQuantumExportHandler}
                variant="quantum"
                size="lg"
              />
            </div>
            
            <div className="h-96 bg-black border-2 border-[#00ff00]/20 p-6 flex items-center justify-center relative">
              {/* Simulated chart area */}
              <div className="absolute inset-4 border border-[#00ff00]/10">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-[#00ff00]/60">
                    <div className="text-6xl mb-4">◈</div>
                    <div className="font-mono text-lg tracking-wider">
                      QUANTUM_CHART_VISUALIZATION
                    </div>
                    <div className="font-mono text-sm text-[#00ff00]/40 mt-2">
                      [ MATRIX_DATA_STREAM_ACTIVE ]
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Corner brackets for chart area */}
              <div className="absolute top-4 left-4 w-8 h-8">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-[#00ff00]/40" />
                <div className="absolute top-0 left-0 w-0.5 h-full bg-[#00ff00]/40" />
              </div>
              <div className="absolute bottom-4 right-4 w-8 h-8">
                <div className="absolute bottom-0 right-0 w-full h-0.5 bg-[#00ff00]/40" />
                <div className="absolute bottom-0 right-0 w-0.5 h-full bg-[#00ff00]/40" />
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-[#00ff00]/30">
              <div className="flex justify-between text-sm font-mono text-[#00ff00]/60">
                <span>STATUS: QUANTUM_CONNECTED</span>
                <span>DATA_POINTS: 2,847,392</span>
                <span>LATENCY: 0.08ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const MultipleExportButtons: Story = {
  render: () => (
    <div className="space-y-8 p-8 bg-black max-w-4xl">
      <div>
        <h3 className="text-[#00ff00]/60 font-mono text-sm mb-4 uppercase tracking-wider">◢ Quantum Variant</h3>
        <CyberpunkChartExportButton 
          onExport={mockQuantumExportHandler}
          variant="quantum"
        />
      </div>
      <div>
        <h3 className="text-[#00ff00]/60 font-mono text-sm mb-4 uppercase tracking-wider">◢ Stealth Variant</h3>
        <CyberpunkChartExportButton 
          onExport={mockQuantumExportHandler}
          variant="stealth"
        />
      </div>
      <div>
        <h3 className="text-[#ff0040]/60 font-mono text-sm mb-4 uppercase tracking-wider">◢ Danger Variant</h3>
        <CyberpunkChartExportButton 
          onExport={mockQuantumExportHandler}
          variant="danger"
        />
      </div>
    </div>
  ),
};