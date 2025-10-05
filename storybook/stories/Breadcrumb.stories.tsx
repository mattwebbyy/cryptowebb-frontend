import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// Simplified Matrix Breadcrumb - Clean Cyberpunk Design
const CyberpunkBreadcrumb = ({ 
  items = [
    { label: 'HOME', href: '/' },
    { label: 'ANALYTICS', href: '/analytics' },
    { label: 'CURRENT', isActive: true }
  ],
  variant = 'matrix',
  separator = '▶',
  className = ''
}: {
  items?: Array<{
    label: string;
    href?: string;
    isActive?: boolean;
  }>;
  variant?: 'matrix' | 'minimal';
  separator?: string;
  className?: string;
}) => {
  const baseStyles = `
    inline-flex items-center gap-3
    font-mono font-bold tracking-[0.1em] uppercase text-sm
    transition-all duration-300 ease-out
    select-none
  `;

  const variants = {
    matrix: `
      p-3 bg-black border border-[#00ff00] text-[#00ff00]
      shadow-[0_0_15px_rgba(0,255,0,0.3)]
      hover:shadow-[0_0_20px_rgba(0,255,0,0.5)]
    `,
    minimal: `
      p-2 bg-transparent text-[#00ff00]/80
      hover:text-[#00ff00]
    `
  };

  return (
    <nav 
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${className}
      `} 
      aria-label="Breadcrumb Navigation"
    >
      {/* Corner brackets for matrix variant */}
      {variant === 'matrix' && (
        <>
          <div className="absolute top-0 left-0 w-3 h-3">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-current" />
            <div className="absolute top-0 left-0 w-0.5 h-full bg-current" />
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3">
            <div className="absolute bottom-0 right-0 w-full h-0.5 bg-current" />
            <div className="absolute bottom-0 right-0 w-0.5 h-full bg-current" />
          </div>
        </>
      )}
      
      <div className="relative flex items-center gap-3">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <span className="text-current/50 transition-colors duration-300 hover:text-current/80">
                {separator}
              </span>
            )}
            
            {item.isActive ? (
              <span className="
                text-current font-bold tracking-[0.15em]
                border-b-2 border-current pb-1
                drop-shadow-[0_0_6px_currentColor]
              ">
                {item.label}
              </span>
            ) : (
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Navigate to:', item.href);
                }}
                className="
                  text-current/60 hover:text-current
                  tracking-[0.1em] transition-all duration-300
                  hover:drop-shadow-[0_0_4px_currentColor]
                  border-b border-transparent hover:border-current/40
                  pb-1
                "
              >
                {item.label}
              </a>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

// Matrix Analytics Breadcrumb
const MatrixAnalyticsBreadcrumb = ({ 
  metricName,
  metricId,
  className = ''
}: any) => {
  const items = [
    { label: 'Analytics', href: '/analytics' },
    { label: 'Data Sources', href: '/analytics/datasources' }
  ];

  if (metricName && metricId) {
    items.push({ label: metricName, isActive: true });
  } else {
    items[1].isActive = true;
  }

  return <MatrixBreadcrumb items={items} className={className} />;
};

const meta: Meta<typeof CyberpunkBreadcrumb> = {
  title: 'UI/Breadcrumb',
  component: CyberpunkBreadcrumb,
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
      <div className="min-h-[200px] bg-black p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const MatrixStyle: Story = {
  args: {
    variant: 'matrix'
  },
};

export const MinimalStyle: Story = {
  args: {
    variant: 'minimal'
  },
};

export const CustomSeparator: Story = {
  args: {
    separator: '///',
    variant: 'matrix'
  },
};

export const LongPath: Story = {
  args: {
    items: [
      { label: 'HOME', href: '/' },
      { label: 'CRYPTO', href: '/crypto' },
      { label: 'ANALYTICS', href: '/crypto/analytics' },
      { label: 'BITCOIN', href: '/crypto/analytics/bitcoin' },
      { label: 'CHARTS', isActive: true }
    ],
    variant: 'matrix'
  }
};

export const SimpleInterface: Story = {
  render: () => (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <CyberpunkBreadcrumb 
            variant="matrix"
            items={[
              { label: 'DASHBOARD', href: '/dashboard' },
              { label: 'ANALYTICS', href: '/analytics' },
              { label: 'CRYPTO_METRICS', isActive: true }
            ]}
          />
        </div>
        
        <div className="bg-black border border-[#00ff00]/30 p-8">
          <h1 className="text-[#00ff00] font-mono text-2xl font-bold tracking-[0.2em] mb-4">
            CRYPTO ANALYTICS DASHBOARD
          </h1>
          <p className="text-[#00ff00]/60 font-mono">
            Real-time blockchain data visualization and analysis.
          </p>
        </div>
      </div>
    </div>
  ),
};