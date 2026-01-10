import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Wedding theme colors - #323C63, #839891, #9BB2C8, #D2B38F, #FFF5EC
      colors: {
        wedding: {
          // Primary colors - Calming Dark Blue (#323C63)
          primary: {
            50: '#f2f3f6',
            100: '#e5e7ed',
            200: '#c8cdd9',
            300: '#a8b0c4',
            400: '#6b7799',
            500: '#323C63',  // Main primary - Calming Dark Blue
            600: '#2d3659',
            700: '#262e4b',
            800: '#1f263d',
            900: '#181d2f',
            950: '#0f1220',
          },
          // Secondary/accent colors - Neutral Blue Gray (#8B9BAC)
          secondary: {
            50: '#f5f6f8',
            100: '#ebedf1',
            200: '#d6dbe3',
            300: '#bcc4d0',
            400: '#a3aebe',
            500: '#8B9BAC',  // Main secondary - Neutral Blue Gray
            600: '#76869a',
            700: '#626f80',
            800: '#505a68',
            900: '#424a55',
            950: '#2b3038',
          },
          // Neutral/background colors
          cream: '#FFF5EC',       // Seashell - main background
          ivory: '#ffffff',       // Pure white
          champagne: '#FFF5EC',   // Seashell
          seashell: '#FFF5EC',    // Seashell
          tan: '#D2B38F',         // Tan accent
          rockblue: '#9BB2C8',    // Rock Blue accent
          bluegray: '#8B9BAC',    // Neutral Blue Gray
          gold: '#D2B38F',        // Tan as gold alternative
          charcoal: '#323C63',    // Primary as charcoal
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
