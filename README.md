# 🌍 EarthSphere

> Real-time Earth Event Intelligence — powered by NASA EONET

[Live Demo](https://earthsphere.in) · [Report Bug](https://github.com/abhil/earthsphere/issues)

## Overview
EarthSphere is a premium, real-time natural event monitoring platform that visualizes earthquakes, wildfires, storms, and other Earth events using NASA's EONET (Earth Observatory Natural Event Tracker) API.

## Features
- 🗺️ Interactive MapLibre GL JS map with real-time event markers
- 🌐 3D Earth globe visualization with Three.js
- 🎨 Premium dark/light mode with glassmorphism design
- ⚡ Cinematic scroll animations and motion system
- 📊 Real-time analytics dashboard with Recharts
- 🔍 Advanced event filtering, search, and saved views
- 📱 Fully responsive design (320px → 1920px)
- ♿ WCAG AA accessible, reduced-motion support

## Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 + CSS custom properties
- **Maps**: MapLibre GL JS (GPU-accelerated)
- **3D**: Three.js (Earth globe)
- **Animation**: Motion (Framer Motion) v12+
- **State**: Zustand + TanStack Query
- **Charts**: Recharts

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation
```bash
git clone https://github.com/YOUR_USERNAME/earthsphere.git
cd earthsphere
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure
```
src/
├── app/          # Next.js App Router pages
├── components/   # React components
│   ├── ui/       # Reusable UI components
│   ├── layout/   # Navbar, Footer, PageTransition
│   ├── landing/  # Landing page sections
│   ├── events/   # Event-related components
│   ├── analytics/# Chart components
│   ├── map/      # Map components
│   ├── motion/   # ScrollReveal, StaggerGroup, Parallax
│   └── features/ # SavedViews, ShareSession
├── hooks/        # Custom React hooks
└── lib/          # Utilities, tokens, store
```

## Lighthouse Scores
- 🚀 Performance: **99/100**
- 🎯 SEO: **100/100**
- ♿ Accessibility: **93/100**
- ⏱️ FCP: 0.6s | LCP: 0.9s | CLS: 0

## License
MIT — see [LICENSE](LICENSE)

## Acknowledgments
- [NASA EONET API](https://eonet.gsfc.nasa.gov/)
- Data provided by NASA's Earth Observatory
