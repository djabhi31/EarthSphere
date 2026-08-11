'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, X } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const SHORTCUTS = [
  { key: '/', description: 'Focus event search bar' },
  { key: 'M', description: 'Navigate to 3D Globe Map' },
  { key: 'E', description: 'Navigate to Events Explorer' },
  { key: 'A', description: 'Navigate to Analytics Dashboard' },
  { key: '?', description: 'Toggle keyboard shortcuts cheat sheet' },
  { key: 'Esc', description: 'Close modals & slide panels' },
];

export function ShortcutsModal({ isOpen: externalOpen, onClose: externalClose }: ShortcutsModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = externalOpen ?? internalOpen;
  const onClose = externalClose ?? (() => setInternalOpen(false));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setInternalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

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
              <Keyboard className="w-5 h-5 text-electric-cyan" />
              <h3 className="text-lg font-bold text-white">Keyboard Shortcuts</h3>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            {SHORTCUTS.map((s) => (
              <div key={s.key} className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs">
                <span className="text-white/70">{s.description}</span>
                <kbd className="px-2 py-1 rounded bg-white/10 border border-white/20 font-mono text-[11px] font-bold text-electric-cyan">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
