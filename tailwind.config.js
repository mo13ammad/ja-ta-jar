/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["iransans", "Arial", "sans-serif"],
      },
      fontSize: {
        xs: "0.75rem",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    require('tailwindcss-gradients'),
  ],
};
