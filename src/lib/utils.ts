import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { OpennessLevel } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'bg-brand-50 text-brand-700';
  if (score >= 60) return 'bg-accent-yellow-light text-yellow-700';
  return 'bg-neutral-100 text-neutral-600';
}

export function getOpennessLabel(openness: OpennessLevel): {
  label: string;
  icon: string;
} {
  switch (openness) {
    case 'one_time_chat':
      return { label: '1x Chat', icon: 'Coffee' };
    case 'short_term_advising':
      return { label: 'Short-term', icon: 'Calendar' };
    case 'ongoing_mentorship':
      return { label: 'Ongoing', icon: 'Users' };
  }
}

export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`;
}

export function isFollowUpDue(
  lastActivityAt: Date,
  thresholdDays: number = 7
): boolean {
  const now = new Date();
  const diffMs = now.getTime() - lastActivityAt.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= thresholdDays;
}
