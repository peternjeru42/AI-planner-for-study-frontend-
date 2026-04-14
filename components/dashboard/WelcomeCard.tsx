'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, CalendarClock, Target } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { User } from '@/lib/types';

interface WelcomeCardProps {
  user: User;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ user }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <section className="page-band">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Today&apos;s runway</p>
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              {getGreeting()}, {user.name?.split(' ')[0]}. Keep this week calm before it gets crowded.
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Review the next deadlines, protect your study windows early, and adjust the plan before pressure builds.
            </p>
          </div>

          <Button asChild size="lg" className="w-full gap-2 rounded-md sm:w-auto">
            <Link href="/planner">
              <BookOpen className="h-4 w-4" />
              Open Plan Studio
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-md border border-border/70 bg-card/90 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <CalendarClock className="h-4 w-4 text-primary" />
              Session timing
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Lock the next focused block before new tasks claim the evening.</p>
          </div>
          <div className="rounded-md border border-border/70 bg-card/90 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Target className="h-4 w-4 text-accent" />
              Deadline control
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Move important work forward while there is still slack in the week.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
