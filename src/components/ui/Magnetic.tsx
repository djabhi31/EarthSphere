"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring, useReducedMotion } from "motion/react";

interface MagneticProps {
  children: React.ReactElement;
  range?: number; // Distance in pixels to trigger attraction
  strength?: number; // Pull strength (multiplier from 0 to 1)
}

export function Magnetic({ children, range = 35, strength = 0.35 }: MagneticProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  
  // Spring configurations for snap-to-cursor premium motion
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const [isHovered, setIsHovered] = useState(false);

  if (prefersReduced) return children;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Calculate center of target element
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Distance between cursor and center
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    const distance = Math.hypot(distanceX, distanceY);

    if (distance < range) {
      setIsHovered(true);
      // Pull element toward cursor based on strength
      x.set(distanceX * strength);
      y.set(distanceY * strength);
    } else {
      handleMouseLeave();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className="inline-block"
      animate={{ scale: isHovered ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
