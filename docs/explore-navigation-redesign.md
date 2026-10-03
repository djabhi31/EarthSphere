# Explore and navigation revision — October 4, 2026

> Historical record: the embedded Explore edition below was subsequently replaced at the user’s request. See `native-earth-explorer.md` for the active implementation. The navigation section remains applicable.

## Approved direction

The user selected NASA's official embedded viewer to preserve its exact interface and tools, plus a slim, stable navigation header with direct links and an All tools panel.

## Explore

`/explore` embeds `https://eyes.nasa.gov/apps/earth/#/` directly. NASA hosts and operates the Earth imagery, spacecraft, data layers, time controls, and internal interface. EarthSphere does not copy or relabel NASA's application as its own.

EarthSphere provides a compact toolbar with source attribution, reload, fullscreen, and an always-available link to open NASA directly. Fullscreen hides the EarthSphere header and toolbar. The page reserves the header's height instead of placing EarthSphere controls over NASA's controls. Loading and timeout notices do not intercept interaction with the viewer.

The old local Three.js explorer and orbital utilities remain in source. They are no longer imported by the active Explore route. Their pre-revision snapshot is in `backups/explore-navigation-before-revision/explore-navigation.zip`.

An iframe load event confirms only that the remote document loaded; it cannot prove the cross-origin application's data or WebGL renderer is ready. Reload and the direct NASA link remain available even after that event. NASA availability, its own browser requirements, and third-party browser policies apply. The embedded app owns keyboard input while it has focus; EarthSphere's search shortcut applies while focus is in EarthSphere.

## Navigation

The header keeps a constant 64-pixel height and position. It has direct Overview, Earth events, and Explore 3D links, a click-to-open All tools panel containing every destination, page search, saved events, and appearance/sound preferences. Narrow screens use the All tools panel to keep the header compact.

There are no hover-triggered menus, scroll-dependent resizing, delayed route entrance animations, or floating header offsets. Panel animation is a short fade with a small vertical movement and respects reduced-motion preferences. Native dialogs provide focus containment, Escape dismissal, outside-click dismissal, and focus restoration. Search supports Control/Command K, arrow navigation, Enter, and normal Tab navigation. The All tools panel's close control stays visible while scrolling.

New navigation CSS is isolated in `navigation.module.css`; obsolete global navigation rules were removed while retaining the shared content/dialog styling used by other pages. Archived landing editions retain their original navigation.

## Verification and remaining limitation

- The Explore route returned HTTP 200 with one main landmark and the expected official iframe URL and fullscreen permission.
- NASA's HTML, JavaScript entry point, and stylesheet returned HTTP 200. Their responses contained neither X-Frame-Options nor CSP frame-ancestor restrictions during the check.
- Changed-source ESLint passed. The existing 19 regression tests passed.
- The production build and TypeScript checks passed.
- Browser automation failed before opening a tab because automatic approval review's Azure deployment returned HTTP 404. Embedded rendering, fullscreen, desktop/mobile layout, and interactive keyboard/pointer checks still need browser verification. HTTP checks do not substitute for those checks.

No GODS EYE VIEW or WORLD MONITOR folder was modified.
