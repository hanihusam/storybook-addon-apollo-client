import { defineConfig, type Options } from "tsup";
import { readFile } from "node:fs/promises";

// Storybook 10 uses esnext for browser targets
const BROWSER_TARGET: Options["target"] = "esnext";
const NODE_TARGET: Options["target"] = ["node20.19"];

// Manual externals for Storybook 10 (no more global packages imports)
const commonExternals = [
  'react',
  'react-dom',
  '@storybook/icons',
  /^storybook\/.*/,
  /^@storybook\/.*/,
];

type BundlerConfig = {
  bundler?: {
    nodeEntries?: string[];
    managerEntries?: string[];
    previewEntries?: string[];
  };
};

export default defineConfig(async (options) => {
  // reading the three types of entries from package.json, which has the following structure:
  // {
  //  ...
  //   "bundler": {
  //     "managerEntries": ["./src/manager.ts"],
  //     "previewEntries": ["./src/preview.ts", "./src/index.ts"]
  //   }
  // }
  const packageJson = (await readFile("./package.json", "utf8").then(
    JSON.parse,
  )) as BundlerConfig;
  const {
    bundler: {
      managerEntries = [],
      previewEntries = [],
      nodeEntries = [],
    } = {},
  } = packageJson;

  const commonConfig: Options = {
    splitting: false,
    minify: !options.watch,
    treeshake: true,
    sourcemap: true,
    clean: options.watch ? false : true,
  };

  const configs: Options[] = [];

  // manager entries are entries meant to be loaded into the manager UI
  // they'll have manager-specific packages externalized and they won't be usable in node
  // they won't have types generated for them as they're usually loaded automatically by Storybook
  if (managerEntries.length) {
    configs.push({
      ...commonConfig,
      entry: managerEntries,
      format: ["esm"],
      target: BROWSER_TARGET,
      platform: "browser",
      splitting: true,
      external: commonExternals,
    });
  }

  // preview entries are entries meant to be loaded into the preview iframe
  // they'll have preview-specific packages externalized and they won't be usable in node
  // they'll have types generated for them so they can be imported when setting up Portable Stories
  if (previewEntries.length) {
    configs.push({
      ...commonConfig,
      entry: previewEntries,
      dts: {
        resolve: true,
      },
      format: ["esm"],
      target: BROWSER_TARGET,
      platform: "browser",
      splitting: true,
      external: commonExternals,
    });
  }

  // node entries are entries meant to be used in node-only
  // this is useful for presets, which are loaded by Storybook when setting up configurations
  // they won't have types generated for them as they're usually loaded automatically by Storybook
  if (nodeEntries.length) {
    configs.push({
      ...commonConfig,
      entry: nodeEntries,
      format: ["esm"],
      target: NODE_TARGET,
      platform: "node",
    });
  }

  return configs;
});
