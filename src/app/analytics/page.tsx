// =============================================================================
// EarthSphere — Analytics Dashboard Page
// Rich data visualizations with Recharts, animated counters, and glass cards
// =============================================================================

"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { useEvents, useCategories, useSources, useEventStats } from "@/hooks/useEvents";
import { getCategoryColor, getCategoryLabel } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Database,
} from "lucide-react";

import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader";
import { StatsGrid } from "@/components/analytics/StatsGrid";
import { ChartCard } from "@/components/analytics/ChartCard";
import { InsightsPanel } from "@/components/analytics/InsightsPanel";
import { fadeInUp } from "@/lib/motion-presets";
import { Navbar } from "@/components/layout/Navbar";

// Custom Tooltip for charts
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color?: string }>;
  label?: string;
}

function GlassTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl px-4 py-3 shadow-2xl border border-white/10">
      {label && <p className="text-xs text-white/50 mb-1.5 font-medium">{label}</p>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: entry.color ?? "#00d4aa" }}
          />
          <span className="text-white/70">{entry.name}:</span>
          <span className="text-white font-semibold tabular-nums">
            {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const { data: statsData, isLoading: statsLoading } = useEventStats({ status: "all", days: 365 });
  const { data: eventsData, isLoading: eventsLoading } = useEvents({ status: "all", days: 365 });
  const { data: categoriesData } = useCategories();
  const { data: sourcesData } = useSources();

  const isLoading = statsLoading || eventsLoading;

  // Chart Data Preparation
  const categoryChartData = useMemo(() => {
    if (!statsData?.byCategory) return [];
    return statsData.byCategory
      .slice(0, 12)
      .map((cat) => ({
        name: getCategoryLabel(cat.id),
        count: cat.count,
        fill: getCategoryColor(cat.id),
        id: cat.id,
      }))
      .sort((a, b) => b.count - a.count);
  }, [statsData]);

  const statusPieData = useMemo(() => {
    if (!statsData) return [];
    return [
      { name: "Active", value: statsData.totalActive, color: "#00d4aa" },
      { name: "Closed", value: statsData.totalClosed, color: "#4b5563" },
    ];
  }, [statsData]);

  const timelineData = useMemo(() => {
    if (!eventsData?.events) return [];
    const monthMap = new Map<string, number>();
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthMap.set(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, 0);
    }

    for (const event of eventsData.events) {
      if (event.geometry.length === 0) continue;
      const latestDate = new Date(event.geometry[event.geometry.length - 1].date);
      const key = `${latestDate.getFullYear()}-${String(latestDate.getMonth() + 1).padStart(2, "0")}`;
      if (monthMap.has(key)) monthMap.set(key, (monthMap.get(key) ?? 0) + 1);
    }

    return Array.from(monthMap.entries()).map(([key, count]) => {
      const [year, month] = key.split("-");
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return { month: `${monthNames[parseInt(month) - 1]} ${year.slice(2)}`, events: count };
    });
  }, [eventsData]);

  const sourceChartData = useMemo(() => {
    if (!statsData?.bySources) return [];
    return statsData.bySources.slice(0, 10).map((source) => ({
      name: source.id.toUpperCase(),
      count: source.count,
    }));
  }, [statsData]);

  const totalEvents = (statsData?.totalActive ?? 0) + (statsData?.totalClosed ?? 0);

  return (
    <>
      <Navbar activeEventCount={statsData?.totalActive} />
      <main className="min-h-screen bg-canvas pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnalyticsHeader events={eventsData?.events} />
        
        <StatsGrid 
          stats={statsData} 
          totalCategories={categoriesData?.categories?.length ?? 0}
          totalSources={sourcesData?.sources?.length ?? 0}
          isLoading={isLoading} 
        />

        <InsightsPanel stats={statsData} isLoading={isLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Events by Category" icon={<BarChart3 className="w-5 h-5 text-electric-cyan" />}>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
              </div>
            ) : (
              <div className="h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} layout="vertical" margin={{ right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
                    <Tooltip content={<GlassTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>
                      {categoryChartData.map((entry) => (
                        <Cell key={entry.id} fill={entry.fill} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>

          <ChartCard title="Active vs Closed" icon={<PieChartIcon className="w-5 h-5 text-purple-500" />}>
            {isLoading ? (
              <div className="flex items-center justify-center h-[340px]">
                <Skeleton className="h-52 w-52 rounded-full" />
              </div>
            ) : (
              <div className="h-[340px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4} dataKey="value" strokeWidth={0}>
                      {statusPieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} style={{ filter: i === 0 ? "drop-shadow(0 0 8px rgba(0,212,170,0.4))" : undefined }} />
                      ))}
                    </Pie>
                    <Tooltip content={<GlassTooltip />} />
                    <Legend verticalAlign="bottom" height={36} formatter={(value: string) => <span className="text-white/60 text-sm">{value}</span>} />
                    <text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold" fill="white">{totalEvents.toLocaleString()}</text>
                    <text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle" className="text-xs" fill="rgba(255,255,255,0.4)">Total Events</text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>

          <ChartCard className="lg:col-span-2" title="Events Over Time" subtitle="Last 12 months" icon={<TrendingUp className="w-5 h-5 text-blue-400" />}>
            {isLoading ? (
              <Skeleton className="h-[280px] w-full rounded-xl" />
            ) : (
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData} margin={{ top: 10, right: 10 }}>
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00d4aa" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                    <Tooltip content={<GlassTooltip />} />
                    <Area type="monotone" dataKey="events" stroke="#00d4aa" strokeWidth={2.5} fill="url(#areaGradient)" dot={{ fill: "#00d4aa", strokeWidth: 0, r: 3 }} activeDot={{ r: 6, fill: "#00d4aa", stroke: "#0a0e17", strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>

          <ChartCard className="lg:col-span-2" title="Top Data Sources" icon={<Database className="w-5 h-5 text-orange-400" />}>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
              </div>
            ) : (
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceChartData} layout="vertical" margin={{ right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip content={<GlassTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                    <Bar dataKey="count" fill="#ff6b35" fillOpacity={0.7} radius={[0, 6, 6, 0]} barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>
        </div>

        <motion.div
          className="mt-10 text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="text-xs text-white/30">
            Data sourced from{" "}
            <a href="https://eonet.gsfc.nasa.gov/docs/v3" target="_blank" rel="noopener noreferrer" className="text-electric-cyan/60 hover:text-electric-cyan transition-colors underline underline-offset-2">
              NASA EONET v3 API
            </a>
            . Last 365 days of events. Updated every 5 minutes.
          </p>
        </motion.div>
      </div>
    </main>
    </>
  );
}
