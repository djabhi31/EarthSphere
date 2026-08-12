/**
 * @file MapPreviewSection.tsx
 * @description Scene 5: Embedded EventMap preview with CTA to view full map.
 */
"use client";

import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { audioSynth } from "@/lib/audio";
import type { EONETEvent } from "@/lib/types";
import { fadeInUp, scrollReveal } from "@/lib/motion-presets";

const EventMap = dynamic(() => import("@/components/map/EventMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[450px] w-full items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-primary)]">
      <div className="flex flex-col items-center gap-3">
        <Globe className="h-8 w-8 animate-pulse text-[var(--electric-cyan)] opacity-60" />
        <span className="text-sm text-[var(--text-secondary)]">Loading map…</span>
      </div>
    </div>
  ),
});

interface MapPreviewSectionProps {
  events: EONETEvent[];
}

export function MapPreviewSection({ events }: MapPreviewSectionProps) {
  return (
    <div className="mx-auto w-full max-w-7xl z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left empty spacer so globe does not overlap details */}
        <div className="hidden lg:block lg:col-span-5 h-[400px]" />

        {/* Right column: Analytics emerging */}
        <div className="lg:col-span-7 dark:bg-transparent dark:border-none dark:shadow-none dark:backdrop-blur-none dark:p-0 bg-[var(--surface-overlay)]/85 backdrop-blur-xl p-8 rounded-3xl border border-[var(--border-default)] shadow-2xl shadow-black/10">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--electric-cyan)] mb-2 block">
            Geospatial Insights
          </span>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-5xl">
            Real-Time{" "}
            <span className="bg-gradient-to-r from-[var(--electric-cyan)] to-[var(--ice-blue)] bg-clip-text text-transparent">
              Geospatial Map
            </span>
          </h2>
          
          <p className="mb-8 text-[var(--text-tertiary)] text-sm md:text-base leading-relaxed">
            Interactive 3D Globe map displaying active natural hazards worldwide. Supports precise zooms, category clustering, and direct coordinate tracing.
          </p>

          <motion.div 
            className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] shadow-2xl shadow-black/40"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={scrollReveal.viewport}
          >
            <div className="h-[320px]">
              <EventMap events={events.slice(0, 35)} zoom={2} />
            </div>
          </motion.div>

          <div className="mt-6 flex justify-end">
            <Link
              href="/map"
              className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--electric-cyan)] hover:text-[var(--text-primary)] transition-colors cursor-none"
              onMouseEnter={() => audioSynth.playHover()}
              onClick={() => audioSynth.playClick()}
            >
              Open Full Map Dashboard
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
