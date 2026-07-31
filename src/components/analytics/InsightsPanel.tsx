"use client";

import { motion } from "motion/react";
import { Lightbulb } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { fadeInUp } from "@/lib/motion-presets";
import { Skeleton } from "@/components/ui/skeleton";
import type { EventStats } from "@/lib/types";
import { getCategoryLabel } from "@/lib/utils";

interface InsightsPanelProps {
  stats: EventStats | undefined;
  isLoading: boolean;
}

/**
 * AI Insights panel derived from event statistics
 */
export function InsightsPanel({ stats, isLoading }: InsightsPanelProps) {
  if (isLoading) {
    return (
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-8">
        <GlassCard className="p-6 border-electric-cyan/20 bg-electric-cyan/5">
          <Skeleton className="h-6 w-48 mb-4 bg-white/10" />
          <Skeleton className="h-4 w-full mb-2 bg-white/10" />
          <Skeleton className="h-4 w-3/4 bg-white/10" />
        </GlassCard>
      </motion.div>
    );
  }

  if (!stats) return null;

  // Generate simple insights
  const topCategory = stats.byCategory?.[0];
  const totalEvents = stats.totalActive + stats.totalClosed;
  const activePercent = totalEvents > 0 
    ? Math.round((stats.totalActive / totalEvents) * 100)
    : 0;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="mb-8"
    >
      <GlassCard className="p-6 border-electric-cyan/20 bg-electric-cyan/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-electric-cyan/20">
            <Lightbulb className="w-5 h-5 text-electric-cyan" />
          </div>
          <h2 className="text-lg font-semibold text-white">Automated Insights</h2>
        </div>
        <ul className="space-y-3 text-white/70 text-sm">
          {topCategory && (
            <li className="flex gap-2">
              <span className="text-electric-cyan">•</span>
              <span>
                <strong>{getCategoryLabel(topCategory.id)}</strong> is currently the most frequent event type, 
                accounting for {topCategory.count} recent events.
              </span>
            </li>
          )}
          <li className="flex gap-2">
            <span className="text-electric-cyan">•</span>
            <span>
              Approximately <strong>{activePercent}%</strong> of tracked events are currently active, requiring ongoing monitoring.
            </span>
          </li>
          {stats.bySources?.[0] && (
            <li className="flex gap-2">
              <span className="text-electric-cyan">•</span>
              <span>
                The primary data source for these events is <strong>{stats.bySources[0].id.toUpperCase()}</strong>.
              </span>
            </li>
          )}
        </ul>
      </GlassCard>
    </motion.div>
  );
}
