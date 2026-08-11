'use client';

import { useMemo } from 'react';
import { Clock, Sun, Moon, MapPin } from 'lucide-react';
import { cn, getLatestGeometry } from '@/lib/utils';
import { getEventLocalTimeInfo } from '@/lib/timezone';
import type { EONETEvent } from '@/lib/types';

interface EventLocalTimeProps {
  event: EONETEvent;
  className?: string;
}

export function EventLocalTime({ event, className }: EventLocalTimeProps) {
  const geo = getLatestGeometry(event);
  const coords = geo?.coordinates as number[] | undefined;

  const localTimeInfo = useMemo(() => {
    if (!geo || !coords || coords.length < 2) return null;
    return getEventLocalTimeInfo(coords[0], coords[1], geo.date);
  }, [geo, coords]);

  if (!localTimeInfo) return null;

  return (
    <div className={cn('flex items-center gap-2 text-xs text-white/70', className)}>
      <div className="flex items-center gap-1.5 font-mono bg-black/40 px-2.5 py-1 rounded-xl border border-white/10 shadow-sm backdrop-blur-md">
        <MapPin className="w-3 h-3 text-electric-cyan shrink-0" />
        <span className="text-[10px] text-white/40 uppercase tracking-wide">Site Local:</span>
        <span className="font-bold text-white tabular-nums">{localTimeInfo.localTimeStr}</span>
        <span className="text-[10px] text-electric-cyan font-bold px-1 py-0.2 rounded bg-electric-cyan/10">
          {localTimeInfo.tzCode}
        </span>
        {localTimeInfo.isNightAtLocation ? (
          <span title="Night at Event Location">
            <Moon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          </span>
        ) : (
          <span title="Daytime at Event Location">
            <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          </span>
        )}
      </div>
    </div>
  );
}
