// Build tooling: Tailwind generates styles and React Router handles the app routes.
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/webapp/" : "/",
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
});
