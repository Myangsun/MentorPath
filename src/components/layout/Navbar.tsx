'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { cn, getInitials } from '@/lib/utils';
import { navItems } from './nav-items';

export function Navbar() {
  const pathname = usePathname();
  const { toggleSidebar, studentName } = useApp();

  return (
    <header
      className="sticky top-0 z-40 h-14 bg-white"
      style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center px-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 lg:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-brand-600">
          <Users className="h-5 w-5" />
          <span className="text-lg">MentorPath</span>
        </Link>

        {/* Desktop nav */}
        <nav className="ml-8 hidden items-center gap-1 lg:flex" role="navigation">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: avatar */}
        <div className="ml-auto flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-medium text-white"
            aria-label={`Logged in as ${studentName}`}
          >
            {getInitials(studentName)}
          </div>
        </div>
      </div>
    </header>
  );
}
