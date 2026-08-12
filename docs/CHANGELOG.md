# Changelog — EarthSphere Release History

## [2.0.0] - 2026-08-13 (Ultimate NASA Open API Suite & Mega-Menu Sci-Fi Redesign)

### 🌟 Major Features Added
- **13 NASA Open API Integrations (`src/lib/nasa-api.ts` & `src/hooks/useNasaApi.ts`)**:
  - Integrated 13 official NASA API endpoints (EONET, APOD, DONKI Space Weather, NeoWs Asteroids, EPIC Earth Camera, Mars Rovers, NASA Media Search, Landsat Imagery, Satellite TLE, Exoplanets Archive, CNEOS Fireballs, TechPort, Command Dashboard).
- **11 Brand New Interactive Pages (15+ Total Routes)**:
  - `/apod`: Astronomy Picture of the Day with high-resolution image viewer and date navigator.
  - `/asteroids`: Near-Earth Object (NeoWs) tracking dashboard with orbit velocity, hazard rating, and distance telemetry.
  - `/dashboard`: Unified NASA Command Telemetry Dashboard.
  - `/earth-imagery`: Landsat satellite surface imagery & spectral tile viewer.
  - `/epic`: DSCOVR satellite full-disk polychromatic Earth imagery.
  - `/exoplanets`: Confirmed exoplanet discovery database explorer.
  - `/fireballs`: CNEOS atmospheric bolide energy impact telemetry.
  - `/mars`: Multi-rover photographic exploration feeds (Perseverance, Curiosity, Opportunity).
  - `/media`: Official NASA Image & Video asset search library.
  - `/satellites`: Live 3D satellite tracking engine & ISS TLE orbit trajectory.
  - `/space-weather`: DONKI Space Weather operations monitoring solar flares, CMEs, and geomagnetic storms.
  - `/techport`: NASA Space Technology innovation portfolio.
- **Sci-Fi Floating Pill Dock Navbar (`src/components/layout/Navbar.tsx`)**:
  - Redesigned executive floating sci-fi navigation pill dock with animated active layout indicators and mega-menu categories.
- **Accent Theme Customizer System (`src/components/features/ThemeCustomizer.tsx`)**:
  - Dynamic color theme engine supporting Electric Cyan, Solar Orange, Emerald Green, and Cosmic Purple accents.

---

## [1.2.0] - 2026-08-12 (Governance & Beautification Overhaul)

### 🌟 Documentation & Infrastructure
- Executive README overhaul with custom glowing badges (`#00d4aa`), 2x2 feature matrix, Mermaid architecture diagram, and Star History chart.
- Added `SECURITY.md`, `CITATIONS.cff`, `CONTRIBUTING.md`, `.github/CODEOWNERS`, `.github/FUNDING.yml`, `.editorconfig`.
- Added structured GitHub Issue & PR templates.
- Configured CI GitHub Actions pipeline and Dependabot scheduling.

---

## [1.0.0] - 2026-01-01 (Initial Release)

### 🌟 Core Foundation
- Real-time Earth Natural Event Intelligence platform powered by NASA EONET v3.
- Next.js 15 App Router + React 19 architecture.
- Three.js 3D WebGL Globe & MapLibre GL 2D Tactical vector map engine.
