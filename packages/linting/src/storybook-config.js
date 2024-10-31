import storybook from "eslint-plugin-storybook";
import { fixupPluginRules } from "@eslint/compat";

/** @type {FlatConfig[]} */
export const storybookConfig = [
  {
    name: "storybook-ignores",
    ignores: ["!.storybook/**", ".storybook/public/**", "storybook-static/**"],
  },
  ...storybook.configs.recommended.overrides.map((config) => ({
    ...config,
    plugins: { storybook: fixupPluginRules(storybook) },
    files: config.files.map((file) => (file.startsWith("*.") ? `**/${file}` : file)),
  })),
  {
    name: "storybook-stories-and-components",
    files: ["**/*.stories.tsx", ".storybook/**/*.tsx"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/unbound-method": "off",
      "deprecation/deprecation": "warn",
      "sonarjs/no-duplicate-string": "off",
    },
  },
  {
    name: "ts-react-storybook-ignore-default-exports",
    files: ["**/*.stories.tsx", ".storybook/main.ts", ".storybook/preview.tsx"],
    rules: {
      "import-x/no-default-export": "off",
    },
  },
  {
    name: "ts-react-storybook-preview",
    files: [".storybook/preview.tsx"],
    rules: {
      "@typescript-eslint/no-unsafe-member-access": "off",
    },
  },
];
