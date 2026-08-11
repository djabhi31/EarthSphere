'use client';

import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Route, Gauge, Maximize2, Layers } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { calculateDistance } from '@/lib/severity';
import type { EONETEvent } from '@/lib/types';

interface TrajectoryCalculatorProps {
  event: EONETEvent;
  className?: string;
}

export function TrajectoryCalculator({ event, className }: TrajectoryCalculatorProps) {
  const stats = useMemo(() => {
    const geos = event.geometry;
    if (geos.length < 2) return null;

    let totalDistKm = 0;
    for (let i = 0; i < geos.length - 1; i++) {
      const c1 = geos[i].coordinates as number[];
      const c2 = geos[i + 1].coordinates as number[];
      if (c1?.length >= 2 && c2?.length >= 2) {
        const d = calculateDistance(c1[1], c1[0], c2[1], c2[0]);
        totalDistKm += d.km;
      }
    }

    const firstTime = new Date(geos[0].date).getTime();
    const lastTime = new Date(geos[geos.length - 1].date).getTime();
    const durationDays = Math.max(0.1, (lastTime - firstTime) / (1000 * 3600 * 24));
    const avgSpeedKmPerDay = Math.round(totalDistKm / durationDays);

    // Approximate Bounding Footprint Area (in km²)
    let minLat = Infinity, maxLat = -Infinity;
    let minLon = Infinity, maxLon = -Infinity;

    geos.forEach((g) => {
      const c = g.coordinates as number[];
      if (c?.length >= 2) {
        if (c[1] < minLat) minLat = c[1];
        if (c[1] > maxLat) maxLat = c[1];
        if (c[0] < minLon) minLon = c[0];
        if (c[0] > maxLon) maxLon = c[0];
      }
    });

    const latSpanKm = (maxLat - minLat) * 111;
    const lonSpanKm = (maxLon - minLon) * 111 * Math.cos(((minLat + maxLat) / 2) * (Math.PI / 180));
    const approxAreaKm2 = Math.round(Math.abs(latSpanKm * lonSpanKm));

    return {
      totalDistKm,
      totalDistMiles: Math.round(totalDistKm * 0.621371),
      durationDays: Math.round(durationDays * 10) / 10,
      avgSpeedKmPerDay,
      approxAreaKm2,
      pointsCount: geos.length,
    };
  }, [event]);

  if (!stats) return null;

  return (
    <div className={cn('glass rounded-2xl border border-white/10 p-4 space-y-3', className)}>
      <div className="flex items-center gap-2">
        <Route className="w-4 h-4 text-electric-cyan" />
        <span className="text-xs font-bold text-white uppercase tracking-wider">
          Trajectory & Spread Analysis
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-white/40 text-[10px]">
            <Route className="w-3 h-3 text-cyan-400" />
            <span>Path Distance</span>
          </div>
          <p className="font-mono font-bold text-white text-sm">
            {stats.totalDistKm.toLocaleString()} km
          </p>
          <span className="text-[10px] text-white/40">({stats.totalDistMiles.toLocaleString()} miles)</span>
        </div>

        <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-white/40 text-[10px]">
            <Gauge className="w-3 h-3 text-amber-400" />
            <span>Avg Spread Speed</span>
          </div>
          <p className="font-mono font-bold text-amber-400 text-sm">
            {stats.avgSpeedKmPerDay} km/day
          </p>
          <span className="text-[10px] text-white/40">over {stats.durationDays} days</span>
        </div>

        <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-white/40 text-[10px]">
            <Maximize2 className="w-3 h-3 text-purple-400" />
            <span>Bounding Area</span>
          </div>
          <p className="font-mono font-bold text-purple-400 text-sm">
            ~{stats.approxAreaKm2.toLocaleString()} km²
          </p>
          <span className="text-[10px] text-white/40">estimated footprint</span>
        </div>

        <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-white/40 text-[10px]">
            <Layers className="w-3 h-3 text-emerald-400" />
            <span>Observations</span>
          </div>
          <p className="font-mono font-bold text-emerald-400 text-sm">
            {stats.pointsCount} points
          </p>
          <span className="text-[10px] text-white/40">recorded tracking</span>
        </div>
      </div>
    </div>
  );
}
