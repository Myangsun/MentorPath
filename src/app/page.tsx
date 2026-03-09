'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Sparkles, Users, Target, MessageSquare } from 'lucide-react';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/profile');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-cream-100/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
              <Users className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-neutral-900">MentorPath</span>
          </Link>
          <Link
            href="/login"
            className="rounded-full border-2 border-neutral-900 px-6 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-20 pb-32">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute top-32 left-10 text-6xl text-brand-300 opacity-40 select-none">~</div>
        <div className="pointer-events-none absolute top-48 right-16 h-20 w-20 rounded-full bg-accent-yellow opacity-30" />
        <div className="pointer-events-none absolute bottom-20 left-1/4 h-12 w-12 rounded-full bg-brand-200 opacity-40" />

        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700">
            <Sparkles className="h-4 w-4" />
            Powered by AI Agents
          </div>

          <h1 className="heading-display text-5xl leading-tight text-neutral-900 sm:text-6xl md:text-7xl">
            Find your perfect{' '}
            <span className="relative inline-block">
              mentor
              <span className="absolute -bottom-1 left-0 h-3 w-full bg-accent-yellow opacity-40" />
            </span>
            {' '}from alumni
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg text-neutral-500 leading-relaxed">
            We use AI agents to intelligently match you with alumni mentors who share your career
            interests, background, and goals. Get personalized guidance for your professional journey.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="group flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-3.5 text-base font-medium text-white transition-all hover:bg-neutral-800 hover:shadow-elevated"
            >
              Start Matching
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="heading-display text-3xl text-neutral-900 sm:text-4xl">How it works</h2>
            <p className="mt-4 text-neutral-500">Three simple steps to find your ideal mentor</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="group rounded-2xl border border-border bg-cream-50 p-8 transition-all hover:shadow-card">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50">
                <Target className="h-7 w-7 text-brand-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-neutral-900">Build your profile</h3>
              <p className="text-neutral-500 leading-relaxed">
                Share your background, career goals, and what you&apos;re looking for in a mentor.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group rounded-2xl border border-border bg-accent-yellow-light p-8 transition-all hover:shadow-card">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-yellow/20">
                <Sparkles className="h-7 w-7 text-yellow-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-neutral-900">AI matches you</h3>
              <p className="text-neutral-500 leading-relaxed">
                Our AI agents analyze career paths, interests, and goals to find your best mentor matches.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group rounded-2xl border border-border bg-cream-50 p-8 transition-all hover:shadow-card">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50">
                <MessageSquare className="h-7 w-7 text-brand-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-neutral-900">Connect & grow</h3>
              <p className="text-neutral-500 leading-relaxed">
                Reach out with AI-crafted messages and build meaningful mentoring relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statement Section */}
      <section className="bg-neutral-900 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Sparkles className="mx-auto mb-6 h-10 w-10 text-accent-yellow" />
          <h2 className="heading-display text-3xl text-white sm:text-4xl leading-snug">
            We are using AI agents to match your mentors from alumni
          </h2>
          <p className="mt-6 text-lg text-neutral-400 leading-relaxed">
            Our intelligent matching system considers career trajectories, academic backgrounds,
            industry expertise, and personal goals to create meaningful mentor-mentee connections.
          </p>
          <Link
            href="/login"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand-500 px-8 py-3.5 text-base font-medium text-white transition-all hover:bg-brand-400"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cream-200 px-6 py-12">
        <div className="mx-auto max-w-6xl flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-neutral-500">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">MentorPath</span>
          </div>
          <p className="text-sm text-neutral-400">
            Built for MIT 15.785 Introduction to Product Management
          </p>
        </div>
      </footer>
    </div>
  );
}
