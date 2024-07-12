/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["iranSans", "Arial", "sans-serif"],
      },
      boxShadow: {
        'spread-lg': '0 10px 20px rgba(0, 0, 0, 0.25)',
        'spread-xl': '0 15px 30px rgba(0, 0, 0, 0.35)',
        'spread-2xl': '0 20px 40px rgba(0, 0, 0, 0.45)',
      },
    },
  },
  plugins: [],
};
