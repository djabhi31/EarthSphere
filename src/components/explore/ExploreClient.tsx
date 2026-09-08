'use client';

import { useState } from 'react';
import { CanvasContainer } from './canvas/CanvasContainer';
import { UIOverlay } from './ui/UIOverlay';

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
