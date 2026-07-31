import Link from "next/link";
import { Heart } from "lucide-react";

// ---------------------------------------------------------------------------
// Footer – Premium dark footer with gradient accent
// ---------------------------------------------------------------------------

const QUICK_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/events", label: "Events" },
  { href: "/map", label: "Map" },
  { href: "/analytics", label: "Analytics" },
  { href: "/about", label: "About" },
];

const DATA_SOURCES = [
  { label: "NASA EONET", url: "https://eonet.gsfc.nasa.gov/" },
  { label: "NOAA", url: "https://www.noaa.gov/" },
  { label: "USGS", url: "https://www.usgs.gov/" },
  { label: "GDACS", url: "https://www.gdacs.org/" },
  { label: "ReliefWeb", url: "https://reliefweb.int/" },
];

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-[var(--border-subtle)] bg-[var(--surface-sunken)]">
      {/* Gradient top border */}
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--electric-cyan)] to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* ── Column 1: Brand ────────────────────────────────────── */}
          <div className="space-y-4">
            <Link href="/" className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--electric-cyan)] rounded">
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-[var(--electric-cyan)] to-[var(--cosmic-purple)] bg-clip-text text-transparent">
                EarthSphere
              </span>
              <span className="ml-1 text-xs font-medium text-white/30">AI</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/40">
              Real-time monitoring and visualization of natural events worldwide.
              Tracking wildfires, storms, earthquakes, and more — because our
              planet&apos;s story matters.
            </p>
          </div>

          {/* ── Column 2: Quick Links ─────────────────────────────── */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/50">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/40 transition-colors hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--electric-cyan)] rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Data Sources ────────────────────────────── */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/50">
              Data Sources
            </h3>
            <ul className="space-y-2">
              {DATA_SOURCES.map((source) => (
                <li key={source.label}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/40 transition-colors hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--electric-cyan)] rounded"
                  >
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-white/25">
              Powered by{" "}
              <a
                href="https://eonet.gsfc.nasa.gov/docs/v3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00d4aa]/60 underline underline-offset-2 transition-colors hover:text-[#00d4aa]"
              >
                NASA EONET API
              </a>
            </p>
          </div>
        </div>

        {/* ── Bottom row ────────────────────────────────────────── */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 sm:flex-row">
          <p className="text-xs text-white/25">
            &copy; {new Date().getFullYear()} EarthSphere. All rights reserved.
          </p>
          <p className="inline-flex items-center gap-1 text-xs text-white/25">
            Made with{" "}
            <Heart size={12} className="fill-red-500 text-red-500" aria-label="love" />{" "}
            for Earth
          </p>
        </div>
      </div>
    </footer>
  );
}
