'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, X, Check } from 'lucide-react';
import { glass, textColors, radii, springPresets } from '@/lib/design-tokens';
import { fadeInUp } from '@/lib/motion-presets';
import { FilterState } from '@/lib/types';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export interface SavedView {
  id: string;
  name: string;
  date: string;
  filters: FilterState;
}

interface SavedViewsProps {
  currentFilters: FilterState;
  onApplyView?: (filters: FilterState) => void;
}

/**
 * SavedViews component to save and apply view filter states
 */
export function SavedViews({ currentFilters, onApplyView }: SavedViewsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [newViewName, setNewViewName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loaded = localStorage.getItem('earthsphere_saved_views');
    if (loaded) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSavedViews(JSON.parse(loaded));
      } catch (err) {
        console.error('Failed to parse saved views', err);
      }
    }
  }, []);

  const handleSaveView = () => {
    if (!newViewName.trim()) return;

    const newView: SavedView = {
      id: Date.now().toString(),
      name: newViewName.trim(),
      date: new Date().toISOString(),
      filters: currentFilters,
    };

    const updatedViews = [newView, ...savedViews].slice(0, 10);
    setSavedViews(updatedViews);
    localStorage.setItem('earthsphere_saved_views', JSON.stringify(updatedViews));
    
    setNewViewName('');
    setIsSaving(false);
  };

  const handleDeleteView = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedViews = savedViews.filter(v => v.id !== id);
    setSavedViews(updatedViews);
    localStorage.setItem('earthsphere_saved_views', JSON.stringify(updatedViews));
  };

  const handleApplyView = (view: SavedView) => {
    if (onApplyView) {
      onApplyView(view.filters);
    } else {
      // Build query string manually from view.filters if we want to change URL
      const params = new URLSearchParams();
      if (view.filters.searchQuery) params.set('search', view.filters.searchQuery);
      if (view.filters.status) params.set('status', view.filters.status);
      if (view.filters.categories?.length) {
        params.set('categories', view.filters.categories.join(','));
      }
      router.push(`${pathname}?${params.toString()}`);
    }
    setIsOpen(false);
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
        <Bookmark className="w-4 h-4" />
        <span className="font-medium">Saved Views</span>
        {savedViews.length > 0 && (
          <span className="ml-1 bg-white/10 px-1.5 py-0.5 rounded-full text-[10px]">
            {savedViews.length}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={fadeInUp}
            transition={springPresets.gentle}
            className={`absolute right-0 mt-2 w-80 origin-top-right rounded-xl z-50 overflow-hidden flex flex-col`}
            style={glass.default}
          >
            <div className="p-4 border-b border-white/5">
              {!isSaving ? (
                <button
                  onClick={() => setIsSaving(true)}
                  className={`w-full flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors`}
                  style={{ color: textColors.primary }}
                  disabled={savedViews.length >= 10}
                >
                  <Bookmark className="w-4 h-4" />
                  Save Current View
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={newViewName}
                    onChange={(e) => setNewViewName(e.target.value)}
                    placeholder="View name..."
                    className={`w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/20`}
                    style={{ color: textColors.primary }}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveView();
                      if (e.key === 'Escape') setIsSaving(false);
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsSaving(false)}
                      className={`flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs`}
                      style={{ color: textColors.secondary }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveView}
                      disabled={!newViewName.trim()}
                      className={`flex-1 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs disabled:opacity-50`}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10">
              {savedViews.length === 0 ? (
                <div className={`p-4 text-center text-sm`} style={{ color: textColors.muted }}>
                  No saved views yet.
                </div>
              ) : (
                <ul className="space-y-1">
                  {savedViews.map((view) => (
                    <li key={view.id}>
                      <button
                        onClick={() => handleApplyView(view)}
                        className={`w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group`}
                      >
                        <div className="flex flex-col overflow-hidden">
                          <span className={`text-sm font-medium truncate`} style={{ color: textColors.primary }}>
                            {view.name}
                          </span>
                          <span className={`text-[10px]`} style={{ color: textColors.muted }}>
                            {new Date(view.date).toLocaleDateString()} • {view.filters.status}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleDeleteView(view.id, e)}
                          className={`p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-white/10 text-white/50 hover:text-white transition-all`}
                          title="Delete view"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
