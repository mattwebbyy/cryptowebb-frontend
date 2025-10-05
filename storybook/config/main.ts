import type { StorybookConfig } from "@storybook/react-vite";
import path from 'path';

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../../src'),
    };
    
    // Handle Jest mock functions in Storybook environment
    config.define = {
      ...config.define,
      'global.jest': false,
    };
    
    return config;
  },
  env: (config) => ({
    ...config,
    // Mock environment variables for Storybook
    VITE_BACKEND_URL: 'http://localhost:8080',
    VITE_STRIPE_PUBLIC_KEY: 'pk_test_mock',
    VITE_USE_MOCK_DATA: 'true',
  }),
};
export default config;