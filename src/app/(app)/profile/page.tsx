'use client';

import { useEffect, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import type { StudentProfileFormData } from '@/lib/validation';

export default function ProfilePage() {
  const { user } = useAuth();
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
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      if (body?.details?.fieldErrors) {
        // Pass structured field errors as JSON string for ProfileForm to parse
        throw new Error(JSON.stringify({ fieldErrors: body.details.fieldErrors }));
      }
      throw new Error(body?.error || 'Failed to save profile');
    }
    const updated = await res.json();
    setProfile(updated);
  };

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="heading-display text-3xl text-neutral-900">
          {user ? `Welcome, ${user.name.split(' ')[0]}` : 'Your Profile'}
        </h1>
        <p className="mt-2 text-neutral-500">
          Complete your profile to get better mentor matches.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      ) : (
        <ProfileForm initialData={profile || undefined} onSave={handleSave} />
      )}
    </PageContainer>
  );
}
