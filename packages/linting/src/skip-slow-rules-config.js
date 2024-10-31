const disableSlowLintRules = process.env.DISABLE_SLOW_LINT_RULES === "true";

if (disableSlowLintRules) {
  console.info("disabling slow rules");
}

/** @type {FlatConfig[]} */
export const skipSlowRulesConfig = [
  {
    name: "skip-slow-rules",
    files: disableSlowLintRules ? ["**/*"] : ["!**/*"],
    rules: {
      "deprecation/deprecation": "off",
      "import-x/no-cycle": "off",
      "import-x/no-deprecated": "off",
      "import-x/no-named-as-default": "off",
      "import-x/no-unused-modules": "off",
    },
  },
];
