'use client';

import { Printer, FileText } from 'lucide-react';
import type { EONETEvent } from '@/lib/types';
import { formatDate, getCategoryLabel } from '@/lib/utils';
import { calculateSeverity } from '@/lib/severity';
import { audioSynth } from '@/lib/audio';

interface PrintReportViewProps {
  events: readonly EONETEvent[];
}

export function PrintReportView({ events }: PrintReportViewProps) {
  const handlePrint = () => {
    audioSynth.playClick();
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/70 text-xs font-semibold hover:bg-white/10 hover:text-white transition-colors"
      title="Print Executive Situation Report"
    >
      <Printer className="w-3.5 h-3.5 text-electric-cyan" />
      <span>Print Situation Report</span>
    </button>
  );
}
