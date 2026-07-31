// =============================================================================
// EarthSphere — Design Tokens (Phase 4)
// TypeScript mirrors of the CSS custom-property system in globals.css.
// Use these constants for Motion animations, programmatic inline styles,
// canvas/WebGL rendering, and anywhere CSS custom properties can't reach.
//
// CSS remains the single source of truth for runtime theming. These tokens
// snapshot the dark-mode defaults so JS consumers have statically-typed,
// tree-shakable values without reading the DOM at runtime.
// =============================================================================

import {
  COLORS as LEGACY_COLORS,
  ANIMATION_DURATION as LEGACY_ANIMATION_DURATION,
  ANIMATION_SECONDS as LEGACY_ANIMATION_SECONDS,
} from './utils';

// -----------------------------------------------------------------------------
// Shared Types
// -----------------------------------------------------------------------------

/** A cubic-bezier tuple for Motion / CSS transitions. */
export type CubicBezier = readonly [number, number, number, number];

/** An RGB triplet for compositing with variable opacity (e.g. particles). */
export type RGBTriplet = readonly [number, number, number];

// -----------------------------------------------------------------------------
// 1. Brand & Atmospheric Colors
// -----------------------------------------------------------------------------

/**
 * Core brand palette from `:root` in globals.css.
 * Every value is the dark-mode hex default.
 */
export const colors = {
  spaceBlack: '#050714',
  deepBlue: '#101936',
  electricCyan: '#00d4aa',
  electricBlue: '#45b8ff',
  solarOrange: '#ff6b35',
  cosmicPurple: '#7c3aed',
  iceBlue: '#38bdf8',
  warningRed: '#ef4444',
  auroraMint: '#6ee7d0',
} as const;

// -----------------------------------------------------------------------------
// 2. Canvas & Content Surfaces
// -----------------------------------------------------------------------------

/**
 * Surface tokens for layered backgrounds.
 * Progresses from deepest canvas → elevated panes → overlays.
 */
export const surfaces = {
  canvas: '#050714',
  canvasRaised: '#090d1d',
  canvasAmbient: '#0b1026',
  primary: '#0b1020',
  secondary: '#11182b',
  elevated: '#17213a',
  overlay: 'rgba(5, 7, 20, 0.82)',
  sunken: 'rgba(3, 5, 15, 0.54)',
} as const;

// -----------------------------------------------------------------------------
// 3. Text Colors
// -----------------------------------------------------------------------------

/**
 * AA-ready text colors for the dark theme.
 * `primary` achieves ≥7 : 1 contrast on `surfaces.canvas`.
 */
export const textColors = {
  primary: '#f4f7ff',
  secondary: '#b5c0d8',
  muted: '#7f8ba6',
  accent: '#00d4aa',
} as const;

// -----------------------------------------------------------------------------
// 4. Border Colors
// -----------------------------------------------------------------------------

/** Intentional border tones — translucent to layer over any surface. */
export const borders = {
  default: 'rgba(208, 225, 255, 0.1)',
  subtle: 'rgba(208, 225, 255, 0.06)',
  hover: 'rgba(219, 235, 255, 0.2)',
  accent: 'rgba(0, 212, 170, 0.38)',
  glow: 'rgba(69, 184, 255, 0.34)',
} as const;

// -----------------------------------------------------------------------------
// 5. EONET Category Colors — All 13 Categories
// -----------------------------------------------------------------------------

/**
 * Hex colors for every NASA EONET category. Keys match `CATEGORY_CONFIG`
 * in `utils.ts` so lookups stay consistent across the app.
 */
export const categoryColors = {
  wildfires: '#ff6b35',
  severeStorms: '#38bdf8',
  volcanoes: '#ef4444',
  earthquakes: '#a855f7',
  floods: '#3b82f6',
  drought: '#f59e0b',
  snow: '#e2e8f0',
  seaLakeIce: '#06b6d4',
  landslides: '#92400e',
  dustHaze: '#d4a574',
  tempExtremes: '#dc2626',
  waterColor: '#0ea5e9',
  manmade: '#6b7280',
} as const;

// -----------------------------------------------------------------------------
// 6. Depth — Layered Box-Shadow Presets
// -----------------------------------------------------------------------------

/**
 * Progressive depth shadows (1 → 5). Apply via inline `boxShadow` style
 * or compose with glows for interactive elevation changes.
 */
export const depth = {
  1: '0 1px 2px rgba(1, 3, 12, 0.18), 0 1px 1px rgba(1, 3, 12, 0.12)',
  2: '0 8px 20px rgba(1, 3, 12, 0.2), 0 2px 5px rgba(1, 3, 12, 0.16)',
  3: '0 18px 46px rgba(1, 3, 12, 0.28), 0 5px 14px rgba(1, 3, 12, 0.2)',
  4: '0 30px 76px rgba(0, 2, 13, 0.38), 0 10px 28px rgba(0, 2, 13, 0.25)',
  5: '0 48px 120px rgba(0, 2, 13, 0.48), 0 18px 42px rgba(0, 2, 13, 0.3)',
} as const;

/** Colored directional shadows for hero sections and focused elements. */
export const coloredShadows = {
  cyan: '0 14px 42px rgba(0, 212, 170, 0.2)',
  blue: '0 16px 48px rgba(69, 184, 255, 0.2)',
  violet: '0 16px 48px rgba(124, 58, 237, 0.2)',
} as const;

// -----------------------------------------------------------------------------
// 7. Glow Presets
// -----------------------------------------------------------------------------

/**
 * Glow ring + diffuse halo shadows for active/focused interactive elements.
 * Combine with `depth` for elevated-and-glowing states.
 */
export const glows = {
  cyan: '0 0 0 1px rgba(0, 212, 170, 0.14), 0 0 30px rgba(0, 212, 170, 0.2)',
  blue: '0 0 0 1px rgba(69, 184, 255, 0.15), 0 0 34px rgba(69, 184, 255, 0.2)',
  violet: '0 0 0 1px rgba(124, 58, 237, 0.14), 0 0 30px rgba(124, 58, 237, 0.18)',
} as const;

// -----------------------------------------------------------------------------
// 8. Glassmorphism Presets
// -----------------------------------------------------------------------------

/**
 * Ready-to-spread objects for inline `style` props on glass surfaces.
 *
 * @example
 * ```tsx
 * <div style={{ ...glass.default, borderRadius: radii.lg }}>…</div>
 * ```
 */
export const glass = {
  /** Standard glass panel — modals, sidebars, popovers. */
  default: {
    background: 'rgba(13, 19, 39, 0.58)',
    backdropFilter: 'blur(16px) saturate(180%)',
    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
    border: '1px solid rgba(215, 235, 255, 0.12)',
    boxShadow: depth[2],
  },
  /** Heavy frost — full-bleed overlays, command palettes. */
  strong: {
    background: 'rgba(13, 19, 39, 0.8)',
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    border: '1px solid rgba(215, 235, 255, 0.18)',
    boxShadow: depth[3],
  },
  /** Whisper frost — inline chips, secondary surfaces. */
  subtle: {
    background: 'rgba(17, 24, 43, 0.4)',
    backdropFilter: 'blur(8px) saturate(180%)',
    WebkitBackdropFilter: 'blur(8px) saturate(180%)',
    border: '1px solid rgba(208, 225, 255, 0.06)',
    boxShadow: depth[1],
  },
} as const;

// -----------------------------------------------------------------------------
// 9. Spacing Scale
// -----------------------------------------------------------------------------

/**
 * 4-point spatial rhythm in pixels (numeric keys) plus responsive CSS
 * clamp functions for page-level primitives (string keys).
 */
export const spacing = {
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  gutter: 'clamp(1.25rem, 4vw, 4rem)',
  section: 'clamp(4.5rem, 9vw, 8rem)',
  sectionLg: 'clamp(6rem, 12vw, 11rem)',
} as const;

/** Pixel equivalents for JS layout math (e.g. canvas offsets). */
export const spacingPx = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

/** Content width constraints matching `.ep-container` and `.ep-prose`. */
export const contentWidths = {
  max: '76rem',
  prose: '43rem',
} as const;

// -----------------------------------------------------------------------------
// 10. Typography
// -----------------------------------------------------------------------------

/**
 * Font stacks, tracking, and leading tokens.
 * Use CSS `var(--font-*)` in components; these are for JS-only contexts.
 */
export const typography = {
  /** Font family stacks — mirrors `--font-display`, `--font-body`, `--font-code`. */
  families: {
    display: 'var(--font-ibm-plex-sans), ui-sans-serif, system-ui, sans-serif',
    body: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
    code: 'var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, monospace',
  },
  /** Letter-spacing presets. */
  tracking: {
    display: '-0.045em',
    heading: '-0.025em',
    eyebrow: '0.14em',
  },
  /** Line-height presets. */
  leading: {
    display: 0.98,
    heading: 1.08,
  },
  /** Preset combinations for common typographic roles. */
  presets: {
    display: {
      fontSize: 'clamp(2.75rem, 7vw, 6.5rem)',
      fontWeight: 600,
      letterSpacing: '-0.045em',
      lineHeight: 0.98,
    },
    heading: {
      letterSpacing: '-0.025em',
      lineHeight: 1.08,
    },
    eyebrow: {
      fontSize: '0.6875rem',
      fontWeight: 700,
      letterSpacing: '0.14em',
      lineHeight: 1.2,
      textTransform: 'uppercase' as const,
    },
  },
} as const;

// -----------------------------------------------------------------------------
// 11. Border Radius Scale
// -----------------------------------------------------------------------------

/** Border radius in pixels, matching `--shape-radius-*` custom properties. */
export const radii = {
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  pill: '9999px',
} as const;

/** Radius in raw pixel numbers for canvas / SVG math. */
export const radiiPx = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  pill: 9999,
} as const;

// -----------------------------------------------------------------------------
// 12. Timing — Motion Bible Bands
// -----------------------------------------------------------------------------

/**
 * Duration bands in **seconds**. Each band has a min/max range;
 * pick a value within the range based on element size and travel distance.
 *
 * - **micro** — Badges, toggles, icon flips (120–180 ms)
 * - **standard** — Cards, menus, dropdowns (220–320 ms)
 * - **complex** — Panels, modals, multi-step reveals (450–650 ms)
 * - **cinematic** — Page transitions, hero entrances (800–1200 ms)
 */
export const timing = {
  micro: { min: 0.12, max: 0.18 },
  standard: { min: 0.22, max: 0.32 },
  complex: { min: 0.45, max: 0.65 },
  cinematic: { min: 0.8, max: 1.2 },
} as const;

/** Flat duration values in seconds for quick access (center of each band). */
export const durations = {
  instant: 0.12,
  fast: 0.16,
  standard: 0.28,
  slow: 0.52,
  cinematic: 0.9,
} as const;

/** Flat duration values in milliseconds for `setTimeout` / CSS transitions. */
export const durationsMs = {
  instant: 120,
  fast: 160,
  standard: 280,
  slow: 520,
  cinematic: 900,
} as const;

// -----------------------------------------------------------------------------
// 13. Easing Curves
// -----------------------------------------------------------------------------

/**
 * Easing presets as cubic-bezier tuples (for Motion) and CSS strings.
 *
 * - **premium** — Default deceleration for most transitions.
 * - **emphasized** — Slightly more dramatic entry; good for modals.
 * - **bounce** — Overshooting spring feel; use sparingly on small elements.
 */
export const easing = {
  /** Tuples for Motion `ease` prop. */
  premium: [0.16, 1, 0.3, 1] as const,
  emphasized: [0.22, 1, 0.36, 1] as const,
  bounce: [0.34, 1.56, 0.64, 1] as const,

  /** CSS `cubic-bezier()` strings for inline styles / CSS-in-JS. */
  premiumCSS: 'cubic-bezier(0.16, 1, 0.3, 1)',
  emphasizedCSS: 'cubic-bezier(0.22, 1, 0.36, 1)',
  bounceCSS: 'cubic-bezier(0.34, 1.56, 0.64, 1)',

  /** CSS custom-property references for use in template strings. */
  premiumVar: 'var(--ease-premium)',
  emphasizedVar: 'var(--ease-emphasized)',
  bounceVar: 'var(--ease-bounce)',
} as const;

// -----------------------------------------------------------------------------
// 14. Gradients
// -----------------------------------------------------------------------------

/** Key gradient definitions matching globals.css. */
export const gradients = {
  /** Full-page canvas background with radial highlight. */
  canvas:
    'radial-gradient(circle at 50% -20%, rgba(37, 85, 159, 0.18), transparent 46%), linear-gradient(180deg, #0a0f22 0%, #050714 56%)',
  /** Signature aurora sweep — hero headlines, CTA highlights. */
  aurora: 'linear-gradient(125deg, #00d4aa 0%, #45b8ff 50%, #8b5cf6 100%)',
  /** Border gradient for premium card outlines. */
  border:
    'linear-gradient(135deg, rgba(110, 231, 208, 0.42), rgba(69, 184, 255, 0.18) 46%, rgba(139, 92, 246, 0.38))',
  /** Subdued border gradient for secondary surfaces. */
  borderSubtle:
    'linear-gradient(135deg, rgba(211, 232, 255, 0.18), rgba(211, 232, 255, 0.035))',
  /**
   * Text-clipping variant of the aurora gradient.
   * Uses 90° (horizontal) for smoother left-to-right clipping on inline text.
   * Intentionally different angle from `aurora` (125°) — DO NOT merge.
   */
  text: 'linear-gradient(90deg, #00d4aa 0%, #45b8ff 50%, #8b5cf6 100%)',
} as const;

// -----------------------------------------------------------------------------
// 15. Particle RGB Triplets
// -----------------------------------------------------------------------------

/**
 * RGB channel values for particle systems and canvas effects.
 * Compose with dynamic opacity: `rgba(${particles.cyan.join(',')}, 0.6)`.
 */
export const particles = {
  cyan: [0, 212, 170] as RGBTriplet,
  blue: [69, 184, 255] as RGBTriplet,
  violet: [139, 92, 246] as RGBTriplet,
  warm: [255, 157, 92] as RGBTriplet,
} as const;

// -----------------------------------------------------------------------------
// 16. CSS Custom-Property References
// -----------------------------------------------------------------------------

/**
 * Named `var()` references for components that must follow the active theme
 * at runtime (dark ↔ light). Prefer these over hard-coded hex values
 * whenever the element will be rendered in the DOM (not canvas).
 */
export const cssVars = {
  canvas: 'var(--canvas)',
  canvasRaised: 'var(--canvas-raised)',
  surface: 'var(--surface-primary)',
  surfaceSecondary: 'var(--surface-secondary)',
  surfaceElevated: 'var(--surface-elevated)',
  text: 'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
  textMuted: 'var(--text-muted)',
  accent: 'var(--electric-cyan)',
  border: 'var(--border-default)',
  borderSubtle: 'var(--border-subtle)',
  glass: 'var(--glass-bg)',
  glassStrong: 'var(--glass-bg-strong)',
  glowCyan: 'var(--glow-cyan)',
  glowBlue: 'var(--glow-blue)',
  glowViolet: 'var(--glow-violet)',
} as const;

// -----------------------------------------------------------------------------
// 17. Spring Presets (shared with motion-presets.ts)
// -----------------------------------------------------------------------------

/**
 * Named spring configurations for Motion's `transition` prop.
 * Exported here so design-tokens is the single authority;
 * motion-presets.ts re-exports these with richer variant wrappers.
 */
export const springPresets = {
  /** Soft, organic feel — panels, drawers, page sections. */
  gentle: { type: 'spring' as const, stiffness: 120, damping: 20, mass: 1 },
  /** Responsive, precise — menus, dropdowns, tooltips. */
  snappy: { type: 'spring' as const, stiffness: 300, damping: 30, mass: 0.8 },
  /** Playful overshoot — notifications, toasts, popovers. */
  bouncy: { type: 'spring' as const, stiffness: 400, damping: 15, mass: 0.5 },
  /** Weighted, cinematic — modals, full-screen overlays. */
  heavy: { type: 'spring' as const, stiffness: 200, damping: 40, mass: 1.5 },
  /** Ultra-fast response — buttons, badges, toggles. */
  micro: { type: 'spring' as const, stiffness: 500, damping: 30, mass: 0.5 },
} as const;

// -----------------------------------------------------------------------------
// Aggregate Export
// -----------------------------------------------------------------------------

/**
 * Convenience barrel object containing every token group.
 * Prefer individual named imports for tree-shaking; use this for
 * debug tooling or runtime introspection.
 */
export const DESIGN_TOKENS = {
  colors,
  surfaces,
  textColors,
  borders,
  categoryColors,
  depth,
  coloredShadows,
  glows,
  glass,
  spacing,
  spacingPx,
  contentWidths,
  typography,
  radii,
  radiiPx,
  timing,
  durations,
  durationsMs,
  easing,
  gradients,
  particles,
  cssVars,
  springPresets,
} as const;

// -----------------------------------------------------------------------------
// Backwards-Compatible Re-exports
// -----------------------------------------------------------------------------

/**
 * @deprecated Use `colors` from this module instead.
 * Re-exported from `utils.ts` for existing consumers.
 */
export const COLORS = LEGACY_COLORS;

/**
 * @deprecated Use `durationsMs` from this module instead.
 * Re-exported from `utils.ts` for existing consumers.
 */
export const ANIMATION_DURATION = LEGACY_ANIMATION_DURATION;

/**
 * @deprecated Use `durations` from this module instead.
 * Re-exported from `utils.ts` for existing consumers.
 */
export const ANIMATION_SECONDS = LEGACY_ANIMATION_SECONDS;

// Legacy aliases used by the existing motion-presets.ts before this rewrite.
// Will be removed in Phase 5 once all consumers migrate.

/** @deprecated Use `durations` instead. */
export const DURATIONS = durations;

/** @deprecated Use `easing` instead. */
export const EASINGS = {
  premium: easing.premium,
  emphasized: easing.emphasized,
  bounce: easing.bounce,
} as const;

/** @deprecated Use `springPresets` instead. */
export const SPRING_PRESETS = springPresets;

/** @deprecated Use `depth` instead. */
export const DEPTHS = depth;
