import type { Config } from "@react-router/dev/config";

const basename = process.env.GITHUB_PAGES === "true" ? "/webapp/" : "/";

export default {
  // Pages run as a browser app. The build still renders the root once,
  // so browser-only APIs belong in effects or event handlers.
  ssr: false,
  basename,
} satisfies Config;
