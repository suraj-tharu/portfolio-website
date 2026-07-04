/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan these files for class names to include in the build
  content: [
    './index.html',
    './src/**/*.js',
    './views/**/*.ejs'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', 'sans-serif'],
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#FDFCF6',
          100: '#F9F6E7',
          200: '#EFE7C6',
          300: '#E2D3A1',
          400: '#D4AF37', // Primary Classic Gold
          500: '#C5A032',
          600: '#AA8C2C',
          700: '#8E7525',
          800: '#75601E',
          900: '#5A4A17',
        },
        custom: {
          background: '#000000',
          surface: '#0A0A0A',
          primary: '#D4AF37',
          secondary: '#E5E4E2',
          text: '#FFFFFF',
          accent: '#8B7355',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(17, 24, 39, 0.6)', // Surface with opacity
          border: 'rgba(255, 255, 255, 0.1)',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};
