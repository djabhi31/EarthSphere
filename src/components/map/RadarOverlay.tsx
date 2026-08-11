'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface RadarOverlayProps {
  enabled: boolean;
}

export function RadarOverlay({ enabled }: RadarOverlayProps) {
  if (!enabled) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Radial Scan Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full border border-electric-cyan/20 animate-ping opacity-25" />
        <div className="absolute h-[400px] w-[400px] rounded-full border border-electric-cyan/30" />
        <div className="absolute h-[800px] w-[800px] rounded-full border border-electric-cyan/10" />
      </div>

      {/* Crosshair Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <div className="h-4 w-4 rounded-full border-2 border-electric-cyan/60" />
        <div className="absolute h-12 w-px bg-electric-cyan/40" />
        <div className="absolute h-px w-12 bg-electric-cyan/40" />
      </div>

      {/* Rotating Sweep Beam */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
        className="absolute top-1/2 left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, rgba(0, 212, 170, 0.15) 0deg, transparent 60deg, transparent 360deg)',
        }}
      />

      {/* Grid Lines */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 212, 170, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 170, 0.4) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
        }}
      />

      {/* Radar Label */}
      <div className="absolute top-20 left-4 z-30 flex items-center gap-2 rounded-lg border border-electric-cyan/40 bg-black/60 px-3 py-1.5 backdrop-blur-md">
        <span className="h-2 w-2 rounded-full bg-electric-cyan animate-pulse" />
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-electric-cyan">
          Tactical Radar Scan Active
        </span>
      </div>
    </div>
  );
}
