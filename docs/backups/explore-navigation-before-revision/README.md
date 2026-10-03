# Explore and navigation snapshot

This archive was taken before replacing Explore with the NASA-hosted viewer and replacing the animated floating navigation with the stable header.

The existing archive is retained unchanged. Its entries map to these source locations:

- `Navigation.tsx` → `src/components/site/Navigation.tsx`
- `site.css` → `src/components/site/site.css`
- `SiteChrome.tsx` → `src/components/layout/SiteChrome.tsx`
- `page.tsx` → `src/app/explore/page.tsx`
- `explore/orbits.ts` and `explore/nasaGibs.ts` → `src/lib/explore/`
- Other `explore/` entries → `src/components/explore/`

The prior local globe, satellite models, and orbital utilities also remain in the working tree. The new Explore route no longer loads them.

Extract to a separate directory to compare or recover individual files. GODS EYE VIEW and WORLD MONITOR folders were excluded.
