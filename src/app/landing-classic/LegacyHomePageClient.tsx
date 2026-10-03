// =============================================================================
// EarthSphere — Cinematic Scroll-Reactive Landing Page
// =============================================================================

"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Footer } from "@/components/layout/Footer";
import dynamic from "next/dynamic";

const ParticleField = dynamic(() => import("@/components/ui/ParticleField").then(mod => mod.ParticleField), { ssr: false });
const FloatingEarth = dynamic(() => import("@/components/ui/FloatingEarth").then(mod => mod.FloatingEarth), { ssr: false });
import { useEvents, useEventStats } from "@/hooks/useEvents";
import type { EONETEvent } from "@/lib/types";

// Import Section Components
import { HeroSection } from "@/components/landing/HeroSection";
import { IntelligenceSection } from "@/components/landing/IntelligenceSection";
import { CategoriesSection } from "@/components/landing/CategoriesSection";
import { TimelineSection, LANDMARK_EVENTS } from "@/components/landing/TimelineSection";
import { MapPreviewSection } from "@/components/landing/MapPreviewSection";
import { PlatformDirectorySection } from "@/components/landing/PlatformDirectorySection";
import { CTASection } from "@/components/landing/CTASection";

const EVENT_FILTERS = { status: "open" as const, limit: 60 };
const EMPTY_EVENTS: EONETEvent[] = [];

export default function HomePageClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of the entire page
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scrollSmooth = useSpring(scrollYProgress, { stiffness: 60, damping: 25, mass: 0.8 });

  // Data fetching
  const { data: rawEvents } = useEvents(EVENT_FILTERS);
  const { data: stats } = useEventStats(EVENT_FILTERS);
  const events = useMemo(() => (rawEvents?.events ? [...rawEvents.events] : EMPTY_EVENTS), [rawEvents]);

  // Coordinates focus target state for globe
  const [focusCoords, setFocusCoords] = useState<[number, number] | null>(null);

  // Map scroll progress to scenes visibility (7 Scenes mapped over 750vh)
  const opacityScene1 = useTransform(scrollSmooth, [0, 0.10, 0.14], [1, 1, 0]);
  const yScene1 = useTransform(scrollSmooth, [0, 0.14], [0, -50]);

  const opacityScene2 = useTransform(scrollSmooth, [0.10, 0.15, 0.24, 0.28], [0, 1, 1, 0]);
  const yScene2 = useTransform(scrollSmooth, [0.10, 0.15, 0.28], [50, 0, -50]);

  const opacityScene3 = useTransform(scrollSmooth, [0.24, 0.29, 0.39, 0.43], [0, 1, 1, 0]);
  const yScene3 = useTransform(scrollSmooth, [0.24, 0.29, 0.43], [50, 0, -50]);

  const opacityScene4 = useTransform(scrollSmooth, [0.39, 0.44, 0.56, 0.60], [0, 1, 1, 0]);
  
  const opacityScene5 = useTransform(scrollSmooth, [0.56, 0.61, 0.71, 0.75], [0, 1, 1, 0]);
  const yScene5 = useTransform(scrollSmooth, [0.56, 0.61, 0.75], [50, 0, -50]);

  const opacityScene6 = useTransform(scrollSmooth, [0.71, 0.76, 0.86, 0.90], [0, 1, 1, 0]);
  const yScene6 = useTransform(scrollSmooth, [0.71, 0.76, 0.90], [50, 0, -50]);

  const opacityScene7 = useTransform(scrollSmooth, [0.86, 0.91, 1.0], [0, 1, 1]);
  const yScene7 = useTransform(scrollSmooth, [0.86, 0.91], [50, 0]);

  // Fade out and float up globe near CTA section so it never overlaps the footer
  const globeOpacity = useTransform(scrollSmooth, [0.80, 0.90], [1, 0]);
  const globeScale = useTransform(scrollSmooth, [0.80, 0.90], [1, 0.7]);
  const globeY = useTransform(scrollSmooth, [0.80, 0.90], [0, -80]);

  // Handle timeline scroll-linked coordinates locking
  useEffect(() => {
    let lastFocusCoords: [number, number] | null = null;

    return scrollSmooth.on('change', (v) => {
      let targetCoords: [number, number] | null = null;

      // Timeline section is roughly between 39% and 60% scroll
      if (v >= 0.42 && v < 0.47) {
        targetCoords = LANDMARK_EVENTS[0].coords;
      } else if (v >= 0.47 && v < 0.52) {
        targetCoords = LANDMARK_EVENTS[1].coords;
      } else if (v >= 0.52 && v < 0.57) {
        targetCoords = LANDMARK_EVENTS[2].coords;
      }

      if (targetCoords !== lastFocusCoords) {
        lastFocusCoords = targetCoords;
        setFocusCoords(targetCoords);
      }
    });
  }, [scrollSmooth]);

  return (
    <div ref={containerRef} className="relative min-h-[750vh] bg-[var(--canvas)] text-[var(--text-primary)]">
      {/* ── Fixed Backdrop Canvas Globe & Stars (interaction Layer) ──── */}
      <motion.div 
        style={{ opacity: globeOpacity, scale: globeScale, y: globeY }}
        className="fixed inset-0 z-[1] pointer-events-none flex items-center justify-center"
      >
        {/* Particle Stars */}
        <ParticleField className="absolute inset-0 z-0" />
        
        {/* Globe Container */}
        <div className="pointer-events-auto relative z-10 w-full h-full flex items-center justify-center">
          <FloatingEarth 
            events={events} 
            focusCoords={focusCoords} 
            interactive={true} 
          />
        </div>
      </motion.div>

      {/* ── Scrollable Storytelling Layer ───────────────────────────── */}
      <div className="relative z-10 w-full">
        
        <motion.section
          style={{ opacity: opacityScene1, y: yScene1 }}
          className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center select-none"
        >
          <HeroSection stats={stats} />
        </motion.section>

        <motion.section
          style={{ opacity: opacityScene2, y: yScene2 }}
          className="relative flex min-h-screen items-center px-6"
        >
          <IntelligenceSection />
        </motion.section>

        <motion.section
          style={{ opacity: opacityScene3, y: yScene3 }}
          className="relative flex min-h-screen items-center px-6"
        >
          <CategoriesSection />
        </motion.section>

        <motion.section
          style={{ opacity: opacityScene4 }}
          className="relative min-h-[160vh] py-24 px-6 flex flex-col justify-start"
        >
          <TimelineSection />
        </motion.section>

        <motion.section
          style={{ opacity: opacityScene5, y: yScene5 }}
          className="relative flex min-h-screen items-center px-6"
        >
          <MapPreviewSection events={events} />
        </motion.section>

        <motion.section
          style={{ opacity: opacityScene6, y: yScene6 }}
          className="relative flex min-h-screen items-center px-6 py-24"
        >
          <PlatformDirectorySection />
        </motion.section>

        <motion.section
          style={{ opacity: opacityScene7, y: yScene7 }}
          className="relative flex min-h-screen items-center justify-center px-6 text-center select-none"
        >
          <CTASection />
        </motion.section>
      </div>

      <Footer />
    </div>
  );
}
