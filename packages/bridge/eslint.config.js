import { dirname } from "path";
import { fileURLToPath } from "url";
import { baseConfig, baseImportsRelativeConfig, jsConfig, tsConfig, tsTestConfig } from "linting";

process.env.TSCONFIG_ROOT_DIR = dirname(fileURLToPath(import.meta.url));

export default baseConfig(baseImportsRelativeConfig, tsConfig, tsTestConfig, jsConfig);
