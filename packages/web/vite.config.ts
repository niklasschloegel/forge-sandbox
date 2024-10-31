import { defineConfig, loadEnv, UserConfigExport } from "vite";
import { resolve } from "path";
import viteReact from "@vitejs/plugin-react";
import eslintPlugin from "@nabla/vite-plugin-eslint";
import StylelintPlugin from "vite-plugin-stylelint";
import { sassOptions } from "./sassrc";
import htmlPlugin from "vite-plugin-html-config";
import svgr from "vite-plugin-svgr";
import { readFile } from "fs/promises";
import oxlintPlugin from "vite-plugin-oxlint";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

async function readAtlassianThemeFile(path: string, selector: string): Promise<string> {
  const content = await readFile(require.resolve(path), { encoding: "utf8" });
  const match = /^export default "(.*)";$/m.exec(content);
  if (!match) return "";
  const [, style] = match;
  return style
    .replace(/^.+\{/s, selector + "{")
    .replace(/\s+color-scheme: \w+;\\n/, "")
    .replace(/\\n/g, "");
}

// https://vitejs.dev/config//
export default defineConfig(async ({ mode }) => {
  const env = {
    ...loadEnv(mode, resolve(__dirname, "../.."), ""),
    ...loadEnv(mode, __dirname, ""),
  };
  const isLocalDev = env.LOCAL_DEV === "true";
  const forgeContextVars = Object.fromEntries(
    Object.entries(env)
      .filter(([key]) => key.startsWith("FORGE_CONTEXT_") || key.startsWith("FC_"))
      .map(([key, value]) => [key, value.replace("FORGE_CONTEXT_", "").replace("FC_", "")])
  );
  let atlassianTheme = "";
  if (isLocalDev) {
    const atlassianLightTheme = await readAtlassianThemeFile("@atlaskit/tokens/dist/esm/artifacts/themes/atlassian-light", '[data-color-mode="light"]');
    const atlassianDarkTheme = await readAtlassianThemeFile("@atlaskit/tokens/dist/esm/artifacts/themes/atlassian-dark", '[data-color-mode="dark"]');
    atlassianTheme = atlassianLightTheme + atlassianDarkTheme;
    console.log(`Proxy REST API to ${env.ATLASSIAN_BASE_URL}`);
  }
  return {
    plugins: [
      svgr({
        svgrOptions: {
          replaceAttrValues: {
            black: "currentColor",
            "#000": "currentColor",
            "#000000": "currentColor",
          },
          plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
          svgoConfig: {
            floatPrecision: 3,
            plugins: [
              {
                name: "preset-default",
                params: {
                  overrides: {
                    removeViewBox: false,
                  },
                },
              },
              "prefixIds",
              "convertStyleToAttrs",
            ],
          },
        },
      }),
      viteReact({
        exclude: /\.stories\.tsx?$/,
        include: "**/*.tsx",
      }),
      oxlintPlugin({
        configFile: "./eslintrc.js",
      }),
      eslintPlugin({
        eslintOptions: {
          cache: true,
          cacheLocation: ".eslintcache-vite",
        },
      }),
      StylelintPlugin({
        exclude: ["**/node_modules/**", "**/jira-cloud-api/**", "**/jira-software-cloud?(-patched)-api/**", "**/design-tokens/**"],
      }),
      // adds atlaskit styling in dev:local mode only
      isLocalDev &&
        htmlPlugin({
          style: atlassianTheme,
          links: [{ rel: "stylesheet", href: require.resolve("@atlaskit/css-reset") }],
        }),
    ].filter((plugin) => plugin),
    define: {
      "process.env.FORGE_CONTEXT": JSON.stringify(forgeContextVars),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV), // required by AtlasKit's InlineEdit / i18n
      "process.env.LOCAL_DEV": JSON.stringify(isLocalDev),
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        "@assets": resolve(__dirname, "assets"),
        "design-tokens": "design-tokens/generated",
        "date-utils": resolve(__dirname, "../date-utils/src"),
        bridge: resolve(__dirname, "../bridge/src"),
        ...(isLocalDev && {
          "@forge/bridge": resolve(__dirname, "src/__mocks__/local-forge-bridge.ts"),
          "@forge/jira-bridge": resolve(__dirname, "src/__mocks__/local-forge-jira-bridge.ts"),
        }),
      },
    },
    base: "./",
    server: {
      port: isLocalDev ? 3000 : 3001,
      proxy: {
        "/rest": {
          target: env.ATLASSIAN_BASE_URL,
          auth: `${env.ATLASSIAN_AUTH_EMAIL}:${env.ATLASSIAN_AUTH_TOKEN}`,
          changeOrigin: true,
          headers: {
            // fixes XSRF errors, cause X-Atlassian-Token header is only interpreted for non browser user-agents
            "User-Agent": "Node.js",
            // fixes XSRF errors in dev:local
            "X-Atlassian-Token": "no-check",
          },
        },
      },
    },
    esbuild: {
      // this simply happens and is unavoidable with React16 in esbuild
      // see: https://github.com/vitejs/vite/discussions/8640
      logOverride: { "this-is-undefined-in-esm": "silent" },
    },
    css: {
      modules: {
        localsConvention: "camelCaseOnly",
      },
      preprocessorOptions: {
        scss: sassOptions,
      },
    },
  } satisfies UserConfigExport;
});
