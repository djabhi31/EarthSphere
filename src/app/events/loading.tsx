import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loading state for Events page.
 */
export default function EventsLoading() {
  return (
    <div className="min-h-screen pt-24 pb-32 bg-canvas">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Skeleton */}
        <div className="mb-8 space-y-4">
          <Skeleton className="h-10 w-64 bg-surface" />
          <Skeleton className="h-4 w-96 bg-surface" />
        </div>

        {/* Filters Skeleton */}
        <div className="glass rounded-2xl p-4 mb-8 flex flex-col gap-4 border border-border">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-32 rounded-full bg-surface" />
            ))}
          </div>
          <div className="flex gap-4 items-center">
            <Skeleton className="h-10 flex-1 max-w-sm rounded-full bg-surface" />
            <Skeleton className="h-10 w-24 bg-surface" />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass rounded-3xl p-5 flex flex-col h-[280px] border border-border">
              <div className="flex justify-between items-start mb-4">
                <Skeleton className="h-6 w-24 rounded-full bg-surface" />
                <Skeleton className="h-6 w-20 rounded-full bg-surface" />
              </div>
              <Skeleton className="h-8 w-3/4 mb-4 bg-surface" />
              <Skeleton className="h-4 w-1/2 mb-auto bg-surface" />
              <div className="pt-4 mt-auto border-t border-border">
                <Skeleton className="h-6 w-full rounded-full bg-surface" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
