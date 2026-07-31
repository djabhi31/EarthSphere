// =============================================================================
// EarthSphere — Motion Presets (Phase 4)
// Reusable Motion (v12+) variants, spring configs, and animation helpers.
// Replaces ad-hoc motion patterns scattered across components with a single,
// intentional motion language aligned to the Motion Bible timing bands.
//
// IMPORTANT: This module imports from `motion/react`, NOT `framer-motion`.
// =============================================================================

import type { Transition, Variants } from 'motion/react';

import {
  springPresets,
  durations,
  easing,
} from '@/lib/design-tokens';

// -----------------------------------------------------------------------------
// 1. Spring Presets
// -----------------------------------------------------------------------------

/**
 * Named spring configurations matching the Motion Bible.
 * Re-exported from design-tokens for co-location with motion utilities.
 *
 * | Preset  | Feel                          | Use for                           |
 * |---------|-------------------------------|-----------------------------------|
 * | gentle  | Soft, organic                 | Panels, drawers, page sections    |
 * | snappy  | Responsive, precise           | Menus, dropdowns, tooltips        |
 * | bouncy  | Playful overshoot             | Notifications, toasts, popovers   |
 * | heavy   | Weighted, cinematic           | Modals, full-screen overlays      |
 * | micro   | Ultra-fast response           | Buttons, badges, toggles          |
 */
export const springs = {
  gentle: { ...springPresets.gentle },
  snappy: { ...springPresets.snappy },
  bouncy: { ...springPresets.bouncy },
  heavy: { ...springPresets.heavy },
  micro: { ...springPresets.micro },
} satisfies Record<string, Transition>;

// -----------------------------------------------------------------------------
// 2. Transition Presets
// -----------------------------------------------------------------------------

/**
 * Common tween transitions pairing Motion Bible durations with easing curves.
 *
 * @example
 * ```tsx
 * <motion.div animate={{ opacity: 1 }} transition={transitions.standard} />
 * ```
 */
export const transitions = {
  /** Micro interactions — icon flips, badge reveals, toggles (160ms). */
  fast: { duration: durations.fast, ease: easing.premium },
  /** General-purpose — cards, menus, dropdowns (280ms). */
  standard: { duration: durations.standard, ease: easing.emphasized },
  /** Complex reveals — panels, multi-step sequences (520ms). */
  slow: { duration: durations.slow, ease: easing.premium },
  /** Cinematic entrances — page transitions, hero reveals (900ms). */
  cinematic: { duration: durations.cinematic, ease: easing.premium },
} satisfies Record<string, Transition>;

// -----------------------------------------------------------------------------
// 3. Variant Presets — Reusable Animation Variants
// -----------------------------------------------------------------------------

/**
 * Opacity-only fade entrance.
 *
 * States: `hidden` → `visible` → `exit`
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.standard },
  exit: { opacity: 0, transition: transitions.fast },
};

/**
 * Fade + upward slide — the most common entrance pattern.
 *
 * States: `hidden` (24px below, transparent) → `visible` → `exit`
 */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: springs.gentle },
  exit: { opacity: 0, y: 12, transition: transitions.fast },
};

/**
 * Fade + downward slide — dropdown menus, toast notifications.
 *
 * States: `hidden` (16px above, transparent) → `visible` → `exit`
 */
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: springs.gentle },
  exit: { opacity: 0, y: -8, transition: transitions.fast },
};

/**
 * Fade + slide from left — sidebar reveals, navigation drawers.
 *
 * States: `hidden` (32px left, transparent) → `visible` → `exit`
 */
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: springs.gentle },
  exit: { opacity: 0, x: -16, transition: transitions.fast },
};

/**
 * Fade + slide from right — panel openings, detail views.
 *
 * States: `hidden` (32px right, transparent) → `visible` → `exit`
 */
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: springs.gentle },
  exit: { opacity: 0, x: 16, transition: transitions.fast },
};

/**
 * Scale entrance — cards, images, modals.
 *
 * States: `hidden` (96% scale, transparent) → `visible` → `exit`
 */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: springs.gentle },
  exit: { opacity: 0, scale: 0.98, transition: transitions.fast },
};

/**
 * Blur reveal — cinematic text entrances, hero elements.
 * Uses CSS `filter` for a frosted-glass-to-sharp reveal.
 *
 * States: `hidden` (blurred + offset) → `visible` (sharp) → `exit`
 */
export const blurIn: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: durations.slow, ease: easing.emphasized },
  },
  exit: { opacity: 0, filter: 'blur(4px)', transition: transitions.fast },
};

/**
 * Pure vertical slide up — sheet-style overlays, bottom drawers.
 *
 * States: `hidden` (below viewport) → `visible` → `exit`
 */
export const slideUp: Variants = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: springs.snappy },
  exit: { y: '100%', transition: transitions.standard },
};

/**
 * Pure vertical slide down — top bars, dropdown sheets.
 *
 * States: `hidden` (above viewport) → `visible` → `exit`
 */
export const slideDown: Variants = {
  hidden: { y: '-100%' },
  visible: { y: 0, transition: springs.snappy },
  exit: { y: '-100%', transition: transitions.standard },
};

/**
 * All variant presets collected in a single object for dynamic lookup.
 *
 * @example
 * ```tsx
 * const variantName = 'fadeInUp';
 * <motion.div variants={variants[variantName]} />
 * ```
 */
export const variants = {
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  blurIn,
  slideUp,
  slideDown,
} as const;

// -----------------------------------------------------------------------------
// 4. Stagger Container + Item
// -----------------------------------------------------------------------------

/**
 * Returns a stagger container variant. Apply to a parent `<motion.div>`
 * whose children use `staggerItem` as their variant.
 *
 * @param staggerDelay — Delay between each child (default 0.08s)
 * @param initialDelay — Delay before the first child animates (default 0.06s)
 *
 * @example
 * ```tsx
 * <motion.ul variants={staggerContainer()} initial="hidden" animate="visible">
 *   {items.map(item => (
 *     <motion.li key={item.id} variants={staggerItem}>{item.name}</motion.li>
 *   ))}
 * </motion.ul>
 * ```
 */
export function staggerContainer(
  staggerDelay = 0.08,
  initialDelay = 0.06,
): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: initialDelay,
        staggerChildren: staggerDelay,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: staggerDelay * 0.6,
        staggerDirection: -1,
      },
    },
  };
}

/**
 * Default stagger child variant — fade + slide up.
 * Pair with `staggerContainer()` on the parent.
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: springs.gentle },
  exit: { opacity: 0, y: 8, transition: transitions.fast },
};

/**
 * Tight stagger preset (faster cadence) for compact lists like badges, chips.
 */
export const staggerContainerTight: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.04,
      staggerChildren: 0.05,
    },
  },
};

// -----------------------------------------------------------------------------
// 5. Hover & Tap Presets
// -----------------------------------------------------------------------------

/**
 * Interaction presets for `whileHover` and `whileTap`.
 *
 * @example
 * ```tsx
 * <motion.button whileHover={hover.lift} whileTap={hover.press}>
 *   Click me
 * </motion.button>
 * ```
 */
export const hover = {
  /** Subtle lift for cards and interactive surfaces. */
  lift: {
    scale: 1.03,
    y: -2,
    transition: springs.snappy,
  },
  /** Glow-enhanced lift for primary CTA buttons. */
  glow: {
    scale: 1.04,
    y: -2,
    boxShadow: '0 0 0 1px rgba(0, 212, 170, 0.14), 0 0 30px rgba(0, 212, 170, 0.2)',
    transition: springs.snappy,
  },
  /** Slight 3D tilt for cards (combine with perspective parent). */
  tilt: {
    scale: 1.02,
    rotateX: -2,
    rotateY: 2,
    transition: springs.snappy,
  },
  /** Press-down feedback for buttons and clickable elements. */
  press: {
    scale: 0.97,
    transition: springs.micro,
  },
  /** Subtle scale-down for secondary/ghost buttons. */
  pressSubtle: {
    scale: 0.985,
    transition: springs.micro,
  },
} as const;

// -----------------------------------------------------------------------------
// 6. Scroll Reveal Configuration
// -----------------------------------------------------------------------------

/**
 * Configuration for `whileInView` — elements animate once when they
 * enter the viewport. The negative margin triggers ~60px before visible.
 *
 * @example
 * ```tsx
 * <motion.section
 *   variants={fadeInUp}
 *   initial="hidden"
 *   whileInView="visible"
 *   viewport={scrollReveal.viewport}
 * >
 *   Content revealed on scroll
 * </motion.section>
 * ```
 */
export const scrollReveal = {
  /** Viewport config — fires once, 60px before the element is visible. */
  viewport: { once: true, margin: '-60px 0px' as const },
  /** Viewport config with a higher trigger threshold for smaller elements. */
  viewportEager: { once: true, margin: '-20px 0px' as const },
} as const;

/** Offset pairs for `useScroll`. Keep movement transform-based. */
export const scrollOffsets = {
  /** Element reveals as it enters the bottom 8–38% of the viewport. */
  reveal: ['start 92%', 'start 62%'] as const,
  /** Full travel — element enters bottom, exits top. */
  travel: ['start end', 'end start'] as const,
  /** Pinned — element sticks from top-to-top, releases at bottom. */
  pin: ['start start', 'end end'] as const,
} as const;

/** Parallax pixel ranges for `useTransform`. */
export const parallaxRanges = {
  subtle: [18, -18] as const,
  medium: [36, -36] as const,
  cinematic: [72, -72] as const,
} as const;

// -----------------------------------------------------------------------------
// 7. Page Transition
// -----------------------------------------------------------------------------

/**
 * Page-level transition variants for the `PageTransition` component.
 * Uses blur + slide for a premium feel, matching the cinematic design language.
 *
 * @example
 * ```tsx
 * <AnimatePresence mode="wait">
 *   <motion.main key={pathname} {...pageTransition}>
 *     {children}
 *   </motion.main>
 * </AnimatePresence>
 * ```
 */
export const pageTransition = {
  initial: { opacity: 0, y: 12, filter: 'blur(4px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: transitions.standard,
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: 'blur(4px)',
    transition: transitions.fast,
  },
} as const;

// -----------------------------------------------------------------------------
// 8. Layout Animation Preset
// -----------------------------------------------------------------------------

/**
 * Transition config for Motion's `layout` prop and `AnimatePresence`.
 * Provides smooth positional interpolation when elements reorder.
 *
 * @example
 * ```tsx
 * <motion.div layout transition={layoutTransition}>
 *   {content}
 * </motion.div>
 * ```
 */
export const layoutTransition: Transition = {
  type: 'spring',
  stiffness: 250,
  damping: 28,
  mass: 0.9,
};

// -----------------------------------------------------------------------------
// 9. Reduced Motion Helper
// -----------------------------------------------------------------------------

/**
 * Returns simplified motion props when the user prefers reduced motion.
 * All transforms, filters, and transitions are stripped to instant opacity.
 *
 * @param prefersReduced — Result of `useReducedMotion()` or media query.
 * @param props — Full motion props (variants, initial, animate, etc.).
 * @returns Motion props safe for reduced-motion users.
 *
 * @example
 * ```tsx
 * const reduced = useReducedMotion();
 * <motion.div {...getMotionProps(reduced, { variants: fadeInUp, initial: 'hidden', animate: 'visible' })} />
 * ```
 */
export function getMotionProps<T extends Record<string, unknown>>(
  prefersReduced: boolean | null,
  props: T,
): T | { initial: { opacity: 0 }; animate: { opacity: 1 }; exit: { opacity: 0 }; transition: { duration: 0 } } {
  if (prefersReduced) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0 },
    };
  }
  return props;
}

/**
 * Returns a zero-duration transition when reduced motion is preferred.
 * Use for one-off transition overrides rather than full prop replacement.
 *
 * @param prefersReduced — Result of `useReducedMotion()` hook.
 * @param transition — The transition to use when motion is allowed.
 *
 * @example
 * ```tsx
 * const reduced = useReducedMotion();
 * <motion.div transition={withReducedMotion(reduced, springs.gentle)} />
 * ```
 */
export function withReducedMotion(
  prefersReduced: boolean | null,
  transition: Transition = transitions.standard,
): Transition {
  return prefersReduced ? { duration: 0 } : transition;
}
