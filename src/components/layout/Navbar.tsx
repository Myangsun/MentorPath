'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Users, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn, getInitials } from '@/lib/utils';
import { navItems } from './nav-items';

export function Navbar() {
  const pathname = usePathname();
  const { toggleSidebar } = useApp();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-cream-100/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center px-6">
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
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
            <Users className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-neutral-900">MentorPath</span>
        </Link>

        {/* Desktop nav */}
        <nav className="ml-10 hidden items-center gap-1 lg:flex" role="navigation">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                  active
                    ? 'text-brand-700 bg-brand-50'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-cream-200'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: user info + logout */}
        <div className="ml-auto flex items-center gap-3">
          {user && (
            <>
              <div className="hidden items-center gap-2 sm:flex">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-medium text-white"
                  aria-label={`Logged in as ${user.name}`}
                >
                  {getInitials(user.name)}
                </div>
                <span className="text-sm font-medium text-neutral-700">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-neutral-400 transition-colors hover:text-neutral-700 hover:bg-cream-200"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
