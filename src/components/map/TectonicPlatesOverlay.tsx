'use client';

import { cn } from '@/lib/utils';

interface TectonicPlatesOverlayProps {
  enabled: boolean;
}

export function TectonicPlatesOverlay({ enabled }: TectonicPlatesOverlayProps) {
  if (!enabled) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden opacity-40">
      <svg className="w-full h-full stroke-amber-500/60 fill-none stroke-[1.5] stroke-dasharray-[4_4]">
        {/* Simulated major fault lines across Pacific & Atlantic */}
        <path d="M 100 200 Q 300 400 600 250 T 900 500 T 1200 300" />
        <path d="M 200 500 Q 500 200 800 600 T 1100 200" />
        <path d="M 50 100 Q 400 300 700 150 T 1300 400" />
      </svg>
      <div className="absolute top-20 left-44 z-30 flex items-center gap-2 rounded-lg border border-amber-500/40 bg-black/60 px-3 py-1.5 backdrop-blur-md">
        <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-400">
          Tectonic Fault Lines Active
        </span>
      </div>
    </div>
  );
}
