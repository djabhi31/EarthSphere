/**
 * @file MapPreviewSection.tsx
 * @description Scene 5: Embedded EventMap preview with premium CTA to view full map.
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
    <div className="flex h-full w-full items-center justify-center bg-[var(--surface-sunken)]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Globe className="h-10 w-10 text-[var(--electric-cyan)] opacity-20" />
          <Globe className="h-10 w-10 text-[var(--electric-cyan)] animate-ping absolute inset-0" />
        </div>
        <span className="text-xs font-bold tracking-widest uppercase text-[var(--text-muted)]">Initializing Map Engine...</span>
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left empty spacer so globe does not overlap details */}
        <div className="hidden lg:block lg:col-span-5 h-[400px]" />

        {/* Right column: Analytics emerging */}
        <div className="lg:col-span-7 relative group">
          <div className="absolute -inset-2 bg-gradient-to-tr from-[var(--electric-cyan)]/10 to-transparent rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

          <div className="glass-strong p-8 sm:p-10 lg:p-12 rounded-[2.5rem] border border-[var(--border-subtle)] shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[var(--electric-cyan)] opacity-[0.04] blur-[80px]" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--electric-cyan)] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--electric-cyan)] animate-pulse" />
                Geospatial Insights
              </span>
              <h2 className="mb-6 text-4xl font-black tracking-tight text-[var(--text-primary)] md:text-5xl leading-[1.1]">
                Real-Time{" "}
                <span className="bg-gradient-to-r from-[var(--electric-cyan)] to-[var(--ice-blue)] bg-clip-text text-transparent">
                  Geospatial Map
                </span>
              </h2>
              
              <p className="mb-10 text-[var(--text-secondary)] font-medium text-sm sm:text-base leading-relaxed">
                Interactive 3D Globe map displaying active natural hazards worldwide. Supports precise zooms, category clustering, and direct coordinate tracing for deep environmental analysis.
              </p>

              <motion.div 
                className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] shadow-inner bg-[var(--surface-sunken)] group/map"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={scrollReveal.viewport}
              >
                {/* Embedded Map Container */}
                <div className="h-[360px] w-full relative">
                  <EventMap events={events.slice(0, 35)} zoom={2} />
                  
                  {/* Overlay vignette to blend map edges into the card */}
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_60px_rgba(0,0,0,0.6)]" />
                </div>
              </motion.div>

              <div className="mt-8 flex justify-end">
                <Link
                  href="/map"
                  className="group/btn inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--surface-primary)] border border-[var(--border-subtle)] text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] hover:border-[var(--electric-cyan)] hover:text-[var(--electric-cyan)] transition-all shadow-sm hover:shadow-md cursor-none"
                  onMouseEnter={() => audioSynth.playHover()}
                  onClick={() => audioSynth.playClick()}
                >
                  Launch Full Map Dashboard
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
