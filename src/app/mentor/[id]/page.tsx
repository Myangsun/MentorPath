'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { MentorProfile } from '@/components/mentor/MentorProfile';
import { CareerTimeline } from '@/components/mentor/CareerTimeline';
import { MatchRationale } from '@/components/mentor/MatchRationale';
import { ConversationPrompts } from '@/components/mentor/ConversationPrompts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Send, Clock } from 'lucide-react';
import type { AlumniProfileData, ScoreBreakdown, CareerTimelineEntry } from '@/types';

interface MentorData extends AlumniProfileData {
  matchScore: number | null;
  scoreBreakdown: ScoreBreakdown | null;
  rationale: string | null;
}

export default function MentorDetailPage() {
  const params = useParams();
  const mentorId = params.id as string;
  const [mentor, setMentor] = useState<MentorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/mentors/${mentorId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => setMentor(data))
      .catch(() => setMentor(null))
      .finally(() => setLoading(false));
  }, [mentorId]);

  if (loading) {
    return (
      <PageContainer>
        <Skeleton className="mb-4 h-8 w-32" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="mt-4 h-64 w-full" />
      </PageContainer>
    );
  }

  if (!mentor) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-lg font-medium text-neutral-900">Mentor not found</p>
          <Link href="/matches" className="mt-2 text-brand-600 hover:underline">
            Back to matches
          </Link>
        </div>
      </PageContainer>
    );
  }

  const timeline = (mentor.careerTimeline || []) as CareerTimelineEntry[];
  const defaultPrompts = [
    'What motivated your career transition?',
    'How did you navigate the challenges of changing industries?',
    'What advice would you give to someone starting a similar path?',
  ];

  return (
    <PageContainer>
      {/* Back link */}
      <Link
        href="/matches"
        className="mb-4 inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to matches
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          <MentorProfile
            alumni={mentor}
            matchScore={mentor.matchScore}
            scoreBreakdown={mentor.scoreBreakdown}
          />
          <MatchRationale
            alumniId={mentorId}
            shortRationale={mentor.rationale}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action buttons */}
          <Card>
            <CardContent className="space-y-3 p-4">
              <Link href={`/outreach/${mentorId}`}>
                <Button className="w-full bg-brand-600 hover:bg-brand-700">
                  <Send className="mr-2 h-4 w-4" /> Compose Outreach
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Career Timeline */}
          {timeline.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-brand-600" />
                  Career Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CareerTimeline timeline={timeline} />
              </CardContent>
            </Card>
          )}

          {/* Conversation Prompts */}
          <ConversationPrompts prompts={defaultPrompts} />
        </div>
      </div>
    </PageContainer>
  );
}
