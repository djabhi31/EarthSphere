import { Dispatch, SetStateAction } from 'react';
import { VitalSignsPanel } from './VitalSignsPanel';
import { TimeScrubber } from './TimeScrubber';
import { SatellitesPanel } from './SatellitesPanel';
import { ChevronLeft } from 'lucide-react';
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
      <div className="absolute top-0 left-0 p-6 flex flex-col gap-2 pointer-events-auto">
        <Link href="/" className="flex items-center gap-1 text-white/50 hover:text-white transition-colors w-fit text-xs font-mono uppercase tracking-widest">
          <ChevronLeft size={14} />
          <span>EarthSphere Hub</span>
        </Link>
        <h1 className="text-2xl font-light tracking-[0.2em] text-white uppercase mt-2">
          Eyes on the Earth
        </h1>
        <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase max-w-sm">
          Real-time orbital data & vital signs telemetry
        </p>
      </div>

      {/* Top Right - Missions */}
      <div className="absolute top-0 right-0 p-6 pointer-events-auto">
        <SatellitesPanel 
          trackedSatellite={props.trackedSatellite} 
          setTrackedSatellite={props.setTrackedSatellite} 
        />
      </div>

      {/* Center Left - Vital Signs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 p-6 pointer-events-auto">
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
