"use client";

import { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Trash2, X, FileText } from "lucide-react";
import { cn, getCategoryLabel, CATEGORY_CONFIG, timeAgo, getCategoryColor } from "@/lib/utils";
import { useEarthSphereStore } from "@/lib/store";
import { useEvents } from "@/hooks/useEvents";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { WatchlistNotesModal } from "@/components/features/WatchlistNotesModal";
import type { EONETEvent } from "@/lib/types";
import { audioSynth } from "@/lib/audio";
import Link from "next/link";
import { durations } from "@/lib/design-tokens";

interface WatchlistPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WatchlistPanel({ isOpen, onClose }: WatchlistPanelProps) {
  const {
    watchedCategories,
    watchedEventIds,
    toggleWatchCategory,
    clearWatchlist,
    lastVisitTimestamp,
    updateLastVisit,
    eventNotes,
  } = useEarthSphereStore();

  const [notesModalEvent, setNotesModalEvent] = useState<EONETEvent | null>(null);

  const { data: eventsData, isLoading } = useEvents({ status: "all", days: 30 });

  useEffect(() => {
    if (isOpen) {
      updateLastVisit();
    }
  }, [isOpen, updateLastVisit]);

  const allEvents = eventsData?.events || [];

  const newEvents = useMemo(() => {
    return allEvents.filter(e => {
      if (e.geometry.length === 0) return false;
      const latestDate = new Date(e.geometry[e.geometry.length - 1].date).getTime();
      const isNew = latestDate > lastVisitTimestamp;
      const matchesCategory = e.categories.some(c => watchedCategories.includes(c.id));
      return isNew && matchesCategory;
    });
  }, [allEvents, lastVisitTimestamp, watchedCategories]);

  const bookmarkedEvents = useMemo(() => {
    return allEvents.filter(e => watchedEventIds.includes(e.id));
  }, [allEvents, watchedEventIds]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durations.fast }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-96 max-w-[90vw] z-50 bg-[var(--surface-primary)] border-l border-[var(--border-default)] flex flex-col shadow-2xl text-[var(--text-primary)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)] shrink-0">
              <div className="flex items-center gap-2 text-[var(--text-primary)]">
                <Bell size={18} className="text-[var(--electric-cyan)]" />
                <h2 className="font-bold text-lg">Watchlist</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Category Subscriptions */}
              <div className="p-4 border-b border-[var(--border-subtle)]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                  Watched Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(CATEGORY_CONFIG).map((catId) => {
                    const isWatched = watchedCategories.includes(catId);
                    return (
                      <button
                        key={catId}
                        onClick={() => {
                          toggleWatchCategory(catId);
                          audioSynth.playClick();
                        }}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border",
                          isWatched
                            ? "bg-[var(--electric-cyan)]/20 border-[var(--electric-cyan)]/50 text-[var(--electric-cyan)] shadow-sm"
                            : "bg-[var(--surface-secondary)] border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--surface-primary)] hover:text-[var(--text-primary)]"
                        )}
                      >
                        <CategoryIcon categoryId={catId} size={12} />
                        <span>{getCategoryLabel(catId)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* New Alerts */}
              <div className="p-4 border-b border-[var(--border-subtle)]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center justify-between">
                  <span>Recent Alerts</span>
                  {newEvents.length > 0 && (
                    <span className="bg-[var(--electric-cyan)]/20 text-[var(--electric-cyan)] px-1.5 py-0.5 rounded text-[10px] font-bold">
                      {newEvents.length} New
                    </span>
                  )}
                </h3>
                <div className="space-y-2">
                  {newEvents.length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)] text-center py-4">No new alerts in watched categories.</p>
                  ) : (
                    newEvents.slice(0, 5).map(event => (
                      <Link 
                        key={event.id} 
                        href={`/events/${event.id}`}
                        onClick={onClose}
                        className="block bg-[var(--surface-secondary)] hover:bg-[var(--surface-sunken)] border border-[var(--border-subtle)] hover:border-[var(--border-default)] p-3 rounded-xl transition-all shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase text-[var(--electric-cyan)]">
                            {getCategoryLabel(event.categories[0]?.id)}
                          </span>
                          <span className="text-[10px] text-[var(--text-muted)]">
                            {event.geometry[0] ? timeAgo(event.geometry[0].date) : ''}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--text-primary)] font-bold line-clamp-1">{event.title}</p>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* Bookmarked Events */}
              <div className="p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                  Bookmarked Events
                </h3>
                <div className="space-y-2">
                  {watchedEventIds.length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)] text-center py-4">No bookmarked events.</p>
                  ) : (
                    bookmarkedEvents.map(event => {
                      const noteData = eventNotes[event.id];
                      return (
                        <div key={event.id} className="flex flex-col bg-[var(--surface-secondary)] p-3 rounded-xl border border-[var(--border-subtle)] space-y-2 shadow-sm">
                          <div className="flex items-center justify-between">
                            <Link 
                              href={`/events/${event.id}`}
                              onClick={onClose}
                              className="flex items-center gap-3 overflow-hidden flex-1"
                            >
                              <div 
                                className="w-2 h-2 rounded-full shrink-0" 
                                style={{ backgroundColor: getCategoryColor(event.categories[0]?.id) }}
                              />
                              <p className="text-sm text-white/80 font-medium truncate hover:text-white">
                                {event.title}
                              </p>
                            </Link>

                            <button
                              onClick={() => setNotesModalEvent(event)}
                              className={cn(
                                "p-1.5 rounded-lg transition-colors ml-2 shrink-0",
                                noteData
                                  ? "text-electric-cyan bg-electric-cyan/10"
                                  : "text-white/30 hover:text-white hover:bg-white/10"
                              )}
                              title="Add / Edit Personal Note"
                            >
                              <FileText size={14} />
                            </button>
                          </div>

                          {noteData && (
                            <div className="pl-5 text-xs text-white/60 space-y-1">
                              {noteData.note && <p className="italic line-clamp-2">"{noteData.note}"</p>}
                              {noteData.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {noteData.tags.map(t => (
                                    <span key={t} className="px-1.5 py-0.5 rounded text-[9px] bg-electric-cyan/10 text-electric-cyan font-semibold">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 shrink-0">
              <button
                onClick={() => {
                  clearWatchlist();
                  audioSynth.playClick();
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Trash2 size={16} />
                <span>Clear Watchlist</span>
              </button>
            </div>
          </motion.div>

          <WatchlistNotesModal
            event={notesModalEvent}
            isOpen={!!notesModalEvent}
            onClose={() => setNotesModalEvent(null)}
          />
        </>
      )}
    </AnimatePresence>
  );
}
