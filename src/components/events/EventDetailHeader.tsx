"use client";
import Link from "next/link";
import { ArrowLeft, Clock, Layers } from "lucide-react";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getCategoryColor, getCategoryLabel, getEventStatus } from "@/lib/utils";
import type { EONETEvent } from "@/lib/types";
export function EventDetailHeader({ event, duration }: { event: EONETEvent; duration: string }) {
  const category = event.categories[0]?.id || 'manmade';
  return <header className="es-event-detail-header"><Link href="/events" className="es-breadcrumb"><ArrowLeft size={14} />All Earth observations</Link><p className="es-kicker"><CategoryIcon categoryId={category} size={17} />{getCategoryLabel(category)} / NASA EONET</p><h1>{event.title}</h1>{event.description && <p className="es-detail-description">{event.description}</p>}<div className="es-event-badges"><StatusBadge status={getEventStatus(event)} closedDate={event.closed || undefined} /><span><Clock size={13} />{duration}</span><span><Layers size={13} />{event.geometry.length} recorded observations</span><span style={{ color: getCategoryColor(category) }}>{event.id}</span></div></header>;
}
