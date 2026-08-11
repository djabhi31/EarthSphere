'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getCategoryColor, getCategoryLabel } from '@/lib/utils';
import type { EONETEvent } from '@/lib/types';

interface CategoryChartProps {
  events: readonly EONETEvent[];
  className?: string;
}

export function CategoryChart({ events, className }: CategoryChartProps) {
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach((e) => {
      const cat = e.categories[0]?.id || 'unknown';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([id, value]) => ({
        id,
        name: getCategoryLabel(id),
        value,
        color: getCategoryColor(id),
      }))
      .sort((a, b) => b.value - a.value);
  }, [events]);

  if (!chartData.length) return null;

  return (
    <div className={`glass rounded-2xl border border-white/10 p-5 space-y-3 ${className}`}>
      <h3 className="text-base font-bold text-white">Hazard Category Distribution</h3>
      
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
            >
              {chartData.map((entry) => (
                <Cell key={entry.id} fill={entry.color} stroke="rgba(0,0,0,0.5)" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#0f1420', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
              itemStyle={{ color: '#00d4aa' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        {chartData.slice(0, 5).map((item) => (
          <div key={item.id} className="flex items-center gap-1.5 text-xs text-white/70">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span>{item.name} ({item.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
