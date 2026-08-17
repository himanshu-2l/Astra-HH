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
          950: '#04070d',
          900: '#080c14',
          850: '#0c121e',
          800: '#111827',
          700: '#1f293d'
        },
        cosmic: {
          purple: '#a855f7',
          violet: '#8b5cf6',
          cyan: '#06b6d4',
          neon: '#22d3ee',
          green: '#10b981',
          rose: '#f43f5e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-purple': '0 0 30px -5px rgba(168, 85, 247, 0.25)',
        'glow-cyan': '0 0 30px -5px rgba(6, 182, 212, 0.25)',
        'glow-green': '0 0 30px -5px rgba(16, 185, 129, 0.25)',
        'glow-rose': '0 0 30px -5px rgba(244, 63, 94, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 1.5s linear infinite',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.95)', opacity: '1' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
