"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Mission, type OrbitRecord, NORAD_IDS, missionStatus } from "@/lib/explore/missions";
import { availableDates, decodeMeasurement, gibsGlobeUrl, nearestDate, paletteColor, rawRasterUrl, type Dataset, type DatasetManifest, type ScienceLayer } from "@/lib/explore/science";

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("NASA’s archive is temporarily unavailable. Please retry.");
  return response.json();
}
export function useMissions() {
  const query = useQuery({ queryKey: ["explorer", "missions"], queryFn: ({ signal }) => getJson<{ entries: Mission[] }>("/api/explore/missions", signal), staleTime: 3600000, retry: 1 });
  const missions = useMemo(() => query.data?.entries.filter(mission => mission.target_entity && mission.title) || [], [query.data]);
  const orbits = useQuery({ queryKey: ["explorer", "orbits", missions.map(mission => mission.target_entity).join(",")], enabled: missions.length > 0, queryFn: async () => {
    const ids = [...new Set(missions.filter(mission => missionStatus(mission, Date.now()) === "Current").map(mission => NORAD_IDS[mission.target_entity]).filter(Boolean))];
    const records: Record<number, OrbitRecord> = {};
    const failed: number[] = [];
    let cursor = 0;
    await Promise.all(Array.from({ length: 4 }, async () => {
      while (cursor < ids.length) { const id = ids[cursor++]; try { records[id] = await getJson<OrbitRecord>(`/api/explore/orbit/${id}`); } catch { failed.push(id); } }
    }));
    return { records, failed };
  }, staleTime: 3600000, retry: 1 });
  return { ...query, missions, orbits };
}
export type Observation = { key: string; canvas: HTMLCanvasElement; raw?: ImageData; date: string; sourceUrl: string; coloredByNASA: boolean; coverage: number | null };
export function useObservation(layer: ScienceLayer | undefined, dataset: Dataset | undefined, requestedDate: string | undefined) {
  const manifest = useQuery({ queryKey: ["explorer", "dataset", dataset?.id], enabled: !!dataset, queryFn: ({ signal }) => getJson<DatasetManifest>(`/api/explore/dataset/${dataset!.id}`, signal), staleTime: 3600000, retry: 1 });
  const dates = useMemo(() => manifest.data ? availableDates(manifest.data) : [], [manifest.data]);
  const date = nearestDate(dates, requestedDate);
  const key = dataset && date ? dataset.id + ":" + date : "";
  const [result, setResult] = useState<{ key: string; observation?: Observation; error?: string }>({ key: "" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!layer || !dataset || !manifest.data || !date) return;
    const controller = new AbortController();
    const current = manifest.data;
    const gibs = current.availableDates?.[date]?.layerId || (dataset.id === "omiOzoneToday" ? "OMI_Ozone_TOMS_Total_Column" : undefined);
    const url = gibs ? gibsGlobeUrl(gibs, date) : rawRasterUrl(dataset.id, date);
    if (!url) return;
    const load = async () => {
      let bitmap: ImageBitmap | undefined;
      try {
        const response = await fetch(url, { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(30000)]) });
        if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) throw new Error("No image was returned for this observation.");
        bitmap = await createImageBitmap(await response.blob());
        if (controller.signal.aborted) return;
        const canvas = document.createElement("canvas");
        canvas.width = gibs ? bitmap.width : 1440; canvas.height = gibs ? bitmap.height : 720;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) throw new Error("Your browser could not prepare the observation.");
        let raw: ImageData | undefined;
        let coverage: number | null = null;
        if (gibs) {
          context.drawImage(bitmap, 0, 0);
          const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
          let hasData = false;
          for (let i = 3; i < pixels.length; i += 4) if (pixels[i] > 0) { hasData = true; break; }
          if (!hasData) throw new Error("There are no observations for this date. Choose an earlier date.");
        }
        else {
          if (bitmap.width < 1440 || bitmap.height < 1024) throw new Error("NASA returned an unrecognized raster format.");
          context.drawImage(bitmap, 0, 304, 1440, 720, 0, 0, 1440, 720);
          raw = context.getImageData(0, 0, 1440, 720);
          const colored = context.createImageData(1440, 720);
          const palette = Array.from({ length: 256 }, (_, i) => paletteColor(layer.palette, i / 255));
          let observed = 0;
          for (let i = 0; i < raw.data.length; i += 4) {
            const value = decodeMeasurement(raw.data[i], raw.data[i + 1], raw.data[i + 2], dataset);
            if (!value) continue;
            const color = palette[Math.round(value.fraction * 255)];
            colored.data[i] = color[0]; colored.data[i + 1] = color[1]; colored.data[i + 2] = color[2]; colored.data[i + 3] = 255; observed++;
          }
          context.putImageData(colored, 0, 0);
          coverage = observed / (1440 * 720);
          if (observed === 0) throw new Error("There are no usable observations in this image. Choose another date.");
        }
        if (!controller.signal.aborted) setResult({ key, observation: { key, canvas, raw, date, sourceUrl: url, coloredByNASA: !!gibs, coverage } });
      } catch (error) {
        if (!controller.signal.aborted) setResult({ key, error: error instanceof Error ? error.message : "The observation could not load." });
      } finally { bitmap?.close(); }
    };
    void load();
    return () => controller.abort();
  }, [key, layer, dataset, manifest.data, date, attempt]);
  return { manifest, dates, date, observation: result.key === key ? result.observation : undefined, error: manifest.isError ? "NASA’s dataset archive could not load." : result.key === key ? result.error : undefined, loading: !!dataset && (manifest.isPending || (!!key && result.key !== key)), retry: () => { if (manifest.isError) void manifest.refetch(); else { setResult({ key: "" }); setAttempt(value => value + 1); } } };
}
