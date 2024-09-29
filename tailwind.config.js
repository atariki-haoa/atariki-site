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
      },
    },
  },
  plugins: [],
}

