'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, AlertTriangle, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { audioSynth } from '@/lib/audio';
import { cn } from '@/lib/utils';

/**
 * ThemeToggle
 * Switches between dark and light modes.
 * Prompts user with an interactive warning modal before enabling experimental Light Mode.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-transparent" />
    );
  }

  const isDark = theme === 'dark' || theme === 'system';

  const handleToggleClick = () => {
    audioSynth.playClick();
    if (isDark) {
      // User is trying to switch to Light Mode -> Show confirmation warning modal
      setShowWarningModal(true);
    } else {
      // Switch back to Dark Mode immediately
      setTheme('dark');
    }
  };

  const confirmLightMode = () => {
    audioSynth.playClick();
    setTheme('light');
    setShowWarningModal(false);
  };

  const cancelLightMode = () => {
    audioSynth.playClick();
    setShowWarningModal(false);
  };

  return (
    <>
      <button
        onClick={handleToggleClick}
        onMouseEnter={() => audioSynth.playHover()}
        aria-label="Toggle theme"
        title={isDark ? "Switch to Light Mode (Experimental)" : "Switch to Dark Mode (Recommended)"}
        className="group relative flex h-8 w-8 items-center justify-center rounded-xl transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4aa]"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
              transition={{ duration: 0.18, ease: 'easeInOut' }}
            >
              <Sun className="h-4 w-4 text-white/70 transition-colors group-hover:text-amber-300" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -45, scale: 0.8 }}
              transition={{ duration: 0.18, ease: 'easeInOut' }}
            >
              <Moon className="h-4 w-4 text-amber-400 group-hover:text-amber-300 dark:text-white/70" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Light Mode Under Development Warning Modal */}
      <AnimatePresence>
        {showWarningModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-md w-full glass-strong rounded-2xl border border-amber-500/30 p-6 shadow-2xl bg-[var(--space-black)] text-[var(--text-primary)]"
            >
              <button
                onClick={cancelLightMode}
                className="absolute top-4 right-4 p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white tracking-tight">Light Mode Under Development</h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                    Experimental Feature
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-white/80 leading-relaxed mb-6 bg-white/5 p-3.5 rounded-xl border border-white/5">
                <p>
                  Light Mode is currently under active development. NASA WebGL shaders, 3D Earth globes, satellite contrast maps, and space UI elements are optimized for <strong>Dark Mode</strong>.
                </p>
                <p className="text-white/60">
                  Some visual components or colors may not display perfectly in Light Mode. Would you still like to proceed?
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  onClick={cancelLightMode}
                  className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-[var(--electric-cyan)] text-[var(--space-black)] font-bold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[var(--electric-cyan)]/20"
                >
                  <ShieldCheck size={16} />
                  Keep Dark Mode
                </button>
                <button
                  onClick={confirmLightMode}
                  className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white font-medium text-xs border border-white/10 transition-all flex items-center justify-center gap-1.5"
                >
                  Proceed Anyway
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
