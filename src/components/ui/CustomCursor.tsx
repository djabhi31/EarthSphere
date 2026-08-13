"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { colors } from "@/lib/design-tokens";

/**
 * CustomCursor replaces the default OS cursor with a high-performance,
 * animated dot and trailing ring. It detects interactive elements to
 * provide context-aware hover states (labels, custom colors, sizing).
 * It automatically disables itself on touch devices or when reduced motion is preferred.
 */
export function CustomCursor() {
  const prefersReduced = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [label, setLabel] = useState("");
  const [cursorColor, setCursorColor] = useState<string>(colors.electricCyan);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  
  // Track mutable state for rAF to prevent stale closures
  const stateRef = useRef({
    isHoveringInteractive: false,
    label: "",
  });
  
  // Track mouse coordinates
  const mouseRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number | null>(null);

  // Track scroll velocity
  const lastScrollY = useRef(0);
  const scrollVelocity = useRef(0);

  useEffect(() => {
    if (prefersReduced || typeof window === "undefined") return;

    // Detect touch device
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    // Show custom cursor and hide standard
    // eslint-disable-next-line react-hooks/set-state-in-effect -- TODO: Avoid synchronous setState in effect
    setIsVisible(true);
    document.documentElement.classList.add("cursor-none-desktop");

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Check for custom cursor attributes
      const cursorTarget = target.closest("[data-cursor-label], [data-cursor-color], button, a, [role='button']");
      if (cursorTarget) {
        setIsHoveringInteractive(true);
        stateRef.current.isHoveringInteractive = true;
        
        // Read label
        const customLabel = cursorTarget.getAttribute("data-cursor-label");
        if (customLabel) {
          setLabel(customLabel);
          stateRef.current.label = customLabel;
        } else if (
          cursorTarget.tagName === "BUTTON" || 
          cursorTarget.tagName === "A" || 
          cursorTarget.getAttribute("role") === "button"
        ) {
          // Default generic hover label or none
          setLabel("");
          stateRef.current.label = "";
        }

        // Read color
        const customColor = cursorTarget.getAttribute("data-cursor-color");
        if (customColor) {
          setCursorColor(customColor);
        } else {
          // Try category detection by looking at closest category configurations
          const isWildfire = cursorTarget.closest("[data-category='wildfires']");
          const isStorm = cursorTarget.closest("[data-category='severeStorms']");
          const isVolcano = cursorTarget.closest("[data-category='volcanoes']");
          const isAnalytics = cursorTarget.closest("[data-category='analytics']");

          if (isWildfire) setCursorColor(colors.solarOrange);
          else if (isStorm) setCursorColor(colors.iceBlue);
          else if (isVolcano) setCursorColor(colors.warningRed);
          else if (isAnalytics) setCursorColor(colors.electricCyan);
          else setCursorColor(colors.electricCyan);
        }
      } else {
        setIsHoveringInteractive(false);
        setLabel("");
        setCursorColor(colors.electricCyan);
        stateRef.current.isHoveringInteractive = false;
        stateRef.current.label = "";
      }
    };

    const onMouseLeaveDocument = () => {
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    const onMouseEnterDocument = () => {
      if (dotRef.current) dotRef.current.style.opacity = "1";
      if (ringRef.current) ringRef.current.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseleave", onMouseLeaveDocument);
    document.addEventListener("mouseenter", onMouseEnterDocument);

    lastScrollY.current = window.scrollY;
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity.current = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Lerp function for outer ring lag effect
    const updateCoordinates = () => {
      const targetX = mouseRef.current.x;
      const targetY = mouseRef.current.y;

      // Update inner dot instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }

      // Lerp outer ring position (lag factor 0.15 for high quality)
      const ringX = ringPosRef.current.x;
      const ringY = ringPosRef.current.y;
      
      const nextX = ringX + (targetX - ringX) * 0.15;
      const nextY = ringY + (targetY - ringY) * 0.15;

      ringPosRef.current.x = nextX;
      ringPosRef.current.y = nextY;

      // Decay scroll velocity in the animation frame loop
      scrollVelocity.current *= 0.85;

      const velocity = Math.abs(scrollVelocity.current);
      // Only apply scroll stretch if not hovering over interactive label
      const activeStretch = stateRef.current.isHoveringInteractive && stateRef.current.label ? 0 : velocity;
      const stretchY = 1.0 + Math.min(activeStretch * 0.08, 0.6);
      const squeezeX = 1.0 - Math.min(activeStretch * 0.03, 0.20);

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${nextX}px, ${nextY}px, 0) scale(${squeezeX}, ${stretchY})`;
      }

      requestRef.current = requestAnimationFrame(updateCoordinates);
    };

    requestRef.current = requestAnimationFrame(updateCoordinates);

    return () => {
      document.documentElement.classList.remove("cursor-none-desktop");
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeaveDocument);
      document.removeEventListener("mouseenter", onMouseEnterDocument);
      window.removeEventListener("scroll", onScroll);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [prefersReduced]);

  if (!isVisible || prefersReduced) return null;

  return (
    <>
      {/* Precision Core Dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-300"
        style={{
          backgroundColor: cursorColor,
          boxShadow: `0 0 12px ${cursorColor}, 0 0 24px ${cursorColor}80`,
        }}
      />

      {/* Lagging Outer Ring & Text Overlay */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] flex -translate-x-1/2 -translate-y-1/2 items-center justify-start"
      >
        <div
          className="rounded-full border transition-all duration-300 ease-out backdrop-blur-sm"
          style={{
            borderColor: cursorColor,
            backgroundColor: isHoveringInteractive ? `${cursorColor}20` : "transparent",
            width: isHoveringInteractive ? (label ? "80px" : "36px") : "20px",
            height: isHoveringInteractive ? (label ? "32px" : "36px") : "20px",
            borderRadius: isHoveringInteractive && label ? "12px" : "50%",
            boxShadow: isHoveringInteractive ? `0 0 20px ${cursorColor}40` : "none",
          }}
        />
        
        {/* Float label */}
        {label && (
          <span
            className="absolute left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider transition-all duration-300"
            style={{ color: cursorColor }}
          >
            {label}
          </span>
        )}
      </div>
    </>
  );
}
