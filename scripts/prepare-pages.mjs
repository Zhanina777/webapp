import { readFile, writeFile, mkdir } from "node:fs/promises";

// GitHub Pages has no SPA rewrite support. Serve the SPA shell at each known URL.
const html = await readFile("build/client/index.html", "utf8");
const routes = await readFile("app/routes.jsx", "utf8");
const paths = [...routes.matchAll(/route\("([^":]+)"/g)].map(match => match[1]);
for (const file of ["app/data/crystalProjects.js", "app/data/additionalCrystalProjects.js"]) {
  const source = await readFile(file, "utf8");
  for (const [, id] of source.matchAll(/\bid["']?\s*:\s*"([a-z0-9-]+)"/g)) {
    paths.push(`recipes/${id}`, `recipes/${id}/grow`);
  }
}
for (const pathname of new Set(paths)) {
  const directory = `build/client/${pathname}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, html);
}
await writeFile("build/client/404.html", html);
await writeFile("build/client/.nojekyll", "");
console.log(`Prepared ${new Set(paths).size} direct page URLs for GitHub Pages.`);
