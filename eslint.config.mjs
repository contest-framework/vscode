// @ts-check

import tslintPlugin from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import perfectionist from "eslint-plugin-perfectionist"

export default [
  {
    files: ["src/**/*.ts"],
    ignores: ["node_modules/", ".git/", "out/*", "text-runner/"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        console: "readonly",
        module: "readonly",
        process: "readonly"
      },
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json"
      },
      sourceType: "module"
    },
    plugins: {
      "@typescript-eslint": tslintPlugin
    },
    rules: {
      ...tslintPlugin.configs.recommended.rules,
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-implied-eval": "off",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unused-vars": "off", // TODO: enable?
      "@typescript-eslint/restrict-template-expressions": "off",
      "no-empty-function": "error",
      "prefer-const": [
        "error",
        {
          destructuring: "any",
          ignoreReadBeforeAssign: false
        }
      ]
    }
  },
  perfectionist.configs["recommended-natural"]
]
