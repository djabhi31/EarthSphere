"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { EONETEvent } from "@/lib/types";
import { getCategoryColor, getLatestGeometry, formatDate, formatMagnitude, getCategoryLabel } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";

/* ------------------------------------------------------------------ */
/*  Tile Layer Definition                                             */
/* ------------------------------------------------------------------ */
export type TileLayerType = "dark" | "satellite" | "terrain";

interface EventMapProps {
  events: EONETEvent[];
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  className?: string;
  onEventClick?: (eventId: string) => void;
  selectedEventId?: string | null;
  tileLayer?: TileLayerType;
  onMapLoad?: (map: maplibregl.Map) => void;
  heatmapEnabled?: boolean;
}

export default function EventMap({
  events,
  center = [0, 20], // default [lng, lat]
  zoom = 2,
  className = "",
  onEventClick,
  selectedEventId,
  tileLayer = "dark",
  onMapLoad,
  heatmapEnabled = false,
}: EventMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const { theme } = useTheme();

  const isLight =
    theme === "light" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      !window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Helper to generate MapLibre style JSON dynamically based on tileLayer type & current theme
  const getStyle = (layer: TileLayerType): maplibregl.StyleSpecification => {
    // Atmosphere glow configuration
    const sky = isLight
      ? {
          "sky-color": "#f1f5f9",
          "horizon-color": "#008c72",
          "fog-color": "#f8fafc",
          "fog-ground-blend": 0.15,
          "atmosphere-blend": [
            "interpolate", ["linear"], ["zoom"],
            0, 1.0,
            5, 1.0,
            7, 0.0
          ]
        }
      : {
          "sky-color": "#0a0e17",
          "horizon-color": "#00d4aa",
          "fog-color": "#0a0e17",
          "fog-ground-blend": 0.15,
          "atmosphere-blend": [
            "interpolate", ["linear"], ["zoom"],
            0, 1.0,
            5, 1.0,
            7, 0.0
          ]
        };

    if (layer === "satellite") {
      return {
        version: 8,
        sky: sky as any,
        sources: {
          "satellite-tiles": {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            ],
            tileSize: 256,
            attribution: "Imagery &copy; Esri, USDA, USGS, GeoEye"
          },
          "reference-tiles": {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            ],
            tileSize: 256
          }
        },
        layers: [
          {
            id: "satellite-layer",
            type: "raster",
            source: "satellite-tiles",
            minzoom: 0,
            maxzoom: 20
          },
          {
            id: "reference-layer",
            type: "raster",
            source: "reference-tiles",
            minzoom: 0,
            maxzoom: 20
          }
        ]
      };
    } else if (layer === "terrain") {
      return {
        version: 8,
        sky: sky as any,
        sources: {
          "terrain-tiles": {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}"
            ],
            tileSize: 256,
            attribution: "Terrain &copy; Esri, USGS"
          },
          "reference-tiles": {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            ],
            tileSize: 256
          }
        },
        layers: [
          {
            id: "terrain-layer",
            type: "raster",
            source: "terrain-tiles",
            minzoom: 0,
            maxzoom: 20
          },
          {
            id: "reference-layer",
            type: "raster",
            source: "reference-tiles",
            minzoom: 0,
            maxzoom: 20
          }
        ]
      };
    }

    // Default theme tiles (Positron for light mode, Dark Matter for dark mode)
    const basemapUrl = isLight
      ? "https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png"
      : "https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png";

    return {
      version: 8,
      sky: sky as any,
      sources: {
        "raster-tiles": {
          type: "raster",
          tiles: [basemapUrl],
          tileSize: 256,
          attribution: "&copy; CartoDB &copy; OpenStreetMap"
        }
      },
      layers: [
        {
          id: "raster-layer",
          type: "raster",
          source: "raster-tiles",
          minzoom: 0,
          maxzoom: 20
        }
      ]
    };
  };

  const setupHeatmapLayer = (map: maplibregl.Map) => {
    if (map.getSource("events-heatmap")) return;
    
    map.addSource("events-heatmap", {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] }
    });

    map.addLayer({
      id: "events-heatmap-layer",
      type: "heatmap",
      source: "events-heatmap",
      paint: {
        "heatmap-weight": ["interpolate", ["linear"], ["get", "magnitude"], 0, 0.3, 10, 1],
        "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
        "heatmap-color": [
          "interpolate", ["linear"], ["heatmap-density"],
          0, "rgba(0,0,0,0)",
          0.1, "rgba(0,212,170,0.15)",
          0.3, "rgba(0,212,170,0.4)",
          0.5, "rgba(56,189,248,0.6)",
          0.7, "rgba(255,107,53,0.8)",
          1, "rgba(239,68,68,1)"
        ],
        "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 15, 5, 30, 10, 50],
        "heatmap-opacity": 0
      }
    });
  };

  // ── Init Map ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: getStyle(tileLayer),
      center: center,
      zoom: zoom,
      maxZoom: 18,
      minZoom: 1.5,
      renderWorldCopies: true
    });

    mapRef.current = map;

    map.on("load", () => {
      // Enable 3D Globe projection
      map.setProjection({ type: "globe" });
      setupHeatmapLayer(map);

      if (onMapLoad) {
        onMapLoad(map);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Tile Layer Switcher ──────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.setStyle(getStyle(tileLayer));
    map.once("style.load", () => {
      // Re-enable globe projection on new style load
      map.setProjection({ type: "globe" });
      setupHeatmapLayer(map);
    });
  }, [tileLayer, isLight]);

  // ── Plot Event Markers ────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const heatmapFeatures: any[] = [];

    // Create fresh markers
    events.forEach((event) => {
      const geo = getLatestGeometry(event);
      if (!geo || !geo.coordinates) return;
      const coords = geo.coordinates as number[];
      if (coords.length < 2) return;

      let lng = coords[0];
      let lat = coords[1];

      // Auto-correct swapped coordinates if latitude is outside bounds but longitude is within latitude limits
      if ((lat < -90 || lat > 90) && (lng >= -90 && lng <= 90)) {
        const temp = lng;
        lng = lat;
        lat = temp;
      }

      // Skip invalid coordinates to prevent MapLibre from throwing fatal errors and crashing the page
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180 || isNaN(lng) || isNaN(lat)) {
        console.warn(`Skipping event ${event.id} due to invalid coordinates: [${lng}, ${lat}]`);
        return;
      }

      const categoryId = event.categories[0]?.id || "manmade";
      const color = getCategoryColor(categoryId);
      const categoryLabel = getCategoryLabel(categoryId);
      const dateStr = formatDate(geo.date);

      heatmapFeatures.push({
        type: "Feature",
        geometry: { type: "Point", coordinates: [lng, lat] },
        properties: { magnitude: geo.magnitudeValue ?? 1 }
      });

      // Create Custom DOM marker element
      const el = document.createElement("div");
      el.className = "custom-mapbox-marker";
      el.style.width = "20px";
      el.style.height = "20px";
      el.style.cursor = "pointer";

      el.innerHTML = `
        <div style="position:relative;width:20px;height:20px;">
          <div style="
            position:absolute;inset:0;
            border-radius:50%;
            background:${color};
            opacity:0.3;
            animation:marker-pulse 2s ease-in-out infinite;
          "></div>
          <div style="
            position:absolute;inset:4px;
            border-radius:50%;
            background:${color};
            box-shadow:0 0 8px ${color}, 0 0 16px ${color}40;
          "></div>
        </div>
      `;

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onEventClick?.(event.id);
        
        // Lazy create popup if it doesn't exist
        if (!marker.getPopup()) {
          const popupContainer = document.createElement("div");
          popupContainer.style.cssText = "color: #ffffff; background: #0f1420; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); max-width: 220px; font-family: sans-serif;";
          
          const headerDiv = document.createElement("div");
          headerDiv.style.cssText = "display: flex; align-items: center; gap: 6px; margin-bottom: 4px;";
          const dotSpan = document.createElement("span");
          dotSpan.style.cssText = `width: 8px; height: 8px; border-radius: 50%; background-color: ${color};`;
          const catSpan = document.createElement("span");
          catSpan.style.cssText = "font-size: 10px; font-weight: 600; text-transform: uppercase; color: rgba(255,255,255,0.5);";
          catSpan.textContent = categoryLabel;
          headerDiv.appendChild(dotSpan);
          headerDiv.appendChild(catSpan);
          
          const titleH3 = document.createElement("h3");
          titleH3.style.cssText = "font-size: 13px; font-weight: bold; margin: 0 0 6px 0; color: #ffffff; line-height: 1.3; font-family: inherit;";
          titleH3.textContent = event.title;
          
          const dateP = document.createElement("p");
          dateP.style.cssText = "font-size: 11px; color: rgba(255,255,255,0.6); margin: 0 0 8px 0; font-family: inherit;";
          dateP.textContent = dateStr;
          
          popupContainer.appendChild(headerDiv);
          popupContainer.appendChild(titleH3);
          popupContainer.appendChild(dateP);
          
          if (geo.magnitudeValue != null) {
            const magP = document.createElement("p");
            magP.style.cssText = `font-size: 11px; color: ${color}; font-weight: 600; margin: 0 0 8px 0; font-family: monospace;`;
            magP.textContent = `Magnitude: ${formatMagnitude(geo.magnitudeValue, geo.magnitudeUnit)}`;
            popupContainer.appendChild(magP);
          }
          
          const linkA = document.createElement("a");
          linkA.href = `/events/${event.id}`;
          linkA.style.cssText = "font-size: 11px; font-weight: 600; color: #00d4aa; text-decoration: none; font-family: inherit; display: inline-block;";
          linkA.textContent = "View Details \u2192";
          popupContainer.appendChild(linkA);

          const popup = new maplibregl.Popup({ offset: 12, closeButton: false })
            .setDOMContent(popupContainer);
          marker.setPopup(popup);
          marker.togglePopup(); // immediately show it
        }
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

    const heatmapSource = map.getSource("events-heatmap") as maplibregl.GeoJSONSource;
    if (heatmapSource) {
      heatmapSource.setData({
        type: "FeatureCollection",
        features: heatmapFeatures
      });
    }

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, [events, onEventClick]);

  // ── Sync Heatmap Visibility ───────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (map.getLayer("events-heatmap-layer")) {
      map.setPaintProperty("events-heatmap-layer", "heatmap-opacity", heatmapEnabled ? 0.8 : 0);
    }
    
    // Toggle marker opacity
    markersRef.current.forEach(marker => {
      const el = marker.getElement();
      if (heatmapEnabled) {
        el.style.opacity = "0.2";
      } else {
        el.style.opacity = "1";
      }
    });
  }, [heatmapEnabled, events]);

  // ── FlyTo Selected Event ─────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedEventId) return;

    const event = events.find((e) => e.id === selectedEventId);
    if (!event) return;

    const geo = getLatestGeometry(event);
    if (!geo || !geo.coordinates) return;
    const coords = geo.coordinates as number[];
    if (coords.length < 2) return;

    let lng = coords[0];
    let lat = coords[1];

    if ((lat < -90 || lat > 90) && (lng >= -90 && lng <= 90)) {
      const temp = lng;
      lng = lat;
      lat = temp;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180 || isNaN(lng) || isNaN(lat)) return;

    map.flyTo({
      center: [lng, lat],
      zoom: 6,
      essential: true,
      duration: 1500
    });
  }, [selectedEventId, events]);

  // ── Handle center / zoom changes from props ─────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    let centerLng = center[0];
    let centerLat = center[1];

    if ((centerLat < -90 || centerLat > 90) && (centerLng >= -90 && centerLng <= 90)) {
      const temp = centerLng;
      centerLng = centerLat;
      centerLat = temp;
    }

    if (centerLat < -90 || centerLat > 90 || centerLng < -180 || centerLng > 180 || isNaN(centerLng) || isNaN(centerLat)) return;

    const currentCenter = map.getCenter();
    const isDifferent = Math.abs(currentCenter.lng - centerLng) > 0.01 || Math.abs(currentCenter.lat - centerLat) > 0.01;

    if (isDifferent) {
      map.flyTo({
        center: [centerLng, centerLat],
        zoom: zoom,
        essential: true,
        duration: 1200
      });
    }
  }, [center[0], center[1], zoom]);

  return (
    <div className={`relative w-full h-full min-h-[400px] ${className}`}>
      <div
        ref={containerRef}
        className="w-full h-full rounded-xl"
        style={{ background: "#0a0e17" }}
      />
      <style>{`
        @keyframes marker-pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
