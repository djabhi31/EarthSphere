"use client";

import { motion } from "motion/react";
import { Code2, Globe, Database, Activity, Layers, Terminal } from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { staggerContainer, staggerItem } from "@/lib/motion-presets";

const TECH_ITEMS = [
  { icon: Code2, name: "Next.js 15", desc: "App Router & Server Components" },
  { icon: Terminal, name: "TypeScript", desc: "Type-safe architecture" },
  { icon: Layers, name: "Tailwind v4", desc: "CSS token system" },
  { icon: Activity, name: "Motion", desc: "Cinematic animations" },
  { icon: Globe, name: "MapLibre GL JS", desc: "High-performance WebGL maps" },
  { icon: Database, name: "Zustand", desc: "Global state management" },
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
    >
      <div className="text-center mb-12">
        <motion.h2 variants={staggerItem} className="text-3xl font-bold mb-4 text-text-primary">
          Built with Modern Tech
        </motion.h2>
        <motion.p variants={staggerItem} className="text-text-secondary">
          A world-class stack for a world-class experience.
        </motion.p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TECH_ITEMS.map((tech, i) => (
          <motion.div key={i} variants={staggerItem} className="h-full">
            <SpotlightCard className="p-6 h-full flex flex-col items-start gap-4">
              <div className="p-3 rounded-xl bg-surface-elevated/50 border border-border-default">
                <tech.icon className="w-6 h-6 text-electric-cyan" />
              </div>
              <div>
                <h3 className="font-medium text-text-primary mb-1">{tech.name}</h3>
                <p className="text-sm text-text-muted">{tech.desc}</p>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
