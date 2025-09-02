import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        caviar: {
          50: '#ffe8e1',
          100: '#ffd1c4',
          200: '#ffa690',
          300: '#ff7b5b',
          400: '#ff4f26',
          500: '#e53d18',
          600: '#c43010',
          700: '#a22309',
          800: '#811603',
          900: '#610c00'
        },
        gold: {
          100: '#f5e6c0',
          200: '#ecd28f',
          300: '#e3be5e',
          400: '#d4af37',
          500: '#b8951f'
        },
        graphite: {
          900: '#0b0d10',
          800: '#111317',
          700: '#161a1f',
          600: '#1d2329',
          500: '#252c34',
          400: '#313a44',
          300: '#3d4853'
        }
      },
      borderRadius: {
        xl: '1.25rem'
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(0,0,0,.4)',
        glow: '0 0 0 1px rgba(255,255,255,.04), 0 8px 40px -6px rgba(229,61,24,.45)'
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif']
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(.4,0,.2,1)'
      }
    }
  },
  plugins: []
}
export default config
