'use client';

import { useMemo } from 'react';
import { Flame, CloudRain, AlertTriangle } from 'lucide-react';
import type { EONETEvent } from '@/lib/types';
import { getLatestGeometry } from '@/lib/utils';

interface CarbonEstimatorProps {
  event: EONETEvent;
  className?: string;
}

export function CarbonEstimator({ event, className }: CarbonEstimatorProps) {
  const isWildfire = event.categories.some((c) => c.id === 'wildfires');

  const estimation = useMemo(() => {
    if (!isWildfire) return null;

    const latestGeo = getLatestGeometry(event);
    const areaHectares = latestGeo?.magnitudeValue ?? 1500; // fallback area estimate
    const durationDays = event.geometry.length > 1 ? event.geometry.length * 2 : 5;

    // Approx 25 metric tons CO2 per hectare burned
    const totalCO2Tons = Math.round(areaHectares * 25);
    const pm25Tons = Math.round(areaHectares * 0.12);

    return {
      areaHectares: areaHectares.toLocaleString(),
      totalCO2Tons: totalCO2Tons.toLocaleString(),
      pm25Tons: pm25Tons.toLocaleString(),
      carsEquivalent: Math.round(totalCO2Tons / 4.6).toLocaleString(),
    };
  }, [event, isWildfire]);

  if (!estimation) return null;

  return (
    <div className={`glass rounded-2xl border border-white/10 p-4 space-y-2.5 ${className}`}>
      <div className="flex items-center gap-2">
        <Flame className="w-4 h-4 text-orange-400" />
        <span className="text-xs font-bold text-white uppercase tracking-wider">
          Wildfire Smoke & CO2 Estimator
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-0.5">
          <span className="text-[10px] text-white/40 uppercase block">Est. CO2 Emissions</span>
          <p className="font-mono font-bold text-orange-400 text-sm">{estimation.totalCO2Tons} tons</p>
        </div>

        <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-0.5">
          <span className="text-[10px] text-white/40 uppercase block">PM2.5 Particulate</span>
          <p className="font-mono font-bold text-amber-400 text-sm">{estimation.pm25Tons} tons</p>
        </div>
      </div>

      <p className="text-[11px] text-white/50 pt-1">
        Equivalent to annual emissions of approx <strong className="text-white">{estimation.carsEquivalent}</strong> passenger vehicles.
      </p>
    </div>
  );
}
