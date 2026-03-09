'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Users, ArrowRight, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim()) {
      setError('Please enter both your name and email.');
      return;
    }

    setSubmitting(true);
    try {
      await login(name.trim(), email.trim());
      router.push('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream-100">
      {/* Top nav */}
      <header className="px-6 pt-6">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="inline-flex items-center gap-2 text-neutral-500 transition-colors hover:text-neutral-900">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </Link>
        </div>
      </header>

      {/* Login form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600">
              <Users className="h-7 w-7 text-white" />
            </div>
            <h1 className="heading-display text-3xl text-neutral-900">Welcome to MentorPath</h1>
            <p className="mt-2 text-neutral-500">Sign in with your name and email to get started</p>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-border bg-white p-8 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-cream-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  placeholder="e.g. Jane Smith"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-cream-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  placeholder="jane@university.edu"
                />
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3.5 text-sm font-medium text-white transition-all hover:bg-neutral-800 disabled:opacity-50"
              >
                {submitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-neutral-400">
              New users will automatically have a profile created.
              <br />
              Returning users will be logged in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
