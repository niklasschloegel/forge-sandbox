/*
 * Stylelint plugin to check for undefined variables and unresolved imports.
 *
 * The implementation is a modified version of `stylelint-sass-render-errors`.
 * It uses the latest sass API, adds custom aliases and a node resolver for imports and makes vite's `additionalData` option available.
 *
 * Usage in `stylelint.config.js`:
 * ```
 * module.exports = {
 *   plugins: ["stylelint-prettier", "stylelint-scss", "./stylelint/sass-render-errors"],
 *   rules: {
 *     "plugin/sass-render-errors": {
 *       alias: {
 *         "design-tokens-deprecated": "design-tokens/deprecated",
 *         "design-tokens": "design-tokens/generated",
 *       },
 *       sassOptions,
 *     },
 * }
 * ```
 *
 * @see https://github.com/niksy/stylelint-sass-render-errors
 * @see https://sass-lang.com/documentation/js-api/functions/compilestringasync/
 */
import stylelint from "stylelint";
import * as sass from "sass";
import { pathToFileURL } from "url";
import { createRequire } from "node:module";

const ruleName = "plugin/sass-render-errors";
const messages = stylelint.utils.ruleMessages(ruleName, {
  report: (message) => message,
});
const require = createRequire(import.meta.url);

/**
 * @param {Root}   postcssRoot
 * @param {number} line
 * @param {number} column
 */
function findClosestNode(postcssRoot, line, column) {
  /** @type {ChildNode[]} */
  const nodes = [];
  postcssRoot.walk((node) => {
    if (node?.source?.start?.line === line) {
      nodes.push(node);
    }
  });
  const closestNode = { diff: Infinity, index: -1 };
  nodes.forEach((node, index) => {
    const diff = Math.abs((node?.source?.start?.column ?? 0) - column);
    if (diff < closestNode.diff) {
      closestNode.diff = diff;
      closestNode.index = index;
    }
  });
  return nodes[closestNode.index] ?? postcssRoot;
}

const nodeResolverImporter = {
  findFileUrl(url) {
    return new URL(pathToFileURL(require.resolve(url)));
  },
};

function aliasImporter(alias) {
  return {
    findFileUrl(url) {
      for (let [aliasName, replacement] of Object.entries(alias)) {
        if (url.startsWith(aliasName + "/")) {
          return new URL(pathToFileURL(require.resolve(url.replaceAll(aliasName + "/", replacement + "/"))));
        }
      }
      return null;
    },
  };
}

function ruleFunction(options = {}) {
  return async (postcssRoot, postcssResult) => {
    const {
      aliases,
      sassOptions: { additionalData, ...sassOptions },
    } = options;
    let css = postcssRoot.source?.input.css;
    if (!css) return;
    css = `${additionalData}\n${css}`;
    try {
      await sass.compileStringAsync(css, {
        ...sassOptions,
        importers: [aliasImporter(aliases), nodeResolverImporter],
      });
    } catch (error) {
      const { start, text } = error.span;
      const node = findClosestNode(postcssRoot, start.line, start.column);
      stylelint.utils.report({
        ruleName,
        result: postcssResult,
        node,
        word: text,
        line: start.line,
        message: messages.report(`${error.sassMessage} ${text}`),
      });
    }
  };
}

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;

export default stylelint.createPlugin(ruleName, ruleFunction);
