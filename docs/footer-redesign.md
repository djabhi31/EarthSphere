# Shared EarthSphere footer

The current landing page and all 16 content pages now use `src/components/site/SiteFooter.tsx` and its CSS module. The footer sits outside the page's main content. Full-screen `/map` and `/explore` retain their existing layout; `/landing-v1` and `/landing-classic` retain their saved designs.

The design includes a scroll-reactive Earth photograph and oversized wordmark, an invitation to the native Earth explorer, all 18 destinations grouped by the existing catalog, the supplied creator portrait, four creator social links, NASA source links, and a back-to-top button. The active destination is marked. The current landing page also retains links to both saved designs.

The former small footers and duplicate landing directory were replaced by this shared component. Its CSS is scoped, with layouts for desktop, tablet, and mobile. Links and content remain visible without an entrance animation. Reduced-motion preferences disable decorative transforms and smooth scrolling. The back-to-top action returns keyboard focus to the content entry point. Social links have accessible labels, and destination prefetching is disabled to avoid loading the entire tool suite when the footer appears.

Existing local Earth and portrait assets are reused. No new dependencies, API calls, or forms were added. No files in GODS EYE VIEW or WORLD MONITOR were changed. The preceding source is preserved in `docs/backups/footer-before-redesign/source.zip`.

## Validation

- Production build and TypeScript checks passed; 28 static pages generated.
- ESLint passed for all four changed TypeScript components.
- All 21 checked routes returned HTTP 200: exactly one shared footer on 17 routes, none on the two immersive viewers or two saved landing editions.
- All 18 destination links, both local images, and the back-to-top control appear in each shared footer's server-rendered HTML. Both saved-design links appear on the landing page.
- Footer CSS parses successfully and every referenced footer CSS-module class exists. Whitespace checks passed.
- Browser visual and interaction review remains unverified. Automatic approval review blocked the browser action with a 404 deployment error. No alternative browser automation was used.

Route-check results are saved in `docs/footer-route-check.json`.
