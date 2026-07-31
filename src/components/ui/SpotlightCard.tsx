"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring, useMotionValue, useReducedMotion, useMotionTemplate } from "motion/react";
import { cn } from "@/lib/utils";
import { particles, cssVars } from "@/lib/design-tokens";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string; // Hex or rgba color for the spotlight glow (defaults to cyan)
  borderColor?: string; // Hex or rgba color for card border glow on hover
  maxTilt?: number; // Max tilt rotation in degrees (default 8)
  onClick?: () => void;
}

export function SpotlightCard({
  children,
  className,
  glowColor = `rgba(${particles.cyan.join(',')}, 0.15)`,
  borderColor = "rgba(255, 255, 255, 0.15)",
  maxTilt = 8,
  onClick,
}: SpotlightCardProps) {
  const prefersReduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for spotlight cursor tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const background = useMotionTemplate`radial-gradient(280px circle at ${mouseX}px ${mouseY}px, ${glowColor}, transparent 80%)`;

  // Springs for smooth 3D tilt animation
  const springConfig = { damping: 20, stiffness: 150, mass: 0.2 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);
  const glowOpacity = useSpring(0, springConfig);

  const [isHovered, setIsHovered] = useState(false);

  if (prefersReduced) {
    return (
      <div
        onClick={onClick}
        className={cn(
          "rounded-2xl border border-white/10 bg-white/5 p-px shadow-lg shadow-black/20 transition-all duration-300 hover:border-white/20",
          onClick && "cursor-pointer active:scale-98",
          className
        )}
      >
        <div className="rounded-[15px] h-full w-full bg-[var(--surface-elevated)]/80">
          {children}
        </div>
      </div>
    );
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);

    // Calculate normalized coords (-0.5 to 0.5) from center
    const normalizedX = (x / width) - 0.5;
    const normalizedY = (y / height) - 0.5;

    // Apply tilt values (rotateX is driven by Y coordinate, rotateY by X coordinate)
    rotateX.set(-normalizedY * maxTilt);
    rotateY.set(normalizedX * maxTilt);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.set(1.02);
    glowOpacity.set(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    scale.set(1);
    glowOpacity.set(0);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "group relative rounded-2xl border border-white/10 bg-white/5 p-px shadow-lg shadow-black/20 transition-colors duration-500",
        onClick && "cursor-pointer",
        className
      )}
    >
      {/* 3D Inner Layer */}
      <div 
        className="relative rounded-[15px] bg-[var(--surface-elevated)]/75 backdrop-blur-xl h-full w-full overflow-hidden"
        style={{ transform: "translateZ(20px)" }} // Pop elements outward in 3D space
      >
        {/* Dynamic Spotlight Glow Layer */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            opacity: glowOpacity,
            background,
          }}
        />

        {/* Dynamic Border Glow Overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 border border-transparent rounded-[15px] transition-colors duration-300"
          style={{
            borderColor: isHovered ? borderColor : "transparent",
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full w-full">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
