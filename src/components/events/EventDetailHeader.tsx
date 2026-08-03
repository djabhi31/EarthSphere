/**
 * @file EventDetailHeader.tsx
 * @description Header component for the event detail page showing title, category, and status.
 */

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ChevronRight, Clock, Layers } from "lucide-react";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { audioSynth } from "@/lib/audio";
import { getCategoryColor, getCategoryLabel, getEventStatus } from "@/lib/utils";
import type { EONETEvent } from "@/lib/types";
import { staggerContainer, staggerItem } from "@/lib/motion-presets";

interface EventDetailHeaderProps {
  event: EONETEvent;
  duration: string;
}

export function EventDetailHeader({ event, duration }: EventDetailHeaderProps) {
  const categoryId = event.categories[0]?.id ?? "manmade";
  const categoryColor = getCategoryColor(categoryId);
  const categoryLabel = getCategoryLabel(categoryId);
  const status = getEventStatus(event);

  return (
    <header className="relative overflow-hidden border-b border-white/5 pt-28 pb-10">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse 60% 70% at 50% 0%, ${categoryColor}12, transparent)`,
        }}
      />
      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-6"
        variants={staggerContainer()}
        initial="hidden"
        animate="visible"
      >
        <motion.nav variants={staggerItem} className="mb-6 flex items-center gap-1 text-xs text-white/30 uppercase tracking-widest font-bold">
          <Link href="/" className="hover:text-white transition-colors cursor-none" onMouseEnter={() => audioSynth.playHover()} onClick={() => audioSynth.playClick()}>Home</Link>
          <ChevronRight size={10} />
          <Link href="/events" className="hover:text-white transition-colors cursor-none" onMouseEnter={() => audioSynth.playHover()} onClick={() => audioSynth.playClick()}>Events</Link>
          <ChevronRight size={10} />
          <span className="truncate text-white/50">{event.title}</span>
        </motion.nav>

        <motion.div variants={staggerItem}>
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/40 hover:text-white/70 transition-colors cursor-none mb-6"
            onMouseEnter={() => audioSynth.playHover()}
            onClick={() => audioSynth.playClick()}
          >
            <ArrowLeft size={12} /> Back to explorer
          </Link>
        </motion.div>

        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
          <motion.div variants={staggerItem} className="relative shrink-0">
            <div className="absolute inset-0 rounded-2xl blur-xl" style={{ backgroundColor: `${categoryColor}30` }} />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border sm:h-20 sm:w-20" style={{ borderColor: `${categoryColor}40`, backgroundColor: `${categoryColor}10` }}>
              <CategoryIcon categoryId={categoryId} size={28} showGlow />
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="min-w-0 flex-1">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              {event.title}
            </h1>
            {event.description && (
              <p className="mt-3 text-sm text-white/50 leading-relaxed max-w-3xl">
                {event.description}
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <StatusBadge status={status} closedDate={event.closed ?? undefined} />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/50">
                <Clock size={12} />
                Duration: {duration}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider" style={{ color: categoryColor, backgroundColor: `${categoryColor}15` }}>
                {categoryLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/50 font-mono">
                <Layers size={12} />
                POINTS: {event.geometry.length}
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </header>
  );
}
