import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from '../../src/components/ui/alert';

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Info icon component for stories
const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

// Alert icon component for stories
const AlertTriangleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="m12 17 .01 0" />
  </svg>
);

export const Default: Story = {
  args: {
    variant: 'default',
    children: (
      <>
        <InfoIcon />
        <AlertTitle>System Status</AlertTitle>
        <AlertDescription>
          Your connection to the matrix is secure and all systems are operational.
        </AlertDescription>
      </>
    ),
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: (
      <>
        <AlertTriangleIcon />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Connection to the matrix has been compromised. Please check your security protocols.
        </AlertDescription>
      </>
    ),
  },
};

export const SimpleDefault: Story = {
  args: {
    variant: 'default',
    children: (
      <AlertDescription>
        This is a simple alert without a title or icon.
      </AlertDescription>
    ),
  },
};

export const SimpleDestructive: Story = {
  args: {
    variant: 'destructive',
    children: (
      <AlertDescription>
        This is a simple destructive alert without a title or icon.
      </AlertDescription>
    ),
  },
};

export const WithoutIcon: Story = {
  args: {
    variant: 'default',
    children: (
      <>
        <AlertTitle>Matrix Protocol Update</AlertTitle>
        <AlertDescription>
          New security features have been deployed to enhance your data protection and analytical capabilities.
        </AlertDescription>
      </>
    ),
  },
};

export const LongContent: Story = {
  args: {
    variant: 'default',
    children: (
      <>
        <InfoIcon />
        <AlertTitle>Detailed System Information</AlertTitle>
        <AlertDescription>
          <p>The CryptoWebb analytics platform has successfully processed your latest data batch. Here's what happened:</p>
          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            <li>Analyzed 1,247 cryptocurrency transactions</li>
            <li>Updated 15 portfolio metrics</li>
            <li>Generated 3 new market insights</li>
            <li>Synchronized with 8 external data sources</li>
          </ul>
          <p style={{ marginTop: '8px' }}>All operations completed successfully with zero errors.</p>
        </AlertDescription>
      </>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
      <Alert variant="default">
        <InfoIcon />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Matrix connection established successfully. All systems operational.
        </AlertDescription>
      </Alert>
      
      <Alert variant="destructive">
        <AlertTriangleIcon />
        <AlertTitle>Critical Error</AlertTitle>
        <AlertDescription>
          Security breach detected. Immediate action required to secure your data.
        </AlertDescription>
      </Alert>
    </div>
  ),
};