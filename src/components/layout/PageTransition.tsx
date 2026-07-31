"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { pageTransition } from "@/lib/motion-presets";

// ---------------------------------------------------------------------------
// PageTransition – Wraps page content with enter/exit animation
// ---------------------------------------------------------------------------

/**
 * PageTransition wrapper
 * Uses AnimatePresence to handle exit animations across route changes.
 *
 * @example
 * <PageTransition>
 *   <main>Content</main>
 * </PageTransition>
 */
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  // Combine pageTransition preset with requested scale adjustments
  const transitionProps = {
    initial: { ...pageTransition.initial, scale: 0.98 },
    animate: { ...pageTransition.animate, scale: 1.0 },
    exit: { ...pageTransition.exit, scale: 0.98 },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        {...transitionProps}
        className={cn(className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
