/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#030508',
          900: '#05070B',
          850: '#080C14',
          800: '#0F1420',
          700: '#151D2F',
        },
        electric: {
          blue: '#2E7BFF',
          glow: '#14388C',
          cyan: '#38BDF8',
          deep: '#0F2557',
        },
        slate: {
          muted: '#6E7A94',
          silver: '#9FA9BC',
        }
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(46, 123, 255, 0.25)',
        'glow-md': '0 0 25px rgba(46, 123, 255, 0.35)',
        'glow-lg': '0 0 40px rgba(46, 123, 255, 0.45)',
        'glow-cyan': '0 0 20px rgba(56, 189, 248, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(46, 123, 255, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.55)',
      },
      borderRadius: {
        'card': '20px',
        'pill': '9999px',
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 18s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
