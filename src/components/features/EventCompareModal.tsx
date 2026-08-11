'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRightLeft, Calendar, MapPin, Activity, ShieldAlert, ExternalLink } from 'lucide-react';
import { cn, formatDate, getCategoryLabel, getCategoryColor, getLatestGeometry } from '@/lib/utils';
import { calculateSeverity, calculateDistance } from '@/lib/severity';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import type { EONETEvent } from '@/lib/types';

interface EventCompareModalProps {
  eventA: EONETEvent | null;
  eventB: EONETEvent | null;
  isOpen: boolean;
  onClose: () => void;
  allEvents?: readonly EONETEvent[];
  onSelectEventB?: (event: EONETEvent) => void;
}

export function EventCompareModal({
  eventA,
  eventB,
  isOpen,
  onClose,
  allEvents = [],
  onSelectEventB,
}: EventCompareModalProps) {
  const geoA = eventA ? getLatestGeometry(eventA) : null;
  const geoB = eventB ? getLatestGeometry(eventB) : null;

  const distance = useMemo(() => {
    if (!geoA?.coordinates || !geoB?.coordinates) return null;
    const coordsA = geoA.coordinates as number[];
    const coordsB = geoB.coordinates as number[];
    if (coordsA.length < 2 || coordsB.length < 2) return null;
    return calculateDistance(coordsA[1], coordsA[0], coordsB[1], coordsB[0]);
  }, [geoA, geoB]);

  if (!isOpen || !eventA) return null;

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
          className="relative z-10 w-full max-w-4xl glass-strong border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-electric-cyan/10 text-electric-cyan">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Event Comparison Matrix</h2>
                <p className="text-xs text-white/50">Side-by-side geospatial hazard analysis</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Distance Bar if both selected */}
          {distance && (
            <div className="mb-6 p-3 rounded-xl bg-electric-cyan/10 border border-electric-cyan/30 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-electric-cyan" />
                <span>Geospatial Separation:</span>
              </div>
              <div className="font-mono font-bold text-electric-cyan">
                {distance.km.toLocaleString()} km ({distance.miles.toLocaleString()} miles)
              </div>
            </div>
          )}

          {/* Grid Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event A Column */}
            <EventCardComparison event={eventA} title="Primary Event (A)" />

            {/* Event B Column */}
            {eventB ? (
              <EventCardComparison event={eventB} title="Comparison Event (B)" />
            ) : (
              <div className="glass rounded-xl border border-dashed border-white/20 p-6 flex flex-col items-center justify-center text-center">
                <ShieldAlert className="w-8 h-8 text-white/30 mb-2" />
                <h4 className="text-sm font-semibold text-white/70 mb-1">Select Second Event</h4>
                <p className="text-xs text-white/40 mb-4 max-w-xs">
                  Choose another event from the list below to run a side-by-side analysis.
                </p>
                {allEvents.length > 0 && onSelectEventB && (
                  <select
                    onChange={(e) => {
                      const selected = allEvents.find((evt) => evt.id === e.target.value);
                      if (selected) onSelectEventB(selected);
                    }}
                    className="w-full max-w-xs rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-cyan"
                  >
                    <option value="">Select an event...</option>
                    {allEvents
                      .filter((e) => e.id !== eventA.id)
                      .slice(0, 30)
                      .map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.title}
                        </option>
                      ))}
                  </select>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function EventCardComparison({ event, title }: { event: EONETEvent; title: string }) {
  const catId = event.categories[0]?.id || 'unknown';
  const latestGeo = getLatestGeometry(event);

  return (
    <div className="glass rounded-xl border border-white/10 p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{title}</span>
        <SeverityBadge event={event} size="sm" />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <CategoryIcon categoryId={catId} size={14} showGlow />
          <span className="text-xs text-white/50">{getCategoryLabel(catId)}</span>
        </div>
        <h3 className="text-base font-bold text-white leading-snug">{event.title}</h3>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
        <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
          <span className="text-white/40 block text-[10px]">Status</span>
          <span className={cn('font-semibold', event.closed ? 'text-white/50' : 'text-electric-cyan')}>
            {event.closed ? 'Closed' : 'Active'}
          </span>
        </div>

        <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
          <span className="text-white/40 block text-[10px]">Geometry Points</span>
          <span className="font-semibold text-white">{event.geometry.length} points</span>
        </div>

        <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
          <span className="text-white/40 block text-[10px]">Latest Magnitude</span>
          <span className="font-semibold text-amber-400">
            {latestGeo?.magnitudeValue != null
              ? `${latestGeo.magnitudeValue} ${latestGeo.magnitudeUnit || ''}`
              : 'N/A'}
          </span>
        </div>

        <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
          <span className="text-white/40 block text-[10px]">Recorded Date</span>
          <span className="font-semibold text-white">
            {latestGeo ? formatDate(latestGeo.date).split(',')[0] : 'N/A'}
          </span>
        </div>
      </div>

      <div className="pt-2">
        <a
          href={`/events/${event.id}`}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-electric-cyan transition-colors"
        >
          <span>Full Event Inspection</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
