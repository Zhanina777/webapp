// Build tooling: Tailwind generates styles and React Router handles the app routes.
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const base = process.env.GITHUB_PAGES === "true" ? "/webapp/" : "/";

export default defineConfig({
  base,
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
});
