'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Flame, Waves, Mountain, Wind, X, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { audioSynth } from '@/lib/audio';

interface SafetyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAFETY_PROTOCOLS = [
  {
    id: 'wildfires',
    title: 'Wildfire Emergency Protocol',
    icon: <Flame className="w-5 h-5 text-orange-400" />,
    steps: [
      'Create a 30-foot defensible zone around structure.',
      'Prepare emergency go-bags with N95 masks, water, and documents.',
      'Follow local evacuation orders immediately without delay.',
      'Keep air filtration running indoors and close all windows.',
    ],
  },
  {
    id: 'storms',
    title: 'Severe Storm & Cyclone Protocol',
    icon: <Wind className="w-5 h-5 text-cyan-400" />,
    steps: [
      'Secure loose outdoor objects and reinforce shutters.',
      'Stay indoors in an interior windowless room during peak landfall.',
      'Prepare 72-hour backup power and emergency radios.',
      'Do not attempt to drive through flooded roadways.',
    ],
  },
  {
    id: 'volcanoes',
    title: 'Volcanic Eruption Protocol',
    icon: <Mountain className="w-5 h-5 text-red-400" />,
    steps: [
      'Wear tight goggles and N95 respirators to prevent ash inhalation.',
      'Avoid low-lying river valleys prone to volcanic mudflows (lahars).',
      'Seal home ventilation ducts and clear heavy ash from roof structures.',
    ],
  },
  {
    id: 'earthquakes',
    title: 'Seismic Hazard Protocol',
    icon: <Waves className="w-5 h-5 text-amber-400" />,
    steps: [
      'Drop, Cover, and Hold On under heavy furniture.',
      'Stay clear of glass, unanchored bookcases, and exterior walls.',
      'Be prepared for secondary aftershocks.',
    ],
  },
];

export function SafetyGuideModal({ isOpen, onClose }: SafetyGuideModalProps) {
  const [activeCategory, setActiveCategory] = useState('wildfires');

  if (!isOpen) return null;

  const currentProtocol = SAFETY_PROTOCOLS.find((p) => p.id === activeCategory) || SAFETY_PROTOCOLS[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-2xl glass-strong border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl font-bold text-white">Emergency Preparedness Guide</h2>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {SAFETY_PROTOCOLS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setActiveCategory(p.id);
                  audioSynth.playClick();
                }}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shrink-0',
                  activeCategory === p.id
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                )}
              >
                {p.icon}
                <span>{p.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          <div className="glass rounded-xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              {currentProtocol.icon}
              <h3 className="text-lg font-bold text-white">{currentProtocol.title}</h3>
            </div>

            <div className="space-y-3">
              {currentProtocol.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-black/40 border border-white/5">
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-white/80 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
