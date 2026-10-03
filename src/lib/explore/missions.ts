export type Mission = { target_entity: string; title: string; description: string; launch_date: string; end_date?: string; categories: string[]; url?: string; thumb_name?: string; instrument_parent?: string };
export const NORAD_IDS: Record<string, number> = {
  sc_iss: 25544, sc_iss_cowvr_tempest: 25544, sc_iss_ecostress: 25544, sc_iss_emit: 25544, sc_iss_oco_3: 25544,
  sc_terra: 25994, sc_aqua: 27424, sc_aura: 28376, sc_suomi_npp: 37849, sc_noaa_20: 43013, sc_noaa_21: 54234,
  sc_landsat_8: 39084, sc_landsat_9: 49260, sc_gpm: 39574, sc_oco_2: 40059, sc_smap: 40376,
  sc_jason_3: 41240, sc_cygnss_1: 41887, sc_grace_fo1: 43476, sc_icesat_2: 43613, sc_sentinel_6: 46984, sc_swot: 54754, sc_pace: 58928,
  sc_nisar: 65053, sc_prefire_1: 59965, sc_prefire_2: 59881, sc_sentinel_6b: 66514, sc_tempo: 56174,
};
export type OrbitRecord = TLESatellite & { source: "CelesTrak" | "TLE API" };
export function parseCelestrakElements(noradId: number, text: string): OrbitRecord | null {
  const lines = text.trim().split(/\r?\n/).map(line => line.trim());
  const index = lines.findIndex(line => line.startsWith("1 ") && Number(line.slice(2, 7)) === noradId);
  if (index < 0 || !lines[index + 1]?.startsWith("2 ") || Number(lines[index + 1].slice(2, 7)) !== noradId || lines[index].length < 68 || lines[index + 1].length < 68) return null;
  const year = Number(lines[index].slice(18, 20)), day = Number(lines[index].slice(20, 32));
  if (!Number.isFinite(year) || !Number.isFinite(day) || day < 1 || day > 367) return null;
  return { satelliteId: noradId, name: lines[index - 1]?.replace(/^0 /, "") || `NORAD ${noradId}`, date: new Date(Date.UTC(year < 57 ? 2000 + year : 1900 + year, 0, 1) + (day - 1) * 86400000).toISOString(), line1: lines[index], line2: lines[index + 1], source: "CelesTrak" };
}
export function missionStatus(mission: Mission, now: number): "Current" | "Past" | "Future" {
  const parse = (date: string) => Date.parse(date.replace(/(\d+)(st|nd|rd|th)/gi, "$1"));
  if (mission.end_date && Number.isFinite(parse(mission.end_date)) && parse(mission.end_date) < now) return "Past";
  return parse(mission.launch_date) > now ? "Future" : "Current";
}
export function plainText(html: string) { return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim(); }
export function missionUrl(url?: string): string | null {
  try { const link = new URL(url || ""); if (link.username || link.password || (link.hostname !== "nasa.gov" && !link.hostname.endsWith(".nasa.gov"))) return null; link.protocol = "https:"; return link.href; } catch { return null; }
}
// Approximate overall spans for an explicitly illustrative size comparison, in metres.
export const MISSION_SPANS: Record<string, number> = { sc_iss: 109, sc_terra: 8.6, sc_aqua: 16.7, sc_aura: 15, sc_smap: 9.7, sc_icesat_2: 9.5, sc_landsat_8: 9, sc_landsat_9: 9, sc_swot: 10, sc_oco_2: 9 };
import type { TLESatellite } from "@/lib/types/nasa";
