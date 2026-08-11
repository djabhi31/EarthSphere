'use client';

import { useMemo } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, AlertTriangle, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculateSeverity } from '@/lib/severity';
import type { EONETEvent } from '@/lib/types';

interface SeverityBadgeProps {
  event: EONETEvent;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SeverityBadge({
  event,
  showText = true,
  size = 'md',
  className,
}: SeverityBadgeProps) {
  const info = useMemo(() => calculateSeverity(event), [event]);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2 font-semibold',
  }[size];

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14,
  }[size];

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={cn(
        'inline-flex items-center rounded-full border backdrop-blur-md font-medium transition-all shadow-sm',
        sizeClasses,
        className
      )}
      style={{
        backgroundColor: info.badgeBg,
        borderColor: info.borderColor,
        color: info.color,
      }}
      title={`${info.label} (Severity Score: ${info.score}/100) — ${info.description}`}
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        {info.level >= 4 && (
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ backgroundColor: info.color }}
          />
        )}
        <span
          className="relative inline-flex h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: info.color }}
        />
      </span>

      {info.level >= 4 ? (
        <ShieldAlert size={iconSizes} />
      ) : info.level >= 3 ? (
        <AlertTriangle size={iconSizes} />
      ) : (
        <Activity size={iconSizes} />
      )}

      {showText && <span>Lvl {info.level} • {info.label}</span>}
    </motion.div>
  );
}
