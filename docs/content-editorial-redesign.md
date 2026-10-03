# Content page redesign — 4 October 2026

The redesign covers the 16 content routes: About, Dashboard, Events, Analytics, APOD, EPIC, Earth Imagery, Mars, Asteroids, Space Weather, Satellites, Fireballs, Exoplanets, Media, Techport, and Intel. Event detail pages inherit the updated content styling. The immersive landing, Map and Explore keep their own layouts. GODS EYE VIEW and WORLD MONITOR folders were not changed.

## What changed

- **About:** a dedicated Earth hero with scroll parallax, sticky chapter navigation and reading progress; mission narrative; atmospheric horizon image; project principles; links to Earth and space exploration; creator profile; scientific sources; accessible native FAQ sections; and a closing discovery link. Existing creator biography and social links are retained.
- **Dashboard:** a larger APOD feature and observation summary rail; a 3D explorer feature; a searchable destination directory with All/Earth/Space/Discover filters; event briefing access; and the existing external platform links.
- **Media and Mars:** a featured image spanning the opening gallery rows, with the existing search, presets, image/video/audio selection, pagination and detail playback retained.
- **APOD, EPIC and Earth Imagery:** revised image stages, story panels, sequence thumbnails, forms, source notes and enlargement controls.
- **Asteroids and Space Weather:** joined summary panels and quieter observation cards with clearer hierarchy. Data filters, sorting, date controls and scientific values remain in the existing components.
- **Satellites:** a full-width search panel, refined search presets, and updated expandable orbital records with raw TLE access retained.
- **Fireballs, Exoplanets and Analytics:** revised table, chart, surface, typography, spacing and control treatment through the content-only visual system.
- **Techport and Intel:** updated project cards and the page around the intelligence viewer. The embedded viewer itself and the protected project folders were not modified.

All standard content pages receive a subject-specific NASA image introduction, scroll-reactive imagery, original-image credits, dataset source links, related destinations and a new footer. About has a separate introduction and story layout. Styles are scoped to `es-content-site`/`es-content-body`; they do not apply the content layout to Map or Explore.

## Sources and preservation

Five optimized NASA image assets are served locally. Source records and credits are in `public/images/editorial/README.md` and `sources.json`. Historical header images are labeled with their subject and mission; actual observation dates remain in the data widgets.

The previous site components and all affected route directories are in `docs/backups/content-before-editorial/content-source.zip`. Existing landing backups remain intact. No dependency packages, API handlers, credentials, or protected project folders changed.

## Verification

- Production build, including TypeScript and all static routes: passed.
- ESLint for all changed TypeScript/TSX files: passed.
- All 46 existing site tests: passed.
- HTTP checks: all 16 content routes, Map, and Explore returned 200. Each returned one H1 and one main landmark. The content theme is absent from Map and Explore. Details are in `docs/content-route-check.json`.
- All five local editorial images returned HTTP 200 with `image/webp`. CSS parsed successfully, and all referenced CSS module classes were present. `git diff --check` passed.
- Browser rendering and interactive checks remain unverified. The browser-opening action was rejected before execution because automatic approval review returned HTTP 404 for its configured API deployment. No alternative browser automation bypassed that review.

When browser access is restored, review desktop and phone layouts, About chapter navigation and parallax, Dashboard directory filtering, media details, existing data controls, light theme, reduced-motion behavior, and keyboard navigation.
