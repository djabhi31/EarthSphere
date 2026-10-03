"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, ArrowUpRight, ImageIcon, Mic, Play, Search } from "lucide-react";
import { useNASAMedia } from "@/hooks/useNasaApi";
import type { NASAMediaCollectionItem } from "@/lib/types/nasa";
import { DataState } from "./DataState";
import { Dialog } from "./Dialog";
import { NasaImage } from "./NasaImage";
import { playableNasaMedia } from "@/lib/media";

function preview(item: NASAMediaCollectionItem) { return item.links?.find(link => link.rel === "preview")?.href || item.links?.find(link => link.render === "image")?.href; }
function MediaDetail({ item }: { item: NASAMediaCollectionItem }) {
  const data = item.data[0];
  const asset = useQuery<{ collection: { items: { href: string }[] } }>({ queryKey: ["nasa-asset", data.nasa_id], queryFn: async () => { const r = await fetch(`/api/nasa/asset/${encodeURIComponent(data.nasa_id)}`); if (!r.ok) throw new Error("Media unavailable"); return r.json(); }, enabled: data.media_type !== "image", staleTime: 3600000, retry: 1 });
  const playable = playableNasaMedia(asset.data?.collection.items.map(item => item.href) || [], data.media_type);
  return <><div className="es-media-stage">{data.media_type === "image" ? <NasaImage key={preview(item)} src={preview(item)} alt={data.title} eager /> : playable ? data.media_type === "video" ? <video controls src={playable} poster={preview(item)} preload="metadata" aria-label={data.title} /> : <div className="es-audio-player"><Mic size={48} /><audio controls src={playable} preload="metadata" aria-label={data.title} /></div> : <DataState loading={asset.isPending} error={asset.isError} empty={!asset.isPending && !asset.isError} retry={() => { void asset.refetch(); }} title={asset.isPending ? "Preparing your media…" : "Preview unavailable"}>You can also view this item in NASA’s media library.</DataState>}</div><div className="es-detail-copy"><p className="es-kicker">{data.center || "NASA"} / {data.media_type}</p><h2>{data.title}</h2><p>{data.description?.replace(/<[^>]*>/g, " ")}</p><a className="es-button es-button-secondary" href={`https://images.nasa.gov/details/${encodeURIComponent(data.nasa_id)}`} target="_blank" rel="noopener noreferrer">Open original at NASA <ArrowUpRight size={14} /></a></div></>;
}

export function MediaCollection({ mars = false }: { mars?: boolean }) {
  const [term, setTerm] = useState(mars ? "Mars Perseverance landscape" : "nebula");
  const [draft, setDraft] = useState(term);
  const [type, setType] = useState<"image" | "video" | "audio">("image");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<NASAMediaCollectionItem | null>(null);
  const query = useNASAMedia({ q: term, media_type: type, page, page_size: 24 });
  const items = query.data?.collection.items ?? [];
  const total = query.data?.collection.metadata?.total_hits ?? 0;
  const presets = mars ? ["Mars Perseverance landscape", "Mars Curiosity panorama", "Mars surface", "Mars Ingenuity"] : ["nebula", "Earth from space", "Artemis", "James Webb", "Apollo"];
  const choose = (value: string) => { setTerm(value); setDraft(value); setPage(1); };
  return <>
    <form className="es-controls es-media-controls" onSubmit={event => { event.preventDefault(); if (draft.trim()) choose(draft.trim()); }}><label className="es-collection-search"><Search size={18} /><input aria-label={mars ? "Search Mars imagery" : "Search NASA media"} value={draft} onChange={event => setDraft(event.target.value)} placeholder="What would you like to discover?" /></label><button className="es-button" disabled={!draft.trim()}>Search<ArrowRight size={14} /></button>{!mars && <div className="es-media-types">{([['image', ImageIcon], ['video', Play], ['audio', Mic]] as const).map(([value, Icon]) => <button type="button" key={value} aria-pressed={type === value} className="es-chip" onClick={() => { setType(value); setPage(1); }}><Icon size={14} />{value}</button>)}</div>}</form>
    <div className="es-preset-row"><span>{mars ? "EXPLORE MARS" : "A LITTLE INSPIRATION"}</span>{presets.map(value => <button key={value} className="es-chip" aria-pressed={term === value} onClick={() => choose(value)}>{value.replace("Mars ", "")}</button>)}</div>
    {mars && <p className="es-collection-note">A curated search of NASA’s media archive, including mission photography and illustrations. Each item includes its original caption and source.</p>}
    <div className="es-section-heading"><div><h2>{mars ? "Postcards from another world" : "A collection worth exploring"}</h2><p>{query.isPending ? "Connecting to NASA…" : query.isError ? "Source unavailable" : `${total.toLocaleString()} results · Page ${page}`}</p></div><span className="es-source">NASA IMAGE & VIDEO LIBRARY</span></div>
    <DataState loading={query.isPending} error={query.error} empty={!query.isPending && !query.isError && !items.length} retry={() => { void query.refetch(); }} />
    {!query.isError && <div className="es-editorial-gallery" aria-busy={query.isFetching}>{items.filter(item => item.data?.[0]).map(item => <button key={item.data[0].nasa_id} className="es-card es-gallery-card" onClick={() => setSelected(item)}><div><NasaImage key={preview(item)} src={preview(item)} alt={item.data[0].title} /></div><div className="es-card-padding"><small>{item.data[0].center || "NASA"} / {item.data[0].media_type.toUpperCase()}</small><h3>{item.data[0].title}</h3><p>{item.data[0].date_created?.slice(0, 10)}<ArrowUpRight size={15} /></p></div></button>)}</div>}
    {!query.isError && total > 24 && <nav className="es-pagination" aria-label="Media pages"><button className="es-button es-button-secondary" disabled={page === 1 || query.isFetching} onClick={() => setPage(p => p - 1)}><ArrowLeft size={14} />Previous</button><span>Page {page} of {Math.ceil(total / 24)}</span><button className="es-button es-button-secondary" disabled={page * 24 >= total || query.isFetching} onClick={() => setPage(p => p + 1)}>Next<ArrowRight size={14} /></button></nav>}
    <Dialog open={!!selected} onClose={() => setSelected(null)} title={selected?.data[0].title || "NASA media"} wide>{selected && <MediaDetail item={selected} />}</Dialog>
  </>;
}
