// =============================================================================
// EarthSphere — Cinematic Scroll-Reactive Landing Page
// =============================================================================

"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Navbar } from "@/components/layout/Navbar";
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

  const scrollSmooth = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Data fetching
  const { data: rawEvents } = useEvents(EVENT_FILTERS);
  const { data: stats } = useEventStats(EVENT_FILTERS);
  const events = useMemo(() => (rawEvents?.events ? [...rawEvents.events] : EMPTY_EVENTS), [rawEvents]);

  // Coordinates focus target state for globe
  const [focusCoords, setFocusCoords] = useState<[number, number] | null>(null);

  // Map scroll progress to scenes visibility
  const opacityScene1 = useTransform(scrollSmooth, [0, 0.12, 0.16], [1, 1, 0]);
  const yScene1 = useTransform(scrollSmooth, [0, 0.16], [0, -50]);

  const opacityScene2 = useTransform(scrollSmooth, [0.12, 0.18, 0.3, 0.35], [0, 1, 1, 0]);
  const yScene2 = useTransform(scrollSmooth, [0.12, 0.18, 0.35], [50, 0, -50]);

  const opacityScene3 = useTransform(scrollSmooth, [0.3, 0.35, 0.52, 0.58], [0, 1, 1, 0]);
  const yScene3 = useTransform(scrollSmooth, [0.3, 0.35, 0.58], [50, 0, -50]);

  const opacityScene4 = useTransform(scrollSmooth, [0.52, 0.58, 0.72, 0.78], [0, 1, 1, 0]);
  
  const opacityScene5 = useTransform(scrollSmooth, [0.72, 0.78, 0.88, 0.93], [0, 1, 1, 0]);
  const yScene5 = useTransform(scrollSmooth, [0.72, 0.78, 0.93], [50, 0, -50]);

  const opacityScene6 = useTransform(scrollSmooth, [0.88, 0.93, 1.0], [0, 1, 1]);
  const yScene6 = useTransform(scrollSmooth, [0.88, 0.93], [50, 0]);

  // Handle timeline scroll-linked coordinates locking
  useEffect(() => {
    let lastFocusCoords: [number, number] | null = null;

    return scrollSmooth.on('change', (v) => {
      let targetCoords: [number, number] | null = null;

      // Timeline section is roughly between 52% and 72% scroll
      if (v >= 0.55 && v < 0.6) {
        targetCoords = LANDMARK_EVENTS[0].coords;
      } else if (v >= 0.6 && v < 0.66) {
        targetCoords = LANDMARK_EVENTS[1].coords;
      } else if (v >= 0.66 && v < 0.72) {
        targetCoords = LANDMARK_EVENTS[2].coords;
      }

      if (targetCoords !== lastFocusCoords) {
        lastFocusCoords = targetCoords;
        setFocusCoords(targetCoords);
      }
    });
  }, [scrollSmooth]);

  return (
    <div ref={containerRef} className="relative min-h-[650vh] bg-canvas text-white">
      <Navbar activeEventCount={stats?.totalActive} />

      {/* ── Fixed Backdrop Canvas Globe & Stars (interaction Layer) ──── */}
      <div className="fixed inset-0 z-[1] pointer-events-none flex items-center justify-center">
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
      </div>

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
          className="relative flex min-h-screen items-center justify-center px-6 text-center select-none"
        >
          <CTASection />
        </motion.section>
      </div>

      <Footer />
    </div>
  );
}
