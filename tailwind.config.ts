import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Wedding theme colors - elegant white and blue
      colors: {
        wedding: {
          // Primary colors - elegant blue
          primary: {
            50: '#f0f7ff',
            100: '#e0efff',
            200: '#baddff',
            300: '#7cc2ff',
            400: '#36a3ff',
            500: '#0c84eb',  // Main primary - elegant blue
            600: '#0068c9',
            700: '#0053a3',
            800: '#004686',
            900: '#003b6f',
            950: '#00254a',
          },
          // Secondary/accent colors - soft slate blue
          secondary: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',  // Main secondary
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
            950: '#020617',
          },
          // Neutral/background colors
          cream: '#fafbfc',
          ivory: '#ffffff',
          champagne: '#f8fafc',
          blush: '#e0efff',
          sage: '#7cc2ff',
          dustyrose: '#baddff',
          gold: '#0c84eb',
          charcoal: '#1e293b',
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
