// =============================================================================
// EarthSphere — Cinematic Event Detail Page (Mini-Documentary Layout)
// =============================================================================

"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useEvent, useEvents } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { audioSynth } from "@/lib/audio";
import {
  getCategoryColor,
  getCategoryLabel,
  getEventStatus,
  computeDuration,
  getPointCoordinates,
} from "@/lib/utils";
import type { EONETEvent } from "@/lib/types";
import { Activity, Globe, ExternalLink } from "lucide-react";

import { EventDetailHeader } from "@/components/events/EventDetailHeader";
import { EventTimeline } from "@/components/events/EventTimeline";
import { EventSources } from "@/components/events/EventSources";
import { RelatedEvents } from "@/components/events/RelatedEvents";

const EventMap = dynamic(() => import("@/components/map/EventMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[300px] w-full items-center justify-center rounded-xl border border-white/10 bg-white/5">
      <div className="flex flex-col items-center gap-3">
        <Globe size={32} className="animate-pulse text-white/20" />
        <span className="text-sm text-white/30">Loading map…</span>
      </div>
    </div>
  ),
});


function DetailSkeleton() {
  return (
    <main className="min-h-screen bg-canvas text-white">
      <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-2">
          <Skeleton className="h-4 w-4 bg-white/10" />
          <Skeleton className="h-4 w-12 bg-white/10" />
          <Skeleton className="h-4 w-32 bg-white/10" />
        </div>
        <div className="mb-8 flex items-start gap-6">
          <Skeleton className="h-16 w-16 shrink-0 rounded-2xl bg-white/10" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-10 w-3/4 bg-white/10" />
            <Skeleton className="h-6 w-48 bg-white/10" />
          </div>
        </div>
        <Skeleton className="mb-8 h-[450px] w-full rounded-xl bg-white/10" />
      </div>
    </main>
  );
}

export default function EventDetailPage() {
  const params = useParams();
  const eventId = typeof params.id === "string" ? params.id : "";

  // Fetch Event
  const { data: event, isLoading, isError } = useEvent(eventId);

  // Fetch related events
  const primaryCategoryId = event?.categories[0]?.id;
  const { data: relatedData } = useEvents(
    primaryCategoryId
      ? { categories: [primaryCategoryId], status: "open", limit: 6 }
      : undefined
  );

  const relatedEvents = useMemo(() => {
    if (!relatedData?.events || !event) return [];
    return relatedData.events.filter((e) => e.id !== event.id).slice(0, 4);
  }, [relatedData, event]);

  // Active fly-to coordinates state
  const [activeCoords, setActiveCoords] = useState<[number, number] | null>(null);

  const categoryId = event?.categories[0]?.id ?? "manmade";
  const categoryColor = getCategoryColor(categoryId);
  const categoryLabel = getCategoryLabel(categoryId);
  const status = event ? getEventStatus(event) : "active";
  const duration = event ? computeDuration(event) : "";

  const sortedGeometry = useMemo(() => {
    if (!event?.geometry) return [];
    return [...event.geometry].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [event]);

  // Fallback default coordinates
  const defaultCenter = useMemo(() => {
    if (sortedGeometry.length === 0) return [20, 0] as [number, number];
    const latest = sortedGeometry[sortedGeometry.length - 1];
    return getPointCoordinates(latest) ?? [20, 0];
  }, [sortedGeometry]);

  const mapCenter = (activeCoords || defaultCenter) as [number, number];
  const mapZoom = sortedGeometry.length > 1 ? 5 : 7;

  if (isLoading) return <DetailSkeleton />;
  if (isError || !event) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 text-center">
        <Globe size={40} className="text-white/20 animate-pulse mb-4" />
        <h1 className="text-xl font-bold text-white mb-2">Event Not Found</h1>
        <Link
          href="/events"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 px-4 text-sm font-semibold hover:bg-white/10 cursor-none"
          onMouseEnter={() => audioSynth.playHover()}
          onClick={() => audioSynth.playClick()}
        >
          Return to Events
        </Link>
      </main>
    );
  }

  return (
    <div className="relative min-h-screen bg-canvas text-white">
      <Navbar activeEventCount={relatedData?.events?.length} />

      <EventDetailHeader event={event} duration={duration} />

      {/* ── Documentary Split View ─────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-12 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Sticky Map */}
          <div className="col-span-1 lg:col-span-5 lg:sticky lg:top-24 h-[350px] lg:h-[calc(100vh-140px)] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
            <EventMap
              events={[event]}
              center={mapCenter}
              zoom={mapZoom}
              className="h-full w-full"
              selectedEventId={event.id}
            />
          </div>

          {/* Right Column: Scrolling details & observation nodes */}
          <div className="col-span-1 lg:col-span-7 space-y-12">
            
            {/* Observation timeline */}
            <div>
              <h2 className="mb-6 flex items-center gap-2 text-lg font-bold uppercase tracking-wider text-white/70">
                <Activity size={16} style={{ color: categoryColor }} />
                Milestone Observations
              </h2>

              <EventTimeline 
                geometry={sortedGeometry} 
                activeCoords={activeCoords} 
                onFocus={setActiveCoords} 
                categoryColor={categoryColor} 
              />
            </div>

            {/* Sources & Metadata sidebar details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
              
              {/* Sources spotlights */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/40">
                  Data Sources
                </h3>
                <EventSources sources={event.sources} categoryColor={categoryColor} />
              </div>

              {/* Event Attributes Card */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/40">
                  Telemetry Metadata
                </h3>
                <SpotlightCard glowColor={`${categoryColor}10`} borderColor="rgba(255,255,255,0.08)">
                  <div className="p-4 space-y-3.5 text-xs text-white/60">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40 font-medium">Record ID</span>
                      <span className="font-mono font-semibold text-white/80">{event.id}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40 font-medium">System Status</span>
                      <span className="capitalize font-semibold text-electric-cyan">{status}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40 font-medium">Duration</span>
                      <span>{duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40 font-medium">NASA GIBS Links</span>
                      {event.link ? (
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 font-semibold text-electric-cyan hover:underline cursor-none"
                          onMouseEnter={() => audioSynth.playHover()}
                          onClick={() => audioSynth.playClick()}
                        >
                          EONET API <ExternalLink size={10} />
                        </a>
                      ) : (
                        <span>None</span>
                      )}
                    </div>
                  </div>
                </SpotlightCard>
              </div>

            </div>

          </div>
        </div>

        <RelatedEvents 
          events={relatedEvents} 
          categoryId={categoryId} 
          categoryLabel={categoryLabel} 
          categoryColor={categoryColor} 
        />
      </section>

      <Footer />
    </div>
  );
}
