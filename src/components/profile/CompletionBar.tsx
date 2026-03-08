'use client';

import { cn } from '@/lib/utils';

interface CompletionBarProps {
  completion: number;
}

export function CompletionBar({ completion }: CompletionBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(completion)));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-neutral-900">Profile Completion</span>
        <span
          className={cn(
            'font-semibold',
            clamped === 100 ? 'text-success' : clamped >= 60 ? 'text-brand-600' : 'text-neutral-600'
          )}
        >
          {clamped}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            clamped === 100 ? 'bg-success' : clamped >= 60 ? 'bg-brand-600' : 'bg-neutral-400'
          )}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Profile ${clamped}% complete`}
        />
      </div>
    </div>
  );
}
