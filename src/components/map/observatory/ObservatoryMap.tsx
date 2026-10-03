"use client";

import { useEffect, useEffectEvent, useImperativeHandle, useRef, type Ref } from "react";
import maplibregl, { type GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { FeatureCollection, Point } from "geojson";
import { geographicBounds, nightGeometry, observationTrack, type MapRange, type Observation } from "@/lib/map-observatory";
import { getCategoryColor } from "@/lib/utils";
import { mapStyle, type Basemap } from "./map-style";
import styles from "./observatory.module.css";

export type MapCommands = {
  zoom: (direction: number) => void; reset: () => void; north: () => void;
  fly: (center: [number, number], zoom?: number) => void;
  fit: () => void; reload: () => void;
};
export type MapView = { longitude: number; latitude: number; zoom: number; bearing: number };
type Props = {
  apiRef: Ref<MapCommands>; observations: Observation[]; selected: Observation | null;
  basemap: Basemap; heatmap: boolean; night: boolean; plates: boolean; opacity: number;
  tilted: boolean; globe: boolean; range: MapRange; date: string; sunTime: number;
  reduced: boolean; sidebar: boolean;
  onSelect: (id: string) => void; onReady: () => void; onIssue: (message: string) => void; onView: (view: MapView) => void;
};
const EMPTY: FeatureCollection = { type: "FeatureCollection", features: [] };
export default function ObservatoryMap(props: Props) {
  const element = useRef<HTMLDivElement>(null), map = useRef<maplibregl.Map | null>(null);
  const lastStyle = useRef(props.basemap);
  const current = useEffectEvent(() => props);
  const padding = useEffectEvent(() => {
    const p = current(), width = element.current?.clientWidth || 0, height = element.current?.clientHeight || 0;
    return {
      top: 50,
      bottom: p.selected && width <= 600 ? Math.min(height * .65, height * .38 + 180) : 145,
      left: p.sidebar && width > 900 ? (width >= 1600 ? 404 : 380) : 45,
      right: p.selected && width > 900 ? (width <= 1150 ? 380 : 405) : 70,
    };
  });
  const sync = useEffectEvent(() => {
    const m = map.current, p = current();
    if (!m?.getLayer("basemap")) return;
    const features: FeatureCollection<Point> = { type: "FeatureCollection", features: p.observations.map(({ event, point }) => ({ type: "Feature", id: event.id, geometry: { type: "Point", coordinates: point }, properties: { id: event.id, title: event.title, color: getCategoryColor(event.categories[0]?.id || "") } })) };
    if (!m.getSource("events")) {
      m.addSource("events", { type: "geojson", data: features, cluster: true, clusterRadius: 38, clusterMaxZoom: 7 });
      m.addSource("density", { type: "geojson", data: features });
      m.addSource("night", { type: "geojson", data: EMPTY });
      m.addSource("track", { type: "geojson", data: EMPTY });
      m.addSource("selected", { type: "geojson", data: EMPTY });
      m.addLayer({ id: "night", type: "fill", source: "night", paint: { "fill-color": "#01081a", "fill-opacity": .53 } });
      m.addLayer({ id: "density", type: "heatmap", source: "density", paint: { "heatmap-weight": 1, "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, .7, 8, 2.3], "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 15, 7, 38], "heatmap-color": ["interpolate", ["linear"], ["heatmap-density"], 0, "rgba(61,141,195,0)", .15, "#335782", .4, "#659fb7", .7, "#e1c478", 1, "#f1975b"], "heatmap-opacity": .7 } });
      m.addLayer({ id: "track", type: "line", source: "track", paint: { "line-color": "#ffdc9b", "line-width": 1.8, "line-opacity": .8, "line-dasharray": [3, 2] } });
      m.addLayer({ id: "clusters", type: "circle", source: "events", filter: ["has", "point_count"], paint: { "circle-color": "#173951", "circle-radius": ["step", ["get", "point_count"], 17, 10, 21, 50, 25], "circle-stroke-color": "#9ccee7", "circle-stroke-width": 1, "circle-opacity": .96 } });
      m.addLayer({ id: "cluster-count", type: "symbol", source: "events", filter: ["has", "point_count"], layout: { "text-field": ["get", "point_count_abbreviated"], "text-font": ["Noto Sans Regular"], "text-size": 11 }, paint: { "text-color": "#e7f4ff" } });
      m.addLayer({ id: "event-halo", type: "circle", source: "events", filter: ["!", ["has", "point_count"]], paint: { "circle-color": ["get", "color"], "circle-radius": 11, "circle-opacity": .15 } });
      m.addLayer({ id: "events", type: "circle", source: "events", filter: ["!", ["has", "point_count"]], paint: { "circle-color": ["get", "color"], "circle-radius": 5, "circle-stroke-color": "#fff", "circle-stroke-width": 1, "circle-stroke-opacity": .6 } });
      m.addLayer({ id: "selection", type: "circle", source: "selected", paint: { "circle-color": "rgba(0,0,0,0)", "circle-radius": 15, "circle-stroke-color": "#fff0c6", "circle-stroke-width": 2 } });
    }
    (m.getSource("events") as GeoJSONSource).setData(features);
    (m.getSource("density") as GeoJSONSource).setData(features);
    (m.getSource("night") as GeoJSONSource).setData(p.night && Number.isFinite(p.sunTime) ? nightGeometry(p.sunTime) : EMPTY);
    (m.getSource("track") as GeoJSONSource).setData(p.selected ? observationTrack(p.selected.event, p.range, p.date) : EMPTY);
    (m.getSource("selected") as GeoJSONSource).setData({ type: "FeatureCollection", features: p.selected ? [{ type: "Feature", properties: {}, geometry: { type: "Point", coordinates: p.selected.point } }] : [] });
    m.setLayoutProperty("density", "visibility", p.heatmap ? "visible" : "none");
    for (const id of ["clusters", "cluster-count", "event-halo", "events"]) m.setLayoutProperty(id, "visibility", p.heatmap ? "none" : "visible");
    m.setPaintProperty("basemap", "raster-opacity", p.opacity);
    if (p.plates && !m.getSource("plates")) {
      m.addSource("plates", { type: "geojson", data: "/map/plate-boundaries.geojson", attribution: 'Plates: <a href="https://doi.org/10.1029/2001GC000252">Peter Bird</a> / <a href="https://github.com/fraxen/tectonicplates">Hugo Ahlenius, Nordpil</a> · <a href="https://opendatacommons.org/licenses/by/1-0/">ODC-By</a>' });
      m.addLayer({ id: "plates", type: "line", source: "plates", paint: { "line-color": "#e4bb7b", "line-width": 1.2, "line-opacity": .7 } }, "track");
    }
    if (m.getLayer("plates")) m.setLayoutProperty("plates", "visibility", p.plates ? "visible" : "none");
    m.setProjection({ type: p.globe ? "globe" : "mercator" });
  });
  useEffect(() => {
    if (!element.current) return;
    let m: maplibregl.Map;
    try {
      m = new maplibregl.Map({ container: element.current, style: mapStyle(current().basemap), center: [15, 22], zoom: 1.9, minZoom: .8, maxZoom: 18, maxPitch: 65, attributionControl: false, renderWorldCopies: true, fadeDuration: current().reduced ? 0 : 250 });
    } catch { current().onIssue("The map could not start. Enable WebGL and reload the map."); return; }
    map.current = m;
    m.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
    m.addControl(new maplibregl.ScaleControl({ maxWidth: 95, unit: "metric" }), "bottom-right");
    const reportView = () => { const center = m.getCenter(); current().onView({ longitude: ((center.lng + 540) % 360) - 180, latitude: center.lat, zoom: m.getZoom(), bearing: m.getBearing() }); };
    m.on("style.load", () => { sync(); m.setPadding(padding()); m.easeTo({ pitch: current().tilted ? 45 : 0, duration: 0 }); });
    m.on("load", () => { sync(); current().onReady(); reportView(); });
    m.on("moveend", reportView);
    m.on("resize", () => m.setPadding(padding()));
    m.on("error", () => current().onIssue("Some map imagery could not load. Try another basemap or reload the map."));
    m.on("click", "event-halo", e => { const id = e.features?.[0]?.properties?.id; if (typeof id === "string") current().onSelect(id); });
    m.on("click", "clusters", async e => {
      const feature = e.features?.[0]; if (!feature || feature.geometry.type !== "Point") return;
      try { const zoom = await (m.getSource("events") as GeoJSONSource).getClusterExpansionZoom(Number(feature.properties.cluster_id)); if (map.current === m) m.easeTo({ center: feature.geometry.coordinates as [number, number], zoom, duration: current().reduced ? 0 : 600 }); } catch { /* A style change may remove a pending cluster. */ }
    });
    for (const layer of ["event-halo", "clusters"]) {
      m.on("mouseenter", layer, () => { m.getCanvas().style.cursor = "pointer"; });
      m.on("mouseleave", layer, () => { m.getCanvas().style.cursor = ""; });
    }
    const lost = () => current().onIssue("The graphics context was interrupted. Reload the map to reconnect.");
    m.getCanvas().addEventListener("webglcontextlost", lost);
    return () => { m.getCanvas().removeEventListener("webglcontextlost", lost); map.current = null; m.remove(); };
  }, []);
  useEffect(() => {
    if (lastStyle.current === props.basemap) return;
    lastStyle.current = props.basemap;
    map.current?.setStyle(mapStyle(props.basemap));
  }, [props.basemap]);
  useEffect(() => { sync(); }, [props.observations, props.selected, props.heatmap, props.night, props.plates, props.opacity, props.globe, props.sunTime, props.date, props.range]);
  useEffect(() => { map.current?.easeTo({ pitch: props.tilted ? 45 : 0, duration: props.reduced ? 0 : 750 }); }, [props.tilted, props.reduced]);
  const selectedId = props.selected?.event.id;
  useEffect(() => { map.current?.easeTo({ padding: padding(), duration: props.reduced ? 0 : 450 }); }, [props.sidebar, props.reduced]);
  useEffect(() => {
    const p = current(); if (!p.selected) { map.current?.setPadding(padding()); return; }
    map.current?.flyTo({ center: p.selected.point, zoom: 5.2, padding: padding(), duration: p.reduced ? 0 : 1400 });
  }, [selectedId]);
  useImperativeHandle(props.apiRef, () => ({
    zoom: direction => map.current?.easeTo({ zoom: (map.current?.getZoom() || 2) + direction, duration: props.reduced ? 0 : 300 }),
    reset: () => map.current?.flyTo({ center: [15, 22], zoom: 1.9, bearing: 0, pitch: props.tilted ? 45 : 0, duration: props.reduced ? 0 : 1200 }),
    north: () => map.current?.easeTo({ bearing: 0, duration: props.reduced ? 0 : 500 }),
    fly: (center, zoom = 4) => map.current?.flyTo({ center, zoom, duration: props.reduced ? 0 : 1700 }),
    fit: () => { const bounds = geographicBounds(props.observations.map(item => item.point)); if (bounds) map.current?.fitBounds(bounds, { padding: { top: 80, bottom: 155, left: props.sidebar && (element.current?.clientWidth || 0) > 900 ? 390 : 60, right: 85 }, maxZoom: 7, duration: props.reduced ? 0 : 1000 }); },
    reload: () => map.current?.setStyle(mapStyle(props.basemap)),
  }), [props.observations, props.sidebar, props.reduced, props.basemap, props.tilted]);
  return <div ref={element} className={styles.renderer} aria-label="Interactive Earth map. Drag to pan, scroll to zoom, and select an event or cluster." />;
}
