'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, GraduationCap, ArrowRight } from 'lucide-react';
import { cn, formatScore, getScoreColor, getInitials, getOpennessLabel } from '@/lib/utils';
import type { MatchResultWithAlumni } from '@/types';

interface MatchCardProps {
  match: MatchResultWithAlumni;
}

export function MatchCard({ match }: MatchCardProps) {
  const { alumni, score, rationale } = match;
  const openness = getOpennessLabel(alumni.openness);

  return (
    <Link href={`/mentor/${alumni.id}`}>
      <Card className="group transition-shadow hover:shadow-md">
        <CardContent className="p-5">
          {/* Header: Avatar + Name + Score */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                {getInitials(alumni.name)}
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 group-hover:text-brand-600 transition-colors">
                  {alumni.name}
                </h3>
                <p className="text-sm text-neutral-600">{alumni.currentRole}</p>
              </div>
            </div>
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold',
                getScoreColor(score)
              )}
            >
              {formatScore(score)}
            </span>
          </div>

          {/* Company + School */}
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-neutral-600">
            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {alumni.currentCompany}
            </span>
            <span className="flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5" />
              {alumni.school} &apos;{String(alumni.graduationYear).slice(-2)}
            </span>
          </div>

          {/* Pivot type */}
          {alumni.pivotType && (
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                {alumni.pivotType}
              </Badge>
            </div>
          )}

          {/* Rationale */}
          <p className="mt-3 text-sm text-neutral-600 line-clamp-2">{rationale}</p>

          {/* Footer: Openness + CTA */}
          <div className="mt-3 flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {openness.label}
            </Badge>
            <span className="flex items-center gap-1 text-sm font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
              View Profile <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
