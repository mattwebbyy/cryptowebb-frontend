/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'matrix-green': '#33ff33',
        matrix: {
          green: '#33ff33',
          dark: '#001400',
        },
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
            '--tw-prose-body': theme('colors.gray[300]'),
            '--tw-prose-headings': theme('colors.matrix-green'),
            '--tw-prose-links': theme('colors.matrix-green'),
            '--tw-prose-bold': theme('colors.white'),
            '--tw-prose-counters': theme('colors.matrix-green'),
            '--tw-prose-bullets': theme('colors.matrix-green'),
            '--tw-prose-hr': theme('colors.matrix-green'),
            '--tw-prose-quotes': theme('colors.gray[400]'),
            '--tw-prose-quote-borders': theme('colors.matrix-green'),
            '--tw-prose-captions': theme('colors.gray[400]'),
            '--tw-prose-code': theme('colors.matrix-green'),
            '--tw-prose-pre-code': theme('colors.matrix-green'),
            '--tw-prose-pre-bg': 'rgba(0, 0, 0, 0.5)',
            '--tw-prose-pre-border': theme('colors.matrix-green'),
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
