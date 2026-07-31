import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loading state for Analytics page.
 */
export default function AnalyticsLoading() {
  return (
    <div className="min-h-screen pt-24 pb-32 bg-canvas">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-10 w-64 bg-surface" />
          <Skeleton className="h-5 w-96 bg-surface" />
        </div>

        {/* Stats Row Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass p-6 rounded-3xl border border-border">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-12 w-12 rounded-full bg-surface" />
                <Skeleton className="h-4 w-16 bg-surface" />
              </div>
              <Skeleton className="h-8 w-24 mb-2 bg-surface" />
              <Skeleton className="h-4 w-32 bg-surface" />
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass p-6 rounded-3xl h-[400px] flex flex-col border border-border">
              <Skeleton className="h-6 w-48 mb-8 bg-surface" />
              <div className="flex-1 flex items-end gap-2 px-4">
                {/* Simulated bar chart skeleton */}
                {[...Array(12)].map((_, j) => (
                  <Skeleton 
                    key={j} 
                    className="flex-1 rounded-t-md bg-surface" 
                    style={{ height: `${Math.max(20, ((j * 23 + 47) % 100))}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
