/**
 * @file RelatedEvents.tsx
 * @description Related events section displaying a grid of EventCard components.
 */

"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { EventCard } from "@/components/ui/EventCard";
import { audioSynth } from "@/lib/audio";
import type { EONETEvent } from "@/lib/types";
import { staggerContainer, staggerItem } from "@/lib/motion-presets";

interface RelatedEventsProps {
  events: EONETEvent[];
  categoryId: string;
  categoryLabel: string;
  categoryColor: string;
}

export function RelatedEvents({
  events,
  categoryId,
  categoryLabel,
  categoryColor,
}: RelatedEventsProps) {
  if (!events || events.length === 0) return null;

  return (
    <div className="mt-20 border-t border-white/5 pt-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-extrabold tracking-tight text-white">
          Related <span style={{ color: categoryColor }}>{categoryLabel}</span> Observations
        </h2>
        <Link
          href={`/events?category=${categoryId}`}
          className="text-xs font-bold uppercase tracking-wider text-white/40 hover:text-white transition-colors cursor-none"
          onMouseEnter={() => audioSynth.playHover()}
          onClick={() => audioSynth.playClick()}
        >
          View all cases →
        </Link>
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={staggerContainer()}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
      >
        {events.map((relEvent, i) => (
          <motion.div key={relEvent.id} variants={staggerItem}>
            <EventCard event={relEvent} index={i} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
