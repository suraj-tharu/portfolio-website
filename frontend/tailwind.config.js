/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "text-primary": "var(--text)",
        "text-secondary": "var(--text-secondary)",
        muted: "var(--muted)",
        stroke: "var(--stroke)",
        brand: {
          400: "var(--brand-light)",
          500: "var(--brand)",
          600: "var(--brand-dark)",
        },
        "luxury-gold": { 400: "#F3E5AB", 500: "#D4AF37", 600: "#AA8C2C" },
        "obsidian": { 800: "#111111", 900: "#0a0a0a", 950: "#050505" },
        "pearl": { 100: "#FDFDFD", 200: "#F9F9F9", 300: "#F0F0F0" }
      },
      fontFamily: {
        body: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Syne', '"Playfair Display"', 'serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        kanit: ['Kanit', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
        helvetica: ['"Helvetica Now Var"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif']
      },
      fontSize: {
        'fluid-xs': 'clamp(0.75rem, 0.7vw + 0.5rem, 0.875rem)',
        'fluid-sm': 'clamp(0.875rem, 0.8vw + 0.5rem, 1rem)',
        'fluid-base': 'clamp(1rem, 1vw + 0.5rem, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 1.2vw + 0.5rem, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 1.5vw + 0.5rem, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 2vw + 0.5rem, 2rem)',
        'fluid-3xl': 'clamp(2rem, 3vw + 0.5rem, 3rem)',
        'fluid-4xl': 'clamp(2.5rem, 4vw + 0.5rem, 4rem)',
        'fluid-5xl': 'clamp(3rem, 5vw + 0.5rem, 5rem)',
        'fluid-6xl': 'clamp(3.5rem, 6vw + 0.5rem, 6.5rem)',
        'fluid-7xl': 'clamp(4rem, 7vw + 0.5rem, 8rem)',
        'fluid-8xl': 'clamp(4.5rem, 8vw + 0.5rem, 10rem)',
        'fluid-9xl': 'clamp(5rem, 10vw + 0.5rem, 14rem)',
      },
      animation: {
        'scroll-down': 'scroll-down 1.5s ease-in-out infinite',
        'role-fade-in': 'role-fade-in 0.4s ease-out',
        'gradient-shift': 'gradient-shift 6s ease infinite',
        'noise': 'noise 1s steps(2) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'blob': 'blob 7s infinite',
        'luxury-float': 'luxury-float 5s cubic-bezier(0.4, 0.0, 0.2, 1) infinite',
        'ambient-breathe': 'ambient-breathe 4s ease-in-out infinite',
        'luxury-pulse': 'luxury-pulse 2s infinite',
        'luxury-shine': 'luxury-shine 3s infinite',
        'mesh': 'mesh 15s ease-in-out infinite alternate',
      },
      keyframes: {
        'scroll-down': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' },
        },
        'role-fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'noise': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -5%)' },
          '20%': { transform: 'translate(-10%, 5%)' },
          '30%': { transform: 'translate(5%, -10%)' },
          '40%': { transform: 'translate(-5%, 15%)' },
          '50%': { transform: 'translate(-10%, 5%)' },
          '60%': { transform: 'translate(15%, 0)' },
          '70%': { transform: 'translate(0, 10%)' },
          '80%': { transform: 'translate(-15%, 0)' },
          '90%': { transform: 'translate(10%, 5%)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.8', boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '50%': { opacity: '1', boxShadow: '0 0 40px rgba(139, 92, 246, 0.5)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1200px 0' },
          '100%': { backgroundPosition: '1200px 0' },
        },
        'blob': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        'luxury-float': {
          '0%, 100%': { transform: 'translateY(0px) rotateZ(0deg)', opacity: '0.8' },
          '25%': { transform: 'translateY(-8px) rotateZ(0.5deg)', opacity: '0.9' },
          '50%': { transform: 'translateY(-16px) rotateZ(0deg)', opacity: '1' },
          '75%': { transform: 'translateY(-8px) rotateZ(-0.5deg)', opacity: '0.9' },
        },
        'ambient-breathe': {
          '0%, 100%': { opacity: '0.4', filter: 'blur(0px) brightness(1)' },
          '50%': { opacity: '0.6', filter: 'blur(1px) brightness(1.1)' },
        },
        'luxury-pulse': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(139, 92, 246, 0.7)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 0 10px rgba(139, 92, 246, 0)' },
        },
        'luxury-shine': {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        'mesh': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
      },
      boxShadow: {
        'sm-premium': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md-premium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg-premium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl-premium': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl-premium': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'luxury': '0 0 20px rgba(139, 92, 246, 0.3), 0 0 60px rgba(139, 92, 246, 0.15)',
        'luxury-strong': '0 0 30px rgba(139, 92, 246, 0.5), 0 0 80px rgba(139, 92, 246, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
        '8.5': '2.125rem',
      },
      transitionTimingFunction: {
        'custom': 'cubic-bezier(0.23, 1, 0.320, 1)',
        'smooth': 'cubic-bezier(0.23, 1, 0.320, 1)',
        'bounce-smooth': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)',
      }
    },
  },
  plugins: [],
}
