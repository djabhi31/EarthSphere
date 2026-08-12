'use client';

import { useState, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEarthSphereStore } from '@/lib/store';
import { audioSynth } from '@/lib/audio';

const ACCENTS = [
  { id: 'cyan', name: 'Electric Cyan', color: '#00d4aa' },
  { id: 'pink', name: 'Neon Pink', color: '#ec4899' },
  { id: 'orange', name: 'Solar Orange', color: '#ff6b35' },
  { id: 'emerald', name: 'Emerald Green', color: '#10b981' },
] as const;

export function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const { accentTheme, setAccentTheme } = useEarthSphereStore();

  // Sync data-accent attribute on DOM
  useEffect(() => {
    if (accentTheme) {
      document.documentElement.setAttribute('data-accent', accentTheme);
    }
  }, [accentTheme]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        title="Custom Color Theme"
        aria-label="Theme Customizer"
      >
        <Palette size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 w-48 glass-strong rounded-xl border border-white/10 p-3 shadow-2xl space-y-2">
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">
            Accent Theme
          </span>
          <div className="space-y-1">
            {ACCENTS.map((acc) => (
              <button
                key={acc.id}
                onClick={() => {
                  setAccentTheme(acc.id);
                  audioSynth.playClick();
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold transition-colors',
                  accentTheme === acc.id ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: acc.color }} />
                  <span>{acc.name}</span>
                </div>
                {accentTheme === acc.id && <Check className="w-3.5 h-3.5 text-electric-cyan" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
