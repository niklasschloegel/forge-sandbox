/** @type {FlatConfig[]} */
export const baseImportsRelativeConfig = [
  {
    name: "base-imports-relative",
    rules: {
      "no-restricted-imports": ["error", { patterns: ["!./*", "!../*", "web/*", "app/*", "process", "console"] }],
    },
  },
];
