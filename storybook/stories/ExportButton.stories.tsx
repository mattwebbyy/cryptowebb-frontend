import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// Elite Matrix Dashboard Export Terminal - Advanced Cyberpunk Design
const CyberpunkExportButton = ({ 
  variant = 'matrix', 
  size = 'default', 
  userTier = 'free',
  dashboardTitle = 'DASHBOARD',
  onExportStart = () => console.log('◈ Export protocol initiated'),
  onExportComplete = () => console.log('◈ Export protocol completed'),
  className = ''
}: any) => {
  const [isExporting, setIsExporting] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  // Elite Matrix Export Protocols by User Tier
  const exportProtocols = [
    { value: 'png', label: 'QUANTUM_IMAGE', icon: '◢', format: 'PNG_MATRIX', restricted: false },
    { value: 'pdf', label: 'NEURAL_DOCUMENT', icon: '◈', format: 'PDF_CORE', restricted: false },
    { value: 'svg', label: 'VECTOR_STREAM', icon: '⬡', format: 'SVG_NET', restricted: userTier === 'free' },
    { value: 'csv', label: 'DATA_MATRIX', icon: '◣', format: 'CSV_GRID', restricted: false }
  ];

  const handleExport = async (protocol: string) => {
    setIsExporting(true);
    setShowDropdown(false);
    onExportStart();
    
    console.log('◈ MATRIX EXPORT PROTOCOL INITIATED:', protocol);
    // Simulate quantum export processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setIsExporting(false);
    onExportComplete();
    console.log('◈ EXPORT PROTOCOL COMPLETED');
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
    matrix: `
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
    `
  };

  const sizes = {
    sm: 'h-10 px-4 text-xs min-w-[140px]',
    default: 'h-12 px-6 text-sm min-w-[160px]',
    lg: 'h-16 px-8 text-base min-w-[200px]'
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isExporting}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
        `}
        title="Matrix Dashboard Export Protocol"
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
                EXPORT_{dashboardTitle}
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
                {exportProtocols.map((protocol) => (
                  <button
                    key={protocol.value}
                    onClick={() => handleExport(protocol.value)}
                    disabled={isExporting || protocol.restricted}
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
                        {protocol.restricted && (
                          <div className="text-xs text-[#ff0040] tracking-wider">TIER_UPGRADE_REQUIRED</div>
                        )}
                      </div>
                    </div>
                    <span className="text-xs opacity-60 font-bold tracking-wider">
                      {protocol.value.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-[#00ff00]/30">
                <div className="flex justify-between text-xs text-[#00ff00]/60 font-mono tracking-wider">
                  <span>TIER: {userTier.toUpperCase()}</span>
                  <span>QUALITY: {userTier === 'free' ? 'STANDARD' : 'QUANTUM'}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const meta: Meta<typeof CyberpunkExportButton> = {
  title: 'UI/ExportButton',
  component: CyberpunkExportButton,
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
      <div className="min-h-[400px] bg-black p-6">
        <div id="sample-dashboard" className="mb-6 p-4 border border-matrix-green/30 rounded">
          <h3 className="text-matrix-green text-lg mb-2">Sample Dashboard</h3>
          <p className="text-matrix-green/70">This represents a dashboard that can be exported</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockExportHandler = () => console.log('◈ Matrix export protocol initiated');
const mockCompleteHandler = () => console.log('◈ Export protocol completed');

export const MatrixExport: Story = {
  args: {
    dashboardTitle: 'CRYPTO_DASHBOARD',
    variant: 'matrix',
    userTier: 'free',
    onExportStart: mockExportHandler,
    onExportComplete: mockCompleteHandler
  }
};

export const StealthMode: Story = {
  args: {
    dashboardTitle: 'STEALTH_ANALYTICS',
    variant: 'stealth',
    userTier: 'pro',
    onExportStart: mockExportHandler,
    onExportComplete: mockCompleteHandler
  }
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-8 items-end p-8 bg-black">
      <div className="text-center">
        <CyberpunkExportButton 
          size="sm"
          dashboardTitle="SMALL"
          onExportStart={mockExportHandler}
          onExportComplete={mockCompleteHandler}
        />
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2">sm</div>
      </div>
      <div className="text-center">
        <CyberpunkExportButton 
          size="default"
          dashboardTitle="DEFAULT"
          onExportStart={mockExportHandler}
          onExportComplete={mockCompleteHandler}
        />
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2">default</div>
      </div>
      <div className="text-center">
        <CyberpunkExportButton 
          size="lg"
          dashboardTitle="LARGE"
          onExportStart={mockExportHandler}
          onExportComplete={mockCompleteHandler}
        />
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2">lg</div>
      </div>
    </div>
  ),
};

export const FreeTier: Story = {
  args: {
    dashboardTitle: 'FREE_DASHBOARD',
    variant: 'matrix',
    userTier: 'free',
    onExportStart: mockExportHandler,
    onExportComplete: mockCompleteHandler
  }
};

export const ProTier: Story = {
  args: {
    dashboardTitle: 'PRO_DASHBOARD',
    variant: 'matrix',
    userTier: 'pro',
    onExportStart: mockExportHandler,
    onExportComplete: mockCompleteHandler
  }
};

export const MatrixDashboardInterface: Story = {
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
                  ◈ DASHBOARD_CONTROL_MATRIX
                </h2>
                <div className="text-[#00ff00]/60 font-mono text-sm tracking-wider">
                  [ REAL_TIME_EXPORT_PROTOCOLS ]
                </div>
              </div>
              <CyberpunkExportButton 
                dashboardTitle="ANALYTICS"
                variant="matrix"
                size="lg"
                userTier="pro"
                onExportStart={mockExportHandler}
                onExportComplete={mockCompleteHandler}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-black border border-[#00ff00]/20 p-6">
                <h3 className="text-[#00ff00] font-mono font-bold text-lg mb-4 uppercase tracking-wider">
                  CRYPTO_METRICS
                </h3>
                <div className="space-y-2 text-sm font-mono text-[#00ff00]/70">
                  <div>• BTC_PRICE: $45,832.50</div>
                  <div>• ETH_VOLUME: 1.2M</div>
                  <div>• MARKET_CAP: $2.1T</div>
                </div>
              </div>
              
              <div className="bg-black border border-[#00ff00]/20 p-6">
                <h3 className="text-[#00ff00] font-mono font-bold text-lg mb-4 uppercase tracking-wider">
                  SYSTEM_STATUS
                </h3>
                <div className="space-y-2 text-sm font-mono text-[#00ff00]/70">
                  <div>• UPTIME: 99.97%</div>
                  <div>• LATENCY: 0.08ms</div>
                  <div>• CONNECTIONS: 2,847</div>
                </div>
              </div>
              
              <div className="bg-black border border-[#00ff00]/20 p-6">
                <h3 className="text-[#00ff00] font-mono font-bold text-lg mb-4 uppercase tracking-wider">
                  EXPORT_OPTIONS
                </h3>
                <div className="space-y-3">
                  <CyberpunkExportButton 
                    dashboardTitle="METRICS"
                    variant="stealth"
                    size="sm"
                    userTier="free"
                    onExportStart={mockExportHandler}
                    onExportComplete={mockCompleteHandler}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-[#00ff00]/30">
              <div className="flex justify-between text-sm font-mono text-[#00ff00]/60">
                <span>STATUS: QUANTUM_CONNECTED</span>
                <span>EXPORTS: 1,247,329</span>
                <span>SECURITY: MAXIMUM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};