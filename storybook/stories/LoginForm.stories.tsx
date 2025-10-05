import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Simplified mock LoginForm for Storybook
const MockLoginForm = ({ 
  error, 
  isSubmitting = false,
  isProcessingOAuth = false 
}: { 
  error?: string; 
  isSubmitting?: boolean;
  isProcessingOAuth?: boolean;
}) => {
  const [formData, setFormData] = React.useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempted with:', formData);
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '0 auto',
      padding: '32px',
      background: 'rgba(0, 0, 0, 0.9)',
      border: '1px solid #00ff00',
      borderRadius: '8px',
      fontFamily: 'monospace'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ 
          color: '#00ff00', 
          textShadow: '0 0 10px #00ff00',
          fontSize: '24px',
          margin: '0 0 8px 0'
        }}>
          MATRIX ACCESS
        </h2>
        <p style={{ color: '#64748b', margin: 0 }}>
          Enter your credentials to connect to the network
        </p>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #ef4444',
          color: '#ef4444',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '24px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            color: '#00ff00',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            EMAIL
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="user@cryptowebb.com"
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid #374151',
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none'
            }}
            disabled={isSubmitting || isProcessingOAuth}
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            color: '#00ff00',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            PASSWORD
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid #374151',
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none'
            }}
            disabled={isSubmitting || isProcessingOAuth}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isProcessingOAuth}
          style={{
            width: '100%',
            padding: '12px',
            background: isSubmitting ? '#374151' : '#00ff00',
            color: isSubmitting ? '#9ca3af' : '#000000',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          {isSubmitting ? 'CONNECTING...' : 'ENTER MATRIX'}
        </button>

        <div style={{ position: 'relative', textAlign: 'center', margin: '16px 0' }}>
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: 0, 
            right: 0, 
            height: '1px', 
            background: '#374151' 
          }}></div>
          <span style={{ 
            background: 'rgba(0, 0, 0, 0.9)', 
            padding: '0 16px', 
            color: '#64748b',
            fontSize: '14px'
          }}>
            OR
          </span>
        </div>

        <button
          type="button"
          disabled={isSubmitting || isProcessingOAuth}
          style={{
            width: '100%',
            padding: '12px',
            background: 'transparent',
            color: '#ffffff',
            border: '1px solid #374151',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: isProcessingOAuth ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span style={{ color: '#db4437' }}>📧</span>
          {isProcessingOAuth ? 'Processing...' : 'Continue with Google'}
        </button>
      </form>

      <div style={{ 
        textAlign: 'center', 
        marginTop: '24px', 
        fontSize: '14px', 
        color: '#64748b' 
      }}>
        Need access? <span style={{ color: '#00ff00', cursor: 'pointer' }}>Request invitation</span>
      </div>
    </div>
  );
};

const meta: Meta<typeof MockLoginForm> = {
  title: 'Auth/LoginForm',
  component: MockLoginForm,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
        { name: 'matrix', value: 'linear-gradient(135deg, #000000 0%, #001100 100%)' },
      ],
    },
  },
  argTypes: {
    error: { control: 'text' },
    isSubmitting: { control: 'boolean' },
    isProcessingOAuth: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithError: Story = {
  args: {
    error: 'Invalid credentials. Access denied.',
  },
};

export const Loading: Story = {
  args: {
    isSubmitting: true,
  },
};

export const ProcessingOAuth: Story = {
  args: {
    isProcessingOAuth: true,
  },
};

export const NetworkError: Story = {
  args: {
    error: 'Connection to matrix servers failed. Please check your network and try again.',
  },
};