/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'blue-pastel-dark': '#1e3a8a',
        'yellow-accent': '#fbbf24',
        term: {
          bg: '#0a0b0f',
          panel: '#12141b',
          panelAlt: '#181b24',
          terminal: '#0d0f14',
          border: '#262b38',
          text: '#eef0f4',
          sub: '#a8afbe',
          muted: '#8b93a3',
          dim: '#6b7280',
          blue: '#5b93ff',
          blueHover: '#7fabff',
          purple: '#a68bfa',
          green: '#4ade80',
          amber: '#fbbf24',
          red: '#f87171',
        },
      },
      fontFamily: {
        mono: ['"Fira Code"', 'monospace'],
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        fadeUp: 'fadeUp 0.5s ease-out',
      },
    },
  },
  plugins: [],
}

