"use client";

import { useMemo, useState } from "react";
import { LocateFixed, Loader2, Route } from "lucide-react";
import type { EONETEvent } from "@/lib/types";
import { distanceKm, recordedMovement } from "@/lib/map-observatory";
import styles from "./observatory.module.css";

const CITIES = [
  { name: "New Delhi", point: [77.209, 28.6139] },
  { name: "Tokyo", point: [139.6503, 35.6762] },
  { name: "London", point: [-.1278, 51.5074] },
  { name: "New York", point: [-74.006, 40.7128] },
  { name: "Sydney", point: [151.2093, -33.8688] },
  { name: "Los Angeles", point: [-118.2437, 34.0522] },
] as const;

export function EventAnalysis({ event, date, point, polygon }: { event: EONETEvent; date: string; point: [number, number]; polygon: boolean }) {
  const [city, setCity] = useState("New Delhi"), [location, setLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false), [error, setError] = useState("");
  const movement = useMemo(() => recordedMovement(event, date), [event, date]);
  const origin = city === "Your location" ? location : CITIES.find(item => item.name === city)?.point;
  const distance = origin ? distanceKm([origin[0], origin[1]], point) : null;
  function locate() {
    if (!navigator.geolocation) { setError("Location access is unavailable. Choose a city instead."); return; }
    setLocating(true); setError("");
    navigator.geolocation.getCurrentPosition(result => {
      setLocation([result.coords.longitude, result.coords.latitude]); setCity("Your location"); setLocating(false);
    }, () => { setLocating(false); setError("Could not access your location. You can choose a city instead."); }, { timeout: 10000, maximumAge: 60000 });
  }
  return <div className={styles.analysisContent}>
    {movement && <div className={styles.movement}><h3><Route size={13} />Recorded movement</h3><div><strong>{movement.km.toLocaleString("en", { maximumFractionDigits: 0 })}<small>km traveled</small></strong><strong>{(movement.durationHours / 24).toLocaleString("en", { maximumFractionDigits: 1 })}<small>days observed</small></strong></div><p>Between {movement.count} recorded positions up to this date.</p></div>}
    <label className={styles.citySelect}>Distance from<select aria-label="City for distance measurement" value={city} onChange={e => { setCity(e.target.value); setError(""); }}>{CITIES.map(item => <option key={item.name}>{item.name}</option>)}{location && <option>Your location</option>}</select></label>
    {distance !== null && <div className={styles.distanceResult}><strong>{distance.toLocaleString("en", { maximumFractionDigits: 0 })}<small>km</small></strong><span>{polygon ? "To the approximate area center" : "Great-circle distance to this observation"}</span></div>}
    <button className={styles.locate} onClick={locate} disabled={locating}>{locating ? <Loader2 size={13} className={styles.spin} /> : <LocateFixed size={13} />}{locating ? "Finding your location…" : "Use my location"}</button>
    {error && <p className={styles.errorText} role="alert">{error}</p>}
  </div>;
}
