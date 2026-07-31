"use client";

import { motion, AnimatePresence } from "motion/react";
import { Frown, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GlassCard } from "@/components/ui/GlassCard";
import { EventCard } from "@/components/ui/EventCard";
import { ANIMATION_SECONDS } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import type { EONETEvent } from "@/lib/types";

export interface EventGridProps {
  /** List of events to display */
  events: EONETEvent[];
  /** Current view mode */
  viewMode: "grid" | "list";
  /** Whether data is loading */
  isLoading: boolean;
  /** Whether there was an error loading data */
  isError: boolean;
  /** Error object if available */
  error: Error | null;
  /** Whether there are more events to load */
  hasMore: boolean;
  /** Function to load more events */
  onLoadMore: () => void;
  /** Function to clear all active filters */
  onClearFilters: () => void;
  /** Total number of events available */
  totalEvents?: number;
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <Skeleton className="mb-4 h-[2px] w-full bg-white/10" />
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full bg-white/10" />
          <Skeleton className="h-4 w-20 bg-white/10" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full bg-white/10" />
      </div>
      <Skeleton className="mb-2 h-5 w-full bg-white/10" />
      <Skeleton className="mb-3 h-5 w-3/4 bg-white/10" />
      <Skeleton className="mb-2 h-4 w-40 bg-white/10" />
      <Skeleton className="mb-2 h-4 w-32 bg-white/10" />
      <div className="flex gap-1.5 pt-1">
        <Skeleton className="h-5 w-12 rounded-md bg-white/10" />
        <Skeleton className="h-5 w-14 rounded-md bg-white/10" />
      </div>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: ANIMATION_SECONDS.normal }}
      className="col-span-full flex flex-col items-center justify-center gap-6 py-24"
    >
      <div className="relative">
        <div className="absolute inset-0 animate-pulse rounded-full bg-white/5 blur-xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <Frown size={36} className="text-white/30" />
        </div>
      </div>
      <div className="text-center">
        <h3 className="mb-2 text-lg font-semibold text-white/80">
          No events match your filters
        </h3>
        <p className="max-w-md text-sm text-white/40">
          Try adjusting your category, status, or search filters to discover more
          natural events around the world.
        </p>
      </div>
      <Button
        onClick={onReset}
        variant="outline"
        className="border-white/20 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
      >
        <X size={14} className="mr-1.5" />
        Clear All Filters
      </Button>
    </motion.div>
  );
}

/**
 * Displays the grid or list of event cards, including loading and error states.
 */
export function EventGrid({
  events,
  viewMode,
  isLoading,
  isError,
  error,
  hasMore,
  onLoadMore,
  onClearFilters,
  totalEvents = 0,
}: EventGridProps) {
  if (isError) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <GlassCard className="mx-auto max-w-lg p-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
              <Frown size={28} className="text-red-400" />
            </div>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white/80">
            Failed to load events
          </h3>
          <p className="mb-4 text-sm text-white/40">
            {error?.message ?? "An unexpected error occurred while fetching event data."}
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
          >
            Try Again
          </Button>
        </GlassCard>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col gap-4"
          )}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: ANIMATION_SECONDS.normal,
                delay: i * 0.08,
              }}
            >
              <SkeletonCard />
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {events.length === 0 ? (
        <EmptyState onReset={onClearFilters} />
      ) : (
        <>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 text-sm text-white/40"
          >
            Showing{" "}
            <span className="font-semibold tabular-nums text-white/70">
              {events.length}
            </span>{" "}
            event{events.length !== 1 ? "s" : ""}
            {totalEvents > 0 && events.length < totalEvents && (
              <>
                {" "}of{" "}
                <span className="tabular-nums text-white/50">{totalEvents}</span>
              </>
            )}
          </motion.p>

          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                : "flex flex-col gap-4"
            )}
          >
            <AnimatePresence mode="popLayout">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: ANIMATION_SECONDS.normal,
                    delay: Math.min(index * 0.03, 0.3),
                    layout: { duration: ANIMATION_SECONDS.normal },
                  }}
                >
                  <EventCard
                    event={event}
                    index={index}
                    className={viewMode === "list" ? "w-full" : undefined}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {hasMore && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-12 flex justify-center"
            >
              <Button
                onClick={onLoadMore}
                variant="outline"
                className="group border-white/15 bg-white/5 px-8 py-5 text-sm text-white/60 transition-all hover:border-electric-cyan/30 hover:bg-electric-cyan/5 hover:text-electric-cyan"
              >
                <ChevronDown
                  size={16}
                  className="mr-2 transition-transform group-hover:translate-y-0.5"
                />
                Load More Events
              </Button>
            </motion.div>
          )}
        </>
      )}
    </section>
  );
}
