"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { useEvents } from "@/hooks/useEvents";
import { MapControls } from "@/components/map/MapControls";
import { Navbar } from "@/components/layout/Navbar";
import { MapSidebar } from "@/components/map/MapSidebar";
import { MapLegend } from "@/components/map/MapLegend";
import { EventDetailPanel } from "@/components/map/EventDetailPanel";
import { TimelinePlayer } from "@/components/map/TimelinePlayer";
import { CATEGORY_CONFIG } from "@/lib/utils";
import type { TileLayerType } from "@/components/map/EventMap";
import type { EONETEvent } from "@/lib/types";
import maplibregl from "maplibre-gl";
import { useEarthSphereStore } from "@/lib/store";

const EventMap = dynamic(() => import("@/components/map/EventMap"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full bg-canvas flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-2 border-electric-cyan/30 border-t-electric-cyan animate-spin" />
        <p className="text-text-muted text-sm">Loading map…</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<"open" | "closed" | "all">("open");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EONETEvent | null>(null);
  const [tileLayer, setTileLayer] = useState<TileLayerType>("dark");
  const [timeFilteredEvents, setTimeFilteredEvents] = useState<EONETEvent[] | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const { dateRange, setDateRange, heatmapEnabled, toggleHeatmap } = useEarthSphereStore((state) => ({
    dateRange: state.dateRange,
    setDateRange: state.setDateRange,
    heatmapEnabled: state.heatmapEnabled,
    toggleHeatmap: state.toggleHeatmap,
  }));

  const { data: eventsData, isLoading, isError } = useEvents({
    status: "all", // Fetch all and filter locally so we have full data for sidebar search
    days: 60,
  });

  const allEvents = useMemo(() => (eventsData?.events || []) as EONETEvent[], [eventsData]);

  // Sidebar controls filtering logic
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      // Search
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status
      const isActive = event.closed === null;
      const matchesStatus = statusFilter === 'all' 
        ? true 
        : statusFilter === 'open' 
          ? isActive 
          : !isActive;

      // Category
      const matchesCategory = selectedCategories.length === 0 || 
        event.categories.some(c => selectedCategories.includes(c.id));
        
      // Date Range
      let matchesDate = true;
      if (dateRange.start || dateRange.end) {
        const latestGeo = event.geometry[event.geometry.length - 1];
        if (latestGeo) {
          const eventDate = new Date(latestGeo.date);
          const start = dateRange.start ? new Date(dateRange.start) : null;
          const end = dateRange.end ? new Date(dateRange.end) : null;
          if (start && end) {
            matchesDate = eventDate >= start && eventDate <= end;
          } else if (start) {
            matchesDate = eventDate >= start;
          } else if (end) {
            matchesDate = eventDate <= end;
          }
        }
      }

      return matchesSearch && matchesStatus && matchesCategory && matchesDate;
    });
  }, [allEvents, searchQuery, statusFilter, selectedCategories, dateRange]);

  const activeCount = useMemo(
    () => filteredEvents.filter((e) => e.closed === null).length,
    [filteredEvents]
  );

  const handleZoomIn = useCallback(() => mapRef.current?.zoomIn(), []);
  const handleZoomOut = useCallback(() => mapRef.current?.zoomOut(), []);

  const displayEvents = timeFilteredEvents ?? filteredEvents;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-canvas">
      <Navbar activeEventCount={activeCount} />

      {/* Main Map */}
      <div className="absolute inset-0">
        {isError ? (
          <div className="h-full w-full flex items-center justify-center text-warning">
            <p>Unable to load map data.</p>
          </div>
        ) : (
          <EventMap
            events={displayEvents}
            tileLayer={tileLayer}
            onEventClick={(id) => {
              const ev = displayEvents.find(e => e.id === id);
              if (ev) setSelectedEvent(ev);
            }}
            selectedEventId={selectedEvent?.id}
            zoom={2.2}
            center={[0, 20]}
            onMapLoad={(map) => { mapRef.current = map; }}
            className="h-full w-full !rounded-none"
            heatmapEnabled={heatmapEnabled}
          />
        )}
      </div>

      <MapSidebar
        events={allEvents}
        filteredEvents={filteredEvents}
        selectedEvent={selectedEvent}
        onSelectEvent={setSelectedEvent}
        isLoading={isLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        dateStart={dateRange.start}
        dateEnd={dateRange.end}
        onDateChange={(start, end) => setDateRange({ start, end })}
      />

      <MapLegend categories={CATEGORY_CONFIG} />

      <TimelinePlayer 
        events={filteredEvents} 
        onTimelineFilter={setTimeFilteredEvents} 
      />

      <div className="absolute bottom-6 right-4 z-30">
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onTileChange={setTileLayer}
          activeTile={tileLayer}
          showLegend={false}
          heatmapEnabled={heatmapEnabled}
          onToggleHeatmap={toggleHeatmap}
        />
      </div>

      <EventDetailPanel 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
      />
    </div>
  );
}
