'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, Loader2, Wand2 } from 'lucide-react';

interface MessageComposerProps {
  alumniId: string;
  alumniName: string;
  initialMessage?: string;
  onSend: (message: string) => Promise<void>;
}

const PURPOSE_OPTIONS = [
  { value: 'career_advice', label: 'Career Advice' },
  { value: 'industry_insights', label: 'Industry Insights' },
  { value: 'informational_interview', label: 'Informational Interview' },
  { value: 'networking', label: 'General Networking' },
];

export function MessageComposer({ alumniId, alumniName, initialMessage, onSend }: MessageComposerProps) {
  const [message, setMessage] = useState(initialMessage || '');
  const [purpose, setPurpose] = useState('career_advice');
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => clearTimeout(copyTimerRef.current);
  }, []);

  const generateMessage = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alumniId, purpose }),
      });
      if (!res.ok) throw new Error('Failed to generate');
      const data = await res.json();
      setMessage(data.message || '');
    } catch {
      setError('Failed to generate message. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    setError(null);
    try {
      await onSend(message);
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Message to {alumniName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Purpose selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">Purpose</label>
          <div className="flex flex-wrap gap-2">
            {PURPOSE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPurpose(opt.value)}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  purpose === opt.value
                    ? 'border-brand-600 bg-brand-50 text-brand-600'
                    : 'border-border text-neutral-600 hover:border-neutral-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <Button
          type="button"
          variant="outline"
          onClick={generateMessage}
          disabled={generating}
          className="w-full"
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" /> Generate with AI
            </>
          )}
        </Button>

        {/* Error message */}
        {error && (
          <p className="text-sm text-danger">{error}</p>
        )}

        {/* Message editor */}
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your outreach message here, or use AI to generate one..."
          rows={10}
          className="resize-y"
        />

        {/* Word count */}
        <p className="text-xs text-neutral-500">
          {message.split(/\s+/).filter(Boolean).length} words
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={handleSend}
            disabled={sending || !message.trim()}
            className="flex-1 bg-brand-600 hover:bg-brand-700"
          >
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
              </>
            ) : (
              'Save & Send'
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            disabled={!message.trim()}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
