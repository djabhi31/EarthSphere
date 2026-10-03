"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Compass, Globe2, Orbit, Search, Sun, X } from "lucide-react";
import { useAPODSingle, useDONKISolarFlares, useNeoFeed } from "@/hooks/useNasaApi";
import { useEvents } from "@/hooks/useEvents";
import { AIBriefingModal } from "@/components/features/AIBriefingModal";
import { DESTINATIONS } from "../catalog";
import { DataState } from "../DataState";
import { NasaImage } from "../NasaImage";
import styles from "./dashboard.module.css";

function dateOffset(days: number) { const date = new Date(); date.setUTCDate(date.getUTCDate() + days); return date.toISOString().slice(0,10); }
export default function DashboardPage() {
  const [briefing, setBriefing] = useState(false), [group, setGroup] = useState("All"), [search, setSearch] = useState("");
  const photo = useAPODSingle();
  const earth = useEvents({ status: "open", limit: 80 });
  const neo = useNeoFeed(dateOffset(0), dateOffset(6));
  const sun = useDONKISolarFlares(dateOffset(-30), dateOffset(0));
  const modules = [
    { title: "A living planet", href: "/events", label: "Open natural events in this sample", count: earth.data?.events.length, error: earth.isError, loading: earth.isPending, icon: Globe2, detail: "NASA EONET · UP TO 80 RECORDS" },
    { title: "Our cosmic neighborhood", href: "/asteroids", label: "Objects approaching in the next 7 days", count: neo.data?.element_count, error: neo.isError, loading: neo.isPending, icon: Orbit, detail: "NASA / JPL · NEOWS" },
    { title: "The Sun’s activity", href: "/space-weather", label: "Solar flares recorded over the last 30 days", count: sun.data?.length, error: sun.isError, loading: sun.isPending, icon: Sun, detail: "NASA · DONKI" },
  ];
  const destinations = useMemo(() => DESTINATIONS.filter(item => !["/dashboard", "/about"].includes(item.href) && (group === "All" || item.group === group) && `${item.label} ${item.description}`.toLowerCase().includes(search.trim().toLowerCase())), [group, search]);
  return <div className={styles.dashboard}>
    <div className={styles.heading}><div><p>THE LATEST AVAILABLE OBSERVATIONS</p><h2>Your window into the extraordinary.</h2></div><span><i />CONNECTED TO OPEN SCIENCE</span></div>
    <div className={styles.overview}><article className={styles.picture}><DataState loading={photo.isPending} error={photo.error} retry={() => { void photo.refetch(); }} />{photo.data && !photo.isError && <><NasaImage key={photo.data.url} src={photo.data.media_type === "image" ? photo.data.url : photo.data.thumbnail_url} alt={photo.data.title} eager /><div className={styles.pictureTop}><span>01 / TODAY’S PERSPECTIVE</span><span>{photo.data.date}</span></div><div className={styles.pictureCopy}><span>ASTRONOMY PICTURE OF THE DAY</span><h2>{photo.data.title}</h2><Link href="/apod">Discover the story<ArrowUpRight size={21} /></Link></div></>}</article><div className={styles.stats}>{modules.map(module => <Link href={module.href} className={styles.stat} key={module.href}><div><module.icon size={18} strokeWidth={1.3} /><span>{module.detail}</span><ArrowUpRight size={14} /></div><h3>{module.title}</h3><div><strong>{module.loading || module.error || module.count === undefined ? "—" : module.count.toLocaleString()}</strong><p>{module.error ? "Source unavailable · Open for details" : module.loading ? "Connecting to the source…" : module.label}</p></div></Link>)}</div></div>
    <div className={styles.briefing}><div><Compass size={20} strokeWidth={1.2} /><p>Put the planet’s latest events into perspective.</p></div><button disabled={earth.isPending || earth.isError} onClick={() => setBriefing(true)}>Open event briefing<ArrowUpRight size={14} /></button></div>
    <AIBriefingModal events={earth.data?.events || []} isOpen={briefing} onClose={() => setBriefing(false)} />
    <Link href="/explore" className={styles.globeFeature}><div className={styles.featureEarth}><NasaImage src="/images/landing/earth-portrait.webp" alt="Earth seen from space" /></div><div><p>A CHANGE OF PERSPECTIVE</p><h2>A world of detail.<br /><em>One extraordinary planet.</em></h2><span>Step into the 3D Earth explorer<ArrowUpRight size={23} /></span></div><i>DRAG. ORBIT. DISCOVER.</i></Link>
    <section className={styles.directory} aria-labelledby="destination-heading"><div className={styles.heading}><div><p>WHERE WILL CURIOSITY TAKE YOU?</p><h2 id="destination-heading">Find your next discovery.</h2></div><span>{destinations.length} destinations</span></div><div className={styles.directoryControls}><div aria-label="Destination categories">{["All", "Earth", "Space", "Discover"].map(value => <button key={value} aria-pressed={group === value} onClick={() => setGroup(value)}>{value === "All" ? "All destinations" : value}</button>)}</div><label><Search size={15} /><input aria-label="Search destinations" placeholder="Find something to explore…" value={search} onChange={event => setSearch(event.target.value)} />{search && <button aria-label="Clear destination search" onClick={() => setSearch("")}><X size={13} /></button>}</label></div><div className={styles.destinations}>{destinations.map(item => <Link href={item.href} key={item.href}><div><item.icon size={26} strokeWidth={1.15} /><ArrowUpRight size={16} /></div><small>{item.group}</small><h3>{item.label}</h3><p>{item.description}</p></Link>)}</div>{!destinations.length && <div className={styles.noResults}><p>No destinations match that search.</p><button onClick={() => { setSearch(""); setGroup("All"); }}>Show all destinations<ArrowRight size={14} /></button></div>}</section>
    <div className={styles.platforms}><span>EXPLORE OTHER PERSPECTIVES</span><a href="https://godseyeview.earthsphere.in" target="_blank" rel="noopener noreferrer">God’s Eye View<ArrowUpRight size={15} /></a><a href="https://worldmonitor.earthsphere.in" target="_blank" rel="noopener noreferrer">World Monitor<ArrowUpRight size={15} /></a><a href="https://eyes.nasa.gov/apps/earth/#/" target="_blank" rel="noopener noreferrer">NASA Eyes on Earth<ArrowUpRight size={15} /></a></div>
  </div>;
}
