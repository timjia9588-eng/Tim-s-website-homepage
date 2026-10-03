# Tim Jia Portfolio

React, TypeScript, Vite, Framer Motion, and a lazy-loaded Three.js globe.

The default home page is an immersive dotted globe with geographic place markers. The bottom-left “Simplistic version” link opens the self-hosted portfolio at `/#simple`. Both views share local images and project details. There is no Adobe Portfolio dependency.

Systems / Networks / Landscapes connect the personal narrative. Professional practice, Studies & personal work, and Research & publications provide clear browsing contexts. Resume opens a readable website section at `/#resume`; no document download is required.

## Run locally

```sh
pnpm install
pnpm dev
pnpm build
pnpm preview
```

Use Node.js 22.12 or later. The production build is written to `dist/`.
`vercel.json` sets the Vite framework, build command, and output directory for the existing Vercel project.

After building, double-click `Preview.cmd` on Windows or run `node scripts/preview.mjs`.
This dependency-free preview serves the built site on localhost (normally port 4174), with all images included.
The portable review folder includes `dist/`, `scripts/preview.mjs`, and `Preview.cmd`; it needs no package installation.

## Review before publishing

Changes are on `feat/react-portfolio`. Do not merge to `main` or deploy to the production domain until Tim has reviewed and approved the local preview.

## Update content

- Edit project descriptions, roles, credits, categories, and locations in `src/data/projects.ts`.
- Store images in `public/images/`. Image URLs use the site’s own origin; Adobe Portfolio is not required.
- Each image has a full-size WebP and a smaller variant. Dimensions are listed in `src/data/image-sizes.json`.
- `asset-sources.json` records the source portfolio page or public project URL for every exported asset.
- Narrative chapters, related-project connections, publications and resume experience live in `src/data/story.ts`.
- Gallery captions and links live in `src/data/visuals.json`.
- `content-audit.md` records public evidence, removed material, and award/publication status.

Projects have shareable URLs such as `/#project/phillips`. The image viewer supports keyboard navigation, zoom, and Escape. Dialogs manage focus and lock background scrolling. Motion respects the device’s reduced-motion preference. The globe is lazy loaded, pauses while hovered or being dragged, and resumes 2.4 seconds after leaving. A Places menu provides keyboard access and a WebGL fallback.

Professional images remain credited to their firms and collaborators and link to the public source. Professional entries without verified public project evidence are removed. EDSA project images and full portfolio sheets are excluded from this build. Earlier Git commits remain recoverable.

The previous HTML site remains recoverable through Git history. The original Adobe site’s HTML was backed up locally before migration; deleting or unpublishing the Adobe site requires access to its Portfolio dashboard.
