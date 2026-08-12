"use client";

import { useEffect, useCallback, useRef, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, RotateCcw, ChevronUp, ChevronDown } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { EONETEvent } from "@/lib/types";
import { useEarthSphereStore, type PlaybackSpeed } from "@/lib/store";
import { audioSynth } from "@/lib/audio";

interface TimelinePlayerProps {
  events: EONETEvent[];
  onTimelineFilter: (visibleEvents: EONETEvent[]) => void;
  className?: string;
}

export function TimelinePlayer({
  events,
  onTimelineFilter,
  className,
}: TimelinePlayerProps) {
  const {
    timelinePlaying: isPlaying,
    setTimelinePlaying: setIsPlaying,
    timelineSpeed: speed,
    setTimelineSpeed: setSpeed,
    timelineCurrentDate: currentDateStr,
    setTimelineCurrentDate: setCurrentDateStr,
    timelineStartDate,
    timelineEndDate,
    setTimelineBounds,
  } = useEarthSphereStore();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Compute date bounds from all events
  const { minTime, maxTime } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    events.forEach((e) => {
      e.geometry.forEach((g) => {
        const time = new Date(g.date).getTime();
        if (time < min) min = time;
        if (time > max) max = time;
      });
    });
    // Add some padding to bounds
    if (min === Infinity || max === -Infinity) {
       const fallbackMax = new Date('2026-01-01').getTime();
       return { minTime: fallbackMax - 30 * 24 * 3600 * 1000, maxTime: fallbackMax };
    }
    return { minTime: min, maxTime: max };
  }, [events]);

  useEffect(() => {
    if (minTime !== Infinity && maxTime !== -Infinity) {
      if (!timelineStartDate || !timelineEndDate) {
        setTimelineBounds(new Date(minTime).toISOString(), new Date(maxTime).toISOString());
      }
    }
  }, [minTime, maxTime, timelineStartDate, timelineEndDate, setTimelineBounds]);

  const currentTime = currentDateStr ? new Date(currentDateStr).getTime() : maxTime;

  // Filter events based on current time
  useEffect(() => {
    if (minTime === Infinity) return;
    const visibleEvents = events.filter((e) => {
      // Event is visible if its FIRST geometry date is <= current time
      if (!e.geometry.length) return false;
      const firstGeoTime = new Date(e.geometry[0].date).getTime();
      return firstGeoTime <= currentTime;
    });
    onTimelineFilter(visibleEvents);
  }, [currentTime, events, onTimelineFilter, minTime]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
    audioSynth.playClick();
  }, [isPlaying, setIsPlaying]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    if (timelineStartDate) {
      setCurrentDateStr(timelineStartDate);
    }
    audioSynth.playClick();
  }, [setIsPlaying, timelineStartDate, setCurrentDateStr]);

  // Playback loop
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        // Advance time: Base is approx 1/1000th of total range per tick at 1x
        const totalDuration = maxTime - minTime;
        if (totalDuration <= 0) return;
        
        const step = (totalDuration / 1000) * speed;
        const nextTime = currentTime + step;

        if (nextTime >= maxTime) {
          setCurrentDateStr(new Date(maxTime).toISOString());
          setIsPlaying(false);
        } else {
          setCurrentDateStr(new Date(nextTime).toISOString());
        }
      }, 50); // 20 ticks per second
    } else if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }

    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, currentTime, maxTime, minTime, speed, setCurrentDateStr, setIsPlaying]);

  const progressPercent = maxTime > minTime ? ((currentTime - minTime) / (maxTime - minTime)) * 100 : 100;

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = parseFloat(e.target.value);
    const newTime = minTime + (maxTime - minTime) * (percent / 100);
    setCurrentDateStr(new Date(newTime).toISOString());
    // Auto-pause if scrubbing
    if (isPlaying) setIsPlaying(false);
  };

  const visibleCount = useMemo(() => {
    return events.filter((e) => {
      if (!e.geometry.length) return false;
      const firstGeoTime = new Date(e.geometry[0].date).getTime();
      return firstGeoTime <= currentTime;
    }).length;
  }, [currentTime, events]);

  return (
    <div className={cn("fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl", className)}>
      <motion.div 
        layout
        className="glass-strong border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-center justify-between p-2 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-4 flex-1">
            <button
              onClick={handlePlayPause}
              className="p-2 rounded-full bg-electric-cyan/20 text-electric-cyan hover:bg-electric-cyan/30 transition-colors shrink-0"
              aria-label={isPlaying ? "Pause timeline" : "Play timeline"}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              aria-label="Reset timeline"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            
            {!isCollapsed && (
              <>
                <div className="h-4 w-px bg-white/10 hidden sm:block" />
                <div className="hidden sm:flex items-center gap-1 bg-black/20 rounded-lg p-1 shrink-0">
                  {([1, 2, 4] as PlaybackSpeed[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={cn(
                        "px-2 py-1 text-xs font-semibold rounded-md transition-colors",
                        speed === s ? "bg-white/10 text-white" : "text-white/40 hover:text-white/80"
                      )}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="flex-1 px-2 relative min-w-0">
              <style>{`
                .timeline-scrubber {
                  -webkit-appearance: none;
                  appearance: none;
                  background: transparent;
                  width: 100%;
                  height: 24px;
                  margin: 0;
                }
                .timeline-scrubber::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  width: 14px;
                  height: 14px;
                  border-radius: 50%;
                  background: #00d4aa;
                  box-shadow: 0 0 10px rgba(0,212,170,0.5);
                  cursor: pointer;
                  margin-top: -5px;
                }
                .timeline-scrubber::-webkit-slider-runnable-track {
                  height: 4px;
                  border-radius: 2px;
                  background: rgba(255,255,255,0.1);
                }
              `}</style>
              <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-1 rounded-full overflow-hidden pointer-events-none">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-electric-cyan to-purple-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progressPercent}
                onChange={handleScrubberChange}
                className="timeline-scrubber relative z-10 block"
                aria-label="Timeline scrubber"
              />
            </div>
            
            {!isCollapsed && (
              <div className="flex flex-col shrink-0 text-right min-w-[100px]">
                <span className="text-sm font-bold text-white tabular-nums">
                  {currentDateStr ? formatDate(currentDateStr).split(",")[0] : "---"}
                </span>
                <span className="text-[10px] text-white/50 uppercase tracking-wide">
                  {visibleCount} / {events.length} Events
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-2 p-1.5 text-white/40 hover:text-white/80 rounded-md hover:bg-white/5 transition-colors"
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
