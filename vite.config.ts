import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('highcharts') || id.includes('echarts')) return 'charts';
            if (id.includes('framer-motion')) return 'motion';
            if (
              id.includes('/react/') ||
              id.includes('/react-dom/') ||
              id.includes('react-router')
            ) {
              return 'react-vendor';
            }
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup-vitest.tsx',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    css: true,
  },
});
