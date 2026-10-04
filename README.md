# Tim Jia Portfolio

React, TypeScript, Vite, Framer Motion, and a lazy-loaded Three.js globe.

The home page begins with a forest-green dotted globe, a visible place selector and enlarged project previews. Scrolling leads naturally through a gradual color transition into the warm-white portfolio. “All work” links can also jump directly to the overview, and project links open their details without losing the current browsing position. The redundant “Simplistic version” button is removed. There is no Adobe Portfolio dependency.

The overview defaults to all 19 projects and two working papers. Optional category filters show Professional practice, Academic & independent, or Research & writing; a search finds projects, places and papers. Six selected projects cycle in the hero every 4.5 seconds, each appearing once per cycle. Large views use curated design images and public firm renderings; lower-resolution photographs and small figures stay in their project galleries at reading size. Translucent Previous/Next arrows and a quiet progress strip inside the image provide direct navigation, with keyboard arrow navigation and no separate Pause/Play icon. Resume opens a separate browser tab at `/#resume`, rather than a section occupying the portfolio. Papers have their own introductions at `/#paper/place-of-learning` and `/#paper/places-of-agency`.

Systems / Networks / Landscapes remain the underlying narrative, expressed through concrete questions about ecology, learning and public space. They are no longer abstract navigation filters. Research introductions explain why the work matters, how it was approached, and how it connects to design, with links to the original Project Zero working papers.

## Run locally

```sh
pnpm install
pnpm dev
pnpm build
pnpm check:portfolio
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

Projects have shareable URLs such as `/#project/phillips`. The image viewer supports keyboard navigation, zoom, and Escape. Dialogs manage focus and lock background scrolling. Motion respects the device’s reduced-motion preference. The globe is lazy loaded, pauses while hovered or being dragged, and resumes 2.4 seconds after leaving. The visible place selector provides keyboard access and a WebGL fallback. Six featured projects advance every 4.5 seconds with a directional image reveal after the incoming image is decoded. The outgoing image remains opaque until the transition finishes. The slideshow keeps playing during mouse hover and mouse selection, but pauses for keyboard focus, when off-screen, or in a hidden tab; reduced motion disables automatic playback and ambient image movement. Previous/Next arrows wrap around the cycle; integrated progress segments allow direct selection and keyboard arrow navigation without a separate Pause/Play button. Only decorative hero images move; project documentation remains still and complete.

The forest-green atlas and warm-white project overview share one continuous page. Scroll down to reach the overview, through a soft green-to-paper gradient; scrolling back returns to the same atlas and selected place. The globe gradually shrinks and moves upward as it leaves the viewport. Wheel zoom is disabled so scrolling over the globe moves the page; vertical touch gestures browse the page while horizontal dragging rotates the globe. Reduced motion removes scroll-linked movement. Resume remains a separate route and browser tab. Ordinary home loads start at the globe. Cold loads of legacy `/#top` and `/#simple` URLs are normalized to `/#globe`; project, paper, category and resume deep links remain available. Scroll restoration is disabled in the document head before browser restoration. Within-page links use the shared Lenis controller without competing browser anchor jumps. Navigation follows the visible section. Project dismissal and browser Back preserve reading position, including when the page was opened without a hash.

The custom place list supports arrows, Home/End, letter navigation, Enter, Escape, and clicking outside. Larger project previews use responsive image sources, light desaturation and a subtle dot screen that recedes on hover or focus. Original images in project galleries retain their colors.

Duplicate name/role introductions and the atlas's drag/hover instruction footer are removed. The scroll cue, meaningful project metadata and source credits remain. Reading text and card hit targets stay stationary: no scroll-linked heading transforms or card hover lifts. Image previews reveal once inside independently observed, fixed frames. The carousel keeps one persistent project link and reveals decoded imagery from the direction of travel, retaining its outgoing image behind the mask. Gentle image drift, atlas contour currents, pointer-responsive background lines and a selected-location ring provide ambient movement. Reduced motion disables these decorative movements and automatic playback. Lenis 1.3.26 supplies light wheel smoothing while touch scrolling, nested atlas/menu scrolling and modal scrolling remain native. Nested dialogs stop and resume the shared scroll controller.

Preview imagery is selected separately from complete documentation. Salinity & Symbiosis uses a native-resolution close-up of branching fungal filaments; its complete scan remains in the gallery. Xiaozhou's thumbnail is a scalable, simplified version of the original needs diagram, with website text instead of a blurry cropped screenshot. The complete diagrams retain their original labels on the research page. The waterfront card uses the full master plan. Gallery figures preserve their complete individual composition and intrinsic size. PARK-ing Parking separates the four adaptation phases and the nine 2050/2070/2100 scenarios into labeled comparison groups. Figure captions and explanations are website text, rather than embedded fragments of portfolio headings. Technical labels and scales that belong to the drawings remain intact.

Gallery dimensions reserve space before lazy-loaded images arrive, avoiding jumps while scrolling. Slideshow progress segments have 44px-high hit targets on small screens. Image attribution follows each cover's credit; a firm page used only for project background is labeled “Project context,” distinct from an original image source.

Professional images remain credited to their firms and collaborators and link to the public source. Gentilly displays only Tim’s explicitly requested portfolio illustration, with the firm link retained for project context. Kyle is text-only without external government links. EDSA project images and full portfolio sheets remain excluded. The independent Bajo la Sombra competition board is shown in full at Tim’s request, extracted at its actual 1122×1402 source resolution rather than enlarged crops. Earlier Git commits remain recoverable.

The two 30-page file copies are byte-identical. A second native-image review replaced upscaled page crops for Alumni Slope (1276×528), Fallingwater (989×620), the Florence drawing (691×836), the city skyline drawing (1277×1809), and the bamboo garden photograph (575×762). Bamboo now has its complete 600×469 construction layout and both hand sketches, shown together at their native 497×509 and 497×515 sizes; it uses the first plan as a preview. These are original embedded images, not AI enhancements or inflated exports. Technical maps, scenario comparisons and the competition board remain complete; low-resolution source limitations are recorded in `content-audit.md`.

The previous HTML site remains recoverable through Git history. The original Adobe site’s HTML was backed up locally before migration; deleting or unpublishing the Adobe site requires access to its Portfolio dashboard.

Atlas project lists derive from each project’s canonical `place` field. Melissa/Phillips occur at Melissa, Kyle at Kyle, and Xiaozhou at Guangzhou. San Antonio and Beijing retain work/study context with links to the resume, rather than duplicating remote project sites. The multi-location sketchbook remains in All work without a misleading single map marker.

Motion references: [Lenis](https://github.com/darkroomengineering/lenis) is the added dependency. [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) informs coordinated scroll sequencing; [React Bits](https://reactbits.dev/animations/pixel-transition) informs the image-reveal approach; [Vanta](https://www.vantajs.com/) informs restrained responsive ambient graphics. Image masks and atlas graphics are implemented locally with the existing Framer Motion/Three.js stack; no external demo assets are copied.
