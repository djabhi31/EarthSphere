"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import {
  Menu, Search, Bell, Cpu, ChevronDown, X,
  Globe, Flame, Mountain, CloudLightning,
  Telescope, Camera, Rocket, Star,
  Sun, Satellite, Beaker, LayoutDashboard,
  Image, Crosshair, Sparkles, Command,
  Compass, Orbit, Layers, Info, ArrowRight
} from "lucide-react";
import { CommandPalette } from "@/components/ui/CommandPalette";
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
// Config & Types
// ---------------------------------------------------------------------------

interface NavbarProps {
  activeEventCount?: number;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  tag?: string;
}

interface NavGroup {
  label: string;
  badge?: string;
  icon: React.ReactNode;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Earth",
    badge: "Live",
    icon: <Globe size={14} className="text-[var(--electric-cyan)]" />,
    items: [
      { href: "/events", label: "EONET Events", icon: <CloudLightning size={16} className="text-amber-400" />, description: "Live natural disaster tracking", tag: "v3 API" },
      { href: "/map", label: "Interactive Event Map", icon: <Globe size={16} className="text-cyan-400" />, description: "Geospatial WebGL map engine", tag: "2D/3D" },
      { href: "/epic", label: "EPIC Earth Camera", icon: <Camera size={16} className="text-sky-400" />, description: "Full-disc imagery from DSCOVR", tag: "L1 Orbit" },
      { href: "/earth-imagery", label: "Landsat Satellite", icon: <Crosshair size={16} className="text-emerald-400" />, description: "High-res Earth observation photos", tag: "Landsat 8" },
    ],
  },
  {
    label: "Space",
    badge: "New",
    icon: <Rocket size={14} className="text-purple-400" />,
    items: [
      { href: "/apod", label: "Picture of the Day", icon: <Star size={16} className="text-yellow-400" />, description: "Daily curated astronomy photo", tag: "APOD" },
      { href: "/asteroids", label: "Near-Earth Asteroids", icon: <Crosshair size={16} className="text-orange-400" />, description: "JPL NeoWs close approach feed", tag: "NeoWs" },
      { href: "/fireballs", label: "Fireballs & Bolides", icon: <Flame size={16} className="text-rose-500" />, description: "Atmospheric fireball impact data", tag: "CNEOS" },
      { href: "/exoplanets", label: "Exoplanet Archive", icon: <Sparkles size={16} className="text-indigo-400" />, description: "Alien worlds catalog & discovery TAP", tag: "TAP" },
    ],
  },
  {
    label: "Mars",
    icon: <Mountain size={14} className="text-rose-400" />,
    items: [
      { href: "/mars", label: "Rover Photo Explorer", icon: <Camera size={16} className="text-rose-400" />, description: "Curiosity, Perseverance & Spirit", tag: "Rovers" },
    ],
  },
  {
    label: "Sun",
    badge: "DONKI",
    icon: <Sun size={14} className="text-amber-400" />,
    items: [
      { href: "/space-weather", label: "Space Weather HUD", icon: <Sun size={16} className="text-amber-400" />, description: "Solar flares, CMEs & geomagnetic storms", tag: "DONKI" },
    ],
  },
  {
    label: "Explore",
    icon: <Telescope size={14} className="text-cyan-400" />,
    items: [
      { href: "/media", label: "NASA Media Library", icon: <Image size={16} className="text-blue-400" />, description: "140,000+ photos, videos & audio", tag: "Archive" },
      { href: "/satellites", label: "Satellite Orbit Tracker", icon: <Satellite size={16} className="text-teal-400" />, description: "Two-Line Element (TLE) orbit tracking", tag: "NORAD" },
      { href: "/techport", label: "NASA Techport", icon: <Beaker size={16} className="text-emerald-400" />, description: "Active NASA technology R&D projects", tag: "R&D" },
    ],
  },
];

const DIRECT_LINKS = [
  { href: "/", label: "Home", icon: <Compass size={14} /> },
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={14} /> },
  { href: "/analytics", label: "Analytics", icon: <Orbit size={14} /> },
  { href: "/about", label: "About", icon: <Info size={14} /> },
];



// ---------------------------------------------------------------------------
// Main Premium Navbar Component
// ---------------------------------------------------------------------------

export function Navbar({ activeEventCount = 0 }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const [aiBriefingOpen, setAiBriefingOpen] = useState(false);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);

  const { data: eventsData } = useEvents({ status: "open" });
  const eventsList = eventsData?.events || [];
  const liveCount = activeEventCount || eventsList.length || 0;

  // ── Scroll-aware visibility ─────────────────────────────────────────
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
    const direction = latest > lastScrollY.current ? "down" : "up";
    // Only hide when scrolled down significantly, and always show near the top
    if (latest < 80) {
      setVisible(true);
    } else if (direction === "down" && latest - lastScrollY.current > 8) {
      setVisible(false);
      setActiveMenu(null); // Close dropdowns on hide
    } else if (direction === "up" && lastScrollY.current - latest > 4) {
      setVisible(true);
    }
    lastScrollY.current = latest;
  });

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-5 pt-2.5 sm:pt-3 pointer-events-none">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          y: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
        className={cn(
          "relative mx-auto flex h-14 sm:h-[60px] max-w-7xl items-center justify-between rounded-2xl px-3 sm:px-4 transition-all duration-500 pointer-events-auto",
          scrolled
            ? "navbar-glass-scrolled shadow-[0_8px_32px_rgba(0,0,0,0.25),0_2px_8px_rgba(0,0,0,0.15)]"
            : "navbar-glass-top shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
        )}
        aria-label="Primary navigation"
      >
        {/* ── Aurora accent line (top edge) ─────────────────────────── */}
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-[1px] rounded-t-2xl navbar-aurora-line transition-opacity duration-700",
            scrolled ? "opacity-100" : "opacity-0"
          )}
        />

        {/* ── 1. Brand Logo ────────────────────────────────────────── */}
        <div className="flex items-center shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 group rounded-xl px-1.5 py-1 -ml-1"
            onMouseEnter={() => audioSynth.playHover()}
            onClick={() => audioSynth.playClick()}
          >
            {/* Animated orbital logo */}
            <div className="relative flex h-9 w-9 items-center justify-center">
              {/* Outer orbital ring */}
              <div className="absolute inset-[-3px] rounded-full border border-[var(--electric-cyan)]/20 navbar-orbit group-hover:border-[var(--electric-cyan)]/40 transition-colors duration-500" />
              {/* Core glow container */}
              <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[var(--electric-cyan)]/20 via-[var(--electric-blue)]/10 to-[var(--cosmic-purple)]/15 group-hover:from-[var(--electric-cyan)]/30 group-hover:to-[var(--cosmic-purple)]/25 transition-all duration-500 shadow-[0_0_20px_rgba(0,212,170,0.15)] group-hover:shadow-[0_0_28px_rgba(0,212,170,0.3)]">
                <Globe className="h-4 w-4 text-[var(--electric-cyan)] animate-spin-slow group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span
                className="text-sm font-extrabold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--electric-cyan)] transition-colors duration-300"
                style={{ fontFamily: "var(--font-display)" }}
              >
                EarthSphere
              </span>
              <span className="hidden xl:inline text-[8px] font-mono font-bold tracking-[0.12em] text-[var(--electric-cyan)]/80 bg-[var(--electric-cyan)]/[0.08] border border-[var(--electric-cyan)]/15 rounded-md px-1.5 py-0.5 group-hover:bg-[var(--electric-cyan)]/15 group-hover:border-[var(--electric-cyan)]/30 transition-all duration-300">
                NASA
              </span>
            </div>
          </Link>
        </div>

        {/* ── 2. Desktop Navigation Center ─────────────────────────── */}
        <div className="hidden lg:flex items-center gap-0.5 px-1 py-1 rounded-xl bg-[var(--surface-sunken)]/40 border border-[var(--border-subtle)]">
          {DIRECT_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold tracking-wide transition-all duration-300 rounded-lg whitespace-nowrap",
                  active
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
                onMouseEnter={() => audioSynth.playHover()}
                onClick={() => audioSynth.playClick()}
              >
                <span
                  className={cn(
                    "transition-colors duration-300",
                    active ? "text-[var(--electric-cyan)]" : "text-[var(--text-muted)]"
                  )}
                >
                  {link.icon}
                </span>
                <span className="relative z-10">{link.label}</span>

                {/* Animated active indicator */}
                {active && (
                  <>
                    <motion.div
                      layoutId="nav-active-bg"
                      className="absolute inset-0 rounded-lg bg-[var(--surface-elevated)]/80 border border-[var(--border-hover)]/50"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
                    />
                    <motion.div
                      layoutId="nav-active-glow"
                      className="absolute -bottom-[1px] left-2 right-2 h-[2px] rounded-full navbar-aurora-line"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
                    />
                  </>
                )}
              </Link>
            );
          })}

          <div className="h-3.5 w-px bg-[var(--border-default)]/60 mx-0.5" />

          {/* ── Consolidated Explore Mega-Menu ─────────────────────── */}
          <div
            className="relative"
            onMouseEnter={() => {
              audioSynth.playHover();
              setActiveMenu("explore");
            }}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <button
              onClick={() => setActiveMenu(activeMenu === "explore" ? null : "explore")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold tracking-wide transition-all duration-300 rounded-lg relative group whitespace-nowrap",
                NAV_GROUPS.some(g => g.items.some(i => pathname.startsWith(i.href)))
                  ? "text-[var(--electric-cyan)] font-bold"
                  : activeMenu === "explore"
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--electric-cyan)]/40"
              )}
            >
              <Layers size={14} className="text-[var(--electric-cyan)] transition-transform duration-300 group-hover:scale-110" />
              <span>Explore</span>
              <ChevronDown
                size={11}
                className={cn(
                  "transition-transform duration-300 opacity-50",
                  activeMenu === "explore" && "rotate-180 opacity-100 text-[var(--electric-cyan)]"
                )}
              />
              <span className="absolute inset-0 rounded-lg bg-[var(--text-primary)]/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <AnimatePresence>
              {activeMenu === "explore" && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.96, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 8, scale: 0.97, filter: "blur(4px)" }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 top-full pt-3 z-50 w-[680px]"
                >
                  <div className="rounded-2xl border border-[var(--glass-border-strong)] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl bg-[var(--surface-primary)]/[0.95] ring-1 ring-white/[0.06]">
                    {/* Header */}
                    <div className="px-2 pb-2 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.12em] font-bold text-[var(--text-primary)]">
                        <Layers size={14} className="text-[var(--electric-cyan)]" />
                        NASA Mission Hub
                      </span>
                      <span className="text-[9px] font-mono tracking-wider text-[var(--electric-cyan)]/70 font-semibold">
                        13+ OPEN APIs
                      </span>
                    </div>
                    <div className="h-px navbar-aurora-line mb-3" />

                    {/* Custom Bento Layout */}
                    <div className="flex gap-4">
                      {/* Column 1: Earth & Mars */}
                      <div className="flex flex-col gap-4 flex-1 min-w-0">
                        {[NAV_GROUPS[0], NAV_GROUPS[2]].map((group, gi) => (
                          <motion.div
                            key={group.label}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: gi * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col p-2.5 rounded-xl bg-[var(--surface-sunken)]/40 border border-[var(--border-subtle)] hover:bg-[var(--surface-sunken)]/80 hover:border-[var(--electric-cyan)]/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 group/card"
                          >
                            <div className="flex items-center justify-between mb-2.5 border-b border-[var(--border-subtle)] pb-2 group-hover/card:border-[var(--electric-cyan)]/30 transition-colors duration-300 px-1">
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded-md bg-[var(--surface-secondary)] group-hover/card:bg-[var(--electric-cyan)]/10 group-hover/card:text-[var(--electric-cyan)] transition-colors duration-300">
                                  {group.icon}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--text-primary)]">
                                  {group.label}
                                </span>
                              </div>
                              {group.badge && (
                                <span className="px-1.5 py-0.5 text-[8px] font-mono font-bold rounded bg-[var(--electric-cyan)]/10 text-[var(--electric-cyan)] shadow-[0_0_8px_rgba(0,212,170,0.15)]">
                                  {group.badge}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              {group.items.map((item) => {
                                const active = pathname.startsWith(item.href);
                                return (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => {
                                      setActiveMenu(null);
                                      audioSynth.playClick();
                                    }}
                                    onMouseEnter={() => audioSynth.playHover()}
                                    className={cn(
                                      "group/item relative flex items-start gap-2.5 rounded-lg p-2 transition-all duration-200",
                                      active
                                        ? "bg-[var(--electric-cyan)]/10 text-[var(--electric-cyan)]"
                                        : "hover:bg-[var(--surface-primary)] hover:shadow-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                    )}
                                  >
                                    {active && (
                                      <motion.div
                                        layoutId="nav-explore-active"
                                        className="absolute left-0 top-[10%] w-[3px] h-[80%] bg-[var(--electric-cyan)] rounded-r-full shadow-[0_0_8px_var(--electric-cyan)]"
                                      />
                                    )}
                                    <span className={cn(
                                      "shrink-0 mt-0.5 transition-transform duration-300 group-hover/item:scale-110",
                                      active ? "text-[var(--electric-cyan)]" : "group-hover/item:text-[var(--electric-cyan)]"
                                    )}>
                                      {item.icon}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                      <div className="text-[11px] font-semibold truncate transition-colors duration-200">
                                        {item.label}
                                      </div>
                                      <div className="text-[9.5px] text-[var(--text-muted)] group-hover/item:text-[var(--text-secondary)] transition-colors duration-200 line-clamp-1 mt-[1px]">
                                        {item.description}
                                      </div>
                                    </div>
                                    {item.tag && (
                                      <span className="shrink-0 mt-1 pl-1 text-[8px] font-mono font-medium text-[var(--text-muted)]/60 group-hover/item:text-[var(--electric-cyan)]/70 transition-colors duration-300">
                                        {item.tag}
                                      </span>
                                    )}
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Column 2: Space & Sun */}
                      <div className="flex flex-col gap-4 flex-1 min-w-0">
                        {[NAV_GROUPS[1], NAV_GROUPS[3]].map((group, gi) => (
                          <motion.div
                            key={group.label}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + gi * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col p-2.5 rounded-xl bg-[var(--surface-sunken)]/40 border border-[var(--border-subtle)] hover:bg-[var(--surface-sunken)]/80 hover:border-[var(--electric-cyan)]/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 group/card"
                          >
                            <div className="flex items-center justify-between mb-2.5 border-b border-[var(--border-subtle)] pb-2 group-hover/card:border-[var(--electric-cyan)]/30 transition-colors duration-300 px-1">
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded-md bg-[var(--surface-secondary)] group-hover/card:bg-[var(--electric-cyan)]/10 group-hover/card:text-[var(--electric-cyan)] transition-colors duration-300">
                                  {group.icon}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--text-primary)]">
                                  {group.label}
                                </span>
                              </div>
                              {group.badge && (
                                <span className="px-1.5 py-0.5 text-[8px] font-mono font-bold rounded bg-[var(--electric-cyan)]/10 text-[var(--electric-cyan)] shadow-[0_0_8px_rgba(0,212,170,0.15)]">
                                  {group.badge}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              {group.items.map((item) => {
                                const active = pathname.startsWith(item.href);
                                return (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => {
                                      setActiveMenu(null);
                                      audioSynth.playClick();
                                    }}
                                    onMouseEnter={() => audioSynth.playHover()}
                                    className={cn(
                                      "group/item relative flex items-start gap-2.5 rounded-lg p-2 transition-all duration-200",
                                      active
                                        ? "bg-[var(--electric-cyan)]/10 text-[var(--electric-cyan)]"
                                        : "hover:bg-[var(--surface-primary)] hover:shadow-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                    )}
                                  >
                                    {active && (
                                      <motion.div
                                        layoutId="nav-explore-active"
                                        className="absolute left-0 top-[10%] w-[3px] h-[80%] bg-[var(--electric-cyan)] rounded-r-full shadow-[0_0_8px_var(--electric-cyan)]"
                                      />
                                    )}
                                    <span className={cn(
                                      "shrink-0 mt-0.5 transition-transform duration-300 group-hover/item:scale-110",
                                      active ? "text-[var(--electric-cyan)]" : "group-hover/item:text-[var(--electric-cyan)]"
                                    )}>
                                      {item.icon}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                      <div className="text-[11px] font-semibold truncate transition-colors duration-200">
                                        {item.label}
                                      </div>
                                      <div className="text-[9.5px] text-[var(--text-muted)] group-hover/item:text-[var(--text-secondary)] transition-colors duration-200 line-clamp-1 mt-[1px]">
                                        {item.description}
                                      </div>
                                    </div>
                                    {item.tag && (
                                      <span className="shrink-0 mt-1 pl-1 text-[8px] font-mono font-medium text-[var(--text-muted)]/60 group-hover/item:text-[var(--electric-cyan)]/70 transition-colors duration-300">
                                        {item.tag}
                                      </span>
                                    )}
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Column 3: Explore & Featured Card */}
                      <div className="flex flex-col gap-4 flex-1 min-w-0">
                        {/* Explore Group */}
                        {[NAV_GROUPS[4]].map((group, gi) => (
                          <motion.div
                            key={group.label}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + gi * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col p-2.5 rounded-xl bg-[var(--surface-sunken)]/40 border border-[var(--border-subtle)] hover:bg-[var(--surface-sunken)]/80 hover:border-[var(--electric-cyan)]/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 group/card"
                          >
                            <div className="flex items-center justify-between mb-2.5 border-b border-[var(--border-subtle)] pb-2 group-hover/card:border-[var(--electric-cyan)]/30 transition-colors duration-300 px-1">
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded-md bg-[var(--surface-secondary)] group-hover/card:bg-[var(--electric-cyan)]/10 group-hover/card:text-[var(--electric-cyan)] transition-colors duration-300">
                                  {group.icon}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--text-primary)]">
                                  {group.label}
                                </span>
                              </div>
                              {group.badge && (
                                <span className="px-1.5 py-0.5 text-[8px] font-mono font-bold rounded bg-[var(--electric-cyan)]/10 text-[var(--electric-cyan)] shadow-[0_0_8px_rgba(0,212,170,0.15)]">
                                  {group.badge}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              {group.items.map((item) => {
                                const active = pathname.startsWith(item.href);
                                return (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => {
                                      setActiveMenu(null);
                                      audioSynth.playClick();
                                    }}
                                    onMouseEnter={() => audioSynth.playHover()}
                                    className={cn(
                                      "group/item relative flex items-start gap-2.5 rounded-lg p-2 transition-all duration-200",
                                      active
                                        ? "bg-[var(--electric-cyan)]/10 text-[var(--electric-cyan)]"
                                        : "hover:bg-[var(--surface-primary)] hover:shadow-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                    )}
                                  >
                                    {active && (
                                      <motion.div
                                        layoutId="nav-explore-active"
                                        className="absolute left-0 top-[10%] w-[3px] h-[80%] bg-[var(--electric-cyan)] rounded-r-full shadow-[0_0_8px_var(--electric-cyan)]"
                                      />
                                    )}
                                    <span className={cn(
                                      "shrink-0 mt-0.5 transition-transform duration-300 group-hover/item:scale-110",
                                      active ? "text-[var(--electric-cyan)]" : "group-hover/item:text-[var(--electric-cyan)]"
                                    )}>
                                      {item.icon}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                      <div className="text-[11px] font-semibold truncate transition-colors duration-200">
                                        {item.label}
                                      </div>
                                      <div className="text-[9.5px] text-[var(--text-muted)] group-hover/item:text-[var(--text-secondary)] transition-colors duration-200 line-clamp-1 mt-[1px]">
                                        {item.description}
                                      </div>
                                    </div>
                                    {item.tag && (
                                      <span className="shrink-0 mt-1 pl-1 text-[8px] font-mono font-medium text-[var(--text-muted)]/60 group-hover/item:text-[var(--electric-cyan)]/70 transition-colors duration-300">
                                        {item.tag}
                                      </span>
                                    )}
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        ))}

                        {/* Featured Live Telemetry Card */}
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="mt-1 flex-1 min-h-[140px] rounded-xl bg-gradient-to-br from-[var(--electric-cyan)]/20 to-[var(--cosmic-purple)]/20 border border-[var(--electric-cyan)]/30 relative overflow-hidden group/feat hover:shadow-[0_0_30px_rgba(0,212,170,0.15)] transition-all duration-500"
                        >
                          {/* Noise texture overlay */}
                          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
                          {/* Gradient fade */}
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/60 z-0"></div>
                          {/* Animated globe bg icon */}
                          <Globe className="absolute -bottom-4 -right-4 h-24 w-24 text-[var(--electric-cyan)]/20 animate-spin-slow group-hover/feat:text-[var(--electric-cyan)]/30 group-hover/feat:scale-110 transition-all duration-700 z-0" />
                          
                          <div className="relative z-10 flex flex-col items-start p-3.5 h-full justify-end">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-ping opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                              </span>
                              <span className="text-[9px] font-mono font-bold text-emerald-400 tracking-widest uppercase">System Nominal</span>
                            </div>
                            <h4 className="text-[13px] font-bold text-white mb-1 group-hover/feat:text-[var(--electric-cyan)] transition-colors drop-shadow-md">NASA EONET v3.0</h4>
                            <p className="text-[10px] text-white/80 mb-3 line-clamp-2 drop-shadow-sm font-medium">Real-time planetary telemetry & global natural event tracking powered by AI.</p>
                            <Link 
                              href="/events" 
                              onClick={() => { setActiveMenu(null); audioSynth.playClick(); }}
                              className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--electric-cyan)] bg-[var(--electric-cyan)]/10 border border-[var(--electric-cyan)]/20 px-2.5 py-1 rounded-md hover:bg-[var(--electric-cyan)]/20 hover:border-[var(--electric-cyan)]/40 transition-colors shadow-sm"
                            >
                              Open Tracker <ArrowRight size={10} className="group-hover/feat:translate-x-0.5 transition-transform" />
                            </Link>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── 3. Right Action Dock ─────────────────────────────────── */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Live Events Beacon */}
          {liveCount > 0 && (
            <Link
              href="/events"
              className="hidden 2xl:flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] transition-all duration-300 group navbar-live-beacon"
              title="Active Global Natural Events (EONET v3)"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 navbar-beacon-ping" />
                <span className="absolute inline-flex h-[200%] w-[200%] -left-1/2 -top-1/2 rounded-full border border-emerald-400/30 navbar-beacon-ring" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              </span>
              <span className="font-mono font-bold text-emerald-400 text-[11px] tabular-nums group-hover:text-emerald-300 transition-colors">
                {liveCount} LIVE
              </span>
            </Link>
          )}

          {/* Search Trigger */}
          <button
            onClick={() => {
              setCmdPaletteOpen(true);
              audioSynth.playClick();
            }}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border-default)]/60 bg-[var(--surface-secondary)]/50 px-2 py-1.5 text-[11px] text-[var(--text-secondary)] hover:border-[var(--electric-cyan)]/40 hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] hover:shadow-[0_0_16px_rgba(0,212,170,0.08)] transition-all duration-300 group"
            title="Search NASA APIs & Tools (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5 text-[var(--electric-cyan)] group-hover:scale-110 transition-transform duration-200" />
            <span className="hidden xl:inline font-medium">Search</span>
            <kbd className="hidden xl:inline-flex items-center gap-0.5 rounded-md bg-[var(--surface-sunken)] px-1.5 py-0.5 text-[9px] font-mono text-[var(--text-muted)] border border-[var(--border-subtle)]">
              <Command className="h-2.5 w-2.5" /> K
            </kbd>
          </button>

          {/* Quick Tools Dock */}
          <div className="flex items-center gap-0.5 bg-[var(--surface-sunken)]/40 p-0.5 rounded-lg border border-[var(--border-subtle)]">
            <button
              onClick={() => {
                setAiBriefingOpen(true);
                audioSynth.playClick();
              }}
              className="relative p-1.5 text-[var(--electric-cyan)] hover:bg-[var(--electric-cyan)]/10 rounded-lg transition-all duration-300 group"
              aria-label="AI Intelligence Briefing"
              title="AI Disaster Briefing"
            >
              <Cpu size={14} className="group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[var(--electric-cyan)] shadow-[0_0_6px_var(--electric-cyan)] animate-pulse" />
            </button>
            <button
              onClick={() => {
                setWatchlistOpen(true);
                audioSynth.playClick();
              }}
              className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]/60 rounded-lg transition-all duration-300 group"
              aria-label="Watchlist"
              title="Event Watchlist"
            >
              <Bell size={14} className="group-hover:scale-110 transition-transform duration-200" />
            </button>

            <ThemeCustomizer />
            <ThemeToggle />
            <SoundToggle />
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet
            open={mobileOpen}
            onOpenChange={(open) => {
              setMobileOpen(open);
              audioSynth.playClick();
            }}
          >
            <SheetTrigger
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-all duration-300 hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)] hover:scale-105 lg:hidden border border-[var(--border-default)]/60"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="pt-10 bg-[var(--surface-primary)]/[0.96] text-[var(--text-primary)] border-l border-[var(--border-default)] backdrop-blur-2xl overflow-y-auto w-[320px] sm:w-[360px]"
            >
              <VisuallyHidden.Root>
                <SheetTitle>Navigation Menu</SheetTitle>
              </VisuallyHidden.Root>

              {/* Mobile Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-[var(--electric-cyan)]/[0.06] via-[var(--cosmic-purple)]/[0.04] to-transparent border border-[var(--border-subtle)]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--electric-cyan)]/10">
                    <Globe className="h-4 w-4 text-[var(--electric-cyan)] animate-spin-slow" />
                  </div>
                  <div>
                    <span className="font-bold tracking-wide text-sm block">EarthSphere</span>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">NASA Data Explorer</span>
                  </div>
                </div>
              </motion.div>

              <div className="space-y-5">
                {/* Direct Navigation */}
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--text-muted)] px-3 mb-2 font-bold">
                    Navigation
                  </div>
                  <div className="space-y-0.5">
                    {DIRECT_LINKS.map((link, i) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-200",
                            isActive(link.href)
                              ? "bg-[var(--electric-cyan)]/10 text-[var(--electric-cyan)]"
                              : "text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]"
                          )}
                        >
                          <span className={isActive(link.href) ? "text-[var(--electric-cyan)]" : "text-[var(--text-muted)]"}>
                            {link.icon}
                          </span>
                          <span>{link.label}</span>
                          {isActive(link.href) && (
                            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--electric-cyan)] shadow-[0_0_6px_var(--electric-cyan)]" />
                          )}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Grouped Navigation with Accordions */}
                {NAV_GROUPS.map((group, gi) => {
                  const isAccordionOpen = mobileAccordion === group.label;
                  return (
                    <motion.div
                      key={group.label}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + gi * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {/* Accordion header */}
                      <button
                        onClick={() => setMobileAccordion(isAccordionOpen ? null : group.label)}
                        className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <span className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
                          {group.icon}
                          {group.label}
                        </span>
                        <div className="flex items-center gap-2">
                          {group.badge && (
                            <span className="px-1.5 py-0.5 text-[9px] font-mono rounded-md bg-[var(--electric-cyan)]/10 text-[var(--electric-cyan)] font-bold">
                              {group.badge}
                            </span>
                          )}
                          <ChevronDown
                            size={12}
                            className={cn(
                              "transition-transform duration-300",
                              isAccordionOpen && "rotate-180"
                            )}
                          />
                        </div>
                      </button>

                      {/* Accent bar */}
                      <div className="mx-3 h-px bg-[var(--border-subtle)] mb-1" />

                      {/* Accordion content */}
                      <AnimatePresence>
                        {isAccordionOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-0.5 pt-1 pb-2">
                              {group.items.map((item, ii) => (
                                <motion.div
                                  key={item.href}
                                  initial={{ opacity: 0, x: -12 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: ii * 0.04, duration: 0.25 }}
                                >
                                  <Link
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                                      pathname.startsWith(item.href)
                                        ? "bg-[var(--electric-cyan)]/[0.08] text-[var(--electric-cyan)] font-semibold"
                                        : "text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]"
                                    )}
                                  >
                                    <span className="shrink-0">{item.icon}</span>
                                    <div className="flex-1 min-w-0">
                                      <div className="truncate font-semibold">{item.label}</div>
                                      <div className="text-[10px] text-[var(--text-muted)] truncate">{item.description}</div>
                                    </div>
                                    {pathname.startsWith(item.href) && (
                                      <div className="h-1.5 w-1.5 rounded-full bg-[var(--electric-cyan)] shadow-[0_0_6px_var(--electric-cyan)] shrink-0" />
                                    )}
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.nav>

      {/* Modals & Watchlist */}
      <div className="pointer-events-auto">
        <WatchlistPanel
          isOpen={watchlistOpen}
          onClose={() => setWatchlistOpen(false)}
        />
        <AIBriefingModal
          events={eventsList}
          isOpen={aiBriefingOpen}
          onClose={() => setAiBriefingOpen(false)}
        />
        <CommandPalette
          isOpen={cmdPaletteOpen}
          onClose={() => setCmdPaletteOpen(false)}
        />
      </div>
    </header>
  );
}
