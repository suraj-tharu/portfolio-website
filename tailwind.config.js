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
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38BDF8', // Primary
          500: '#38BDF8',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0f172a',
        },
        custom: {
          background: '#0A0F1F',
          surface: '#111827',
          primary: '#38BDF8',
          secondary: '#E5E7EB',
          text: '#FFFFFF',
          accent: '#D4AF37',
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
