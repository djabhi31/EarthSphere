"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { glass, colors } from "@/lib/design-tokens";

// ---------------------------------------------------------------------------
// GlassCard – Premium glassmorphism card with optional hover effects
// ---------------------------------------------------------------------------

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  accentColor?: string;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  hoverEffect = true,
  accentColor,
  onClick,
}: GlassCardProps) {
  const prefersReduced = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverEffect) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  const accentStyle = accentColor
    ? { borderTopColor: accentColor, borderTopWidth: "2px" }
    : undefined;

  const Component = hoverEffect && !prefersReduced ? motion.div : "div";

  const motionProps =
    hoverEffect && !prefersReduced
      ? {
          whileHover: {
            scale: 1.02,
            transition: { duration: 0.25, ease: "easeOut" as const },
          },
          whileTap: onClick ? { scale: 0.98 } : undefined,
        }
      : {};

  return (
    <Component
      className={cn(
        "relative rounded-2xl",
        hoverEffect && !prefersReduced && "transition-[border-color,box-shadow] duration-300 hover:border-white/20",
        onClick && "cursor-pointer",
        className,
      )}
      style={{ ...glass.default, ...accentStyle }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      {...motionProps}
    >
      {/* Subtle inner glow on hover */}
      {hoverEffect && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: accentColor
              ? `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${accentColor}15, transparent 40%)`
              : `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${colors.electricCyan}15, transparent 40%)`,
          }}
        />
      )}
      {children}
    </Component>
  );
}
