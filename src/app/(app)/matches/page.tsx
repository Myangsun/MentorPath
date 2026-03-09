'use client';

import { useEffect, useState, useCallback } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { MatchList } from '@/components/matches/MatchList';
import { FilterPanel } from '@/components/matches/FilterPanel';
import { SortDropdown } from '@/components/matches/SortDropdown';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import type { MatchResultWithAlumni, MatchFilters, SortOption } from '@/types';

const defaultFilters: MatchFilters = {
  industries: [],
  openness: [],
  minScore: 0,
  visaMatch: false,
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchResultWithAlumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filters, setFilters] = useState<MatchFilters>(defaultFilters);
  const [sort, setSort] = useState<SortOption>('score_desc');

  const fetchMatches = useCallback(async () => {
    try {
      const res = await fetch('/api/mentors');
      const data = await res.json();
      if (Array.isArray(data)) setMatches(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateMatches = useCallback(async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/matches', { method: 'POST' });
      const data = await res.json();
      if (Array.isArray(data)) setMatches(data);
    } finally {
      setGenerating(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return (
    <PageContainer>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="heading-display text-3xl text-neutral-900">Discover Mentors</h1>
          <p className="mt-2 text-neutral-500">
            {matches.length > 0
              ? `${matches.length} mentors matched to your profile`
              : 'Generate matches to find your ideal mentors'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SortDropdown value={sort} onChange={setSort} />
          <Button
            onClick={generateMatches}
            disabled={generating}
            variant="brand"
          >
            <Sparkles className={`mr-2 h-4 w-4 ${generating ? 'animate-pulse' : ''}`} />
            {generating ? 'Generating...' : 'Generate Matches'}
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters (desktop) */}
        <div className="hidden w-[280px] shrink-0 lg:block">
          <div className="rounded-2xl border border-border bg-white shadow-soft">
            <div className="border-b border-border p-5">
              <h2 className="font-semibold text-neutral-900">Filters</h2>
            </div>
            <FilterPanel filters={filters} onFilterChange={setFilters} />
          </div>
        </div>

        {/* Match list */}
        <div className="flex-1">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <MatchList matches={matches} filters={filters} sort={sort} />
          )}
        </div>
      </div>
    </PageContainer>
  );
}
