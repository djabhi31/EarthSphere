# Changelog — EarthSphere Premium Redesign

## Phase 1–4: Foundation
- Created design system tokens (design-tokens.ts)
- Created motion presets (motion-presets.ts)
- Migrated from Leaflet to MapLibre GL JS
- Removed all Leaflet dependencies

## Phase 5: Page Redesigns
- Decomposed all pages into modular components (24 new components)
- Landing: 474 → 129 lines (6 components)
- Events: 712 → 120 lines (3 components + hook)
- Event Detail: 485 → 262 lines (4 components)
- Analytics: 559 → 238 lines (4 components)
- Map: 581 → 117 lines (3 components)
- About: 124 → 91 lines (2 components)
- Redesigned error, 404, loading pages

## Phase 6: Premium Components
- Upgraded Shadcn components (button, card, badge, skeleton, tooltip, tabs)
- Fixed custom components (GlassCard, LiveTicker, SpotlightCard, ParticleField, AuroraBackground, StatusBadge)

## Phase 7–9: Motion & Interaction
- Created ScrollReveal, StaggerGroup, ParallaxSection components
- Upgraded PageTransition with AnimatePresence
- Created ScrollProgress indicator
- Upgraded CustomCursor with context-aware labels

## Phase 10–11: Theming
- Created light mode theme
- Created ThemeToggle + ThemeProvider
- FOUC prevention

## Phase 12–13: Features
- API proxy route with caching
- ShareSession (URL sharing)
- SavedViews (localStorage persistence)

## Phase 14–15: Stability & Performance
- Fixed Navbar hooks violation
- Fixed EventMap XSS risk
- Fixed memory leaks (EventMap, FloatingEarth)
- Dynamic imports for heavy components
- keepPreviousData for smooth pagination
