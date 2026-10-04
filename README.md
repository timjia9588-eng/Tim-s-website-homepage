# Tim Jia Portfolio

React, TypeScript, Vite, Framer Motion, and a lazy-loaded Three.js globe.

The default home page is a silver-gray dotted globe with a visible place selector and enlarged project previews. “All work” and the individual project links lead into the self-hosted portfolio; the redundant “Simplistic version” button is removed. Both views share local images and project details. There is no Adobe Portfolio dependency.

The overview defaults to all 19 projects and two working papers. Optional category filters show Professional practice, Academic & independent, or Research & writing; a search finds projects, places and papers. Nine selected projects cycle in the hero every 7.5 seconds. A quiet progress strip inside the image doubles as direct navigation, alongside a small Pause/Play control and keyboard arrow navigation. Resume opens a separate browser tab at `/#resume`, rather than a section occupying the portfolio. Papers have their own introductions at `/#paper/place-of-learning` and `/#paper/places-of-agency`.

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
- Gallery captions, descriptions, comparison groups, species keys and links live in `src/data/visuals.json`.
- `content-audit.md` records public evidence, removed material, and award/publication status.

Projects have shareable URLs such as `/#project/phillips`. The image viewer supports keyboard navigation, zoom, and Escape. Dialogs manage focus and lock background scrolling. Motion respects the device’s reduced-motion preference. The globe is lazy loaded, pauses while hovered or being dragged, and resumes 2.4 seconds after leaving. The visible place selector provides keyboard access and a WebGL fallback. The slideshow keeps playing during mouse hover and mouse selection, but pauses for keyboard focus, when off-screen, or in a hidden tab; reduced motion disables automatic playback and ambient image movement. Explicit Pause/Play controls are always available when automatic playback is enabled. Only decorative hero images move; project documentation remains still and complete.

The atlas uses a monochrome globe, charcoal backgrounds and neutral panels, with restrained green in selected markers and interface accents. Its custom place list supports arrows, Home/End, letter navigation, Enter, Escape, and clicking outside. Larger project previews use responsive image sources, light desaturation and a subtle dot screen that recedes on hover or focus. Original images in project galleries retain their colors.

Preview imagery is selected separately from complete documentation. Salinity & Symbiosis uses a native-resolution close-up of branching fungal filaments; its complete scan remains in the gallery. Xiaozhou's thumbnail is a scalable, simplified version of the original needs diagram, with website text instead of a blurry cropped screenshot. The complete diagrams retain their original labels on the research page. The waterfront card uses the full master plan. Gallery figures preserve their complete individual composition and intrinsic size. PARK-ing Parking separates the four adaptation phases and the nine 2050/2070/2100 scenarios into labeled comparison groups. Figure captions and explanations are website text, rather than embedded fragments of portfolio headings. Technical labels and scales that belong to the drawings remain intact.

Gallery dimensions reserve space before lazy-loaded images arrive, avoiding jumps while scrolling. Slideshow progress segments and Pause/Play have 44px-high hit targets on small screens. Image attribution follows each cover's credit; a firm page used only for project background is labeled “Project context,” distinct from an original image source.

Professional images remain credited to their firms and collaborators and link to the public source. Gentilly displays only Tim’s explicitly requested portfolio illustration, with the firm link retained for project context. Kyle is text-only without external government links. EDSA project images and full portfolio sheets remain excluded. The independent Bajo la Sombra competition board is shown in full at Tim’s request, extracted at its actual 1122×1402 source resolution rather than enlarged crops. Earlier Git commits remain recoverable.

The previous HTML site remains recoverable through Git history. The original Adobe site’s HTML was backed up locally before migration; deleting or unpublishing the Adobe site requires access to its Portfolio dashboard.
