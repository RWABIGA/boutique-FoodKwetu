import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand palette (from brand guidelines) ──────────────────
        forest: {
          950: '#0d2a1f',
          900: '#1B4D3B',  // primary dark
          800: '#225e49',
          700: '#2d7a5e',
          600: '#3a9474',
          100: '#d0e9e2',
          50:  '#eaf4f0',
        },
        river: {
          700: '#3a8a8e',
          600: '#4da3a8',
          500: '#67B8BC',  // accent teal
          400: '#89cacf',
          300: '#aadade',
          100: '#d6f0f2',
          50:  '#edfafb',
        },
        mint: {
          500: '#40B9AC',
          400: '#5ec9bd',
          300: '#84d8ce',
          100: '#c8efeb',
          50:  '#e8f9f7',
        },
        pale: {
          500: '#63F8B5',
          100: '#d3fce9',
          50:  '#edfff6',
        },
        cream: '#F5F7F5',
        // ── Legacy aliases (used by existing components) ────────────
        primary: {
          950: '#0d2a1f',
          900: '#1B4D3B',
          800: '#225e49',
          700: '#2d7a5e',
          600: '#3a9474',
          100: '#d0e9e2',
          50:  '#eaf4f0',
        },
        gold: {
          700: '#3a8a8e',
          600: '#4da3a8',
          500: '#67B8BC',
          400: '#89cacf',
          300: '#aadade',
          100: '#d6f0f2',
          50:  '#edfafb',
        },
      },
      fontFamily: {
        heading: ['Karla', 'sans-serif'],
        body:    ['Karla', 'sans-serif'],
        karla:   ['Karla', 'sans-serif'],
      },
      animation: {
        'float-up':    'floatUp 0.7s ease-out forwards',
        'bounce-cart': 'bounceCart 0.5s ease-out',
        'fade-in':     'fadeIn 0.3s ease-out',
        'slide-up':    'slideUp 0.4s ease-out',
        'scale-in':    'scaleIn 0.25s ease-out',
      },
      keyframes: {
        floatUp: {
          '0%':   { opacity: '1', transform: 'translateY(0) scale(1.2)' },
          '80%':  { opacity: '0.6' },
          '100%': { opacity: '0', transform: 'translateY(-36px) scale(0.8)' },
        },
        bounceCart: {
          '0%':   { transform: 'scale(1)' },
          '35%':  { transform: 'scale(1.4)' },
          '65%':  { transform: 'scale(0.88)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
