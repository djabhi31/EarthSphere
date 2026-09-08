# Changelog — EarthSphere Release History

## [2.1.0] - 2026-09-09 (God's Eye View Tactical 3D Suite & BYOK Architecture)

### 🛰️ Major Features Added
- **God's Eye View Photorealistic 3D Tactical Console (`gods-eye-view/`)**:
  - Ingested God's Eye View suite powered by **CesiumJS** and **Google Photorealistic 3D Tiles**.
  - Real-time planetary intelligence layers: live aircraft vectors (OpenSky Network / adsb.lol), live maritime shipping (AISStream WebSockets), live satellite orbits (CelesTrak TLEs), active wildfires (NASA FIRMS VIIRS), metropolitan CCTV traffic camera streams, and hands-free voice control (OpenAI Realtime WebRTC).
- **BYOK (Bring Your Own Key) Security Architecture**:
  - Implemented client-side `localStorage` credential manager (`gev_cesium_token`, `gev_google_maps_key`, `gev_openai_key`).
  - Keyless-by-default runtime allows full exploration with free public feeds without any provider keys.
  - End-to-end privacy: zero credential storage on servers, zero cost for the host.
- **Unified Monorepo & Upstream Sync**:
  - Bundled physical `gods-eye-view/` directory into EarthSphere repository for single-clone ease and GitHub portfolio showcase.
  - Configured `npm run sync:gev` script to mirror updates from the upstream fork `djabhi31/gods-eye-view`.
  - Configured `.vercelignore` to isolate Next.js production builds from GEV assets.
- **Subdomain Routing & Navigation**:
  - Added direct external link in EarthSphere floating pill dock Navbar (`Earth` & `Explore` menus) targeting `https://godseyeview.earthsphere.in`.
- **Cloud-Ready Server Setup**:
  - Added standalone production launcher `server.mjs` (0.0.0.0 & dynamic `$PORT`) and `Dockerfile` for Azure App Service and Render deployment.

---

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
