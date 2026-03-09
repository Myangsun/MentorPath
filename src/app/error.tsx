'use client';

import { Button } from '@/components/ui/button';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100 px-6">
      <div className="text-center">
        <h1 className="heading-display text-3xl text-neutral-900">Something went wrong</h1>
        <p className="mt-3 text-neutral-500">
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={reset} variant="brand" className="mt-6">
          Try again
        </Button>
      </div>
    </div>
  );
}
