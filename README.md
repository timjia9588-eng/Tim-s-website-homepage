# Tim Jia Portfolio

React, TypeScript, Vite, Framer Motion, and a lazy-loaded Three.js globe.

The default home page is a lit, dotted globe with a permanently visible place selector and project previews. The bottom-left “Simplistic version” link opens the self-hosted project overview at `/#simple`. Both views share local images and project details. There is no Adobe Portfolio dependency.

The overview defaults to all 19 projects and two working papers. Optional category filters show Professional practice, Academic & independent, or Research & writing; a search finds projects, places and papers. Four selected projects cycle in the hero, with direct selection, pause and previous/next controls. Resume opens a separate browser tab at `/#resume`, rather than a section occupying the portfolio. Papers have their own introductions at `/#paper/place-of-learning` and `/#paper/places-of-agency`.

Systems / Networks / Landscapes remain the underlying narrative, expressed through concrete questions about ecology, learning and public space. They are no longer abstract navigation filters. Research introductions explain why the work matters, how it was approached, and how it connects to design, with links to the original Project Zero working papers.

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

Projects have shareable URLs such as `/#project/phillips`. The image viewer supports keyboard navigation, zoom, and Escape. Dialogs manage focus and lock background scrolling. Motion respects the device’s reduced-motion preference. The globe is lazy loaded, pauses while hovered or being dragged, and resumes 2.4 seconds after leaving. The visible place selector provides keyboard access and a WebGL fallback. The slideshow pauses on hover/focus, when off-screen, or in a hidden tab; reduced motion disables automatic playback.

Professional images remain credited to their firms and collaborators and link to the public source. Gentilly displays only Tim’s explicitly requested portfolio illustration, with the firm link retained for project context. Kyle is text-only without external government links. EDSA project images and full portfolio sheets remain excluded. The independent Bajo la Sombra competition board is shown in full at Tim’s request, extracted at its actual 1122×1402 source resolution rather than enlarged crops. Earlier Git commits remain recoverable.

The previous HTML site remains recoverable through Git history. The original Adobe site’s HTML was backed up locally before migration; deleting or unpublishing the Adobe site requires access to its Portfolio dashboard.
