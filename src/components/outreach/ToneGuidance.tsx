'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface ToneGuidanceProps {
  tips: string[];
}

export function ToneGuidance({ tips }: ToneGuidanceProps) {
  if (tips.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-brand-600" />
          Tone Guidance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
              {tip}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
