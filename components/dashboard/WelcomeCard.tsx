'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card className="border border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10">
      <CardContent className="pt-8">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {getGreeting()}, {user.name?.split(' ')[0]}!
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ready to ace your exams? Let&apos;s create a study plan.
              </p>
            </div>

            <Button
              asChild
              size="sm"
              className="w-full cursor-pointer gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-[0_20px_45px_-22px_rgba(37,99,235,0.95)] transition hover:-translate-y-0.5 hover:from-sky-500 hover:to-blue-600 hover:shadow-[0_24px_50px_-20px_rgba(14,165,233,0.85)] sm:w-auto"
            >
              <Link href="/planner">
                <BookOpen className="h-4 w-4" />
                Generate Study Plan
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
