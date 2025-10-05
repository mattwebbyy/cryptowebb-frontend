import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Mock Footer component for Storybook
const MockFooter = ({ year = new Date().getFullYear() }: { year?: number }) => {
  return (
    <footer style={{
      width: '100%',
      padding: '24px 0',
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
        textAlign: 'center',
        color: 'rgba(0, 255, 0, 0.7)',
        fontFamily: 'monospace'
      }}>
        <p style={{ margin: 0 }}>
          &copy; {year} Cryptowebb Portfolio. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

const meta: Meta<typeof MockFooter> = {
  title: 'Layout/Footer',
  component: MockFooter,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
  },
  argTypes: {
    year: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCustomYear: Story = {
  args: {
    year: 2024,
  },
};

export const InLayout: Story = {
  render: () => (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Mock page content */}
      <div style={{ flex: 1, padding: '40px', textAlign: 'center' }}>
        <h1 style={{ color: '#00ff00', fontFamily: 'monospace', textShadow: '0 0 10px #00ff00' }}>
          CRYPTOWEBB PLATFORM
        </h1>
        <p style={{ color: '#ffffff', marginTop: '20px' }}>
          This demonstrates how the footer appears at the bottom of a page layout.
        </p>
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: 'rgba(0, 255, 0, 0.1)',
          border: '1px solid rgba(0, 255, 0, 0.3)',
          borderRadius: '8px',
          display: 'inline-block'
        }}>
          <p style={{ color: '#00ff00', margin: 0 }}>
            Page content goes here...
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <MockFooter />
    </div>
  ),
};