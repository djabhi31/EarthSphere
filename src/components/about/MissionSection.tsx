"use client";

import { motion } from "motion/react";
import { Globe, Sparkles, Satellite, Compass } from "lucide-react";
import { fadeInUp, slideUp, staggerContainer, staggerItem } from "@/lib/motion-presets";

/**
 * Hero mission statement section for the About page.
 * Features a cinematic headline with gradient text, floating elements, and subtle scroll reveal.
 */
export function MissionSection() {
  return (
    <motion.section 
      variants={staggerContainer(0.2)}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      className="relative text-center max-w-4xl mx-auto py-20"
    >
      {/* Decorative Floating Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-10 -left-10 text-electric-cyan/20 blur-[1px]"
      >
        <Satellite className="w-24 h-24" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -10, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-10 -right-10 text-cosmic-purple/20 blur-[1px]"
      >
        <Compass className="w-32 h-32" />
      </motion.div>

      {/* Main Content */}
      <motion.div 
        variants={slideUp}
        className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-electric-cyan/30 bg-surface-elevated/40 backdrop-blur-xl mb-8 relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-electric-cyan/10 via-transparent to-cosmic-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Globe className="w-5 h-5 text-electric-cyan animate-pulse" />
        <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-electric-cyan to-ice-blue uppercase tracking-[0.2em]">Welcome to EarthSphere</span>
        <Sparkles className="w-4 h-4 text-cosmic-purple" />
      </motion.div>

      <motion.div variants={fadeInUp} className="relative z-10">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-8 leading-[1.1]">
          Connecting Humanity <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">
            to Our Living Planet
          </span>
        </h1>
      </motion.div>

      <motion.p 
        variants={fadeInUp}
        className="text-lg md:text-2xl text-text-secondary leading-relaxed font-light max-w-2xl mx-auto"
      >
        EarthSphere transforms raw natural event data into a visually stunning, real-time cinematic experience, helping researchers, journalists, and global citizens monitor the pulse of our world.
      </motion.p>
    </motion.section>
  );
}
