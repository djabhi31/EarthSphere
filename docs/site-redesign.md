# EarthSphere site redesign — October 3, 2026

## Scope and preservation

The active EarthSphere pages now share a cinematic, editorial design: dark navy surfaces, restrained color accents, large headlines, orbital graphics, a stable navigation header, and responsive galleries and controls. GODS EYE VIEW and WORLD MONITOR directories are excluded from the work. Existing outbound links and the EarthSphere intelligence wrapper remain available.

The original landing remains at `/landing-classic`. The first cinematic landing remains at `/landing-v1`. The complete source snapshot taken before this site-wide pass is `backups/site-before-redesign/earthsphere-source.zip`.

## Route coverage

| Route | Result |
| --- | --- |
| `/` | Existing six-chapter 3D scroll journey with the new shared navigation and a separate motion control. |
| `/dashboard` | Image-led mission control, NASA observation summaries, event briefing, and every destination. |
| `/events` | Shared editorial heading, improved controls, functional geographic bounds, saved views and sharing. |
| `/events/[id]` | Observation story, focused map, chronology, sources, and retry state. |
| `/map` | Full-viewport map, glass sidebar, visible navigation, responsive controls and map-instance state fix. |
| `/explore` | Original EarthSphere 3D explorer with mission tracking, 44 science datasets, archive playback, events, model inspection, and guided discovery. See `native-earth-explorer.md`. |
| `/analytics` | Unified chart surfaces, corrected all-status feed, defensively sorted observation dates, loading and error states. |
| `/apod` | Large image/story split, date browsing, on-demand discoveries, video support and enlarged images. |
| `/epic` | Earth image stage, frame sequence, date/type filters, rotation playback and fullscreen view. |
| `/earth-imagery` | NASA GIBS Terra/Aqua imagery, coordinates, dates, view scale, and location presets. |
| `/mars` | Searchable NASA Mars imagery archive with original captions and links. |
| `/asteroids` | Seven-day close-approach records, comparison cards, sorting and precise PHA labels. |
| `/space-weather` | Date-controlled flares, CMEs and storms using NASA's new DONKI endpoint. |
| `/satellites` | Searchable TLE catalog, expandable orbital elements, pagination, keyboard controls and retry state. |
| `/fireballs` | Restyled observation table, keyboard sorting and corrected radiant-energy units. |
| `/exoplanets` | Planet catalog, filters, keyboard sorting, details, pagination and error state. |
| `/media` | Image/video/audio search, pagination, caption dialogs and native media playback. |
| `/techport` | Dated project catalog, real project titles, ID search and detailed project dialogs. |
| `/intel` | Shared EarthSphere heading/navigation and the existing intelligence integrations. Embedded applications were not edited. |
| `/about` | Mission, design principles, creator information, and original data sources. |
| Loading / error / 404 | Matching recovery layouts, meaningful messages, and recovery actions. |

## Navigation and accessibility

The navigation was revised on October 4: a fixed-height header with direct Overview, Earth events and Explore 3D links, a click-to-open All tools panel, and Control/Command K page search. Native dialogs provide focus containment and Escape dismissal. Saved events, appearance, color accents and sound remain accessible. See `explore-navigation-redesign.md` for the current integration and verification details.

CSS and Motion respect reduced-motion preferences. The homepage's existing motion pause and fallback behavior remain available. New image layouts have loading/error placeholders; data pages expose retry states rather than inventing zero counts when a source fails.

## API corrections and sources

- Server-side NASA routing uses fixed provider origins and endpoint allowlists. Client query parameters cannot replace the server's NASA key. Redirects are rejected; public endpoints use their canonical URLs. Set `NASA_API_KEY` on the server; the prior `NEXT_PUBLIC_NASA_API_KEY` setting is supported for compatibility.
- EONET `status=all` is now sent explicitly. Omitting it means open events only. Internal west/south/east/north bounds are translated to EONET's west/north/east/south order. See https://eonet.gsfc.nasa.gov/docs/v3.
- NASA's old Mars rover endpoint returned 404. Active Mars browsing now uses https://images-api.nasa.gov/search.
- The legacy Landsat assets endpoint did not respond. Earth imagery now uses verified NASA GIBS WMS true-color layers, with requested dates and coverage limitations visible.
- NASA moved DONKI on September 30, 2026. Requests now use `https://ccmc.gsfc.nasa.gov/DONKI-API/get/…`, as documented at https://ccmc.gsfc.nasa.gov/news/major-updates. The old NASA gateway currently redirects to that announcement.
- Techport uses `https://techport.nasa.gov/api/projects`; project summaries load actual detail records.
- TLE search uses its canonical trailing-slash endpoint. The provider intermittently returned resource-limit errors during checks; the page exposes a retry state.
- The prior local explorer and embedded edition are preserved in source/backups. The active Explore route uses the independent EarthSphere WebGL implementation.
- The native explorer uses NASA’s publicly served dataset manifests and science rasters, with source attribution and documented limitations. These public asset schemas are not guaranteed stable APIs.

## Verification

- `npm run test:site`: 32 regression checks for camera continuity, desktop/mobile camera framing, event coordinates, proxy restrictions, EONET filters, GIBS bounds, date validation, and secure NASA media playback.
- TypeScript and the production build passed.
- ESLint passed for changed source files and the new shared components.
- HTTP checks returned 200 for all 19 active top-level routes, a real event detail route, and both preserved landing pages. An unknown path returned 404. These are server checks, not browser-rendered visual checks.
- Real responses verified through the local API proxy: EONET list/detail, APOD, NeoWs, EPIC, DONKI FLR/CME/GST, NASA media search/video assets, Techport list/detail, JPL fireballs, Exoplanet Archive TAP, and TLE search. NASA GIBS returned image content for the selected Earth layers.
- Browser automation was retried but blocked before opening a tab: automatic approval review returned an Azure deployment 404. Visual desktop/mobile inspection, runtime console review, focus behavior, and interaction/animation testing in a browser remain outstanding. No visual verification is claimed.

Run the app with `npm run dev`, then start at `/dashboard`. The development server used for the final HTTP checks was already running at http://localhost:3000.
