"use client";
import { Activity } from "lucide-react";
export interface EventsHeaderProps { eventCount: number; isLoading: boolean }
export function EventsHeader({ eventCount, isLoading }: EventsHeaderProps) {
  return <div className="es-event-summary"><Activity size={15} /><span>{isLoading ? 'Loading observations…' : `${eventCount.toLocaleString()} observations in this view`}</span><span>Curated by NASA EONET</span></div>;
}
