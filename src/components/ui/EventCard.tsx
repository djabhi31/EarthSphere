"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ExternalLink, MapPin, Calendar } from "lucide-react";
import type { EONETEvent } from "@/lib/types";
import {
  cn,
  getCategoryColor,
  getCategoryLabel,
  formatDate,
  timeAgo,
  formatCoordinates,
} from "@/lib/utils";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { WatchlistButton } from "@/components/features/WatchlistButton";
import { audioSynth } from "@/lib/audio";

// ---------------------------------------------------------------------------
// EventCard – Premium event display card with 3D tilt & spotlight tracking
// ---------------------------------------------------------------------------

interface EventCardProps {
  event: EONETEvent;
  className?: string;
  index?: number;
}

export function EventCard({ event, className, index = 0 }: EventCardProps) {
  const prefersReduced = useReducedMotion();

  const categoryId = event.categories[0]?.id ?? "manmade";
  const categoryColor = getCategoryColor(categoryId);
  const categoryLabel = getCategoryLabel(categoryId);
  const status: "active" | "closed" = event.closed ? "closed" : "active";
  const latestGeometry = event.geometry[event.geometry.length - 1];
  const coords = latestGeometry?.coordinates;
  const magnitude = latestGeometry?.magnitudeValue;
  const magnitudeUnit = latestGeometry?.magnitudeUnit;
  const startDate = event.geometry[0]?.date;

  const cardContent = (
    <div className="relative z-0 flex flex-col gap-3 p-5 pointer-events-none select-none">
      {/* Accent bar */}
      <div
        className="absolute inset-x-0 top-0 h-[2.5px]"
        style={{ background: categoryColor }}
        aria-hidden="true"
      />

      {/* Top row: category + status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CategoryIcon categoryId={categoryId} size={16} showGlow />
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={{
              color: categoryColor,
              backgroundColor: `${categoryColor}15`,
            }}
          >
            {categoryLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <WatchlistButton eventId={event.id} />
          <StatusBadge status={status} closedDate={event.closed ?? undefined} />
        </div>
      </div>

      {/* Title */}
      <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white/90">
        {event.title}
      </h3>

      {/* Date info */}
      <div className="flex items-center gap-1.5 text-xs text-white/40">
        <Calendar size={12} aria-hidden="true" />
        {startDate && (
          <span>
            {formatDate(startDate)} · {timeAgo(startDate)}
          </span>
        )}
      </div>

      {/* Coordinates */}
      {coords && (
        <div className="flex items-center gap-1.5 text-xs text-white/30">
          <MapPin size={12} aria-hidden="true" />
          <span className="font-mono text-[11px]">
            {formatCoordinates(coords)}
          </span>
        </div>
      )}

      {/* Magnitude */}
      {magnitude != null && (
        <div className="flex items-center gap-1.5">
          <span
            className="rounded-md px-2 py-0.5 text-xs font-bold tabular-nums"
            style={{
              color: categoryColor,
              backgroundColor: `${categoryColor}15`,
            }}
          >
            {magnitude}
            {magnitudeUnit ? ` ${magnitudeUnit}` : ""}
          </span>
        </div>
      )}

      {/* Sources */}
      {event.sources.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {event.sources.map((source) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                audioSynth.playClick();
              }}
              onMouseEnter={() => audioSynth.playHover()}
              className="pointer-events-auto relative z-20 inline-flex items-center gap-1 rounded-md border border-white/5 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/40 transition-colors hover:border-white/15 hover:text-white/60"
            >
              {source.id}
              <ExternalLink size={8} aria-hidden="true" />
            </a>
          ))}
        </div>
      )}
    </div>
  );

  const Wrapper = prefersReduced ? "div" : motion.div;
  const motionProps = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-30px" },
        transition: {
          duration: 0.5,
          delay: Math.min(index * 0.05, 0.35),
          ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
        },
      };

  return (
    <Wrapper 
      className={cn("group block h-full", className)} 
      {...motionProps}
      onMouseEnter={() => audioSynth.playHover()}
      onClick={() => audioSynth.playClick()}
      data-cursor-label="View Event"
      data-cursor-color={categoryColor}
    >
      <SpotlightCard
        glowColor={`${categoryColor}1c`}
        borderColor={`${categoryColor}40`}
        maxTilt={6}
        className="relative h-full"
      >
        <Link
          href={`/events/${event.id}`}
          className="absolute inset-0 z-10 focus-visible:outline-none rounded-2xl"
          aria-label={`View details for ${event.title}`}
        />
        {cardContent}
      </SpotlightCard>
    </Wrapper>
  );
}
