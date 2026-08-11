'use client';

import { useMemo } from 'react';
import { Mountain, Plane, AlertTriangle } from 'lucide-react';
import type { EONETEvent } from '@/lib/types';
import { getLatestGeometry } from '@/lib/utils';

interface VolcanoPlumeCalculatorProps {
  event: EONETEvent;
  className?: string;
}

export function VolcanoPlumeCalculator({ event, className }: VolcanoPlumeCalculatorProps) {
  const isVolcano = event.categories.some((c) => c.id === 'volcanoes');

  const plume = useMemo(() => {
    if (!isVolcano) return null;

    const latestGeo = getLatestGeometry(event);
    const altitudeMeters = latestGeo?.magnitudeValue ?? 3500;
    const altitudeFt = Math.round(altitudeMeters * 3.28084);
    const flightRiskRadiusKm = Math.round((altitudeMeters / 1000) * 45);

    return {
      altitudeMeters: altitudeMeters.toLocaleString(),
      altitudeFt: altitudeFt.toLocaleString(),
      flightRiskRadiusKm: flightRiskRadiusKm.toLocaleString(),
      riskLevel: altitudeFt > 25000 ? 'Severe Aviation Hazard (FL250+)' : 'Moderate Flight Advisory',
    };
  }, [event, isVolcano]);

  if (!plume) return null;

  return (
    <div className={`glass rounded-2xl border border-white/10 p-4 space-y-2.5 ${className}`}>
      <div className="flex items-center gap-2">
        <Mountain className="w-4 h-4 text-purple-400" />
        <span className="text-xs font-bold text-white uppercase tracking-wider">
          Volcanic Ash Plume Reach
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-0.5">
          <span className="text-[10px] text-white/40 uppercase block">Plume Altitude</span>
          <p className="font-mono font-bold text-purple-400 text-sm">{plume.altitudeFt} ft</p>
        </div>

        <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-0.5">
          <span className="text-[10px] text-white/40 uppercase block">Flight Risk Radius</span>
          <p className="font-mono font-bold text-cyan-400 text-sm">{plume.flightRiskRadiusKm} km</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-amber-400 pt-1">
        <Plane className="w-3.5 h-3.5 shrink-0" />
        <span>{plume.riskLevel}</span>
      </div>
    </div>
  );
}
