"use client";

import { motion } from "motion/react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Code2, Heart, Shield, Radio, Layers, Globe, Sparkles, Terminal } from "lucide-react";
import { ParticleField } from "@/components/ui/ParticleField";
import { MissionSection } from "@/components/about/MissionSection";
import { TechStack } from "@/components/about/TechStack";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion-presets";
import { Navbar } from "@/components/layout/Navbar";

/**
 * About Page
 * Features a cinematic storytelling approach with scroll reveals and premium typography.
 * Includes a dedicated Creator section.
 */

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.53 6-6.76a5.5 5.5 0 0 0-1.5-3.78 5.1 5.1 0 0 0-.1-3.82s-1.2-.38-3.9 1.4a13.4 13.4 0 0 0-7 0c-2.7-1.78-3.9-1.4-3.9-1.4a5.1 5.1 0 0 0-.1 3.82 5.5 5.5 0 0 0-1.5 3.78c0 5.23 3 6.42 6 6.76a4.8 4.8 0 0 0-1 3.24v4"></path></svg>
);
const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);
const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
);
const YouTubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);
const SpotifyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.381 4.26-1.261 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.54-1.02.72-1.56.42z"/></svg>
);

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-32 bg-canvas relative overflow-hidden">

      {/* Dynamic Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-electric-cyan/10 rounded-full blur-[150px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-cosmic-purple/10 rounded-full blur-[150px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute top-[40%] left-[40%] w-[600px] h-[600px] bg-solar-orange/5 rounded-full blur-[150px]" 
        />
      </div>
      <ParticleField className="fixed inset-0 z-0 pointer-events-none opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-40">
        
        {/* Section 1: Hero Mission Statement */}
        <MissionSection />

        {/* Section 2: What is EarthSphere & Data Sources */}
        <motion.section
          variants={staggerContainer()}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative"
        >
          {/* Connector Line (visible on desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-px bg-gradient-to-r from-electric-cyan via-transparent to-cosmic-purple opacity-50" />

          <div className="space-y-8">
            <motion.div variants={staggerItem} className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-surface-elevated/80 border border-electric-cyan/20 backdrop-blur-xl shadow-[0_0_20px_rgba(0,240,255,0.05)]">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-solar-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-solar-orange"></span>
              </span>
              <span className="text-sm font-semibold tracking-[0.15em] text-white uppercase">Powered by EONET v3</span>
            </motion.div>
            
            <motion.h2 variants={staggerItem} className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Real-Time <br />
              Intelligence from <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-cyan via-ice-blue to-cosmic-purple">
                the Cosmos
              </span>
            </motion.h2>
            
            <motion.p variants={staggerItem} className="text-text-secondary leading-relaxed text-lg md:text-xl font-light">
              The Earth Observatory Natural Event Tracker (EONET) is a NASA API that provides continuous, curated data on natural events. From wildfires in California to storms in the Pacific, EONET aggregates data from multiple international monitoring agencies.
            </motion.p>
            
            <motion.div variants={staggerItem} className="pt-6">
              <a href="https://eonet.gsfc.nasa.gov/" target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center justify-center text-sm font-bold h-14 bg-white text-space-black rounded-full px-8 overflow-hidden transition-transform hover:scale-105 active:scale-95">
                <div className="absolute inset-0 bg-gradient-to-r from-electric-cyan to-cosmic-purple opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  Explore EONET Architecture 
                  <Globe className="w-4 h-4 group-hover:rotate-[360deg] transition-transform duration-700 ease-in-out" />
                </span>
              </a>
            </motion.div>
          </div>

          <motion.div variants={staggerItem} className="h-full relative group perspective-1000">
            <div className="absolute -inset-4 bg-gradient-to-br from-electric-cyan/20 via-transparent to-cosmic-purple/20 rounded-[2.5rem] blur-xl group-hover:blur-2xl transition-all duration-700 opacity-50" />
            <GlassCard className="p-8 h-full flex flex-col justify-center relative overflow-hidden group-hover:border-electric-cyan/40 transition-all duration-700 rounded-[2rem] bg-surface-elevated/40 backdrop-blur-2xl transform-gpu group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-electric-cyan/10">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-electric-cyan/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10 grid grid-cols-2 gap-4 md:gap-6">
                {[
                  { icon: Radio, label: "Live Data Feed", desc: "Real-time global sync", color: "text-electric-cyan", bg: "group-hover:bg-electric-cyan/10", border: "group-hover:border-electric-cyan/30" },
                  { icon: Shield, label: "Verified Sources", desc: "NASA & global orgs", color: "text-ice-blue", bg: "group-hover:bg-ice-blue/10", border: "group-hover:border-ice-blue/30" },
                  { icon: Layers, label: "13 Categories", desc: "Volcanoes to icebergs", color: "text-solar-orange", bg: "group-hover:bg-solar-orange/10", border: "group-hover:border-solar-orange/30" },
                  { icon: Globe, label: "Global Coverage", desc: "Borderless tracking", color: "text-cosmic-purple", bg: "group-hover:bg-cosmic-purple/10", border: "group-hover:border-cosmic-purple/30" },
                ].map((item, i) => (
                  <div key={i} className={`flex flex-col items-center justify-center text-center p-6 md:p-8 rounded-3xl bg-surface/50 border border-border-default backdrop-blur-md ${item.bg} ${item.border} transition-all duration-500 hover:-translate-y-2 hover:shadow-xl`}>
                    <div className={`p-4 rounded-2xl bg-surface-elevated border border-border-subtle mb-4 shadow-inner ${item.color}`}>
                      <item.icon className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    <span className="font-bold text-white mb-2">{item.label}</span>
                    <span className="text-xs md:text-sm text-text-muted font-light">{item.desc}</span>
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
              {/* Avatar/Image */}
              <div className="shrink-0 relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-electric-cyan to-cosmic-purple rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500" />
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-space-black border border-border-subtle flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://media.licdn.com/dms/image/v2/D5603AQE6luJAdgV2Yg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1692946636775?e=2147483647&v=beta&t=5YwMmxZySGkDXp5z7gERkE_liioYE_dbGGoEr5TUFgM" alt="Abhilash Ghosh" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-electric-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </div>

              {/* Bio & Details */}
              <div className="flex-1 text-center md:text-left space-y-5">
                <div>
                  <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">Abhilash Ghosh</h3>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface-elevated border border-border-subtle text-electric-cyan">Commerce Student</span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface-elevated border border-border-subtle text-cosmic-purple">Music Producer</span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface-elevated border border-border-subtle text-solar-orange">Tech Enthusiast</span>
                  </div>
                  <div className="text-text-secondary text-base leading-relaxed font-light space-y-3">
                    <p>Hi, I&apos;m Abhilash Ghosh — the mind behind EarthSphere.</p>
                    <p>By day, I&apos;m a commerce student and working professional. By night, I dive into creativity — whether it&apos;s producing music as <strong className="text-white font-medium">DJ ABHI-Maheshtala</strong> or building meaningful digital experiences like this one. I enjoy creating things that people can actually use, explore, or relate to.</p>
                    <p>The idea for EarthSphere came from a simple thought: NASA&apos;s critical global event data is powerful, but it shouldn&apos;t just be locked inside raw JSON feeds. So why not create a place where people can seamlessly visualize wildfires, storms, and volcanoes in a beautiful, cinematic way?</p>
                    <p>I&apos;m always exploring new ideas, mixing creativity with practicality, and trying to build things that stand out on the internet.</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                  <a href="https://www.instagram.com/djabhi.31" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-surface/50 border border-border-subtle text-text-secondary hover:text-white hover:bg-surface-elevated hover:border-electric-cyan/50 transition-all duration-300 hover:-translate-y-1">
                    <InstagramIcon className="w-5 h-5" />
                  </a>
                  <a href="https://www.youtube.com/@djabhimaheshtala" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-surface/50 border border-border-subtle text-text-secondary hover:text-white hover:bg-surface-elevated hover:border-electric-cyan/50 transition-all duration-300 hover:-translate-y-1">
                    <YouTubeIcon className="w-5 h-5" />
                  </a>
                  <a href="https://open.spotify.com/artist/6cgJwZZxm6WnpGvrIEvdjR" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-surface/50 border border-border-subtle text-text-secondary hover:text-white hover:bg-surface-elevated hover:border-electric-cyan/50 transition-all duration-300 hover:-translate-y-1">
                    <SpotifyIcon className="w-5 h-5" />
                  </a>
                  <a href="https://linkedin.com/in/abhilash-ghosh-8b5a711b1/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-surface/50 border border-border-subtle text-text-secondary hover:text-white hover:bg-surface-elevated hover:border-electric-cyan/50 transition-all duration-300 hover:-translate-y-1">
                    <LinkedinIcon className="w-5 h-5" />
                  </a>
                  <a href="https://github.com/abhilash-ghosh" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-surface/50 border border-border-subtle text-text-secondary hover:text-white hover:bg-surface-elevated hover:border-electric-cyan/50 transition-all duration-300 hover:-translate-y-1">
                    <GithubIcon className="w-5 h-5" />
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
    </>
  );
}
