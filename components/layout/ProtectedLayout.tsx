'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity } from 'lucide-react';

import { useAuth } from '@/lib/contexts/AuthContext';

import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm rounded-lg border border-border/70 bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <Activity className="h-6 w-6 animate-pulse" />
          </div>
          <p className="mt-5 text-lg font-semibold text-foreground">Loading your workspace</p>
          <p className="mt-2 text-sm text-muted-foreground">Syncing your study plan, deadlines, and recent activity.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar showMenu onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="app-grid flex gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="min-w-0 flex-1 overflow-auto">{children}</main>
        {sidebarOpen ? (
          <button
            type="button"
            aria-label="Close sidebar"
            className="fixed inset-0 z-30 bg-black/20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}
      </div>
    </div>
  );
};
