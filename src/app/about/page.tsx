"use client";

import { motion } from "motion/react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Code2, Heart, Shield, Radio, Layers, Globe } from "lucide-react";
import { ParticleField } from "@/components/ui/ParticleField";
import { MissionSection } from "@/components/about/MissionSection";
import { TechStack } from "@/components/about/TechStack";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion-presets";

/**
 * About Page
 * Features a cinematic storytelling approach with scroll reveals and premium typography.
 */
export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-32 bg-canvas">
      {/* Background */}
      <ParticleField className="fixed inset-0 z-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-24">
        
        {/* Section 1: Hero Mission Statement */}
        <MissionSection />

        {/* Section 2 & 4: What is EarthSphere & Data Sources (Powered by EONET) */}
        <motion.section
          variants={staggerContainer()}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-6">
            <motion.h2 variants={staggerItem} className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
              Powered by NASA EONET
            </motion.h2>
            <motion.p variants={staggerItem} className="text-text-secondary leading-relaxed text-lg">
              The Earth Observatory Natural Event Tracker (EONET) is a NASA API that provides continuous, curated data on natural events. From wildfires in California to storms in the Pacific, EONET aggregates data from multiple international monitoring agencies.
            </motion.p>
            <motion.p variants={staggerItem} className="text-text-secondary leading-relaxed text-lg">
              EarthSphere leverages the latest EONET v3 architecture to bring this critical data to the surface in real-time, completely free and open for public use.
            </motion.p>
            <motion.div variants={staggerItem} className="pt-4">
              <a href="https://eonet.gsfc.nasa.gov/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center text-sm font-medium h-10 bg-text-primary text-space-black hover:bg-text-primary/90 rounded-full px-8 transition-colors">
                Learn about EONET <Globe className="w-4 h-4 ml-2" />
              </a>
            </motion.div>
          </div>
          <motion.div variants={staggerItem} className="h-full">
            <GlassCard className="p-8 aspect-square lg:aspect-auto h-full flex flex-col justify-center relative overflow-hidden group hover:border-electric-cyan/30 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-electric-cyan/5 to-cosmic-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="relative z-10 grid grid-cols-2 gap-6">
                {[
                  { icon: Radio, label: "Live Data Feed", color: "text-electric-cyan" },
                  { icon: Shield, label: "Verified Sources", color: "text-ice-blue" },
                  { icon: Layers, label: "13 Categories", color: "text-solar-orange" },
                  { icon: Globe, label: "Global Coverage", color: "text-cosmic-purple" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-surface-elevated/30 border border-border-subtle group-hover:bg-surface-elevated/50 transition-colors duration-500">
                    <item.icon className={`w-8 h-8 mb-4 ${item.color}`} />
                    <span className="font-medium text-text-primary">{item.label}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </motion.section>

        {/* Section 3: Tech Stack */}
        <TechStack />

        {/* Section 5: Call to action / Footer info */}
        <motion.section
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center pt-12 border-t border-border-default"
        >
          <div className="flex items-center justify-center gap-2 text-text-muted mb-6">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-warning-red" />
            <span>for Earth</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="border-border-default bg-surface-elevated hover:bg-surface-elevated/80 rounded-full" onClick={() => window.open("https://github.com/nasa/EONET", "_blank")}>
              <Code2 className="w-4 h-4 mr-2" /> View Source
            </Button>
          </div>
        </motion.section>
        
      </div>
    </div>
  );
}
