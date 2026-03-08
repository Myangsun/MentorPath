import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';

export default function NotFound() {
  return (
    <PageContainer>
      <div className="py-20 text-center">
        <h1 className="text-4xl font-bold text-neutral-900">404</h1>
        <p className="mt-2 text-lg text-neutral-600">Page not found</p>
        <Link
          href="/profile"
          className="mt-4 inline-block text-brand-600 hover:underline"
        >
          Go to your profile
        </Link>
      </div>
    </PageContainer>
  );
}
