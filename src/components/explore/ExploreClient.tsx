'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { UIOverlay } from './ui/UIOverlay';

const CanvasContainer = dynamic(
  () => import('./canvas/CanvasContainer').then((mod) => mod.CanvasContainer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-black text-cyan-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-[11px] font-mono tracking-widest uppercase text-white/50">Rendering WebGL Canvas...</p>
        </div>
      </div>
    ),
  }
);

export function ExploreClient() {
  const [activeLayer, setActiveLayer] = useState<string>('visual'); // 'visual', 'temperature', 'co2', 'sea-level'
  const [time, setTime] = useState<Date>(new Date());
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [trackedSatellite, setTrackedSatellite] = useState<string | null>(null);

  return (
    <div className="relative w-full h-full text-white font-sans bg-black">
      {/* WebGL Canvas Background */}
      <div className="absolute inset-0 z-0">
        <CanvasContainer 
          activeLayer={activeLayer} 
          time={time} 
          trackedSatellite={trackedSatellite} 
        />
      </div>

      {/* UI Overlay HUD */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-4 md:p-6">
        <UIOverlay 
          activeLayer={activeLayer}
          setActiveLayer={setActiveLayer}
          time={time}
          setTime={setTime}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          trackedSatellite={trackedSatellite}
          setTrackedSatellite={setTrackedSatellite}
        />
      </div>
    </div>
  );
}
