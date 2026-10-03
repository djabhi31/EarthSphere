import type { EONETEvent } from "@/lib/types";

export type Vector = [number, number, number];
export const CHAPTERS = [
  { id: "arrival", label: "Arrival", tag: "01 / A NEW PERSPECTIVE" },
  { id: "living-earth", label: "Living Earth", tag: "02 / EARTH OBSERVATION" },
  { id: "in-orbit", label: "In orbit", tag: "03 / ABOVE & BEYOND" },
  { id: "beyond-earth", label: "Beyond Earth", tag: "04 / THE NEXT FRONTIER" },
  { id: "connected-world", label: "Connected world", tag: "05 / PLANETARY INTELLIGENCE" },
  { id: "your-mission", label: "Your mission", tag: "06 / KEEP EXPLORING" },
] as const;

// One persistent world, with an actual perspective camera moving between views.
// Mars is at (12, 0, -3); the Earth remains at the world origin throughout.
const STOPS: { position: Vector; target: Vector; rotation: number }[] = [
  { position: [0, 1.2, 8.9], target: [-0.85, 0.5, 0], rotation: -0.32 },
  { position: [2.4, 1.15, 5.8], target: [1.5, 0.15, 0], rotation: 1.3 },
  { position: [-4.9, 2.3, 8.5], target: [-1.3, 0.25, 0], rotation: 2.8 },
  { position: [12.4, 1.1, 5.6], target: [10.8, 0.15, -3], rotation: 3.7 },
  { position: [-3.4, 2.0, 8.4], target: [-1.2, 0.3, 0], rotation: 5.3 },
  { position: [0, 1.7, 11.5], target: [0, 1.65, 0], rotation: 6.5 },
];

export function clamp01(value: number) { return Math.max(0, Math.min(1, value)); }
export function smoothstep(value: number) { const t = clamp01(value); return t * t * (3 - 2 * t); }
export function chapterWeight(progress: number, chapter: number) {
  return 1 - smoothstep(Math.abs(progress * 5 - chapter));
}

export function sampleFlight(progress: number, mobile = false) {
  const p = clamp01(Number.isFinite(progress) ? progress : 0) * (STOPS.length - 1);
  const index = Math.min(STOPS.length - 2, Math.floor(p));
  const a = STOPS[index], b = STOPS[index + 1];
  const t = smoothstep(p - index);
  const mix = (x: number, y: number) => x + (y - x) * t;
  const position = a.position.map((n, i) => mix(n, b.position[i])) as Vector;
  const target = a.target.map((n, i) => mix(n, b.target[i])) as Vector;
  // Add distance during the cross-space flights so the path clears both worlds.
  const transit = Math.sin(Math.PI * t) * ((index === 2 || index === 3) ? 5 : 0);
  position[2] += transit;
  if (mobile) {
    position[2] += 4.3;
    target[0] = index === 3 ? mix(12, 0) : (index === 2 ? mix(0, 12) : 0);
    target[1] += 1.6;
  }
  return { position, target, rotation: mix(a.rotation, b.rotation) };
}

/** Matches Three.js sphere UVs and the app's equirectangular Blue Marble map. */
export function geographicPoint(longitude: number, latitude: number, radius = 2.37): Vector {
  const lat = latitude * Math.PI / 180, lon = longitude * Math.PI / 180;
  return [radius * Math.cos(lat) * Math.cos(lon), radius * Math.sin(lat), -radius * Math.cos(lat) * Math.sin(lon)];
}

export function eventCoordinates(event: EONETEvent): [number, number] | null {
  const newestFirst = [...event.geometry].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  for (const geometry of newestFirst) {
    if (geometry.type !== "Point") continue;
    const [longitude, latitude] = geometry.coordinates;
    if (typeof longitude === "number" && typeof latitude === "number" &&
      Number.isFinite(longitude) && Number.isFinite(latitude) && Math.abs(longitude) <= 180 && Math.abs(latitude) <= 90) {
      return [longitude, latitude];
    }
  }
  return null;
}
