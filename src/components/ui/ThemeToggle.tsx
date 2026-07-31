'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { audioSynth } from '@/lib/audio';

/**
 * ThemeToggle
 * Premium button for switching between light and dark modes.
 * Uses custom ThemeProvider context and audioSynth for interactive feedback.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder to avoid layout shift before hydration
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-transparent" />
    );
  }

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    audioSynth.playClick();
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      onMouseEnter={() => audioSynth.playHover()}
      aria-label="Toggle theme"
      className="group relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4aa]"
    >
      <div className="absolute inset-0 rounded-lg border border-white/5 opacity-0 transition-opacity group-hover:opacity-100 dark:border-white/10" />
      
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <Sun className="h-[22px] w-[22px] text-white/60 transition-colors group-hover:text-white" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -45, scale: 0.8 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <Moon className="h-[22px] w-[22px] text-black/60 transition-colors group-hover:text-black dark:text-white/60 dark:group-hover:text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
