/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f9ff',
          100: '#eaf3ff',
          300: '#93c5fd',
          500: '#3b82f6',
          600: '#2563eb',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          700: '#374151',
        },
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 6px 18px rgba(15, 23, 42, 0.06)',
        'card-hover': '0 10px 30px rgba(15, 23, 42, 0.08)',
        'modal': '0 20px 50px rgba(2,6,23,0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 180ms ease-out both',
        'slide-up': 'slide-up 220ms cubic-bezier(0.2,0.8,0.2,1) both',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

