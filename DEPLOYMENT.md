# GitHub Pages

Production URL: https://zhanina777.github.io/webapp/

The production files are on the `gh-pages` branch. A repository owner or maintainer must select Settings > Pages > Deploy from a branch > gh-pages > /(root), then Save. The connected GitHub account can push code but cannot change that setting.

## Build updates

Keep the two browser Supabase values in the ignored `.env` file, then run:

```sh
npm ci
npm run typecheck
npm run build:pages
```

Publish the contents of `build/client` to the root of `gh-pages`, including `.nojekyll`. Source changes on `main` do not automatically update this deployment. The Pages build uses `/webapp/` for routing, public images, and OAuth return URLs. The preparation script generates an HTML shell for every known route so direct links and refreshes work on Pages.

## Supabase

In Authentication > URL Configuration, set Site URL to `https://zhanina777.github.io/webapp/` and allow the exact redirect URL `https://zhanina777.github.io/webapp/create-profile`. Configure any social providers you enable. Never publish secret or service-role keys; only the browser publishable key belongs in this app.

After deployment, verify signup, sign-in, guest completion import, and saving recipe completion on the production origin. Browser collections from localhost do not transfer to the production origin. Production browser and authentication flows still require manual verification.
