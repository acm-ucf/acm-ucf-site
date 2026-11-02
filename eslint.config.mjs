import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginTs from "@typescript-eslint/eslint-plugin";

export default [
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      parser: "@typescript-eslint/parser",
    },
    plugins: {
      "@typescript-eslint": eslintPluginTs,
      prettier: eslintPluginPrettier,
    },
    rules: {
      // typcript recommended rules
      ...eslintPluginTs.configs.recommended.rules,
      // show formatting errors as ESLint errors
      "prettier/prettier": "error",
    },
    settings: {},
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
    },
    extends: [
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
      "next/core-web-vitals",
    ],
  },
];
