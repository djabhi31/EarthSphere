"use client";
import { useState } from "react";
import { ArrowUpRight, CalendarDays, Maximize2, Shuffle } from "lucide-react";
import { useAPOD, useAPODSingle } from "@/hooks/useNasaApi";
import { DataState } from "../DataState";
import { Dialog } from "../Dialog";
import { NasaImage } from "../NasaImage";

export default function APODPage() {
  const [date, setDate] = useState("");
  const [random, setRandom] = useState(false);
  const [fullscreen, setFullscreen] = useState<{ src: string; title: string } | null>(null);
  const daily = useAPODSingle(date || undefined);
  const discoveries = useAPOD({ count: 6, thumbs: true }, random);
  const item = daily.data;
  return <>
    <div className="es-controls"><label className="es-date-label"><CalendarDays size={17} /><span>Travel to a date</span><input aria-label="Astronomy picture date" type="date" min="1995-06-20" max={new Date().toISOString().slice(0, 10)} value={date} onChange={event => setDate(event.target.value)} /></label><button className="es-chip" onClick={() => setDate("")} disabled={!date}>Latest picture</button><button className="es-button es-control-end" disabled={discoveries.isFetching} onClick={() => { setRandom(true); if (random) void discoveries.refetch(); }}><Shuffle size={15} />Surprise me</button></div>
    <DataState loading={daily.isPending} error={daily.error} empty={!daily.isPending && !daily.isError && !item} retry={() => { void daily.refetch(); }} />
    {item && !daily.isError && <article className="es-apod-feature es-card"><div className="es-apod-visual">{item.media_type === "video" ? <div className="es-apod-video"><iframe src={item.url} title={item.title} allow="fullscreen; encrypted-media" allowFullScreen loading="lazy" /><a href={item.url} target="_blank" rel="noopener noreferrer">Open video <ArrowUpRight size={14} /></a></div> : <><NasaImage key={item.url} src={item.url} alt={item.title} eager /><button className="es-image-expand" aria-label="Enlarge astronomy image" onClick={() => setFullscreen({ src: item.hdurl || item.url, title: item.title })}><Maximize2 size={19} /></button></>}</div><div className="es-apod-story"><p className="es-kicker">{item.date} / {item.media_type}</p><h2>{item.title}</h2><p>{item.explanation}</p><div className="es-apod-credit"><span>{item.copyright ? `© ${item.copyright}` : "NASA Astronomy Picture of the Day"}</span><a href={item.hdurl || item.url} target="_blank" rel="noopener noreferrer">View original<ArrowUpRight size={14} /></a></div></div></article>}
    {random && <section><div className="es-section-heading"><div><h2>A little serendipity</h2><p>Six discoveries from NASA’s astronomy archive.</p></div></div><DataState loading={discoveries.isPending} error={discoveries.error} retry={() => { void discoveries.refetch(); }} /><div className="es-grid">{Array.isArray(discoveries.data) && discoveries.data.map(picture => <button className="es-card es-gallery-card" key={picture.date} onClick={() => { setDate(picture.date); window.scrollTo({ top: 0, behavior: "instant" }); }}><div><NasaImage key={picture.url} src={picture.media_type === "image" ? picture.url : picture.thumbnail_url} alt={picture.title} /></div><div className="es-card-padding"><small>{picture.date} / {picture.media_type}</small><h3>{picture.title}</h3><p>Explore this discovery<ArrowUpRight size={14} /></p></div></button>)}</div></section>}
    <Dialog open={!!fullscreen} onClose={() => setFullscreen(null)} title={fullscreen?.title || "Astronomy image"} wide>{fullscreen && <NasaImage src={fullscreen.src} alt={fullscreen.title} eager />}</Dialog>
  </>;
}
