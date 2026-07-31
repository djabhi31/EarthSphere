/**
 * @file EventSources.tsx
 * @description Source links section for the event, displaying external source links with icons.
 */

"use client";

import { ExternalLink } from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { audioSynth } from "@/lib/audio";
import type { EONETEvent } from "@/lib/types";

interface EventSourcesProps {
  sources: EONETEvent["sources"];
  categoryColor: string;
}

export function EventSources({ sources, categoryColor }: EventSourcesProps) {
  if (!sources || sources.length === 0) {
    return <p className="text-sm text-white/30">No references listed.</p>;
  }

  return (
    <div className="space-y-2.5">
      {sources.map((source) => (
        <div key={source.id} className="block">
          <SpotlightCard glowColor={`${categoryColor}12`} borderColor={`${categoryColor}30`} maxTilt={6}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3.5 cursor-none"
              onMouseEnter={() => audioSynth.playHover()}
              onClick={() => audioSynth.playClick()}
            >
              <span className="font-mono text-xs uppercase font-bold text-white/60">
                {source.id}
              </span>
              <span className="flex-1 truncate text-xs text-white/30">
                {source.url}
              </span>
              <ExternalLink size={12} className="shrink-0 text-white/20" />
            </a>
          </SpotlightCard>
        </div>
      ))}
    </div>
  );
}
