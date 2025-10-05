import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Simple button component for testing
interface SimpleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const SimpleButton = ({ children, ...props }: SimpleButtonProps) => (
  <button 
    style={{
      padding: '8px 16px', 
      backgroundColor: '#3b82f6', 
      color: 'white', 
      borderRadius: '4px', 
      border: 'none',
      cursor: 'pointer'
    }} 
    {...props}
  >
    {children}
  </button>
);

const meta: Meta<typeof SimpleButton> = {
  title: 'Test/SimpleButton',
  component: SimpleButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Simple Button',
  },
};

export const WithText: Story = {
  args: {
    children: 'Click me!',
  },
};