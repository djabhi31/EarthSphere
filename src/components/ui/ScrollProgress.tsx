/**
 * @file ScrollProgress.tsx
 * @description A global scroll progress bar displayed at the top of the page.
 */
'use client';

import { useScroll, useSpring, useTransform, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { cssVars } from '@/lib/design-tokens';

/**
 * ScrollProgress Component
 * Displays a thin gradient bar at the top of the viewport indicating scroll progress.
 * Uses motion/react for smooth animations and respects reduced motion preferences.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const prefersReduced = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Spring configuration for smooth tracking, unless reduced motion is preferred
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Calculate opacity based on scroll position
  // Fade in after 5% (0.05) and fade out right before 100% (0.99)
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.95, 1],
    [0, 1, 1, 0]
  );

  if (!isMounted) return null;

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-gradient-to-r from-[var(--electric-cyan)] to-[var(--cosmic-purple)]"
      style={{
        scaleX: prefersReduced ? scrollYProgress : scaleX,
        opacity,
      }}
    />
  );
}
