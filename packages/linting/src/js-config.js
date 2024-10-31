import { jsNodeConfig } from "./js-node-config.js";

/** @type {FlatConfig[]} */
export const jsConfig = [
  {
    name: "js-module",
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
  {
    name: "js-commonjs",
    files: ["**/*.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
    },
  },
  ...jsNodeConfig.map((config) => ({
    ...config,
    files: ["*.js", "*.mjs", "*.cjs", "*.config.js"],
  })),
];
