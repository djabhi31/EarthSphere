"use client";

import Link from "next/link";
import {
  Globe, Heart, ArrowUp, ExternalLink,
  Sparkles, Radio, ShieldCheck, Cpu,
  Rocket, Mountain, Sun, Telescope, Crosshair
} from "lucide-react";
import { audioSynth } from "@/lib/audio";

// ---------------------------------------------------------------------------
// Footer Configuration
// ---------------------------------------------------------------------------

const EARTH_LINKS = [
  { href: "/about", label: "About EarthSphere & Creator" },
  { href: "/events", label: "EONET Live Events" },
  { href: "/map", label: "Interactive Event Map" },
  { href: "/epic", label: "EPIC Earth Camera" },
  { href: "/earth-imagery", label: "Landsat Satellite Photos" },
];

const SPACE_LINKS = [
  { href: "/apod", label: "Astronomy Picture of the Day" },
  { href: "/asteroids", label: "Near-Earth Asteroids" },
  { href: "/fireballs", label: "Fireballs & Bolides" },
  { href: "/exoplanets", label: "Exoplanet Archive" },
];

const MARS_SOLAR_LINKS = [
  { href: "/mars", label: "Mars Rover Explorer" },
  { href: "/space-weather", label: "DONKI Space Weather" },
  { href: "/satellites", label: "Satellite Orbit Tracker" },
  { href: "/techport", label: "NASA Techport R&D" },
  { href: "/media", label: "NASA Media Library" },
];

const OFFICIAL_DATA_SOURCES = [
  { label: "NASA Open Data Portal", url: "https://api.nasa.gov/" },
  { label: "NASA EONET v3", url: "https://eonet.gsfc.nasa.gov/" },
  { label: "JPL Solar System Dynamics", url: "https://ssd.jpl.nasa.gov/" },
  { label: "NASA Goddard Space Flight", url: "https://www.nasa.gov/goddard" },
  { label: "NOAA & USGS Earth Observation", url: "https://www.usgs.gov/" },
];

// ---------------------------------------------------------------------------
// Main Futuristic Footer Component
// ---------------------------------------------------------------------------

export function Footer() {
  const scrollToTop = () => {
    audioSynth.playClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-20 mt-auto border-t border-[var(--border-subtle)] bg-[var(--surface-primary)]/90 backdrop-blur-2xl text-[var(--text-primary)]">
      {/* Top Animated Neon Beam Rim */}
      <div
        className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--electric-cyan)] to-transparent opacity-60"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-[var(--border-subtle)]">
          {/* ── 1. Brand Column ───────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group rounded-full"
              onMouseEnter={() => audioSynth.playHover()}
              onClick={() => audioSynth.playClick()}
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[var(--electric-cyan)] via-[var(--electric-blue)] to-[var(--cosmic-purple)] p-[1.5px] shadow-[0_0_12px_rgba(0,212,170,0.35)] group-hover:scale-105 transition-transform">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[var(--space-black)]">
                  <Globe className="h-4 w-4 text-[var(--electric-cyan)] animate-spin-slow" />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-[var(--text-primary)] via-[var(--text-primary)] to-[var(--electric-cyan)] bg-clip-text text-transparent"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  EarthSphere
                </span>
                <span className="text-[9px] font-mono font-extrabold tracking-wider text-[var(--electric-cyan)] bg-[var(--electric-cyan)]/15 border border-[var(--electric-cyan)]/30 rounded-full px-2 py-0.5 shadow-sm">
                  NASA
                </span>
              </div>
            </Link>

            <p className="text-xs leading-relaxed text-[var(--text-secondary)] max-w-sm">
              An advanced real-time Earth event intelligence and space exploration platform. Powered by 13+ official NASA Open APIs, geospatial WebGL mapping, and AI disaster analytics.
            </p>

            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-mono text-[11px] text-emerald-400 font-semibold">
                13+ NASA APIs Operational
              </span>
            </div>
          </div>

          {/* ── 2. Earth Navigation ───────────────────────────────────── */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-1.5">
              <Globe size={13} className="text-emerald-400" />
              Earth Operations
            </h3>
            <ul className="space-y-2 text-xs">
              {EARTH_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => audioSynth.playClick()}
                    onMouseEnter={() => audioSynth.playHover()}
                    className="text-[var(--text-secondary)] transition-colors hover:text-[var(--electric-cyan)] flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── 3. Space & Universe ──────────────────────────────────── */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-1.5">
              <Rocket size={13} className="text-purple-400" />
              Space & Cosmos
            </h3>
            <ul className="space-y-2 text-xs">
              {SPACE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => audioSynth.playClick()}
                    onMouseEnter={() => audioSynth.playHover()}
                    className="text-[var(--text-secondary)] transition-colors hover:text-[var(--electric-cyan)] flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── 4. Mars & Solar System ────────────────────────────────── */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-1.5">
              <Telescope size={13} className="text-cyan-400" />
              Mars & Beyond
            </h3>
            <ul className="space-y-2 text-xs">
              {MARS_SOLAR_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => audioSynth.playClick()}
                    onMouseEnter={() => audioSynth.playHover()}
                    className="text-[var(--text-secondary)] transition-colors hover:text-[var(--electric-cyan)] flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Official NASA Data Providers Row ────────────────────────── */}
        <div className="py-6 border-b border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider font-mono">
            Data Providers:
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--text-secondary)]">
            {OFFICIAL_DATA_SOURCES.map((source) => (
              <a
                key={source.label}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--electric-cyan)] transition-colors inline-flex items-center gap-1"
              >
                <span>{source.label}</span>
                <ExternalLink size={10} className="opacity-60" />
              </a>
            ))}
          </div>
        </div>

        {/* ── Bottom Bar ───────────────────────────────────────────── */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)] text-center sm:text-left">
            &copy; {new Date().getFullYear()} EarthSphere AI. All NASA imagery & data courtesy of NASA Open APIs.
          </p>

          <div className="flex items-center gap-4">
            <p className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)]">
              Made with{" "}
              <Heart size={12} className="fill-rose-500 text-rose-500 animate-pulse" aria-label="love" />{" "}
              for Earth & Space
            </p>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[var(--border-default)] bg-[var(--surface-secondary)]/80 text-xs font-semibold text-[var(--text-secondary)] hover:border-[var(--electric-cyan)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-primary)] transition-all shadow-sm group"
              title="Back to Top"
            >
              <span>Top</span>
              <ArrowUp size={12} className="group-hover:-translate-y-0.5 transition-transform text-[var(--electric-cyan)]" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
