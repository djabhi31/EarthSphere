'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, Check } from 'lucide-react';
import { glass, textColors, radii, cssVars, springPresets } from '@/lib/design-tokens';
import { fadeInUp } from '@/lib/motion-presets';

/**
 * ShareSession component to copy current URL state
 */
export function ShareSession() {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors duration-300`}
        style={{ ...glass.subtle, color: textColors.secondary }}
      >
        <Link className="w-4 h-4" />
        <span className="font-medium">Share</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={fadeInUp}
            transition={springPresets.gentle}
            className={`absolute right-0 mt-2 w-64 origin-top-right rounded-xl p-4 z-50`}
            style={glass.default}
          >
            <div className="flex flex-col gap-3">
              <h3 className={`font-semibold text-sm`} style={{ color: textColors.primary }}>Share Current View</h3>
              <p className={`text-xs`} style={{ color: textColors.muted }}>Copy the link below to share your current filters and view state.</p>
              
              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="text" 
                  readOnly 
                  value={typeof window !== 'undefined' ? window.location.href : ''} 
                  className={`flex-1 bg-white/5 border border-white/10 rounded-md py-1.5 px-2 text-xs focus:outline-none`}
                  style={{ color: textColors.secondary }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className={`p-1.5 rounded-md ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 hover:bg-white/20 text-white'} transition-colors duration-200`}
                  title="Copy link"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
