import jest from "eslint-plugin-jest";
import globals from "globals";

const { env: _, ...jestConfig } = jest.configs.recommended;

/** @type {FlatConfig[]} */
export const tsTestConfig = [
  {
    name: "ts-test-specs",
    files: ["**/*.spec.ts"],
    ...jestConfig,
    plugins: { jest },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      "jest/valid-title": ["error", { ignoreTypeOfDescribeName: true, ignoreTypeOfTestName: true }],
    },
  },
  {
    name: "ts-test",
    files: ["**/*.spec.ts", "src/__mocks__/**/*.ts", "src/__tests-lib__/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/unbound-method": "off",
      "deprecation/deprecation": "warn",
      "sonarjs/no-duplicate-string": "off",
    },
  },
  {
    name: "ts-test-spec-exceptions",
    files: ["**/*.spec.ts"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
  {
    name: "ts-test-mock-exceptions",
    files: ["src/__mocks__/**/*.ts"],
    rules: {
      "import-x/no-default-export": "off",
    },
  },
];
