'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Radio,
  ExternalLink,
  Maximize2,
  Minimize2,
  RefreshCw,
  Orbit,
  Shield,
  Activity, Globe2,
  Wifi
} from 'lucide-react';
import Link from 'next/link';
import { audioSynth } from '@/lib/audio';
import { cn } from '@/lib/utils';

type VariantId = 'global' | 'tech' | 'finance' | 'commodity' | 'energy';

interface VariantOption {
  id: VariantId;
  label: string;
  badge: string;
  tagline: string;
  url: string;
  externalFallback: string;
  color: string;
}

const VARIANTS: VariantOption[] = [
  {
    id: 'global',
    label: 'Global Intelligence',
    badge: 'Flagship',
    tagline: '100+ real-time news feeds, conflict zones, and geopolitical radar',
    url: 'https://worldmonitor.earthsphere.in',
    externalFallback: 'https://www.worldmonitor.app',
    color: 'var(--electric-cyan)',
  },
  {
    id: 'tech',
    label: 'Tech & AI',
    badge: 'Tech',
    tagline: 'AI labs, semiconductor supply chain, datacenter hubs & breakthrough intel',
    url: 'https://tech.worldmonitor.app',
    externalFallback: 'https://tech.worldmonitor.app',
    color: '#0891b2',
  },
  {
    id: 'finance',
    label: 'Finance & Markets',
    badge: 'Markets',
    tagline: 'Global stock exchanges, macro indicators, crypto, and market composites',
    url: 'https://finance.worldmonitor.app',
    externalFallback: 'https://finance.worldmonitor.app',
    color: '#059669',
  },
  {
    id: 'energy',
    label: 'Energy & Grid',
    badge: 'Energy',
    tagline: 'Global pipelines, nuclear reactors, green power grids & oil shipping lanes',
    url: 'https://energy.worldmonitor.app',
    externalFallback: 'https://energy.worldmonitor.app',
    color: '#eab308',
  },
  {
    id: 'commodity',
    label: 'Commodities & Flow',
    badge: 'Supply',
    tagline: 'Agricultural trade, critical minerals, lithium routes & port congestion',
    url: 'https://commodity.worldmonitor.app',
    externalFallback: 'https://commodity.worldmonitor.app',
    color: '#b45309',
  },
];

export default function IntelPageClient() {
  const [selectedVariant, setSelectedVariant] = useState<VariantId>('global');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const activeVariant = VARIANTS.find((v) => v.id === selectedVariant) || VARIANTS[0];

  const handleRefresh = () => {
    audioSynth.playClick();
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    audioSynth.playClick();
    setIsFullscreen((prev) => !prev);
  };

  return (
    <div className="es-intelligence-workspace min-h-screen text-[var(--text-primary)]">
      {/* Fullscreen Overlay Mode */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black flex flex-col"
          >
            {/* Minimalist Top Control Bar */}
            <div className="h-12 bg-neutral-950/90 border-b border-white/10 px-4 flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                  World Monitor Live — {activeVariant.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="px-2.5 py-1 text-xs rounded bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
                  Reload
                </button>
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="px-2.5 py-1 text-xs rounded bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center gap-1.5 transition-colors"
                >
                  <Minimize2 size={12} />
                  Exit Fullscreen
                </button>
              </div>
            </div>

            {/* Fullscreen Iframe */}
            <iframe
              key={`fs-${iframeKey}-${activeVariant.id}`}
              src={activeVariant.externalFallback}
              title={`World Monitor ${activeVariant.label}`}
              className="w-full flex-1 border-none bg-neutral-950"
              allow="fullscreen; geolocation; clipboard-write; microphone; camera"
              onLoad={() => setIsLoading(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="es-intelligence-panels max-w-7xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]">


          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={toggleFullscreen}
              onMouseEnter={() => audioSynth.playHover()}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-[var(--surface-secondary)] hover:bg-[var(--surface-primary)] border border-[var(--border-default)] text-[var(--text-primary)] flex items-center gap-2 transition-all shadow-sm active:scale-95"
            >
              <Maximize2 size={14} className="text-cyan-400" />
              <span>Full Screen</span>
            </button>

            <a
              href="https://worldmonitor.earthsphere.in"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => audioSynth.playClick()}
              onMouseEnter={() => audioSynth.playHover()}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] active:scale-95"
            >
              <span>Launch Standalone</span>
              <ExternalLink size={14} />
            </a>

            <Link
              href="https://godseyeview.earthsphere.in"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => audioSynth.playClick()}
              onMouseEnter={() => audioSynth.playHover()}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 flex items-center gap-2 transition-all active:scale-95"
            >
              <Orbit size={14} />
              <span>God&apos;s Eye View (3D)</span>
            </Link>
          </div>
        </div>

        {/* Variant Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {VARIANTS.map((variant) => {
            const isSelected = selectedVariant === variant.id;
            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => {
                  audioSynth.playClick();
                  setSelectedVariant(variant.id);
                  setIsLoading(true);
                }}
                onMouseEnter={() => audioSynth.playHover()}
                className={cn(
                  'px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 shrink-0 flex items-center gap-2 border',
                  isSelected
                    ? 'bg-white/10 border-[var(--electric-cyan)]/50 text-white shadow-[0_0_12px_rgba(0,212,170,0.2)]'
                    : 'bg-[var(--surface-sunken)]/60 border-transparent text-[var(--text-secondary)] hover:bg-white/5 hover:text-white'
                )}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: variant.color }}
                />
                <span className="font-semibold">{variant.label}</span>
                <span className="text-[10px] opacity-70 px-1.5 py-0.2 rounded bg-black/30 font-mono">
                  {variant.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Interactive Frame Container */}
        <div className="relative rounded-2xl border border-[var(--border-default)] bg-black overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
          {/* Frame Header Toolbar */}
          <div className="h-10 bg-[var(--surface-primary)] border-b border-[var(--border-subtle)] px-4 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[11px] font-mono text-[var(--text-muted)] truncate">
                {activeVariant.externalFallback}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                title="Reload interactive frame"
                className="p-1 rounded-md text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-colors"
              >
                <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
              </button>
              <button
                type="button"
                onClick={toggleFullscreen}
                title="Expand to fullscreen"
                className="p-1 rounded-md text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-colors"
              >
                <Maximize2 size={13} />
              </button>
            </div>
          </div>

          {/* Iframe Viewport */}
          <div className="relative w-full h-[700px] bg-neutral-950">
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950/80 backdrop-blur-sm z-10">
                <Radio className="w-8 h-8 text-emerald-400 animate-pulse mb-3" />
                <p className="text-xs font-mono text-neutral-300">
                  Connecting to World Monitor Intelligence Grid...
                </p>
              </div>
            )}
            <iframe
              key={`main-${iframeKey}-${activeVariant.id}`}
              src={activeVariant.externalFallback}
              title={`World Monitor ${activeVariant.label}`}
              className="w-full h-full border-none"
              allow="fullscreen; geolocation; clipboard-write; microphone; camera"
              onLoad={() => setIsLoading(false)}
            />
          </div>
        </div>

        {/* Intelligence Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <div className="p-5 rounded-2xl bg-[var(--surface-sunken)]/40 border border-[var(--border-subtle)] hover:border-[var(--electric-cyan)]/30 transition-all group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                <Wifi className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                100+ Curated Feeds
              </h3>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              Global and regional categories synthesized into contextual briefs with real-time signal convergence.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface-sunken)]/40 border border-[var(--border-subtle)] hover:border-[var(--electric-cyan)]/30 transition-all group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                <Globe2 className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Dual WebGL Engine
              </h3>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              Seamless toggle between a 3D spherical globe (<code className="text-purple-300">globe.gl</code>) and high-performance flat map (<code className="text-purple-300">deck.gl</code>).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface-sunken)]/40 border border-[var(--border-subtle)] hover:border-[var(--electric-cyan)]/30 transition-all group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Country Instability Index
              </h3>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              Real-time CII v8 scores, escalation indicators, and 24-hour delta tracking across 31 critical Tier-1 nations.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface-sunken)]/40 border border-[var(--border-subtle)] hover:border-[var(--electric-cyan)]/30 transition-all group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Lifetime Sync Engine
              </h3>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              Automated daily upstream synchronizer keeps code, feeds, and features 100% updated with the open-source core.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
