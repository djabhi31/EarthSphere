'use client';

import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { Play, Pause, FastForward, Clock, RotateCcw } from 'lucide-react';

interface TimeScrubberProps {
  time: Date;
  setTime: Dispatch<SetStateAction<Date>>;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
}

export function TimeScrubber({ time, setTime, isPlaying, setIsPlaying }: TimeScrubberProps) {
  // Use a ref for the interval to manage playback
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        // Advance time by 1 minute per tick (fast forwarding to see satellite movement)
        setTime(prev => new Date(prev.getTime() + 60000));
      }, 50); // Tick every 50ms (so ~20 mins per second)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, setTime]);

  // Jump 1 day forward/backward
  const jumpTime = (days: number) => {
    const newTime = new Date(time);
    newTime.setDate(time.getDate() + days);
    setTime(newTime);
  };

  return (
    <div className="w-full bg-black/80 backdrop-blur-md border-t border-white/10 px-6 py-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">Simulated UTC Time</span>
          <div className="flex items-baseline gap-3">
            <span className="text-xl font-light tracking-widest font-mono text-white">
              {time.toISOString().split('T')[0]}
            </span>
            <span className="text-lg font-mono text-emerald-400">
              {time.toISOString().split('T')[1].substring(0, 8)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => jumpTime(-1)}
              className="text-white/40 hover:text-white transition-colors p-1"
            >
              <RotateCcw size={16} />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-black hover:bg-emerald-400 transition-colors"
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
            </button>
            <button 
              onClick={() => jumpTime(1)}
              className="text-white/40 hover:text-white transition-colors p-1"
            >
              <FastForward size={16} />
            </button>
          </div>
          
          <div className="flex flex-col gap-1 w-32 border-l border-white/10 pl-6">
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em]">Playback Rate</span>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">{isPlaying ? '10X SPEED' : 'REAL-TIME'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
