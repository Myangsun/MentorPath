'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { navItems } from './nav-items';

function SidebarNav() {
  const pathname = usePathname();
  const { setSidebarOpen } = useApp();

  return (
    <nav className="flex flex-col gap-1 p-4" role="navigation" aria-label="Sidebar navigation">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
              active
                ? 'bg-brand-50 text-brand-700'
                : 'text-neutral-500 hover:bg-cream-200 hover:text-neutral-900'
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar({ children }: { children?: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useApp();

  return (
    <>
      {/* Mobile sidebar (sheet/drawer) */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-[280px] p-0 bg-cream-100">
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <span className="text-lg font-semibold text-neutral-900">MentorPath</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <SidebarNav />
          {children}
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="hidden w-[260px] shrink-0 border-r border-border bg-cream-50 lg:block">
        <SidebarNav />
        {children}
      </aside>
    </>
  );
}
