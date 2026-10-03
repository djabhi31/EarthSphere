import catalog from "./datasets.json";

export type Readout = { units?: string; bottom?: number; variation?: number; numOffset?: number; scalingFactor?: number; dps?: number; rain?: { units: string; scalingFactor: number }; snow?: { units: string; scalingFactor: number } };
export type Dataset = { id: string; label: string; average?: string; missions?: string[]; readout?: Readout };
export type ScienceLayer = { id: string; title: string; variants: Dataset[]; description: string; color: string; palette: string[] };
export type DatasetManifest = { datasetName: string; startDate: string; endDate: string; frequency: string; missingDates?: string[]; type?: string; availableDates?: Record<string, { layerId?: string; cubemapId?: string }> };
export const EYES_DATA = "https://eyes.nasa.gov/assets/dynamic/earth/data";
export const DAY = 86_400_000;
export const GIBS_LEGENDS: Record<string, string> = {
  omiOzoneToday: "OMI_Ozone_TOMS_Total_Column",
  seaSurfaceDayTempToday: "VIIRS_Sea_Surface_Temperature",
  seaSurfaceNightTempToday: "VIIRS_Sea_Surface_Temperature",
  chlorophyllToday: "MODIS_Chlorophyll",
  smapGppMean: "SMAP_Mean_Gross_Primary_Productivity",
};
const spectra = ["#281b63", "#426ed9", "#5eced5", "#f2e88d", "#e68e58", "#b72e5c"];
const water = ["#c7ad6b", "#83c4ad", "#439ab8", "#3355a7", "#642c91"];
const descriptions: Record<string, string> = {
  visibleEarth: "A new perspective every day. Follow clouds, coastlines and landscapes in satellite observations of visible light.",
  "air-temperature": "See the atmosphere’s uneven warmth, from the air near the surface to the upper troposphere. Switch between daytime, nighttime and multi-day averages.",
  "carbon-dioxide": "Trace atmospheric carbon dioxide with OCO-2 and AIRS. These observations describe concentration, not surface emissions.",
  "carbon-monoxide": "Follow a gas released by fires and incomplete combustion. AIRS observations reveal its movement through the atmosphere.",
  chlorophyll: "Ocean color reveals the tiny photosynthetic organisms at the foundation of marine food webs. Cloud cover creates gaps in the observations.",
  radar: "See Earth in radar. NISAR measurements reveal changes in land and ice using microwave signals rather than sunlight.",
  precipitation: "Follow rain and snow around the planet with satellite estimates of daily precipitation.",
  "sea-level": "Explore variations in ocean height measured by satellite altimeters. Positive and negative anomalies reveal changing ocean conditions.",
  "sea-surface-temp": "Discover the temperature patterns at the ocean’s surface, where currents move heat around the globe.",
  "soil-moisture": "Look beneath the surface. SMAP observations follow water in the soil, root-zone wetness and plant productivity.",
  salinity: "Salt changes seawater density and circulation. Explore the patterns measured by SMAP over the world’s oceans.",
  ozone: "Explore protective ozone in the atmosphere. Total-column observations and stratospheric measurements describe different parts of its story.",
  "water-vapor": "Follow atmospheric water: an essential part of the water cycle and a powerful greenhouse gas.",
  "gravity-field-map": "Small changes in gravity reveal water moving through ice sheets, groundwater, soil and oceans. GRACE measures the change in storage.",
  "nitrous-oxide": "Explore nitrous oxide in the stratosphere with Aura’s Microwave Limb Sounder.",
  "hydrochloric-acid": "Track a reservoir of atmospheric chlorine and its role in the chemistry of stratospheric ozone.",
  "chlorine-monoxide": "Observe a reactive chlorine compound involved in the destruction of stratospheric ozone.",
  "nitric-acid": "Explore nitric acid in the stratosphere and its relationship with polar clouds and ozone chemistry.",
};
export const SCIENCE_LAYERS: ScienceLayer[] = catalog.map(layer => ({ ...layer, variants: layer.variants as Dataset[], description: descriptions[layer.id], color: ["salinity", "soil-moisture", "water-vapor", "gravity-field-map"].includes(layer.id) ? "#7bd8c5" : "#99b9ff", palette: ["salinity", "soil-moisture", "water-vapor"].includes(layer.id) ? water : spectra }));
export const DATASETS = SCIENCE_LAYERS.flatMap(layer => layer.variants);
export function validDate(value: string): boolean { return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value; }
export function availableDates(manifest: DatasetManifest): string[] {
  if (!validDate(manifest.startDate) || !validDate(manifest.endDate)) return [];
  const missing = new Set(manifest.missingDates || []);
  if (manifest.availableDates) return Object.keys(manifest.availableDates).filter(date => validDate(date) && !missing.has(date)).sort();
  const dates: string[] = [];
  const cursor = new Date(manifest.startDate + "T00:00:00Z");
  const end = Date.parse(manifest.endDate + "T00:00:00Z");
  for (let i = 0; cursor.getTime() <= end && i < 50000; i++) {
    const date = cursor.toISOString().slice(0, 10);
    if (!missing.has(date)) dates.push(date);
    if (manifest.frequency === "monthly") cursor.setUTCMonth(cursor.getUTCMonth() + 1, 1);
    else cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}
export function nearestDate(dates: readonly string[], requested?: string): string | null {
  if (!dates.length) return null;
  if (!requested || !validDate(requested)) return dates[dates.length - 1];
  // Last available observation on or before the requested day; never fabricate a gap.
  let low = 0, high = dates.length - 1;
  while (low <= high) { const mid = (low + high) >> 1; if (dates[mid] <= requested) low = mid + 1; else high = mid - 1; }
  return dates[Math.max(0, high)];
}
export function gibsCalendar(xml: string, layerId: string, datasetName: string): DatasetManifest | null {
  const start = xml.indexOf(`<Name>${layerId}</Name>`);
  if (start < 0) return null;
  const block = xml.slice(start, xml.indexOf("</Layer>", start));
  const dimensions = block.match(/<Dimension\b[^>]*name="time"[^>]*>([^<]+)<\/Dimension>/)?.[1];
  if (!dimensions) return null;
  const calendar: Record<string, { layerId: string }> = {};
  for (const period of dimensions.split(",")) {
    const [first, last = first, step = "P1D"] = period.split("/");
    if (!validDate(first) || !validDate(last) || step !== "P1D") continue;
    for (const date of availableDates({ datasetName, startDate: first, endDate: last, frequency: "daily" })) calendar[date] = { layerId };
  }
  const dates = Object.keys(calendar).sort();
  if (!dates.length) return null;
  return { datasetName, startDate: dates[0], endDate: dates[dates.length - 1], frequency: "daily", type: "wmts", availableDates: calendar };
}
export function rawRasterUrl(id: string, date: string): string | null {
  if (!DATASETS.some(dataset => dataset.id === id) || !validDate(date)) return null;
  return `${EYES_DATA}/${id}/${date.slice(2, 4)}/${date.slice(5, 7)}${date.slice(8)}_6.png`;
}
export function gibsGlobeUrl(layer: string, date: string): string | null {
  if (!/^[A-Za-z0-9_-]+$/.test(layer) || !validDate(date)) return null;
  const params = new URLSearchParams({ SERVICE: "WMS", REQUEST: "GetMap", VERSION: "1.3.0", LAYERS: layer, FORMAT: "image/png", TRANSPARENT: "TRUE", WIDTH: "2048", HEIGHT: "1024", CRS: "EPSG:4326", BBOX: "-90,-180,90,180", TIME: date });
  return `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?${params}`;
}
export type Measurement = { value: number; units: string; fraction: number; precision: number; kind?: string };
export function decodeMeasurement(r: number, g: number, b: number, dataset: Dataset): Measurement | null {
  const readout = dataset.readout;
  if (!readout || r === 1) return null; // NASA's encoded raster uses red=1 for missing observations.
  if (readout.rain && readout.snow) {
    const meta = r === 2 ? readout.snow : readout.rain;
    const value = (g + 256 * b) * meta.scalingFactor;
    return { value, units: meta.units, fraction: Math.min(1, value / 200), precision: 2, kind: r === 2 ? "Snow" : "Rain" };
  }
  let value = (b + 256 * g) * (readout.scalingFactor ?? 1) + (readout.numOffset ?? 0);
  let units = readout.units || "", bottom = readout.bottom ?? 0, span = readout.variation ?? 1;
  if (dataset.id === "smapSmSalinity8Day") {
    const ocean = value >= 1001;
    value *= ocean ? .01 : .001; units = ocean ? "psu" : "cm³/cm³"; bottom = ocean ? 30 : 0; span = ocean ? 10 : .6;
  }
  if (!Number.isFinite(value)) return null;
  return { value, units, fraction: Math.max(0, Math.min(1, (value - bottom) / span)), precision: readout.dps ?? 1 };
}
export function formatMeasurement(value: Measurement, celsius = true): string {
  let result = value.value, unit = value.units;
  if (unit === "°F" && celsius) { result = (result - 32) / 1.8; unit = "°C"; }
  else if (unit === "°C" && !celsius) { result = result * 1.8 + 32; unit = "°F"; }
  return `${result.toFixed(value.precision)} ${unit}`;
}
export function paletteColor(stops: string[], fraction: number): [number, number, number] {
  const p = Math.max(0, Math.min(1, fraction)) * (stops.length - 1), index = Math.min(stops.length - 2, Math.floor(p)), weight = p - index;
  const a = parseInt(stops[index].slice(1), 16), b = parseInt(stops[index + 1].slice(1), 16);
  return [16, 8, 0].map(shift => Math.round(((a >> shift) & 255) * (1 - weight) + ((b >> shift) & 255) * weight)) as [number, number, number];
}
