/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'], // <- use this
  content: ["./*.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        noto: ['"Noto Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
