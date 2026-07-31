"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { variants } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// ScrollReveal – A reusable scroll-reveal wrapper component
// ---------------------------------------------------------------------------

/**
 * ScrollReveal animates its children when they enter the viewport.
 *
 * @example
 * <ScrollReveal variant="fadeUp" delay={0.2}>
 *   <h2>Hello World</h2>
 * </ScrollReveal>
 */
interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'blurReveal';
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
}

const variantMap = {
  fadeUp: variants.fadeInUp,
  fadeIn: variants.fadeIn,
  slideLeft: variants.fadeInLeft,
  slideRight: variants.fadeInRight,
  scaleIn: variants.scaleIn,
  blurReveal: variants.blurIn,
};

export function ScrollReveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration,
  threshold = 0.15,
  once = true,
  className,
}: ScrollRevealProps) {
  const prefersReduced = useReducedMotion();
  const selectedVariant = variantMap[variant] || variants.fadeInUp;

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  // Combine selected variant with optional custom delay/duration
  const customVariants = {
    hidden: selectedVariant.hidden,
    visible: {
      ...selectedVariant.visible,
      transition: {
        ...(typeof selectedVariant.visible === 'object' && 'transition' in selectedVariant.visible ? selectedVariant.visible.transition : {}),
        ...(delay ? { delay } : {}),
        ...(duration ? { duration } : {}),
      },
    },
  };

  return (
    <motion.div
      variants={customVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
