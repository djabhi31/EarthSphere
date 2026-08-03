"use client";

import { motion } from "motion/react";
import { Code2, Globe, Database, Activity, Layers, Terminal, Sparkles } from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { staggerContainer, staggerItem } from "@/lib/motion-presets";

const TECH_ITEMS = [
  { icon: Code2, name: "Next.js 15", desc: "App Router & Server Components", color: "from-blue-500/20 to-cyan-500/20" },
  { icon: Terminal, name: "TypeScript", desc: "Type-safe architecture", color: "from-blue-600/20 to-indigo-600/20" },
  { icon: Layers, name: "Tailwind v4", desc: "CSS token system", color: "from-teal-400/20 to-emerald-500/20" },
  { icon: Activity, name: "Motion", desc: "Cinematic animations", color: "from-fuchsia-500/20 to-pink-500/20" },
  { icon: Globe, name: "MapLibre GL", desc: "High-performance WebGL maps", color: "from-orange-500/20 to-red-500/20" },
  { icon: Database, name: "Zustand", desc: "Global state management", color: "from-yellow-400/20 to-amber-500/20" },
];

/**
 * Technology stack showcase grid for the About page.
 * Features staggered animation and SpotlightCards for a premium feel.
 */
export function TechStack() {
  return (
    <motion.section
      variants={staggerContainer()}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      className="relative"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-border-default to-transparent mb-16" />
      
      <div className="text-center mb-16 pt-8">
        <motion.div variants={staggerItem} className="inline-flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-electric-cyan" />
          <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
            Built with Modern Tech
          </h2>
        </motion.div>
        <motion.p variants={staggerItem} className="text-text-secondary text-lg font-light">
          A world-class stack for a world-class experience.
        </motion.p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {TECH_ITEMS.map((tech, i) => (
          <motion.div key={i} variants={staggerItem} className="h-full group">
            <SpotlightCard className="p-8 h-full flex flex-col items-start gap-5 relative overflow-hidden rounded-3xl border border-border-subtle hover:border-electric-cyan/30 transition-colors duration-500">
              <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10 p-4 rounded-2xl bg-surface-elevated/80 border border-border-default backdrop-blur-md group-hover:scale-110 transition-transform duration-500">
                <tech.icon className="w-7 h-7 text-white" />
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-xl text-white mb-2">{tech.name}</h3>
                <p className="text-text-secondary font-light">{tech.desc}</p>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
