"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, AnimatePresence } from "motion/react";
import {
  Menu, Search, Bell, Cpu, ChevronDown,
  Globe, Flame, Mountain, CloudLightning,
  Telescope, Camera, Rocket, Star,
  Sun, Satellite, Beaker, LayoutDashboard,
  Image, Crosshair, Sparkles, Radio, Command,
  Compass, Orbit, SlidersHorizontal
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
// Config
// ---------------------------------------------------------------------------

interface NavbarProps {
  activeEventCount?: number;
}

interface NavGroup {
  label: string;
  icon: React.ReactNode;
  items: { href: string; label: string; icon: React.ReactNode; description: string }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Earth",
    icon: <Globe size={14} className="text-emerald-400" />,
    items: [
      { href: "/events", label: "EONET Events", icon: <CloudLightning size={16} className="text-amber-400" />, description: "Real-time natural events tracking" },
      { href: "/map", label: "Interactive Event Map", icon: <Globe size={16} className="text-cyan-400" />, description: "Geospatial 2D/3D event engine" },
      { href: "/epic", label: "EPIC Earth Camera", icon: <Camera size={16} className="text-sky-400" />, description: "Full-disc images from DSCOVR at L1" },
      { href: "/earth-imagery", label: "Landsat Satellite", icon: <Crosshair size={16} className="text-emerald-400" />, description: "High-res Earth observation photos" },
    ],
  },
  {
    label: "Space",
    icon: <Rocket size={14} className="text-purple-400" />,
    items: [
      { href: "/apod", label: "Picture of the Day", icon: <Star size={16} className="text-yellow-400" />, description: "Daily curated astronomy photo" },
      { href: "/asteroids", label: "Near-Earth Asteroids", icon: <Crosshair size={16} className="text-orange-400" />, description: "JPL NeoWs close approach feed" },
      { href: "/fireballs", label: "Fireballs & Bolides", icon: <Flame size={16} className="text-rose-500" />, description: "Atmospheric fireball impact data" },
      { href: "/exoplanets", label: "Exoplanet Archive", icon: <Sparkles size={16} className="text-indigo-400" />, description: "Alien worlds catalog & discovery TAP" },
    ],
  },
  {
    label: "Mars",
    icon: <Mountain size={14} className="text-rose-400" />,
    items: [
      { href: "/mars", label: "Rover Photos", icon: <Camera size={16} className="text-rose-400" />, description: "Curiosity, Perseverance & Opportunity" },
    ],
  },
  {
    label: "Sun",
    icon: <Sun size={14} className="text-amber-400" />,
    items: [
      { href: "/space-weather", label: "Space Weather HUD", icon: <Sun size={16} className="text-amber-400" />, description: "Solar flares, CMEs & geomagnetic storms" },
    ],
  },
  {
    label: "Explore",
    icon: <Telescope size={14} className="text-cyan-400" />,
    items: [
      { href: "/media", label: "NASA Media Library", icon: <Image size={16} className="text-blue-400" />, description: "140,000+ photos, videos & audio" },
      { href: "/satellites", label: "Satellite Orbit Tracker", icon: <Satellite size={16} className="text-teal-400" />, description: "Two-Line Element (TLE) orbit tracking" },
      { href: "/techport", label: "NASA Techport", icon: <Beaker size={16} className="text-emerald-400" />, description: "Active NASA technology R&D projects" },
    ],
  },
];

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/analytics", label: "Analytics" },
];

// ---------------------------------------------------------------------------
// Mega Menu Dropdown Component
// ---------------------------------------------------------------------------

function MegaMenuDropdown({
  group,
  isOpen,
  onOpen,
  onClose
}: {
  group: NavGroup;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const hasActiveChild = group.items.some((item) => pathname.startsWith(item.href));

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        audioSynth.playHover();
        onOpen();
      }}
      onMouseLeave={onClose}
    >
      <button
        onClick={() => (isOpen ? onClose() : onOpen())}
        className={cn(
          "flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold transition-all rounded-lg border",
          hasActiveChild
            ? "bg-[var(--electric-cyan)]/15 text-[var(--electric-cyan)] border-[var(--electric-cyan)]/40 shadow-[0_0_10px_rgba(0,212,170,0.2)]"
            : isOpen
            ? "bg-[var(--surface-elevated)] text-[var(--text-primary)] border-[var(--border-hover)]"
            : "text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]/70",
          "focus-visible:outline-none"
        )}
      >
        <span>{group.icon}</span>
        <span>{group.label}</span>
        <ChevronDown
          size={12}
          className={cn(
            "transition-transform duration-200 opacity-60",
            isOpen && "rotate-180 opacity-100 text-[var(--electric-cyan)]"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 w-72"
          >
            <div className="rounded-2xl glass-strong border border-[var(--glass-border-strong)] p-2 shadow-2xl backdrop-blur-2xl bg-[var(--surface-primary)]/95 ring-1 ring-white/10">
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border-subtle)] mb-1 flex items-center justify-between">
                <span>{group.label} Hub</span>
                <span className="text-[9px] text-[var(--electric-cyan)] font-bold">NASA DATA</span>
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        onClose();
                        audioSynth.playClick();
                      }}
                      onMouseEnter={() => audioSynth.playHover()}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-xl p-2 transition-all",
                        active
                          ? "bg-[var(--electric-cyan)]/15 text-[var(--text-primary)] border border-[var(--electric-cyan)]/30"
                          : "text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]"
                      )}
                    >
                      <div className={cn(
                        "p-1.5 rounded-lg shrink-0",
                        active ? "bg-[var(--electric-cyan)]/20" : "bg-[var(--surface-sunken)]"
                      )}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--electric-cyan)] transition-colors truncate">
                          {item.label}
                        </div>
                        <p className="text-[10px] text-[var(--text-muted)] truncate">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Navbar Component
// ---------------------------------------------------------------------------

export function Navbar({ activeEventCount = 0 }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const [aiBriefingOpen, setAiBriefingOpen] = useState(false);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const { data: eventsData } = useEvents({ status: 'open' });
  const eventsList = eventsData?.events || [];
  const liveCount = activeEventCount || eventsList.length || 0;

  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setScrolled(latest > 20);
    });
  }, [scrollY]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-2 sm:px-4 pt-2.5 max-w-7xl mx-auto">
      <nav
        className={cn(
          "relative flex h-14 items-center justify-between px-3 sm:px-4 rounded-2xl transition-all duration-300 border",
          scrolled
            ? "glass-strong bg-[var(--surface-primary)]/90 border-[var(--border-default)] shadow-2xl backdrop-blur-2xl"
            : "glass bg-[var(--surface-overlay)]/75 border-[var(--border-subtle)] backdrop-blur-xl shadow-lg"
        )}
        aria-label="Primary navigation"
      >
        {/* ── Brand Logo ────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 group rounded-xl"
            onMouseEnter={() => audioSynth.playHover()}
            onClick={() => audioSynth.playClick()}
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[var(--electric-cyan)] via-[var(--electric-blue)] to-[var(--cosmic-purple)] p-[1.5px] shadow-[0_0_12px_rgba(0,212,170,0.3)] group-hover:scale-105 transition-transform">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[var(--space-black)]">
                <Globe className="h-4 w-4 text-[var(--electric-cyan)] animate-spin-slow" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="text-base font-extrabold tracking-tight bg-gradient-to-r from-[var(--electric-cyan)] via-white to-[var(--cosmic-purple)] bg-clip-text text-transparent drop-shadow-sm"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                EarthSphere
              </span>
              <span className="text-[10px] font-bold text-[var(--electric-cyan)] bg-[var(--electric-cyan)]/15 border border-[var(--electric-cyan)]/30 rounded px-1 py-0.2">
                AI
              </span>
            </div>
          </Link>
        </div>

        {/* ── Desktop Nav Center ────────────────────────────────────── */}
        <div className="hidden lg:flex items-center gap-1 px-1.5 py-1 rounded-xl bg-[var(--surface-sunken)]/60 border border-[var(--border-subtle)]">
          {QUICK_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold tracking-wide transition-all rounded-lg",
                  active
                    ? "text-[var(--electric-cyan)] bg-[var(--surface-elevated)] border border-[var(--electric-cyan)]/30 shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]/60"
                )}
                onMouseEnter={() => audioSynth.playHover()}
                onClick={() => audioSynth.playClick()}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="h-3 w-px bg-[var(--border-default)] mx-1" />

          {NAV_GROUPS.map((group) => (
            <MegaMenuDropdown
              key={group.label}
              group={group}
              isOpen={activeMenu === group.label}
              onOpen={() => setActiveMenu(group.label)}
              onClose={() => setActiveMenu(null)}
            />
          ))}
        </div>

        {/* ── Right Controls Dock ───────────────────────────────────── */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Live Indicator */}
          {liveCount > 0 && (
            <Link
              href="/events"
              className="hidden md:flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs hover:bg-emerald-500/20 transition-all"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-mono font-bold text-emerald-400 text-[11px] tabular-nums">
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
            className="flex items-center gap-1.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-secondary)]/80 px-2.5 py-1 text-xs text-[var(--text-secondary)] hover:border-[var(--electric-cyan)] hover:text-[var(--text-primary)] transition-all"
            title="Search NASA APIs (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5 text-[var(--electric-cyan)]" />
            <span className="hidden sm:inline font-medium">Search</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-[var(--surface-sunken)] px-1 py-0.2 text-[9px] font-mono text-[var(--text-muted)] border border-[var(--border-subtle)]">
              Ctrl K
            </kbd>
          </button>

          {/* Quick Tools Pill */}
          <div className="flex items-center gap-0.5 bg-[var(--surface-sunken)] p-0.5 rounded-xl border border-[var(--border-subtle)]">
            <button
              onClick={() => {
                setAiBriefingOpen(true);
                audioSynth.playClick();
              }}
              className="p-1.5 text-[var(--electric-cyan)] hover:bg-[var(--electric-cyan)]/15 rounded-lg transition-colors relative"
              aria-label="AI Intelligence Briefing"
              title="AI Intelligence Briefing"
            >
              <Cpu size={15} />
            </button>
            <button
              onClick={() => {
                setWatchlistOpen(true);
                audioSynth.playClick();
              }}
              className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] rounded-lg transition-colors"
              aria-label="Watchlist"
              title="Event Watchlist"
            >
              <Bell size={15} />
            </button>

            <ThemeCustomizer />
            <ThemeToggle />
            <SoundToggle />
          </div>

          {/* Mobile Hamburger Menu Trigger */}
          <Sheet open={mobileOpen} onOpenChange={(open) => {
            setMobileOpen(open);
            audioSynth.playClick();
          }}>
            <SheetTrigger
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)] lg:hidden border border-[var(--border-default)]"
              aria-label="Open menu"
            >
              <Menu size={16} />
            </SheetTrigger>
            <SheetContent side="right" className="pt-12 bg-[var(--surface-primary)] text-[var(--text-primary)] border-l border-[var(--border-default)] overflow-y-auto w-80">
              <VisuallyHidden.Root>
                <SheetTitle>Navigation Menu</SheetTitle>
              </VisuallyHidden.Root>

              {/* Mobile Menu Contents */}
              <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-[var(--electric-cyan)]/10 via-[var(--cosmic-purple)]/10 to-transparent border border-[var(--electric-cyan)]/20">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[var(--electric-cyan)]" />
                  <span className="font-bold text-xs">EARTHSPHERE NASA DATA</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] px-2">Main Menu</div>
                {QUICK_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-xs font-semibold transition-all",
                      isActive(link.href)
                        ? "bg-[var(--electric-cyan)]/15 text-[var(--electric-cyan)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)]"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                {NAV_GROUPS.map((group) => (
                  <div key={group.label} className="pt-2">
                    <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border-subtle)] mb-1">
                      {group.icon}
                      <span>{group.label}</span>
                    </div>
                    <div className="space-y-0.5">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors",
                            pathname.startsWith(item.href)
                              ? "bg-[var(--electric-cyan)]/10 text-[var(--electric-cyan)] font-semibold"
                              : "text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)]"
                          )}
                        >
                          <span className="shrink-0">{item.icon}</span>
                          <span className="truncate">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Modals & Watchlist */}
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
    </header>
  );
}
