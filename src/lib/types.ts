// =============================================================================
// EarthSphere — Type Definitions
// Complete TypeScript interfaces for NASA EONET v3 API & application state
// =============================================================================

// -----------------------------------------------------------------------------
// EONET API Response Types
// -----------------------------------------------------------------------------

/** A single coordinate pair or triple: [longitude, latitude] or [longitude, latitude, altitude] */
export type Coordinate = [number, number] | [number, number, number];

/** Geometry entry attached to an EONET event */
export interface EventGeometry {
  readonly magnitudeValue: number | null;
  readonly magnitudeUnit: string | null;
  readonly date: string;
  readonly type: 'Point' | 'Polygon';
  readonly coordinates: Coordinate | Coordinate[][] ;
}

/** Category descriptor on an event */
export interface EventCategory {
  readonly id: string;
  readonly title: string;
}

/** Source reference on an event */
export interface EventSource {
  readonly id: string;
  readonly url: string;
}

/** A single EONET natural event */
export interface EONETEvent {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly link: string;
  readonly closed: string | null;
  readonly categories: readonly EventCategory[];
  readonly sources: readonly EventSource[];
  readonly geometry: readonly EventGeometry[];
}

/** Top-level response from /events endpoint */
export interface EONETEventsResponse {
  readonly title: string;
  readonly description: string;
  readonly link: string;
  readonly events: readonly EONETEvent[];
}

// -----------------------------------------------------------------------------
// GeoJSON Types (from /events/geojson endpoint)
// -----------------------------------------------------------------------------

/** Properties attached to a GeoJSON Feature */
export interface GeoJSONEventProperties {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly link: string;
  readonly closed: string | null;
  readonly date: string;
  readonly magnitudeValue: number | null;
  readonly magnitudeUnit: string | null;
  readonly categories: readonly EventCategory[];
  readonly sources: readonly EventSource[];
}

/** A single GeoJSON Feature representing an EONET event */
export interface GeoJSONFeature {
  readonly type: 'Feature';
  readonly geometry: {
    readonly type: 'Point' | 'Polygon';
    readonly coordinates: Coordinate | Coordinate[][];
  };
  readonly properties: GeoJSONEventProperties;
}

/** GeoJSON FeatureCollection response */
export interface EONETGeoJSON {
  readonly type: 'FeatureCollection';
  readonly features: readonly GeoJSONFeature[];
}

// -----------------------------------------------------------------------------
// Categories
// -----------------------------------------------------------------------------

/** Layer within a category */
export interface Layer {
  readonly name: string;
  readonly serviceUrl: string;
  readonly serviceTypeId: string;
  readonly parameters: readonly Record<string, string>[];
}

/** A single EONET event category */
export interface Category {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly link: string;
  readonly layers: string;
}

/** Response from /categories endpoint */
export interface CategoriesResponse {
  readonly title: string;
  readonly description: string;
  readonly link: string;
  readonly categories: readonly Category[];
}

// -----------------------------------------------------------------------------
// Sources
// -----------------------------------------------------------------------------

/** An EONET data source */
export interface Source {
  readonly id: string;
  readonly title: string;
  readonly source: string;
  readonly link: string;
}

/** Response from /sources endpoint */
export interface SourcesResponse {
  readonly title: string;
  readonly description: string;
  readonly link: string;
  readonly sources: readonly Source[];
}

// -----------------------------------------------------------------------------
// Layers
// -----------------------------------------------------------------------------

/** Category with its associated layers */
export interface LayerCategory {
  readonly id: string;
  readonly title: string;
  readonly layers: readonly Layer[];
}

/** Response from /layers endpoint */
export interface LayersResponse {
  readonly title: string;
  readonly description: string;
  readonly link: string;
  readonly categories: readonly LayerCategory[];
}

// -----------------------------------------------------------------------------
// Magnitudes
// -----------------------------------------------------------------------------

/** A unit for measuring event magnitude */
export interface MagnitudeUnit {
  readonly id: string;
  readonly label: string;
}

/** Category with its magnitude unit options */
export interface MagnitudeCategory {
  readonly id: string;
  readonly title: string;
  readonly units: readonly MagnitudeUnit[];
}

/** Response from /magnitudes endpoint */
export interface MagnitudesResponse {
  readonly title: string;
  readonly description: string;
  readonly link: string;
  readonly categories: readonly MagnitudeCategory[];
}

// -----------------------------------------------------------------------------
// Application State Types
// -----------------------------------------------------------------------------

/** Status filter for events */
export type EventStatus = 'open' | 'closed' | 'all';

/** Map viewport state */
export interface MapViewport {
  readonly lat: number;
  readonly lng: number;
  readonly zoom: number;
}

/** Date range for filtering events */
export interface DateRange {
  readonly start: string | null;
  readonly end: string | null;
}

/** Bounding box: [min_lon, min_lat, max_lon, max_lat] */
export type BoundingBox = [number, number, number, number];

/** Complete filter state for querying events */
export interface FilterState {
  readonly categories: readonly string[];
  readonly status: EventStatus;
  readonly dateRange: DateRange;
  readonly searchQuery: string;
  readonly source: string | null;
  readonly magID: string | null;
  readonly magMin: number | null;
  readonly magMax: number | null;
  readonly bbox: BoundingBox | null;
  readonly limit: number | null;
  readonly days: number | null;
}

/** View mode for the events display */
export type ViewMode = 'grid' | 'list';

// -----------------------------------------------------------------------------
// Derived / Computed Types
// -----------------------------------------------------------------------------

/** Breakdown count by category */
export interface CategoryCount {
  readonly id: string;
  readonly title: string;
  readonly count: number;
}

/** Breakdown count by source */
export interface SourceCount {
  readonly id: string;
  readonly count: number;
}

/** Aggregated statistics from event data */
export interface EventStats {
  readonly totalActive: number;
  readonly totalClosed: number;
  readonly byCategory: readonly CategoryCount[];
  readonly bySources: readonly SourceCount[];
  readonly thisMonth: number;
}

// -----------------------------------------------------------------------------
// Category Configuration (UI)
// -----------------------------------------------------------------------------

/** Configuration for rendering a single category in the UI */
export interface CategoryConfig {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly color: string;
}
