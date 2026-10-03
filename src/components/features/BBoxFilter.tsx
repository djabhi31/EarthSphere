'use client';

import { useState } from 'react';
import { Maximize, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BBoxFilterProps {
  onApplyBBox: (bbox: [number, number, number, number] | null) => void;
  className?: string;
}

export function BBoxFilter({ onApplyBBox, className }: BBoxFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [minLon, setMinLon] = useState('');
  const [minLat, setMinLat] = useState('');
  const [maxLon, setMaxLon] = useState('');
  const [maxLat, setMaxLat] = useState('');
  const [error, setError] = useState('');

  const handleApply = () => {
    const values = [minLon, minLat, maxLon, maxLat].map(Number);
    if (![minLon, minLat, maxLon, maxLat].every(value => value.trim()) || !values.every(Number.isFinite) || Math.abs(values[0]) > 180 || Math.abs(values[2]) > 180 || Math.abs(values[1]) > 90 || Math.abs(values[3]) > 90 || values[0] >= values[2] || values[1] >= values[3]) {
      setError('Enter valid west, south, east, and north bounds. Minimum values must be below maximum values.');
      return;
    }
    setError('');
    onApplyBBox(values as [number, number, number, number]);
    setIsOpen(false);
  };

  const handleClear = () => {
    setMinLon('');
    setMinLat('');
    setMaxLon('');
    setMaxLat('');
    onApplyBBox(null);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-white/70 hover:text-white transition-colors"
      >
        <Maximize className="w-3.5 h-3.5 text-electric-cyan" />
        <span>Filter by area</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 z-40 w-64 glass-strong rounded-xl border border-white/10 p-3 space-y-3 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[11px] font-bold text-white uppercase">Coordinates Range</span>
            <button aria-label="Close area filter" onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <input
              type="number"
              placeholder="Min Lon" aria-label="Western longitude"
              value={minLon}
              onChange={(e) => setMinLon(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-md p-1.5 text-white"
            />
            <input
              type="number"
              placeholder="Min Lat" aria-label="Southern latitude"
              value={minLat}
              onChange={(e) => setMinLat(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-md p-1.5 text-white"
            />
            <input
              type="number"
              placeholder="Max Lon" aria-label="Eastern longitude"
              value={maxLon}
              onChange={(e) => setMaxLon(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-md p-1.5 text-white"
            />
            <input
              type="number"
              placeholder="Max Lat" aria-label="Northern latitude"
              value={maxLat}
              onChange={(e) => setMaxLat(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-md p-1.5 text-white"
            />
          </div>

          {error && <p role="alert" className="text-xs text-red-300">{error}</p>}
          <div className="flex justify-between pt-1">
            <button onClick={handleClear} className="text-xs text-white/40 hover:text-white">
              Clear
            </button>
            <button
              onClick={handleApply}
              className="px-3 py-1 rounded-lg bg-electric-cyan text-space-black font-semibold text-xs"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
