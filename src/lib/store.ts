// =============================================================================
// EarthSphere — Zustand Store
// Global application state for filters, map, UI, timeline, and watchlist
// =============================================================================

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DateRange, EventStatus, MapViewport, ViewMode } from './types';

// -----------------------------------------------------------------------------
// Local Storage Helpers (Watchlist persistence)
// -----------------------------------------------------------------------------

const WATCHLIST_KEY = 'earthsphere-watchlist';
const LAST_VISIT_KEY = 'earthsphere-last-visit';

function loadWatchlist(): { categories: string[]; eventIds: string[] } {
  if (typeof window === 'undefined') return { categories: [], eventIds: [] };
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { categories: [], eventIds: [] };
}

function saveWatchlist(categories: string[], eventIds: string[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify({ categories, eventIds }));
  } catch { /* ignore */ }
}

function loadLastVisit(): number {
  if (typeof window === 'undefined') return Date.now();
  try {
    const raw = localStorage.getItem(LAST_VISIT_KEY);
    if (raw) return parseInt(raw, 10);
  } catch { /* ignore */ }
  return Date.now();
}

function saveLastVisit(timestamp: number) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LAST_VISIT_KEY, String(timestamp));
  } catch { /* ignore */ }
}

// -----------------------------------------------------------------------------
// Timeline Playback Speed Type
// -----------------------------------------------------------------------------

export type PlaybackSpeed = 1 | 2 | 4;

// -----------------------------------------------------------------------------
// Store Shape
// -----------------------------------------------------------------------------

interface EarthSphereState {
  // Filters
  selectedCategories: string[];
  status: EventStatus;
  dateRange: DateRange;
  searchQuery: string;
  selectedSource: string | null;

  // Selection
  selectedEventId: string | null;

  // Map
  mapViewport: MapViewport;

  // UI
  viewMode: ViewMode;

  // Timeline Playback
  timelinePlaying: boolean;
  timelineSpeed: PlaybackSpeed;
  timelineCurrentDate: string | null;
  timelineStartDate: string | null;
  timelineEndDate: string | null;

  // Heatmap
  heatmapEnabled: boolean;

  // Watchlist
  watchedCategories: string[];
  watchedEventIds: string[];
  lastVisitTimestamp: number;

  // Actions — Filters
  setCategories: (categories: string[]) => void;
  toggleCategory: (categoryId: string) => void;
  setStatus: (status: EventStatus) => void;
  setDateRange: (dateRange: DateRange) => void;
  setSearchQuery: (query: string) => void;
  setSource: (source: string | null) => void;

  // Actions — Selection
  setSelectedEvent: (eventId: string | null) => void;

  // Actions — Map
  setMapViewport: (viewport: MapViewport) => void;

  // Actions — UI
  setViewMode: (mode: ViewMode) => void;

  // Actions — Timeline
  setTimelinePlaying: (playing: boolean) => void;
  setTimelineSpeed: (speed: PlaybackSpeed) => void;
  setTimelineCurrentDate: (date: string | null) => void;
  setTimelineBounds: (start: string, end: string) => void;
  resetTimeline: () => void;

  // Actions — Heatmap
  toggleHeatmap: () => void;

  // Actions — Watchlist
  toggleWatchCategory: (categoryId: string) => void;
  toggleWatchEvent: (eventId: string) => void;
  isEventWatched: (eventId: string) => boolean;
  isCategoryWatched: (categoryId: string) => boolean;
  clearWatchlist: () => void;
  updateLastVisit: () => void;

  // Actions — Reset
  resetFilters: () => void;
}

// -----------------------------------------------------------------------------
// Default Values
// -----------------------------------------------------------------------------

const DEFAULT_FILTERS = {
  selectedCategories: [] as string[],
  status: 'open' as EventStatus,
  dateRange: { start: null, end: null } as DateRange,
  searchQuery: '',
  selectedSource: null,
} as const;

const DEFAULT_MAP_VIEWPORT: MapViewport = {
  lat: 20,
  lng: 0,
  zoom: 2,
};

const DEFAULT_TIMELINE = {
  timelinePlaying: false,
  timelineSpeed: 1 as PlaybackSpeed,
  timelineCurrentDate: null as string | null,
  timelineStartDate: null as string | null,
  timelineEndDate: null as string | null,
};

// -----------------------------------------------------------------------------
// Store
// -----------------------------------------------------------------------------

export const useEarthSphereStore = create<EarthSphereState>()(
  devtools(
    (set, get) => {
      const initialWatchlist = loadWatchlist();
      const initialLastVisit = loadLastVisit();

      return {
      // -----------------------------------------------------------------------
      // Initial State
      // -----------------------------------------------------------------------
      ...DEFAULT_FILTERS,
      selectedEventId: null,
      mapViewport: DEFAULT_MAP_VIEWPORT,
      viewMode: 'grid' as ViewMode,
      ...DEFAULT_TIMELINE,
      heatmapEnabled: false,
      watchedCategories: initialWatchlist.categories,
      watchedEventIds: initialWatchlist.eventIds,
      lastVisitTimestamp: initialLastVisit,

      // -----------------------------------------------------------------------
      // Filter Actions
      // -----------------------------------------------------------------------

      setCategories: (categories) =>
        set(
          { selectedCategories: categories },
          undefined,
          'setCategories'
        ),

      toggleCategory: (categoryId) =>
        set(
          (state) => {
            const exists = state.selectedCategories.includes(categoryId);
            return {
              selectedCategories: exists
                ? state.selectedCategories.filter((id) => id !== categoryId)
                : [...state.selectedCategories, categoryId],
            };
          },
          undefined,
          'toggleCategory'
        ),

      setStatus: (status) =>
        set({ status }, undefined, 'setStatus'),

      setDateRange: (dateRange) =>
        set({ dateRange }, undefined, 'setDateRange'),

      setSearchQuery: (searchQuery) =>
        set({ searchQuery }, undefined, 'setSearchQuery'),

      setSource: (selectedSource) =>
        set({ selectedSource }, undefined, 'setSource'),

      // -----------------------------------------------------------------------
      // Selection Actions
      // -----------------------------------------------------------------------

      setSelectedEvent: (selectedEventId) =>
        set({ selectedEventId }, undefined, 'setSelectedEvent'),

      // -----------------------------------------------------------------------
      // Map Actions
      // -----------------------------------------------------------------------

      setMapViewport: (mapViewport) =>
        set({ mapViewport }, undefined, 'setMapViewport'),

      // -----------------------------------------------------------------------
      // UI Actions
      // -----------------------------------------------------------------------

      setViewMode: (viewMode) =>
        set({ viewMode }, undefined, 'setViewMode'),

      // -----------------------------------------------------------------------
      // Timeline Actions
      // -----------------------------------------------------------------------

      setTimelinePlaying: (playing) =>
        set({ timelinePlaying: playing }, undefined, 'setTimelinePlaying'),

      setTimelineSpeed: (speed) =>
        set({ timelineSpeed: speed }, undefined, 'setTimelineSpeed'),

      setTimelineCurrentDate: (date) =>
        set({ timelineCurrentDate: date }, undefined, 'setTimelineCurrentDate'),

      setTimelineBounds: (start, end) =>
        set(
          { timelineStartDate: start, timelineEndDate: end, timelineCurrentDate: start },
          undefined,
          'setTimelineBounds'
        ),

      resetTimeline: () =>
        set({ ...DEFAULT_TIMELINE }, undefined, 'resetTimeline'),

      // -----------------------------------------------------------------------
      // Heatmap Actions
      // -----------------------------------------------------------------------

      toggleHeatmap: () =>
        set(
          (state) => ({ heatmapEnabled: !state.heatmapEnabled }),
          undefined,
          'toggleHeatmap'
        ),

      // -----------------------------------------------------------------------
      // Watchlist Actions
      // -----------------------------------------------------------------------

      toggleWatchCategory: (categoryId) =>
        set(
          (state) => {
            const exists = state.watchedCategories.includes(categoryId);
            const newCategories = exists
              ? state.watchedCategories.filter((id) => id !== categoryId)
              : [...state.watchedCategories, categoryId];
            saveWatchlist(newCategories, state.watchedEventIds);
            return { watchedCategories: newCategories };
          },
          undefined,
          'toggleWatchCategory'
        ),

      toggleWatchEvent: (eventId) =>
        set(
          (state) => {
            const exists = state.watchedEventIds.includes(eventId);
            const newEventIds = exists
              ? state.watchedEventIds.filter((id) => id !== eventId)
              : [...state.watchedEventIds, eventId];
            saveWatchlist(state.watchedCategories, newEventIds);
            return { watchedEventIds: newEventIds };
          },
          undefined,
          'toggleWatchEvent'
        ),

      isEventWatched: (eventId) => get().watchedEventIds.includes(eventId),
      isCategoryWatched: (categoryId) => get().watchedCategories.includes(categoryId),

      clearWatchlist: () => {
        saveWatchlist([], []);
        set(
          { watchedCategories: [], watchedEventIds: [] },
          undefined,
          'clearWatchlist'
        );
      },

      updateLastVisit: () => {
        const now = Date.now();
        saveLastVisit(now);
        set({ lastVisitTimestamp: now }, undefined, 'updateLastVisit');
      },

      // -----------------------------------------------------------------------
      // Reset
      // -----------------------------------------------------------------------

      resetFilters: () =>
        set(
          {
            ...DEFAULT_FILTERS,
            selectedEventId: null,
          },
          undefined,
          'resetFilters'
        ),
      };
    },
    { name: 'EarthSphere' }
  )
);
