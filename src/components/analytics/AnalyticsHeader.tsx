"use client";
import { ExportPanel } from "@/components/features/ExportPanel";
import type { EONETEvent } from "@/lib/types";
export function AnalyticsHeader({ events }: { events?: readonly EONETEvent[] }) {
  return <div className="es-section-heading" style={{ marginTop: 0 }}><div><h2>A year in observations</h2><p>Recorded events over the last 365 days.</p></div>{events && <ExportPanel events={events} />}</div>;
}
