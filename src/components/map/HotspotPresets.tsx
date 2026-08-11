'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Flame, ShieldAlert, Waves, Mountain, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type maplibregl from 'maplibre-gl';
import { audioSynth } from '@/lib/audio';

interface HotspotPreset {
  id: string;
  name: string;
  region: string;
  center: [number, number];
  zoom: number;
  pitch: number;
  icon: React.ReactNode;
}

const PRESETS: HotspotPreset[] = [
  {
    id: 'ring-of-fire',
    name: 'Pacific Ring of Fire',
    region: 'East Asia / Pacific Ocean',
    center: [140, 35],
    zoom: 3.2,
    pitch: 45,
    icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />,
  },
  {
    id: 'na-wildfires',
    name: 'Wildfire Corridor',
    region: 'Western North America',
    center: [-120, 45],
    zoom: 4,
    pitch: 40,
    icon: <Flame className="w-3.5 h-3.5 text-orange-400" />,
  },
  {
    id: 'atlantic-storm',
    name: 'Cyclone Basin',
    region: 'Atlantic / Caribbean',
    center: [-60, 25],
    zoom: 3.8,
    pitch: 35,
    icon: <Waves className="w-3.5 h-3.5 text-cyan-400" />,
  },
  {
    id: 'himalaya',
    name: 'Himalayan Ridge',
    region: 'South / Central Asia',
    center: [85, 30],
    zoom: 4.2,
    pitch: 45,
    icon: <Mountain className="w-3.5 h-3.5 text-purple-400" />,
  },
];

interface HotspotPresetsProps {
  map: maplibregl.Map | null;
  className?: string;
}

export function HotspotPresets({ map, className }: HotspotPresetsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const handleFlyTo = (preset: HotspotPreset) => {
    if (!map) return;
    setActivePreset(preset.id);
    audioSynth.playClick();

    map.flyTo({
      center: preset.center,
      zoom: preset.zoom,
      pitch: preset.pitch,
      duration: 2500,
      essential: true,
    });
  };

  return (
    <div className={cn('relative z-30', className)}>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          setIsOpen(!isOpen);
          audioSynth.playClick();
        }}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl border glass-strong shadow-xl text-xs font-semibold transition-all',
          isOpen
            ? 'border-electric-cyan text-electric-cyan bg-electric-cyan/10'
            : 'border-white/10 text-white/80 hover:text-white hover:bg-white/10'
        )}
      >
        <Compass className={cn('w-4 h-4', isOpen && 'animate-spin-slow')} />
        <span>Hotspot Presets</span>
        <Sparkles className="w-3 h-3 text-electric-cyan" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full mb-2 left-0 w-64 glass-strong rounded-2xl border border-white/10 p-3 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
              <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider">
                Global Hotspots
              </span>
              <span className="text-[10px] text-electric-cyan font-mono">Cinematic View</span>
            </div>

            <div className="space-y-1.5">
              {PRESETS.map((preset) => {
                const isActive = activePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleFlyTo(preset)}
                    className={cn(
                      'w-full flex items-center justify-between p-2 rounded-xl text-left transition-all border',
                      isActive
                        ? 'bg-electric-cyan/15 border-electric-cyan/40 text-white'
                        : 'border-transparent text-white/70 hover:bg-white/5 hover:text-white hover:border-white/10'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 rounded-lg bg-black/30 shrink-0">{preset.icon}</div>
                      <div className="truncate">
                        <div className="text-xs font-semibold text-white leading-tight truncate">
                          {preset.name}
                        </div>
                        <div className="text-[10px] text-white/40 truncate">{preset.region}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-white/30 shrink-0" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
