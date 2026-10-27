/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111111',
        soft: '#f5f5f4',
        line: '#e7e5e4',
      },
      fontFamily: {
        sans: ['"Noto Sans Thai"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
