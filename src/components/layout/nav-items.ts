import { User, Users, LayoutDashboard } from 'lucide-react';

export const navItems = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/matches', label: 'Discover', icon: Users },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
] as const;
