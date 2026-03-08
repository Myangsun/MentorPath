'use client';

import { useEffect, useState, useCallback } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { ConnectionPipeline } from '@/components/dashboard/ConnectionPipeline';
import { Skeleton } from '@/components/ui/skeleton';
import type { ConnectionData } from '@/types';

export default function DashboardPage() {
  const [connections, setConnections] = useState<ConnectionData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConnections = useCallback(async () => {
    try {
      const res = await fetch('/api/connections');
      const data = await res.json();
      if (Array.isArray(data)) setConnections(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Connection Dashboard</h1>
        <p className="mt-1 text-neutral-600">
          Track and manage your mentor connections
        </p>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-10 w-full" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ) : connections.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg font-medium text-neutral-900">No connections yet</p>
          <p className="mt-1 text-neutral-600">
            Start by discovering mentors and sending outreach messages.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <StatsOverview connections={connections} />
          <ConnectionPipeline connections={connections} />
        </div>
      )}
    </PageContainer>
  );
}
