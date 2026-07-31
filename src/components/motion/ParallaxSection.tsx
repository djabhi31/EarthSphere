"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// ParallaxSection – A scroll-linked parallax wrapper
// ---------------------------------------------------------------------------

/**
 * ParallaxSection translates its children up or down relative to the scroll position.
 *
 * @example
 * <ParallaxSection speed={0.5} direction="up">
 *   <img src="bg.png" alt="Background" />
 * </ParallaxSection>
 */
interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number; // parallax factor, default 0.3
  direction?: 'up' | 'down'; // default 'up'
  className?: string;
}

export function ParallaxSection({
  children,
  speed = 0.3,
  direction = 'up',
  className,
}: ParallaxSectionProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const range = 100 * speed;
  const yOffset = direction === 'up' ? [range, -range] : [-range, range];
  const y = useTransform(scrollYProgress, [0, 1], yOffset);

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div style={{ y }} className="w-full h-full">
        {children}
      </motion.div>
    </div>
  );
}
