'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { MessageComposer } from '@/components/outreach/MessageComposer';
import { ToneGuidance } from '@/components/outreach/ToneGuidance';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import type { AlumniProfileData } from '@/types';

interface MentorBasic {
  id: string;
  name: string;
  currentRole: string;
  currentCompany: string;
  school: string;
}

export default function OutreachPage() {
  const params = useParams();
  const router = useRouter();
  const mentorId = params.id as string;
  const [mentor, setMentor] = useState<MentorBasic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/mentors/${mentorId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data: AlumniProfileData) => {
        setMentor({
          id: data.id,
          name: data.name,
          currentRole: data.currentRole,
          currentCompany: data.currentCompany,
          school: data.school,
        });
      })
      .catch(() => setMentor(null))
      .finally(() => setLoading(false));
  }, [mentorId]);

  const handleSend = useCallback(async (message: string) => {
    const res = await fetch('/api/connections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        alumniId: mentorId,
        status: 'outreach_sent',
        outreachMessage: message,
      }),
    });
    if (!res.ok) {
      throw new Error('Failed to save outreach');
    }
    router.push('/dashboard');
  }, [mentorId, router]);

  if (loading) {
    return (
      <PageContainer>
        <Skeleton className="mb-4 h-8 w-32" />
        <Skeleton className="h-64 w-full" />
      </PageContainer>
    );
  }

  if (!mentor) {
    return (
      <PageContainer>
        <div className="py-12 text-center">
          <p className="text-lg font-medium text-neutral-900">Mentor not found</p>
          <Link href="/matches" className="mt-2 text-brand-600 hover:underline">
            Back to matches
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Link
        href={`/mentor/${mentorId}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to {mentor.name}
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Compose Outreach</h1>
        <p className="mt-1 text-neutral-600">
          Reach out to {mentor.name} &middot; {mentor.currentRole} at {mentor.currentCompany}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MessageComposer
            alumniId={mentorId}
            alumniName={mentor.name}
            onSend={handleSend}
          />
        </div>
        <div>
          <ToneGuidance
            tips={[
              'Keep it concise and respectful of their time',
              'Mention specific shared experiences or interests',
              'Be clear about what you\'re asking for',
              'Express genuine curiosity about their career journey',
            ]}
          />
        </div>
      </div>
    </PageContainer>
  );
}
