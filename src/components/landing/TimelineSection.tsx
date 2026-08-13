/**
 * @file TimelineSection.tsx
 * @description Scene 4: Vertical timeline showing landmark events for the timeline flight with cinematic feel.
 */
"use client";

import { Globe } from "lucide-react";
import { getCategoryColor } from "@/lib/utils";
import { motion } from "motion/react";
import { fadeInUp, scrollReveal } from "@/lib/motion-presets";

export const LANDMARK_EVENTS = [
  {
    title: "Dixie Wildfire Complex",
    location: "California, USA",
    coords: [-121.2, 40.1] as [number, number],
    date: "July 2021",
    description: "One of California's largest single wildfires, consuming over 960,000 acres, driven by extreme temperatures and severe drought conditions.",
    category: "wildfires",
  },
  {
    title: "Super Typhoon Mawar",
    location: "Guam, West Pacific",
    coords: [142.5, 13.5] as [number, number],
    date: "May 2023",
    description: "A category 5 equivalent super typhoon that swept through Guam with sustained winds of 185 mph, causing catastrophic storm surges.",
    category: "severeStorms",
  },
  {
    title: "Mt. Etna Paroxysmal Eruption",
    location: "Sicily, Italy",
    coords: [15.0, 37.7] as [number, number],
    date: "December 2023",
    description: "Etna erupted with explosive intensity, creating towering ash columns over 10km high, disrupting aerospace corridors across the Mediterranean.",
    category: "volcanoes",
  }
];

export function TimelineSection() {
  return (
    <div className="mx-auto w-full max-w-7xl z-10 relative">
      <div className="text-center max-w-3xl mx-auto mb-20 relative group">
        <div className="absolute -inset-4 bg-gradient-to-b from-[var(--cosmic-purple)]/10 to-transparent rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
        
        <div className="glass-strong p-10 rounded-[2.5rem] border border-[var(--border-subtle)] shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--cosmic-purple)] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--cosmic-purple)] animate-pulse" />
              Temporal Analysis
            </span>
            <h2 className="text-4xl font-black tracking-tight text-[var(--text-primary)] md:text-6xl leading-[1.05]">
              Landmark Event <br />
              <span className="bg-gradient-to-r from-[var(--cosmic-purple)] via-[#f43f5e] to-[var(--solar-orange)] bg-clip-text text-transparent">
                Timeline Flight
              </span>
            </h2>
            <p className="mt-6 text-[var(--text-secondary)] font-medium text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Scroll down to fly the globe camera directly to key environmental observations, bridging global history and real geographic coordinates.
            </p>
          </div>
        </div>
      </div>

      <div className="relative max-w-3xl mx-auto space-y-24">
        {/* Subtle connecting line down the middle/left */}
        <div className="absolute left-6 top-10 bottom-10 w-px bg-gradient-to-b from-[var(--cosmic-purple)]/50 via-[var(--border-subtle)] to-[var(--solar-orange)]/50" />

        {LANDMARK_EVENTS.map((landmark, idx) => {
          const color = getCategoryColor(landmark.category);
          const latStr = `${Math.abs(landmark.coords[1]).toFixed(2)}°${landmark.coords[1] >= 0 ? 'N' : 'S'}`;
          const lngStr = `${Math.abs(landmark.coords[0]).toFixed(2)}°${landmark.coords[0] >= 0 ? 'E' : 'W'}`;

          return (
            <motion.div 
              key={idx} 
              className="relative group/timeline flex items-start gap-8"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={scrollReveal.viewport}
            >
              {/* Timeline Node */}
              <div className="relative z-10 flex-shrink-0 ml-[15px] mt-8">
                <div 
                  className="h-4 w-4 rounded-full border-[3px] border-[var(--canvas)] transition-transform duration-500 group-hover/timeline:scale-150 shadow-md"
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 0 15px ${color}60`
                  }}
                />
                <div 
                  className="absolute inset-0 rounded-full animate-ping opacity-30"
                  style={{ backgroundColor: color }}
                />
              </div>

              {/* Content Card */}
              <div className="glass-subtle flex-1 p-8 rounded-[2rem] border border-[var(--border-subtle)] shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group-hover/timeline:bg-[var(--surface-primary)]">
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 blur-[40px] pointer-events-none transition-opacity duration-500 group-hover/timeline:opacity-15" style={{ backgroundColor: color }} />
                
                <div className="relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <span 
                      className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full bg-[var(--surface-sunken)] border border-[var(--border-subtle)]"
                      style={{ color }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                      {landmark.date}
                    </span>
                    <span className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                      {landmark.location}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-[var(--text-primary)] mb-3 tracking-tight">
                    {landmark.title}
                  </h3>
                  
                  <p className="text-base text-[var(--text-secondary)] font-medium leading-relaxed mb-6">
                    {landmark.description}
                  </p>

                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-subtle)] w-fit">
                    <Globe size={14} className="text-[var(--text-muted)]" />
                    <span className="font-mono text-xs text-[var(--text-secondary)] font-semibold tracking-wider">
                      {latStr}, {lngStr}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
