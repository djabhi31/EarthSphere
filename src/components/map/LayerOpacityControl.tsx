'use client';

import { motion } from 'motion/react';
import { Eye, EyeOff, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEarthSphereStore } from '@/lib/store';

interface LayerOpacityControlProps {
  className?: string;
}

export function LayerOpacityControl({ className }: LayerOpacityControlProps) {
  const { layerOpacity, setLayerOpacity } = useEarthSphereStore();

  return (
    <div className={cn('glass rounded-xl p-2.5 flex items-center gap-2 border border-white/10 text-xs text-white/80', className)}>
      <Layers className="w-3.5 h-3.5 text-electric-cyan shrink-0" />
      <span className="text-[11px] font-semibold">Opacity</span>
      <input
        type="range"
        min="0.2"
        max="1"
        step="0.05"
        value={layerOpacity}
        onChange={(e) => setLayerOpacity(parseFloat(e.target.value))}
        className="w-20 accent-electric-cyan h-1 bg-white/20 rounded-lg cursor-pointer"
        title="Adjust Map Opacity"
      />
      <span className="font-mono text-[10px] text-white/50 w-7">{Math.round(layerOpacity * 100)}%</span>
    </div>
  );
}
