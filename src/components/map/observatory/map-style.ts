import type { StyleSpecification } from "maplibre-gl";
export type Basemap = "satellite" | "dark" | "terrain";
export const BASEMAPS = [
  { id: "satellite", title: "Satellite", detail: "Esri world imagery", preview: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/2/1/2" },
  { id: "dark", title: "Atlas", detail: "CARTO / OpenStreetMap", preview: "https://basemaps.cartocdn.com/rastertiles/dark_all/2/2/1.png" },
  { id: "terrain", title: "Relief", detail: "Esri shaded relief", preview: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/2/1/2" },
] as const;
export function mapStyle(basemap: Basemap): StyleSpecification {
  const tiles = basemap === "dark" ? "https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png" : `https://server.arcgisonline.com/ArcGIS/rest/services/${basemap === "terrain" ? "World_Shaded_Relief" : "World_Imagery"}/MapServer/tile/{z}/{y}/{x}`;
  return {
    version: 8,
    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
    sources: {
      basemap: { type: "raster", tiles: [tiles], tileSize: 256, maxzoom: basemap === "terrain" ? 13 : 19, attribution: basemap === "dark" ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>' : 'Tiles &copy; Esri · USGS · NASA · Earthstar Geographics' },
      ...(basemap !== "dark" ? { labels: { type: "raster" as const, tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"], tileSize: 256, maxzoom: 19 } } : {}),
    },
    layers: [
      { id: "background", type: "background", paint: { "background-color": "#07111e" } },
      { id: "basemap", type: "raster", source: "basemap", paint: { "raster-saturation": basemap === "satellite" ? -.2 : 0, "raster-brightness-max": basemap === "satellite" ? .78 : .9, "raster-fade-duration": 250 } },
      ...(basemap !== "dark" ? [{ id: "labels", type: "raster" as const, source: "labels", paint: { "raster-opacity": .85 } }] : []),
    ],
  };
}
