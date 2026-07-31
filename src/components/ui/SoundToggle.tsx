"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { audioSynth } from "@/lib/audio";
import { cn } from "@/lib/utils";

interface SoundToggleProps {
  className?: string;
}

export function SoundToggle({ className }: SoundToggleProps) {
  const [muted, setMuted] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- TODO: Restructure effect to avoid sync setState
    setIsMounted(true);
    setMuted(audioSynth.isMuted());
  }, []);

  const handleToggle = () => {
    audioSynth.playClick();
    const newMute = audioSynth.toggleMute();
    setMuted(newMute);
  };

  if (!isMounted) return null;

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "group relative flex items-center justify-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all duration-300 select-none cursor-pointer focus:outline-none",
        muted
          ? "border-white/10 bg-white/5 text-white/40 hover:border-white/20 hover:text-white/60"
          : "border-[#00d4aa]/30 bg-[#00d4aa]/10 text-[#00d4aa] hover:border-[#00d4aa]/50 hover:bg-[#00d4aa]/15"
      )}
      aria-label={muted ? "Unmute interface sound effects" : "Mute interface sound effects"}
      onMouseEnter={() => !muted && audioSynth.playHover()}
    >
      {muted ? (
        <VolumeX size={14} className="transition-transform duration-300 group-hover:scale-110" />
      ) : (
        <Volume2 size={14} className="transition-transform duration-300 group-hover:scale-110" />
      )}
      <span className="hidden sm:inline">Audio</span>

      {/* Premium mini-sound bars animation */}
      {!muted && (
        <div className="flex h-2.5 items-end gap-[2px] px-0.5">
          <span className="w-[1.5px] rounded-full bg-[#00d4aa] animate-sound-bar-1" style={{ height: "40%" }}></span>
          <span className="w-[1.5px] rounded-full bg-[#00d4aa] animate-sound-bar-2" style={{ height: "80%" }}></span>
          <span className="w-[1.5px] rounded-full bg-[#00d4aa] animate-sound-bar-3" style={{ height: "50%" }}></span>
        </div>
      )}

      {/* CSS anim bars keyframes styling inject */}
      <style jsx global>{`
        @keyframes sound-bar-anim {
          0%, 100% { height: 30%; }
          50% { height: 100%; }
        }
        .animate-sound-bar-1 {
          animation: sound-bar-anim 0.8s ease-in-out infinite;
        }
        .animate-sound-bar-2 {
          animation: sound-bar-anim 0.6s ease-in-out infinite 0.15s;
        }
        .animate-sound-bar-3 {
          animation: sound-bar-anim 0.7s ease-in-out infinite 0.3s;
        }
      `}</style>
    </button>
  );
}
