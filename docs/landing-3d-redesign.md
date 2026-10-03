# Continuous 3D landing journey

## Codebase review

Inventoried and parsed all 177 application TypeScript/TSX/CSS source files (26,363 lines before this revision), including route exports, component boundaries, hooks, and external data providers. Read the architecture, design system, scroll-camera specification, interaction engine, motion bible, creative direction, and landing plan. Examined the connected God's Eye View and World Monitor architecture and entry points; those engines remain independent applications.

Detailed integration review covered the root layout/providers/navigation; both previous landing implementations; Three.js globe and particle engines; React Three Fiber canvas, camera, atmosphere, ISS and generic satellite models; orbit math and stored TLEs; EONET proxy, geometry types, category colors and query caching; NASA API hooks; analytics, dashboard, and the global intelligence hub.

Findings that shaped the implementation:

- The camera specification calls for a continuous journey. The first redesign had one hero globe and largely flat sections below it.
- Local Earth textures and spacecraft geometry already exist. Reuse those assets and models without adding an animation or graphics dependency.
- The explorer's bundled TLE examples date from 2023. The landing does not present those as live telemetry. Its spacecraft paths are explicitly illustrative; the full orbit tracker is linked separately.
- EONET supplies real event geometry. Its existing proxy and cached query hook power the globe markers, category filters, event focusing, and sample counts. Invalid and polygon geometry is excluded from point focusing.
- API-dependent parts must not block the visual experience. Loading, empty, and retry states occupy a reserved event panel.

## Implementation

`src/components/landing/journey/flight.ts` defines six camera stops and safe, reversible interpolations. One persistent WebGL scene contains Earth, its clouds and atmosphere, event markers, orbital paths, spacecraft, stars, and a procedural Mars study. The perspective camera travels through the scene with scroll progress. The two cross-space transitions add clearance instead of passing through a planet.

The journey is: arrival → living Earth → orbit → Mars → connected Earth → mission selection. Event selection rotates the actual textured globe toward the selected coordinate. Category selection recolors the atmosphere and filters plotted records. The linked mission cards use scroll and pointer-driven CSS 3D transforms.

Only the active overlaid chapter is interactive and exposed to accessibility tools. Chapter links work by keyboard and touch. Reduced-motion users receive readable stacked sections and a stationary Earth. Ambient motion can be paused without changing document height. The renderer runs on demand when paused, offscreen, or in a background tab. WebGL and texture failures retain a photographic fallback.

The original design remains at `/landing-classic`; the first redesign remains at `/landing-v1`. Both source archives are under `docs/backups/`. No existing landing components were deleted.

## Verification

- `node --test scripts/test-landing-flight.mjs`: finite camera values, forward/reverse behavior, planetary clearance, chapter continuity, desktop/mobile field of view, input clamping, latest valid geometry, and texture-coordinate alignment.
- All six flight tests passed. TypeScript and ESLint checks pass for the integration.
- Production build includes both backup routes and the new home route. HTTP checks confirm the three routes and four Earth textures return 200; the home response contains all six chapters.
- The original landing backup matches the Git version byte-for-byte (SHA-256 `02e37602ed90e95ff537714ccd73e8cc9e828f6f8d41015addec5bf4490290b7`).
- Browser inspection was attempted but blocked by the automatic approval service returning a deployment-not-found error. Visual, runtime GPU, and device performance checks require browser access; mathematical projection checks do not replace them.
