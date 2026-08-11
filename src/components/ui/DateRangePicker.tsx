"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { durations } from "@/lib/design-tokens";

export interface DateRangePickerProps {
  startDate: string | null;
  endDate: string | null;
  onDateChange: (start: string | null, end: string | null) => void;
}

export function DateRangePicker({
  startDate,
  endDate,
  onDateChange,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const presetRanges = [
    { label: "Last 7 days", days: 7 },
    { label: "Last 30 days", days: 30 },
    { label: "Last 3 months", days: 90 },
    { label: "This year", days: 365 },
  ];

  const handlePresetClick = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    
    onDateChange(
      start.toISOString().split("T")[0],
      end.toISOString().split("T")[0]
    );
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateChange(null, null);
    setIsOpen(false);
  };

  const hasDate = startDate || endDate;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-9 items-center gap-2 rounded-lg border px-3 text-sm transition-all",
          hasDate
            ? "border-electric-cyan/50 bg-electric-cyan/10 text-electric-cyan"
            : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
        )}
      >
        <CalendarIcon size={14} />
        <span>
          {startDate && endDate
            ? `${startDate} - ${endDate}`
            : startDate
            ? `From ${startDate}`
            : endDate
            ? `Until ${endDate}`
            : "Select Dates"}
        </span>
        {hasDate && (
          <div
            role="button"
            tabIndex={0}
            onClick={handleClear}
            className="ml-1 rounded-full p-0.5 hover:bg-white/10"
          >
            <X size={12} />
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: durations.fast }}
            className="absolute left-0 top-full mt-2 w-72 z-50 glass-strong rounded-xl border border-white/10 p-4 shadow-2xl"
          >
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-white/50 font-medium">Custom Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={startDate || ""}
                    onChange={(e) => onDateChange(e.target.value || null, endDate)}
                    className="w-full rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-sm text-white focus:border-electric-cyan focus:outline-none"
                  />
                  <span className="text-white/30">-</span>
                  <input
                    type="date"
                    value={endDate || ""}
                    onChange={(e) => onDateChange(startDate, e.target.value || null)}
                    className="w-full rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-sm text-white focus:border-electric-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="h-px w-full bg-white/10" />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50 font-medium mb-1">Quick Presets</label>
                {presetRanges.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handlePresetClick(preset.days)}
                    className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
