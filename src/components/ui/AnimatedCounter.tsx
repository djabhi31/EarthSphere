"use client";

import { useEffect, useRef } from "react";
import {
  useMotionValue,
  useTransform,
  useInView,
  useReducedMotion,
  animate,
} from "motion/react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// AnimatedCounter – Count-up number animation triggered when in view
// ---------------------------------------------------------------------------

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 2,
  prefix = "",
  suffix = "",
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v: number) =>
    Math.round(v).toLocaleString(),
  );
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;

    if (prefersReduced) {
      motionValue.set(value);
      return;
    }

    const controls = animate(motionValue, value, {
      duration,
      type: "spring",
      bounce: 0,
      stiffness: 50,
      damping: 20,
    });

    return () => controls.stop();
  }, [isInView, value, duration, motionValue, prefersReduced]);

  // We subscribe to `rounded` via a separate effect to update the DOM text
  // because motion/react's useTransform returns a MotionValue, not a
  // React-renderable string.
  useEffect(() => {
    const span = ref.current;
    if (!span) return;

    const unsubscribe = rounded.on("change", (latest: string) => {
      span.textContent = `${prefix}${latest}${suffix}`;
    });

    // Set initial value
    span.textContent = `${prefix}${Math.round(motionValue.get()).toLocaleString()}${suffix}`;

    return unsubscribe;
  }, [rounded, motionValue, prefix, suffix]);

  return (
    <span
      ref={ref}
      className={cn("tabular-nums", className)}
      aria-label={`${prefix}${value.toLocaleString()}${suffix}`}
    />
  );
}
