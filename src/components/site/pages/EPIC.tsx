"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight, Maximize2, Pause, Play } from "lucide-react";
import { useEPIC, useEPICByDate } from "@/hooks/useNasaApi";
import { getEPICImageUrl } from "@/lib/nasa-api";
import type { EPICImageType } from "@/lib/types/nasa";
import { DataState } from "../DataState";
import { NasaImage } from "../NasaImage";
import { Dialog } from "../Dialog";

export default function EPICPage() {
  const [type, setType] = useState<EPICImageType>("natural");
  const [date, setDate] = useState("");
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const latest = useEPIC(type);
  const archive = useEPICByDate(type, date);
  const query = date ? archive : latest;
  const images = query.data || [];
  const frameIndex = images.length ? Math.min(index, images.length - 1) : 0;
  const frame = images[frameIndex];
  const url = frame ? getEPICImageUrl(type, frame.date.slice(0, 10), frame.image) : undefined;
  useEffect(() => { if (!playing || !images.length) return; const timer = setInterval(() => { if (!document.hidden) setIndex(value => (value + 1) % images.length); }, 1200); return () => clearInterval(timer); }, [playing, images.length]);
  return <>
    <div className="es-controls"><div className="es-media-types">{(["natural", "enhanced"] as const).map(value => <button className="es-chip" aria-pressed={value === type} onClick={() => { setType(value); setIndex(0); setPlaying(false); }} key={value}>{value === "natural" ? "Natural color" : "Enhanced color"}</button>)}</div><label className="es-date-label">Observation date<input aria-label="EPIC observation date" type="date" max={new Date().toISOString().slice(0,10)} value={date} onChange={event => { setDate(event.target.value); setIndex(0); setPlaying(false); }} /></label><button className="es-chip" onClick={() => { setDate(""); setIndex(0); }} disabled={!date}>Latest sequence</button></div>
    <DataState loading={query.isPending} error={query.error} empty={!query.isPending && !query.isError && !images.length} retry={() => { void query.refetch(); }} />
    {frame && !query.isError && <div className="es-epic-layout"><div className="es-card es-earth-stage"><NasaImage key={url} src={url} alt={`Earth from DSCOVR at ${frame.date} UTC`} eager /><span className="es-stage-label">DSCOVR / EARTH–SUN L1</span><button className="es-image-expand" aria-label="Enlarge Earth image" onClick={() => setFullscreen(true)}><Maximize2 size={18} /></button></div><aside className="es-card es-epic-panel"><p className="es-kicker">OUR ONLY HOME</p><h2>Earth,<br /><em>in a new light.</em></h2><p>{frame.caption}</p><dl><div><dt>Captured (UTC)</dt><dd>{frame.date}</dd></div><div><dt>Frame</dt><dd>{frameIndex + 1} / {images.length}</dd></div><div><dt>Image center</dt><dd>{frame.centroid_coordinates.lat.toFixed(2)}° latitude<br />{frame.centroid_coordinates.lon.toFixed(2)}° longitude</dd></div></dl><button className="es-button" onClick={() => setPlaying(value => !value)} aria-pressed={playing}>{playing ? <Pause size={15} /> : <Play size={15} />}{playing ? "Pause sequence" : "Play Earth’s rotation"}</button><label className="es-frame-control">Choose a frame<input aria-label="Earth sequence frame" type="range" min={0} max={images.length - 1} value={frameIndex} onChange={event => { setPlaying(false); setIndex(Number(event.target.value)); }} /></label><a href={url} target="_blank" rel="noopener noreferrer">View original image<ArrowUpRight size={13} /></a></aside></div>}
    {!!images.length && <section><div className="es-section-heading"><div><h2>A day on Earth</h2><p>Select any frame in the available sequence.</p></div></div><div className="es-epic-sequence">{images.map((image, i) => { const imageUrl = getEPICImageUrl(type, image.date.slice(0,10), image.image); return <button className="es-card" key={image.identifier} aria-label={`View Earth at ${image.date} UTC`} aria-pressed={i === frameIndex} onClick={() => { setIndex(i); setPlaying(false); }}><NasaImage src={imageUrl} alt={`Earth at ${image.date}`} /><span>{image.date.slice(11)} UTC</span></button>; })}</div></section>}
    <Dialog open={fullscreen} onClose={() => setFullscreen(false)} title="Earth from DSCOVR" wide><NasaImage key={url} src={url} alt="Full view of Earth from DSCOVR" eager /></Dialog>
  </>;
}
