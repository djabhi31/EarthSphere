'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Copy, Check, X, ShieldAlert, Cpu, FileText, Globe, Flame } from 'lucide-react';
import { cn, formatDate, getCategoryLabel } from '@/lib/utils';
import { calculateSeverity } from '@/lib/severity';
import type { EONETEvent } from '@/lib/types';
import { audioSynth } from '@/lib/audio';

interface AIBriefingModalProps {
  events: readonly EONETEvent[];
  isOpen: boolean;
  onClose: () => void;
}

export function AIBriefingModal({ events, isOpen, onClose }: AIBriefingModalProps) {
  const [copied, setCopied] = useState(false);

  const briefingData = useMemo(() => {
    if (!events.length) return null;

    const activeEvents = events.filter((e) => !e.closed);
    const closedEvents = events.filter((e) => e.closed);

    // Calculate severity for all
    const severityList = events.map((e) => ({
      event: e,
      info: calculateSeverity(e),
    }));

    const catastrophicCount = severityList.filter((s) => s.info.level === 5).length;
    const severeCount = severityList.filter((s) => s.info.level === 4).length;
    const moderateCount = severityList.filter((s) => s.info.level === 3).length;

    // Top 3 highest severity events
    const topHazards = [...severityList]
      .sort((a, b) => b.info.score - a.info.score)
      .slice(0, 3);

    // Category distribution
    const categoryCounts: Record<string, number> = {};
    events.forEach((e) => {
      const cat = e.categories[0]?.id || 'unknown';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const dominantCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];

    const todayStr = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return {
      dateStr: todayStr,
      totalCount: events.length,
      activeCount: activeEvents.length,
      closedCount: closedEvents.length,
      catastrophicCount,
      severeCount,
      moderateCount,
      topHazards,
      dominantCatLabel: dominantCategory ? getCategoryLabel(dominantCategory[0]) : 'N/A',
      dominantCatCount: dominantCategory ? dominantCategory[1] : 0,
    };
  }, [events]);

  if (!isOpen || !briefingData) return null;

  const briefingText = `
🌍 EARTHSPHERE AI EXECUTIVE INTELLIGENCE BRIEFING
Generated: ${briefingData.dateStr}
--------------------------------------------------
SUMMARY OVERVIEW:
- Total Events Analyzed: ${briefingData.totalCount}
- Currently Active Hazards: ${briefingData.activeCount}
- Dominant Category: ${briefingData.dominantCatLabel} (${briefingData.dominantCatCount} events)

HAZARD SEVERITY BREAKDOWN:
- Level 5 (Catastrophic): ${briefingData.catastrophicCount}
- Level 4 (Severe): ${briefingData.severeCount}
- Level 3 (Moderate): ${briefingData.moderateCount}

CRITICAL HAZARD WATCHLIST:
${briefingData.topHazards
  .map(
    (h, idx) =>
      `${idx + 1}. ${h.event.title} [Lvl ${h.info.level} - ${h.info.label}]\n   Category: ${getCategoryLabel(
        h.event.categories[0]?.id || ''
      )} | Score: ${h.info.score}/100`
  )
  .join('\n')}

ACTIONABLE RECOMMENDATIONS:
- Prioritize real-time satellite tracking for Level 4+ severe wildfires and tropical cyclones.
- Monitor Pacific and Himalayan seismic belts for potential compound hazards.
--------------------------------------------------
EarthSphere AI Orbital Network System
`.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(briefingText);
    setCopied(true);
    audioSynth.playClick();
    setTimeout(() => setCopied(false), 2000);
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
          className="relative z-10 w-full max-w-3xl glass-strong border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#00d4aa] to-[#7c3aed] text-white shadow-glow">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">AI Disaster Intelligence Briefing</h2>
                  <span className="px-2 py-0.5 rounded-full bg-electric-cyan/10 border border-electric-cyan/30 text-[10px] text-electric-cyan font-mono font-semibold">
                    AUTONOMOUS SYNTHESIS
                  </span>
                </div>
                <p className="text-xs text-white/50">{briefingData.dateStr}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-black/30 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] font-semibold text-white/40 uppercase block">Active Threats</span>
              <span className="text-xl font-bold text-electric-cyan">{briefingData.activeCount}</span>
            </div>
            <div className="bg-black/30 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] font-semibold text-white/40 uppercase block">Catastrophic (L5)</span>
              <span className="text-xl font-bold text-red-400">{briefingData.catastrophicCount}</span>
            </div>
            <div className="bg-black/30 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] font-semibold text-white/40 uppercase block">Severe (L4)</span>
              <span className="text-xl font-bold text-orange-400">{briefingData.severeCount}</span>
            </div>
            <div className="bg-black/30 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] font-semibold text-white/40 uppercase block">Dominant Hazard</span>
              <span className="text-xs font-bold text-white truncate block">{briefingData.dominantCatLabel}</span>
            </div>
          </div>

          {/* Top Hazards List */}
          <div className="mb-6 space-y-2">
            <span className="text-xs font-bold text-white/50 uppercase tracking-wider block">
              Top High-Impact Hazards
            </span>
            <div className="space-y-2">
              {briefingData.topHazards.map((h, i) => (
                <div
                  key={h.event.id}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-electric-cyan/20 text-electric-cyan font-mono text-xs font-bold">
                      {i + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{h.event.title}</h4>
                      <p className="text-[10px] text-white/50">{getCategoryLabel(h.event.categories[0]?.id || '')}</p>
                    </div>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: h.info.badgeBg, color: h.info.color }}
                  >
                    Lvl {h.info.level} • {h.info.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-electric-cyan text-space-black font-semibold text-xs hover:bg-electric-cyan/90 transition-all shadow-glow"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Briefing Copied!' : 'Copy Executive Briefing'}</span>
            </button>
            <span className="text-[10px] text-white/40">Powered by EarthSphere AI Model</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
