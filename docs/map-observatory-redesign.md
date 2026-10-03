# Earth Observatory map

The `/map` route now uses `src/components/map/observatory/ObservatoryClient.tsx`, a separate MapLibre workspace. The old route is saved in `docs/backups/map-before-observatory/map-source.zip`; the original shared map components are retained for the classic landing and event detail pages. GODS EYE VIEW and WORLD MONITOR were not changed.

## Interface

- Satellite imagery is the default. Atlas and shaded relief are available in the layer panel.
- A collapsible event sidebar combines search, category/status filters, saved events, date windows and sorting. The map and list use the same filtered observations.
- Cluster markers expand on selection. Event selection opens an inspector, focuses the observation and draws its recorded point trail.
- The inspector includes source links, saving, sharing, observation history, recorded movement and city/location distance measurements. Polygon markers and distance results explicitly identify approximate area centers. The old calculators remain in their original files; this page does not invent smoke emissions or aviation hazard radii from missing data.
- One archive timeline provides a daily activity chart, date scrubbing, previous/next day controls and 1×/2×/4× playback. Event status and positions are evaluated at the selected day, rather than showing future coordinates during playback. The chart counts observations per day across statuses; the selected status controls the map/list snapshot.
- Layers include event density, a geographic solar terminator, and the PB2002 plate boundaries. Opacity changes only the basemap. The optional scan animation is labeled as a decorative effect.
- Geographic presets, globe/flat projection, tilt, zoom, north, fit, world reset, fullscreen and URL sharing are available. `/` focuses search; Escape closes a map panel. Reduced-motion preferences disable transitions and animated camera flights.
- Compact layouts collapse the sidebar initially, resize panels and provide a lower event inspector on phones. Attribution remains accessible.

## Data and limits

Events use the existing NASA EONET proxy. Satellite/relief imagery and reference labels come from Esri; Atlas uses CARTO/OpenStreetMap. Plate data attribution and its ODC-By license are in `public/map/README.md` and the map attribution control.

The observation window supports up to 366 inclusive UTC days. The EONET request is capped at 1,000 records; reaching that cap displays a notice to narrow the window. Records with no usable geometry are counted as omitted. Coordinate order is not silently guessed. A checked 60-day response contained 1,000 records, with 988 mappable records and 12 records with unusable coordinates. Some upstream flood polygons included latitude values outside the valid range.

Share links preserve the event, date range, selected day, basemap, search, status and categories. Saved events remain in the existing local watchlist. Basemap imagery is a geographic reference, not imagery from the archive cursor's date; the cursor changes NASA event observations and sunlight.

## Verification — 4 October 2026

- Production build passed, including TypeScript and static generation.
- ESLint passed for the map route, new renderer/interface, data helpers and test file.
- All 46 site tests passed. Map checks cover inclusive UTC dates, historical status/coordinates, combined filters, invalid geometry, antimeridian polygons/trails/bounds, daily activity counts, distance/movement, solar geometry, source URLs and MapLibre style validation.
- `/map` and the local plate GeoJSON returned HTTP 200. The route has one main landmark and the shared navigation.
- The EONET API, all three basemap sample tiles, reference labels and cluster glyphs returned HTTP 200.
- Interactive/browser visual checks remain unverified. Opening the page through the browser tool was rejected before execution because automatic approval review returned HTTP 404 for the configured review service's API deployment. No alternative browser automation was used to bypass that review.

When browser access is available, manually check globe rendering, marker/cluster selection, layer persistence after basemap changes, archive playback, responsive panels, keyboard focus, fullscreen and share-link restoration.
