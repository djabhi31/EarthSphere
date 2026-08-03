<div align="center">
  <img src="https://raw.githubusercontent.com/djabhi31/earthsphere/main/public/og-image.jpg" alt="EarthSphere Banner" width="100%" />

  <br />
  <br />

  <h1>🌍 EarthSphere</h1>
  
  <p>
    <strong>Real-time Earth Event Intelligence — powered by NASA EONET.</strong>
  </p>

  <p>
    <a href="https://earthsphere.in">Live Demo</a> •
    <a href="#features">Features</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="https://github.com/djabhi31/earthsphere/issues">Report Bug</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js" />
  </p>
  
  <p>
    <a href="https://github.com/djabhi31/earthsphere/actions"><img src="https://img.shields.io/github/actions/workflow/status/djabhi31/earthsphere/ci.yml?style=flat-square&color=00d4aa" alt="CI Status" /></a>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&color=00d4aa" alt="License: MIT" /></a>
    <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=flat-square&color=00d4aa" alt="PRs Welcome" />
  </p>
</div>

---

## 🌌 Overview

**EarthSphere** is a premium, real-time natural event monitoring platform. It visualizes earthquakes, wildfires, severe storms, and volcanoes globally using data directly from **NASA's EONET** (Earth Observatory Natural Event Tracker) API. 

Built with an obsession for design and performance, it combines cinematic 3D globe rendering, glassmorphism UI, and lightning-fast edge routing to deliver a world-class user experience.

---

## ✨ Features

<table>
  <tr>
    <td width="50%">
      <h3>🌍 3D Global Visualization</h3>
      <p>Interactive, scroll-reactive WebGL Earth rendering using <b>Three.js</b>. Track live events in immersive 3D space with cinematic camera movements.</p>
    </td>
    <td width="50%">
      <h3>🗺️ 2D Tactical Map</h3>
      <p>Hardware-accelerated vector maps via <b>MapLibre GL JS</b>, featuring custom markers, clustered data, and smooth fly-to animations.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>⚡ Real-Time Intelligence</h3>
      <p>Live data pipeline connected directly to the NASA EONET API. Filter active events by category, status, and timeline.</p>
    </td>
    <td width="50%">
      <h3>💎 Premium Design System</h3>
      <p>A meticulous dark-mode UI with frosted glassmorphism, fluid Framer Motion animations, and custom CSS-variable theming.</p>
    </td>
  </tr>
</table>

---

## 🏗️ Architecture

```mermaid
graph LR
    A[Client UI] -->|React Query| B(Next.js Proxy API)
    B -->|Fetch| C{NASA EONET v3}
    A -.->|State| D[Zustand Store]
    A -.->|Renders| E[Three.js / MapLibre]
    
    style A fill:#00d4aa,stroke:#000,stroke-width:2px,color:#000
    style B fill:#1e293b,stroke:#00d4aa,stroke-width:2px,color:#fff
    style C fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#fff
```

---

## 🚀 Quick Start

### Prerequisites
Ensure you have Node.js 18+ and `npm` installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/djabhi31/earthsphere.git
   cd earthsphere
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Copy the example config and add any optional API keys (NASA EONET is public, so no keys are strictly required!).
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   > 🌐 Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📈 Performance

We take performance seriously. EarthSphere is highly optimized for the modern web:

- 🚀 **Performance:** `99/100` (Lighthouse)
- 🎯 **SEO:** `100/100` (Fully SSR metadata)
- ♿ **Accessibility:** `93/100` (WCAG AA compliant, reduced-motion supported)
- 🧠 **Memory Management:** Auto-pauses WebGL loops on inactive tabs to save battery.

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please review our [Contributing Guidelines](CONTRIBUTING.md) for more details.

---

## 📜 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/djabhi31">Abhilash</a> & the EarthSphere Contributors.</p>
  <p>Data provided by <a href="https://eonet.gsfc.nasa.gov/">NASA's Earth Observatory</a>.</p>
</div>
