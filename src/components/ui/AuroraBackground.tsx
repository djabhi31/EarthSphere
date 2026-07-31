"use client";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "motion/react";
import { colors, cssVars } from "@/lib/design-tokens";

// ---------------------------------------------------------------------------
// AuroraBackground – Animated CSS gradient blobs
// ---------------------------------------------------------------------------

interface AuroraBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  intensity?: "subtle" | "medium" | "intense";
}

const intensityMap: Record<
  NonNullable<AuroraBackgroundProps["intensity"]>,
  { opacity: string; blur: string; scale: string }
> = {
  subtle: { opacity: "opacity-20", blur: "blur-[100px]", scale: "scale-75" },
  medium: { opacity: "opacity-30", blur: "blur-[100px]", scale: "scale-100" },
  intense: { opacity: "opacity-45", blur: "blur-[120px]", scale: "scale-110" },
};

export function AuroraBackground({
  className,
  children,
  intensity = "medium",
}: AuroraBackgroundProps) {
  const prefersReduced = useReducedMotion();
  const cfg = intensityMap[intensity];

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* ── Aurora blobs ──────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        {prefersReduced ? (
          /* Static fallback gradient */
          <div 
            className="absolute inset-0 opacity-50" 
            style={{ background: `linear-gradient(to bottom right, #1a2744, ${colors.spaceBlack}, ${colors.cosmicPurple})` }}
          />
        ) : (
          <>
            {/* Blob 1 – deep blue */}
            <div
              className={cn(
                "absolute -top-1/4 -left-1/4 h-[60%] w-[60%] rounded-full",
                cfg.opacity,
                cfg.blur,
                cfg.scale,
                "animate-aurora-1",
              )}
              style={{ backgroundColor: "#1a2744" }}
            />

            {/* Blob 2 – electric cyan */}
            <div
              className={cn(
                "absolute top-1/3 right-0 h-[50%] w-[50%] rounded-full",
                cfg.opacity,
                cfg.blur,
                cfg.scale,
                "animate-aurora-2 mix-blend-screen",
              )}
              style={{ backgroundColor: colors.electricCyan }}
            />

            {/* Blob 3 – cosmic purple */}
            <div
              className={cn(
                "absolute -bottom-1/4 left-1/3 h-[55%] w-[55%] rounded-full",
                cfg.opacity,
                cfg.blur,
                cfg.scale,
                "animate-aurora-3 mix-blend-screen",
              )}
              style={{ backgroundColor: colors.cosmicPurple }}
            />

            {/* Blob 4 – ice blue accent */}
            <div
              className={cn(
                "absolute top-0 right-1/4 h-[40%] w-[40%] rounded-full",
                cfg.opacity,
                cfg.blur,
                cfg.scale,
                "animate-aurora-4 mix-blend-screen",
              )}
              style={{ backgroundColor: colors.iceBlue }}
            />
          </>
        )}
      </div>

      {children}

      {/* ── Keyframe definitions ─────────── */}
      <style>{`
        @keyframes aurora-1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30%, 20%) scale(1.1);
          }
          66% {
            transform: translate(-10%, 30%) scale(0.95);
          }
        }
        @keyframes aurora-2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-25%, 15%) scale(1.15);
          }
          66% {
            transform: translate(15%, -20%) scale(0.9);
          }
        }
        @keyframes aurora-3 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(20%, -25%) scale(1.05);
          }
          66% {
            transform: translate(-15%, 10%) scale(1.1);
          }
        }
        @keyframes aurora-4 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-20%, 25%) scale(1.08);
          }
        }
        .animate-aurora-1 {
          animation: aurora-1 18s ease-in-out infinite;
        }
        .animate-aurora-2 {
          animation: aurora-2 20s ease-in-out infinite;
        }
        .animate-aurora-3 {
          animation: aurora-3 16s ease-in-out infinite;
        }
        .animate-aurora-4 {
          animation: aurora-4 22s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
