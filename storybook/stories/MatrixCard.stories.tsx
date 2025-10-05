import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Matrix-themed card component
interface MatrixCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const MatrixCard = ({ title, children, className = '', ...props }: MatrixCardProps) => {
  return (
    <div className={`card ${className}`} {...props}>
      {title && <h3 className="matrix-text" style={{ marginTop: 0, marginBottom: '12px' }}>{title}</h3>}
      <div>{children}</div>
    </div>
  );
};

const meta: Meta<typeof MatrixCard> = {
  title: 'Styled/MatrixCard',
  component: MatrixCard,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: 'System Status',
    children: 'Connection established. All systems operational.',
  },
};

export const WithoutTitle: Story = {
  args: {
    children: 'This is a card without a title. It still has the Matrix-themed styling.',
  },
};

export const WithButton: Story = {
  render: () => (
    <MatrixCard title="Access Terminal">
      <p>Enter the Matrix and access encrypted data streams.</p>
      <button className="btn btn-primary" style={{ marginTop: '12px' }}>
        CONNECT
      </button>
    </MatrixCard>
  ),
};

export const MultipleCards: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
      <MatrixCard title="User Status">
        <div className="matrix-text">ONLINE</div>
        <p>Session active for 2h 34m</p>
      </MatrixCard>
      
      <MatrixCard title="System Metrics">
        <p>CPU: <span className="matrix-text">23%</span></p>
        <p>Memory: <span className="matrix-text">1.2GB</span></p>
        <p>Network: <span className="matrix-text">Active</span></p>
      </MatrixCard>
      
      <MatrixCard title="Security">
        <p>Firewall: <span className="matrix-text">ENABLED</span></p>
        <p>Encryption: <span className="matrix-text">AES-256</span></p>
        <div className="loading" style={{ marginTop: '8px' }}></div>
      </MatrixCard>
    </div>
  ),
};