'use client';

import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { MatchFilters } from '@/types';

interface FilterPanelProps {
  filters: MatchFilters;
  onFilterChange: (filters: MatchFilters) => void;
}

const INDUSTRY_OPTIONS = ['Technology', 'Consulting', 'Finance', 'Climate Tech', 'Healthcare', 'Nonprofit', 'Social Impact'];
const OPENNESS_OPTIONS = [
  { value: 'one_time_chat', label: '1x Chat' },
  { value: 'short_term_advising', label: 'Short-term' },
  { value: 'ongoing_mentorship', label: 'Ongoing' },
];

export function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const toggleFilter = (key: 'industries' | 'openness', value: string) => {
    const current = filters[key] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ ...filters, [key]: next });
  };

  return (
    <div className="space-y-4 p-4">
      {/* Minimum Score */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Minimum Score</Label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={100}
            value={filters.minScore || 0}
            onChange={(e) => onFilterChange({ ...filters, minScore: parseInt(e.target.value) })}
            className="w-full accent-brand-600"
            aria-label="Minimum score filter"
          />
          <span className="w-10 text-right text-sm font-medium">{filters.minScore || 0}%</span>
        </div>
      </div>

      <Separator />

      {/* Industry Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Industry</Label>
        <div className="flex flex-col gap-1.5">
          {INDUSTRY_OPTIONS.map((ind) => (
            <label key={ind} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={filters.industries?.includes(ind) || false}
                onChange={() => toggleFilter('industries', ind)}
                className="rounded accent-brand-600"
              />
              {ind}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Openness Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Openness to Mentor</Label>
        <div className="flex flex-col gap-1.5">
          {OPENNESS_OPTIONS.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={filters.openness?.includes(value) || false}
                onChange={() => toggleFilter('openness', value)}
                className="rounded accent-brand-600"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Visa Match */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={filters.visaMatch || false}
            onChange={(e) => onFilterChange({ ...filters, visaMatch: e.target.checked })}
            className="rounded accent-brand-600"
          />
          <span className="font-semibold">Visa Experience Only</span>
        </label>
      </div>
    </div>
  );
}
