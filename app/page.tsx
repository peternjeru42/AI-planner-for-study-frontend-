'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  BookMarked,
  BookOpen,
  BrainCircuit,
  Calendar,
  CheckCircle2,
  Clock3,
  LineChart,
  Sparkles,
  TimerReset,
} from 'lucide-react';

import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const featureCards = [
  {
    icon: TimerReset,
    title: 'Adaptive scheduling',
    description: 'Build realistic study blocks around deadlines, effort, and the hours you can actually protect.',
  },
  {
    icon: LineChart,
    title: 'Momentum tracking',
    description: 'Watch completion rates, subject effort, and weekly study time without digging through spreadsheets.',
  },
  {
    icon: Calendar,
    title: 'Deadline visibility',
    description: 'See assessments and study sessions together so the next due date never appears out of nowhere.',
  },
  {
    icon: BookMarked,
    title: 'Subject control',
    description: 'Manage subjects, assessments, plans, notifications, and settings from one connected workspace.',
  },
];

const heroStats = [
  { label: 'Assessment view', value: 'Unified' },
  { label: 'Study sessions', value: 'Editable' },
  { label: 'Weekly rhythm', value: 'Visible' },
];

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="app-grid flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 rounded-md px-2 py-1 transition hover:bg-secondary/60">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-semibold">PulsePlan</p>
              <p className="text-xs text-muted-foreground">Adaptive study planning workspace</p>
            </div>
          </Link>

          <div className="hidden items-center gap-4 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground transition hover:text-foreground">
              What it does
            </Link>
            <Button onClick={() => router.push('/dashboard')} variant="outline" size="sm" className="rounded-md border-border/70 bg-card shadow-none">
              Open workspace
            </Button>
            <Button onClick={() => router.push('/planner')} size="sm" className="rounded-md">
              Plan study
            </Button>
          </div>
        </div>
      </nav>

      <main>
        <section className="app-grid px-4 pt-8 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-lg border border-border/70">
            <div className="absolute inset-0">
              <Image
                src="/placeholder.jpg"
                alt="Student planning a week of focused study"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,24,29,0.86),rgba(9,24,29,0.58),rgba(9,24,29,0.28))]" />
            </div>

            <div className="relative grid min-h-[72vh] items-end px-6 py-10 sm:px-8 lg:px-10 lg:py-12">
              <div className="max-w-3xl space-y-6">
                <div className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  Replace panic planning with a visible weekly plan
                </div>

                <div className="space-y-4">
                  <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                    Plan study time around real deadlines, not last-minute guesswork.
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                    PulsePlan combines subjects, assessments, AI-assisted planning, progress tracking, notifications, and settings
                    into one workspace that stays aligned with the backend you already have.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {heroStats.map((item) => (
                    <div key={item.label} className="rounded-md border border-white/15 bg-white/10 p-4 text-white backdrop-blur-sm">
                      <p className="text-lg font-semibold">{item.value}</p>
                      <p className="text-sm text-white/70">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="app-grid px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="page-band">
              <div className="inline-flex items-center gap-2 rounded-md bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <BrainCircuit className="h-4 w-4" />
                Weekly preview
              </div>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-foreground">A cleaner rhythm for the week ahead.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                Queue the important work first, spread effort across the week, and keep the next session visible enough to act on it.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  { subject: 'Algorithms', task: 'Exam prep sprint', time: 'Mon 7:00 PM', tone: 'bg-primary' },
                  { subject: 'Database Systems', task: 'Assignment checkpoint', time: 'Wed 6:30 PM', tone: 'bg-accent' },
                  { subject: 'AI Fundamentals', task: 'Revision loop', time: 'Fri 5:30 PM', tone: 'bg-sky-500' },
                ].map((item) => (
                  <div key={item.subject} className="flex items-start gap-3 rounded-md border border-border/70 bg-card/90 p-4 shadow-sm">
                    <div className={`mt-1 h-3 w-3 rounded-full ${item.tone}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">{item.task}</p>
                      <p className="text-sm text-muted-foreground">{item.subject}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5" />
                      {item.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <Card className="border-border/70 bg-card shadow-sm">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-xl">Planning signals</CardTitle>
                  <CardDescription>Everything the interface keeps in view while you work.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  {[
                    'Urgent work gets scheduled first.',
                    'Study blocks stay editable before you save.',
                    'Progress stays tied to subjects and deadlines.',
                    'Notifications stay attached to real activity.',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 rounded-md border border-border/70 bg-muted/40 p-3 text-sm text-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="app-grid px-4 pb-12 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Core workflow</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              Every major feature stays intact, but the interface feels sharper and easier to read.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-border/70 bg-card shadow-sm">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-md bg-secondary">
                      <Icon className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-sm leading-6">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="app-grid px-4 pb-14 sm:px-6 lg:px-8">
          <Card className="border-border/70 bg-card shadow-sm">
            <CardContent className="px-6 py-10 text-center sm:px-10">
              <div className="space-y-5">
                <h3 className="text-3xl font-semibold tracking-tight text-foreground">Start from the same backend, with a frontend that feels intentional.</h3>
                <p className="mx-auto max-w-2xl text-lg leading-8 text-muted-foreground">
                  Sign in and move through the workflows for subjects, assessments, planning, progress, and notifications.
                </p>
                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                  <Button size="lg" onClick={() => router.push('/dashboard')} className="rounded-md">
                    Open workspace
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => router.push('/planner')} className="rounded-md">
                    Plan study
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border/70 bg-background py-8">
        <div className="app-grid flex flex-col items-center justify-between gap-3 px-4 text-sm text-muted-foreground sm:px-6 lg:flex-row lg:px-8">
          <p>&copy; 2026 PulsePlan. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/dashboard" className="transition hover:text-foreground">
              Workspace
            </Link>
            <Link href="/planner" className="transition hover:text-foreground">
              Planner
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
