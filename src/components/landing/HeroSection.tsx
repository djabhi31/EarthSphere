/**
 * @file HeroSection.tsx
 * @description Scene 1: Hero section of the landing page displaying primary title and active disaster count.
 */
"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Activity } from "lucide-react";
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
    <div className="max-w-4xl pt-16">
      <motion.div
        className="mb-8 inline-flex items-center gap-3 rounded-full border border-electric-cyan/30 bg-electric-cyan/5 px-4 py-2 backdrop-blur-md shadow-lg shadow-electric-cyan/10 hud-corner"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-cyan opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-electric-cyan" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-electric-cyan">
          NASA EONET v3 AI Telemetry Active
        </span>
        <span className="h-3 w-px bg-[var(--border-default)]" />
        <span className="text-[10px] font-mono text-[var(--text-secondary)] font-medium">
          PING 14ms
        </span>
      </motion.div>

      <h1 className="mb-6 select-text">
        <SplitText
          text="Watch Earth Breathe"
          splitBy="word"
          className="block text-5xl font-black leading-[1.05] tracking-tight text-[var(--text-primary)] md:text-7xl lg:text-8xl"
          delay={0.3}
        />
        <SplitText
          text="in Real Time"
          splitBy="word"
          className="mt-2 block bg-gradient-to-r from-[var(--electric-cyan)] via-[var(--ice-blue)] to-[var(--cosmic-purple)] bg-clip-text text-5xl font-black leading-[1.05] tracking-tight text-transparent md:text-7xl lg:text-8xl animate-text-glow"
          delay={0.6}
        />
      </h1>

      <motion.p
        className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg md:text-xl select-text"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.1 }}
      >
        Monitor every active wildfire, major storm, earthquake, and volcanic eruption on a living, visual digital planet.
      </motion.p>

      {/* Quick Category Shortcut Chips */}
      <motion.div
        className="mb-8 flex flex-wrap items-center justify-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.25 }}
      >
        <Link
          href="/events?category=wildfires"
          onMouseEnter={() => audioSynth.playHover()}
          onClick={() => audioSynth.playClick()}
          className="flex items-center gap-1.5 rounded-full border border-[var(--solar-orange)]/30 bg-[var(--solar-orange)]/10 px-3 py-1 text-xs font-semibold text-[var(--solar-orange)] hover:bg-[var(--solar-orange)]/20 transition-colors"
        >
          🔥 Wildfires
        </Link>
        <Link
          href="/events?category=severeStorms"
          onMouseEnter={() => audioSynth.playHover()}
          onClick={() => audioSynth.playClick()}
          className="flex items-center gap-1.5 rounded-full border border-[var(--ice-blue)]/30 bg-[var(--ice-blue)]/10 px-3 py-1 text-xs font-semibold text-[var(--ice-blue)] hover:bg-[var(--ice-blue)]/20 transition-colors"
        >
          🌀 Severe Storms
        </Link>
        <Link
          href="/events?category=volcanoes"
          onMouseEnter={() => audioSynth.playHover()}
          onClick={() => audioSynth.playClick()}
          className="flex items-center gap-1.5 rounded-full border border-[var(--warning-red)]/30 bg-[var(--warning-red)]/10 px-3 py-1 text-xs font-semibold text-[var(--warning-red)] hover:bg-[var(--warning-red)]/20 transition-colors"
        >
          🌋 Volcanoes
        </Link>
        <Link
          href="/events?category=earthquakes"
          onMouseEnter={() => audioSynth.playHover()}
          onClick={() => audioSynth.playClick()}
          className="flex items-center gap-1.5 rounded-full border border-[var(--cosmic-purple)]/30 bg-[var(--cosmic-purple)]/10 px-3 py-1 text-xs font-semibold text-[var(--cosmic-purple)] hover:bg-[var(--cosmic-purple)]/20 transition-colors"
        >
          ⚡ Earthquakes
        </Link>
      </motion.div>

      <motion.div
        className="mb-10 flex items-center justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.35 }}
      >
        <Activity className="h-4 w-4 text-[var(--electric-cyan)] animate-pulse" />
        <span className="text-sm font-medium text-[var(--text-secondary)]">Live Global Feed:</span>
        <AnimatedCounter
          value={stats?.totalActive ?? 0}
          className="text-base font-extrabold text-[var(--electric-cyan)] tabular-nums"
        />
        <span className="text-sm font-medium text-[var(--text-secondary)]">active disasters tracked</span>
      </motion.div>

      <motion.div
        className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <Link
          href="/events"
          className="group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[var(--electric-cyan)] via-[var(--ice-blue)] to-[var(--cosmic-purple)] px-8 text-sm font-bold text-white shadow-lg shadow-[var(--electric-cyan)]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--electric-cyan)]/40 sm:h-14 sm:px-10 sm:text-base cursor-none border-beam"
          onMouseEnter={() => audioSynth.playHover()}
          onClick={() => audioSynth.playClick()}
          data-cursor-label="Explore"
        >
          Explore Earth
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
        <Link
          href="/map"
          className="inline-flex h-12 items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)] px-8 text-sm font-bold text-[var(--text-primary)] backdrop-blur-md shadow-sm transition-all duration-300 hover:border-[var(--electric-cyan)] hover:bg-[var(--surface-secondary)] sm:h-14 sm:px-10 sm:text-base cursor-none hud-corner"
          onMouseEnter={() => audioSynth.playHover()}
          onClick={() => audioSynth.playClick()}
          data-cursor-label="Open Map"
        >
          View Live Map
        </Link>
      </motion.div>
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">
          Scroll to awaken
        </span>
        <ChevronDown className="h-4 w-4 text-white/20" />
      </motion.div>
    </div>
  );
}
