'use client';

import { useMemo } from 'react';
import { MatchCard } from './MatchCard';
import type { MatchResultWithAlumni, MatchFilters, SortOption } from '@/types';

interface MatchListProps {
  matches: MatchResultWithAlumni[];
  filters: MatchFilters;
  sort: SortOption;
}

export function MatchList({ matches, filters, sort }: MatchListProps) {
  const filtered = useMemo(() => {
    let result = matches;

    // Min score filter
    if (filters.minScore > 0) {
      result = result.filter((m) => m.score >= filters.minScore);
    }

    // Industry filter
    if (filters.industries.length > 0) {
      result = result.filter((m) =>
        filters.industries.includes(m.alumni.industry)
      );
    }

    // Openness filter
    if (filters.openness.length > 0) {
      result = result.filter((m) =>
        filters.openness.includes(m.alumni.openness)
      );
    }

    // Visa match filter
    if (filters.visaMatch) {
      result = result.filter((m) => m.breakdown.visaAlignment > 0);
    }

    // Sort
    const sorted = [...result];
    switch (sort) {
      case 'score_asc':
        sorted.sort((a, b) => a.score - b.score);
        break;
      case 'name_asc':
        sorted.sort((a, b) => a.alumni.name.localeCompare(b.alumni.name));
        break;
      case 'name_desc':
        sorted.sort((a, b) => b.alumni.name.localeCompare(a.alumni.name));
        break;
      case 'score_desc':
      default:
        sorted.sort((a, b) => b.score - a.score);
        break;
    }

    return sorted;
  }, [matches, filters, sort]);

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-neutral-900">No matches found</p>
        <p className="mt-1 text-sm text-neutral-600">
          Try adjusting your filters to see more mentors.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-neutral-600">
        {filtered.length} mentor{filtered.length === 1 ? '' : 's'} found
      </p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((match) => (
          <MatchCard key={match.alumniId} match={match} />
        ))}
      </div>
    </div>
  );
}
