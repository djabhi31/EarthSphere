'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { EONETEvent } from '@/lib/types';

interface YearlyComparisonChartProps {
  events: readonly EONETEvent[];
  className?: string;
}

export function YearlyComparisonChart({ events, className }: YearlyComparisonChartProps) {
  const yearlyData = useMemo(() => {
    const years: Record<string, number> = {};
    events.forEach((e) => {
      const year = e.geometry[0]?.date ? e.geometry[0].date.substring(0, 4) : '2024';
      years[year] = (years[year] || 0) + 1;
    });

    return Object.entries(years)
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => a.year.localeCompare(b.year));
  }, [events]);

  if (!yearlyData.length) return null;

  return (
    <div className={`glass rounded-2xl border border-white/10 p-5 space-y-3 ${className}`}>
      <h3 className="text-base font-bold text-white">Annual Event Volume Comparison</h3>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={yearlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="year" stroke="rgba(255,255,255,0.4)" fontSize={11} />
            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f1420', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {yearlyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#00d4aa' : '#7c3aed'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
