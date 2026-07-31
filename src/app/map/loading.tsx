import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

/**
 * Loading state for the Map page.
 */
export default function MapLoading() {
  return (
    <div className="fixed inset-0 pt-16 bg-canvas flex items-center justify-center">
      <div className="absolute inset-0 pt-16">
        {/* Map Placeholder Grid */}
        <div className="w-full h-full relative overflow-hidden opacity-10 flex flex-wrap">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="w-[12.5%] h-[12.5%] border border-border" />
          ))}
        </div>
      </div>
      
      {/* UI Overlays Skeletons */}
      <div className="absolute top-24 left-6 z-10">
        <Skeleton className="h-12 w-64 rounded-full bg-surface" />
      </div>
      
      <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-3">
        <Skeleton className="h-[88px] w-12 rounded-xl bg-surface" />
        <Skeleton className="h-[120px] w-12 rounded-xl bg-surface" />
      </div>
      
      {/* Center loading indicator */}
      <div className="relative z-10 flex flex-col items-center gap-4 p-6 glass rounded-2xl border border-border shadow-depth-lg">
        <Loader2 className="w-8 h-8 text-electric-cyan animate-spin" />
        <p className="text-text-secondary text-sm font-medium tracking-wide uppercase">Initializing Global Map...</p>
      </div>
    </div>
  );
}
