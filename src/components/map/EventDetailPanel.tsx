import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { X, MapPin, Clock, Activity, ExternalLink, ChevronRight } from 'lucide-react';
import { useEarthSphereStore } from '@/lib/store';
import { 
  cn, 
  getCategoryColor, 
  getCategoryLabel, 
  formatDate, 
  formatMagnitude, 
  getLatestGeometry, 
  getEventStatus 
} from '@/lib/utils';
import { formatCoordinates } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { DistanceCalculator } from '@/components/features/DistanceCalculator';
import { TrajectoryCalculator } from '@/components/features/TrajectoryCalculator';
import { CarbonEstimator } from '@/components/features/CarbonEstimator';
import { VolcanoPlumeCalculator } from '@/components/features/VolcanoPlumeCalculator';
import type { EONETEvent } from '@/lib/types';
import { slideUp } from '@/lib/motion-presets';

/**
 * Props for EventDetailPanel
 */
export interface EventDetailPanelProps {
  event: EONETEvent | null;
  onClose: () => void;
}

/**
 * EventDetailPanel Component
 * Slide-in overlay from the right displaying full event details.
 */
export function EventDetailPanel({ event, onClose }: EventDetailPanelProps) {
  const addRecentEvent = useEarthSphereStore((state) => state.addRecentEvent);

  useEffect(() => {
    if (event?.id) {
      addRecentEvent(event.id);
    }
  }, [event?.id, addRecentEvent]);

  if (!event) return null;

  const selectedGeo = getLatestGeometry(event);
  const selectedStatus = getEventStatus(event);
  const selectedCategoryId = event.categories[0]?.id ?? "";

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="absolute top-16 right-0 bottom-0 w-full sm:w-96 md:max-w-md z-40 overflow-hidden pointer-events-auto"
        aria-label="Event details panel"
        role="complementary"
      >
        <div className="h-full glass-strong border-l border-border-subtle overflow-y-auto bg-canvas/80 backdrop-blur-xl shadow-depth-lg">
          {/* Close Button Header */}
          <div className="sticky top-0 z-10 p-4 flex items-center justify-between border-b border-border-subtle bg-surface-elevated/90 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: getCategoryColor(selectedCategoryId) }}
              />
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                {getCategoryLabel(selectedCategoryId)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-base transition-colors"
              aria-label="Close event details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Event Content */}
          <div className="p-5 space-y-5">
            {/* Title */}
            <div>
              <h2 className="text-lg font-display font-bold text-text-primary leading-snug mb-2">
                {event.title}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge
                  status={selectedStatus}
                  closedDate={event.closed ?? undefined}
                />
                <SeverityBadge event={event} size="sm" />
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <p className="text-sm text-text-secondary leading-relaxed">
                {event.description}
              </p>
            )}

            {/* Geometry Details */}
            {selectedGeo && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-text-muted uppercase tracking-wider font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  Location Data
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <div className="bg-surface-base rounded-xl p-3 border border-border-subtle">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                      Coordinates
                    </p>
                    <p className="text-sm text-text-primary font-mono">
                      {formatCoordinates(selectedGeo.coordinates as number[])}
                    </p>
                  </div>

                  <div className="bg-surface-base rounded-xl p-3 border border-border-subtle">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                      Last Updated
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-text-muted" />
                      <p className="text-sm text-text-primary">
                        {formatDate(selectedGeo.date)}
                      </p>
                    </div>
                  </div>

                  {selectedGeo.magnitudeValue != null && (
                    <div className="bg-surface-base rounded-xl p-3 border border-border-subtle">
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                        Magnitude
                      </p>
                      <div className="flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-text-muted" />
                        <p className="text-sm text-text-primary font-mono font-semibold">
                          {formatMagnitude(
                            selectedGeo.magnitudeValue,
                            selectedGeo.magnitudeUnit
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Geometry Timeline */}
            {event.geometry.length > 1 && (
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-3">
                  Timeline ({event.geometry.length} observations)
                </p>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 scrollbar-hide">
                  {[...event.geometry]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 10)
                    .map((geo, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-xs py-1.5 px-2 rounded-lg hover:bg-surface-base transition-colors border border-transparent hover:border-border-subtle"
                      >
                        <div
                          className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0 shadow-sm",
                            i === 0 ? "bg-electric-cyan" : "bg-border-strong"
                          )}
                        />
                        <span className="text-text-secondary flex-1">
                          {formatDate(geo.date)}
                        </span>
                        {geo.magnitudeValue != null && (
                          <span className="text-text-muted font-mono text-[10px]">
                            {formatMagnitude(geo.magnitudeValue, geo.magnitudeUnit)}
                          </span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Trajectory & Footprint Analysis */}
            <TrajectoryCalculator event={event} />

            {/* Carbon & Volcano Plume Estimators */}
            <CarbonEstimator event={event} />
            <VolcanoPlumeCalculator event={event} />

            {/* Distance Proximity Calculator */}
            <DistanceCalculator event={event} />

            {/* Sources */}
            {event.sources.length > 0 && (
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-2">
                  Sources
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {event.sources.map((source) => (
                    <a
                      key={source.id}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full bg-surface-base border border-border-subtle px-2.5 py-1 text-[11px] text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                    >
                      {source.id}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <Link
                href={`/events/${event.id}`}
                className="w-full inline-flex h-10 gap-2 px-5 items-center justify-center rounded-xl bg-electric-cyan text-space-black hover:bg-electric-cyan/90 font-semibold group cursor-pointer text-sm transition-all shadow-glow hover:shadow-glow-lg focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:outline-none"
              >
                View Full Details
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex h-10 gap-2 px-5 items-center justify-center rounded-xl border border-border-subtle bg-surface-base text-sm font-medium text-text-primary backdrop-blur-md transition-all hover:border-border-strong hover:bg-surface-elevated cursor-pointer focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:outline-none"
              >
                View on EONET
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
