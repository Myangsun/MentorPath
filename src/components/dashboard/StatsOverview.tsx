'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Users, Send, MessageSquare, UserCheck } from 'lucide-react';
import type { ConnectionData } from '@/types';

interface StatsOverviewProps {
  connections: ConnectionData[];
}

const STAT_CONFIG = [
  { key: 'total', label: 'Total Connections', icon: Users, color: 'text-brand-600' },
  { key: 'outreach_sent', label: 'Outreach Sent', icon: Send, color: 'text-blue-600' },
  { key: 'replied', label: 'Replied', icon: MessageSquare, color: 'text-success' },
  { key: 'met', label: 'Met', icon: UserCheck, color: 'text-purple-600' },
] as const;

function computeStats(connections: ConnectionData[]) {
  return {
    total: connections.length,
    outreach_sent: connections.filter((c) => c.status === 'outreach_sent').length,
    replied: connections.filter((c) => c.status === 'replied').length,
    met: connections.filter((c) => c.status === 'met' || c.status === 'ongoing').length,
  };
}

export function StatsOverview({ connections }: StatsOverviewProps) {
  const stats = computeStats(connections);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STAT_CONFIG.map(({ key, label, icon: Icon, color }) => (
        <Card key={key}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`rounded-lg bg-neutral-100 p-2 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{stats[key]}</p>
              <p className="text-sm text-neutral-600">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
