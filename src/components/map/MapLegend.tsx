import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { CATEGORY_CONFIG, getCategoryLabel } from '@/lib/utils';
import { slideUp } from '@/lib/motion-presets';

/**
 * Props for MapLegend component
 */
export interface MapLegendProps {
  categories: typeof CATEGORY_CONFIG;
}

/**
 * MapLegend Component
 * Glassmorphism floating legend for event categories.
 */
export function MapLegend({ categories }: MapLegendProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div 
      className="absolute bottom-6 left-6 md:left-88 z-30 w-48"
      {...slideUp}
    >
      <div className="glass-strong rounded-2xl overflow-hidden border border-border-subtle shadow-depth-md">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 text-text-primary hover:bg-surface-base transition-colors"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-electric-cyan" />
            <span className="text-xs font-semibold">Legend</span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-muted" />
          )}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden bg-surface-elevated/50"
            >
              <div className="p-3 pt-0 space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                {Object.values(categories).map(cat => (
                  <div key={cat.id} className="flex items-center gap-2 text-xs text-text-secondary">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="truncate">{getCategoryLabel(cat.id)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
