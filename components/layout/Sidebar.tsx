'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, BookOpen, Calendar, CheckSquare, LayoutDashboard, Settings, Sparkles, TrendingUp, Users } from 'lucide-react';

import { useAuth } from '@/lib/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen = true, onClose }) => {
  const pathname = usePathname();
  const { user } = useAuth();

  const isStudent = user?.role === 'student';

  const studentNavItems: NavItem[] = [
    { href: '/dashboard', label: 'Command Center', icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: '/subjects', label: 'Subjects', icon: <BookOpen className="w-5 h-5" /> },
    { href: '/assessments', label: 'Assessment Queue', icon: <CheckSquare className="w-5 h-5" /> },
    { href: '/planner', label: 'Plan Studio', icon: <Calendar className="w-5 h-5" /> },
    { href: '/progress', label: 'Momentum', icon: <TrendingUp className="w-5 h-5" /> },
    { href: '/notifications', label: 'Inbox', icon: <Bell className="w-5 h-5" /> },
    { href: '/admin', label: 'Operations', icon: <Users className="w-5 h-5" /> },
    { href: '/settings', label: 'Preferences', icon: <Settings className="w-5 h-5" /> },
  ];

  const adminNavItems: NavItem[] = [
    { href: '/admin', label: 'Operations', icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: '/settings', label: 'Preferences', icon: <Settings className="w-5 h-5" /> },
  ];

  const navItems = isStudent ? studentNavItems : adminNavItems;
  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date());

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-[73px] left-4 z-40 w-[280px] overflow-y-auto rounded-lg border border-sidebar-border bg-sidebar px-4 py-5 shadow-lg transition md:sticky md:top-[97px] md:block md:h-[calc(100vh-120px)] md:translate-x-0 md:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-[120%] md:translate-x-0',
        )}
      >
        <div className="flex h-full flex-col">
          <div className="rounded-lg border border-sidebar-border/80 bg-card/80 p-4 text-sidebar-foreground">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sidebar-primary">Workspace</p>
            <p className="mt-2 text-lg font-semibold">{isStudent ? 'Student command center' : 'Platform command center'}</p>
            <p className="mt-1 text-sm text-sidebar-foreground/70">{today}</p>
          </div>

          <nav className="mt-5 space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link key={item.href} href={item.href} onClick={onClose}>
                  <div
                    className={cn(
                      'flex items-center justify-between rounded-md px-4 py-3 transition-all duration-200',
                      isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={isActive ? 'text-sidebar-primary-foreground' : 'text-sidebar-foreground'}>
                        {item.icon}
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-lg border border-sidebar-border/80 bg-sidebar-accent/70 p-4 text-sidebar-accent-foreground">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              Planning cadence
            </div>
            <p className="mt-2 text-sm leading-6 text-sidebar-foreground/80">
              Keep subjects current, mark assessment progress early, and use the planner before the week fills up.
            </p>
          </div>
        </div>
      </aside>
      <div className="hidden w-[280px] shrink-0 md:block" />
    </>
  );
};
