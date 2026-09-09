'use client';

import { Dispatch, SetStateAction } from 'react';
import { SATELLITE_CONSTELLATION } from '@/lib/explore/orbits';
import { Satellite, Crosshair } from 'lucide-react';

interface SatellitesPanelProps {
  trackedSatellite: string | null;
  setTrackedSatellite: Dispatch<SetStateAction<string | null>>;
}

export function SatellitesPanel({ trackedSatellite, setTrackedSatellite }: SatellitesPanelProps) {
  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl w-full max-w-xs hidden md:flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Missions</h3>
        {trackedSatellite && (
          <button 
            onClick={() => setTrackedSatellite(null)}
            className="text-[10px] text-red-400 hover:text-red-300 ml-2"
          >
            CLEAR
          </button>
        )}
      </div>
      
      <div className="flex flex-col gap-1 items-end">
        {SATELLITE_CONSTELLATION.map((sat) => {
          const isActive = trackedSatellite === sat.id;
          
          return (
            <button
              key={sat.id}
              onClick={() => setTrackedSatellite(isActive ? null : sat.id)}
              className="flex items-center justify-end gap-4 px-2 py-2 text-xs transition-all duration-300 group relative w-full"
            >
              <span className={`font-mono uppercase tracking-widest ${isActive ? 'text-emerald-400 font-bold' : 'text-white/50 group-hover:text-white/80'}`}>
                {sat.name}
              </span>
              <Satellite size={14} className={isActive ? 'text-emerald-400' : 'text-white/30 group-hover:text-white/60'} />
              {isActive && (
                <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
