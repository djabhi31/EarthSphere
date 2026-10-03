'use client';

import { Dispatch, SetStateAction } from 'react';
import { VitalSignsPanel } from './VitalSignsPanel';
import { TimeScrubber } from './TimeScrubber';
import { SatellitesPanel } from './SatellitesPanel';
import { ArrowUpRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface UIOverlayProps {
  activeLayer: string;
  setActiveLayer: Dispatch<SetStateAction<string>>;
  time: Date;
  setTime: Dispatch<SetStateAction<Date>>;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  trackedSatellite: string | null;
  setTrackedSatellite: Dispatch<SetStateAction<string | null>>;
}

export function UIOverlay(props: UIOverlayProps) {
  return (
    <>
      {/* Header - Top Left */}
      <div className="es-explore-heading pointer-events-auto">
        <Link href="/" className="flex items-center gap-1 text-white/50 hover:text-white transition-colors w-fit text-xs font-mono uppercase tracking-widest">
          <ChevronLeft size={14} />
          <span>EarthSphere Hub</span>
        </Link>
        <h1 className="text-2xl font-light tracking-[0.2em] text-white uppercase mt-2">
          Earth, in perspective.
        </h1>
        <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase max-w-sm">
          Explore imagery layers and illustrative satellite paths
        </p>
        <a className="es-explore-nasa" href="https://eyes.nasa.gov/apps/earth/#/" target="_blank" rel="noopener noreferrer">Open NASA Eyes on Earth <ArrowUpRight size={12} /></a>
      </div>

      {/* Top Right - Missions */}
      <div className="es-explore-missions pointer-events-auto">
        <SatellitesPanel
          trackedSatellite={props.trackedSatellite}
          setTrackedSatellite={props.setTrackedSatellite}
        />
      </div>

      {/* Center Left - Vital Signs */}
      <div className="es-explore-layers pointer-events-auto">
        <VitalSignsPanel
          activeLayer={props.activeLayer}
          setActiveLayer={props.setActiveLayer}
        />
      </div>

      {/* Bottom - Time Scrubber */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-auto">
        <TimeScrubber
          time={props.time}
          setTime={props.setTime}
          isPlaying={props.isPlaying}
          setIsPlaying={props.setIsPlaying}
        />
      </div>
    </>
  );
}
