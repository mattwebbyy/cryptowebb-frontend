import type { Meta, StoryObj } from '@storybook/react';
import GoogleLoginButton from '../../src/components/auth/GoogleLoginButton';

const meta: Meta<typeof GoogleLoginButton> = {
  title: 'Auth/GoogleLoginButton',
  component: GoogleLoginButton,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[200px] bg-black p-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClick: () => console.log('Google login clicked')
  }
};

export const Disabled: Story = {
  args: {
    onClick: () => console.log('Google login clicked'),
    disabled: true
  }
};

export const OnLightBackground: Story = {
  args: {
    onClick: () => console.log('Google login clicked')
  },
  parameters: {
    backgrounds: { default: 'light' }
  },
  decorators: [
    (Story) => (
      <div className="min-h-[200px] bg-white p-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Story />
        </div>
      </div>
    ),
  ],
};

export const InForm: Story = {
  args: {
    onClick: () => console.log('Google login clicked')
  },
  decorators: [
    (Story) => (
      <div className="min-h-[400px] bg-black p-6 flex items-center justify-center">
        <div className="w-full max-w-md bg-black border border-matrix-green/30 rounded-lg p-6">
          <h2 className="text-matrix-green text-xl font-semibold text-center mb-6">Sign In</h2>
          
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 bg-black border border-matrix-green/50 text-matrix-green rounded focus:border-matrix-green outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 bg-black border border-matrix-green/50 text-matrix-green rounded focus:border-matrix-green outline-none"
            />
            <button className="w-full bg-matrix-green text-black py-2 rounded hover:bg-matrix-green/80 transition-colors">
              Sign In
            </button>
            
            <div className="relative my-4">
              <hr className="border-matrix-green/30" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-3 text-matrix-green/60 text-sm">
                or
              </span>
            </div>
            
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
};