import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Comprehensive demo showcasing multiple components
const CryptoWebbDemo = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #001100 50%, #000000 100%)',
      color: '#ffffff',
      fontFamily: 'monospace'
    }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(8px)',
        padding: '16px 0',
        borderBottom: '1px solid rgba(0, 255, 0, 0.3)',
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#00ff00',
            textShadow: '0 0 10px #00ff00'
          }}>
            CRYPTOWEBB
          </div>
          <nav style={{ display: 'flex', gap: '24px' }}>
            {['Dashboard', 'Analytics', 'Portfolio', 'Settings'].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  border: '1px solid transparent',
                  borderRadius: '4px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#00ff00';
                  e.currentTarget.style.borderColor = '#00ff00';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '40px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Hero Section */}
          <div style={{
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            <h1 style={{
              fontSize: '48px',
              margin: '0 0 16px 0',
              color: '#00ff00',
              textShadow: '0 0 20px #00ff00',
              animation: 'pulse 2s infinite'
            }}>
              ENTER THE MATRIX
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#64748b',
              margin: '0 0 32px 0'
            }}>
              Advanced Cryptocurrency Analytics & Portfolio Management
            </p>
            <button style={{
              padding: '12px 32px',
              background: 'transparent',
              border: '2px solid #00ff00',
              color: '#00ff00',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#00ff00';
              e.currentTarget.style.color = '#000000';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#00ff00';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              Connect to Network
            </button>
          </div>

          {/* Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '60px'
          }}>
            {/* Price Cards */}
            {[
              { name: 'Bitcoin', price: '$45,234.56', change: '+2.45%', positive: true },
              { name: 'Ethereum', price: '$3,124.78', change: '-1.23%', positive: false },
              { name: 'Cardano', price: '$0.456789', change: '+5.67%', positive: true },
            ].map((crypto) => (
              <div key={crypto.name} style={{
                background: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(0, 255, 0, 0.3)',
                borderRadius: '12px',
                padding: '24px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 255, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <h3 style={{ margin: 0, color: '#ffffff' }}>{crypto.name}</h3>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#00ff00',
                    boxShadow: '0 0 8px #00ff00',
                    animation: 'pulse 2s infinite'
                  }} />
                </div>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: crypto.positive ? '#00ff00' : '#ef4444',
                  marginBottom: '8px'
                }}>
                  {crypto.price}
                </div>
                <div style={{
                  color: crypto.positive ? '#00ff00' : '#ef4444',
                  fontSize: '14px'
                }}>
                  {crypto.change}
                </div>
                <div style={{
                  marginTop: '16px',
                  fontSize: '12px',
                  color: '#64748b'
                }}>
                  Last update: {new Date().toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                title: 'Real-time Analytics',
                description: 'Live cryptocurrency data with advanced technical indicators',
                icon: '📊'
              },
              {
                title: 'Portfolio Tracking',
                description: 'Monitor your investments across multiple exchanges',
                icon: '💰'
              },
              {
                title: 'Risk Management',
                description: 'Advanced alerts and risk assessment tools',
                icon: '🛡️'
              },
              {
                title: 'Market Intelligence',
                description: 'AI-powered insights and market predictions',
                icon: '🤖'
              }
            ].map((feature) => (
              <div key={feature.title} style={{
                background: 'rgba(0, 255, 0, 0.05)',
                border: '1px solid rgba(0, 255, 0, 0.2)',
                borderRadius: '8px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  margin: '0 0 12px 0',
                  color: '#00ff00',
                  fontSize: '18px'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  margin: 0,
                  color: '#64748b',
                  lineHeight: '1.5'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: 'rgba(0, 0, 0, 0.9)',
        borderTop: '1px solid rgba(0, 255, 0, 0.3)',
        padding: '24px 0',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 16px',
          color: 'rgba(0, 255, 0, 0.7)'
        }}>
          <p style={{ margin: 0 }}>
            &copy; 2024 CryptoWebb. All rights reserved. | Secure • Private • Advanced
          </p>
        </div>
      </footer>
    </div>
  );
};

const meta: Meta<typeof CryptoWebbDemo> = {
  title: 'CryptoWebb/Full Demo',
  component: CryptoWebbDemo,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FullPlatformDemo: Story = {
  render: () => <CryptoWebbDemo />,
};