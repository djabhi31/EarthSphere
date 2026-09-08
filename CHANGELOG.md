# Changelog

All notable changes to **EarthSphere** will be documented in this file.

For full architectural details, design tokens migration history, and component decomposition notes, please refer to the detailed **[docs/CHANGELOG.md](docs/CHANGELOG.md)** file.

---

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
- **13 Official NASA Open APIs Integrated**: EONET, APOD, DONKI Space Weather, NeoWs Asteroids, EPIC Earth Camera, Mars Rovers, NASA Media Search, Landsat Imagery, Satellite TLE, Exoplanets Archive, CNEOS Fireballs, TechPort, Command Dashboard.
- **11 Brand New Pages (15+ Total Routes)**: Added `/apod`, `/asteroids`, `/dashboard`, `/earth-imagery`, `/epic`, `/exoplanets`, `/fireballs`, `/mars`, `/media`, `/satellites`, `/space-weather`, `/techport`.
- **Sci-Fi Floating Pill Dock Navbar**: Executive mega-menu navbar with animated active layout indicators.
- **Accent Theme Engine**: Customizable color themes (Electric Cyan, Solar Orange, Emerald Green, Cosmic Purple).

---

## [1.2.0] - 2026-08-12

### 🌟 Added
- Executive README overhaul with custom glowing badges (`#00d4aa`), interactive feature matrix, and Mermaid system architecture diagram.
- `SECURITY.md`, `CITATIONS.cff`, `CONTRIBUTING.md`, `.github/CODEOWNERS`, `.github/FUNDING.yml`, `.editorconfig`.
- Structured Issue Templates & PR Template.
- Dependabot automated update configuration & Stale issue triage bot.
