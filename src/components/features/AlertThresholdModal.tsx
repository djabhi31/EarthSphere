'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BellRing, ShieldAlert, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { audioSynth } from '@/lib/audio';

interface AlertThresholdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AlertThresholdModal({ isOpen, onClose }: AlertThresholdModalProps) {
  const [minSeverity, setMinSeverity] = useState(4);
  const [notifyOnWildfires, setNotifyOnWildfires] = useState(true);
  const [notifyOnStorms, setNotifyOnStorms] = useState(true);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    audioSynth.playClick();
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        await Notification.requestPermission();
      }
      if (Notification.permission === 'granted') {
        new Notification("EarthSphere Alert System Active", {
          body: `Subscribed to Level ${minSeverity}+ disasters (Wildfires: ${notifyOnWildfires ? 'ON' : 'OFF'}, Storms: ${notifyOnStorms ? 'ON' : 'OFF'})`,
          icon: "/favicon.ico",
        });
      }
    }

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

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
          className="relative z-10 w-full max-w-md glass-strong border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <BellRing className="w-5 h-5 text-electric-cyan" />
              <h3 className="text-lg font-bold text-white">Alert Threshold Configurator</h3>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 text-xs text-white/80">
            <div>
              <label className="font-semibold text-white block mb-1">Minimum Severity Trigger</label>
              <div className="flex gap-2">
                {[3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      setMinSeverity(lvl);
                      audioSynth.playClick();
                    }}
                    className={cn(
                      'flex-1 py-2 rounded-xl border text-xs font-bold transition-all',
                      minSeverity === lvl
                        ? 'bg-electric-cyan/20 border-electric-cyan text-electric-cyan'
                        : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                    )}
                  >
                    Level {lvl}+
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="font-semibold text-white block">Category Subscriptions</label>
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5 cursor-pointer">
                <span>Wildfire Outbreaks</span>
                <input
                  type="checkbox"
                  checked={notifyOnWildfires}
                  onChange={(e) => setNotifyOnWildfires(e.target.checked)}
                  className="accent-electric-cyan h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5 cursor-pointer">
                <span>Severe Tropical Storms</span>
                <input
                  type="checkbox"
                  checked={notifyOnStorms}
                  onChange={(e) => setNotifyOnStorms(e.target.checked)}
                  className="accent-electric-cyan h-4 w-4"
                />
              </label>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-electric-cyan text-space-black font-semibold text-xs hover:bg-electric-cyan/90 transition-all shadow-glow"
              >
                {saved ? <Check className="w-4 h-4" /> : <BellRing className="w-4 h-4" />}
                <span>{saved ? 'Threshold Saved!' : 'Save Alert Thresholds'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
