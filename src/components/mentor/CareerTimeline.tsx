'use client';

import type { CareerTimelineEntry } from '@/types';

interface CareerTimelineProps {
  timeline: CareerTimelineEntry[];
}

export function CareerTimeline({ timeline }: CareerTimelineProps) {
  if (!timeline.length) return null;

  const sorted = [...timeline].sort((a, b) => b.startYear - a.startYear);

  return (
    <div className="space-y-0">
      {sorted.map((entry, i) => (
        <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
          {/* Vertical line */}
          {i < sorted.length - 1 && (
            <div className="absolute left-[11px] top-6 h-full w-0.5 bg-neutral-400/30" />
          )}
          {/* Dot */}
          <div className="relative z-10 mt-1.5 h-[10px] w-[10px] shrink-0 rounded-full border-2 border-brand-600 bg-white" />
          {/* Content */}
          <div className="min-w-0">
            <p className="font-medium text-neutral-900">{entry.title}</p>
            <p className="text-sm text-neutral-600">{entry.company}</p>
            <p className="text-xs text-neutral-400">
              {entry.startYear} – {entry.endYear ?? 'Present'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
