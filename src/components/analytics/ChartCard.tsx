import { ReactNode } from "react";
import { motion } from "motion/react";
import { GlassCard } from "@/components/ui/GlassCard";
import { fadeInUp } from "@/lib/motion-presets";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable chart container with glassmorphism styling
 */
export function ChartCard({ title, subtitle, icon, children, className }: ChartCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={className}
    >
      <GlassCard className="p-5 sm:p-6" hoverEffect={false}>
        <div className="flex items-center gap-2 mb-6">
          {icon}
          <h2 className="text-base font-semibold text-white">
            {title}
          </h2>
          {subtitle && (
            <span className="text-xs text-white/30 ml-2">{subtitle}</span>
          )}
        </div>
        {children}
      </GlassCard>
    </motion.div>
  );
}
