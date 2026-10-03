'use client';

import { Dispatch, SetStateAction } from 'react';
import { SATELLITE_CONSTELLATION } from '@/lib/explore/orbits';
import { Satellite, ChevronDown } from 'lucide-react';

interface SatellitesPanelProps {
  trackedSatellite: string | null;
  setTrackedSatellite: Dispatch<SetStateAction<string | null>>;
}

export function SatellitesPanel({ trackedSatellite, setTrackedSatellite }: SatellitesPanelProps) {
  return <details className="es-mission-panel">
    <summary><Satellite size={15} /><span>{trackedSatellite ? SATELLITE_CONSTELLATION.find(sat => sat.id === trackedSatellite)?.name : 'Follow a mission'}</span><ChevronDown size={13} /></summary>
    <div className="es-mission-list">
      {SATELLITE_CONSTELLATION.map(sat => <button key={sat.id} onClick={() => setTrackedSatellite(trackedSatellite === sat.id ? null : sat.id)} aria-pressed={trackedSatellite === sat.id}><span>{sat.name}</span><Satellite size={13} /></button>)}
      {trackedSatellite && <button className="es-mission-clear" onClick={() => setTrackedSatellite(null)}>Return to free orbit</button>}
      <p>Illustrative paths from reference orbital elements.</p>
    </div>
  </details>;
}
