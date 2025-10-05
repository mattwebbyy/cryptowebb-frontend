import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../../src/components/ui/Card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'elevated', 'outlined'],
    },
    hover: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '600' }}>Default Card</h3>
        <p style={{ margin: 0, color: '#64748b' }}>
          This is a default card with some sample content to demonstrate the styling and layout.
        </p>
      </div>
    ),
    variant: 'default',
  },
};

export const Glass: Story = {
  args: {
    children: (
      <div style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '600' }}>Glass Card</h3>
        <p style={{ margin: 0, color: '#64748b' }}>
          This card uses a glass morphism effect with backdrop blur and transparency.
        </p>
      </div>
    ),
    variant: 'glass',
  },
};

export const Elevated: Story = {
  args: {
    children: (
      <div style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '600' }}>Elevated Card</h3>
        <p style={{ margin: 0, color: '#64748b' }}>
          This card has elevated styling with enhanced shadows for depth.
        </p>
      </div>
    ),
    variant: 'elevated',
  },
};

export const Outlined: Story = {
  args: {
    children: (
      <div style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '600' }}>Outlined Card</h3>
        <p style={{ margin: 0, color: '#64748b' }}>
          This card uses a transparent background with outline styling.
        </p>
      </div>
    ),
    variant: 'outlined',
  },
};

export const NoHover: Story = {
  args: {
    children: (
      <div style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '600' }}>Static Card</h3>
        <p style={{ margin: 0, color: '#64748b' }}>
          This card has hover effects disabled for static content.
        </p>
      </div>
    ),
    hover: false,
  },
};

export const WithContent: Story = {
  args: {
    children: (
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            backgroundColor: '#00ff00', 
            borderRadius: '50%', 
            marginRight: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            💎
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Crypto Analytics</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Real-time data analysis</p>
          </div>
        </div>
        <p style={{ margin: '0 0 16px 0', color: '#64748b', lineHeight: '1.5' }}>
          Advanced cryptocurrency analytics with real-time market data, technical indicators, and portfolio tracking capabilities.
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ 
            padding: '4px 8px', 
            backgroundColor: '#00ff00', 
            color: '#000', 
            borderRadius: '4px', 
            fontSize: '12px',
            fontWeight: '500'
          }}>
            Active
          </span>
          <span style={{ 
            padding: '4px 8px', 
            backgroundColor: 'rgba(100, 116, 139, 0.1)', 
            color: '#64748b', 
            borderRadius: '4px', 
            fontSize: '12px'
          }}>
            Pro Plan
          </span>
        </div>
      </div>
    ),
    variant: 'default',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
      <Card variant="default">
        <div style={{ padding: '20px' }}>
          <h4 style={{ margin: '0 0 8px 0' }}>Default</h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Standard card styling</p>
        </div>
      </Card>
      
      <Card variant="glass">
        <div style={{ padding: '20px' }}>
          <h4 style={{ margin: '0 0 8px 0' }}>Glass</h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Glass morphism effect</p>
        </div>
      </Card>
      
      <Card variant="elevated">
        <div style={{ padding: '20px' }}>
          <h4 style={{ margin: '0 0 8px 0' }}>Elevated</h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Enhanced shadows</p>
        </div>
      </Card>
      
      <Card variant="outlined">
        <div style={{ padding: '20px' }}>
          <h4 style={{ margin: '0 0 8px 0' }}>Outlined</h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Transparent with border</p>
        </div>
      </Card>
    </div>
  ),
};