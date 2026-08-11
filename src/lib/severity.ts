// =============================================================================
// EarthSphere — Severity Index & Distance Utilities
// Calculates hazard severity level (1-5) and geospatial distance (Haversine)
// =============================================================================

import type { EONETEvent } from './types';
import { getLatestGeometry } from './utils';

export interface SeverityInfo {
  level: 1 | 2 | 3 | 4 | 5;
  label: string;
  color: string;
  badgeBg: string;
  borderColor: string;
  description: string;
  score: number;
}

/**
 * Calculates Great Circle distance between two points in km and miles using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): { km: number; miles: number } {
  const R = 6371; // Earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const km = Math.round(R * c);
  const miles = Math.round(km * 0.621371);

  return { km, miles };
}

/**
 * Calculates objective hazard severity index (1-5 scale) based on event properties
 */
export function calculateSeverity(event: EONETEvent): SeverityInfo {
  const latestGeo = getLatestGeometry(event);
  const magValue = latestGeo?.magnitudeValue ?? 0;
  const geoCount = event.geometry.length;

  // Compute duration in days if available
  let durationDays = 1;
  if (event.geometry.length > 1) {
    const firstDate = new Date(event.geometry[0].date).getTime();
    const lastDate = new Date(event.geometry[event.geometry.length - 1].date).getTime();
    durationDays = Math.max(1, Math.round((lastDate - firstDate) / (1000 * 3600 * 24)));
  }

  // Category weight
  const catId = event.categories[0]?.id || '';
  let catWeight = 1;
  if (['volcanoes', 'severeStorms', 'earthquakes'].includes(catId)) catWeight = 1.5;
  if (['wildfires', 'floods'].includes(catId)) catWeight = 1.2;

  // Composite score calculation (0 to 100+)
  const magScore = Math.min(40, magValue * 3);
  const geoScore = Math.min(30, geoCount * 2);
  const durationScore = Math.min(30, durationDays * 0.5);

  const rawScore = (magScore + geoScore + durationScore) * catWeight;
  const score = Math.min(100, Math.round(rawScore));

  if (score >= 70 || magValue >= 8 || durationDays >= 60) {
    return {
      level: 5,
      label: "Catastrophic Hazard",
      color: "#ef4444", // Red
      badgeBg: "rgba(239, 68, 68, 0.15)",
      borderColor: "rgba(239, 68, 68, 0.4)",
      description: "Extremely high impact event with multi-region scope and severe magnitude.",
      score,
    };
  }

  if (score >= 45 || magValue >= 5 || durationDays >= 20 || geoCount >= 10) {
    return {
      level: 4,
      label: "High Severity",
      color: "#ff6b35", // Vibrant Orange
      badgeBg: "rgba(255, 107, 53, 0.15)",
      borderColor: "rgba(255, 107, 53, 0.4)",
      description: "Significant natural hazard with expanding footprint and notable intensity.",
      score,
    };
  }

  if (score >= 25 || magValue >= 2 || durationDays >= 5 || geoCount >= 4) {
    return {
      level: 3,
      label: "Moderate Hazard",
      color: "#eab308", // Yellow
      badgeBg: "rgba(234, 179, 8, 0.15)",
      borderColor: "rgba(234, 179, 8, 0.4)",
      description: "Active event with measurable environmental impact and steady duration.",
      score,
    };
  }

  if (score >= 10 || durationDays > 1) {
    return {
      level: 2,
      label: "Low-Moderate Event",
      color: "#00d4aa", // Electric Cyan
      badgeBg: "rgba(0, 212, 170, 0.15)",
      borderColor: "rgba(0, 212, 170, 0.4)",
      description: "Localized natural phenomenon under active monitoring.",
      score,
    };
  }

  return {
    level: 1,
    label: "Minor Event",
    color: "#38bdf8", // Sky Blue
    badgeBg: "rgba(56, 189, 248, 0.15)",
    borderColor: "rgba(56, 189, 248, 0.4)",
    description: "Low-risk natural event with localized impact.",
    score,
  };
}
