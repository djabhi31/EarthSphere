import { Radio, RotateCw, Search } from "lucide-react";

export function DataState({ loading = false, error, empty = false, retry, title, children }: { loading?: boolean; error?: Error | null | boolean; empty?: boolean; retry?: () => void; title?: string; children?: React.ReactNode }) {
  if (!loading && !error && !empty) return null;
  const Icon = loading ? Radio : empty ? Search : Radio;
  return <div className="es-data-state" role="status" aria-live="polite">
    <Icon size={29} strokeWidth={1.3} className={loading ? "es-breathe" : undefined} />
    <h3>{title || (loading ? "A moment of discovery…" : error ? "This feed is taking a break." : "Nothing here just yet.")}</h3>
    <p>{children || (loading ? "Connecting to the source and preparing your view." : error ? "We couldn’t retrieve this source. Try again in a moment." : "Try another date, search term, or filter.")}</p>
    {!!error && retry && <button className="es-button es-button-secondary" onClick={retry}><RotateCw size={14} />Try again</button>}
  </div>;
}
