// =============================================================================
// EarthSphere — EONET API Client
// Fully typed client for NASA EONET v3 API
// =============================================================================

import type {
  EONETEventsResponse,
  EONETEvent,
  EONETGeoJSON,
  CategoriesResponse,
  SourcesResponse,
  MagnitudesResponse,
  FilterState,
} from './types';

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

const BASE_URL = '/api/eonet';

/** Default request timeout in milliseconds */
const REQUEST_TIMEOUT = 15_000;

// -----------------------------------------------------------------------------
// Internal Helpers
// -----------------------------------------------------------------------------

/**
 * Build a URLSearchParams string from a partial FilterState.
 * Skips null, undefined, empty strings, and empty arrays.
 */
function buildQueryString(params?: Partial<FilterState>): string {
  if (!params) return '';

  const searchParams = new URLSearchParams();

  // Categories → comma-separated list
  if (params.categories && params.categories.length > 0) {
    searchParams.set('category', params.categories.join(','));
  }

  // Status
  if (params.status && params.status !== 'all') {
    searchParams.set('status', params.status);
  }

  // Source
  if (params.source) {
    searchParams.set('source', params.source);
  }

  // Date range
  if (params.dateRange?.start) {
    searchParams.set('start', params.dateRange.start);
  }
  if (params.dateRange?.end) {
    searchParams.set('end', params.dateRange.end);
  }

  // Days
  if (params.days !== null && params.days !== undefined) {
    searchParams.set('days', params.days.toString());
  }

  // Limit
  if (params.limit !== null && params.limit !== undefined) {
    searchParams.set('limit', params.limit.toString());
  }

  // Magnitude filters
  if (params.magID) {
    searchParams.set('magID', params.magID);
  }
  if (params.magMin !== null && params.magMin !== undefined) {
    searchParams.set('magMin', params.magMin.toString());
  }
  if (params.magMax !== null && params.magMax !== undefined) {
    searchParams.set('magMax', params.magMax.toString());
  }

  // Bounding box: [min_lon, min_lat, max_lon, max_lat]
  if (params.bbox) {
    searchParams.set('bbox', params.bbox.join(','));
  }

  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

/**
 * Type-safe fetch wrapper with timeout and error handling.
 */
async function apiFetch<T>(endpoint: string): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `EONET API error: ${response.status} ${response.statusText} for ${endpoint}`
      );
    }

    const data: T = await response.json() as T;
    return data;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`EONET API request timed out after ${REQUEST_TIMEOUT}ms: ${endpoint}`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// -----------------------------------------------------------------------------
// Public API Functions
// -----------------------------------------------------------------------------

/**
 * Fetch natural events from the EONET API.
 * Supports all query parameters: source, category, status, limit, days,
 * start, end, magID, magMin, magMax, bbox.
 *
 * @param params - Optional filter state to narrow results
 * @returns Promise resolving to the events response
 */
export async function fetchEvents(
  params?: Partial<FilterState>
): Promise<EONETEventsResponse> {
  const qs = buildQueryString(params);
  return apiFetch<EONETEventsResponse>(`/events${qs}`);
}

/**
 * Fetch a single event by its ID.
 *
 * @param id - The EONET event ID (e.g., 'EONET_6340')
 * @returns Promise resolving to the single event
 */
export async function fetchEventById(id: string): Promise<EONETEvent> {
  return apiFetch<EONETEvent>(`/events/${encodeURIComponent(id)}`);
}

/**
 * Fetch events as GeoJSON FeatureCollection.
 * Supports the same query parameters as fetchEvents.
 *
 * @param params - Optional filter state to narrow results
 * @returns Promise resolving to a GeoJSON FeatureCollection
 */
export async function fetchGeoJSON(
  params?: Partial<FilterState>
): Promise<EONETGeoJSON> {
  const qs = buildQueryString(params);
  return apiFetch<EONETGeoJSON>(`/events/geojson${qs}`);
}

/**
 * Fetch all available event categories.
 * Categories are static — this data rarely changes.
 *
 * @returns Promise resolving to the categories response
 */
export async function fetchCategories(): Promise<CategoriesResponse> {
  return apiFetch<CategoriesResponse>('/categories');
}

/**
 * Fetch all available data sources.
 * Sources are static — this data rarely changes.
 *
 * @returns Promise resolving to the sources response
 */
export async function fetchSources(): Promise<SourcesResponse> {
  return apiFetch<SourcesResponse>('/sources');
}



/**
 * Fetch magnitude information for all categories.
 *
 * @returns Promise resolving to the magnitudes response
 */
export async function fetchMagnitudes(): Promise<MagnitudesResponse> {
  return apiFetch<MagnitudesResponse>('/magnitudes');
}
