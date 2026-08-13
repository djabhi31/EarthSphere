/**
 * @file HeroSection.tsx
 * @description Scene 1: Premium Hero section of the landing page displaying primary title and active disaster count.
 */
"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Activity, Globe } from "lucide-react";
import { SplitText } from "@/components/ui/SplitText";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { audioSynth } from "@/lib/audio";

interface EventStats {
  totalActive: number;
}

interface HeroSectionProps {
  stats: EventStats | undefined;
}

export function HeroSection({ stats }: HeroSectionProps) {
  return (
    <div className="max-w-[56rem] pt-20 mx-auto w-full">
      <div className="relative p-8 sm:p-12 md:p-16 group">
        
        {/* Decorative ambient glow inside the card */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[var(--electric-cyan)] rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-[var(--cosmic-purple)] rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-[var(--border-accent)] bg-[var(--electric-cyan)]/10 px-4 py-2 backdrop-blur-md shadow-[0_0_15px_rgba(0,140,114,0.15)]"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--electric-cyan)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--electric-cyan)]" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--electric-cyan)]">
              EONET Telemetry Active
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h1 className="mb-6 text-4xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl md:text-7xl lg:text-8xl leading-[1.05] text-center">
              Watch Earth <br />
              Breathe <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-[var(--electric-cyan)] via-[var(--ice-blue)] to-[var(--cosmic-purple)] bg-clip-text text-transparent">
                in Real Time
              </span>
            </h1>
          </motion.div>

          <motion.p
            className="mx-auto mb-10 max-w-2xl text-base font-medium leading-relaxed text-[var(--text-secondary)] sm:text-lg md:text-xl select-text text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            Monitor every active wildfire, major storm, earthquake, and volcanic eruption on a highly-detailed, living digital planet.
          </motion.p>

          <motion.div
            className="mb-10 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {[
              { id: "wildfires", label: "Wildfires", color: "var(--solar-orange)", icon: "🔥" },
              { id: "severeStorms", label: "Storms", color: "var(--ice-blue)", icon: "🌀" },
              { id: "volcanoes", label: "Volcanoes", color: "var(--warning-red)", icon: "🌋" },
              { id: "earthquakes", label: "Earthquakes", color: "var(--cosmic-purple)", icon: "⚡" },
            ].map((cat) => (
              <Link
                key={cat.id}
                href={`/events?category=${cat.id}`}
                onMouseEnter={() => audioSynth.playHover()}
                onClick={() => audioSynth.playClick()}
                className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-2 text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
                style={{ color: cat.color }}
              >
                <span className="text-[14px] leading-none">{cat.icon}</span> {cat.label}
              </Link>
            ))}
          </motion.div>

          <motion.div
            className="mb-10 flex items-center justify-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-sunken)] px-6 py-3 shadow-inner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <Activity className="h-4 w-4 text-[var(--electric-cyan)] animate-pulse" />
            <span className="text-sm font-semibold text-[var(--text-secondary)]">Live Feed:</span>
            <AnimatedCounter
              value={stats?.totalActive ?? 0}
              className="text-lg font-black text-[var(--text-primary)] tabular-nums"
            />
            <span className="text-sm font-semibold text-[var(--text-secondary)]">active events tracked</span>
          </motion.div>

          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row w-full max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/events"
              className="group relative flex h-14 w-full sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[var(--text-primary)] px-8 text-sm font-bold text-[var(--canvas)] shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-glow-cyan cursor-none border border-transparent"
              onMouseEnter={() => audioSynth.playHover()}
              onClick={() => audioSynth.playClick()}
              data-cursor-label="Explore"
            >
              <span className="relative z-10 flex items-center gap-2">
                Launch Explorer
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
            <Link
              href="/map"
              className="group flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-[var(--border-hover)] bg-[var(--surface-elevated)] px-8 text-sm font-bold text-[var(--text-primary)] shadow-sm transition-all duration-300 hover:border-[var(--electric-cyan)] hover:bg-[var(--surface-secondary)] cursor-none"
              onMouseEnter={() => audioSynth.playHover()}
              onClick={() => audioSynth.playClick()}
              data-cursor-label="Map"
            >
              <Globe className="h-4 w-4 text-[var(--text-secondary)] group-hover:text-[var(--electric-cyan)] transition-colors" />
              View Map
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="mt-12 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Scroll to orbit
        </span>
        <ChevronDown className="h-4 w-4 text-[var(--text-muted)] opacity-70" />
      </motion.div>
    </div>
  );
}
