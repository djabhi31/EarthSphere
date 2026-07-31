// =============================================================================
// EarthSphere — Zustand Store
// Global application state for filters, map, and UI preferences
// =============================================================================

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DateRange, EventStatus, MapViewport, ViewMode } from './types';

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

// -----------------------------------------------------------------------------
// Store
// -----------------------------------------------------------------------------

export const useEarthSphereStore = create<EarthSphereState>()(
  devtools(
    (set) => ({
      // -----------------------------------------------------------------------
      // Initial State
      // -----------------------------------------------------------------------
      ...DEFAULT_FILTERS,
      selectedEventId: null,
      mapViewport: DEFAULT_MAP_VIEWPORT,
      viewMode: 'grid' as ViewMode,

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
    }),
    { name: 'EarthSphere' }
  )
);
