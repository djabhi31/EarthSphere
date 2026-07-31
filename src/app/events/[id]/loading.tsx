import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetailLoading() {
  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb Skeleton */}
        <Skeleton className="h-4 w-48 mb-8 bg-white/5" />

        {/* Hero Skeleton */}
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
          <Skeleton className="w-20 h-20 rounded-2xl shrink-0 bg-white/5" />
          <div className="space-y-4 w-full">
            <Skeleton className="h-12 w-3/4 max-w-2xl bg-white/5" />
            <div className="flex gap-3">
              <Skeleton className="h-6 w-24 rounded-full bg-white/5" />
              <Skeleton className="h-6 w-32 rounded-full bg-white/5" />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Map Skeleton */}
            <Skeleton className="w-full h-[500px] rounded-3xl bg-white/5" />
            
            {/* Details Skeleton */}
            <div className="grid sm:grid-cols-2 gap-6">
              <Skeleton className="h-32 rounded-2xl bg-white/5" />
              <Skeleton className="h-32 rounded-2xl bg-white/5" />
            </div>
          </div>

          <div className="space-y-8">
            {/* Timeline Skeleton */}
            <div className="glass rounded-3xl p-6">
              <Skeleton className="h-6 w-32 mb-6 bg-white/5" />
              <div className="space-y-6 pl-4 border-l border-white/10 ml-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="relative pl-6">
                    <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-white/10" />
                    <Skeleton className="h-4 w-24 mb-2 bg-white/5" />
                    <Skeleton className="h-16 w-full rounded-xl bg-white/5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
