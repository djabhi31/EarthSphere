"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, FileJson, FileSpreadsheet, X, Check, Copy, FileText, Printer } from "lucide-react";
import { cn, formatDate, getCategoryLabel } from "@/lib/utils";
import type { EONETEvent } from "@/lib/types";
import { audioSynth } from "@/lib/audio";
import { durations } from "@/lib/design-tokens";

interface ExportPanelProps {
  events: readonly EONETEvent[];
  filename?: string;
  className?: string;
}

export function ExportPanel({
  events,
  filename = "earthsphere-events",
  className,
}: ExportPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [successState, setSuccessState] = useState<string | null>(null);
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

  const showSuccess = (type: string) => {
    audioSynth.playClick();
    setSuccessState(type);
    setTimeout(() => {
      setSuccessState(null);
      setIsOpen(false);
    }, 2000);
  };

  const downloadFile = (content: string, ext: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const dateStr = new Date().toISOString().split("T")[0];
    a.download = `${filename}-${dateStr}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSuccess(ext);
  };

  const generateCSV = (events: readonly EONETEvent[]): string => {
    const headers = [
      "ID",
      "Title",
      "Status",
      "Category",
      "Latest Date",
      "Latitude",
      "Longitude",
      "Magnitude",
      "Magnitude Unit",
      "Sources",
    ];
    const rows = events.map((event) => {
      const latestGeo = event.geometry[event.geometry.length - 1];
      const coords = latestGeo?.coordinates as number[] | undefined;
      const category = event.categories[0];
      return [
        event.id,
        `"${event.title.replace(/"/g, '""')}"`,
        event.closed ? "Closed" : "Active",
        category ? getCategoryLabel(category.id) : "Unknown",
        latestGeo ? formatDate(latestGeo.date) : "",
        coords?.[1]?.toFixed(4) ?? "",
        coords?.[0]?.toFixed(4) ?? "",
        latestGeo?.magnitudeValue?.toString() ?? "",
        latestGeo?.magnitudeUnit ?? "",
        event.sources.map((s) => s.id).join("; "),
      ].join(",");
    });
    return [headers.join(","), ...rows].join("\n");
  };

  const handleExportCSV = () => {
    const csvContent = generateCSV(events);
    downloadFile(csvContent, "csv", "text/csv;charset=utf-8;");
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(events, null, 2);
    downloadFile(jsonContent, "json", "application/json");
  };

  const handlePrintPDF = () => {
    audioSynth.playClick();
    setIsOpen(false);
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCopySummary = () => {
    const active = events.filter((e) => !e.closed).length;
    const closed = events.length - active;
    
    const catMap = new Map<string, number>();
    events.forEach(e => {
      e.categories.forEach(c => catMap.set(c.id, (catMap.get(c.id) || 0) + 1));
    });
    const topCat = Array.from(catMap.entries()).sort((a, b) => b[1] - a[1])[0];

    const summary = `EarthSphere Export Summary:
Total Events: ${events.length}
Active: ${active} | Closed: ${closed}
Top Category: ${topCat ? `${getCategoryLabel(topCat[0])} (${topCat[1]})` : 'N/A'}
`;

    navigator.clipboard.writeText(summary).then(() => {
      showSuccess("copy");
    });
  };

  const ActionButton = ({ 
    icon: Icon, 
    title, 
    desc, 
    onClick, 
    successKey 
  }: { 
    icon: any; 
    title: string; 
    desc: string; 
    onClick: () => void;
    successKey: string;
  }) => (
    <button
      onClick={onClick}
      disabled={successState !== null}
      className="flex w-full items-start gap-3 rounded-lg p-3 text-left transition-all hover:bg-white/5 disabled:opacity-50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5">
        {successState === successKey ? (
          <Check className="h-5 w-5 text-electric-cyan" />
        ) : (
          <Icon className="h-5 w-5 text-white/70" />
        )}
      </div>
      <div>
        <div className="font-medium text-white/90">{title}</div>
        <div className="text-xs text-white/50">{desc}</div>
      </div>
    </button>
  );

  return (
    <div className={cn("relative z-50", className)} ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 rounded-xl bg-electric-cyan/10 px-4 py-2.5 text-sm font-semibold text-electric-cyan transition-all hover:bg-electric-cyan/20 border border-electric-cyan/20"
      >
        <Download size={16} />
        <span>Export</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: durations.fast }}
            className="absolute right-0 top-full mt-2 w-72 glass-strong rounded-2xl border border-white/10 p-2 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-2 px-3 pt-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Export Options
              </h3>
            </div>

            <ActionButton 
              icon={Printer} 
              title="Print PDF Report" 
              desc="Formatted PDF intelligence summary" 
              onClick={handlePrintPDF} 
              successKey="pdf"
            />
            
            <ActionButton 
              icon={FileSpreadsheet} 
              title="Download CSV" 
              desc="Spreadsheet format with key data points" 
              onClick={handleExportCSV} 
              successKey="csv"
            />
            
            <ActionButton 
              icon={FileJson} 
              title="Download JSON" 
              desc="Raw payload for programmatic use" 
              onClick={handleExportJSON} 
              successKey="json"
            />
            
            <div className="my-1 h-px w-full bg-white/10" />
            
            <ActionButton 
              icon={Copy} 
              title="Copy Summary" 
              desc="Quick text summary to clipboard" 
              onClick={handleCopySummary} 
              successKey="copy"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
