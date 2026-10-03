import { NextResponse } from "next/server";
import { DATASETS, gibsCalendar } from "@/lib/explore/science";
import { NORAD_IDS, parseCelestrakElements, type OrbitRecord } from "@/lib/explore/missions";

let ozoneCalendar: { expires: number; value: unknown } | undefined;
const elements = new Map<number, { expires: number; value: OrbitRecord }>();

async function orbitalElements(id: number) {
  const cached = elements.get(id);
  if (cached && cached.expires > Date.now()) return cached.value;
  try {
    const response = await fetch(`https://celestrak.org/NORAD/elements/gp.php?CATNR=${id}&FORMAT=TLE`, { signal: AbortSignal.timeout(12000), redirect: "error", next: { revalidate: 3600 } });
    const value = response.ok ? parseCelestrakElements(id, await response.text()) : null;
    if (value) { elements.set(id, { expires: Date.now() + 3600000, value }); return value; }
  } catch { /* The independent secondary provider below can still supply the elements. */ }
  const response = await fetch(`https://tle.ivanstanojevic.me/api/tle/${id}`, { signal: AbortSignal.timeout(12000), redirect: "error", next: { revalidate: 3600 } });
  if (!response.ok) throw new Error("Orbital data unavailable");
  const data = await response.json();
  if (data.satelliteId !== id || typeof data.line1 !== "string" || typeof data.line2 !== "string") throw new Error("Invalid orbital record");
  const value: OrbitRecord = { ...data, source: "TLE API" };
  elements.set(id, { expires: Date.now() + 3600000, value });
  return value;
}

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  if (path.length === 2 && path[0] === "orbit") {
    const id = Number(path[1]);
    if (!/^\d+$/.test(path[1]) || !Object.values(NORAD_IDS).includes(id)) return NextResponse.json({ error: "Unknown spacecraft." }, { status: 400 });
    try { return NextResponse.json(await orbitalElements(id), { headers: { "Cache-Control": "public, max-age=3600" } }); }
    catch { return NextResponse.json({ error: "Orbital elements are temporarily unavailable from both providers. Please retry." }, { status: 503 }); }
  }
  let resource: string;
  if (path.length === 1 && path[0] === "missions") resource = "api/mission.json";
  else if (path.length === 2 && path[0] === "dataset" && DATASETS.some(dataset => dataset.id === path[1])) resource = `data/${path[1]}/dataset_manifest.json`;
  else return NextResponse.json({ error: "Unknown Earth observation resource." }, { status: 400 });
  try {
    if (path[1] === "omiOzoneToday") {
      // This dataset is rendered by GIBS, whose publication date can lag the Eyes archive.
      if (!ozoneCalendar || ozoneCalendar.expires < Date.now()) {
        const response = await fetch("https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0", { signal: AbortSignal.timeout(20000), cache: "no-store", redirect: "error" });
        if (!response.ok) throw new Error("GIBS is unavailable");
        const value = gibsCalendar(await response.text(), "OMI_Ozone_TOMS_Total_Column", "omiOzoneToday");
        if (!value) throw new Error("The ozone calendar is unavailable");
        ozoneCalendar = { value, expires: Date.now() + 3600000 };
      }
      return NextResponse.json(ozoneCalendar.value, { headers: { "Cache-Control": "public, max-age=3600" } });
    }
    const response = await fetch(`https://eyes.nasa.gov/assets/dynamic/earth/${resource}`, { signal: AbortSignal.timeout(20000), redirect: "error", next: { revalidate: 3600 } });
    if (!response.ok) return NextResponse.json({ error: "NASA’s observation archive is temporarily unavailable." }, { status: 502 });
    return NextResponse.json(await response.json(), { headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=3600" } });
  } catch { return NextResponse.json({ error: "The observation archive did not respond. Please retry." }, { status: 503 }); }
}
