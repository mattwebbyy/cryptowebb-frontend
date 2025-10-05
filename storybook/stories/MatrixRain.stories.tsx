import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MatrixRain } from '../../src/components/matrix/MatrixRain';

// Mock theme context for Storybook
const MockThemeProvider = ({ children, theme = 'dark' }: { children: React.ReactNode; theme?: 'light' | 'dark' }) => {
  const mockTheme = {
    mode: theme,
    toggleTheme: () => {},
  };

  // Simple mock context provider
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {React.cloneElement(children as React.ReactElement, { 
        mockTheme // Pass theme as prop for demo
      })}
    </div>
  );
};

// Demo version that works without theme context
const MatrixRainDemo = ({ theme = 'dark', className }: { theme?: 'light' | 'dark'; className?: string }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    
    // Matrix rain configuration
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    // Animation loop
    const draw = () => {
      const isLightMode = theme === 'light';
      if (isLightMode) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const opacity = Math.random() * 0.3 + 0.4;
        
        if (isLightMode) {
          ctx.fillStyle = `rgba(13, 115, 119, ${opacity})`;
        } else {
          ctx.fillStyle = `rgba(51, 255, 51, ${opacity})`;
        }

        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ 
        background: theme === 'light' ? '#ffffff' : '#000000',
        width: '100%',
        height: '100%',
      }}
    />
  );
};

const meta: Meta<typeof MatrixRainDemo> = {
  title: 'Matrix/MatrixRain',
  component: MatrixRainDemo,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const LightTheme: Story = {
  args: {
    theme: 'light',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const Contained: Story = {
  render: (args) => (
    <div style={{ 
      width: '600px', 
      height: '400px', 
      border: '2px solid #00ff00',
      borderRadius: '8px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <MatrixRainDemo {...args} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#00ff00',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
        fontFamily: 'monospace',
        textShadow: '0 0 10px #00ff00'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>MATRIX INTERFACE</h3>
        <p style={{ margin: 0, fontSize: '14px' }}>Connection Established</p>
      </div>
    </div>
  ),
  args: {
    theme: 'dark',
  },
};

export const BackgroundOverlay: Story = {
  render: (args) => (
    <div style={{ 
      width: '100%', 
      height: '500px', 
      position: 'relative',
      background: 'linear-gradient(135deg, #000 0%, #003300 50%, #000 100%)'
    }}>
      <MatrixRainDemo {...args} style={{ position: 'absolute', top: 0, left: 0, opacity: 0.3 }} />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#00ff00',
        fontFamily: 'monospace',
        textAlign: 'center',
        zIndex: 1
      }}>
        <h1 style={{ 
          fontSize: '48px', 
          margin: '0 0 20px 0', 
          textShadow: '0 0 20px #00ff00',
          animation: 'pulse 2s infinite'
        }}>
          CRYPTOWEBB
        </h1>
        <p style={{ fontSize: '18px', margin: '0 0 30px 0', opacity: 0.8 }}>
          Advanced Cryptocurrency Analytics Platform
        </p>
        <div style={{
          padding: '12px 24px',
          border: '2px solid #00ff00',
          borderRadius: '4px',
          backgroundColor: 'rgba(0, 255, 0, 0.1)',
          textShadow: '0 0 10px #00ff00'
        }}>
          ENTER THE MATRIX
        </div>
      </div>
    </div>
  ),
  args: {
    theme: 'dark',
  },
};