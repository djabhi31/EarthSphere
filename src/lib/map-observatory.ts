import type { EONETEvent, EventGeometry } from "./types";
import type { FeatureCollection, LineString, Polygon } from "geojson";
import { solarPoint } from "./explore/astronomy";

export type MapRange = { start: string; end: string };
export type Observation = { event: EONETEvent; geometry: EventGeometry; point: [number, number]; open: boolean };
export type MapStatus = "open" | "closed" | "all";
export const DAY = 86400000;
export function validMapDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}
export function shiftDate(date: string, days: number) { return validMapDate(date) ? new Date(Date.parse(date) + days * DAY).toISOString().slice(0, 10) : ""; }
export function rangeDates(range: MapRange) {
  if (!validMapDate(range.start) || !validMapDate(range.end)) return [];
  const length = Math.floor((Date.parse(range.end) - Date.parse(range.start)) / DAY) + 1;
  if (length < 1 || length > 366) return [];
  return Array.from({ length }, (_, i) => shiftDate(range.start, i));
}
export function geometryPoint(geometry: EventGeometry): [number, number] | null {
  const valid = (p: unknown): p is number[] => Array.isArray(p) && p.length >= 2 && Number.isFinite(p[0]) && Number.isFinite(p[1]) && Math.abs(p[0]) <= 180 && Math.abs(p[1]) <= 90;
  if (geometry.type === "Point") return valid(geometry.coordinates) ? [geometry.coordinates[0], geometry.coordinates[1]] : null;
  const ring = geometry.coordinates[0];
  if (!Array.isArray(ring) || !ring.length || !ring.every(valid)) return null;
  const points = ring.length > 1 && ring[0][0] === ring.at(-1)![0] && ring[0][1] === ring.at(-1)![1] ? ring.slice(0, -1) : ring;
  if (!points.length) return null;
  const anchor = points[0][0];
  const longitude = points.reduce((sum, p) => sum + anchor + ((p[0] - anchor + 540) % 360 - 180), 0) / points.length;
  return [((longitude + 540) % 360) - 180, points.reduce((sum, p) => sum + p[1], 0) / points.length];
}
export function observationsAt(events: readonly EONETEvent[], range: MapRange, date: string, status: MapStatus, categories: string[] = [], search = ""): Observation[] {
  const cutoff = Math.min(Date.parse(date) + DAY - 1, Date.parse(range.end) + DAY - 1);
  const start = Date.parse(range.start);
  if (!Number.isFinite(cutoff) || !Number.isFinite(start)) return [];
  const term = search.trim().toLowerCase();
  return events.flatMap(event => {
    if (term && !`${event.title} ${event.id} ${event.categories.map(c => c.title).join(" ")}`.toLowerCase().includes(term)) return [];
    if (categories.length && !event.categories.some(c => categories.includes(c.id))) return [];
    const open = !event.closed || Date.parse(event.closed) > cutoff;
    if (status !== "all" && (status === "open") !== open) return [];
    const geometry = [...event.geometry].filter(g => {
      const time = Date.parse(g.date);
      return time >= start && time <= cutoff && geometryPoint(g);
    }).sort((a, b) => b.date.localeCompare(a.date))[0];
    const point = geometry && geometryPoint(geometry);
    return point ? [{ event, geometry, point, open }] : [];
  }).sort((a, b) => b.geometry.date.localeCompare(a.geometry.date));
}
export function dailyActivity(events: readonly EONETEvent[], dates: string[]) {
  const counts = new Map(dates.map(date => [date, 0]));
  for (const event of events) {
    const observed = new Set(event.geometry.filter(g => geometryPoint(g)).map(g => g.date.slice(0, 10)));
    for (const date of observed) if (counts.has(date)) counts.set(date, counts.get(date)! + 1);
  }
  return dates.map(date => counts.get(date) || 0);
}
export function distanceKm(from: [number, number], to: [number, number]) {
  const rad = Math.PI / 180;
  const a = Math.sin((to[1] - from[1]) * rad / 2) ** 2 + Math.cos(from[1] * rad) * Math.cos(to[1] * rad) * Math.sin((to[0] - from[0]) * rad / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, a)));
}
export function recordedMovement(event: EONETEvent, date: string) {
  const points = event.geometry.filter(g => g.type === "Point" && Number.isFinite(Date.parse(g.date)) && g.date.slice(0, 10) <= date && geometryPoint(g)).sort((a, b) => a.date.localeCompare(b.date));
  if (points.length < 2) return null;
  const durationHours = (Date.parse(points.at(-1)!.date) - Date.parse(points[0].date)) / 3600000;
  if (durationHours <= 0) return null;
  const km = points.slice(1).reduce((total, point, index) => total + distanceKm(geometryPoint(points[index])!, geometryPoint(point)!), 0);
  return { km, durationHours, count: points.length };
}
export function observationTrack(event: EONETEvent, range: MapRange, end: string): FeatureCollection<LineString> {
  const points = [...event.geometry].filter(g => g.date.slice(0, 10) >= range.start && g.date.slice(0, 10) <= end && g.type === "Point").sort((a, b) => a.date.localeCompare(b.date)).map(geometryPoint).filter((p): p is [number, number] => !!p);
  const segments: [number, number][][] = [[]];
  for (const point of points) {
    const last = segments.at(-1)!;
    if (last.length && Math.abs(point[0] - last.at(-1)![0]) > 180) segments.push([point]);
    else last.push(point);
  }
  return { type: "FeatureCollection", features: segments.filter(segment => segment.length > 1).map(coordinates => ({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates } })) };
}
export function geographicBounds(points: [number, number][]): [[number, number], [number, number]] | null {
  if (!points.length) return null;
  const longitudes = points.map(p => (p[0] + 360) % 360).sort((a, b) => a - b);
  let largest = -1, gapIndex = 0;
  longitudes.forEach((longitude, i) => { const gap = (i === longitudes.length - 1 ? longitudes[0] + 360 : longitudes[i + 1]) - longitude; if (gap > largest) { largest = gap; gapIndex = i; } });
  let west = longitudes[(gapIndex + 1) % longitudes.length], east = longitudes[gapIndex];
  if (east < west) east += 360;
  if (west > 180) { west -= 360; east -= 360; }
  const clampLatitude = (latitude: number) => Math.max(-85, Math.min(85, latitude));
  return [[west, clampLatitude(Math.min(...points.map(p => p[1])))], [east, clampLatitude(Math.max(...points.map(p => p[1])))]];
}
export function nightGeometry(time: number): FeatureCollection<Polygon> {
  const sun = solarPoint(time), radians = Math.PI / 180;
  const declination = Math.abs(sun.latitude) < .0001 ? .0001 : sun.latitude;
  const pole = declination > 0 ? -90 : 90;
  const boundary = Array.from({ length: 361 }, (_, i) => {
    const longitude = -180 + i;
    return [longitude, Math.atan(-Math.cos((longitude - sun.longitude) * radians) / Math.tan(declination * radians)) / radians];
  });
  return { type: "FeatureCollection", features: [{ type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [[[-180, pole], ...boundary, [180, pole], [-180, pole]]] } }] };
}
export function safeMapLink(value: string) { try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : null; } catch { return null; } }
