"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReducedMotion } from "motion/react";
import { ArrowDownWideNarrow, ArrowRight, ArrowUpRight, Bookmark, Check, ChevronLeft, ChevronRight, Compass, Crosshair, Globe2, Layers3, ListFilter, Loader2, MapPin, Maximize2, Minus, Mountain, Pause, Play, Plus, Radio, RefreshCw, Search, Settings2, Share2, SlidersHorizontal, Sun, Waves, X } from "lucide-react";
import { fetchEvents } from "@/lib/api";
import { useEarthSphereStore } from "@/lib/store";
import { dailyActivity, geometryPoint, observationsAt, rangeDates, safeMapLink, shiftDate, validMapDate, type MapRange, type MapStatus, type Observation } from "@/lib/map-observatory";
import { formatMagnitude, getCategoryColor, getCategoryLabel } from "@/lib/utils";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { Dialog } from "@/components/site/Dialog";
import { EventAnalysis } from "./EventAnalysis";
import { BASEMAPS, type Basemap } from "./map-style";
import type { MapCommands, MapView } from "./ObservatoryMap";
import styles from "./observatory.module.css";

const ObservatoryMap = dynamic(() => import("./ObservatoryMap"), { ssr: false });
const subscribeMinute = (notify: () => void) => { const id = window.setInterval(notify, 30000); return () => window.clearInterval(id); };
const minuteSnapshot = () => new Date().toISOString().slice(0, 16);
const subscribeSize = (notify: () => void) => { const query = window.matchMedia("(max-width: 900px)"); query.addEventListener("change", notify); return () => query.removeEventListener("change", notify); };
const shortDate = (date: string) => validMapDate(date) ? new Date(date + "T12:00:00Z").toLocaleDateString("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" }) : "—";
const EMPTY_EVENTS: Awaited<ReturnType<typeof fetchEvents>>["events"] = [];
const REGIONS = [
  { name: "Pacific Ring of Fire", label: "Volcanic landscapes", point: [140, 30] as [number, number], zoom: 3.1, icon: Mountain },
  { name: "Western North America", label: "Forests & wildfires", point: [-119, 43] as [number, number], zoom: 4.1, icon: MapPin },
  { name: "Atlantic & Caribbean", label: "The hurricane basin", point: [-62, 25] as [number, number], zoom: 3.8, icon: Waves },
  { name: "Himalayan region", label: "Across the high mountains", point: [85, 29] as [number, number], zoom: 4, icon: Mountain },
];
function IconButton({ label, children, onClick, active, disabled }: { label: string; children: ReactNode; onClick: () => void; active?: boolean; disabled?: boolean }) {
  return <button type="button" className={styles.iconButton} aria-label={label} title={label} aria-pressed={active} disabled={disabled} onClick={onClick}>{children}</button>;
}
function Switch({ label, detail, checked, onClick, icon }: { label: string; detail: string; checked: boolean; onClick: () => void; icon: ReactNode }) {
  return <button className={styles.switch} role="switch" aria-checked={checked} onClick={onClick}>{icon}<span>{label}<small>{detail}</small></span><i><b /></i></button>;
}

export default function ObservatoryClient() {
  const root = useRef<HTMLDivElement>(null), commands = useRef<MapCommands>(null), searchInput = useRef<HTMLInputElement>(null);
  const reduced = !!useReducedMotion();
  const minute = useSyncExternalStore(subscribeMinute, minuteSnapshot, () => "");
  const compact = useSyncExternalStore(subscribeSize, () => window.innerWidth <= 900, () => false);
  const today = minute.slice(0, 10);
  const [sidebarOverride, setSidebarOverride] = useState<boolean | null>(null);
  const sidebar = sidebarOverride ?? !compact;
  const [panel, setPanel] = useState<"layers" | "regions" | null>(null), [filtersOpen, setFiltersOpen] = useState(false);
  const [basemap, setBasemap] = useState<Basemap>("satellite"), [globe, setGlobe] = useState(true), [tilted, setTilted] = useState(false);
  const [search, setSearch] = useState(""), [status, setStatus] = useState<MapStatus>("open"), [categories, setCategories] = useState<string[]>([]);
  const [windowDays, setWindowDays] = useState(60), [customRange, setCustomRange] = useState<MapRange | null>(null);
  const [draftStart, setDraftStart] = useState(""), [draftEnd, setDraftEnd] = useState(""), [dateError, setDateError] = useState("");
  const [cursor, setCursor] = useState<string | null>(null), [playing, setPlaying] = useState(false), [speed, setSpeed] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null), [sort, setSort] = useState("newest"), [savedOnly, setSavedOnly] = useState(false);
  const [mapReady, setMapReady] = useState(false), [mapIssue, setMapIssue] = useState<string | null>(null), [sceneVersion, setSceneVersion] = useState(0);
  const [view, setView] = useState<MapView>({ longitude: 15, latitude: 22, zoom: 1.9, bearing: 0 });
  const [fullscreen, setFullscreen] = useState(false), [notice, setNotice] = useState<string | null>(null), [shareLink, setShareLink] = useState<string | null>(null);
  const heatmap = useEarthSphereStore(s => s.heatmapEnabled), toggleHeatmap = useEarthSphereStore(s => s.toggleHeatmap);
  const night = useEarthSphereStore(s => s.dayNightEnabled), toggleNight = useEarthSphereStore(s => s.toggleDayNight);
  const plates = useEarthSphereStore(s => s.tectonicEnabled), togglePlates = useEarthSphereStore(s => s.toggleTectonic);
  const scan = useEarthSphereStore(s => s.radarEnabled), toggleScan = useEarthSphereStore(s => s.toggleRadar);
  const opacity = useEarthSphereStore(s => s.layerOpacity), setOpacity = useEarthSphereStore(s => s.setLayerOpacity);
  const watched = useEarthSphereStore(s => s.watchedEventIds), toggleWatch = useEarthSphereStore(s => s.toggleWatchEvent), addRecent = useEarthSphereStore(s => s.addRecentEvent);
  const range = useMemo(() => customRange || { start: shiftDate(today, 1 - windowDays), end: today }, [customRange, today, windowDays]);
  const dates = useMemo(() => rangeDates(range), [range]);
  const date = cursor && cursor >= range.start && cursor <= range.end ? cursor : range.end;
  const archive = !!cursor || date !== today;
  const dateIndex = Math.max(0, dates.indexOf(date));
  const query = useQuery({ queryKey: ["observatory-events", range.start, range.end], queryFn: () => fetchEvents({ status: "all", days: null, dateRange: range, limit: 1000 }), enabled: !!dates.length, staleTime: 300000, retry: 2 });
  const events = query.data?.events || EMPTY_EVENTS;
  const unmappable = useMemo(() => events.filter(event => !event.geometry.some(geometry => geometryPoint(geometry))).length, [events]);
  const observations = useMemo(() => observationsAt(events, range, date, status, categories, search).filter(item => !savedOnly || watched.includes(item.event.id)), [events, range, date, status, categories, search, savedOnly, watched]);
  const list = useMemo(() => sort === "oldest" ? [...observations].reverse() : observations, [observations, sort]);
  const selected = observations.find(item => item.event.id === selectedId) || null;
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const event of events) for (const category of event.categories) counts.set(category.id, (counts.get(category.id) || 0) + 1);
    return [...counts].sort((a, b) => b[1] - a[1]);
  }, [events]);
  const chart = useMemo(() => dailyActivity(events.filter(event => (!categories.length || event.categories.some(c => categories.includes(c.id))) && (!search.trim() || `${event.title} ${event.id} ${event.categories.map(c => c.title).join(" ")}`.toLowerCase().includes(search.trim().toLowerCase())) && (!savedOnly || watched.includes(event.id))), dates), [events, categories, search, savedOnly, watched, dates]);
  const chartMax = Math.max(1, ...chart);
  const ready = useCallback(() => { setMapReady(true); setMapIssue(null); }, []);
  const selectEvent = useCallback((id: string) => { setSelectedId(id); addRecent(id); setPanel(null); if (window.innerWidth <= 900) setSidebarOverride(false); }, [addRecent]);
  const issue = useCallback((message: string) => setMapIssue(message), []);
  const filtered = categories.length > 0 || !!search.trim() || savedOnly || status !== "open";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const start = params.get("start") || "", end = params.get("end") || "";
    // A shared map URL is external state, hydrated once after server rendering.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (rangeDates({ start, end }).length && end <= new Date().toISOString().slice(0, 10)) setCustomRange({ start, end });
    const date = params.get("date"); if (date && validMapDate(date)) setCursor(date);
    const mode = params.get("basemap"); if (mode && ["satellite", "dark", "terrain"].includes(mode)) setBasemap(mode as Basemap);
    const event = params.get("event"); if (event && /^EONET_[a-z\d_-]+$/i.test(event)) setSelectedId(event);
    const state = params.get("status"); if (state && ["open", "closed", "all"].includes(state)) setStatus(state as MapStatus);
    const category = params.get("categories"); if (category) setCategories(category.split(",").filter(id => /^[a-z]+$/i.test(id)).slice(0, 20));
    if (params.get("q")) setSearch(params.get("q")!.slice(0, 150));
  }, []);
  useEffect(() => {
    if (!playing || query.isFetching || dates.length < 2) return;
    const id = window.setTimeout(() => { const next = Math.min(dateIndex + 1, dates.length - 1); setCursor(dates[next]); if (next === dates.length - 1) setPlaying(false); }, 1000 / speed);
    return () => window.clearTimeout(id);
  }, [playing, dateIndex, dates, speed, query.isFetching]);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (document.querySelector("dialog[open]")) return;
      if (event.key === "Escape") { if (panel) setPanel(null); else if (selectedId) setSelectedId(null); else if (compact) setSidebarOverride(false); }
      const target = event.target as HTMLElement | null;
      if (event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey && !target?.closest("input, textarea, select, [contenteditable]")) {
        event.preventDefault(); setSidebarOverride(true); setPanel(null);
        requestAnimationFrame(() => searchInput.current?.focus());
      }
    };
    window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler);
  }, [panel, selectedId, compact]);
  useEffect(() => { const handler = () => setFullscreen(document.fullscreenElement === root.current); document.addEventListener("fullscreenchange", handler); return () => document.removeEventListener("fullscreenchange", handler); }, []);
  useEffect(() => { if (!notice) return; const id = window.setTimeout(() => setNotice(null), 4500); return () => window.clearTimeout(id); }, [notice]);

  function clearFilters() { setSearch(""); setCategories([]); setSavedOnly(false); setStatus("open"); }
  function chooseWindow(days: number) { setWindowDays(days); setCustomRange(null); setCursor(null); setPlaying(false); setDateError(""); }
  function applyRange() {
    if (!rangeDates({ start: draftStart, end: draftEnd }).length || draftEnd > today) { setDateError("Choose a valid date range of up to one year, ending today or earlier."); return; }
    setCustomRange({ start: draftStart, end: draftEnd }); setCursor(null); setPlaying(false); setDateError("");
  }
  function scrub(index: number) { setCursor(dates[Math.max(0, Math.min(dates.length - 1, index))]); setPlaying(false); }
  async function toggleFullscreen() { try { if (document.fullscreenElement) await document.exitFullscreen(); else await root.current?.requestFullscreen(); } catch { setNotice("Fullscreen is unavailable in this browser."); } }
  async function share() {
    const url = new URL(window.location.origin + "/map");
    url.searchParams.set("start", range.start); url.searchParams.set("end", range.end); url.searchParams.set("date", date); url.searchParams.set("basemap", basemap); url.searchParams.set("status", status);
    if (selected) url.searchParams.set("event", selected.event.id); if (categories.length) url.searchParams.set("categories", categories.join(",")); if (search) url.searchParams.set("q", search);
    try { await navigator.clipboard.writeText(url.href); setNotice("Map link copied with the selected event, filters and date."); } catch { setShareLink(url.href); }
  }
  const activeLayers = Number(heatmap) + Number(night) + Number(plates);

  return <div ref={root} className={styles.workspace} data-sidebar={sidebar}>
    <h1 className={styles.srOnly}>Earth observatory map</h1>
    <div className={styles.viewport}>
      <ObservatoryMap key={sceneVersion} apiRef={commands} observations={observations} selected={selected} basemap={basemap} heatmap={heatmap} night={night} plates={plates} opacity={Math.max(.15, opacity)} tilted={tilted} globe={globe} range={range} date={date} sunTime={Date.parse(archive ? date + "T12:00:00Z" : minute + ":00Z")} reduced={reduced} sidebar={sidebar} onSelect={selectEvent} onReady={ready} onIssue={issue} onView={setView} />
      <div className={styles.edgeShade} />
      {scan && <div className={styles.scanEffect} aria-hidden="true"><i /><span>VISUAL SCAN EFFECT</span></div>}
      {!mapReady && !mapIssue && <div className={styles.mapLoading} role="status"><Globe2 size={29} strokeWidth={1} /><span>Bringing the planet into focus</span></div>}
      {!sidebar && <button className={styles.openSidebar} onClick={() => { setSidebarOverride(true); setPanel(null); }}><ListFilter size={18} /><span>Earth events</span><b>{observations.length}</b></button>}

      <aside className={styles.sidebar} data-open={sidebar} aria-label="Map events and filters" inert={!sidebar}>
        <div className={styles.sidebarHeading}><div><span className={styles.eyebrow}><i /> NASA EONET</span><h2>Earth observatory<span>.</span></h2><p>A closer look at a changing world.</p></div><IconButton label="Collapse event sidebar" onClick={() => setSidebarOverride(false)}><ChevronLeft size={18} /></IconButton></div>
        <div className={styles.sidebarControls}>
          <label className={styles.search}><Search size={16} /><input ref={searchInput} aria-label="Search map events" placeholder="Find an event or place…" value={search} onChange={e => setSearch(e.target.value)} />{search && <button aria-label="Clear search" onClick={() => setSearch("")}><X size={14} /></button>}<kbd>/</kbd></label>
          <div className={styles.statusTabs} aria-label="Event status">{(["open", "closed", "all"] as const).map(value => <button key={value} aria-pressed={status === value} onClick={() => setStatus(value)}>{value === "open" ? "Active" : value === "closed" ? "Closed" : "All events"}</button>)}</div>
          <div className={styles.filterActions}><button onClick={() => setFiltersOpen(value => !value)} aria-expanded={filtersOpen} aria-controls="map-filters"><SlidersHorizontal size={14} />Filters{categories.length > 0 && <b>{categories.length}</b>}</button><button aria-pressed={savedOnly} onClick={() => setSavedOnly(value => !value)}><Bookmark size={14} />Saved</button><span>{shortDate(range.start)} — {shortDate(range.end)}</span></div>
        </div>
        {filtersOpen && <div className={styles.filters} id="map-filters">
          <div className={styles.sectionTitle}>Event categories<button onClick={() => setCategories([])}>All categories</button></div>
          <div className={styles.categoryGrid}>{categoryCounts.map(([id, count]) => <button key={id} aria-pressed={categories.includes(id)} onClick={() => setCategories(value => value.includes(id) ? value.filter(c => c !== id) : [...value, id])}><i style={{ background: getCategoryColor(id) }} /><span>{getCategoryLabel(id)}</span><small>{count}</small></button>)}{!categoryCounts.length && <p>Categories appear when observations load.</p>}</div>
          <div className={styles.sectionTitle}>Observation window</div><div className={styles.windowButtons}>{[7, 30, 60, 365].map(days => <button key={days} aria-pressed={!customRange && windowDays === days} onClick={() => chooseWindow(days)}>{days === 365 ? "1 year" : `${days} days`}</button>)}</div>
          <div className={styles.dateInputs}><label>From<input aria-label="Custom start date" type="date" max={draftEnd || today} value={draftStart} onChange={e => setDraftStart(e.target.value)} /></label><label>To<input aria-label="Custom end date" type="date" min={draftStart} max={today} value={draftEnd} onChange={e => setDraftEnd(e.target.value)} /></label></div>
          {dateError && <p className={styles.errorText} role="alert">{dateError}</p>}<button className={styles.applyRange} onClick={applyRange}>Apply custom dates <ArrowRight size={13} /></button>
        </div>}
        <div className={styles.listHeading}><span><b>{observations.length.toLocaleString()}</b> {archive ? "events at this date" : "events on the map"}</span><label><ArrowDownWideNarrow size={13} /><select aria-label="Sort events" value={sort} onChange={e => setSort(e.target.value)}><option value="newest">Latest first</option><option value="oldest">Oldest first</option></select></label></div>
        <div className={styles.eventList}>
          {query.isPending ? <div className={styles.empty} role="status"><Loader2 className={styles.spin} size={21} /><p>Connecting to NASA’s event catalog…</p></div> : query.isError ? <div className={styles.empty} role="alert"><Radio size={24} /><h3>Observations are unavailable</h3><p>The map is still available. Reconnect to load NASA events.</p><button onClick={() => void query.refetch()}>Retry connection <RefreshCw size={13} /></button></div> : !list.length ? <div className={styles.empty}><Search size={25} /><h3>No matching events</h3><p>Try a different date, status or search.</p><button onClick={() => { clearFilters(); setCursor(null); }}>Reset event filters <ArrowRight size={14} /></button></div> : list.map(item => <button key={item.event.id} className={styles.eventRow} data-selected={selectedId === item.event.id} onClick={() => selectEvent(item.event.id)}><span className={styles.categoryIcon} style={{ "--category": getCategoryColor(item.event.categories[0]?.id || "") } as CSSProperties}><CategoryIcon categoryId={item.event.categories[0]?.id || ""} size={18} /></span><span><small>{getCategoryLabel(item.event.categories[0]?.id || "")}<i />{shortDate(item.geometry.date.slice(0, 10))}</small><strong>{item.event.title}</strong><span className={styles.eventMeta}>{item.open ? <><i />Active</> : "Closed"}<span>{Math.abs(item.point[1]).toFixed(1)}°{item.point[1] >= 0 ? "N" : "S"} · {Math.abs(item.point[0]).toFixed(1)}°{item.point[0] >= 0 ? "E" : "W"}</span></span></span>{watched.includes(item.event.id) ? <Bookmark size={13} /> : <ChevronRight size={14} />}</button>)}
        </div>
        <div className={styles.sidebarFooter}><span><i />{query.isFetching ? "Refreshing observations" : "NASA-curated natural events"}</span>{filtered ? <button onClick={clearFilters}>Clear filters</button> : <button onClick={() => void query.refetch()} aria-label="Refresh observations"><RefreshCw size={13} /></button>}</div>
        {events.length >= 1000 && <p className={styles.limitNote}>1,000-result limit reached. Narrow the date window for complete results.</p>}
        {!!unmappable && <p className={styles.limitNote}>{unmappable} records omitted: location data unavailable.</p>}
      </aside>

      <div className={styles.topTools}><span className={styles.feedStatus}><i />{archive ? "ARCHIVE VIEW" : "EARTH OBSERVATIONS"}<span>{query.dataUpdatedAt ? new Date(query.dataUpdatedAt).toISOString().slice(11, 16) + " UTC" : "CONNECTING"}</span></span><button className={styles.toolPill} aria-expanded={panel === "regions"} onClick={() => { setPanel(panel === "regions" ? null : "regions"); if (compact) setSidebarOverride(false); }}><Compass size={16} /><span>Regions</span></button><button className={styles.toolPill} aria-expanded={panel === "layers"} onClick={() => { setPanel(panel === "layers" ? null : "layers"); if (compact) setSidebarOverride(false); }}><Layers3 size={16} /><span>Map layers</span>{!!activeLayers && <b>{activeLayers}</b>}</button></div>
      {panel && <aside className={styles.layerPanel} aria-label={panel === "layers" ? "Map layers" : "Explore regions"}><div className={styles.panelHeading}><div><span className={styles.eyebrow}>{panel === "layers" ? "A DIFFERENT PERSPECTIVE" : "PLACES TO EXPLORE"}</span><h2>{panel === "layers" ? "Make the map yours." : "Around the planet."}</h2></div><IconButton label="Close map panel" onClick={() => setPanel(null)}><X size={17} /></IconButton></div><div className={styles.panelContent}>
        {panel === "layers" ? <><div className={styles.basemaps}>{BASEMAPS.map(base => <button key={base.id} aria-pressed={basemap === base.id} onClick={() => { setBasemap(base.id); setMapIssue(null); }}><span style={{ backgroundImage: `url("${base.preview}")` }}>{basemap === base.id && <Check size={14} />}</span><strong>{base.title}</strong></button>)}</div><p className={styles.basemapCredit}>{BASEMAPS.find(base => base.id === basemap)?.detail}</p><div className={styles.sectionTitle}>Observation layers</div><Switch label="Event density" detail="Concentration of mapped events" icon={<Waves size={18} />} checked={heatmap} onClick={toggleHeatmap} /><Switch label="Day & night" detail={archive ? "Sunlight at 12:00 UTC on this date" : "Sunlight for the current UTC time"} icon={<Sun size={18} />} checked={night} onClick={toggleNight} /><Switch label="Plate boundaries" detail="Peter Bird’s PB2002 plate model" icon={<Mountain size={18} />} checked={plates} onClick={togglePlates} /><Switch label="Globe projection" detail="Earth’s curvature at a world scale" icon={<Globe2 size={18} />} checked={globe} onClick={() => setGlobe(v => !v)} /><Switch label="Scan effect" detail="Decorative motion · no weather data" icon={<Radio size={18} />} checked={scan} onClick={toggleScan} /><label className={styles.opacity}>Basemap opacity<span>{Math.round(Math.max(.15, opacity) * 100)}%</span><input aria-label="Basemap opacity" type="range" min=".15" max="1" step=".05" value={Math.max(.15, opacity)} onChange={e => setOpacity(Number(e.target.value))} /></label></> : <>{REGIONS.map(region => <button key={region.name} className={styles.region} onClick={() => { setSelectedId(null); commands.current?.fly(region.point, region.zoom); setPanel(null); }}><region.icon size={22} strokeWidth={1.2} /><span><strong>{region.name}</strong><small>{region.label}</small></span><ArrowUpRight size={16} /></button>)}<button className={styles.fitRegion} onClick={() => { setSelectedId(null); commands.current?.fit(); setPanel(null); }}><Crosshair size={17} />Fit all filtered events<ArrowRight size={14} /></button></>}
      </div></aside>}
      {selected && !panel && (!compact || !sidebar) && <EventInspector key={selected.event.id} selected={selected} date={date} watched={watched.includes(selected.event.id)} onWatch={() => toggleWatch(selected.event.id)} onClose={() => setSelectedId(null)} onShare={() => void share()} />}

      <div className={styles.mapControls} aria-label="Map view controls"><IconButton label="Zoom in" disabled={!mapReady} onClick={() => commands.current?.zoom(1)}><Plus size={18} /></IconButton><IconButton label="Zoom out" disabled={!mapReady} onClick={() => commands.current?.zoom(-1)}><Minus size={18} /></IconButton><span /><IconButton label="Point north" onClick={() => commands.current?.north()}><Compass size={19} style={{ rotate: `${-view.bearing}deg` }} /></IconButton><IconButton label="Tilt map view" active={tilted} onClick={() => setTilted(v => !v)}><span className={styles.tiltIcon}>3D</span></IconButton><IconButton label="Fit filtered events" disabled={!observations.length} onClick={() => { setSelectedId(null); commands.current?.fit(); }}><Crosshair size={18} /></IconButton><IconButton label="Reset world view" onClick={() => { setSelectedId(null); commands.current?.reset(); }}><Globe2 size={18} /></IconButton><span /><IconButton label={fullscreen ? "Exit fullscreen" : "Fullscreen map"} onClick={() => void toggleFullscreen()}><Maximize2 size={17} /></IconButton><IconButton label="Share current map" onClick={() => void share()}><Share2 size={16} /></IconButton></div>
      <div className={styles.mapReadout}><span>{Math.abs(view.latitude).toFixed(2)}° {view.latitude >= 0 ? "N" : "S"}</span><i /> <span>{Math.abs(view.longitude).toFixed(2)}° {view.longitude >= 0 ? "E" : "W"}</span><i /><span>{globe ? "GLOBE" : "MERCATOR"}</span></div>
      {mapIssue && <div className={styles.mapIssue} role="alert"><p>{mapIssue}</p><button onClick={() => { setMapReady(false); setMapIssue(null); setSceneVersion(v => v + 1); }}>Reload map</button><button aria-label="Dismiss map notice" onClick={() => setMapIssue(null)}><X size={15} /></button></div>}
      {notice && <div className={styles.toast} role="status"><Check size={16} />{notice}</div>}

      <section className={styles.timeline} aria-label="Observation timeline"><div className={styles.timelineIntro}><span className={styles.eyebrow}>OBSERVATION ARCHIVE</span><div><strong>{shortDate(date)}<small>{date.slice(0, 4)}</small></strong><button aria-label="Return to latest observations" aria-pressed={!cursor} onClick={() => { setCursor(null); setPlaying(false); }}>Latest <i /></button></div></div><div className={styles.playback}><IconButton label="Previous day" disabled={dateIndex <= 0} onClick={() => scrub(dateIndex - 1)}><ChevronLeft size={17} /></IconButton><IconButton label={playing ? "Pause archive playback" : "Play archive playback"} disabled={dates.length < 2 || query.isPending} active={playing} onClick={() => { if (!playing && (!cursor || dateIndex >= dates.length - 1)) setCursor(dates[0]); setPlaying(v => !v); }}>{playing ? <Pause size={17} /> : <Play size={17} />}</IconButton><IconButton label="Next day" disabled={dateIndex >= dates.length - 1} onClick={() => scrub(dateIndex + 1)}><ChevronRight size={17} /></IconButton><select aria-label="Archive playback speed" value={speed} onChange={e => setSpeed(Number(e.target.value))}>{[1, 2, 4].map(value => <option key={value} value={value}>{value}×</option>)}</select></div><div className={styles.chart}><div className={styles.chartBars} aria-hidden="true">{chart.map((count, i) => <span key={dates[i]} data-future={i > dateIndex} data-selected={i === dateIndex} style={{ height: `${Math.max(4, count / chartMax * 100)}%` }} title={`${dates[i]}: ${count} observed events`} />)}</div><input aria-label="Observation date on map" aria-valuetext={date} type="range" min="0" max={Math.max(0, dates.length - 1)} value={dateIndex} disabled={!dates.length} onChange={e => scrub(Number(e.target.value))} /><div className={styles.chartLabels}><span>{shortDate(range.start)}</span><span>Daily observed events · UTC</span><span>{shortDate(range.end)}</span></div></div></section>
    </div>
    <Dialog open={!!shareLink} onClose={() => setShareLink(null)} title="Share this map"><div className={styles.shareDialog}><h2>Your window into Earth.</h2><p>Copy this link to open the selected event, date and filters.</p><input aria-label="Shared map link" readOnly value={shareLink || ""} onFocus={e => e.target.select()} /></div></Dialog>
  </div>;
}

function EventInspector({ selected, date, watched, onWatch, onClose, onShare }: { selected: Observation; date: string; watched: boolean; onWatch: () => void; onClose: () => void; onShare: () => void }) {
  const { event, geometry, point, open } = selected;
  const snapshot = useMemo(() => ({ ...event, closed: open ? null : event.closed, geometry: event.geometry.filter(item => item.date.slice(0, 10) <= date) }), [event, open, date]);
  const category = event.categories[0]?.id || "";
  return <aside className={styles.inspector} aria-label="Selected event details"><div className={styles.inspectorTop}><span style={{ color: getCategoryColor(category) }}><CategoryIcon categoryId={category} size={14} />{getCategoryLabel(category)}</span><IconButton label="Close event details" onClick={onClose}><X size={17} /></IconButton></div><div className={styles.inspectorBody}><span className={styles.eventStatus} data-active={open}><i />{open ? "ACTIVE EVENT" : "CLOSED EVENT"}</span><h2>{event.title}</h2>{event.description && <p>{event.description}</p>}<div className={styles.detailStats}><div><span>OBSERVED</span><strong>{shortDate(geometry.date.slice(0, 10))} {geometry.date.slice(0, 4)}</strong></div><div><span>{geometry.type === "Polygon" ? "APPROX. AREA CENTER" : "LOCATION"}</span><strong>{point[1].toFixed(2)}°, {point[0].toFixed(2)}°</strong></div>{geometry.magnitudeValue != null && <div><span>REPORTED MAGNITUDE</span><strong>{formatMagnitude(geometry.magnitudeValue, geometry.magnitudeUnit)}</strong></div>}</div><div className={styles.detailActions}><button onClick={onWatch} aria-pressed={watched}><Bookmark size={14} fill={watched ? "currentColor" : "none"} />{watched ? "Saved event" : "Save event"}</button><button onClick={onShare}><Share2 size={14} />Share</button></div><details className={styles.history}><summary>Observation history <span>{snapshot.geometry.length}</span></summary><ol>{[...snapshot.geometry].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20).map((item, i) => <li key={item.date + i}><i /><span>{shortDate(item.date.slice(0, 10))}</span><small>{item.date.slice(11, 16)} UTC</small></li>)}</ol>{snapshot.geometry.length > 20 && <p>Latest 20 observations. Full history is available in the event report.</p>}</details><details className={styles.analysis}><summary>Analysis & proximity tools<Settings2 size={14} /></summary><EventAnalysis event={snapshot} date={date} point={point} polygon={geometry.type === "Polygon"} /></details><div className={styles.sourceLinks}>{event.sources.map(source => { const url = safeMapLink(source.url); return url && <a key={source.id + url} href={url} target="_blank" rel="noopener noreferrer">{source.id}<ArrowUpRight size={12} /></a>; })}</div><Link className={styles.reportLink} href={`/events/${encodeURIComponent(event.id)}`}>Open event report<ArrowUpRight size={17} /></Link>{safeMapLink(event.link) && <a className={styles.eonetLink} href={safeMapLink(event.link)!} target="_blank" rel="noopener noreferrer">Source record at NASA EONET <ArrowUpRight size={12} /></a>}</div></aside>;
}
