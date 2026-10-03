# Content pages before the editorial redesign

`content-source.zip` preserves the versions present before the 4 October 2026 redesign.

- Restore `site/` into `src/components/site/` for the previous shell, page introductions, content styles and page components.
- Restore any of the route directories (`about/`, `dashboard/`, `events/`, and so on) into `src/app/` to recover the corresponding previous route files.

Extract to a separate directory first and compare before restoring. New files such as `content-pages.css`, `content-art.ts`, `content-intro.module.css`, `ContentCompanions.tsx`, `pages/about-story.module.css` and `pages/dashboard.module.css` were not in the original snapshot. Reverting the old shell/page files removes their active use without requiring deletion.

The ZIP does not include GODS EYE VIEW or WORLD MONITOR. `asset-contact-sheet.png` is an image-asset review, not a screenshot of the rendered website.
