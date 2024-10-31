/** @type {FlatConfig[]} */
export const baseImportsAbsoluteConfig = [
  {
    name: "base-imports-absolute",
    rules: {
      "no-restricted-imports": ["error", { patterns: ["./*", "../*", "web/*", "app/*", "process", "console"] }],
    },
  },
];
