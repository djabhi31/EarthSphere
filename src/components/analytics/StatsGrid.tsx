"use client";

import { motion } from "motion/react";
import { Activity, Calendar, Layers, Database } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/motion-presets";
import type { EventStats } from "@/lib/types";

interface StatsGridProps {
  stats: EventStats | undefined;
  totalCategories: number;
  totalSources: number;
  isLoading: boolean;
}

/**
 * Grid of top-level statistics cards
 */
export function StatsGrid({ stats, totalCategories, totalSources, isLoading }: StatsGridProps) {
  const statCards = [
    {
      label: "Total Active",
      value: stats?.totalActive ?? 0,
      icon: Activity,
      colorClass: "text-electric-cyan",
      gradient: "from-electric-cyan/20 to-electric-cyan/5",
    },
    {
      label: "Total Closed",
      value: stats?.totalClosed ?? 0,
      icon: Calendar,
      colorClass: "text-slate-400",
      gradient: "from-white/10 to-white/5",
    },
    {
      label: "Categories",
      value: totalCategories,
      icon: Layers,
      colorClass: "text-purple-500",
      gradient: "from-purple-500/20 to-purple-500/5",
    },
    {
      label: "Data Sources",
      value: totalSources,
      icon: Database,
      colorClass: "text-blue-400",
      gradient: "from-blue-400/20 to-blue-400/5",
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
      variants={staggerContainer()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      {statCards.map((stat) => (
        <motion.div key={stat.label} variants={staggerItem}>
          <GlassCard className="p-5 sm:p-6" hoverEffect>
            <div className={cn("inline-flex p-2.5 rounded-xl bg-gradient-to-br mb-3", stat.gradient)}>
              <stat.icon className={cn("w-5 h-5", stat.colorClass)} />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <AnimatedCounter value={stat.value} />
              )}
            </div>
            <p className="text-xs sm:text-sm text-white/40 font-medium">
              {stat.label}
            </p>
          </GlassCard>
        </motion.div>
      ))}
    </motion.div>
  );
}
