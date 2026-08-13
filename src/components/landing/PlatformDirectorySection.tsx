/**
 * @file PlatformDirectorySection.tsx
 * @description Scene 6: Comprehensive directory grid linking to all platform modules.
 */
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { audioSynth } from "@/lib/audio";
import { staggerContainer, staggerItem, scrollReveal } from "@/lib/motion-presets";
import {
  Globe, Flame, Mountain, CloudLightning,
  Telescope, Camera, Rocket, Star,
  Sun, Satellite, Beaker, LayoutDashboard,
  Image, Crosshair, Sparkles, Orbit, Info, Compass
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define the platform directory structure (based on navbar)
const DIRECTORY_MODULES = [
  {
    label: "Earth Systems",
    icon: <Globe size={18} className="text-[var(--electric-cyan)]" />,
    color: "var(--electric-cyan)",
    links: [
      { href: "/events", label: "EONET Events", icon: <CloudLightning size={14} />, desc: "Live disaster tracking" },
      { href: "/map", label: "Interactive Map", icon: <Globe size={14} />, desc: "3D geospatial map" },
      { href: "/epic", label: "EPIC Camera", icon: <Camera size={14} />, desc: "Full-disc imagery" },
      { href: "/earth-imagery", label: "Landsat Satellite", icon: <Crosshair size={14} />, desc: "High-res observations" },
    ],
  },
  {
    label: "Deep Space",
    icon: <Rocket size={18} className="text-[var(--cosmic-purple)]" />,
    color: "var(--cosmic-purple)",
    links: [
      { href: "/apod", label: "Picture of the Day", icon: <Star size={14} />, desc: "Daily astronomy photo" },
      { href: "/asteroids", label: "Near-Earth Asteroids", icon: <Crosshair size={14} />, desc: "JPL close approach feed" },
      { href: "/fireballs", label: "Fireballs & Bolides", icon: <Flame size={14} />, desc: "Atmospheric impacts" },
      { href: "/exoplanets", label: "Exoplanet Archive", icon: <Sparkles size={14} />, desc: "Alien worlds catalog" },
    ],
  },
  {
    label: "Solar & Planetary",
    icon: <Sun size={18} className="text-[var(--solar-orange)]" />,
    color: "var(--solar-orange)",
    links: [
      { href: "/space-weather", label: "Space Weather", icon: <Sun size={14} />, desc: "Solar flares & storms" },
      { href: "/mars", label: "Mars Rovers", icon: <Mountain size={14} />, desc: "Curiosity, Perseverance" },
    ],
  },
  {
    label: "NASA Archives",
    icon: <Telescope size={18} className="text-[var(--ice-blue)]" />,
    color: "var(--ice-blue)",
    links: [
      { href: "/media", label: "Media Library", icon: <Image size={14} />, desc: "Photos, videos, audio" },
      { href: "/satellites", label: "Orbit Tracker", icon: <Satellite size={14} />, desc: "TLE tracking" },
      { href: "/techport", label: "Techport R&D", icon: <Beaker size={14} />, desc: "NASA tech projects" },
    ],
  },
  {
    label: "Core Dashboards",
    icon: <LayoutDashboard size={18} className="text-[var(--aurora-mint)]" />,
    color: "var(--aurora-mint)",
    links: [
      { href: "/", label: "Home Base", icon: <Compass size={14} />, desc: "Global overview" },
      { href: "/dashboard", label: "User Dashboard", icon: <LayoutDashboard size={14} />, desc: "Personal workspace" },
      { href: "/analytics", label: "Analytics Center", icon: <Orbit size={14} />, desc: "Data insights" },
      { href: "/about", label: "About Platform", icon: <Info size={14} />, desc: "Mission details" },
    ],
  },
];

export function PlatformDirectorySection() {
  return (
    <div className="mx-auto w-full max-w-7xl relative z-10">
      <div className="text-center max-w-2xl mx-auto mb-16 relative group">
        <div className="glass-strong p-8 rounded-[2.5rem] border border-[var(--border-subtle)] shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--electric-blue)] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--electric-blue)] animate-pulse" />
              Platform Hub
            </span>
            <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] md:text-5xl">
              Complete <span className="bg-gradient-to-r from-[var(--electric-blue)] to-[var(--cosmic-purple)] bg-clip-text text-transparent">Directory</span>
            </h2>
          </div>
        </div>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={staggerContainer()}
        initial="hidden"
        whileInView="visible"
        viewport={scrollReveal.viewport}
      >
        {DIRECTORY_MODULES.map((module, idx) => (
          <motion.div 
            key={idx} 
            variants={staggerItem}
            className="glass-subtle p-6 rounded-[2rem] border border-[var(--border-subtle)] shadow-lg hover:shadow-xl hover:border-[var(--border-hover)] transition-all duration-300 relative group overflow-hidden"
          >
            {/* Subtle background glow based on category color */}
            <div 
              className="absolute -top-10 -right-10 w-32 h-32 opacity-5 blur-[40px] pointer-events-none transition-opacity duration-500 group-hover:opacity-15"
              style={{ backgroundColor: module.color }}
            />

            <div className="flex items-center gap-3 mb-6 border-b border-[var(--border-subtle)] pb-4">
              <div className="p-2 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-subtle)]">
                {module.icon}
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.1em] text-[var(--text-primary)]">
                {module.label}
              </h3>
            </div>

            <div className="flex flex-col gap-2 relative z-10">
              {module.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => audioSynth.playHover()}
                  onClick={() => audioSynth.playClick()}
                  className="group/link flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--surface-primary)] border border-transparent hover:border-[var(--border-subtle)] transition-all duration-300"
                >
                  <span 
                    className="flex-shrink-0 opacity-70 group-hover/link:opacity-100 group-hover/link:scale-110 transition-all duration-300"
                    style={{ color: module.color }}
                  >
                    {link.icon}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-[var(--text-primary)] group-hover/link:text-[var(--text-primary)] transition-colors">
                      {link.label}
                    </div>
                    <div className="text-[10px] font-medium text-[var(--text-muted)] group-hover/link:text-[var(--text-secondary)] transition-colors line-clamp-1">
                      {link.desc}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
