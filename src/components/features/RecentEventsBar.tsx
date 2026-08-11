'use client';

import Link from 'next/link';
import { History, ChevronRight } from 'lucide-react';
import { useEarthSphereStore } from '@/lib/store';
import { useEvents } from '@/hooks/useEvents';

export function RecentEventsBar() {
  const { recentEvents } = useEarthSphereStore();
  const { data: eventsData } = useEvents({ status: 'all', days: 60 });

  if (!recentEvents.length || !eventsData?.events) return null;

  const events = eventsData.events.filter((e) => recentEvents.includes(e.id));

  if (!events.length) return null;

  return (
    <div className="glass rounded-xl p-2.5 border border-white/10 flex items-center gap-3 overflow-x-auto">
      <div className="flex items-center gap-1.5 text-xs text-white/50 shrink-0 font-semibold">
        <History className="w-3.5 h-3.5 text-electric-cyan" />
        <span>Recently Viewed:</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
        {events.map((evt) => (
          <Link
            key={evt.id}
            href={`/events/${evt.id}`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 hover:text-white transition-colors shrink-0 max-w-[180px] truncate"
          >
            <span className="truncate">{evt.title}</span>
            <ChevronRight className="w-3 h-3 text-white/40 shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
