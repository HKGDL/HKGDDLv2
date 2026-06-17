# HKGD Demon List v2

Hong Kong Geometry Dash Demon List — frontend built with Vue 3, deployed on Cloudflare Workers.

<https://v2.hkgdl.dpdns.org>

## Stack

- Vue 3 (SPA, no build step)
- Cloudflare Workers (static assets + API)
- D1 (SQLite)

## Structure

- `index.html` — app shell
- `js/` — Vue components and pages
- `css/` — stylesheets
- `src/worker.js` — Cloudflare Worker entry (asset serving + SPA fallback)
- `wrangler.toml` — deployment config

## Deploy

```bash
npx wrangler deploy
```
