/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts, tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#ffd700',
        lavender: '#e6e6fa',
      },
    },
  },
  plugins: [],
}

