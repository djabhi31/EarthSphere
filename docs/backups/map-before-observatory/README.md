# Map before the Observatory redesign

`map-source.zip` was created before changing the active `/map` page on 4 October 2026.

- `page.tsx` is the previous `src/app/map/page.tsx`.
- `map/` contains the previous `src/components/map/` files.

To restore the previous page, extract the ZIP into a separate directory and copy its `page.tsx` to `src/app/map/page.tsx`. The original map components remain in the source tree. The redesign lives in the separate `src/components/map/observatory/` directory, so restoring the page does not require deleting it.

This backup does not contain or modify GODS EYE VIEW or WORLD MONITOR.
