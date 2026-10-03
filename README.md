# Tim Jia Portfolio

React, TypeScript, Vite, Framer Motion, and a lazy-loaded Three.js globe.

The default home page is the interactive globe portal. The bottom-left “Simplistic version” link opens the self-hosted portfolio at `/#simple`; its Globe navigation returns to `/#globe`. Both views share the same local images, project details, and downloads. The portal has no Adobe Portfolio link.

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
This dependency-free preview serves the built site on localhost (normally port 4174), with all images and downloads included.
The portable review folder includes `dist/`, `scripts/preview.mjs`, and `Preview.cmd`; it needs no package installation.

## Review before publishing

Changes are on `feat/react-portfolio`. Do not merge to `main` or deploy to the production domain until Tim has reviewed and approved the local preview.

## Update content

- Edit project descriptions, roles, credits, categories, and locations in `src/data/projects.ts`.
- Store images in `public/images/`. Image URLs use the site’s own origin; Adobe Portfolio is not required.
- Each image has a full-size WebP and a smaller variant. Dimensions are listed in `src/data/image-sizes.json`.
- `asset-sources.json` records the source portfolio page or public project URL for every exported asset.
- Resume and portfolio downloads live in `public/downloads/`.

Projects have shareable URLs such as `/#project/phillips`. The image viewer supports keyboard navigation, zoom, and Escape. Dialogs manage focus and lock background scrolling. Motion respects the device’s reduced-motion preference. The globe loads only near the Explore section, pauses rendering offscreen, and has a text-based place selector for devices without WebGL.

Professional images remain credited to their firms and collaborators. Public Urban Alchemy Collective images link to the original project page. Projects without supplied or verified public visuals are presented as experience entries.

The previous HTML site remains recoverable through Git history. The original Adobe site’s HTML was backed up locally before migration; deleting or unpublishing the Adobe site requires access to its Portfolio dashboard.
