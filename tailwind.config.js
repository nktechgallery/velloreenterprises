/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: { 500: '#C9A227', 400: '#e2b222', 600: '#a67c1a', 700: '#7d5b15' },
        fire: { 500: '#ff4d00', 600: '#e03200', 700: '#b82400' },
        dark: { 800: '#0d0d0d', 900: '#080808' },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A227 0%, #F5D76E 50%, #C9A227 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};
