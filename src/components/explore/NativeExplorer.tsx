"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Compass, Crosshair, Download, Earth, Expand, Focus, Grid2X2, Layers3, Loader2, Maximize2, Minus, Pause, Play, Plus, Radio, RotateCcw, Satellite, Search, Settings2, Share2, Sparkles, Sun, X } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { Dialog } from "@/components/site/Dialog";
import { Navigation } from "@/components/site/Navigation";
import { getCategoryColor } from "@/lib/utils";
import { decodeMeasurement, formatMeasurement, GIBS_LEGENDS, SCIENCE_LAYERS, validDate, type Measurement, type ScienceLayer } from "@/lib/explore/science";
import { MISSION_SPANS, missionStatus, missionUrl, NORAD_IDS, plainText, type Mission, type OrbitRecord } from "@/lib/explore/missions";
import { propagatedPosition, tleEpoch, type GeoPoint } from "@/lib/explore/astronomy";
import { FIELD_GUIDE, SCIENCE_STORIES } from "@/lib/explore/stories";
import { missionColor, missionThumbnail, spacecraftAsset } from "@/lib/explore/model-assets";
import type { ModelStatus } from "./MissionModel";
import { useMissions, useObservation } from "./useExplorerData";
import type { SceneCommands } from "./ExplorerScene";
import styles from "./explorer-console.module.css";

const ExplorerScene = dynamic(() => import("./ExplorerScene"), { ssr: false });
const EMPTY_RECORDS: Record<number, OrbitRecord> = {};
type Panel = "missions" | "layers" | "events" | "stories" | "settings" | null;
const TABS = [{ id: "missions", title: "Satellites", icon: Satellite }, { id: "layers", title: "Vital signs", icon: Layers3 }, { id: "events", title: "Latest events", icon: Radio }, { id: "stories", title: "Discover", icon: Compass }] as const;
const formatDate = (date: string) => new Date(date + "T12:00:00Z").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
function IconButton({ label, children, onClick, active, tool, disabled = false }: { tool?: string; label: string; children: ReactNode; onClick: () => void; active?: boolean; disabled?: boolean }) { return <button type="button" className={`${styles.iconButton} ${active ? styles.active : ""}`} aria-label={label} data-tool={tool} aria-expanded={tool ? active : undefined} aria-controls={tool && active ? "explore-panel" : undefined} aria-pressed={tool ? undefined : active} title={label} onClick={onClick} disabled={disabled}>{children}</button>; }
function Toggle({ label, detail, checked, onChange }: { label: string; detail: string; checked: boolean; onChange: () => void }) { return <button type="button" className={styles.toggleRow} role="switch" aria-checked={checked} onClick={onChange}><span>{label}<small>{detail}</small></span><i data-checked={checked}><b /></i></button>; }
function MissionThumbnail({ mission }: { mission: Mission }) {
  const [failed, setFailed] = useState(false);
  const url = missionThumbnail(mission);
  return <span className={styles.missionImage}>{url && !failed ? <Image src={url} alt="" width={216} height={144} unoptimized onError={() => setFailed(true)} /> : <Satellite size={48} strokeWidth={1} />}</span>;
}

export function ExploreClient() {
  const root = useRef<HTMLDivElement>(null), commands = useRef<SceneCommands>(null), vitalStrip = useRef<HTMLDivElement>(null);
  const reduced = !!useReducedMotion();
  const [panel, setPanel] = useState<Panel>(null);
  const [clock, setClock] = useState<number | null>(null);
  const [playing, setPlaying] = useState(true), [rate, setRate] = useState(1), [liveClock, setLiveClock] = useState(true);
  const [activeLayer, setActiveLayer] = useState<string | null>(null), [variantId, setVariantId] = useState<string | null>(null);
  const [requestedDate, setRequestedDate] = useState<string>(), [archivePlaying, setArchivePlaying] = useState(false);
  const [missionId, setMissionId] = useState<string | null>(null), [follow, setFollow] = useState(false), [inspector, setInspector] = useState(false);
  const [comparison, setComparison] = useState<"none" | "person" | "bus">("none");
  const [missionSearch, setMissionSearch] = useState(""), [missionFilter, setMissionFilter] = useState("Current"), [missionCategory, setMissionCategory] = useState("all");
  const [layerSearch, setLayerSearch] = useState(""), [eventCategory, setEventCategory] = useState("all"), [eventId, setEventId] = useState<string | null>(null), [eventEnd, setEventEnd] = useState("");
  const [opacity, setOpacity] = useState(.88), [celsius, setCelsius] = useState(true);
  const [showSatellites, setShowSatellites] = useState(true), [showOrbits, setShowOrbits] = useState(true), [showGroundTrack, setShowGroundTrack] = useState(true);
  const [showCities, setShowCities] = useState(false), [showGrid, setShowGrid] = useState(false), [dayNight, setDayNight] = useState(false), [autoRotate, setAutoRotate] = useState(false);
  const [modelStatus, setModelStatus] = useState<ModelStatus>("loading"), [infoExpanded, setInfoExpanded] = useState(true);
  const [ready, setReady] = useState(false), [sceneError, setSceneError] = useState<string | null>(null), [sceneVersion, setSceneVersion] = useState(0);
  const [point, setPoint] = useState<GeoPoint | null>(null);
  const [fullscreen, setFullscreen] = useState(false), [help, setHelp] = useState(false), [notice, setNotice] = useState<string | null>(null);
  const [storyIndex, setStoryIndex] = useState<number | null>(null), [tourStep, setTourStep] = useState<number | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const data = useMissions();
  const selectedMission = data.missions.find(mission => mission.target_entity === missionId) || null;
  const records = data.orbits.data?.records || EMPTY_RECORDS;
  const tle = selectedMission ? records[NORAD_IDS[selectedMission.target_entity]] : undefined;
  const layer = SCIENCE_LAYERS.find(item => item.id === activeLayer);
  const dataset = layer?.variants.find(item => item.id === variantId) || layer?.variants[0];
  const observation = useObservation(layer, dataset, requestedDate);
  const sceneTime = layer && observation.date ? Date.parse(observation.date + "T12:00:00Z") : clock;
  const position = tle && sceneTime ? propagatedPosition(tle, sceneTime) : null;
  const filters = useMemo(() => eventEnd && validDate(eventEnd) ? { status: "all" as const, limit: 120, days: null, dateRange: { start: new Date(Date.parse(eventEnd) - 30 * 86400000).toISOString().slice(0, 10), end: eventEnd } } : { status: "open" as const, limit: 120, days: 30 }, [eventEnd]);
  const events = useEvents(filters);
  const markers = useMemo(() => (events.data?.events || []).flatMap(event => {
    if (eventCategory !== "all" && !event.categories.some(category => category.id === eventCategory)) return [];
    const geometry = [...event.geometry].filter(item => item.type === "Point" && (!eventEnd || item.date.slice(0, 10) <= eventEnd)).sort((a, b) => b.date.localeCompare(a.date))[0];
    if (!geometry || typeof geometry.coordinates[0] !== "number" || typeof geometry.coordinates[1] !== "number") return [];
    return [{ id: event.id, title: event.title, date: geometry.date, point: { longitude: geometry.coordinates[0], latitude: geometry.coordinates[1] }, color: getCategoryColor(event.categories[0]?.id || "") }];
  }), [events.data, eventCategory, eventEnd]);
  const currentEvent = markers.find(event => event.id === eventId);
  const currentStory = storyIndex === null ? null : SCIENCE_STORIES[storyIndex];
  const dateIndex = observation.date ? observation.dates.indexOf(observation.date) : 0;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selected = SCIENCE_LAYERS.find(item => item.id === params.get("layer"));
    // Hydrate the shared view once from the external browser URL after SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (selected) { setShowSatellites(false); setActiveLayer(selected.id); setVariantId(selected.variants.find(item => item.id === params.get("dataset"))?.id || selected.variants[0].id); setPanel("layers"); }
    const date = params.get("date"); if (date && validDate(date)) setRequestedDate(date);
    const mission = params.get("mission"); if (mission && /^sc_[a-z0-9_]+$/.test(mission)) { setMissionId(mission); if (!selected) setPanel("missions"); }
    const time = params.get("time"), parsed = time ? Date.parse(time) : NaN;
    setClock(Number.isFinite(parsed) ? parsed : Date.now());
    if (Number.isFinite(parsed)) { setLiveClock(false); setPlaying(false); }
  }, []);
  useEffect(() => {
    if (!playing || activeLayer) return;
    let last = performance.now();
    const timer = window.setInterval(() => { const now = performance.now(), delta = Math.min(now - last, 1000); last = now; if (!document.hidden) setClock(value => liveClock ? Date.now() : (value ?? Date.now()) + delta * rate); }, 250);
    return () => window.clearInterval(timer);
  }, [playing, rate, liveClock, activeLayer]);
  useEffect(() => {
    if (!archivePlaying || observation.loading || observation.error || !observation.date) return;
    const timer = window.setTimeout(() => { if (dateIndex >= observation.dates.length - 1) setArchivePlaying(false); else setRequestedDate(observation.dates[dateIndex + 1]); }, 1400);
    return () => window.clearTimeout(timer);
  }, [archivePlaying, observation.loading, observation.error, observation.date, dateIndex, observation.dates]);
  useEffect(() => { const sync = () => setFullscreen(document.fullscreenElement === root.current); document.addEventListener("fullscreenchange", sync); return () => document.removeEventListener("fullscreenchange", sync); }, []);
  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(null), 7000); return () => window.clearTimeout(timer); }, [notice]);
  useEffect(() => {
    if (!panel || help || currentStory || shareUrl) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape" && !document.querySelector("dialog[open]")) { setPanel(null); root.current?.querySelector<HTMLButtonElement>(`[data-tool="${panel}"]`)?.focus(); } };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [panel, help, currentStory, shareUrl]);
  useEffect(() => { vitalStrip.current?.querySelector('[aria-pressed="true"]')?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "nearest", inline: "nearest" }); }, [activeLayer, reduced]);
  const onReady = useCallback(() => setReady(true), []), onSceneError = useCallback((message: string) => setSceneError(message), []);
  const reading = useMemo<Measurement | null>(() => {
    const raw = observation.observation?.raw;
    if (!raw || !dataset || !point) return null;
    const x = Math.min(raw.width - 1, Math.max(0, Math.floor((point.longitude + 180) / 360 * raw.width)));
    const y = Math.min(raw.height - 1, Math.max(0, Math.floor((90 - point.latitude) / 180 * raw.height)));
    const i = (y * raw.width + x) * 4;
    return decodeMeasurement(raw.data[i], raw.data[i + 1], raw.data[i + 2], dataset);
  }, [point, observation.observation, dataset]);

  function chooseLayer(next: ScienceLayer | undefined) {
    setActiveLayer(next?.id || null); setVariantId(next?.variants[0].id || null); setRequestedDate(undefined); setArchivePlaying(false); setInspector(false); setFollow(false); setEventId(null); setMissionId(null); setPanel(null); setInfoExpanded(true); setTourStep(null); setShowSatellites(!next);
  }
  function chooseMission(mission: Mission) {
    if (layer) chooseLayer(undefined);
    setMissionId(mission.target_entity); setEventId(null); setFollow(false); setInspector(true); setComparison("none"); setShowSatellites(true); setPanel(null); setInfoExpanded(true); if (mission.target_entity !== missionId || !inspector) setModelStatus("loading"); setTourStep(null);

  }
  function chooseEvent(id: string) {
    const event = markers.find(item => item.id === id); if (!event) return;
    if (layer) chooseLayer(undefined);
    setEventId(id); setMissionId(null); setInspector(false); setFollow(false); setPanel(null); setInfoExpanded(true); setTourStep(null); commands.current?.flyTo(event.point, 2.15);
  }
  function inspectPoint(location: GeoPoint) { setPoint(location); }
  function goLive() { chooseLayer(undefined); setClock(Date.now()); setRate(1); setPlaying(true); setLiveClock(true); setInspector(false); commands.current?.reset(); }
  function syncNow() { setClock(Date.now()); setRate(1); setPlaying(true); setLiveClock(true); if (layer) { setRequestedDate(undefined); setArchivePlaying(false); } }
  function setTime(time: number) { if (!Number.isFinite(time)) return; setClock(time); setLiveClock(false); setPlaying(false); }
  function stepDate(delta: number) { setArchivePlaying(false); setRequestedDate(observation.dates[Math.min(observation.dates.length - 1, Math.max(0, dateIndex + delta))]); }
  function guide(step: number) { const item = FIELD_GUIDE[step]; chooseLayer(SCIENCE_LAYERS.find(candidate => candidate.id === item.layer)); setTourStep(step); setPanel(null); commands.current?.flyTo(item, 3); }
  async function toggleFullscreen() { try { if (document.fullscreenElement) await document.exitFullscreen(); else await root.current?.requestFullscreen(); } catch { setNotice("Fullscreen is unavailable in this browser."); } }
  async function share() {
    const url = new URL(window.location.origin + "/explore");
    if (layer && dataset) { url.searchParams.set("layer", layer.id); url.searchParams.set("dataset", dataset.id); if (observation.date) url.searchParams.set("date", observation.date); }
    else if (clock) url.searchParams.set("time", new Date(clock).toISOString());
    if (missionId) url.searchParams.set("mission", missionId);
    try { await navigator.clipboard.writeText(url.href); setNotice("Explorer link copied with the selected mission, dataset and time."); } catch { setShareUrl(url.href); }
  }
  const missionList = data.missions.filter(mission => (!clock || missionStatus(mission, data.dataUpdatedAt || clock || 0) === missionFilter) && (missionCategory === "all" || mission.categories.includes(missionCategory)) && `${mission.title} ${plainText(mission.description)}`.toLowerCase().includes(missionSearch.toLowerCase()));
  const pointLabel = point ? `${Math.abs(point.latitude).toFixed(2)}° ${point.latitude >= 0 ? "N" : "S"} / ${Math.abs(point.longitude).toFixed(2)}° ${point.longitude >= 0 ? "E" : "W"}` : "Drag to orbit · Scroll to zoom";
  const scienceCount = SCIENCE_LAYERS.reduce((count, item) => count + item.variants.length, 0);

  return <div ref={root} className={styles.workspace} data-panel={!!panel} data-inspector={inspector}>
    <Navigation explorerControls={<nav className={styles.rail} aria-label="Explorer tools">{TABS.map(tab => <button key={tab.id} data-tool={tab.id} className={panel === tab.id ? styles.railActive : ""} onClick={() => setPanel(panel === tab.id ? null : tab.id)} aria-expanded={panel === tab.id} aria-controls={panel === tab.id ? "explore-panel" : undefined}><tab.icon size={17} strokeWidth={1.5} /><span>{tab.title}</span><ChevronDown size={12} /></button>)}</nav>} explorerActions={<div className={styles.topActions}><IconButton label="View settings" tool="settings" active={panel === "settings"} onClick={() => setPanel(panel === "settings" ? null : "settings")}><Settings2 size={18} /></IconButton><IconButton label="Share this exploration" onClick={() => void share()}><Share2 size={17} /></IconButton><IconButton label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"} onClick={() => void toggleFullscreen()}><Maximize2 size={18} /></IconButton></div>} />
    <h1 className={styles.consoleTitle}>Earth explorer</h1>
    <div className={styles.world}>
      <div className={styles.stage} tabIndex={0} role="group" aria-label="Interactive globe. Arrow keys rotate, plus and minus zoom, and zero resets the camera." onKeyDown={event => {
        const motion: Record<string, [number, number]> = { ArrowUp: [12, 0], ArrowDown: [-12, 0], ArrowLeft: [0, -12], ArrowRight: [0, 12] };
        if (motion[event.key]) { event.preventDefault(); setFollow(false); commands.current?.rotate(...motion[event.key]); }
        else if (["+", "=", "-", "0"].includes(event.key)) { event.preventDefault(); if (event.key === "0") commands.current?.reset(); else commands.current?.zoom(event.key === "-" ? 1.25 : .8); }
      }}>{clock && <ExplorerScene key={sceneVersion} apiRef={commands} time={sceneTime || clock} playing={playing && !layer} reduced={reduced} missions={data.missions} records={records} selectedMission={selectedMission} follow={follow} observation={observation.observation} opacity={opacity} showSatellites={showSatellites && !inspector} showOrbits={showOrbits} showGroundTrack={showGroundTrack} showCities={showCities} showGrid={showGrid} dayNight={dayNight} autoRotate={autoRotate} events={panel === "events" || eventId ? markers : []} selectedEvent={eventId} inspector={inspector} comparison={comparison} onMission={chooseMission} onEvent={chooseEvent} onPoint={inspectPoint} onReady={onReady} onError={onSceneError} onModelStatus={setModelStatus} onInteract={() => setFollow(false)} />}</div>
      <div className={styles.vignette} />

      {panel && <aside className={styles.panel} data-kind={panel} id="explore-panel" aria-label={panel === "layers" ? "Earth science layers" : panel}>
        <div className={styles.panelHeading}><div><span className={styles.eyebrow}>{panel === "missions" ? "OBSERVING OUR WORLD" : panel === "layers" ? "BEYOND VISIBLE LIGHT" : panel === "events" ? "OUR CHANGING EARTH" : panel === "stories" ? "FOLLOW YOUR CURIOSITY" : "MAKE IT YOURS"}</span><h2>{panel === "missions" ? "Spacecraft" : panel === "layers" ? "Earth’s vital signs" : panel === "events" ? "Natural events" : panel === "stories" ? "Discover more" : "Your perspective"}</h2></div><IconButton label="Close explorer panel" onClick={() => setPanel(null)}><X size={17} /></IconButton></div>
        <div className={styles.panelBody}>
          {panel === "missions" && <>
            <p className={styles.panelDescription}>The missions giving us a different view of home.</p>
            <label className={styles.search}><Search size={15} /><input aria-label="Search spacecraft" placeholder="Find a mission…" value={missionSearch} onChange={event => setMissionSearch(event.target.value)} /></label>
            <div className={styles.segmented} aria-label="Mission status">{["Current", "Past", "Future"].map(status => <button key={status} aria-pressed={missionFilter === status} onClick={() => setMissionFilter(status)}>{status}</button>)}</div>
            <label className={styles.selectLabel}>Science focus<select value={missionCategory} onChange={event => setMissionCategory(event.target.value)}><option value="all">All disciplines</option><option value="atmosphere">Atmosphere</option><option value="land">Land</option><option value="sea">Ocean</option></select></label>
            {data.isPending ? <p className={styles.loadingText}><Loader2 size={15} /> Loading NASA’s mission catalog…</p> : data.isError ? <div className={styles.empty}>The mission catalog could not load.<button onClick={() => void data.refetch()}>Retry catalog</button></div> : <>
              <div className={styles.listMeta}>{missionList.length} missions <span>NASA / JPL</span></div>
              <div className={styles.missionGrid}>{missionList.map(mission => <button className={`${styles.missionRow} ${missionId === mission.target_entity ? styles.rowSelected : ""}`} key={mission.target_entity} onClick={() => chooseMission(mission)}><MissionThumbnail mission={mission} /><span><strong>{mission.title} <ChevronRight size={14} /></strong><small><i style={{ background: missionColor(mission) }} />{mission.categories.join(" · ") || "Earth observation"}</small></span></button>)}</div>
              {!missionList.length && <p className={styles.empty}>No missions match these filters.</p>}
            </>}
            {data.orbits.isPending && <p className={styles.footnote}>Acquiring orbital elements…</p>}
            {!!data.orbits.data?.failed.length && <div className={styles.inlineNotice}>{data.orbits.data.failed.length} orbital records unavailable.<button onClick={() => void data.orbits.refetch()}>Retry</button></div>}
          </>}
          {panel === "layers" && <>
            <p className={styles.panelDescription}>One Earth. {scienceCount} ways to understand it.</p>
            <label className={styles.search}><Search size={15} /><input aria-label="Search Earth layers" placeholder="Temperature, ocean, atmosphere…" value={layerSearch} onChange={event => setLayerSearch(event.target.value)} /></label>
            <div className={styles.layerGrid}><button className={`${styles.layerRow} ${!layer ? styles.rowSelected : ""}`} onClick={goLive}><span className={`${styles.layerOrb} ${styles.marbleOrb}`} /><span><strong>Satellites Now</strong><small>Earth’s observing fleet</small></span>{!layer ? <Check size={16} /> : <ChevronRight size={14} />}</button>
            {SCIENCE_LAYERS.filter(item => `${item.title} ${item.description}`.toLowerCase().includes(layerSearch.toLowerCase())).map(item => <button className={`${styles.layerRow} ${layer?.id === item.id ? styles.rowSelected : ""}`} key={item.id} onClick={() => chooseLayer(item)}><span className={styles.layerOrb} style={{ "--swatch": item.color, background: `radial-gradient(circle at 30% 30%, ${item.palette[3]}, ${item.palette[1]} 40%, ${item.palette[0]} 75%, #000)` } as CSSProperties} /><span><strong>{item.title}</strong><small>{item.variants.length} {item.variants.length === 1 ? "dataset" : "datasets"}</small></span>{layer?.id === item.id ? <Check size={16} /> : <ChevronRight size={14} />}</button>)}
            </div>
          </>}
          {panel === "events" && <>
            <p className={styles.panelDescription}>NASA-curated events from the last 30 days. Select a marker or a story to fly there.</p>
            <label className={styles.selectLabel}>Category<select value={eventCategory} onChange={event => setEventCategory(event.target.value)}><option value="all">All natural events</option><option value="wildfires">Wildfires</option><option value="severeStorms">Severe storms</option><option value="volcanoes">Volcanoes</option><option value="seaLakeIce">Sea & lake ice</option><option value="floods">Floods</option></select></label>
            <label className={styles.selectLabel}>Archive ending on<input type="date" value={eventEnd} max={clock ? new Date(data.dataUpdatedAt || clock).toISOString().slice(0, 10) : undefined} onChange={event => { setEventEnd(event.target.value); setEventId(null); }} /></label>
            {events.isFetching && <p className={styles.loadingText}><Loader2 size={14} /> Refreshing NASA EONET…</p>}
            {events.isError ? <div className={styles.empty}>Events could not load.<button onClick={() => void events.refetch()}>Retry</button></div> : <>{markers.map(event => <button key={event.id} className={`${styles.eventRow} ${eventId === event.id ? styles.rowSelected : ""}`} onClick={() => chooseEvent(event.id)}><i style={{ background: event.color }} /><span><strong>{event.title}</strong><small>{formatDate(event.date.slice(0, 10))}</small></span><ArrowUpRight size={14} /></button>)}{!markers.length && !events.isFetching && <p className={styles.empty}>No mapped events for these filters.</p>}</>}
          </>}
          {panel === "stories" && <>
            <button className={styles.guideCard} onClick={() => guide(0)}><Sparkles size={24} strokeWidth={1.2} /><span>A planet worth exploring.</span><p>Take a five-stop tour through Earth’s vital signs.</p><b>Start the field guide <ArrowRight size={16} /></b></button>
            <div className={styles.listMeta}>Science in motion<span>NASA VISUALIZATIONS</span></div>
            {SCIENCE_STORIES.map((story, i) => <button key={story.file} className={styles.storyRow} onClick={() => setStoryIndex(i)}><span>{String(i + 1).padStart(2, "0")}</span><div><strong>{story.title}</strong><small>{story.topic} · {"image" in story ? "Graphic" : "Video"}</small></div><Play size={14} /></button>)}
          </>}
          {panel === "settings" && <>
            <Toggle label="Day & night" detail="Sunlight for the selected UTC time" checked={dayNight} onChange={() => setDayNight(value => !value)} />
            <Toggle label="Spacecraft" detail="Positions from available orbital elements" checked={showSatellites} onChange={() => setShowSatellites(value => !value)} />
            <Toggle label="Orbit paths" detail="One revolution around Earth" checked={showOrbits} onChange={() => setShowOrbits(value => !value)} />
            <Toggle label="Ground track" detail="Selected spacecraft’s path on the surface" checked={showGroundTrack} onChange={() => setShowGroundTrack(value => !value)} />
            <Toggle label="City names" detail="Landmarks to find your bearings" checked={showCities} onChange={() => setShowCities(value => !value)} />
            <Toggle label="Latitude & longitude" detail="A geographic reference grid" checked={showGrid} onChange={() => setShowGrid(value => !value)} />
            <Toggle label="Slow camera orbit" detail={reduced ? "Disabled by your reduced-motion preference" : "A gentle journey around the globe"} checked={autoRotate && !reduced} onChange={() => { if (!reduced) setAutoRotate(value => !value); }} />
            <Toggle label="Celsius" detail="Temperature readouts and legends" checked={celsius} onChange={() => setCelsius(value => !value)} />
            <button className={styles.textButton} onClick={() => setHelp(true)}><CircleHelp size={16} /> Controls & data sources</button>
          </>}
        </div>
      </aside>}
      {!panel && !layer && !selectedMission && !currentEvent && tourStep === null && <section className={styles.welcome}><span className={styles.eyebrow}>EARTH OBSERVING MISSIONS</span><h2><button className={styles.overviewToggle} aria-expanded={infoExpanded} onClick={() => setInfoExpanded(value => !value)}>Satellites Now<ChevronDown size={17} /></button></h2>{infoExpanded && <><p>Explore the spacecraft watching over our planet. Select a satellite to follow its orbit or examine its 3D model.</p><div className={styles.orbitKey}><span><i />Atmosphere</span><span><i />Land</span><span><i />Ocean</span></div><button className={styles.textButton} onClick={() => setPanel("missions")}>Browse the missions <ArrowRight size={15} /></button></>}</section>}
      {layer && <section className={styles.insight} data-expanded={infoExpanded} aria-label="Selected observation">
        <div className={styles.insightHeader}><button className={styles.detailToggle} aria-label="Toggle observation details" aria-expanded={infoExpanded} onClick={() => setInfoExpanded(value => !value)}><span className={styles.eyebrow}>VITAL SIGNS</span><ChevronDown size={14} /></button><IconButton label="Return to Blue Marble" onClick={() => chooseLayer(undefined)}><X size={15} /></IconButton></div>
        <h2>{layer.title}</h2><p>{layer.description}</p>
        <label className={styles.selectLabel}>Instrument & dataset<select value={dataset?.id} onChange={event => { setVariantId(event.target.value); setRequestedDate(undefined); setArchivePlaying(false); }}>{layer.variants.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
        <div className={styles.observationDate}><span>{observation.loading ? <Loader2 className={styles.spin} size={13} /> : <Radio size={13} />} OBSERVATION DATE</span><strong>{observation.date ? formatDate(observation.date) : "Connecting…"}</strong></div>
        {observation.error && <div className={styles.inlineNotice}>{observation.error}<button onClick={observation.retry}>Retry observation</button></div>}
        {observation.observation?.raw && dataset?.readout && dataset.id !== "smapSmSalinity8Day" && <div className={styles.legend}><div style={{ background: `linear-gradient(90deg, ${layer.palette.join(",")})` }} /><p><span>{formatMeasurement({ value: dataset.readout.bottom ?? 0, units: dataset.readout.units || "mm/day", precision: 1, fraction: 0 }, celsius)}</span><span>{formatMeasurement({ value: (dataset.readout.bottom ?? 0) + (dataset.readout.variation ?? 200), units: dataset.readout.units || "mm/day", precision: 1, fraction: 1 }, celsius)}</span></p></div>}
        {observation.observation?.raw && dataset?.id === "smapSmSalinity8Day" && <div className={styles.legend}><div style={{ background: `linear-gradient(90deg, ${layer.palette.join(",")})` }} /><p><span>Soil: 0 cm³/cm³</span><span>0.6 cm³/cm³</span></p><p><span>Ocean: 30 psu</span><span>40 psu</span></p></div>}
        {observation.observation?.coloredByNASA && dataset && GIBS_LEGENDS[dataset.id] && <Image className={styles.nasaLegend} unoptimized width={378} height={86} src={`https://gibs.earthdata.nasa.gov/legends/${GIBS_LEGENDS[dataset.id]}_H.png`} alt={`${layer.title}: NASA color scale and units`} />}
        <label className={styles.rangeLabel}>Layer opacity<span>{Math.round(opacity * 100)}%</span><input type="range" min="0" max="1" step=".01" value={opacity} onChange={event => setOpacity(Number(event.target.value))} /></label>
        <p className={styles.footnote}>{observation.observation?.raw ? "Click the globe for a measured value. Unobserved areas stay transparent." : "NASA imagery. Gaps can occur where observations are unavailable."}</p>
        {!!dataset?.missions?.length && <div className={styles.related}>{dataset.missions.map(id => { const mission = data.missions.find(item => item.target_entity === id); return mission && <button key={id} onClick={() => chooseMission(mission)}><Satellite size={12} />{mission.title}</button>; })}</div>}
      </section>}
      {!layer && selectedMission && <section className={styles.insight} data-expanded={infoExpanded} aria-label="Mission details">
        <div className={styles.insightHeader}><button className={styles.detailToggle} aria-label="Toggle mission details" aria-expanded={infoExpanded} onClick={() => setInfoExpanded(value => !value)}><span className={styles.eyebrow}>SATELLITE PROFILE</span><ChevronDown size={14} /></button><IconButton label="Deselect spacecraft" onClick={() => { setMissionId(null); setInspector(false); setFollow(false); commands.current?.reset(); }}><X size={15} /></IconButton></div>
        <h2>{selectedMission.title}</h2><p className={styles.missionDescription}>{plainText(selectedMission.description)}</p>
        <div className={styles.missionStats}><div><span>LAUNCHED</span><strong>{selectedMission.launch_date}</strong></div><div><span>STATUS</span><strong>{missionStatus(selectedMission, data.dataUpdatedAt || clock || 0)}</strong></div>{position && <><div><span>ALTITUDE</span><strong>{Math.round(position.altitude).toLocaleString()} <small>km</small></strong></div><div><span>VELOCITY</span><strong>{position.speed.toFixed(2)} <small>km/s</small></strong></div></>}</div>
        {!position && <p className={styles.footnote}>{data.orbits.isPending ? "Loading orbital elements…" : tle ? "No orbit is drawn this far from the available elements. Return to Now for tracking." : "Orbital tracking is not available for this mission."}</p>}
        {tle && Number.isFinite(tleEpoch(tle.line1)) && <p className={styles.footnote}>SGP4 estimate · {tle.source} · Elements {new Date(tleEpoch(tle.line1)).toISOString().slice(0, 10)}</p>}
        <div className={styles.buttonPair}><button disabled={!position} onClick={() => { setInspector(false); setFollow(value => !value); }}>{follow ? <Check size={14} /> : <Crosshair size={14} />}{follow ? "Following" : "Follow orbit"}</button><button onClick={() => { setInspector(value => !value); setFollow(false); }}>{inspector ? <Earth size={14} /> : <Expand size={14} />}{inspector ? "Earth view" : "Inspect in 3D"}</button></div>
        {inspector && <><p className={styles.modelCredit}>{modelStatus === "ready" ? "NASA / JPL 3D model" : modelStatus === "loading" && spacecraftAsset(selectedMission.target_entity) ? "Loading NASA 3D model…" : "Schematic model · detailed asset unavailable"}<span>Drag to rotate · Scroll to zoom</span></p><label className={styles.selectLabel}>Compare size<select value={comparison} disabled={!MISSION_SPANS[selectedMission.target_entity]} onChange={event => setComparison(event.target.value as typeof comparison)}><option value="none">No comparison</option><option value="person">Person · 1.7 m</option><option value="bus">School bus · 12 m</option></select></label><p className={styles.footnote}>{MISSION_SPANS[selectedMission.target_entity] ? `Approximate spacecraft span: ${MISSION_SPANS[selectedMission.target_entity]} m.` : "Size comparison unavailable for this mission."}</p></>}
        {missionUrl(selectedMission.url) && <a className={styles.sourceLink} href={missionUrl(selectedMission.url)!} target="_blank" rel="noopener noreferrer">Mission at NASA<ArrowUpRight size={13} /></a>}
      </section>}
      {currentEvent && !layer && <section className={styles.insight}><span className={styles.eyebrow}>NASA EONET</span><h2>{currentEvent.title}</h2><p>Latest mapped observation: {formatDate(currentEvent.date.slice(0, 10))}</p><p>{currentEvent.point.latitude.toFixed(2)}°, {currentEvent.point.longitude.toFixed(2)}°</p><button className={styles.primaryButton} onClick={() => { chooseLayer(SCIENCE_LAYERS[0]); setRequestedDate(currentEvent.date.slice(0, 10)); }}>See satellite imagery<Layers3 size={14} /></button><Link className={styles.sourceLink} href={`/events/${currentEvent.id}`}>Event details<ArrowUpRight size={14} /></Link></section>}
      {tourStep !== null && <section className={styles.tourCard}><div><span className={styles.eyebrow}>FIELD GUIDE · {tourStep + 1} / {FIELD_GUIDE.length}</span><IconButton label="Close field guide" onClick={() => setTourStep(null)}><X size={15} /></IconButton></div><h2>{FIELD_GUIDE[tourStep].title}</h2><p>{FIELD_GUIDE[tourStep].text}</p><div><button disabled={tourStep === 0} onClick={() => guide(tourStep - 1)}><ArrowLeft size={15} /> Back</button><span>{FIELD_GUIDE.map((_, i) => <i key={i} data-active={i === tourStep} />)}</span><button onClick={() => tourStep === FIELD_GUIDE.length - 1 ? setTourStep(null) : guide(tourStep + 1)}>{tourStep === FIELD_GUIDE.length - 1 ? "Keep exploring" : "Next"}<ArrowRight size={15} /></button></div></section>}
      <div className={styles.mapTools} aria-label="Camera controls"><IconButton label="Zoom in" onClick={() => commands.current?.zoom(.8)}><Plus size={19} /></IconButton><IconButton label="Zoom out" onClick={() => commands.current?.zoom(1.25)}><Minus size={19} /></IconButton><IconButton label="Reset camera" onClick={() => { setFollow(false); commands.current?.reset(); }}><RotateCcw size={17} /></IconButton><IconButton label="Toggle sunlight and night lights" active={dayNight} onClick={() => setDayNight(value => !value)}><Sun size={18} /></IconButton><IconButton label="Toggle geographic grid" active={showGrid} onClick={() => setShowGrid(value => !value)}><Grid2X2 size={17} /></IconButton><IconButton label="Download globe image" disabled={!ready} onClick={() => commands.current?.snapshot()}><Download size={17} /></IconButton><IconButton label="Explorer help" onClick={() => setHelp(true)}><CircleHelp size={18} /></IconButton></div>
      <div className={styles.readout}><Focus size={13} /><span>{pointLabel}</span>{point && layer && <strong>{reading ? formatMeasurement(reading, celsius) : observation.observation?.raw ? "No observation here" : "Imagery layer"}</strong>}</div>
      {(!ready || sceneError) && <div className={styles.sceneStatus} role="status">{sceneError ? <><p>{sceneError}</p><button onClick={() => { setSceneError(null); setReady(false); setSceneVersion(value => value + 1); }}>Reload scene</button></> : <><span className={styles.loadingOrbit}><Earth size={24} /></span><p>Bringing Earth into view…</p></>}</div>}
      {observation.loading && ready && <div className={styles.dataLoading} role="status"><Loader2 size={14} className={styles.spin} />Loading observation{observation.date ? ` · ${formatDate(observation.date)}` : "…"}</div>}
      {notice && <div className={styles.toast} role="status"><Check size={16} /><span>{notice}</span><button aria-label="Dismiss notification" onClick={() => setNotice(null)}><X size={15} /></button></div>}
      <section className={styles.vitalBar} aria-label="Quick Earth science layers">
        <button className={styles.vitalTitle} onClick={() => setPanel(panel === "layers" ? null : "layers")}><Layers3 size={17} /><span>Vital signs</span></button>
        <IconButton label="Scroll vital signs left" onClick={() => vitalStrip.current?.scrollBy({ left: -320, behavior: reduced ? "instant" : "smooth" })}><ChevronLeft size={19} /></IconButton>
        <div ref={vitalStrip} className={styles.vitalStrip}>
          <button aria-pressed={!layer} onClick={goLive}><span className={styles.marbleOrb} />Satellites Now</button>
          {SCIENCE_LAYERS.map(item => <button key={item.id} aria-pressed={layer?.id === item.id} onClick={() => chooseLayer(item)}><span style={{ background: `radial-gradient(circle at 30% 25%, ${item.palette[3]}, ${item.palette[1]} 55%, #000)` }} />{item.title}</button>)}
        </div>
        <IconButton label="Scroll vital signs right" onClick={() => vitalStrip.current?.scrollBy({ left: 320, behavior: reduced ? "instant" : "smooth" })}><ChevronRight size={19} /></IconButton>
      </section>
      <footer className={styles.timeline}>
        <div className={styles.timelineMain}>
          <button className={styles.playButton} aria-label={layer ? archivePlaying ? "Pause observations" : "Play observations" : playing ? "Pause orbital time" : "Play orbital time"} disabled={!!layer && (!observation.dates.length || !!observation.error)} onClick={() => { if (layer) { if (dateIndex === observation.dates.length - 1) setRequestedDate(observation.dates[Math.max(0, dateIndex - 30)]); setArchivePlaying(value => !value); } else { setLiveClock(false); setPlaying(value => !value); } }}>{(layer ? archivePlaying : playing) ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}</button>
          <div className={styles.clock}><span>{layer ? "OBSERVATION ARCHIVE" : liveClock && playing ? "LIVE ORBIT CLOCK" : "ORBIT SIMULATION"} <i /></span><label><input aria-label={layer ? "Observation date" : "Orbit date in UTC"} type="date" value={layer ? observation.date || "" : clock ? new Date(clock).toISOString().slice(0, 10) : ""} min={layer ? observation.dates[0] : "1998-11-20"} max={layer ? observation.dates.at(-1) : undefined} onChange={event => { if (!validDate(event.target.value)) return; if (layer) { setRequestedDate(event.target.value); setArchivePlaying(false); } else setTime(Date.parse(event.target.value + "T12:00:00Z")); }} />{!layer && <span>{clock ? new Date(clock).toISOString().slice(11, 19) : "--:--:--"} UTC</span>}</label></div>
          <div className={styles.scrubber}><input aria-label={layer ? "Scrub available observations" : "Time of day in UTC"} type="range" min="0" max={layer ? Math.max(0, observation.dates.length - 1) : 1439} step="1" value={layer ? Math.max(0, dateIndex) : clock ? Math.floor((clock % 86400000) / 60000) : 0} disabled={!!layer && !observation.dates.length} onChange={event => { if (layer) { setRequestedDate(observation.dates[Number(event.target.value)]); setArchivePlaying(false); } else if (clock) setTime(Math.floor(clock / 86400000) * 86400000 + Number(event.target.value) * 60000); }} /><div><span>{layer ? observation.dates[0]?.slice(0, 7) : "00:00"}</span><span>{layer ? `${observation.dates.length.toLocaleString()} available observations` : "06:00　　　　12:00　　　　18:00"}</span><span>{layer ? observation.dates.at(-1)?.slice(0, 7) : "23:59"}</span></div></div>
          {layer ? <div className={styles.timeActions}><IconButton label="Previous observation" disabled={dateIndex <= 0} onClick={() => stepDate(-1)}><ChevronLeft size={18} /></IconButton><IconButton label="Next observation" disabled={dateIndex >= observation.dates.length - 1} onClick={() => stepDate(1)}><ChevronRight size={18} /></IconButton></div> : <label className={styles.speed}><span>PLAYBACK</span><select aria-label="Orbit playback speed" value={rate} onChange={event => { setRate(Number(event.target.value)); setLiveClock(false); }}><option value={-3600}>−1 h / sec</option><option value={-60}>−1 min / sec</option><option value={1}>Real time</option><option value={60}>1 min / sec</option><option value={600}>10 min / sec</option><option value={3600}>1 h / sec</option></select></label>}
          <button className={styles.nowButton} onClick={syncNow}><span /> {layer ? "Latest" : "Now"}</button>
        </div>
        <div className={styles.timelineFooter}><span>EARTHSPHERE <i>/</i> {layer ? "NASA / JPL science archive · NASA GIBS" : "NASA Blue Marble · CelesTrak / TLE API"}</span><span>{layer ? "Archive playback skips missing observations" : "Positions are computed estimates"}<button onClick={() => setHelp(true)}>Controls & sources <ArrowUpRight size={10} /></button></span></div>
      </footer>
    </div>
    <Dialog open={help} onClose={() => setHelp(false)} title="Explorer controls and data sources" wide><div className={styles.help}><span className={styles.eyebrow}>WELCOME ABOARD</span><h2>Your world. A new perspective.</h2><p>EarthSphere’s independent 3D explorer uses NASA’s public science datasets and mission catalog. Everything here is rendered in EarthSphere.</p><div className={styles.helpGrid}><section><h3>Find your bearings</h3><p>Drag or swipe to orbit. Scroll or pinch to zoom. Focus the globe and use the arrow keys to rotate, + / − to zoom, or 0 to reset.</p><p>Select a spacecraft to follow its orbit or inspect its NASA/JPL 3D model. A schematic appears while a model loads, or when a detailed model is unavailable. Orbit paths and ground tracks are available in View settings.</p><div className={styles.directionButtons}>{[{ label: "North pole", point: { latitude: 89, longitude: 0 }, icon: ArrowUp }, { label: "South pole", point: { latitude: -89, longitude: 0 }, icon: ArrowDown }, { label: "Eastern hemisphere", point: { latitude: 20, longitude: 90 }, icon: ArrowRight }, { label: "Western hemisphere", point: { latitude: 20, longitude: -90 }, icon: ArrowLeft }].map(item => <button key={item.label} onClick={() => { setHelp(false); commands.current?.flyTo(item.point, 3.3); }}><item.icon size={14} />{item.label}</button>)}</div></section><section><h3>Read the planet</h3><p>Vital signs contains {scienceCount} datasets. Dates come from each source’s availability record. The timeline skips missing days; Latest jumps to the newest available observation.</p><p>Numeric layers use EarthSphere’s color scales. Click an observed point for its value. GIBS imagery uses NASA’s colors. These maps are observations, not forecasts.</p><p>Orbit estimates use current TLE elements and are hidden more than 14 days from their epoch. NASA/JPL provides the detailed models. Orbit-view spacecraft are enlarged for visibility; size comparisons use approximate overall dimensions.</p></section></div><div className={styles.sourceLinks}><a href="https://eyes.nasa.gov/apps/earth/#/" target="_blank" rel="noopener noreferrer">NASA / JPL science archive<ArrowUpRight size={13} /></a><a href="https://www.earthdata.nasa.gov/data/tools/gibs" target="_blank" rel="noopener noreferrer">NASA GIBS<ArrowUpRight size={13} /></a><a href="https://eonet.gsfc.nasa.gov/" target="_blank" rel="noopener noreferrer">NASA EONET<ArrowUpRight size={13} /></a><a href="https://celestrak.org/" target="_blank" rel="noopener noreferrer">CelesTrak<ArrowUpRight size={13} /></a><a href="https://tle.ivanstanojevic.me/" target="_blank" rel="noopener noreferrer">Orbital elements<ArrowUpRight size={13} /></a></div></div></Dialog>
    <Dialog open={!!currentStory} onClose={() => setStoryIndex(null)} title={currentStory?.title || "NASA science story"} wide>{currentStory && <div className={styles.storyPlayer}><span className={styles.eyebrow}>NASA SCIENCE VISUALIZATION · {currentStory.topic}</span><h2>{currentStory.title}</h2>{"image" in currentStory ? <Image unoptimized width={1600} height={900} src={`https://eyes.nasa.gov/apps/earth/assets/images/graphics/${currentStory.file}`} alt={currentStory.text} /> : <video key={currentStory.file} controls playsInline preload="metadata" src={`https://eyes.nasa.gov/apps/earth/assets/video/${currentStory.file}`} onError={() => setNotice("This NASA visualization could not load. Try another story.")} />}<p>{currentStory.text}</p><a className={styles.sourceLink} href={`https://eyes.nasa.gov/apps/earth/assets/${"image" in currentStory ? "images/graphics" : "video"}/${currentStory.file}`} target="_blank" rel="noopener noreferrer">Open source media<ArrowUpRight size={13} /></a></div>}</Dialog>
    <Dialog open={!!shareUrl} onClose={() => setShareUrl(null)} title="Share exploration"><div className={styles.help}><h2>Share this perspective.</h2><p>Copy this link to reopen the selected mission and observation.</p><input className={styles.shareInput} aria-label="Exploration link" readOnly value={shareUrl || ""} onFocus={event => event.target.select()} /></div></Dialog>
  </div>;
}
