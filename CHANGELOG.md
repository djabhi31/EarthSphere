# Changelog

All notable changes to **EarthSphere** will be documented in this file.

For full architectural details, design tokens migration history, and component decomposition notes, please refer to the detailed **[docs/CHANGELOG.md](docs/CHANGELOG.md)** file.

---

## [1.2.0] - 2026-08-12

### 🌟 Added
- Executive README overhaul with custom glowing badges (`#00d4aa`), interactive feature matrix, and Mermaid system architecture diagram.
- `SECURITY.md` defining enterprise security policies, supported versions, and vulnerability disclosure timeline.
- `CITATIONS.cff` providing standardized citation metadata for academic and open-source credit.
- Upgraded `CONTRIBUTING.md` with Conventional Commits guidelines and developer setup workflows.
- `.github/PULL_REQUEST_TEMPLATE.md` with verification checklist and UI screenshot section.
- Structured Issue Templates (`bug_report.md`, `feature_request.md`, `config.yml`).
- `.github/dependabot.yml` for automated dependency update scheduling.
- `.github/workflows/stale.yml` for automated issue/PR triage.

### ⚡ Changed
- Enhanced `.github/workflows/ci.yml` to support both `master` and `main` branches with linting, typechecking, and build verification.

---

## [1.0.0] - 2026-01-01

### 🌟 Initial Release
- Real-time Earth Natural Event Intelligence platform powered by NASA EONET v3.
- Next.js 15 App Router + React 19 architecture.
- Interactive Three.js 3D WebGL Globe with orbital camera controls.
- MapLibre GL JS 2D Tactical vector map engine with point clustering.
- Cyber-Glass design system with frosted glassmorphic cards and dynamic theme engine.
