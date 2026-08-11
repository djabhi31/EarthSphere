'use client';

import { motion } from 'motion/react';
import { RotateCw, Move3d } from 'lucide-react';
import type maplibregl from 'maplibre-gl';
import { audioSynth } from '@/lib/audio';

interface MapPitchControlsProps {
  map: maplibregl.Map | null;
  className?: string;
}

export function MapPitchControls({ map, className }: MapPitchControlsProps) {
  const handleTiltToggle = () => {
    if (!map) return;
    audioSynth.playClick();
    const currentPitch = map.getPitch();
    const newPitch = currentPitch > 20 ? 0 : 55;
    map.easeTo({ pitch: newPitch, duration: 1000 });
  };

  const handleRotate = () => {
    if (!map) return;
    audioSynth.playClick();
    const currentBearing = map.getBearing();
    map.easeTo({ bearing: currentBearing + 45, duration: 1000 });
  };

  return (
    <div className={`glass rounded-xl overflow-hidden flex flex-col ${className}`}>
      <button
        onClick={handleTiltToggle}
        className="p-2.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        title="Toggle 3D Tilt Angle"
        aria-label="Toggle 3D Tilt"
      >
        <Move3d className="w-4 h-4 text-electric-cyan" />
      </button>
      <div className="h-px bg-white/10" />
      <button
        onClick={handleRotate}
        className="p-2.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        title="Rotate Globe 45°"
        aria-label="Rotate Globe"
      >
        <RotateCw className="w-4 h-4 text-electric-cyan" />
      </button>
    </div>
  );
}
