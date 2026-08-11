"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Globe,
  Activity,
  BarChart3,
  Info,
  Volume2,
  VolumeX,
  X,
  CornerDownLeft,
} from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { audioSynth } from "@/lib/audio";
import { getCategoryColor } from "@/lib/utils";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [, startTransition] = useTransition();

  const { data: eventsData } = useEvents({ status: "open", limit: 50 });
  const eventsList = eventsData?.events || [];

  // Filter events based on search query
  const filteredEvents = query.trim() === ""
    ? eventsList.slice(0, 6)
    : eventsList.filter((e) =>
        e.title.toLowerCase().includes(query.toLowerCase()) ||
        e.categories.some((c) => c.title.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 8);

  // Close on Escape or shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        audioSynth.playClick();
        if (isOpen) onClose();
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNavigate = (path: string) => {
    audioSynth.playClick();
    onClose();
    startTransition(() => {
      router.push(path);
    });
  };

  const handleToggleSound = () => {
    audioSynth.toggleMute();
    audioSynth.playClick();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Command Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-electric-cyan/30 bg-[#0b1020]/95 shadow-2xl backdrop-blur-2xl hud-corner"
        >
          {/* Top Search Input Bar */}
          <div className="flex items-center border-b border-white/10 px-4 py-3.5">
            <Search className="mr-3 h-5 w-5 text-electric-cyan" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search natural events, categories, maps, or commands... (e.g. 'Wildfire')"
              className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
              autoFocus
            />
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body Section */}
          <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
            {/* Quick Navigation Section */}
            <div>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-white/40">
                Quick Navigation
              </span>
              <div className="mt-1 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                <button
                  onClick={() => handleNavigate("/events")}
                  className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:border-electric-cyan/40 hover:bg-electric-cyan/10 hover:text-white transition-all"
                >
                  <Activity className="h-4 w-4 text-electric-cyan" />
                  Live Events
                </button>
                <button
                  onClick={() => handleNavigate("/map")}
                  className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:border-electric-cyan/40 hover:bg-electric-cyan/10 hover:text-white transition-all"
                >
                  <Globe className="h-4 w-4 text-ice-blue" />
                  3D World Map
                </button>
                <button
                  onClick={() => handleNavigate("/analytics")}
                  className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:border-electric-cyan/40 hover:bg-electric-cyan/10 hover:text-white transition-all"
                >
                  <BarChart3 className="h-4 w-4 text-cosmic-purple" />
                  Threat Analytics
                </button>
                <button
                  onClick={() => handleNavigate("/about")}
                  className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:border-electric-cyan/40 hover:bg-electric-cyan/10 hover:text-white transition-all"
                >
                  <Info className="h-4 w-4 text-solar-orange" />
                  About Platform
                </button>
              </div>
            </div>

            {/* Matching Natural Disasters / Events */}
            <div>
              <div className="flex items-center justify-between px-3 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                  {query ? "Search Results" : "Recent Live Disasters"}
                </span>
                <span className="text-[10px] text-electric-cyan">
                  {filteredEvents.length} events
                </span>
              </div>
              <div className="space-y-1">
                {filteredEvents.length === 0 ? (
                  <div className="py-6 text-center text-xs text-white/40">
                    No matching disasters found for &quot;{query}&quot;. Try &quot;Wildfires&quot; or &quot;Storms&quot;.
                  </div>
                ) : (
                  filteredEvents.map((evt) => {
                    const catId = evt.categories[0]?.id || "wildfires";
                    const color = getCategoryColor(catId);
                    return (
                      <button
                        key={evt.id}
                        onClick={() => handleNavigate(`/events?id=${evt.id}`)}
                        className="group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors hover:bg-white/10"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                          />
                          <div>
                            <p className="font-semibold text-white group-hover:text-electric-cyan line-clamp-1">
                              {evt.title}
                            </p>
                            <span className="text-[10px] text-white/40">
                              {evt.categories[0]?.title} • {new Date(evt.geometry[0]?.date || Date.now()).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <CornerDownLeft className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-electric-cyan transition-opacity" />
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* System Audio & Actions */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between px-3 text-xs text-white/50">
              <button
                onClick={handleToggleSound}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                {audioSynth.isMuted() ? (
                  <>
                    <VolumeX className="h-3.5 w-3.5 text-solar-orange" />
                    <span>Sound Muted (Click to enable)</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5 text-electric-cyan" />
                    <span>Sound Effects Active</span>
                  </>
                )}
              </button>
              <div className="flex items-center gap-1 text-[10px] text-white/30">
                <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono">ESC</kbd> to close
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
