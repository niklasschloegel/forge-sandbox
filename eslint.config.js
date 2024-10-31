import { baseConfig, jsNodeConfig } from "linting";

process.env.baseFiles = "./*.js";

/** @type {FlatConfig} */
export default baseConfig(
  jsNodeConfig.map((config) => ({
    ...config,
    files: ["./*.js"],
  }))
);
