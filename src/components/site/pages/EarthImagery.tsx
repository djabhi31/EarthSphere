"use client";
import { useState } from "react";
import { ArrowUpRight, Globe2, Maximize2, Search } from "lucide-react";
import { imageryRequest, type IMAGERY_LAYERS } from "@/lib/imagery";
import { NasaImage } from "../NasaImage";
import { Dialog } from "../Dialog";

const PLACES = [{ name: "The Himalayas", lat: 28, lon: 86.9 }, { name: "The Nile", lat: 29.4, lon: 31.3 }, { name: "Amazon basin", lat: -3.5, lon: -62.2 }, { name: "Great Barrier Reef", lat: -18.3, lon: 147.7 }, { name: "Western Europe", lat: 48.8, lon: 2.3 }, { name: "California", lat: 36.5, lon: -119.5 }];
function yesterday() { const date = new Date(); date.setUTCDate(date.getUTCDate() - 1); return date.toISOString().slice(0, 10); }
export default function EarthImageryPage() {
  const [lat, setLat] = useState("28");
  const [lon, setLon] = useState("86.9");
  const [date, setDate] = useState(yesterday);
  const [layer, setLayer] = useState<keyof typeof IMAGERY_LAYERS>("terra");
  const [span, setSpan] = useState(4);
  const [result, setResult] = useState({ lat: 28, lon: 86.9, date: yesterday(), span: 4, layer: "terra" as keyof typeof IMAGERY_LAYERS, title: "The Himalayas" });
  const [error, setError] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const image = imageryRequest(result.lat, result.lon, result.date, result.span, result.layer);
  const submit = (latitude = Number(lat), longitude = Number(lon), title = "Your view of Earth") => {
    if ((title === "Your view of Earth" && (!lat.trim() || !lon.trim())) || !imageryRequest(latitude, longitude, date, span, layer)) { setError("Enter a latitude from −90 to 90, a longitude from −180 to 180, and a valid date."); return; }
    setError(""); setResult({ lat: latitude, lon: longitude, date, span, layer, title });
  };
  return <>
    <div className="es-preset-row"><span>START SOMEWHERE EXTRAORDINARY</span>{PLACES.map(place => <button className="es-chip" key={place.name} aria-pressed={result.title === place.name} onClick={() => { setLat(String(place.lat)); setLon(String(place.lon)); submit(place.lat, place.lon, place.name); }}>{place.name}</button>)}</div>
    <form className="es-imagery-controls es-card" onSubmit={event => { event.preventDefault(); submit(); }}><label>Latitude<input type="number" aria-label="Latitude" required min={-90} max={90} step="any" value={lat} onChange={event => setLat(event.target.value)} /></label><label>Longitude<input type="number" aria-label="Longitude" required min={-180} max={180} step="any" value={lon} onChange={event => setLon(event.target.value)} /></label><label>Observation date<input type="date" required min="2002-07-04" max={new Date().toISOString().slice(0, 10)} value={date} onChange={event => setDate(event.target.value)} /></label><label>Satellite<select value={layer} onChange={event => setLayer(event.target.value as keyof typeof IMAGERY_LAYERS)}><option value="terra">Terra / MODIS</option><option value="aqua">Aqua / MODIS</option></select></label><label>Field of view<select value={span} onChange={event => setSpan(Number(event.target.value))}><option value={1}>Close view</option><option value={4}>Regional view</option><option value={16}>Continental view</option></select></label><button className="es-button"><Search size={15} />View Earth</button></form>
    {error && <p role="alert" className="es-form-error">{error}</p>}
    <article className="es-card es-imagery-result"><div className="es-image-heading"><div><p className="es-kicker"><Globe2 size={13} />A VIEW FROM ABOVE</p><h2>{result.title}</h2></div><button className="es-button es-button-secondary" onClick={() => setFullscreen(true)}><Maximize2 size={14} />Enlarge</button></div><div className="es-imagery-image"><NasaImage key={image} src={image || undefined} alt={`NASA ${result.layer} satellite composite at ${result.lat} latitude, ${result.lon} longitude, requested for ${result.date}`} eager /></div><div className="es-image-caption"><span>Requested date: {result.date} · {result.layer === "terra" ? "Terra" : "Aqua"} / MODIS true color</span><span>{result.lat.toFixed(3)}° latitude · {result.lon.toFixed(3)}° longitude</span></div></article>
    <div className="es-source-note"><p>Daily imagery can contain clouds, missing swaths, or unavailable dates. This is a satellite composite, not a live camera. Try an earlier date or the other satellite to find a clearer view.</p><a href="https://worldview.earthdata.nasa.gov/" target="_blank" rel="noopener noreferrer">Explore NASA Worldview <ArrowUpRight size={14} /></a></div>
    <Dialog open={fullscreen} onClose={() => setFullscreen(false)} title={result.title} wide><NasaImage src={image || undefined} alt={result.title} eager /></Dialog>
  </>;
}
