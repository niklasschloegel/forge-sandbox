import tsEslint from "typescript-eslint";
import importX from "eslint-plugin-import-x";

export const tsConfig = tsEslint.config({
  name: "ts",
  files: ["**/*.ts", "**/*.tsx"],
  extends: [...tsEslint.configs.recommendedTypeChecked, ...tsEslint.configs.stylisticTypeChecked, importX.configs.typescript],
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: process.env.TSCONFIG_ROOT_DIR,
    },
  },
  settings: {
    "import-x/resolver": {
      typescript: true,
      node: true,
    },
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": ["error", { allowTypedFunctionExpressions: true }],
    "@typescript-eslint/naming-convention": [
      "warn",
      {
        selector: "variable",
        format: ["camelCase"],
        leadingUnderscore: "allow",
      },
      {
        selector: ["variable", "function", "objectLiteralProperty", "objectLiteralMethod"],
        types: ["function"],
        format: ["PascalCase", "camelCase"],
      },
    ],
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/no-unnecessary-condition": "warn",
    "@typescript-eslint/no-unsafe-enum-comparison": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/unbound-method": "warn",
    "deprecation/deprecation": "error",
    "import-x/default": "off",
    "import-x/named": "off",
    "import-x/namespace": "off",
    "import-x/no-named-as-default-member": "off",
    "import-x/no-unresolved": "off",
  },
});
