'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageContainer>
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Something went wrong</h1>
        <p className="mt-2 text-neutral-600">
          An unexpected error occurred. Please try again.
        </p>
        <Button
          onClick={reset}
          className="mt-4 bg-brand-600 hover:bg-brand-700"
        >
          Try again
        </Button>
      </div>
    </PageContainer>
  );
}
