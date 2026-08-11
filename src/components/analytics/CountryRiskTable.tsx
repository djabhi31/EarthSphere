'use client';

import { useMemo } from 'react';
import { Globe2, ShieldAlert } from 'lucide-react';
import type { EONETEvent } from '@/lib/types';
import { calculateSeverity } from '@/lib/severity';

interface CountryRiskTableProps {
  events: readonly EONETEvent[];
  className?: string;
}

export function CountryRiskTable({ events, className }: CountryRiskTableProps) {
  const regionRanks = useMemo(() => {
    const regionCounts: Record<string, { count: number; severeCount: number }> = {
      'Pacific Rim': { count: 0, severeCount: 0 },
      'North America': { count: 0, severeCount: 0 },
      'Europe & Atlantic': { count: 0, severeCount: 0 },
      'Asia-Pacific': { count: 0, severeCount: 0 },
      'Latin America': { count: 0, severeCount: 0 },
      'Africa & Middle East': { count: 0, severeCount: 0 },
    };

    events.forEach((e) => {
      const geo = e.geometry[e.geometry.length - 1];
      const coords = geo?.coordinates as number[] | undefined;
      const severity = calculateSeverity(e);
      const isSevere = severity.level >= 4;

      if (coords && coords.length >= 2) {
        const [lon, lat] = coords;
        if (lon > 100 || lon < -120) {
          regionCounts['Pacific Rim'].count++;
          if (isSevere) regionCounts['Pacific Rim'].severeCount++;
        } else if (lon >= -120 && lon <= -50 && lat >= 15) {
          regionCounts['North America'].count++;
          if (isSevere) regionCounts['North America'].severeCount++;
        } else if (lon >= -50 && lon <= 45 && lat >= 35) {
          regionCounts['Europe & Atlantic'].count++;
          if (isSevere) regionCounts['Europe & Atlantic'].severeCount++;
        } else if (lon >= 60 && lon <= 150 && lat >= 0) {
          regionCounts['Asia-Pacific'].count++;
          if (isSevere) regionCounts['Asia-Pacific'].severeCount++;
        } else if (lon >= -110 && lon <= -30 && lat < 15) {
          regionCounts['Latin America'].count++;
          if (isSevere) regionCounts['Latin America'].severeCount++;
        } else {
          regionCounts['Africa & Middle East'].count++;
          if (isSevere) regionCounts['Africa & Middle East'].severeCount++;
        }
      }
    });

    return Object.entries(regionCounts)
      .map(([region, data]) => ({ region, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [events]);

  return (
    <div className={`glass rounded-2xl border border-white/10 p-5 space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Globe2 className="w-5 h-5 text-electric-cyan" />
        <h3 className="text-base font-bold text-white">Regional Threat Leaderboard</h3>
      </div>

      <div className="space-y-2 pt-1">
        {regionRanks.map((r, i) => (
          <div
            key={r.region}
            className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-electric-cyan/20 text-electric-cyan font-mono text-[11px] font-bold">
                {i + 1}
              </span>
              <span className="font-semibold text-white">{r.region}</span>
            </div>

            <div className="flex items-center gap-3">
              {r.severeCount > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-semibold">
                  <ShieldAlert className="w-3 h-3" /> {r.severeCount} Severe
                </span>
              )}
              <span className="font-mono font-bold text-electric-cyan text-sm">{r.count} events</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
