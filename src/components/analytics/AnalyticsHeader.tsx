import { motion } from "motion/react";
import { BarChart3 } from "lucide-react";
import { fadeInUp } from "@/lib/motion-presets";

/**
 * Analytics page header with title and description
 */
export function AnalyticsHeader() {
  return (
    <motion.div
      className="mb-12"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 rounded-xl bg-electric-cyan/10">
          <BarChart3 className="w-6 h-6 text-electric-cyan" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Event Analytics
          </h1>
        </div>
      </div>
      <p className="text-white/50 text-base sm:text-lg max-w-2xl">
        Comprehensive insights into global natural events. Data sourced from
        NASA EONET spanning the last 365 days.
      </p>
    </motion.div>
  );
}
