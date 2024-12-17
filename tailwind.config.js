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
      maxWidth: {
        '8xl': '90rem', // adjust as needed
        '9xl': '100rem', // adjust as needed
      },
      spacing: {
        '128': '32rem',  // Add custom size (128 = 32rem)
        '144': '36rem',  // Add custom size (144 = 36rem)
        '160': '40rem',  // Add custom size (160 = 40rem)
        '192': '48rem',  // Add custom size (192 = 48rem)
      },
      colors: {
        gray: {
          150: '#e5e5e5', // Example value; replace with your desired shade
        },
      },
     
      screens: {
        xs: "420px", // Replace 480px with your desired breakpoint value
        sm: '640px',
        '3xl': '1620px'
      },
      fontSize: {
        '4xs': '0.375rem',  // 6px
        '3xs': '0.5rem',    // 8px
        '2xs': '0.625rem',   // 10px
        'md': '0.9375rem',   // ~15px
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
          75: withOpacity("--color-primary-75"),
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
