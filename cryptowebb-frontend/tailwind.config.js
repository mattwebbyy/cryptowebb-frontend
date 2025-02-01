/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
        'float': 'float 20s linear infinite',
        'glitch': 'glitch 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}