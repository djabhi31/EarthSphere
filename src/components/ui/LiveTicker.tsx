"use client";

import { useReducedMotion } from "motion/react";
import type { EONETEvent } from "@/lib/types";
import { cn, getCategoryColor, timeAgo } from "@/lib/utils";

// ---------------------------------------------------------------------------
// LiveTicker – Infinite scrolling event marquee
// ---------------------------------------------------------------------------

interface LiveTickerProps {
  events: EONETEvent[];
  speed?: number; // seconds for one full cycle, default 40
  className?: string;
}

function TickerItem({ event }: { event: EONETEvent }) {
  const categoryId = event.categories[0]?.id ?? "manmade";
  const color = getCategoryColor(categoryId);
  const latestDate = event.geometry[event.geometry.length - 1]?.date;

  return (
    <span className="mx-6 inline-flex shrink-0 items-center gap-2 text-sm text-white/60">
      {/* Category dot */}
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      {/* Title */}
      <span className="max-w-[200px] truncate font-medium text-white/80">
        {event.title}
      </span>
      {/* Time */}
      {latestDate && (
        <span className="text-xs text-white/30">{timeAgo(latestDate)}</span>
      )}
    </span>
  );
}

export function LiveTicker({
  events,
  speed = 40,
  className,
}: LiveTickerProps) {
  const prefersReduced = useReducedMotion();

  if (events.length === 0) return null;

  // Reduced motion: static scrollable list
  if (prefersReduced) {
    return (
      <div
        className={cn(
          "overflow-x-auto whitespace-nowrap py-3",
          className,
        )}
        role="marquee"
        aria-label="Recent natural events"
      >
        <div className="inline-flex items-center">
          {events.map((event) => (
            <TickerItem key={event.id} event={event} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden py-3", className)}
      role="marquee"
      aria-label="Recent natural events"
    >
      {/* Gradient fade edges */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--canvas)] to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--canvas)] to-transparent"
        aria-hidden="true"
      />

      {/* Scrolling track – duplicated for seamless loop */}
      <div
        className="ticker-track inline-flex whitespace-nowrap hover:[animation-play-state:paused]"
        style={{
          "--duration": `${speed}s`,
        } as React.CSSProperties}
      >
        {/* First copy */}
        {events.map((event) => (
          <TickerItem key={`a-${event.id}`} event={event} />
        ))}
        {/* Duplicate for seamless loop */}
        {events.map((event) => (
          <TickerItem key={`b-${event.id}`} event={event} />
        ))}
      </div>

      <style jsx>{`
        @keyframes ticker-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .ticker-track {
          animation: ticker-scroll var(--duration, 40s) linear infinite;
        }
      `}</style>
    </div>
  );
}
