'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

interface ConversationPromptsProps {
  prompts: string[];
}

export function ConversationPrompts({ prompts }: ConversationPromptsProps) {
  if (!prompts.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5 text-brand-600" />
          Conversation Starters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {prompts.map((prompt, i) => (
            <li
              key={i}
              className="rounded-lg border border-border bg-neutral-100 p-3 text-sm text-neutral-900"
            >
              &ldquo;{prompt}&rdquo;
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
