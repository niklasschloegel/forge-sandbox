import reactRefresh from "eslint-plugin-react-refresh";

/** @type {FlatConfig[]} */
export const tsReactHmrConfig = [
  {
    name: "ts-react-hmr",
    files: ["**/*.tsx"],
    plugins: {
      "react-refresh": reactRefresh,
    },
    rules: {
      "react-refresh/only-export-components": ["error", { allowConstantExport: true }],
    },
  },
];
