"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEvents } from "@/hooks/useEvents";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { EventsHeader } from "@/components/events/EventsHeader";
import { EventFilters } from "@/components/events/EventFilters";
import { EventGrid } from "@/components/events/EventGrid";
import { ShareSession } from "@/components/features/ShareSession";
import { SavedViews } from "@/components/features/SavedViews";
import { useEarthSphereStore } from "@/lib/store";
import type { EONETEvent, EventStatus, FilterState } from "@/lib/types";
import { Navbar } from "@/components/layout/Navbar";

const INITIAL_LIMIT = 50;
const LOAD_MORE_INCREMENT = 50;
const SEARCH_DEBOUNCE_MS = 300;

export default function EventsExplorerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategories = useEarthSphereStore((state) => state.selectedCategories);
  const setCategories = useEarthSphereStore((state) => state.setCategories);
  const toggleCategory = useEarthSphereStore((state) => state.toggleCategory);

  const dateRange = useEarthSphereStore((state) => state.dateRange);
  const setDateRange = useEarthSphereStore((state) => state.setDateRange);

  const status = useEarthSphereStore((state) => state.status);
  const setStatus = useEarthSphereStore((state) => state.setStatus);

  const searchInput = useEarthSphereStore((state) => state.searchQuery);
  const setSearchInput = useEarthSphereStore((state) => state.setSearchQuery);

  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);

  // Sync URL params to store on mount
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const paramCat = searchParams.get("category");
      if (paramCat) setCategories(paramCat.split(",").filter(Boolean));
      
      const paramStatus = searchParams.get("status") as EventStatus | null;
      if (paramStatus && ["open", "closed", "all"].includes(paramStatus)) setStatus(paramStatus);
      
      const paramSearch = searchParams.get("search");
      if (paramSearch) setSearchInput(paramSearch);
    }
  }, [searchParams, setCategories, setStatus, setSearchInput]);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [limit, setLimit] = useState(INITIAL_LIMIT);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    }
    if (status !== "open") {
      params.set("status", status);
    }
    if (debouncedSearch.trim()) {
      params.set("search", debouncedSearch.trim());
    }
    if (dateRange.start) params.set("start", dateRange.start);
    if (dateRange.end) params.set("end", dateRange.end);

    const qs = params.toString();
    const newPath = qs ? `/events?${qs}` : "/events";

    if (qs !== searchParams.toString()) {
      router.replace(newPath, { scroll: false });
    }
  }, [selectedCategories, status, debouncedSearch, dateRange, router, searchParams]);

  const apiFilters = useMemo(
    () => ({
      status: status as EventStatus,
      limit,
      dateRange,
    }),
    [status, limit, dateRange]
  );

  const { data, isLoading, isError, error } = useEvents(apiFilters);

  const filteredEvents = useMemo(() => {
    if (!data?.events) return [];

    let events = [...data.events] as EONETEvent[];

    if (selectedCategories.length > 0) {
      events = events.filter((evt) =>
        evt.categories.some((cat) => selectedCategories.includes(cat.id))
      );
    }

    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase().trim();
      events = events.filter((evt) =>
        evt.title.toLowerCase().includes(query)
      );
    }

    return events;
  }, [data, selectedCategories, debouncedSearch]);

  const resetFilters = useEarthSphereStore((state) => state.resetFilters);

  const clearAllFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    status !== "open" ||
    debouncedSearch.trim().length > 0 ||
    dateRange.start !== null ||
    dateRange.end !== null;

  const handleLoadMore = useCallback(() => {
    setLimit((prev) => prev + LOAD_MORE_INCREMENT);
  }, []);

  const currentFilters = useMemo<FilterState>(() => ({
    categories: selectedCategories,
    status: status as EventStatus,
    searchQuery: debouncedSearch,
    dateRange: dateRange,
    source: null,
    magID: null,
    magMin: null,
    magMax: null,
    bbox: null,
    limit: limit,
    days: null,
  }), [selectedCategories, status, debouncedSearch, limit]);

  const handleApplyView = useCallback((filters: FilterState) => {
    if (filters.categories) setCategories([...filters.categories]);
    if (filters.status) setStatus(filters.status);
    if (filters.searchQuery !== undefined) setSearchInput(filters.searchQuery);
    if (filters.dateRange) setDateRange(filters.dateRange);
  }, [setCategories, setStatus, setSearchInput, setDateRange]);

  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-canvas pt-20 flex flex-col">
      <div className="absolute top-6 right-4 sm:right-8 z-40">
        <ShareSession />
      </div>
      <EventsHeader eventCount={filteredEvents.length} isLoading={isLoading} />
      <div className="flex justify-end px-4 sm:px-6 lg:px-8 mt-2 -mb-4 relative z-40">
        <SavedViews currentFilters={currentFilters} onApplyView={handleApplyView} />
      </div>
      <EventFilters
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        status={status}
        onStatusChange={setStatus}
        dateRange={dateRange}
        onDateRangeChange={(start, end) => setDateRange({ start, end })}
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showMobileFilters={showMobileFilters}
        onToggleMobileFilters={() => setShowMobileFilters(!showMobileFilters)}
        hasActiveFilters={hasActiveFilters}
        onClearAll={clearAllFilters}
        debouncedSearch={debouncedSearch}
      />
      <EventGrid
        events={filteredEvents}
        viewMode={viewMode}
        isLoading={isLoading}
        isError={isError}
        error={error}
        hasMore={!!data?.events && data.events.length >= limit}
        onLoadMore={handleLoadMore}
        onClearFilters={clearAllFilters}
        totalEvents={data?.events?.length}
      />
    </main>
    </>
  );
}
