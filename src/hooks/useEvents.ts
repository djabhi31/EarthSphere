// =============================================================================
// EarthSphere — TanStack Query Hooks
// Data-fetching hooks for EONET API with caching, stale time, and derived stats
// =============================================================================

'use client';

import { useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import {
  fetchEvents,
  fetchEventById,
  fetchGeoJSON,
  fetchCategories,
  fetchSources,
  fetchMagnitudes,
} from '@/lib/api';
import type {
  EONETEventsResponse,
  EONETEvent,
  EONETGeoJSON,
  CategoriesResponse,
  SourcesResponse,
  MagnitudesResponse,
  FilterState,
  EventStats,
  CategoryCount,
  SourceCount,
} from '@/lib/types';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

/** 5 minutes in milliseconds */
const STALE_TIME_EVENTS = 5 * 60 * 1000;

/** Static data that never changes within a session */
const STALE_TIME_STATIC = Infinity;

// -----------------------------------------------------------------------------
// Query Key Factories
// Structured key factories prevent key collisions and simplify invalidation.
// -----------------------------------------------------------------------------

export const queryKeys = {
  events: {
    all: ['events'] as const,
    list: (filters?: Partial<FilterState>) => ['events', 'list', filters] as const,
    detail: (id: string) => ['events', 'detail', id] as const,
    geojson: (filters?: Partial<FilterState>) => ['events', 'geojson', filters] as const,
  },
  categories: ['categories'] as const,
  sources: ['sources'] as const,
  magnitudes: ['magnitudes'] as const,
} as const;

// -----------------------------------------------------------------------------
// useEvents — Paginated/filtered event list
// -----------------------------------------------------------------------------

/**
 * Fetch EONET events with optional filters.
 * Stale time: 5 minutes. Background refetch on window focus.
 *
 * @param filters - Partial filter state to build query params
 */
export function useEvents(
  filters?: Partial<FilterState>
): UseQueryResult<EONETEventsResponse> {
  return useQuery({
    queryKey: queryKeys.events.list(filters),
    queryFn: () => fetchEvents(filters),
    staleTime: STALE_TIME_EVENTS,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true,
    retry: 2,
  });
}

// -----------------------------------------------------------------------------
// useEvent — Single event by ID
// -----------------------------------------------------------------------------

/**
 * Fetch a single EONET event by its ID.
 * Only enabled when a valid ID is provided.
 *
 * @param id - Event ID (e.g., 'EONET_6340')
 */
export function useEvent(
  id: string
): UseQueryResult<EONETEvent> {
  return useQuery({
    queryKey: queryKeys.events.detail(id),
    queryFn: () => fetchEventById(id),
    staleTime: STALE_TIME_EVENTS,
    enabled: id.length > 0,
    retry: 2,
  });
}

// -----------------------------------------------------------------------------
// useCategories — Static category list
// -----------------------------------------------------------------------------

/**
 * Fetch all EONET event categories.
 * Stale time: Infinity — categories are static data.
 */
export function useCategories(): UseQueryResult<CategoriesResponse> {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: fetchCategories,
    staleTime: STALE_TIME_STATIC,
    refetchOnWindowFocus: false,
    retry: 3,
  });
}

// -----------------------------------------------------------------------------
// useSources — Static source list
// -----------------------------------------------------------------------------

/**
 * Fetch all EONET data sources.
 * Stale time: Infinity — sources are static data.
 */
export function useSources(): UseQueryResult<SourcesResponse> {
  return useQuery({
    queryKey: queryKeys.sources,
    queryFn: fetchSources,
    staleTime: STALE_TIME_STATIC,
    refetchOnWindowFocus: false,
    retry: 3,
  });
}





// -----------------------------------------------------------------------------
// useEventStats — Derived statistics from events
// -----------------------------------------------------------------------------

/**
 * Derives aggregated statistics from the events query.
 * Returns totalActive, totalClosed, byCategory, bySources, and thisMonth counts.
 *
 * @param filters - Optional filters (passed to the underlying useEvents call)
 */
export function useEventStats(filters?: Partial<FilterState>): {
  data: EventStats | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
} {
  const { data, isLoading, isError, error } = useEvents(filters);

  const stats = useMemo((): EventStats | undefined => {
    if (!data?.events) return undefined;

    const events = data.events;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let totalActive = 0;
    let totalClosed = 0;
    let thisMonth = 0;

    const categoryMap = new Map<string, { title: string; count: number }>();
    const sourceMap = new Map<string, number>();

    for (const event of events) {
      // Active vs closed
      if (event.closed === null) {
        totalActive++;
      } else {
        totalClosed++;
      }

      // This month — check latest geometry date
      if (event.geometry.length > 0) {
        const latestDate = new Date(event.geometry[event.geometry.length - 1].date);
        if (latestDate >= startOfMonth) {
          thisMonth++;
        }
      }

      // Category counts
      for (const category of event.categories) {
        const existing = categoryMap.get(category.id);
        if (existing) {
          existing.count++;
        } else {
          categoryMap.set(category.id, { title: category.title, count: 1 });
        }
      }

      // Source counts
      for (const source of event.sources) {
        sourceMap.set(source.id, (sourceMap.get(source.id) ?? 0) + 1);
      }
    }

    // Build sorted arrays
    const byCategory: CategoryCount[] = Array.from(categoryMap.entries())
      .map(([id, { title, count }]) => ({ id, title, count }))
      .sort((a, b) => b.count - a.count);

    const bySources: SourceCount[] = Array.from(sourceMap.entries())
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalActive,
      totalClosed,
      byCategory,
      bySources,
      thisMonth,
    };
  }, [data]);

  return {
    data: stats,
    isLoading,
    isError,
    error: error as Error | null,
  };
}
