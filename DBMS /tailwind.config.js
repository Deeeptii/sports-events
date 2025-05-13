/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary color (blues) - matches national Indian sports team colors
        blue: {
          50: '#e6f0fd',
          100: '#cce0fb',
          200: '#99c2f7',
          300: '#66a3f3',
          400: '#3385ef',
          500: '#1066eb',
          600: '#0d52bc',
          700: '#0a3d8d',
          800: '#06295e',
          900: '#03142f',
        },
        // Secondary color (greens)
        green: {
          50: '#e6f7f2',
          100: '#ccefe5',
          200: '#99dfcb',
          300: '#66cfb1',
          400: '#33bf97',
          500: '#00af7d',
          600: '#008c64',
          700: '#00694b',
          800: '#004632',
          900: '#002319',
        },
        // Accent color (oranges) - represents the orange from the Indian flag
        orange: {
          50: '#fff7e6',
          100: '#ffefc9',
          200: '#ffdf94',
          300: '#ffcf5e',
          400: '#ffbf29',
          500: '#FF9F00',
          600: '#e68f00',
          700: '#b36f00',
          800: '#7a4c00',
          900: '#3d2600',
        },
        // Warning color
        yellow: {
          50: '#fffbe6',
          100: '#fff7cc',
          200: '#ffef99',
          300: '#ffe766',
          400: '#ffdf33',
          500: '#ffd700',
          600: '#e6c200',
          700: '#b39500',
          800: '#7a6600',
          900: '#3d3300',
        },
        // Error color
        red: {
          50: '#ffe6e6',
          100: '#ffcccc',
          200: '#ff9999',
          300: '#ff6666',
          400: '#ff3333',
          500: '#ff0000',
          600: '#cc0000',
          700: '#990000',
          800: '#660000',
          900: '#330000',
        },
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      boxShadow: {
        'smooth': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'smooth-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
    },
  },
  plugins: [],
};