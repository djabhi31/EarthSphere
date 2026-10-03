import Link from "next/link";
import { ArrowUpRight, Orbit } from "lucide-react";

export default function NotFound() {
  return <section className="es-recovery"><div className="es-recovery-orbit" aria-hidden="true"><Orbit size={60} strokeWidth={.8} /></div><p className="es-kicker">404 / UNCHARTED TERRITORY</p><h1>A little<br /><em>off course.</em></h1><p>We couldn’t find this destination. There’s still a whole world to discover.</p><div><Link href="/" className="es-button">Return to Earth<ArrowUpRight size={15} /></Link><Link href="/dashboard" className="es-button es-button-secondary">Mission control<ArrowUpRight size={15} /></Link></div></section>;
}
