'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getInitials, formatRelativeDate, isFollowUpDue } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import type { ConnectionData, ConnectionStatus } from '@/types';

interface ConnectionCardProps {
  connection: ConnectionData;
}

const STATUS_LABELS: Record<ConnectionStatus, { label: string; className: string }> = {
  saved: { label: 'Saved', className: 'bg-neutral-100 text-neutral-700' },
  outreach_sent: { label: 'Outreach Sent', className: 'bg-blue-100 text-blue-700' },
  replied: { label: 'Replied', className: 'bg-green-100 text-green-700' },
  met: { label: 'Met', className: 'bg-purple-100 text-purple-700' },
  ongoing: { label: 'Ongoing', className: 'bg-brand-50 text-brand-600' },
};

export function ConnectionCard({ connection }: ConnectionCardProps) {
  const { alumni, status, lastActivityAt, notes } = connection;
  const statusConfig = STATUS_LABELS[status] || STATUS_LABELS.saved;
  const lastActivity = new Date(lastActivityAt);
  const followUpDue = isFollowUpDue(lastActivity);

  return (
    <Link href={`/mentor/${alumni.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-start gap-4 p-4">
          {/* Avatar */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-medium text-brand-700">
            {getInitials(alumni.name)}
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium text-neutral-900">{alumni.name}</p>
              {followUpDue && (
                <AlertCircle className="h-4 w-4 shrink-0 text-warning" aria-label="Follow-up due" />
              )}
            </div>
            <p className="truncate text-sm text-neutral-600">
              {alumni.currentRole} at {alumni.currentCompany}
            </p>
            {notes && (
              <p className="mt-1 line-clamp-1 text-xs text-neutral-500">{notes}</p>
            )}
            <div className="mt-2 flex items-center gap-2">
              <Badge className={statusConfig.className}>{statusConfig.label}</Badge>
              <span className="text-xs text-neutral-500">
                {formatRelativeDate(lastActivity)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
