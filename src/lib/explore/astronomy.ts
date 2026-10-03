import * as satellite from "satellite.js";
import type { TLESatellite } from "@/lib/types/nasa";
import { DAY } from "./science";

export const EARTH_KM = 6371;
export type GeoPoint = { latitude: number; longitude: number; altitude?: number };
export function geographicVector(latitude: number, longitude: number, radius = 1): [number, number, number] {
  const lat = latitude * Math.PI / 180, lon = longitude * Math.PI / 180;
  return [radius * Math.cos(lat) * Math.cos(lon), radius * Math.sin(lat), -radius * Math.cos(lat) * Math.sin(lon)];
}
export function vectorGeographic(x: number, y: number, z: number): GeoPoint {
  return { latitude: Math.atan2(y, Math.hypot(x, z)) * 180 / Math.PI, longitude: Math.atan2(-z, x) * 180 / Math.PI };
}
/** Move around the surface of a sphere, including antipodal destinations, without crossing Earth. */
export function cameraFlightStep(from: readonly number[], to: readonly number[], fraction: number): [number, number, number] {
  const aRadius = Math.hypot(...from), bRadius = Math.hypot(...to), t = Math.max(0, Math.min(1, fraction));
  const a = from.map(value => value / aRadius), b = to.map(value => value / bRadius);
  const dot = Math.max(-1, Math.min(1, a.reduce((sum, value, i) => sum + value * b[i], 0)));
  const angle = Math.acos(dot);
  let tangent = b.map((value, i) => value - dot * a[i]);
  let length = Math.hypot(...tangent);
  if (length < 1e-7) {
    const axis = Math.abs(a[1]) < .8 ? [0, 1, 0] : [1, 0, 0];
    const projection = axis.reduce((sum, value, i) => sum + value * a[i], 0);
    tangent = axis.map((value, i) => value - projection * a[i]); length = Math.hypot(...tangent);
  }
  const radius = aRadius + (bRadius - aRadius) * t;
  return a.map((value, i) => (value * Math.cos(angle * t) + tangent[i] / length * Math.sin(angle * t)) * radius) as [number, number, number];
}
export function solarPoint(time: number): GeoPoint {
  const days = time / DAY - 10957.5;
  const radians = Math.PI / 180;
  const mean = (357.529 + .98560028 * days) * radians;
  const longitude = (280.459 + .98564736 * days + 1.915 * Math.sin(mean) + .02 * Math.sin(2 * mean)) * radians;
  const obliquity = (23.439 - .00000036 * days) * radians;
  const rightAscension = Math.atan2(Math.cos(obliquity) * Math.sin(longitude), Math.cos(longitude));
  const declination = Math.asin(Math.sin(obliquity) * Math.sin(longitude));
  const gmst = satellite.gstime(new Date(time));
  const lon = ((rightAscension - gmst) / radians % 360 + 540) % 360 - 180;
  return { latitude: declination / radians, longitude: lon };
}
export function tleEpoch(line: string): number {
  const year = Number(line.slice(18, 20));
  const day = Number(line.slice(20, 32));
  if (!Number.isFinite(year) || !Number.isFinite(day) || day < 1 || day > 367) return NaN;
  return Date.UTC(year < 57 ? 2000 + year : 1900 + year, 0, 1) + (day - 1) * DAY;
}
const records = new Map<string, satellite.SatRec>();
export function propagatedPosition(tle: TLESatellite, time: number) {
  if (!tle.line1.startsWith("1 ") || !tle.line2.startsWith("2 ") || !Number.isFinite(time) || !Number.isFinite(tleEpoch(tle.line1)) || Math.abs(time - tleEpoch(tle.line1)) > 14 * DAY) return null;
  try {
    let record = records.get(tle.line1 + tle.line2);
    if (!record) { record = satellite.twoline2satrec(tle.line1, tle.line2); if (records.size > 160) records.clear(); records.set(tle.line1 + tle.line2, record); }
    const state = satellite.propagate(record, new Date(time));
    if (!state.position || !state.velocity) return null;
    const position = satellite.eciToGeodetic(state.position as satellite.EciVec3<number>, satellite.gstime(new Date(time)));
    const velocity = state.velocity as satellite.EciVec3<number>;
    if (!Number.isFinite(position.height) || position.height < 80) return null;
    return { latitude: satellite.degreesLat(position.latitude), longitude: satellite.degreesLong(position.longitude), altitude: position.height, speed: Math.hypot(velocity.x, velocity.y, velocity.z), period: 1440 / Number(tle.line2.slice(52, 63)) };
  } catch { return null; }
}
export function orbitPath(tle: TLESatellite, time: number, ground = false) {
  const period = 1440 / Number(tle.line2.slice(52, 63));
  if (!Number.isFinite(period) || period <= 0) return [];
  const points: [number, number, number][] = [];
  for (let i = 0; i <= 160; i++) {
    const position = propagatedPosition(tle, time + (i / 160 - .5) * period * 60000);
    if (position) points.push(geographicVector(position.latitude, position.longitude, ground ? 1.004 : 1 + position.altitude / EARTH_KM));
  }
  return points;
}
