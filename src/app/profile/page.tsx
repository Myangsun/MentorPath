'use client';

import { useEffect, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { Skeleton } from '@/components/ui/skeleton';
import type { StudentProfileFormData } from '@/lib/validation';

export default function ProfilePage() {
  const [profile, setProfile] = useState<StudentProfileFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch(() => setProfile({}))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (data: StudentProfileFormData) => {
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to save');
    const updated = await res.json();
    setProfile(updated);
  };

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Your Profile</h1>
        <p className="mt-1 text-neutral-600">
          Complete your profile to get better mentor matches.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : (
        <ProfileForm initialData={profile || undefined} onSave={handleSave} />
      )}
    </PageContainer>
  );
}
