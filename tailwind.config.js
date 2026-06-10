/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan these files for class names to include in the build
  content: [
    './index.html',
    './app.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Syne', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0f9ff',
          400: '#38bdf8',
          500: '#0ea5e9',
          900: '#0f172a',
        },
      },
    },
  },
  plugins: [],
};
