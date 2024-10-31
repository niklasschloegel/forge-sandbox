import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

/** @type {FlatConfig[]} */
export const tsReactConfig = [
  {
    name: "ts-react",
    files: ["**/*.tsx"],
    ...react.configs.flat.recommended,
    ...react.configs.flat["jsx-runtime"],
    ...reactHooks.configs.recommended,
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    rules: {
      "react/jsx-no-leaked-render": ["error", { validStrategies: ["coerce", "ternary"] }],
      "react/jsx-sort-props": [
        "error",
        {
          shorthandLast: true,
          noSortAlphabetically: true,
          reservedFirst: true,
        },
      ],
      "react/prop-types": "off",
      "react/self-closing-comp": "error",
    },
  },
];
