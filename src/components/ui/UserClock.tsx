'use client';

import { useState, useEffect } from 'react';
import { Clock, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUserTimezoneInfo, type UserTimezoneInfo } from '@/lib/timezone';

interface UserClockProps {
  className?: string;
  compact?: boolean;
}

export function UserClock({ className, compact = false }: UserClockProps) {
  const [tzInfo, setTzInfo] = useState<UserTimezoneInfo | null>(null);

  useEffect(() => {
    setTzInfo(getUserTimezoneInfo());
    const interval = setInterval(() => {
      setTzInfo(getUserTimezoneInfo());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!tzInfo) return null;

  if (compact) {
    return (
      <div className={cn('flex items-center gap-1.5 font-mono text-xs text-white/80', className)}>
        <Clock className="w-3.5 h-3.5 text-electric-cyan animate-pulse" />
        <span className="font-bold text-white tabular-nums">{tzInfo.timeStr}</span>
        <span className="text-[10px] text-electric-cyan/70">{tzInfo.tzCode}</span>
      </div>
    );
  }

  return (
    <div className={cn('glass rounded-xl px-3 py-1.5 flex items-center gap-2 border border-white/10 text-xs text-white', className)}>
      <div className="relative flex h-2 w-2 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-cyan opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-electric-cyan" />
      </div>

      <div className="flex items-center gap-1.5 font-mono">
        <span className="font-bold text-white tabular-nums text-sm">{tzInfo.timeStr}</span>
        <span className="text-[10px] text-electric-cyan font-semibold">{tzInfo.tzCode}</span>
        <span className="text-[10px] text-white/40">({tzInfo.offsetStr})</span>
      </div>
    </div>
  );
}
