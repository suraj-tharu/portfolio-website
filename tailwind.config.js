/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan these files for class names to include in the build
  content: [
    './index.html',
    './app.js',
    './*.html',
    './*.js',
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
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0f172a',
        },
      },
    },
  },
  plugins: [],
};
