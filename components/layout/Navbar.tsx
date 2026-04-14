'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, BookOpen, LogOut, Menu, Settings, Sparkles } from 'lucide-react';

import { notificationsApi } from '@/lib/api';
import { useAuth } from '@/lib/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export const Navbar: React.FC<{ showMenu?: boolean; onMenuToggle?: () => void }> = ({
  showMenu = false,
  onMenuToggle,
}) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let ignore = false;

    const loadUnreadCount = async () => {
      if (!user || user.role !== 'student') {
        setUnreadCount(0);
        return;
      }

      try {
        const count = await notificationsApi.unreadCount();
        if (!ignore) {
          setUnreadCount(count);
        }
      } catch {
        if (!ignore) {
          setUnreadCount(0);
        }
      }
    };

    loadUnreadCount();

    return () => {
      ignore = true;
    };
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="app-grid flex h-[72px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {showMenu ? (
            <button
              onClick={onMenuToggle}
              className="rounded-md border border-border/70 bg-card p-2 transition hover:bg-secondary md:hidden"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
          ) : null}
          <Link href="/" className="flex min-w-0 items-center gap-3 rounded-md px-1 py-1 transition hover:bg-secondary/70">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-foreground">PulsePlan</p>
              <p className="hidden truncate text-xs text-muted-foreground sm:block">Study operations, planning, and momentum</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-md border border-border/70 bg-card px-3 py-2 lg:flex">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm text-muted-foreground">Keep the next deadline visible and the next session realistic.</span>
          </div>

          {user?.role === 'student' ? (
            <button
              className="relative rounded-md border border-border/70 bg-card p-2 transition hover:bg-secondary"
              onClick={() => router.push('/notifications')}
            >
              <Bell className="h-5 w-5 text-foreground" />
              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                  {unreadCount}
                </span>
              ) : null}
            </button>
          ) : null}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 gap-3 rounded-md border-border/70 bg-card px-3 shadow-none">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="max-w-40 truncate text-sm font-medium text-foreground">{user?.name}</p>
                  <p className="max-w-40 truncate text-xs text-muted-foreground">{user?.role}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-md border-border/70 p-2">
              <DropdownMenuLabel className="space-y-1 px-2 py-2">
                <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                <p className="text-xs font-normal text-muted-foreground">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer rounded-md" onClick={() => router.push('/settings')}>
                <Settings className="h-4 w-4" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-md" variant="destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};
