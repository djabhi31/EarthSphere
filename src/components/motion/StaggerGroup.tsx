"use client";

import React, { Children, isValidElement } from "react";
import { motion, useReducedMotion } from "motion/react";
import { staggerContainer, staggerItem } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// StaggerGroup – A container that staggers its children's entrance
// ---------------------------------------------------------------------------

/**
 * StaggerGroup wraps each child in a motion.div to animate them sequentially.
 *
 * @example
 * <StaggerGroup staggerDelay={0.1}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </StaggerGroup>
 */
interface StaggerGroupProps {
  children: React.ReactNode;
  staggerDelay?: number;
  direction?: 'forward' | 'reverse';
  className?: string;
  as?: keyof HTMLElementTagNameMap;
}

export function StaggerGroup({
  children,
  staggerDelay = 0.08,
  direction = 'forward',
  className,
  as = 'div',
}: StaggerGroupProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    const Component = as as React.ElementType;
    return <Component className={className}>{children}</Component>;
  }

  const containerVariants = staggerContainer(staggerDelay);
  
  if (direction === 'reverse' && containerVariants.visible && typeof containerVariants.visible === 'object') {
    const visibleVariant = containerVariants.visible as { transition?: Record<string, unknown> };
    visibleVariant.transition = {
      ...visibleVariant.transition,
      staggerDirection: -1,
    };
  }

  const MotionComponent = (motion as unknown as Record<string, React.ElementType>)[as] || motion.div;

  return (
    <MotionComponent
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(className)}
    >
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child;
        return (
          <motion.div variants={staggerItem}>
            {child}
          </motion.div>
        );
      })}
    </MotionComponent>
  );
}
