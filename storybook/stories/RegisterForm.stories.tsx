import type { Meta, StoryObj } from '@storybook/react';
import { ToastContainer } from 'react-toastify';
import { RegisterForm } from '../../src/components/auth/RegisterForm';

// Mock fetch for form submission
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: 'Registration successful' }),
  })
) as jest.Mock;

const meta: Meta<typeof RegisterForm> = {
  title: 'Auth/RegisterForm',
  component: RegisterForm,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <Story />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithMatrixBackground: Story = {
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black relative flex items-center justify-center p-6">
          {/* Matrix rain background effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="matrix-rain-container">
              {Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={i}
                  className="matrix-rain-column"
                  style={{
                    left: `${(i * 2)}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${3 + Math.random() * 3}s`
                  }}
                >
                  {Array.from({ length: 20 }).map((_, j) => (
                    <span
                      key={j}
                      className="matrix-rain-char text-matrix-green opacity-50"
                      style={{
                        animationDelay: `${j * 0.1}s`
                      }}
                    >
                      {String.fromCharCode(0x30A0 + Math.random() * 96)}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative z-10">
            <Story />
          </div>
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        <style jsx>{`
          .matrix-rain-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          
          .matrix-rain-column {
            position: absolute;
            top: -100%;
            width: 20px;
            animation: matrix-fall linear infinite;
          }
          
          .matrix-rain-char {
            display: block;
            font-size: 14px;
            line-height: 20px;
            font-family: 'Courier New', monospace;
          }
          
          @keyframes matrix-fall {
            0% {
              transform: translateY(-100vh);
            }
            100% {
              transform: translateY(100vh);
            }
          }
        `}</style>
      </div>
    ),
  ],
};

export const FormError: Story = {
  decorators: [
    (Story) => {
      // Mock fetch to simulate error
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: 'Email already exists' }),
        })
      ) as jest.Mock;
      
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
          <Story />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      );
    },
  ],
};