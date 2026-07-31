'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cssVars, radii, gradients, colors } from '@/lib/design-tokens';
import { springs } from '@/lib/motion-presets';

export interface ProgressProps {
  value: number;
  max?: number;
  variant?: 'default' | 'gradient' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: '4px',
  md: '8px',
  lg: '12px',
};

/**
 * Animated progress bar with glow variants.
 *
 * @example
 * ```tsx
 * <Progress value={75} variant="glow" size="md" />
 * ```
 */
export function Progress({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  className = '',
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const height = sizeMap[size];

  const getBackground = () => {
    switch (variant) {
      case 'gradient':
      case 'glow':
        return gradients.aurora;
      case 'default':
      default:
        return cssVars.accent;
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        height,
        background: cssVars.surfaceSecondary,
        borderRadius: radii.pill,
      }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={springs.gentle}
        className="h-full absolute left-0 top-0"
        style={{
          background: getBackground(),
          borderRadius: radii.pill,
          boxShadow: variant === 'glow' ? cssVars.glowCyan : 'none',
        }}
      />
    </div>
  );
}
