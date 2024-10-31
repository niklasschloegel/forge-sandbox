import {
  baseConfig,
  baseImportsAbsoluteConfig,
  jsConfig,
  jsNodeConfig,
  storybookConfig,
  tsConfig,
  tsReactConfig,
  tsReactHmrConfig,
  tsTestConfig,
} from "linting";
import { dirname } from "path";
import { fileURLToPath } from "url";

process.env.TSCONFIG_ROOT_DIR = dirname(fileURLToPath(import.meta.url));

/** @type {FlatConfig[]} */
export default baseConfig(
  {
    name: "web-ignores",
    ignores: ["assets/**", "public/**"],
  },
  baseImportsAbsoluteConfig,
  tsConfig,
  tsReactConfig,
  tsReactHmrConfig,
  tsTestConfig,
  jsConfig,
  storybookConfig,
  {
    name: "node-files",
    files: ["vite.config.ts", "typed-scss-modules.config.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.node.json",
      },
    },
    rules: {
      "no-restricted-imports": "off",
      "deprecation/deprecation": "error",
    },
  },
  {
    name: "ignore-default-exports",
    files: ["vite.config.ts", "src/vite-modules.d.ts", "src/pages/**/*"],
    rules: {
      "import-x/no-default-export": "off",
    },
  },
  {
    name: "ignore-function-return-type",
    files: ["src/**/*.tsx"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
  ...jsNodeConfig.map((config) => ({
    ...config,
    files: ["generator/**/*.js", "stylelint/**/*.js"],
  }))
);
