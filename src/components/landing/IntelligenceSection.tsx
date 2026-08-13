/**
 * @file IntelligenceSection.tsx
 * @description Scene 2: Displays planetary sensors data and intelligence feed info with premium HUD layout.
 */
"use client";

import { motion } from "motion/react";
import { staggerContainer, staggerItem, scrollReveal } from "@/lib/motion-presets";
import { Activity, Zap, Target } from "lucide-react";

export function IntelligenceSection() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left text panel */}
        <div className="md:col-span-6 lg:col-span-5 relative group">
          {/* Subtle ambient glow behind the card */}
          <div className="absolute -inset-2 bg-gradient-to-br from-[var(--electric-cyan)]/20 to-[var(--ice-blue)]/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
          
          <div className="glass-strong p-8 sm:p-10 lg:p-12 rounded-[2rem] shadow-xl border border-[var(--border-subtle)] relative overflow-hidden">
            {/* High-tech diagonal grid background effect */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--electric-cyan)] opacity-[0.05] blur-[50px]" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--electric-cyan)] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--electric-cyan)] animate-pulse" />
                Planetary Sensors
              </span>
              <h2 className="mb-6 text-4xl font-black tracking-tight text-[var(--text-primary)] md:text-5xl leading-[1.1]">
                Live Earth <br />
                <span className="bg-gradient-to-r from-[var(--electric-cyan)] to-[var(--ice-blue)] bg-clip-text text-transparent">
                  Intelligence Feed
                </span>
              </h2>
              <p className="mb-10 text-[var(--text-secondary)] font-medium leading-relaxed">
                Natural systems are connected in a continuous feedback loop. Using high-frequency satellite arrays, atmospheric sensors, and seismic telemetry from NASA, NOAA, and USGS, EarthSphere renders live observations as they unfold.
              </p>
              
              {/* Sleek HUD Stats panel */}
              <motion.div 
                className="grid grid-cols-3 gap-3"
                variants={staggerContainer()}
                initial="hidden"
                whileInView="visible"
                viewport={scrollReveal.viewport}
              >
                <motion.div variants={staggerItem} className="flex flex-col items-start gap-1 p-3 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-subtle)]">
                  <Activity className="h-4 w-4 text-[var(--text-muted)] mb-1" />
                  <span className="text-2xl font-black text-[var(--text-primary)] tabular-nums tracking-tighter">1.5s</span>
                  <span className="text-[9px] text-[var(--text-tertiary)] font-bold uppercase tracking-wider">Latency</span>
                </motion.div>
                
                <motion.div variants={staggerItem} className="flex flex-col items-start gap-1 p-3 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-subtle)]">
                  <Zap className="h-4 w-4 text-[var(--electric-cyan)] mb-1" />
                  <span className="text-2xl font-black text-[var(--electric-cyan)] tabular-nums tracking-tighter">24h</span>
                  <span className="text-[9px] text-[var(--text-tertiary)] font-bold uppercase tracking-wider">Resolution</span>
                </motion.div>
                
                <motion.div variants={staggerItem} className="flex flex-col items-start gap-1 p-3 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-subtle)]">
                  <Target className="h-4 w-4 text-[var(--cosmic-purple)] mb-1" />
                  <span className="text-2xl font-black text-[var(--cosmic-purple)] tabular-nums tracking-tighter">98%</span>
                  <span className="text-[9px] text-[var(--text-tertiary)] font-bold uppercase tracking-wider">Accuracy</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Right empty container (keeps globe visible in background) */}
        <div className="hidden md:block md:col-span-6 lg:col-span-7 h-[500px]" />
      </div>
    </div>
  );
}
