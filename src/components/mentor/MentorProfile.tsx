'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, GraduationCap, MapPin, Briefcase } from 'lucide-react';
import { cn, formatScore, getScoreColor, getInitials, getOpennessLabel } from '@/lib/utils';
import type { AlumniProfileData, ScoreBreakdown } from '@/types';

interface MentorProfileProps {
  alumni: AlumniProfileData;
  matchScore: number | null;
  scoreBreakdown: ScoreBreakdown | null;
}

const BREAKDOWN_LABELS: Record<keyof ScoreBreakdown, { label: string; max: number }> = {
  careerPivot: { label: 'Career Pivot', max: 30 },
  academicBackground: { label: 'Academic', max: 20 },
  visaAlignment: { label: 'Visa', max: 20 },
  industryMatch: { label: 'Industry', max: 15 },
  geographicProximity: { label: 'Location', max: 10 },
  stageProximity: { label: 'Stage', max: 5 },
};

export function MentorProfile({ alumni, matchScore, scoreBreakdown }: MentorProfileProps) {
  const openness = getOpennessLabel(alumni.openness);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-700">
              {getInitials(alumni.name)}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900">{alumni.name}</h1>
                  <p className="text-lg text-neutral-600">{alumni.currentRole}</p>
                </div>
                {matchScore !== null && (
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-3 py-1 text-sm font-bold',
                      getScoreColor(matchScore)
                    )}
                  >
                    {formatScore(matchScore)} Match
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-neutral-600">
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {alumni.currentCompany}
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  {alumni.school} &apos;{String(alumni.graduationYear).slice(-2)}
                </span>
                {alumni.geographicHistory.length > 0 && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {alumni.geographicHistory.join(', ')}
                  </span>
                )}
              </div>

              {alumni.bio && (
                <p className="mt-3 text-sm text-neutral-600">{alumni.bio}</p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="outline">{openness.label}</Badge>
                {alumni.pivotType && <Badge variant="secondary">{alumni.pivotType}</Badge>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      {scoreBreakdown && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Briefcase className="h-5 w-5 text-brand-600" />
              Match Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(Object.entries(BREAKDOWN_LABELS) as [keyof ScoreBreakdown, { label: string; max: number }][]).map(
              ([key, { label, max }]) => {
                const value = scoreBreakdown[key];
                const pct = (value / max) * 100;
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">{label}</span>
                      <span className="font-medium">{value}/{max}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-brand-600 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </CardContent>
        </Card>
      )}

      {/* Skills & Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Skills & Topics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {alumni.skills.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-neutral-900">Skills</p>
              <div className="flex flex-wrap gap-2">
                {alumni.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
          {alumni.topicsWilling.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-neutral-900">Willing to Discuss</p>
              <div className="flex flex-wrap gap-2">
                {alumni.topicsWilling.map((topic) => (
                  <Badge key={topic} variant="outline">{topic}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
