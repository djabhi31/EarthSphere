/**
 * @file EventTimeline.tsx
 * @description Geometry timeline showing event's coordinate history.
 */

"use client";

import { motion, useReducedMotion } from "motion/react";
import { MapPin } from "lucide-react";
import { formatDate, timeAgo, formatMagnitude, formatCoordinates, cn, getPointCoordinates } from "@/lib/utils";
import type { EventGeometry } from "@/lib/types";


interface TimelineEntryProps {
  geo: EventGeometry;
  index: number;
  isLast: boolean;
  categoryColor: string;
  onFocus: (coords: [number, number]) => void;
  isActive: boolean;
}

function TimelineEntry({
  geo,
  index,
  isLast,
  categoryColor,
  onFocus,
  isActive,
}: TimelineEntryProps) {
  const prefersReduced = useReducedMotion();
  const rawCoords = geo.coordinates as number[];

  return (
    <motion.div
      className={cn(
        "relative flex gap-4 pb-10 last:pb-0 transition-opacity duration-300",
        isActive ? "opacity-100" : "opacity-40"
      )}
      initial={prefersReduced ? {} : { opacity: 0, x: -16 }}
      whileInView={prefersReduced ? {} : { opacity: isActive ? 1 : 0.4, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      // Trigger coordinate lock-on (WOW-04)
      onViewportEnter={() => {
        if (geo.type === "Point" && rawCoords && rawCoords.length >= 2) {
          onFocus([rawCoords[0], rawCoords[1]]);
        }
      }}
    >
      {/* Line + Dot */}
      <div className="relative flex flex-col items-center">
        {/* Glowing active node dot */}
        <div
          className="relative z-10 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300"
          style={{
            borderColor: categoryColor,
            backgroundColor: isActive ? categoryColor : "transparent",
            boxShadow: isActive ? `0 0 12px ${categoryColor}` : "none",
            scale: isActive ? 1.2 : 1,
          }}
        />
        {/* Connecting timeline path */}
        {!isLast && (
          <div
            className="w-[1.5px] flex-1 mt-1.5"
            style={{
              background: `linear-gradient(to bottom, ${categoryColor}${isActive ? "90" : "30"}, ${categoryColor}10)`,
            }}
          />
        )}
      </div>

      {/* Content details */}
      <div className="flex-1 -mt-0.5 pb-2">
        <p className="text-sm font-semibold text-white/95">
          {formatDate(geo.date)}
        </p>
        <p className="text-[10px] font-medium text-white/30 tracking-wider uppercase mt-0.5">
          {timeAgo(geo.date)}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 font-mono text-xs text-white/50">
            <MapPin size={11} className="text-white/30" />
            {geo.type === "Point" ? formatCoordinates(rawCoords) : "Polygon region"}
          </span>
          {geo.magnitudeValue != null && (
            <span
              className="rounded-md px-2 py-0.5 text-xs font-bold tabular-nums"
              style={{
                color: categoryColor,
                backgroundColor: `${categoryColor}15`,
              }}
            >
              {formatMagnitude(geo.magnitudeValue, geo.magnitudeUnit)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface EventTimelineProps {
  geometry: EventGeometry[];
  activeCoords: [number, number] | null;
  onFocus: (coords: [number, number]) => void;
  categoryColor: string;
}

export function EventTimeline({ geometry, activeCoords, onFocus, categoryColor }: EventTimelineProps) {
  if (!geometry || geometry.length === 0) {
    return <p className="text-sm text-white/30">No trajectory records found for this anomaly.</p>;
  }

  return (
    <div className="pl-1">
      {geometry.map((geo, index) => {
        const geoCoords = getPointCoordinates(geo);
        const isActive =
          !!geoCoords &&
          activeCoords &&
          activeCoords[0] === geoCoords[0] &&
          activeCoords[1] === geoCoords[1];
        
        return (
          <TimelineEntry
            key={`${geo.date}-${index}`}
            geo={geo}
            index={index}
            isLast={index === geometry.length - 1}
            categoryColor={categoryColor}
            onFocus={onFocus}
            isActive={!!isActive || (index === geometry.length - 1 && !activeCoords)}
          />
        );
      })}
    </div>
  );
}
