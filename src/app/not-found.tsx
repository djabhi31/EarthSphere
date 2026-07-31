"use client";

import Link from "next/link";
import { ParticleField } from "@/components/ui/ParticleField";
import { motion } from "motion/react";
import { Home, Eye } from "lucide-react";
import { fadeInUp, hover } from "@/lib/motion-presets";
import { gradients } from "@/lib/design-tokens";

/**
 * Lost in Space themed 404 page.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-canvas">
      <ParticleField particleCount={150} className="absolute inset-0 z-0 opacity-60 pointer-events-none" />
      
      <motion.div 
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        className="relative z-10 text-center px-6 max-w-2xl mx-auto"
      >
        <motion.div
          animate={{ 
            y: [-10, 10, -10],
            rotate: [-2, 2, -2]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ backgroundImage: gradients.aurora }}
          className="text-8xl md:text-9xl font-black text-transparent bg-clip-text select-none mb-6 tracking-tighter"
        >
          404
        </motion.div>
        
        <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-6 font-display tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-text-primary via-text-primary/90 to-text-secondary">
          Lost in the Cosmos
        </h1>
        
        <p className="text-lg text-text-secondary mb-10 leading-relaxed max-w-lg mx-auto tracking-tight">
          The sector you are attempting to monitor has drifted into the cosmos. It might have been relocated, or it never existed in our database.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.div whileHover={hover.glow} whileTap={{ scale: 0.95 }}>
            <Link 
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-text-primary text-canvas px-8 py-4 text-base font-medium shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.5)] transition-all"
            >
              <Home className="w-5 h-5 mr-3" /> Return to Earth
            </Link>
          </motion.div>
          
          <motion.div whileHover={hover.lift} whileTap={{ scale: 0.95 }}>
            <Link 
              href="/events"
              className="inline-flex items-center justify-center rounded-full border border-border bg-surface/50 hover:bg-surface text-text-primary px-8 py-4 text-base font-medium transition-all"
            >
              <Eye className="w-5 h-5 mr-3" /> View Live Events
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
