export const IMAGERY_LAYERS = { terra: "MODIS_Terra_CorrectedReflectance_TrueColor", aqua: "MODIS_Aqua_CorrectedReflectance_TrueColor" } as const;
export function imageryRequest(latitude: number, longitude: number, date: string, span: number, layer: keyof typeof IMAGERY_LAYERS) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180 || !Number.isFinite(span) || span < .1 || span > 40 || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !IMAGERY_LAYERS[layer]) return null;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return null;
  const bounds = [Math.max(-90, latitude - span), Math.max(-180, longitude - span), Math.min(90, latitude + span), Math.min(180, longitude + span)];
  const query = new URLSearchParams({ SERVICE: "WMS", REQUEST: "GetMap", VERSION: "1.3.0", LAYERS: IMAGERY_LAYERS[layer], STYLES: "", FORMAT: "image/jpeg", CRS: "EPSG:4326", BBOX: bounds.join(","), WIDTH: "1200", HEIGHT: "900", TIME: date });
  return `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?${query}`;
}
