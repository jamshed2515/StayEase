/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#1e3a5f',
          900: '#0b192c',
          950: '#060e1a',
        },
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // modern teal
          600: '#0d9488', // rich teal
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        gold: {
          50: '#fbf8f2',
          100: '#f5eee0',
          200: '#ebdcbe',
          300: '#dfc797',
          400: '#d4af62',
          500: '#c59b3f',
          600: '#ab8132',
          700: '#896429',
          800: '#6e4f24',
          900: '#5a4120',
        },
        sand: {
          50: '#faf9f6',
          100: '#f5f3ee',
          200: '#ebe6dd',
          300: '#ded5c6',
          400: '#ccbeaa',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        subtle: '0 2px 8px -1px rgba(11, 25, 44, 0.05), 0 1px 3px -1px rgba(11, 25, 44, 0.03)',
        card: '0 4px 20px -2px rgba(11, 25, 44, 0.06)',
        'card-hover': '0 12px 32px -4px rgba(11, 25, 44, 0.12)',
        teal: '0 4px 14px 0 rgba(13, 148, 136, 0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
