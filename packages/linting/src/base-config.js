import js from "@eslint/js";
import { fixupPluginRules } from "@eslint/compat";
import importX from "eslint-plugin-import-x";
import sonarjs from "eslint-plugin-sonarjs";
import unusedImports from "eslint-plugin-unused-imports";
import deprecation from "eslint-plugin-deprecation";
import eslintConfigPrettier from "eslint-config-prettier";
import oxlint from "eslint-plugin-oxlint";
import { skipSlowRulesConfig } from "./skip-slow-rules-config.js";

/**
 * @param {...(FlatConfig|FlatConfig[]|FlatConfig.ConfigArray)} configs
 * @returns {FlatConfig[]}
 */
export function baseConfig(...configs) {
  return [
    {
      name: "base-ignores",
      // global ignores, `.eslintignore` is only for the working directory eslint is running in
      // see: https://github.com/microsoft/vscode-eslint/issues/1100
      ignores: ["**/.turbo/**", "**/dist/**", "**/.yarn/**"],
    },
    {
      name: "base-config",
      files: [process.env.baseFiles ?? "**/*.{ts,tsx,js,cjs,mjs}"],
      ...js.configs.recommended,
      ...importX.configs.errors,
      ...sonarjs.configs.recommended,
      ...deprecation.configs.recommended,
      plugins: {
        "import-x": importX,
        "unused-imports": unusedImports,
        sonarjs,
        deprecation: fixupPluginRules(deprecation),
      },
      rules: {
        ...Object.fromEntries(Object.keys(importX.configs.warnings.rules).map((key) => [key, "error"])),
        eqeqeq: ["error", "always"],
        "import-x/no-default-export": "error",
        "max-len": ["warn", 160, 2, { ignoreUrls: true, ignoreRegExpLiterals: true }],
        "no-unused-vars": "off",
        "sonarjs/cognitive-complexity": "warn",
        "unused-imports/no-unused-imports": ["warn", { varsIgnorePattern: "^ForgeUI$" }],
        "unused-imports/no-unused-vars": [
          "warn",
          {
            vars: "all",
            varsIgnorePattern: "^_",
            args: "after-used",
            argsIgnorePattern: "^_",
          },
        ],
      },
    },
    ...configs.flatMap((config) => config),
    ...skipSlowRulesConfig,
    // prettier must be the second to last
    eslintConfigPrettier,
    // exlint must be the last
    oxlint.configs["flat/recommended"],
  ];
}
