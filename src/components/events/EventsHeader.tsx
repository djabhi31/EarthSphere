import Link from "next/link";
import { motion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import { ANIMATION_SECONDS } from "@/lib/design-tokens";
import { Home, ChevronRight, Globe } from "lucide-react";

/**
 * Props for the EventsHeader component
 */
export interface EventsHeaderProps {
  /** The total number of events to display */
  eventCount: number;
  /** Whether the event data is currently loading */
  isLoading: boolean;
}

/**
 * Displays the page header for the Events Explorer, including breadcrumbs, title,
 * and the total count of filtered events.
 */
export function EventsHeader({ eventCount, isLoading }: EventsHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      {/* Subtle gradient background */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(0,212,170,0.08),transparent)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-24 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          className="mb-6 flex items-center gap-1.5 text-sm text-white/40"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="transition-colors hover:text-white/70">
            <Home size={14} />
          </Link>
          <ChevronRight size={12} aria-hidden="true" />
          <span className="text-white/70">Events</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION_SECONDS.complex }}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                Events Explorer
              </h1>
              <p className="mt-2 max-w-xl text-base text-white/50">
                Discover and track natural events happening across our planet — wildfires, storms, volcanoes, and more.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-electric-cyan" />
              <span className="text-sm tabular-nums text-white/60">
                {isLoading ? (
                  <Skeleton className="inline-block h-4 w-8 bg-white/10" />
                ) : (
                  <>{eventCount} events</>
                )}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
