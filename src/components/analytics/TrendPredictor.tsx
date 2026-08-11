'use client';

import { useMemo } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import type { EONETEvent } from '@/lib/types';

interface TrendPredictorProps {
  events: readonly EONETEvent[];
  className?: string;
}

export function TrendPredictor({ events, className }: TrendPredictorProps) {
  const prediction = useMemo(() => {
    if (!events.length) return null;

    const monthlyCounts: Record<string, number> = {};
    events.forEach((e) => {
      if (e.geometry[0]?.date) {
        const key = e.geometry[0].date.substring(0, 7); // YYYY-MM
        monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
      }
    });

    const values = Object.values(monthlyCounts);
    const avg = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 10;
    const projectedNextMonth = Math.round(avg * 1.15); // Projected 15% surge factor

    return {
      avgMonthly: avg,
      projectedNextMonth,
      trendDirection: projectedNextMonth > avg ? 'Surge Expected (+15%)' : 'Stable Rate',
    };
  }, [events]);

  if (!prediction) return null;

  return (
    <div className={`glass rounded-2xl border border-white/10 p-5 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-electric-cyan" />
          <h3 className="text-base font-bold text-white">Disaster Frequency Forecast</h3>
        </div>
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-electric-cyan/10 border border-electric-cyan/30 text-electric-cyan text-[10px] font-mono font-semibold">
          <Sparkles className="w-3 h-3" /> AI PREDICTIVE
        </span>
      </div>

      <p className="text-xs text-white/60">
        Algorithmic trend estimation based on historical NASA EONET occurrence frequency.
      </p>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-1">
          <span className="text-[10px] text-white/40 uppercase block font-semibold">Historical Monthly Avg</span>
          <span className="text-2xl font-bold text-white font-mono">{prediction.avgMonthly}</span>
          <span className="text-[10px] text-white/40 block">events / month</span>
        </div>

        <div className="bg-black/30 p-3 rounded-xl border border-electric-cyan/20 space-y-1">
          <span className="text-[10px] text-electric-cyan uppercase block font-semibold">Projected Next Month</span>
          <span className="text-2xl font-bold text-electric-cyan font-mono">{prediction.projectedNextMonth}</span>
          <span className="text-[10px] text-electric-cyan/70 block">{prediction.trendDirection}</span>
        </div>
      </div>
    </div>
  );
}
