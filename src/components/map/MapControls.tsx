"use client";

import { getCategoryColor, getCategoryLabel, CATEGORY_CONFIG } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Plus, Minus, Map, Satellite, Mountain, Flame } from "lucide-react";
import type { TileLayerType } from "./EventMap";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onTileChange: (tile: TileLayerType) => void;
  activeTile?: TileLayerType;
  className?: string;
  showLegend?: boolean;
  heatmapEnabled?: boolean;
  onToggleHeatmap?: () => void;
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  onTileChange,
  activeTile = "dark",
  className,
  showLegend = true,
  heatmapEnabled = false,
  onToggleHeatmap,
}: MapControlsProps) {
  const tiles: { id: TileLayerType; label: string; icon: React.ReactNode }[] = [
    { id: "dark", label: "Dark", icon: <Map className="w-3.5 h-3.5" /> },
    { id: "satellite", label: "Satellite", icon: <Satellite className="w-3.5 h-3.5" /> },
    { id: "terrain", label: "Terrain", icon: <Mountain className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Zoom Controls */}
      <div className="glass rounded-xl overflow-hidden flex flex-col">
        <button
          onClick={onZoomIn}
          className="p-2.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Zoom in"
        >
          <Plus className="w-4 h-4" />
        </button>
        <div className="h-px bg-white/10" />
        <button
          onClick={onZoomOut}
          className="p-2.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Zoom out"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Heatmap Toggle */}
      {onToggleHeatmap && (
        <div className="glass rounded-xl overflow-hidden flex flex-col">
          <button
            onClick={onToggleHeatmap}
            className={cn(
              "p-2.5 flex justify-center transition-colors",
              heatmapEnabled
                ? "text-[#00d4aa] bg-white/10 shadow-[inset_0_0_8px_rgba(0,212,170,0.2)]"
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
            aria-label="Toggle Heatmap"
            title="Toggle Heatmap"
          >
            <Flame className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tile Switcher */}
      <div className="glass rounded-xl overflow-hidden flex flex-col">
        {tiles.map((tile, i) => (
          <div key={tile.id}>
            {i > 0 && <div className="h-px bg-white/10" />}
            <button
              onClick={() => onTileChange(tile.id)}
              className={cn(
                "p-2.5 flex items-center gap-2 text-xs transition-colors w-full",
                activeTile === tile.id
                  ? "text-[var(--electric-cyan)] bg-white/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
              aria-label={`Switch to ${tile.label} map`}
            >
              {tile.icon}
              <span className="hidden sm:inline">{tile.label}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Category Legend */}
      {showLegend && (
        <div className="glass rounded-xl p-3 max-h-[280px] overflow-y-auto">
          <h4 className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">
            Categories
          </h4>
          <div className="space-y-1.5">
            {Object.entries(CATEGORY_CONFIG).map(([id, config]) => (
              <div key={id} className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: getCategoryColor(id) }}
                />
                <span className="text-[11px] text-white/60 truncate">
                  {getCategoryLabel(id)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
