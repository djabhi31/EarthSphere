/**
 * @file CategoriesSection.tsx
 * @description Scene 3: Grid of interactive disaster categories using SpotlightCards with a premium aesthetic.
 */
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { CATEGORY_CONFIG, getCategoryColor } from "@/lib/utils";
import { audioSynth } from "@/lib/audio";
import { staggerContainer, staggerItem, scrollReveal } from "@/lib/motion-presets";
import { ArrowRight } from "lucide-react";

export function CategoriesSection() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left placeholder to keep globe visible */}
        <div className="hidden md:block md:col-span-5 lg:col-span-6 h-[500px]" />

        {/* Right panel: Categories Grid */}
        <div className="md:col-span-7 lg:col-span-6 relative group">
          <div className="absolute -inset-2 bg-gradient-to-tr from-[var(--ice-blue)]/10 to-[var(--cosmic-purple)]/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
          
          <div className="glass-strong p-8 sm:p-10 lg:p-12 rounded-[2rem] shadow-xl border border-[var(--border-subtle)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--ice-blue)] opacity-[0.03] blur-[60px]" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ice-blue)] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--ice-blue)] animate-pulse" />
                Visual Spectrum
              </span>
              <h2 className="mb-6 text-4xl font-black tracking-tight text-[var(--text-primary)] md:text-5xl leading-[1.1]">
                Interactive <br />
                <span className="bg-gradient-to-r from-[var(--ice-blue)] to-[var(--cosmic-purple)] bg-clip-text text-transparent">
                  Disaster Categories
                </span>
              </h2>
              <p className="mb-10 text-[var(--text-secondary)] font-medium text-sm sm:text-base leading-relaxed">
                Hovering over active categories transforms the atmospheric glow of the planet. Hover a capsule card below to focus the data layer on specific anomalies.
              </p>

              <motion.div 
                className="grid grid-cols-2 gap-4"
                variants={staggerContainer()}
                initial="hidden"
                whileInView="visible"
                viewport={scrollReveal.viewport}
              >
                {Object.entries(CATEGORY_CONFIG).slice(0, 6).map(([id, config]) => {
                  const color = getCategoryColor(id);
                  return (
                    <motion.div
                      key={id}
                      variants={staggerItem}
                      onMouseEnter={() => audioSynth.playHover()}
                      onClick={() => audioSynth.playClick()}
                      data-cursor-label="Explore"
                      data-cursor-color={color}
                      className="group/card block"
                    >
                      <Link href={`/events?category=${id}`}>
                        <SpotlightCard
                          glowColor={`${color}15`}
                          borderColor={`${color}40`}
                          maxTilt={6}
                          className="h-full rounded-2xl bg-[var(--surface-primary)]/40 transition-colors hover:bg-[var(--surface-primary)]/80"
                        >
                          <div className="flex flex-col gap-3 p-5">
                            <div className="flex items-center justify-between">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-subtle)] shadow-sm">
                                <CategoryIcon categoryId={id} size={20} showGlow />
                              </div>
                              <ArrowRight 
                                className="h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover/card:opacity-100 group-hover/card:translate-x-0" 
                                style={{ color }} 
                              />
                            </div>
                            <span className="text-sm font-bold text-[var(--text-primary)] tracking-tight">
                              {config.label}
                            </span>
                          </div>
                        </SpotlightCard>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
