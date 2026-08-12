/**
 * @file CTASection.tsx
 * @description Scene 6: Final call-to-action on the landing page.
 */
"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import { audioSynth } from "@/lib/audio";
import { scaleIn, scrollReveal } from "@/lib/motion-presets";

export function CTASection() {
  return (
    <motion.div 
      className="max-w-3xl z-20 bg-[var(--surface-overlay)]/85 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-[var(--border-default)] mx-auto shadow-2xl shadow-black/10 text-center"
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={scrollReveal.viewport}
    >
      <h2 className="mb-6 bg-gradient-to-r from-[var(--electric-cyan)] via-[var(--ice-blue)] to-[var(--cosmic-purple)] bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
        Join the Future of <br /> Earth Intelligence
      </h2>
      
      <p className="mx-auto mb-10 max-w-xl text-base text-[var(--text-secondary)] md:text-lg select-text">
        Monitor planetary anomalies, review historic disaster trends, and analyze high-frequency satellite telemetry — all in one premium workspace.
      </p>

      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="inline-block"
      >
        <Link
          href="/events"
          className="group relative inline-flex h-14 items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--electric-cyan)] to-[var(--ice-blue)] px-10 text-base font-bold text-white shadow-xl shadow-[var(--electric-cyan)]/25 hover:shadow-2xl hover:shadow-[var(--electric-cyan)]/40 transition-all duration-300 cursor-none"
          onMouseEnter={() => audioSynth.playHover()}
          onClick={() => audioSynth.playClick()}
        >
          <Globe className="h-5 w-5" />
          Explore Earth Platform
          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
