import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const nextConfig: NextConfig = {
  outputFileTracingRoot: repoRoot,
  typedRoutes: true,
  // Workspace packages ship TypeScript source with ESM ".js" import specifiers.
  transpilePackages: ["@reflexive/sdk", "@reflexive/types"],
  webpack(config) {
    config.resolve.extensionAlias = { ".js": [".ts", ".tsx", ".js"] };
    return config;
  }
};

export default nextConfig;
