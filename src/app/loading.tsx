"use client";

import { motion } from "motion/react";
import { ParticleField } from "@/components/ui/ParticleField";
import { fadeIn } from "@/lib/motion-presets";

/**
 * Earth-themed orbital loading animation.
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-canvas overflow-hidden">
      <ParticleField className="absolute inset-0 z-0 opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-electric-cyan/5 via-transparent to-purple-500/5 opacity-50 z-0" />
      
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Orbit container */}
        <div className="w-32 h-32 relative mb-8 flex items-center justify-center">
          <motion.div 
            className="absolute inset-0 rounded-full border border-border" 
          />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-t border-electric-cyan" 
          />
          <motion.div 
            className="absolute inset-4 rounded-full border border-border/50" 
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border-b border-stellar-purple" 
          />
          
          {/* Center Earth/Core */}
          <motion.div 
            animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative flex items-center justify-center"
          >
            <div className="w-6 h-6 bg-electric-cyan rounded-full shadow-[0_0_20px_rgba(0,212,170,0.8)]" />
          </motion.div>
        </div>
        
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-text-primary font-medium tracking-widest uppercase text-sm"
        >
          Synchronizing with Earth...
        </motion.div>
      </motion.div>
    </div>
  );
}
