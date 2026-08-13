/**
 * @file CTASection.tsx
 * @description Scene 6: Final call-to-action on the landing page, featuring a stunning glassmorphism finish.
 */
"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import { audioSynth } from "@/lib/audio";
import { scaleIn, scrollReveal } from "@/lib/motion-presets";

export function CTASection() {
  return (
    <div className="relative w-full max-w-4xl mx-auto z-20 group">
      {/* Massive ambient glow behind the CTA */}
      <div className="absolute -inset-10 bg-gradient-to-r from-[var(--electric-cyan)]/20 via-[var(--ice-blue)]/20 to-[var(--cosmic-purple)]/20 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10 pointer-events-none" />

      <motion.div 
        className="glass-strong p-10 sm:p-16 md:p-20 rounded-[3rem] border border-[var(--border-subtle)] text-center relative overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-glow-cyan"
        variants={scaleIn}
        initial="hidden"
        whileInView="visible"
        viewport={scrollReveal.viewport}
      >
        {/* Decorative inner particles / noise */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
        
        {/* Subtle top highlight */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="mb-8 text-5xl font-black tracking-tight text-[var(--text-primary)] sm:text-6xl md:text-7xl leading-[1.05]">
              Join the Future of <br />
              <span className="bg-gradient-to-r from-[var(--electric-cyan)] via-[var(--ice-blue)] to-[var(--cosmic-purple)] bg-clip-text text-transparent">
                Earth Intelligence
              </span>
            </h2>
          </motion.div>
          
          <motion.p 
            className="mx-auto mb-12 max-w-2xl text-base text-[var(--text-secondary)] font-medium md:text-lg sm:text-xl leading-relaxed select-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Monitor planetary anomalies, review historic disaster trends, and analyze high-frequency satellite telemetry — all in one premium workspace.
          </motion.p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block relative group/btn"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Button Outer Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--electric-cyan)] to-[var(--ice-blue)] rounded-2xl blur opacity-30 group-hover/btn:opacity-70 transition duration-500" />
            
            <Link
              href="/events"
              className="relative flex h-16 items-center gap-3 overflow-hidden rounded-2xl bg-[var(--text-primary)] px-10 text-lg font-bold text-[var(--canvas)] shadow-xl transition-all duration-300 cursor-none"
              onMouseEnter={() => audioSynth.playHover()}
              onClick={() => audioSynth.playClick()}
              data-cursor-label="Launch"
            >
              <Globe className="h-6 w-6 text-[var(--canvas)]/80" />
              <span>Explore Earth Platform</span>
              <ArrowRight className="h-6 w-6 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
