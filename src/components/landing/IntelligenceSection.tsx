/**
 * @file IntelligenceSection.tsx
 * @description Scene 2: Displays planetary sensors data and intelligence feed info.
 */
"use client";

import { motion } from "motion/react";
import { staggerContainer, staggerItem, scrollReveal } from "@/lib/motion-presets";

export function IntelligenceSection() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left text panel */}
        <div className="max-w-xl max-md:bg-[#0b101b]/80 max-md:backdrop-blur-md max-md:p-6 max-md:rounded-2xl max-md:border max-md:border-white/10 max-md:shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--electric-cyan)] mb-2 block">
            Planetary Sensors
          </span>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-5xl">
            Live Earth <br />
            <span className="bg-gradient-to-r from-[var(--electric-cyan)] to-[var(--ice-blue)] bg-clip-text text-transparent">
              Intelligence Feed
            </span>
          </h2>
          <p className="mb-8 text-[var(--text-secondary)] leading-relaxed">
            Natural systems are connected in a continuous feedback loop. Using high-frequency sat arrays, atmospheric sensors, and seismic telemetry from NASA, NOAA, and USGS, EarthSphere displays live observations as they ignite, erupt, or spin across the hemispheres.
          </p>
          
          {/* Stats panel in row */}
          <motion.div 
            className="grid grid-cols-3 gap-4 border-t border-[var(--border-subtle)] pt-8"
            variants={staggerContainer()}
            initial="hidden"
            whileInView="visible"
            viewport={scrollReveal.viewport}
          >
            <motion.div variants={staggerItem}>
              <span className="block text-3xl font-bold text-[var(--text-primary)] tabular-nums">1.5s</span>
              <span className="text-[11px] text-[var(--text-tertiary)] font-semibold uppercase tracking-wider">Latency</span>
            </motion.div>
            <motion.div variants={staggerItem}>
              <span className="block text-3xl font-bold text-[var(--electric-cyan)] tabular-nums">24h</span>
              <span className="text-[11px] text-[var(--text-tertiary)] font-semibold uppercase tracking-wider">Resolution</span>
            </motion.div>
            <motion.div variants={staggerItem}>
              <span className="block text-3xl font-bold text-[var(--cosmic-purple)] tabular-nums">98%</span>
              <span className="text-[11px] text-[var(--text-tertiary)] font-semibold uppercase tracking-wider">Accuracy</span>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Right empty container (keeps globe visible in background) */}
        <div className="hidden md:block h-[500px]" />
      </div>
    </div>
  );
}
