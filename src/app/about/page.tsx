"use client";

import { motion } from "motion/react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Code2, Heart, Shield, Radio, Layers, Globe, Sparkles, Terminal } from "lucide-react";
import { ParticleField } from "@/components/ui/ParticleField";
import { MissionSection } from "@/components/about/MissionSection";
import { TechStack } from "@/components/about/TechStack";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion-presets";

/**
 * About Page
 * Features a cinematic storytelling approach with scroll reveals and premium typography.
 * Includes a dedicated Creator section.
 */

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.53 6-6.76a5.5 5.5 0 0 0-1.5-3.78 5.1 5.1 0 0 0-.1-3.82s-1.2-.38-3.9 1.4a13.4 13.4 0 0 0-7 0c-2.7-1.78-3.9-1.4-3.9-1.4a5.1 5.1 0 0 0-.1 3.82 5.5 5.5 0 0 0-1.5 3.78c0 5.23 3 6.42 6 6.76a4.8 4.8 0 0 0-1 3.24v4"></path></svg>
);
const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);
const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-32 bg-canvas relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-electric-cyan/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cosmic-purple/5 rounded-full blur-[150px]" />
      </div>
      <ParticleField className="fixed inset-0 z-0 pointer-events-none opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-32">
        
        {/* Section 1: Hero Mission Statement */}
        <MissionSection />

        {/* Section 2: What is EarthSphere & Data Sources */}
        <motion.section
          variants={staggerContainer()}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          <div className="space-y-8">
            <motion.div variants={staggerItem} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-elevated/50 border border-border-subtle backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-solar-orange" />
              <span className="text-sm font-medium tracking-wide text-text-secondary uppercase">Powered by NASA EONET</span>
            </motion.div>
            <motion.h2 variants={staggerItem} className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-tight">
              Real-Time Intelligence from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-cyan to-ice-blue">Cosmos</span>
            </motion.h2>
            <motion.p variants={staggerItem} className="text-text-secondary leading-relaxed text-lg md:text-xl font-light">
              The Earth Observatory Natural Event Tracker (EONET) is a NASA API that provides continuous, curated data on natural events. From wildfires in California to storms in the Pacific, EONET aggregates data from multiple international monitoring agencies.
            </motion.p>
            <motion.p variants={staggerItem} className="text-text-secondary leading-relaxed text-lg md:text-xl font-light">
              EarthSphere leverages the latest EONET v3 architecture to bring this critical data to the surface in real-time, completely free and open for public use.
            </motion.p>
            <motion.div variants={staggerItem} className="pt-6">
              <a href="https://eonet.gsfc.nasa.gov/" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center text-sm font-semibold h-12 bg-text-primary text-space-black hover:bg-text-primary/90 rounded-full px-8 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105">
                Explore EONET API <Globe className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
              </a>
            </motion.div>
          </div>
          <motion.div variants={staggerItem} className="h-full">
            <GlassCard className="p-8 aspect-square lg:aspect-auto h-full flex flex-col justify-center relative overflow-hidden group hover:border-electric-cyan/40 transition-colors duration-500 rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-electric-cyan/10 via-transparent to-cosmic-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative z-10 grid grid-cols-2 gap-6">
                {[
                  { icon: Radio, label: "Live Data Feed", desc: "Real-time sync", color: "text-electric-cyan", bg: "group-hover:bg-electric-cyan/10" },
                  { icon: Shield, label: "Verified Sources", desc: "NASA & Global", color: "text-ice-blue", bg: "group-hover:bg-ice-blue/10" },
                  { icon: Layers, label: "13 Categories", desc: "Comprehensive", color: "text-solar-orange", bg: "group-hover:bg-solar-orange/10" },
                  { icon: Globe, label: "Global Coverage", desc: "Worldwide events", color: "text-cosmic-purple", bg: "group-hover:bg-cosmic-purple/10" },
                ].map((item, i) => (
                  <div key={i} className={`flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-surface-elevated/40 border border-border-subtle ${item.bg} transition-all duration-500 hover:-translate-y-1`}>
                    <item.icon className={`w-8 h-8 mb-3 ${item.color}`} />
                    <span className="font-semibold text-text-primary mb-1">{item.label}</span>
                    <span className="text-xs text-text-muted">{item.desc}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </motion.section>

        {/* Section 3: Creator Profile */}
        <motion.section
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-electric-cyan via-cosmic-purple to-solar-orange rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <GlassCard className="relative p-10 md:p-14 rounded-3xl overflow-hidden border border-border-default/50 bg-surface-elevated/80 backdrop-blur-xl">
            {/* Decorative background elements inside the card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-electric-cyan/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cosmic-purple/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3" />

            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start">
              {/* Avatar/Initials */}
              <div className="shrink-0 relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-electric-cyan to-cosmic-purple rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500" />
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-space-black border border-border-subtle flex items-center justify-center overflow-hidden">
                  <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50">AG</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-electric-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              {/* Bio & Details */}
              <div className="flex-1 text-center md:text-left space-y-5">
                <div>
                  <div className="inline-flex items-center gap-2 mb-3">
                    <Terminal className="w-4 h-4 text-electric-cyan" />
                    <span className="text-sm font-semibold tracking-widest text-electric-cyan uppercase">Creator & Lead Developer</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">ABHILASH GHOSH</h3>
                  <p className="text-text-secondary text-lg leading-relaxed font-light">
                    Passionate about building performant, visually stunning, and impactful digital experiences. EarthSphere was created to bridge the gap between complex NASA telemetry data and beautiful, accessible web interfaces.
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
                  <a href="https://github.com/abhilash-ghosh" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-surface/50 border border-border-subtle text-text-secondary hover:text-white hover:bg-surface-elevated hover:border-electric-cyan/50 transition-all duration-300 hover:-translate-y-1">
                    <GithubIcon className="w-5 h-5" />
                  </a>
                  <a href="https://linkedin.com/in/abhilash-ghosh" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-surface/50 border border-border-subtle text-text-secondary hover:text-white hover:bg-surface-elevated hover:border-electric-cyan/50 transition-all duration-300 hover:-translate-y-1">
                    <LinkedinIcon className="w-5 h-5" />
                  </a>
                  <a href="https://twitter.com/abhilash-ghosh" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-surface/50 border border-border-subtle text-text-secondary hover:text-white hover:bg-surface-elevated hover:border-electric-cyan/50 transition-all duration-300 hover:-translate-y-1">
                    <TwitterIcon className="w-5 h-5" />
                  </a>
                  <Button variant="outline" className="ml-2 border-border-subtle rounded-xl hover:border-electric-cyan/50 transition-all duration-300">
                    View Portfolio
                  </Button>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.section>

        {/* Section 4: Tech Stack */}
        <TechStack />

        {/* Section 5: Call to action / Footer info */}
        <motion.section
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center pt-16 border-t border-border-default/50"
        >
          <div className="flex items-center justify-center gap-2 text-text-muted mb-8 text-sm uppercase tracking-widest font-medium">
            <span>Designed & Built with</span>
            <Heart className="w-4 h-4 text-warning-red animate-pulse" />
            <span>by Abhilash Ghosh</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Button variant="outline" className="border-border-subtle bg-surface/50 backdrop-blur-sm hover:bg-surface-elevated hover:border-electric-cyan/50 rounded-full px-8 py-6 text-base transition-all duration-300 hover:scale-105" onClick={() => window.open("https://github.com/nasa/EONET", "_blank")}>
              <Code2 className="w-5 h-5 mr-3" /> View Source Code
            </Button>
          </div>
        </motion.section>
        
      </div>
    </div>
  );
}
