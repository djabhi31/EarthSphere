import Link from "next/link";
import { ArrowUpRight, MoveUpRight } from "lucide-react";
import { DESTINATIONS, type Destination } from "./catalog";

export function ContentCompanions({ page }: { page: Destination }) {
  const related = DESTINATIONS.filter(item => item.group === page.group && item.href !== page.href && !["/about", "/dashboard"].includes(item.href)).slice(0, 3);
  return <section className="es-companions" aria-label="Continue exploring"><div className="es-companions-heading"><p className="es-kicker">FOLLOW YOUR CURIOSITY</p><h2>There’s always<br /><em>more to discover.</em></h2><Link href="/dashboard">All destinations<ArrowUpRight size={14} /></Link></div><div className="es-companions-links">{related.map((item, i) => <Link href={item.href} key={item.href}><span>{String(i + 1).padStart(2, "0")}</span><item.icon size={23} strokeWidth={1.2} /><div><small>{item.group}</small><h3>{item.label}</h3></div><MoveUpRight size={19} /></Link>)}</div></section>;
}
