import { sassOptions } from "./sassrc.js";

export default {
  extends: ["stylelint-config-recommended", "stylelint-config-css-modules"],
  plugins: ["stylelint-scss", "./stylelint/sass-render-errors"],
  overrides: [
    {
      files: ["src/**/*.scss", ".storybook/**/*.scss"],
      customSyntax: "postcss-scss",
    },
  ],
  rules: {
    "plugin/sass-render-errors": {
      sassOptions,
    },
  },
};
