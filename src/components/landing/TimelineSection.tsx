/**
 * @file TimelineSection.tsx
 * @description Scene 4: Vertical timeline showing landmark events for the timeline flight.
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
      <div className="text-center max-w-2xl mx-auto mb-20">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--cosmic-purple)] mb-2 block">
          Temporal Analysis
        </span>
        <h2 className="text-4xl font-black tracking-tight text-[var(--text-primary)] md:text-5xl">
          Landmark Event{" "}
          <span className="bg-gradient-to-r from-[var(--cosmic-purple)] to-[var(--solar-orange)] bg-clip-text text-transparent">
            Timeline Flight
          </span>
        </h2>
        <p className="mt-4 text-[var(--text-secondary)] text-sm sm:text-base">
          Scroll down to fly the globe camera directly to key environmental observations, bridging global history and real geographic coordinates.
        </p>
      </div>

      <div className="relative max-w-3xl mx-auto border-l border-[var(--border-subtle)] pl-6 space-y-36">
        {LANDMARK_EVENTS.map((landmark, idx) => {
          const color = getCategoryColor(landmark.category);
          const latStr = `${Math.abs(landmark.coords[1]).toFixed(2)}°${landmark.coords[1] >= 0 ? 'N' : 'S'}`;
          const lngStr = `${Math.abs(landmark.coords[0]).toFixed(2)}°${landmark.coords[0] >= 0 ? 'E' : 'W'}`;

          return (
            <motion.div 
              key={idx} 
              className="relative group/timeline"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={scrollReveal.viewport}
            >
              <div 
                className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-canvas transition-all duration-300 group-hover/timeline:scale-125"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 10px ${color}`
                }}
              />

              <div className="pl-4 max-md:bg-[var(--surface-elevated)]/70 max-md:backdrop-blur-sm max-md:p-4 max-md:rounded-xl max-md:border max-md:border-[var(--border-subtle)]">
                <span 
                  className="text-[11px] font-bold uppercase tracking-widest block mb-1"
                  style={{ color }}
                >
                  {landmark.date} · {landmark.location}
                </span>
                
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                  {landmark.title}
                </h3>
                
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl">
                  {landmark.description}
                </p>

                <div className="mt-4 flex items-center gap-1.5 font-mono text-[10px] text-[var(--text-tertiary)]">
                  <Globe size={11} />
                  <span>Coordinates: {latStr}, {lngStr}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
