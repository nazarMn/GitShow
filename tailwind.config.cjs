const utilityClasses = require('./src/shared/lib/tailwindClasses.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  safelist: [...new Set(Object.values(utilityClasses).flatMap((value) => value.split(/\s+/)))],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      fontFamily: { sans: ['Montserrat', 'sans-serif'] },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(5px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
