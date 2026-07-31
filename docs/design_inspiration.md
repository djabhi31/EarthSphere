# EarthSphere — Design Inspiration Research

> **Phase 3 of the Premium Redesign**
> Research-only — no code changes. Patterns and ideas distilled from premium UI libraries, motion frameworks, and world-class products.

---

## 1 · UI Component Libraries

### 1.1 Aceternity UI

| Pattern | EarthSphere Application |
|---|---|
| **Spotlight effect** — radial gradient follows cursor over card surfaces | Event cards on the map sidebar: a soft warm glow tracks the pointer, revealing card depth on hover |
| **Tracing beam** — SVG path draws along scroll progress | Timeline scrubber: a luminous trace follows the date slider as the user scrubs through EONET event history |
| **3D card tilt** — perspective transforms driven by pointer position | Category cards (wildfires, storms, volcanoes) tilt subtly toward the cursor, suggesting tactile physicality |
| **Meteor shower** — particles streak across backgrounds | Loading state for the globe view: tiny meteors fall behind the spinning Earth to reinforce the space theme |
| **Text generate** — characters fade/slide in staggered | Hero headline on first load: "Tracking Earth's Natural Events" reveals word-by-word |
| **Background beams** — animated gradient rays emanating from a focal point | Subtle beams radiate from the active event marker on the map, drawing the eye without overwhelming data |

### 1.2 Magic UI

- **Animated beam** — energy line connecting two nodes. Perfect for showing causal links between clustered events (e.g., drought → wildfire chain).
- **Border beam** — a glowing trace that orbits a card border. Use on the "active event" card to signal live/updating data.
- **Shimmer button** — gradient sweep across the button face. Apply to the primary CTA ("Explore Events") to convey premium feel without garish colour.
- **Number ticker** — digits roll like an odometer. Ideal for the dashboard stats bar: total events, active fires, active storms.
- **Dock component** — macOS-style icon magnification bar. Consider for the bottom toolbar holding map layer toggles (satellite, terrain, dark).
- **Orbiting circles** — items orbit a central node. Candidate for the category selector: event-type icons orbit the globe.

### 1.3 ReactBits

- **Split text** — characters animate independently on entrance. Useful for section headings that resolve on scroll, creating a cinematic feel.
- **Typewriter** — text types out character by character. Fits the "AI Summary" panel: the event description types out as if generated in real time.
- **Button press effect** — spring-physics scale-down on press. Apply globally to all interactive elements for satisfying tactile feedback.
- **Gradient background** — animated multi-stop gradient. Candidate for the page background in light mode: a slow-moving dawn gradient.

### 1.4 Animata

- **Micro-loading skeletons** — pulse with a warm undertone instead of cold grey. Matches the "warm white" light-mode palette.
- **Card flip** — reveals back-face detail on click. Event cards could flip to show extended metadata (coordinates, source links, magnitude).
- **Staggered list entry** — children animate in with cascading delay. Sidebar event list items enter one by one as data loads.
- **Text blur-in** — text starts blurred and sharpens. Map labels could blur-in as zoom level resolves detail.

### 1.5 CuiCui

- **Split-panel layouts** — resizable panels with drag handles. Map + sidebar could become a split view with a draggable divider.
- **Tabbed cards** — content switches inside a card without page navigation. Event detail cards with tabs for Overview / Data / AI Analysis.
- **Creative hover states** — border animations and colour shifts that feel intentional, not decorative.

### 1.6 Fancy Components

- **Gradient mesh cards** — multi-point gradient fills that shift on hover. Category cards could each have a signature gradient mesh (fire = amber→red, storm = blue→violet).
- **Glass morphism panels** — frosted translucent panels over blurred backgrounds. The sidebar overlay on the map should use this: `backdrop-blur(16px)` with 60 % opacity.
- **Animated counters** — spring-eased number transitions. Event counts in the header bar.

### 1.7 HeroUI

- **Frosted depth system** — 5-level blur stack: each layer gets progressively stronger blur and lower opacity, creating a convincing sense of depth.
- **Semantic colour tokens** — colours are named by role (`surface-primary`, `surface-elevated`, `danger-subtle`) rather than raw values. Critical for theme switching.
- **Auto-contrast text** — foreground colour adapts to background luminance. Ensures WCAG compliance across both themes.
- **Smooth focus rings** — animated outline that fades in on keyboard focus instead of a hard border. Prioritise accessibility without sacrificing aesthetics.

### 1.8 Kibo UI / Eldora UI / Inspira UI

- **Animation-first philosophy** — every component has a default entrance, exit, and interaction animation. Nothing appears without motion; nothing disappears abruptly.
- **Composable motion primitives** — shared `<AnimateIn>` wrapper components that accept `variant`, `delay`, and `stagger` props. Keeps animation consistent and centrally managed.
- **Design-forward card layouts** — asymmetric grids, overlapping elements, and intentional negative space that feel editorial, not templated.

---

## 2 · Motion Libraries

### 2.1 Motion.dev (Framer Motion v12)

| Technique | EarthSphere Use |
|---|---|
| **`useScroll` + `useTransform`** | Parallax depth on the hero globe: background stars scroll slower than the Earth model |
| **`AnimatePresence`** with `mode="popLayout"` | Sidebar content transitions: old event detail exits left while new one enters right, maintaining spatial consistency |
| **Layout animations** with `layoutId` | When an event marker is clicked, the marker chip morphs into the detail card — shared layout animation bridges the gap |
| **Spring physics** (`type: "spring"`, `stiffness: 260`, `damping: 20`) | Default for all interactive feedback; snappy yet natural |
| **Scroll-linked progress** | Top progress bar, parallax layers, and the date-range scrubber all driven by scroll position |
| **`whileHover` / `whileTap`** | Hover: subtle scale (1.02) + shadow lift. Tap: scale down (0.97) + shadow flatten |
| **Variants + stagger** | Category cards and event list items animate with `staggerChildren: 0.06` for cascading entrance |
| **Drag gestures** | Map layer panel can be drag-dismissed on mobile |

### 2.2 GSAP

| Technique | EarthSphere Use |
|---|---|
| **ScrollTrigger pinning** | Pin the globe section while the story panels scroll alongside — a narrative "scroll story" experience |
| **Timeline sequencing** | Orchestrate the hero entrance: globe fades in → title types → stats counter rolls → CTA shimmers — all in a single timeline |
| **SplitText** | Animate individual characters for section transitions (e.g., "Wildfires" splits apart and reforms as "Storms" on category change) |
| **Smooth scroll (Lenis integration)** | Site-wide butter-smooth scroll at 60 fps, preventing janky native scroll |
| **Scrub-linked animations** | Tie animation progress to scroll position for the hero parallax and the timeline bar |

---

## 3 · Premium Product Design Language Studies

### 3.1 Apple.com

- **Typography hierarchy**: one display typeface at massive scale, one body typeface at readable scale. No more than two weights visible at once. Apply: use Inter Display for headlines, Inter for body.
- **Whitespace as a feature**: generous padding (80–120 px section gaps) makes content breathe and feel expensive. EarthSphere should resist the urge to pack the dashboard.
- **Soft shadows**: shadows are warm-toned (`rgba(0,0,0,0.04)`) and large-radius (`blur 40px`), never harsh. Conveys floating depth without hard edges.
- **Warm whites**: background is not `#fff` but `#fafaf9` or `#f5f5f0` — slightly warm, easy on the eyes, and feels premium.
- **Subtle scroll-triggered fades**: content fades and lifts (20 px translate-y) on scroll entry. No bouncing, no overshooting — restrained elegance.

### 3.2 Stripe

- **Data visualization cards**: charts embedded in rounded cards with generous padding, axis labels in muted grey, and accent-coloured data lines. Clean, not cluttered.
- **Card depth system**: three levels — flat, raised (4 px shadow), and floating (16 px shadow + border glow). Each level has a semantic purpose.
- **Gradient mesh backgrounds**: multi-colour gradients that shift subtly, giving life to dark backgrounds without being distracting.
- **Premium dark mode**: not pure `#000` — uses `#0a0a0f` with a hint of blue. Text is `#e5e5ea`, not white. Reduces eye strain and adds richness.
- **Pill-shaped navigation**: top nav items are soft-rounded pills with background highlight on active. Apply to the category filter bar.

### 3.3 Linear.app

- **Motion as brand**: every panel slides, every list reorders, every tooltip springs. Motion is not decoration; it is the product language.
- **Command palette (⌘K)**: a central search/command overlay with fuzzy matching. EarthSphere already has `cmdk` — lean into it as the primary navigation method.
- **Minimal chrome**: no heavy borders, no thick headers. UI recedes; content dominates. Sidebar is a thin rail of icons.
- **Keyboard-first UX**: every action is reachable via keyboard shortcut. Display shortcut hints in tooltips and the command palette.
- **Status colour coding**: limited palette of semantic colours (red, amber, green, blue, purple) mapped to states. Map to event severity levels.

### 3.4 Arc Browser

- **Colour personalization**: users choose a theme colour that tints the entire UI. Consider letting users pick an accent that washes over the sidebar and toolbar.
- **Spatial organisation**: tabs are arranged spatially (pinned, today, archived) instead of linearly. Events could be grouped spatially: by region, by severity, by recency.
- **Translucent sidebar**: the sidebar lets the page bleed through at low opacity. Reinforces the glass-morphism language.

### 3.5 Vercel

- **Deployment cards**: status cards with a left-coloured border indicating state (green = live, yellow = building, red = error). Adapt for event severity: green = resolved, amber = monitoring, red = active.
- **Monospace accents**: code-like monospace text for IDs, coordinates, and timestamps alongside proportional body text. Creates visual contrast and signals "data".
- **Triangular deployment arrows**: small animated arrows indicate deployment direction. Adapt as directional indicators on storm-path polylines.

### 3.6 Windy.com

- **Map-dominant layout**: the map is 100 % of the viewport; all UI floats on top. EarthSphere should do the same — the map is the hero, everything else is an overlay.
- **Layer control panel**: a compact side panel with toggleable layers (wind, rain, temperature). Translate to EONET categories: wildfires, severe storms, volcanoes, sea/lake ice.
- **Animated weather particles**: wind particles flow across the map in real time. Explore particle effects for active storm events using the Three.js dependency already installed.
- **Bottom timeline scrubber**: a horizontal timeline at the bottom for selecting forecast hours. Adapt for EONET date range selection.

### 3.7 FlightRadar24

- **Live markers with rotation**: aircraft icons rotate to their heading. Event markers could pulse or rotate based on severity/recency.
- **Clustered markers**: at low zoom, markers cluster into count badges that expand on zoom. Essential for EONET data to avoid marker overload.
- **Info popup on click**: clicking a marker slides in a compact detail card with key stats. Should be implemented as a Motion layout animation.
- **Real-time data heartbeat**: subtle pulsing dot on markers to indicate live data. Active events should pulse; resolved events should be static.

### 3.8 Google Earth

- **3D globe as entry point**: the first thing the user sees is a spinning globe. EarthSphere's Three.js globe is the hero — make it the emotional centrepiece.
- **Zoom-to-location transitions**: clicking a point smoothly flies the camera to that location. `maplibre-gl`'s `flyTo` with eased duration achieves this.
- **Storytelling scroll**: Google Earth's "Voyager" stories scroll through narrative panels while the globe rotates. Adapt for an "Event Story" mode.
- **Satellite imagery richness**: high-res tiles make the experience feel premium. Use NASA GIBS tiles at the highest available resolution.

### 3.9 NASA Worldview

- **GIBS tile integration**: Worldview uses `https://gibs.earthdata.nasa.gov` for satellite tiles. EarthSphere should integrate the same GIBS WMTS endpoint for real imagery layers (MODIS, VIIRS).
- **Date picker with satellite context**: the date selector shows which imagery is available per day. EarthSphere's date range picker should indicate data density.
- **Layer management drawer**: a right-side drawer lists active layers with drag-to-reorder. Useful for managing overlapping data layers.
- **Comparison slider**: a draggable before/after slider comparing two dates of imagery. A premium feature for visualising event progression.

---

## 4 · EarthSphere Design Language Synthesis

> Combining the best ideas above into a cohesive, ownable design identity.

### 4.1 Motion Language

| Property | Value | Rationale |
|---|---|---|
| Default spring | `stiffness: 260, damping: 20` | Snappy but not robotic — feels like a well-tuned physical object (Linear-inspired) |
| Gentle spring | `stiffness: 120, damping: 14` | For large layout shifts, sidebar open/close, and panel transitions |
| Micro spring | `stiffness: 400, damping: 28` | For hover/tap feedback — fast, punchy, barely noticeable individually but collectively adds polish |
| Entrance easing | `[0.25, 0.46, 0.45, 0.94]` (ease-out) | Content enters quickly and decelerates — things "arrive" rather than "bounce in" |
| Exit easing | `[0.55, 0.06, 0.68, 0.19]` (ease-in) | Content accelerates out of view — things "depart" purposefully |
| Stagger delay | `0.06s` between children | Cascade feels intentional without being sluggish |
| Scroll parallax | Factor `0.15–0.3` for background layers | Subtle depth; never more than 30 % offset to avoid nausea |
| Duration ceiling | `500ms` for any single animation | Nothing should make the user wait; respect their time |

### 4.2 Colour Philosophy

**Dark Mode — "Deep Space"**
- Background: `#0a0a12` (near-black with blue undertone — the colour of looking at Earth from orbit)
- Surface: `#12121e` (elevated panels float above the void)
- Surface elevated: `#1a1a2e` (cards and modals)
- Border: `rgba(255, 255, 255, 0.06)` (barely-there edges)
- Text primary: `#e8e8ed` (soft white, never pure `#fff`)
- Text muted: `#6e6e80` (recedes but remains legible)
- Accent: `#3b82f6` (satellite blue — the colour of MODIS ocean scans)
- Danger: `#ef4444` (wildfire red)
- Warning: `#f59e0b` (amber alert)
- Success: `#10b981` (resolved green)

**Light Mode — "Golden Hour"**
- Background: `#fafaf7` (warm white — the colour of morning light on clouds)
- Surface: `#ffffff`
- Surface elevated: `#ffffff` with `shadow-lg`
- Border: `rgba(0, 0, 0, 0.06)`
- Text primary: `#1a1a2e` (dark ink, not pure black)
- Accent: `#2563eb` (slightly deeper blue for contrast)

### 4.3 Typography Rules

| Role | Font | Weight | Size (desktop) | Tracking |
|---|---|---|---|---|
| Display | Geist Sans | 700 | 48–64 px | `−0.02em` |
| Heading 1 | Geist Sans | 600 | 32–40 px | `−0.015em` |
| Heading 2 | Geist Sans | 600 | 24–28 px | `−0.01em` |
| Heading 3 | Geist Sans | 500 | 18–20 px | `0em` |
| Body | Geist Sans | 400 | 15–16 px | `0em` |
| Caption | Geist Sans | 400 | 12–13 px | `0.01em` |
| Code/Data | Geist Mono | 400 | 13–14 px | `0em` |

- Display text is reserved for the hero and empty states only — never mid-page.
- Headings use negative tracking for tighter, more editorial feel.
- Code/Data font (Geist Mono) is used for coordinates, event IDs, timestamps, and any machine-readable value.

### 4.4 Depth System (5 Levels)

| Level | Shadow | Glow | Use |
|---|---|---|---|
| **0 — Flat** | none | none | Default resting state for inline elements |
| **1 — Raised** | `0 1px 3px rgba(0,0,0,0.08)` | none | Cards at rest, input fields |
| **2 — Elevated** | `0 4px 12px rgba(0,0,0,0.10)` | none | Hovered cards, dropdowns |
| **3 — Floating** | `0 8px 30px rgba(0,0,0,0.12)` | `0 0 40px rgba(59,130,246,0.06)` | Active/selected card, popover panels |
| **4 — Overlay** | `0 16px 48px rgba(0,0,0,0.16)` | `0 0 60px rgba(59,130,246,0.08)` | Modals, command palette, mobile sheets |
| **5 — Cinematic** | `0 24px 64px rgba(0,0,0,0.24)` | `0 0 80px rgba(59,130,246,0.12)` | Hero globe container, onboarding spotlight |

- In dark mode, shadows are near-invisible; **glows become the primary depth cue** (blue-tinted ambient light, as if lit by Earth's reflected glow).
- In light mode, shadows do the heavy lifting; glows are suppressed.

### 4.5 Interaction Patterns

- **Magnetic cursor** — interactive elements subtly pull toward the cursor within a 60 px radius (Aceternity spotlight adapted). Use on primary buttons and the globe.
- **Spotlight reveal** — a radial gradient follows the cursor across card surfaces, illuminating content beneath (15 % opacity, 200 px radius).
- **3D tilt** — cards rotate up to ±5° on both axes based on pointer position. Reserved for the globe card and category hero cards only — overuse cheapens the effect.
- **Spring press** — all buttons and clickable cards scale to `0.97` on press and `1.02` on hover, with the micro spring config.
- **Border beam** — a light trace orbits the border of the currently selected/active event card, signalling live data.
- **Scroll-triggered entrance** — content enters with `opacity: 0 → 1` and `translateY: 12px → 0` as it crosses the viewport threshold. One animation per element, once.
- **Layout morph** — when a sidebar item is clicked, its container morphs (via `layoutId`) into the detail panel, maintaining spatial continuity.

### 4.6 Data Visualization Approach

- **Glassmorphism tooltips** — chart tooltips use `backdrop-blur(12px)` with a semi-transparent background and a 1 px border. They float above the chart, not inline.
- **Animated entry** — chart data points / bars / lines animate in from their axis baseline with spring physics on first render and on data change.
- **Colour coding by category** — each EONET category has a signature colour: Wildfires (`#ef4444`), Severe Storms (`#8b5cf6`), Volcanoes (`#f97316`), Sea Ice (`#06b6d4`), Floods (`#3b82f6`), Drought (`#eab308`).
- **Number tickers** — all numeric displays (event counts, coordinates, magnitudes) use a rolling ticker animation on value change, not a hard swap.
- **Sparkline cards** — small trend charts embedded in stat cards showing event frequency over 30 days. Minimal axes, thin line, area fill at 10 % opacity.
- **Map markers** — pulsing concentric circles for active events (pulse rate proportional to severity), static filled circles for historical events. Cluster badges at low zoom levels with a count and dominant-category colour.
- **Recharts styling** — custom theme tokens passed to Recharts: rounded corners on bars, gradient fills on areas, dot-less line charts with 2 px strokes.

### 4.7 Scroll Storytelling

The premium experience should feel like a **camera exploring Earth**:

1. **Hero section (pinned)** — the Three.js globe fills the viewport and slowly rotates. As the user scrolls, the globe zooms in and the camera tilts to reveal the map below. GSAP ScrollTrigger pins the globe while story panels scroll alongside (Google Earth Voyager pattern).
2. **Transition zone** — the globe fades to the flat Maplibre map with a cross-dissolve, maintaining the blue-marble colour palette for visual continuity.
3. **Dashboard reveal** — stat cards enter with staggered spring animations. The sidebar slides in from the left. The timeline scrubber rises from the bottom.
4. **Scroll-linked date progression** — as the user scrolls down a dedicated "Event Timeline" section, the map's date filter automatically advances, replaying recent events like a time-lapse.
5. **Section transitions** — between major sections, a subtle parallax shift (background moves at 0.85× speed) and a soft colour-grade change (warm to cool) signals context change.

---

*End of Phase 3 research. Next phase: translate these patterns into TypeScript design tokens and Motion presets.*
