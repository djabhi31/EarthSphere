// =============================================================================
// EarthSphere — Utility Functions
// Helper utilities for categories, formatting, class merging, and event logic
// =============================================================================

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { CategoryConfig, EONETEvent, EventGeometry } from './types';

// -----------------------------------------------------------------------------
// Class Name Utility
// -----------------------------------------------------------------------------

/**
 * Merge class names with Tailwind CSS conflict resolution.
 * Combines clsx for conditional classes with tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// -----------------------------------------------------------------------------
// Category Configuration — All 13 EONET Categories
// -----------------------------------------------------------------------------

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  wildfires: {
    id: 'wildfires',
    label: 'Wildfires',
    icon: 'Flame',
    color: '#ff6b35',
  },
  severeStorms: {
    id: 'severeStorms',
    label: 'Severe Storms',
    icon: 'CloudLightning',
    color: '#38bdf8',
  },
  volcanoes: {
    id: 'volcanoes',
    label: 'Volcanoes',
    icon: 'Mountain',
    color: '#ef4444',
  },
  earthquakes: {
    id: 'earthquakes',
    label: 'Earthquakes',
    icon: 'Activity',
    color: '#a855f7',
  },
  floods: {
    id: 'floods',
    label: 'Floods',
    icon: 'Waves',
    color: '#3b82f6',
  },
  drought: {
    id: 'drought',
    label: 'Drought',
    icon: 'Sun',
    color: '#f59e0b',
  },
  snow: {
    id: 'snow',
    label: 'Snow',
    icon: 'Snowflake',
    color: '#e2e8f0',
  },
  seaLakeIce: {
    id: 'seaLakeIce',
    label: 'Sea & Lake Ice',
    icon: 'Anchor',
    color: '#06b6d4',
  },
  landslides: {
    id: 'landslides',
    label: 'Landslides',
    icon: 'MountainSnow',
    color: '#92400e',
  },
  dustHaze: {
    id: 'dustHaze',
    label: 'Dust & Haze',
    icon: 'Cloud',
    color: '#d4a574',
  },
  tempExtremes: {
    id: 'tempExtremes',
    label: 'Temperature Extremes',
    icon: 'Thermometer',
    color: '#dc2626',
  },
  waterColor: {
    id: 'waterColor',
    label: 'Water Color',
    icon: 'Droplets',
    color: '#0ea5e9',
  },
  manmade: {
    id: 'manmade',
    label: 'Man-Made',
    icon: 'Factory',
    color: '#6b7280',
  },
} as const;

/** Ordered array of all category IDs */
export const CATEGORY_IDS = Object.keys(CATEGORY_CONFIG) as readonly string[];

// -----------------------------------------------------------------------------
// Category Lookups
// -----------------------------------------------------------------------------

/**
 * Returns the hex color for a given category ID.
 * Falls back to a neutral gray for unknown categories.
 */
export function getCategoryColor(id: string): string {
  return CATEGORY_CONFIG[id]?.color ?? '#6b7280';
}

/**
 * Returns a human-friendly label for a given category ID.
 * Falls back to title-casing the ID itself.
 */
export function getCategoryLabel(id: string): string {
  if (CATEGORY_CONFIG[id]) {
    return CATEGORY_CONFIG[id].label;
  }
  // Fallback: convert camelCase to Title Case
  return id
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

/**
 * Returns the Lucide icon name string for a given category ID.
 * Falls back to 'Globe' for unknown categories.
 */
export function getCategoryIconName(id: string): string {
  return CATEGORY_CONFIG[id]?.icon ?? 'Globe';
}

// -----------------------------------------------------------------------------
// Date & Time Formatting
// -----------------------------------------------------------------------------

/**
 * Format an ISO 8601 date string to a human-readable format.
 * Example: "Jun 15, 2026, 6:30 PM"
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Returns a relative time string like '2h ago', '3 days ago', 'just now'.
 */
export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return 'Unknown';
  }

  const now = Date.now();
  const diffMs = now - date.getTime();

  // Handle future dates
  if (diffMs < 0) {
    return 'just now';
  }

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 5) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}

// -----------------------------------------------------------------------------
// Data Formatting
// -----------------------------------------------------------------------------

/**
 * Format magnitude value with its unit.
 * Returns '—' if value is null or undefined.
 */
export function formatMagnitude(value: number | null, unit: string | null): string {
  if (value === null || value === undefined) {
    return '—';
  }
  const formatted = Number.isInteger(value) ? value.toString() : value.toFixed(2);
  return unit ? `${formatted} ${unit}` : formatted;
}

/**
 * Format coordinates to a readable string: "lat°N/S, lng°E/W".
 * Expects [longitude, latitude] as per GeoJSON spec.
 */
export function formatCoordinates(coords: unknown): string {
  if (!coords || !Array.isArray(coords) || coords.length === 0) {
    return '—';
  }

  let point = coords as unknown[];
  while (Array.isArray(point[0])) {
    point = point[0] as unknown[];
  }

  if (point.length < 2) return '—';

  const [lng, lat] = point as number[];
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';

  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
}

// -----------------------------------------------------------------------------
// Event Helpers
// -----------------------------------------------------------------------------

/**
 * Determine whether an event is active or closed.
 */
export function getEventStatus(event: EONETEvent): 'active' | 'closed' {
  return event.closed === null ? 'active' : 'closed';
}

/**
 * Get coordinates [lng, lat] from a Point geometry.
 * Returns null if not a Point or invalid coordinates.
 */
export function getPointCoordinates(geo: EventGeometry): [number, number] | null {
  if (geo.type !== 'Point') return null;
  const coords = geo.coordinates as number[];
  if (!coords || coords.length < 2) return null;
  return [coords[0], coords[1]];
}

/**
 * Compute human-readable duration of an event.
 */
export function computeDuration(event: EONETEvent): string {
  if (!event.geometry || event.geometry.length === 0) return '—';
  const firstDate = new Date(event.geometry[0].date);
  const lastDate = event.closed
    ? new Date(event.closed)
    : new Date(event.geometry[event.geometry.length - 1].date);
  const diffMs = lastDate.getTime() - firstDate.getTime();
  if (diffMs < 0) return '< 1 day';

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days === 0) return '< 1 day';
  if (days === 1) return '1 day';
  if (days < 30) return `${days} days`;
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? 's' : ''}`;
  }
  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? 's' : ''}`;
}

/**
 * Get the most recent geometry entry from an event.
 * Geometry entries are sorted by date descending; returns the first (latest).
 * Returns undefined if the event has no geometry.
 */
export function getLatestGeometry(event: EONETEvent): EventGeometry | undefined {
  if (!event.geometry || event.geometry.length === 0) {
    return undefined;
  }

  // EONET typically returns geometries in chronological order, so last is latest.
  // We sort defensively to guarantee the most recent entry.
  const sorted = [...event.geometry].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return sorted[0];
}

/**
 * @deprecated Import from `@/lib/design-tokens` instead.
 * Core design system color palette — kept for backwards compatibility.
 */
export const COLORS = {
  spaceBlack: '#050714',
  deepBlue: '#101936',
  electricCyan: '#00d4aa',
  electricBlue: '#45b8ff',
  solarOrange: '#ff6b35',
  cosmicPurple: '#7c3aed',
  iceBlue: '#38bdf8',
  warningRed: '#ef4444',
  auroraMint: '#6ee7d0',
} as const;

/**
 * @deprecated Import `durationsMs` from `@/lib/design-tokens` instead.
 * Animation duration presets in milliseconds.
 */
export const ANIMATION_DURATION = {
  fast: 160,
  normal: 280,
  complex: 520,
  cinematic: 900,
} as const;

/**
 * @deprecated Import `durations` from `@/lib/design-tokens` instead.
 * Animation duration presets in seconds (for motion.dev).
 */
export const ANIMATION_SECONDS = {
  fast: 0.16,
  normal: 0.28,
  complex: 0.52,
  cinematic: 0.9,
} as const;
