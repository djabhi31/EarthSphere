"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "motion/react";
import { Menu, Radio, Bell, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ThemeCustomizer } from "@/components/features/ThemeCustomizer";
import { WatchlistPanel } from "@/components/features/WatchlistPanel";
import { AIBriefingModal } from "@/components/features/AIBriefingModal";
import { useEvents } from "@/hooks/useEvents";
import { audioSynth } from "@/lib/audio";

// ---------------------------------------------------------------------------
// Navbar – Premium glassmorphism navigation
// ---------------------------------------------------------------------------

interface NavbarProps {
  activeEventCount?: number;
}

interface NavLink {
  href: string;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Dashboard" },
  { href: "/events", label: "Events" },
  { href: "/map", label: "Map" },
  { href: "/analytics", label: "Analytics" },
  { href: "/about", label: "About" },
];

export function Navbar({ activeEventCount = 0 }: NavbarProps) {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const [aiBriefingOpen, setAiBriefingOpen] = useState(false);

  const { data: eventsData } = useEvents({ status: 'open' });
  const eventsList = eventsData?.events || [];

  // Scroll-based opacity
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.8]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.1]);

  const motionBgColor = useTransform(bgOpacity, (v: number) => `rgba(10, 14, 23, ${v})`);
  const motionBorderColor = useTransform(borderOpacity, (v: number) => `rgba(255, 255, 255, ${v})`);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      style={
        prefersReduced
          ? undefined
          : {
              backgroundColor: motionBgColor as unknown as string,
              borderBottomColor: motionBorderColor as unknown as string,
              borderBottomWidth: "1px",
            }
      }
    >
      <div
        className={cn(
          "absolute inset-0 backdrop-blur-xl",
          prefersReduced && "bg-black/60 border-b border-white/10",
        )}
        aria-hidden="true"
      />

      <nav
        className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Primary navigation"
      >
        {/* ── Logo ──────────────────────────────────────────────────── */}
        <Link 
          href="/" 
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4aa] rounded"
          onMouseEnter={() => audioSynth.playHover()}
          onClick={() => audioSynth.playClick()}
        >
          <span
            className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#00d4aa] to-[#7c3aed] bg-clip-text text-transparent"
            style={{ filter: "drop-shadow(0 0 12px rgba(0,212,170,0.3))" }}
          >
            EarthSphere
          </span>
          <span className="text-xs font-medium text-white/30">AI</span>
        </Link>

        {/* ── Desktop links ──────────────────────────────────────── */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-colors rounded-md",
                  active ? "text-white" : "text-white/50 hover:text-white/80",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4aa]",
                )}
                onMouseEnter={() => audioSynth.playHover()}
                onClick={() => audioSynth.playClick()}
              >
                {link.label}
                {/* Active underline indicator */}
                {active && !prefersReduced && (
                  <motion.span
                    layoutId="navbar-active"
                    className="absolute inset-x-1 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-[#00d4aa] to-[#7c3aed]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                {active && prefersReduced && (
                  <span className="absolute inset-x-1 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-[#00d4aa] to-[#7c3aed]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Right: Event count badge & Toggles ────────────── */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setAiBriefingOpen(true);
                audioSynth.playClick();
              }}
              className="p-2 text-electric-cyan hover:bg-electric-cyan/10 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4aa]"
              aria-label="Open AI Briefing"
              title="AI Disaster Intelligence Briefing"
            >
              <Cpu size={18} />
            </button>
            <button
              onClick={() => {
                setWatchlistOpen(true);
                audioSynth.playClick();
              }}
              className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4aa]"
              aria-label="Open Watchlist"
            >
              <Bell size={18} />
            </button>
            <ThemeCustomizer />
            <ThemeToggle />
            <SoundToggle />
          </div>

          {activeEventCount > 0 && (
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold tabular-nums text-emerald-400">
                {activeEventCount}
              </span>
              <span className="text-xs text-emerald-400/60">live</span>
            </div>
          )}

          {/* ── Mobile hamburger ─────────────────────────────────── */}
          <Sheet open={mobileOpen} onOpenChange={(open) => {
            setMobileOpen(open);
            audioSynth.playClick();
          }}>
            <SheetTrigger
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/5 hover:text-white md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4aa]"
              aria-label="Open navigation menu"
              onMouseEnter={() => audioSynth.playHover()}
            >
              <Menu size={22} />
            </SheetTrigger>
            <SheetContent side="right" className="pt-14">
              <VisuallyHidden.Root>
                <SheetTitle>Navigation Menu</SheetTitle>
              </VisuallyHidden.Root>
              <div className="flex flex-col gap-2">
                {NAV_LINKS.map((link, i) => {
                  const active = isActive(link.href);
                  const Comp = prefersReduced ? "div" : motion.div;
                  const motionProps = prefersReduced
                    ? {}
                    : {
                        initial: { opacity: 0, x: 20 },
                        animate: { opacity: 1, x: 0 },
                        transition: { delay: i * 0.07, duration: 0.3 },
                      };

                  return (
                    <Comp key={link.href} {...motionProps}>
                      <Link
                        href={link.href}
                        onClick={() => {
                          setMobileOpen(false);
                          audioSynth.playClick();
                        }}
                        onMouseEnter={() => audioSynth.playHover()}
                        className={cn(
                          "block rounded-lg px-4 py-3 text-base font-medium transition-colors",
                          active
                            ? "bg-white/10 text-white"
                            : "text-white/50 hover:bg-white/5 hover:text-white/80",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4aa]",
                        )}
                      >
                        {link.label}
                      </Link>
                    </Comp>
                  );
                })}
              </div>

              {/* Mobile live count */}
              {activeEventCount > 0 && (
                <div className="mt-6 flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
                  <Radio size={14} className="text-emerald-400" />
                  <span className="text-sm font-semibold tabular-nums text-emerald-400">
                    {activeEventCount} active events
                  </span>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <WatchlistPanel 
        isOpen={watchlistOpen} 
        onClose={() => setWatchlistOpen(false)} 
      />
      <AIBriefingModal
        events={eventsList}
        isOpen={aiBriefingOpen}
        onClose={() => setAiBriefingOpen(false)}
      />
    </motion.header>
  );
}
