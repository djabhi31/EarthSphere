'use client';

import { useMemo } from 'react';
import { Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { EONETEvent } from '@/lib/types';
import { getCategoryLabel } from '@/lib/utils';

interface SurgeDetectorProps {
  events: readonly EONETEvent[];
  className?: string;
}

export function SurgeDetector({ events, className }: SurgeDetectorProps) {
  const surgeInfo = useMemo(() => {
    if (!events.length) return null;

    const counts: Record<string, number> = {};
    events.forEach((e) => {
      const cat = e.categories[0]?.id || 'unknown';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const total = events.length;
    let maxCat = '';
    let maxCount = 0;

    Object.entries(counts).forEach(([cat, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxCat = cat;
      }
    });

    const percent = Math.round((maxCount / total) * 100);
    const isSurge = percent > 35;

    return {
      category: getCategoryLabel(maxCat),
      count: maxCount,
      percent,
      isSurge,
    };
  }, [events]);

  if (!surgeInfo) return null;

  return (
    <div className={`glass rounded-2xl border border-white/10 p-5 space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-amber-400" />
        <h3 className="text-base font-bold text-white">Anomaly & Surge Detection</h3>
      </div>

      {surgeInfo.isSurge ? (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-amber-400 block">
              Disaster Surge Detected: {surgeInfo.category}
            </span>
            <p className="text-white/70">
              {surgeInfo.category} accounts for {surgeInfo.percent}% ({surgeInfo.count} events) of total global hazards, indicating a significant regional outbreak.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-emerald-400 block">Normal Hazard Activity</span>
            <p className="text-white/70">
              Disaster frequency across categories remains balanced with no abnormal single-category surges detected.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
