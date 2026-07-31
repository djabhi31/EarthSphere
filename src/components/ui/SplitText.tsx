"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";

// ---------------------------------------------------------------------------
// SplitText – Staggered text reveal animation
// ---------------------------------------------------------------------------

interface SplitTextProps {
  text: string;
  className?: string;
  splitBy?: "char" | "word";
  delay?: number;
}

export function SplitText({
  text,
  className,
  splitBy = "char",
  delay = 0,
}: SplitTextProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <span className={className}>{text}</span>;
  }

  const baseDelay = splitBy === "char" ? 0.03 : 0.08;

  if (splitBy === "word") {
    const words = text.split(" ");
    return (
      <span className={cn("inline-flex flex-wrap", className)} aria-label={text}>
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            className="mr-[0.25em] inline-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.5,
              delay: delay + i * baseDelay,
              ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
            }}
            aria-hidden="true"
          >
            {word}
          </motion.span>
        ))}
      </span>
    );
  }

  // Split by character, preserving spaces as visible whitespace
  const chars = text.split("");
  return (
    <span className={cn("inline-flex flex-wrap", className)} aria-label={text}>
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className={cn("inline-block", char === " " && "w-[0.25em]")}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: 0.4,
            delay: delay + i * baseDelay,
            ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
          }}
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

