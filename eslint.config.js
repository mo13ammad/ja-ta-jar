import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-plugin-prettier";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier, // Added Prettier plugin
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,

      // Prettier rules
      "prettier/prettier": "warn",

      // React-specific rules
      "react/jsx-no-target-blank": "off",
      "react/prop-types": "off", // Disable if you're using TypeScript
      "react/react-in-jsx-scope": "off", // Not needed for React 17+
      "react/jsx-key": "error", // Enforce keys in lists
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-uses-react": "off", // Not needed for React 17+
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
];
