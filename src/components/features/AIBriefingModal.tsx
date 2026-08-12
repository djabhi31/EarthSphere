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
          className="relative z-10 w-full max-w-3xl bg-[var(--surface-primary)] border border-[var(--border-default)] rounded-2xl p-6 shadow-2xl overflow-hidden text-[var(--text-primary)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--border-default)]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-[var(--electric-cyan)] to-[var(--cosmic-purple)] text-white shadow-glow">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">AI Disaster Intelligence Briefing</h2>
                  <span className="px-2 py-0.5 rounded-full bg-[var(--electric-cyan)]/10 border border-[var(--electric-cyan)]/30 text-[10px] text-[var(--electric-cyan)] font-mono font-bold">
                    AUTONOMOUS SYNTHESIS
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] font-medium">{briefingData.dateStr}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-[var(--surface-secondary)] p-3 rounded-xl border border-[var(--border-subtle)] shadow-sm">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">Active Threats</span>
              <span className="text-xl font-extrabold text-[var(--electric-cyan)]">{briefingData.activeCount}</span>
            </div>
            <div className="bg-[var(--surface-secondary)] p-3 rounded-xl border border-[var(--border-subtle)] shadow-sm">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">Catastrophic (L5)</span>
              <span className="text-xl font-extrabold text-red-600 dark:text-red-400">{briefingData.catastrophicCount}</span>
            </div>
            <div className="bg-[var(--surface-secondary)] p-3 rounded-xl border border-[var(--border-subtle)] shadow-sm">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">Severe (L4)</span>
              <span className="text-xl font-extrabold text-orange-600 dark:text-orange-400">{briefingData.severeCount}</span>
            </div>
            <div className="bg-[var(--surface-secondary)] p-3 rounded-xl border border-[var(--border-subtle)] shadow-sm">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">Dominant Hazard</span>
              <span className="text-xs font-bold text-[var(--text-primary)] truncate block">{briefingData.dominantCatLabel}</span>
            </div>
          </div>

          {/* Top Hazards List */}
          <div className="mb-6 space-y-2">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">
              Top High-Impact Hazards
            </span>
            <div className="space-y-2">
              {briefingData.topHazards.map((h, i) => (
                <div
                  key={h.event.id}
                  className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--electric-cyan)]/20 text-[var(--electric-cyan)] font-mono text-xs font-extrabold">
                      {i + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-primary)]">{h.event.title}</h4>
                      <p className="text-[10px] text-[var(--text-secondary)]">{getCategoryLabel(h.event.categories[0]?.id || '')}</p>
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
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border-default)]">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--electric-cyan)] text-white font-bold text-xs hover:opacity-90 transition-all shadow-md"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Briefing Copied!' : 'Copy Executive Briefing'}</span>
            </button>
            <span className="text-[10px] text-[var(--text-muted)] font-medium">Powered by EarthSphere AI Model</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
