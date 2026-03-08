'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import type { RationaleResponse } from '@/types';

interface MatchRationaleProps {
  alumniId: string;
  shortRationale: string | null;
}

export function MatchRationale({ alumniId, shortRationale }: MatchRationaleProps) {
  const [detailed, setDetailed] = useState<RationaleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fetchDetailed = async () => {
    if (detailed) {
      setExpanded(!expanded);
      return;
    }

    setLoading(true);
    setExpanded(true);
    try {
      const res = await fetch('/api/rationale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alumniId }),
      });
      if (res.ok) {
        const data = await res.json();
        setDetailed(data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-brand-600" />
          Why This Match
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {shortRationale && (
          <p className="text-neutral-600">{shortRationale}</p>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={fetchDetailed}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : expanded ? 'Hide Details' : 'See Detailed Analysis'}
          {expanded ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
        </Button>

        {expanded && (
          <div className="space-y-4 border-t pt-4">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : detailed ? (
              <>
                <p className="text-sm text-neutral-600 whitespace-pre-line">
                  {detailed.detailedRationale}
                </p>

                {detailed.alignmentPoints.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-neutral-900">Alignment Points</h4>
                    <ul className="space-y-1.5">
                      {detailed.alignmentPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
