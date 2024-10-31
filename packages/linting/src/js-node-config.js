import globals from "globals";

/** @type {FlatConfig[]} */
export const jsNodeConfig = [
  {
    name: "js-node",
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "import-x/no-default-export": "off",
      "no-restricted-imports": "off",
    },
  },
];
