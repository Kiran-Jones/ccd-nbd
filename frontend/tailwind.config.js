/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'dartmouth-green': '#00693E',
        'dartmouth-green-web': '#006633',
        'forest-green': '#003D1C',
        'snow-white': '#FFFFFF',
        'midnight-black': '#000000',

        // Grays
        'gray-100': '#F5F5F5',
        'gray-200': '#E5E5E5',
        'gray-300': '#D4D4D4',
        'gray-400': '#A3A3A3',
        'gray-500': '#737373',
        'gray-600': '#525252',
        'gray-700': '#404040',
        'gray-800': '#262626',

        // Tertiary - Warm
        'autumn-brown': '#643C20',
        'bonfire-red': '#9D162E',
        'tuck-orange': '#E32D1C',
        'bonfire-orange': '#FFA00F',
        'summer-yellow': '#F5DC96',

        // Tertiary - Cool
        'spring-green': '#C4DD88',
        'rich-spring-green': '#A5D75F',
        'river-navy': '#003C73',
        'river-blue': '#267ABA',
        'web-violet': '#8A6996',

        // Semantic
        'success-bg': '#E8F5E9',
        'success-text': '#1B5E20',
        'warning-bg': '#FFF9E6',
        'warning-text': '#663C00',
        'error-bg': '#FFEBEE',
        'error-text': '#5F0000',
        'info-bg': '#E3F2FD',
        'info-text': '#004A7C',
      },
      fontFamily: {
        serif: ["'Dartmouth Ruzicka'", 'Georgia', "'EB Garamond'", 'serif'],
        sans: ["'National 2'", 'Arial', 'Aptos', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.4' }],
        sm: ['0.875rem', { lineHeight: '1.5' }],
        base: ['1rem', { lineHeight: '1.6' }],
        lg: ['1.125rem', { lineHeight: '1.6' }],
        xl: ['1.25rem', { lineHeight: '1.5' }],
        '2xl': ['1.5rem', { lineHeight: '1.4' }],
        '3xl': ['1.75rem', { lineHeight: '1.4' }],
        '4xl': ['2.25rem', { lineHeight: '1.3' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '6rem',
        '5xl': '8rem',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
        'green-sm': '0 2px 4px rgba(0, 105, 62, 0.1)',
        'green-md': '0 4px 8px rgba(0, 105, 62, 0.15)',
        'green-lg': '0 8px 16px rgba(0, 105, 62, 0.2)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
      },
    },
  },
  plugins: [],
};
