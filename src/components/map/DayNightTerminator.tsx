'use client';

import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DayNightTerminatorProps {
  enabled: boolean;
}

export function DayNightTerminator({ enabled }: DayNightTerminatorProps) {
  if (!enabled) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {/* Night Shadow Overlay */}
      <div
        className="absolute inset-0 opacity-45 mix-blend-multiply"
        style={{
          background:
            'linear-gradient(105deg, rgba(5,8,15,0.95) 0%, rgba(5,8,15,0.85) 45%, transparent 55%, transparent 100%)',
        }}
      />
      <div className="absolute top-20 right-44 z-30 flex items-center gap-2 rounded-lg border border-purple-500/40 bg-black/60 px-3 py-1.5 backdrop-blur-md">
        <Sun className="w-3.5 h-3.5 text-amber-400" />
        <Moon className="w-3.5 h-3.5 text-purple-400" />
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-purple-300">
          Solar Terminator Active
        </span>
      </div>
    </div>
  );
}
