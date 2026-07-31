/**
 * @file CategoriesSection.tsx
 * @description Scene 3: Grid of interactive disaster categories using SpotlightCards.
 */
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { CATEGORY_CONFIG, getCategoryColor } from "@/lib/utils";
import { audioSynth } from "@/lib/audio";
import { staggerContainer, staggerItem, scrollReveal } from "@/lib/motion-presets";

export function CategoriesSection() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left placeholder to keep globe visible */}
        <div className="hidden md:block h-[500px]" />

        {/* Right panel: Categories Grid */}
        <div className="max-md:bg-[var(--surface-elevated)]/80 max-md:backdrop-blur-md max-md:p-6 max-md:rounded-2xl max-md:border max-md:border-[var(--border-subtle)] max-md:shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--ice-blue)] mb-2 block">
            Visual Spectrum
          </span>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-5xl">
            Interactive <br />
            <span className="bg-gradient-to-r from-[var(--ice-blue)] to-[var(--cosmic-purple)] bg-clip-text text-transparent">
              Disaster Categories
            </span>
          </h2>
          <p className="mb-8 text-[var(--text-tertiary)] text-sm md:text-base leading-relaxed">
            Hovering over active categories transforms the atmospheric glow of the planet. Hover a capsule card below to focus the data layer.
          </p>

          <motion.div 
            className="grid grid-cols-2 gap-3 max-w-xl"
            variants={staggerContainer()}
            initial="hidden"
            whileInView="visible"
            viewport={scrollReveal.viewport}
          >
            {Object.entries(CATEGORY_CONFIG).slice(0, 8).map(([id, config]) => {
              const color = getCategoryColor(id);
              return (
                <motion.div
                  key={id}
                  variants={staggerItem}
                  onMouseEnter={() => {
                    audioSynth.playHover();
                  }}
                  onClick={() => audioSynth.playClick()}
                  data-cursor-label="Explore"
                  data-cursor-color={color}
                >
                  <SpotlightCard
                    glowColor={`${color}12`}
                    borderColor={`${color}30`}
                    maxTilt={8}
                    className="h-full"
                  >
                    <Link href={`/events?category=${id}`} className="flex items-center gap-3 p-4">
                      <CategoryIcon categoryId={id} size={18} showGlow />
                      <span className="text-xs font-semibold text-[var(--text-secondary)] transition-colors group-hover:text-[var(--text-primary)]">
                        {config.label}
                      </span>
                    </Link>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
