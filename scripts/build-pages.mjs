import { spawnSync } from "node:child_process";

const result = spawnSync(process.execPath, ["node_modules/@react-router/dev/bin.cjs", "build"], {
  env: { ...process.env, GITHUB_PAGES: "true" },
  stdio: "inherit",
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
await import("./prepare-pages.mjs");
