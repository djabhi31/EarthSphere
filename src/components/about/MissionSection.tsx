"use client";

import { motion } from "motion/react";
import { Globe } from "lucide-react";
import { fadeInUp, slideUp } from "@/lib/motion-presets";

/**
 * Hero mission statement section for the About page.
 * Features a cinematic headline with gradient text and subtle scroll reveal.
 */
export function MissionSection() {
  return (
    <motion.section 
      variants={slideUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      className="text-center max-w-3xl mx-auto"
    >
      <motion.div 
        variants={fadeInUp}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-default bg-surface-elevated/50 backdrop-blur-md mb-6"
      >
        <Globe className="w-4 h-4 text-electric-cyan" />
        <span className="text-xs font-medium text-text-secondary uppercase tracking-widest">EarthSphere</span>
      </motion.div>
      <motion.h1 
        variants={fadeInUp}
        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-text-primary via-text-primary/90 to-text-secondary"
      >
        Connecting Humanity to Our Living Planet
      </motion.h1>
      <motion.p 
        variants={fadeInUp}
        className="text-lg md:text-xl text-text-secondary leading-relaxed"
      >
        EarthSphere transforms raw natural event data into a real-time, cinematic experience, helping researchers, journalists, and global citizens monitor the pulse of our world.
      </motion.p>
    </motion.section>
  );
}
