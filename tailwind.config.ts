import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Wedding theme colors - easily customizable
      colors: {
        wedding: {
          // Primary colors
          primary: {
            50: '#fdf8f6',
            100: '#f9ebe5',
            200: '#f3d5c8',
            300: '#e9b8a3',
            400: '#dc9478',
            500: '#c97856',  // Main primary
            600: '#b5623f',
            700: '#974f34',
            800: '#7c432f',
            900: '#673a2b',
            950: '#381c14',
          },
          // Secondary/accent colors
          secondary: {
            50: '#f6f7f6',
            100: '#e3e5e2',
            200: '#c6ccc4',
            300: '#a2ab9f',
            400: '#7d897a',
            500: '#626e5f',  // Main secondary
            600: '#4d574b',
            700: '#40473e',
            800: '#353b34',
            900: '#2e322d',
            950: '#181b18',
          },
          // Neutral/background colors
          cream: '#faf9f7',
          ivory: '#fffff0',
          champagne: '#f7e7ce',
          blush: '#fce4db',
          sage: '#9dc183',
          dustyrose: '#d4a5a5',
          gold: '#d4af37',
          charcoal: '#36454f',
        },
      },
      fontFamily: {
        // Elegant fonts for wedding theme
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        script: ['var(--font-script)', 'cursive'],
      },
      fontSize: {
        'display-lg': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['2rem', { lineHeight: '1.3' }],
      },
      spacing: {
        'section': '6rem',
        'section-mobile': '4rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionDuration: {
        '300': '300ms',
      },
    },
  },
  plugins: [],
};

export default config;
