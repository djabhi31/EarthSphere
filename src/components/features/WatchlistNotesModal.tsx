'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Tag, Save, X, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEarthSphereStore } from '@/lib/store';
import type { EONETEvent } from '@/lib/types';
import { audioSynth } from '@/lib/audio';

interface WatchlistNotesModalProps {
  event: EONETEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_TAGS = ['High Priority', 'Research Target', 'Urgent Monitoring', 'Field Study', 'Archive'];

export function WatchlistNotesModal({ event, isOpen, onClose }: WatchlistNotesModalProps) {
  const { eventNotes, setEventNote, deleteEventNote } = useEarthSphereStore();
  const [noteText, setNoteText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (event && eventNotes[event.id]) {
      setNoteText(eventNotes[event.id].note || '');
      setSelectedTags(eventNotes[event.id].tags || []);
    } else {
      setNoteText('');
      setSelectedTags([]);
    }
  }, [event, eventNotes]);

  if (!isOpen || !event) return null;

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    audioSynth.playClick();
  };

  const handleSave = () => {
    setEventNote(event.id, noteText, selectedTags);
    audioSynth.playClick();
    onClose();
  };

  const handleDelete = () => {
    deleteEventNote(event.id);
    audioSynth.playClick();
    onClose();
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
          className="relative z-10 w-full max-w-lg glass-strong border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-electric-cyan" />
              <h3 className="text-lg font-bold text-white">Event Note & Custom Tags</h3>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-white/60 mb-4 line-clamp-1 font-semibold">{event.title}</p>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-white/50 font-medium block mb-1">Custom Notes</label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add research observations, priority notes, or field comments..."
                rows={4}
                className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white placeholder:text-white/30 focus:border-electric-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-white/50 font-medium block mb-2">Tag Badges</label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => handleToggleTag(tag)}
                      className={cn(
                        'px-2.5 py-1 rounded-full text-xs font-semibold border transition-all',
                        isSelected
                          ? 'bg-electric-cyan/20 border-electric-cyan text-electric-cyan'
                          : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                      )}
                    >
                      + {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              {eventNotes[event.id] ? (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Note</span>
                </button>
              ) : <div />}

              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-electric-cyan text-space-black font-semibold text-xs hover:bg-electric-cyan/90 transition-all shadow-glow"
              >
                <Save className="w-4 h-4" />
                <span>Save Note</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
