'use client';

import { useMemo, useState } from 'react';
import { ConnectionCard } from './ConnectionCard';
import type { ConnectionData, ConnectionStatus } from '@/types';

interface ConnectionPipelineProps {
  connections: ConnectionData[];
}

const PIPELINE_STAGES: { key: ConnectionStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'saved', label: 'Saved' },
  { key: 'outreach_sent', label: 'Outreach Sent' },
  { key: 'replied', label: 'Replied' },
  { key: 'met', label: 'Met' },
  { key: 'ongoing', label: 'Ongoing' },
];

export function ConnectionPipeline({ connections }: ConnectionPipelineProps) {
  const [activeStage, setActiveStage] = useState<ConnectionStatus | 'all'>('all');

  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = { all: connections.length };
    for (const c of connections) {
      counts[c.status] = (counts[c.status] || 0) + 1;
    }
    return counts;
  }, [connections]);

  const filtered = useMemo(() => {
    if (activeStage === 'all') return connections;
    return connections.filter((c) => c.status === activeStage);
  }, [connections, activeStage]);

  return (
    <div className="space-y-4">
      {/* Stage tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {PIPELINE_STAGES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveStage(key)}
              className={`shrink-0 rounded-full border px-3 py-1 text-sm transition-colors ${
                activeStage === key
                  ? 'border-brand-600 bg-brand-50 text-brand-600'
                  : 'border-border text-neutral-600 hover:border-neutral-400'
              }`}
            >
              {label} ({stageCounts[key] || 0})
            </button>
          ))}
      </div>

      {/* Connection cards */}
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-neutral-500">
          No connections in this stage yet.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((connection) => (
            <ConnectionCard key={connection.id} connection={connection} />
          ))}
        </div>
      )}
    </div>
  );
}
