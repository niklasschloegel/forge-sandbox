import { baseConfig, baseImportsAbsoluteConfig, jsConfig, tsConfig, tsReactConfig, tsTestConfig } from "linting";
import { dirname } from "path";
import { fileURLToPath } from "url";

process.env.TSCONFIG_ROOT_DIR = dirname(fileURLToPath(import.meta.url));

export default baseConfig(
  baseImportsAbsoluteConfig,
  tsConfig,
  tsReactConfig,
  tsTestConfig,
  jsConfig,
  // enable legacy react imports as long as ForgeUI is not up to date
  {
    files: ["**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_|^ForgeUI$",
        },
      ],
    },
  }
);
