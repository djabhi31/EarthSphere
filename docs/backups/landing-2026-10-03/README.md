# Original landing page — 3 October 2026

The original landing page is preserved at `/landing-classic`. Its client component is an unmodified copy of the original `src/app/HomePageClient.tsx`, saved at `src/app/landing-classic/LegacyHomePageClient.tsx`. The original `src/components/landing/*.tsx` sections, globe, particle field, navbar, and footer remain in place.

`original-landing-source.zip` also captures the original home client, page metadata, root layout, global CSS, landing sections, layout components, globe, and particle field before the redesign.

To restore the original homepage, copy `src/app/landing-classic/LegacyHomePageClient.tsx` over `src/app/HomePageClient.tsx`, and remove the `pathname === "/"` early return in `src/components/layout/SiteChrome.tsx`. The archived `page.tsx` contains the old metadata if needed. The new cinematic files may remain unused; deleting them is unnecessary.

New imagery:

- `public/images/landing/nebula.webp`: Ant Nebula, Hubble Space Telescope, NASA/Space Telescope Science Institute (PIA04216). Source: https://images-assets.nasa.gov/image/PIA04216/PIA04216~orig.jpg
- `public/images/landing/earth-portrait.webp`: Earth portrait (PIA18033), used as the non-WebGL fallback. Source: https://images-assets.nasa.gov/image/PIA18033/PIA18033~orig.jpg

The 3D Earth uses the project's existing Blue Marble, cloud, topology, and water textures. Hero globe and orbital graphics are illustrative; only the observations feed represents current EONET records.
