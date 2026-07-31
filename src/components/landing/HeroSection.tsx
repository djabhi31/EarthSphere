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
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-cyan opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-electric-cyan" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
          NASA EONET v3 Intelligence
        </span>
      </motion.div>

      <h1 className="mb-6 select-text">
        <SplitText
          text="Watch Earth Breathe"
          splitBy="word"
          className="block text-5xl font-black leading-[1.05] tracking-tight md:text-7xl lg:text-8xl"
          delay={0.3}
        />
        <SplitText
          text="in Real Time"
          splitBy="word"
          className="mt-2 block bg-gradient-to-r from-electric-cyan via-ice-blue to-cosmic-purple bg-clip-text text-5xl font-black leading-[1.05] tracking-tight text-transparent md:text-7xl lg:text-8xl"
          delay={0.6}
        />
      </h1>

      <motion.p
        className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-white/50 sm:text-lg md:text-xl select-text"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.1 }}
      >
        Monitor every active wildfire, major storm, earthquake, and volcanic eruption on a living, visual digital planet.
      </motion.p>

      <motion.div
        className="mb-10 flex items-center justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.3 }}
      >
        <Activity className="h-4 w-4 text-electric-cyan" />
        <span className="text-sm text-white/40">Tracking</span>
        <AnimatedCounter
          value={stats?.totalActive ?? 0}
          className="text-sm font-bold text-electric-cyan tabular-nums"
        />
        <span className="text-sm text-white/40">active disasters globally</span>
      </motion.div>

      <motion.div
        className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <Link
          href="/events"
          className="group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-electric-cyan to-ice-blue px-8 text-sm font-semibold text-canvas shadow-lg shadow-electric-cyan/25 transition-all duration-300 hover:shadow-xl hover:shadow-electric-cyan/40 sm:h-14 sm:px-10 sm:text-base cursor-none"
          onMouseEnter={() => audioSynth.playHover()}
          onClick={() => audioSynth.playClick()}
          data-cursor-label="Explore"
        >
          Explore Earth
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
        <Link
          href="/map"
          className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 text-sm font-semibold text-white/80 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white sm:h-14 sm:px-10 sm:text-base cursor-none"
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
