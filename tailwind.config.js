/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
const tailwindFormPlugin = require("@tailwindcss/forms");

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "420px", // Replace 480px with your desired breakpoint value
        sm: '640px',
      },
      fontSize: {
        '3xs': '0.5rem',  // 8px
        '2xs': '0.625rem', // 10px
        "md": '0.9375rem',
      },
      boxShadow: {
        centered: "0 0 15px rgba(0, 0, 0, 0.1)",
      },
      colors: {
        primary: {
          800: withOpacity("--color-primary-800"),
          700: withOpacity("--color-primary-700"),
          600: withOpacity("--color-primary-600"),
          500: withOpacity("--color-primary-500"),
          400: withOpacity("--color-primary-400"),
          300: withOpacity("--color-primary-300"),
          200: withOpacity("--color-primary-200"),
          100: withOpacity("--color-primary-100"),
          50: withOpacity("--color-primary-50"),
        },
        secondary: {
          900: withOpacity("--color-secondary-900"),
          800: withOpacity("--color-secondary-800"),
          700: withOpacity("--color-secondary-700"),
          600: withOpacity("--color-secondary-600"),
          500: withOpacity("--color-secondary-500"),
          400: withOpacity("--color-secondary-400"),
          300: withOpacity("--color-secondary-300"),
          200: withOpacity("--color-secondary-200"),
          100: withOpacity("--color-secondary-100"),
          50: withOpacity("--color-secondary-50"),
          0: withOpacity("--color-secondary-0"),
        },
        success: withOpacity("--color-success"),
        warning: withOpacity("--color-warning"),
        error: withOpacity("--color-error"),
      },
      fontFamily: {
        sans: ["iransans", "Arial", "sans-serif"],
      },
      container: {
        center: true,
        padding: "1rem",
      },
    },
  },
  plugins: [
    tailwindFormPlugin({
      strategy: "class", // only generate classes
    }),
    require("tailwind-scrollbar")({ nocompatible: true }),
  ],
};
