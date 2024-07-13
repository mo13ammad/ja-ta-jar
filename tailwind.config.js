/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["iranSans", "Arial", "sans-serif"],
      },

      fontSize: {
        xs: "0.75rem",
      },
    
    },
  },
  plugins: [],
};
