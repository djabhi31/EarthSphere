"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll } from "motion/react";
import {
  Menu, Search, Bell, Cpu, ChevronDown,
  Globe, Flame, Mountain, CloudLightning,
  Telescope, Camera, Rocket, Star,
  Sun, Satellite, Beaker, LayoutDashboard,
  Image, Crosshair, Sparkles, Command,
  Compass, Orbit, Layers, Info
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
          "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wide transition-all rounded-full border",
          hasActiveChild
            ? "bg-[var(--electric-cyan)]/15 text-[var(--electric-cyan)] border-[var(--electric-cyan)]/40 shadow-[0_0_12px_rgba(0,212,170,0.25)] font-bold"
            : isOpen
            ? "bg-[var(--surface-elevated)] text-[var(--text-primary)] border-[var(--border-hover)]"
            : "text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]/70",
          "focus-visible:outline-none"
        )}
      >
        <span>{group.icon}</span>
        <span>{group.label}</span>
        {group.badge && (
          <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold rounded-full bg-[var(--electric-cyan)]/20 text-[var(--electric-cyan)] border border-[var(--electric-cyan)]/30">
            {group.badge}
          </span>
        )}
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
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 w-80"
          >
            <div className="rounded-2xl glass-strong border border-[var(--glass-border-strong)] p-2 shadow-2xl backdrop-blur-2xl bg-[var(--surface-primary)]/95 ring-1 ring-white/10">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border-subtle)] mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                  {group.icon}
                  {group.label} Hub
                </span>
                <span className="text-[9px] text-[var(--electric-cyan)] font-bold">NASA OPEN DATA</span>
              </div>

              <div className="space-y-1">
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
                        "group flex items-start gap-3 rounded-xl p-2.5 transition-all relative overflow-hidden",
                        active
                          ? "bg-gradient-to-r from-[var(--electric-cyan)]/20 to-[var(--cosmic-purple)]/10 text-[var(--text-primary)] border border-[var(--electric-cyan)]/30"
                          : "text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]/80 hover:text-[var(--text-primary)]"
                      )}
                    >
                      <div className={cn(
                        "mt-0.5 p-2 rounded-lg shrink-0 transition-transform duration-200 group-hover:scale-110",
                        active ? "bg-[var(--electric-cyan)]/20 shadow-sm" : "bg-[var(--surface-sunken)] border border-[var(--border-subtle)]"
                      )}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--electric-cyan)] transition-colors">
                            {item.label}
                          </span>
                          {item.tag && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[var(--surface-sunken)] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]">
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 leading-snug mt-0.5">
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
// Main Futuristic Executive Navbar Component
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
    <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-6 pt-3 max-w-7xl mx-auto">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative flex h-14 sm:h-16 items-center justify-between px-3.5 sm:px-5 rounded-full transition-all duration-300 border",
          scrolled
            ? "glass-strong bg-[var(--surface-primary)]/90 border-[var(--border-default)] shadow-[0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-2xl ring-1 ring-white/10"
            : "glass bg-[var(--surface-overlay)]/75 border-[var(--border-subtle)] backdrop-blur-xl shadow-xl"
        )}
        aria-label="Primary navigation"
      >
        {/* Futuristic Ambient Glow Rim */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--electric-cyan)]/10 via-transparent to-[var(--cosmic-purple)]/10 pointer-events-none" />

        {/* ── 1. Brand Logo ────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 group rounded-full px-2 py-1"
            onMouseEnter={() => audioSynth.playHover()}
            onClick={() => audioSynth.playClick()}
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[var(--electric-cyan)] via-[var(--electric-blue)] to-[var(--cosmic-purple)] p-[1.5px] shadow-[0_0_15px_rgba(0,212,170,0.35)] group-hover:scale-105 transition-transform duration-300">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[var(--space-black)]">
                <Globe className="h-4.5 w-4.5 text-[var(--electric-cyan)] animate-spin-slow" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="text-base font-extrabold tracking-tight bg-gradient-to-r from-[var(--text-primary)] via-[var(--text-primary)] to-[var(--electric-cyan)] bg-clip-text text-transparent drop-shadow-sm"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                EarthSphere
              </span>
              <span className="text-[9px] font-mono font-extrabold tracking-wider text-[var(--electric-cyan)] bg-[var(--electric-cyan)]/15 border border-[var(--electric-cyan)]/30 rounded-full px-2 py-0.5 shadow-sm">
                NASA
              </span>
            </div>
          </Link>
        </div>

        {/* ── 2. Desktop Navigation Center Dock ──────────────────────── */}
        <div className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--surface-sunken)]/60 border border-[var(--border-subtle)]">
          {DIRECT_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all rounded-full",
                  active
                    ? "text-[var(--text-primary)] bg-[var(--surface-elevated)] border border-[var(--border-hover)] shadow-sm font-bold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]/60"
                )}
                onMouseEnter={() => audioSynth.playHover()}
                onClick={() => audioSynth.playClick()}
              >
                <span className={active ? "text-[var(--electric-cyan)]" : "text-[var(--text-muted)]"}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
                {active && (
                  <motion.div
                    layoutId="nav-pill-active"
                    className="absolute inset-0 rounded-full border border-[var(--electric-cyan)]/40 bg-[var(--electric-cyan)]/10 shadow-[0_0_12px_rgba(0,212,170,0.18)] pointer-events-none"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                  />
                )}
              </Link>
            );
          })}

          <div className="h-3.5 w-px bg-[var(--border-default)] mx-1" />

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

        {/* ── 3. Right Action Dock & Controls ───────────────────────── */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Live Events Beacon */}
          {liveCount > 0 && (
            <Link
              href="/events"
              className="hidden xl:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs hover:bg-emerald-500/20 transition-all shadow-sm"
              title="Active Global Natural Events (EONET v3)"
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
            className="flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--surface-secondary)]/80 px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:border-[var(--electric-cyan)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-primary)] transition-all shadow-sm group"
            title="Search NASA APIs & Tools (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5 text-[var(--electric-cyan)] group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline font-medium">Search</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-full bg-[var(--surface-sunken)] px-1.5 py-0.5 text-[9px] font-mono text-[var(--text-muted)] border border-[var(--border-subtle)]">
              <Command className="h-2.5 w-2.5" /> K
            </kbd>
          </button>

          {/* Quick Tools Dock */}
          <div className="flex items-center gap-0.5 bg-[var(--surface-sunken)]/70 p-1 rounded-full border border-[var(--border-subtle)]">
            <button
              onClick={() => {
                setAiBriefingOpen(true);
                audioSynth.playClick();
              }}
              className="p-1.5 text-[var(--electric-cyan)] hover:bg-[var(--electric-cyan)]/15 rounded-full transition-colors relative group"
              aria-label="AI Intelligence Briefing"
              title="AI Disaster Briefing"
            >
              <Cpu size={16} className="group-hover:rotate-12 transition-transform" />
              <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-[var(--electric-cyan)] animate-pulse" />
            </button>
            <button
              onClick={() => {
                setWatchlistOpen(true);
                audioSynth.playClick();
              }}
              className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] rounded-full transition-colors"
              aria-label="Watchlist"
              title="Event Watchlist"
            >
              <Bell size={16} />
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
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)] lg:hidden border border-[var(--border-default)]"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </SheetTrigger>
            <SheetContent side="right" className="pt-12 bg-[var(--surface-primary)]/95 text-[var(--text-primary)] border-l border-[var(--border-default)] backdrop-blur-2xl overflow-y-auto w-80">
              <VisuallyHidden.Root>
                <SheetTitle>Navigation Menu</SheetTitle>
              </VisuallyHidden.Root>

              {/* Mobile Header Banner */}
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[var(--electric-cyan)]/10 via-[var(--cosmic-purple)]/10 to-transparent border border-[var(--electric-cyan)]/20">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[var(--electric-cyan)] animate-spin-slow" />
                  <span className="font-bold tracking-wider text-sm">EARTHSPHERE NASA HUB</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">Explore 13+ NASA Open APIs & real-time analytics.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] px-3 mb-1.5 font-bold">
                    Direct Navigation
                  </div>
                  <div className="space-y-1">
                    {DIRECT_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all",
                          isActive(link.href)
                            ? "bg-[var(--electric-cyan)]/15 text-[var(--electric-cyan)] border border-[var(--electric-cyan)]/30 font-bold"
                            : "text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]"
                        )}
                      >
                        <span className={isActive(link.href) ? "text-[var(--electric-cyan)]" : "text-[var(--text-muted)]"}>
                          {link.icon}
                        </span>
                        <span>{link.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {NAV_GROUPS.map((group) => (
                  <div key={group.label}>
                    <div className="flex items-center justify-between px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border-subtle)] mb-1">
                      <span className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                        {group.icon}
                        {group.label} Operations
                      </span>
                      {group.badge && (
                        <span className="px-1.5 py-0.2 text-[9px] font-mono rounded-full bg-[var(--electric-cyan)]/20 text-[var(--electric-cyan)] font-bold">
                          {group.badge}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-colors",
                            pathname.startsWith(item.href)
                              ? "bg-[var(--electric-cyan)]/10 text-[var(--electric-cyan)] font-semibold"
                              : "text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)]"
                          )}
                        >
                          <span className="shrink-0">{item.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="truncate font-semibold">{item.label}</div>
                            <div className="text-[10px] text-[var(--text-muted)] truncate">{item.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.nav>

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
