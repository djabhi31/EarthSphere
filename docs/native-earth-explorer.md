# Native Earth Explorer — October 4, 2026

## Design

The active `/explore` route is an original EarthSphere interface and Three.js scene. It contains no iframe and does not run NASA Eyes application code. Explore uses one shared EarthSphere navigation bar, with native Satellites / Vital signs / Latest events / Discover controls in place of the ordinary page links. All tools retains page search, preferences and saved events. It opens mission and dataset galleries over a continuous full-width scene. Panels never resize the canvas. A horizontal vital-sign strip and compact transport controls run along the bottom. Collapsible details sit in the lower left, with zoom and view tools on the right. A quiet star field, atmospheric rim, day/night lighting, smooth spherical camera transitions, and interpolated spacecraft movement support the experience. Motion preferences, keyboard globe controls, touch orbit/zoom, compact layouts, and native dialogs are included.

The previous native visual edition is preserved in `backups/explore-native-before-eyes-alignment/explore-native.zip`; its stylesheet remains in the tree. The prior embedded edition is preserved in `backups/explore-embedded-2026-10-04/explore-embedded.zip`. The older native explorer, previous revision backup, and both landing-page backups remain intact. GODS EYE VIEW and WORLD MONITOR folders were not modified.

## Features and data

- 18 observation groups (visible imagery plus 17 science categories), exposing all 44 dataset variants identified in NASA Eyes' public data catalog.
- Date ranges and missing observations come from live NASA dataset manifests. Playback advances only after each image loads and skips unavailable dates. Monthly data stays monthly.
- Numeric NASA rasters are decoded into EarthSphere color palettes. Missing pixels stay transparent. Clicking an observed point displays its value, including temperature conversion, precipitation encoding, and separate soil-moisture/salinity units.
- NASA GIBS supplies visible imagery and the datasets published as image tiles. Its original color legends are displayed where provided. GIBS imagery does not claim a numeric point reading.
- OMI total-column ozone uses GIBS' own availability calendar. Its publication can lag the Eyes archive; displaying the newer archive date had produced a fully transparent image. Empty GIBS images now produce a recovery message.
- NASA's live mission catalog currently contains 43 entries. Search, discipline filters, past/current/future filters, mission descriptions, launch dates, source links, and related datasets are available.
- Current TLEs are fetched from CelesTrak with the TLE API as an independent fallback, through an allowlisted server route with bounded client concurrency and hourly caching. All 24 mapped spacecraft records returned current elements during the final check. NISAR, both PREFIRE spacecraft, Sentinel-6B, and TEMPO’s Intelsat host are mapped; CYGNSS uses the verified CYGFM01 catalog number. SGP4 provides estimated location, altitude, speed, orbit path, and ground track. Satellite selection, following, orbit visibility, forward/reverse playback, date/time scrubbing, and Now are supported.
- Selecting a spacecraft opens its NASA/JPL model directly. 39 mission entries map to 31 distinct public glTF assets, loaded on demand. Each model is normalized and centered without modifying shared cached geometry. Local Draco and Basis/KTX2 decoders support compressed assets. Missing or failed models retain a clearly labeled schematic fallback. Orbital silhouettes are enlarged for visibility. Available approximate spans support side-by-side comparisons to a 1.7 m person and a 12 m school bus.
- All 43 mission entries have NASA photographic thumbnails. The default view includes thin orbit paths colored by atmosphere, land or ocean science, plus a legend.
- The Earth uses the existing 4K Blue Marble map, a separate cloud layer, ocean highlights and a restrained atmospheric limb. Day/night mode blends NASA’s 2012 night-light composite using the selected UTC solar position. The initial 17° N, 88° W view and responsive sphere fitting keep the globe visible in portrait and landscape.
- Selecting a data layer clears unrelated selections and hides spacecraft by default; View settings can re-enable them. Now preserves the selected mission, while Latest selects the newest observation in data mode. Escape closes a panel and returns to its tool where available. Reduced motion also disables camera damping and orbital interpolation.
- EONET events have category filtering, a 30-day archive window, selectable globe markers, camera travel, source event details, and a shortcut to satellite imagery for the event date.
- Discover includes a five-stop guided tour and 16 NASA science videos/graphics in a native player.
- View controls include sunlight, satellites, orbit paths, ground tracks, geographic grid, city labels, slow camera orbit, and Celsius. Share links preserve the mission/dataset/date; image export includes source attribution and UTC time. Fullscreen uses the browser API.

## Comparison with NASA Eyes

This is a native implementation of the main exploration workflows, not verified exact feature parity with NASA Eyes. Material differences are explicit in the interface:

- Four ISS instrument entries do not have a mapped individual mesh and use schematic fallbacks. The globe uses lightweight, enlarged spacecraft silhouettes, with a detailed model for the selected mission. Dimension comparisons are limited to supplied approximate spans.
- Tracking is available for mapped missions with successfully fetched TLEs. It does not use NASA's full historical ephemeris archive. Positions more than 14 days from an element set are hidden rather than presented as accurate historical tracking.
- EONET's event catalog differs from the editorial Earth Observatory stories in NASA Eyes.
- Science videos play in a native media player, rather than being projected onto the globe.
- Numeric point readouts apply to decoded numeric rasters; GIBS image layers show imagery and source legends.

## Implementation

- `src/components/site/Navigation.tsx` and `src/components/layout/SiteChrome.tsx`: optional explorer slots and a single navigation instance on Explore; other routes retain the existing header.
- `src/components/explore/NativeExplorer.tsx`: independent interface, selections, timeline, panels, sharing and dialogs.
- `src/components/explore/ExplorerScene.tsx`: WebGL globe, camera, spacecraft, tracks and export.
- `src/components/explore/MissionModel.tsx`: NASA glTF loading, compressed-format decoders, normalization, status and fallbacks.
- `src/components/explore/SpacecraftModel.tsx`: schematic fallback and size-comparison geometry.
- `src/components/explore/explorer-console.module.css`: active horizontal navigation, galleries, scene overlays, bottom controls and responsive layouts.
- `src/lib/explore/model-assets.ts`: public model allowlist, safe thumbnails and responsive camera framing.
- `src/lib/explore/earth-shaders.ts`: native surface lighting and night-light blending.
- `src/components/explore/useExplorerData.ts`: query lifecycle, bounded TLE loading, abortable image loading and numeric raster preparation.
- `src/lib/explore/science.ts` and `datasets.json`: dataset metadata, date selection, byte decoding, palettes and GIBS calendar handling.
- `src/lib/explore/astronomy.ts`: geographic transforms, sunlight, SGP4 and safe camera interpolation.
- `src/app/api/explore/[...path]/route.ts`: fixed resource allowlists for NASA mission/dataset metadata and CelesTrak/TLE API orbital elements. No credentials are required for these public resources.

The dataset names, instrument mappings, units and numeric scale/offset metadata in `datasets.json` are attributed to NASA/JPL's public Eyes science catalog, inspected October 4, 2026. UI, layout, controls, palettes, fallback geometry, shaders and application code were implemented locally. Detailed glTF models and mission thumbnails are NASA/JPL assets. `public/textures/explore/README.md` records the static night-map source; `public/explore/decoders/NOTICE.md` records decoder licenses. NASA descriptions in the mission API are rendered as plain text.

## Verification

- Production build and TypeScript passed.
- Changed-file ESLint passed.
- 34 regression tests passed, including 15 explorer tests for archive gaps, monthly dates, GIBS publication lag, numeric decoding, geographic alignment, sunlight, SGP4 bounds, antipodal camera flights, responsive sphere framing and safe model/thumbnail selection.
- All 44 latest source-image requests returned image content and CORS headers. OMI was rechecked at its corrected GIBS date at 2048 × 1024 with 1,599,500 nontransparent pixels. The public source responses are recorded in `explore-data-check.json`.
- All 31 model manifests and every referenced buffer/texture returned HTTP 200 with CORS access; results are recorded in `explore-model-check.json`. All 43 mission thumbnails returned HTTP 200. The native route, new night texture and local decoder WASM files also returned HTTP 200 with correct content types.
- All 16 science-media URLs returned HTTP 200 with video/image content types in the previous data audit.
- `/explore` returned HTTP 200 with the native heading, timeline, exactly one navigation header, one main landmark and zero iframes. `/dashboard` retained its standard navigation header. Mission/dataset API checks passed; an unknown resource returned 400.
- NASA’s public CSS and asset metadata were inspected to align the layout; this does not constitute a rendered comparison. Browser automation remains blocked before opening a tab because automatic approval review's Azure deployment returns HTTP 404. No visual, pointer, browser keyboard, fullscreen, media-playback, or runtime-console verification is claimed. Those checks remain outstanding.

Sources: https://eyes.nasa.gov/apps/earth/ , https://eyes.nasa.gov/assets/dynamic/earth/api/mission.json , https://gibs.earthdata.nasa.gov/ , https://eonet.gsfc.nasa.gov/ , https://tle.ivanstanojevic.me/ , https://celestrak.org/ .
