/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Matrix theme colors for dark mode
        'matrix-green': '#33ff33',
        'matrix-dark': '#001400',
        matrix: {
          green: '#33ff33',
          dark: '#001400',
          dim: '#22aa22',
        },
        // Teal colors for light mode (keep existing teal palette)
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Dynamic theme colors using CSS variables
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        text: {
          DEFAULT: 'var(--color-text)',
          secondary: 'var(--color-text-secondary)',
        },
        border: 'var(--color-border)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
        success: 'var(--color-success)',
        // Opacity variations
        'primary-10': 'var(--color-primary-10)',
        'primary-20': 'var(--color-primary-20)',
        'primary-30': 'var(--color-primary-30)',
        'primary-50': 'var(--color-primary-50)',
        'primary-70': 'var(--color-primary-70)',
        'primary-90': 'var(--color-primary-90)',
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'],
      },
      animation: {
        'matrix-rain': 'matrix-rain 20s linear infinite',
        float: 'float 20s linear infinite',
        glitch: 'glitch 1s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--color-text-secondary)',
            '--tw-prose-headings': 'var(--color-primary)',
            '--tw-prose-links': 'var(--color-primary)',
            '--tw-prose-bold': 'var(--color-text)',
            '--tw-prose-counters': 'var(--color-primary)',
            '--tw-prose-bullets': 'var(--color-primary)',
            '--tw-prose-hr': 'var(--color-border)',
            '--tw-prose-quotes': 'var(--color-text-secondary)',
            '--tw-prose-quote-borders': 'var(--color-primary)',
            '--tw-prose-captions': 'var(--color-text-secondary)',
            '--tw-prose-code': 'var(--color-primary)',
            '--tw-prose-pre-code': 'var(--color-primary)',
            '--tw-prose-pre-bg': 'var(--color-surface)',
            '--tw-prose-pre-border': 'var(--color-border)',
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography')({
      className: 'prose', // This is important
    }),
  ],
};
