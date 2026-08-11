"use client";

import { motion } from "motion/react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useEarthSphereStore } from "@/lib/store";
import { audioSynth } from "@/lib/audio";
import { cn } from "@/lib/utils";

interface WatchlistButtonProps {
  eventId: string;
  className?: string;
}

export function WatchlistButton({ eventId, className }: WatchlistButtonProps) {
  const isWatched = useEarthSphereStore((state) => state.isEventWatched(eventId));
  const toggleWatchEvent = useEarthSphereStore((state) => state.toggleWatchEvent);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchEvent(eventId);
    audioSynth.playClick();
  };

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={handleToggle}
      className={cn(
        "relative z-20 p-1.5 rounded-lg transition-colors pointer-events-auto",
        isWatched
          ? "text-electric-cyan bg-electric-cyan/10"
          : "text-white/30 hover:text-white/60 hover:bg-white/5",
        className
      )}
      aria-label={isWatched ? "Remove from watchlist" : "Add to watchlist"}
    >
      {isWatched ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
    </motion.button>
  );
}
