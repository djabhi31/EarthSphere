"use client";
import { useEffect } from "react";
import Link from "next/link";
import { RotateCw, ArrowUpRight, Radio } from "lucide-react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("EarthSphere page error", error); }, [error]);
  return <section className="es-recovery"><div className="es-recovery-orbit" aria-hidden="true"><Radio size={46} strokeWidth={1} /></div><p className="es-kicker">CONNECTION INTERRUPTED</p><h1>A brief pause<br /><em>in discovery.</em></h1><p>This view couldn’t load. Try again, or return to mission control to explore another destination.</p><div><button className="es-button" onClick={reset}><RotateCw size={15} />Try again</button><Link href="/dashboard" className="es-button es-button-secondary">Mission control<ArrowUpRight size={15} /></Link></div></section>;
}
