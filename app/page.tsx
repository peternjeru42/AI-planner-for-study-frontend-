'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Calendar,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';

import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const featureCards = [
  {
    icon: Zap,
    title: 'Smart Scheduling',
    description: 'Build focused study blocks around deadlines, effort, and the time you actually have.',
    tint: 'from-amber-500/20 to-orange-500/10',
  },
  {
    icon: BarChart3,
    title: 'Progress Visibility',
    description: 'Track completion, study hours, and subject momentum with clear visual feedback.',
    tint: 'from-emerald-500/20 to-teal-500/10',
  },
  {
    icon: Calendar,
    title: 'Calendar-Ready Planning',
    description: 'See assessments and study sessions together so deadlines stop sneaking up on you.',
    tint: 'from-sky-500/20 to-cyan-500/10',
  },
  {
    icon: ShieldCheck,
    title: 'Structured Control',
    description: 'Keep academic work organized with predictable workflows for subjects, tasks, and sessions.',
    tint: 'from-fuchsia-500/20 to-rose-500/10',
  },
];

const heroStats = [
  { label: 'Focus sessions', value: 'Personalized' },
  { label: 'Deadline visibility', value: 'Real-time' },
  { label: 'Study flow', value: 'Adaptive' },
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
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_24%),linear-gradient(180deg,#ffffff_0%,#f8fafc_55%,#eef6ff_100%)]">
      <div className="absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[linear-gradient(180deg,rgba(59,130,246,0.08),rgba(255,255,255,0))]" />

      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 shadow-[0_14px_30px_-14px_rgba(37,99,235,0.85)]">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-sky-700 uppercase">StudyFlow</p>
              <p className="text-xs text-slate-500">AI study planning platform</p>
            </div>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">
              Stories
            </Link>
            <Button
              onClick={() => router.push('/login')}
              variant="outline"
              size="sm"
              className="cursor-pointer border-slate-300 bg-white text-slate-800 transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700"
            >
              Sign In
            </Button>
            <Button
              onClick={() => router.push('/signup')}
              size="sm"
              className="cursor-pointer bg-slate-950 text-white shadow-[0_14px_30px_-16px_rgba(15,23,42,0.9)] transition hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-[0_18px_36px_-18px_rgba(2,132,199,0.85)]"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <main>
        <section className="mx-auto grid max-w-7xl gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:pb-28 lg:pt-24">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Personalized planning for serious students
            </div>

            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Study with more structure,
                <span className="block bg-gradient-to-r from-sky-600 via-blue-700 to-emerald-600 bg-clip-text text-transparent">
                  less stress, and better timing.
                </span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                Plan assessments, generate focused study sessions, track real progress, and stay ahead with a study workflow that feels intentional from the first deadline to the final exam.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => router.push('/login?demo=student')}
                className="group cursor-pointer rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 px-7 text-white shadow-[0_20px_45px_-22px_rgba(37,99,235,0.95)] transition hover:-translate-y-0.5 hover:from-sky-500 hover:to-blue-600 hover:shadow-[0_24px_50px_-20px_rgba(14,165,233,0.85)]"
              >
                Explore Student Workspace
                <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/login?demo=admin')}
                className="cursor-pointer rounded-2xl border-slate-300 bg-white/85 px-7 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
              >
                Explore Admin Overview
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {heroStats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/70 bg-white/80 px-5 py-4 shadow-[0_20px_45px_-32px_rgba(15,23,42,0.45)] backdrop-blur">
                  <p className="text-lg font-semibold text-slate-900">{item.value}</p>
                  <p className="text-sm text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-10 top-12 h-24 w-24 rounded-full bg-emerald-300/40 blur-3xl" />
            <div className="absolute -right-8 top-4 h-28 w-28 rounded-full bg-sky-300/40 blur-3xl" />

            <Card className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 shadow-[0_36px_90px_-40px_rgba(15,23,42,0.5)] backdrop-blur">
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-sky-600 via-blue-700 to-emerald-500" />
              <CardHeader className="relative space-y-4 pb-5 pt-6 text-white">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                  <BrainCircuit className="h-3.5 w-3.5" />
                  Weekly preview
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">This week&apos;s study rhythm</CardTitle>
                  <CardDescription className="mt-2 text-sky-100">
                    A cleaner balance between assessments, revision, and protected focus blocks.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-5 pb-6">
                {[
                  { subject: 'Algorithms', task: 'Exam prep sprint', time: 'Mon 7:00 PM', color: 'bg-sky-500' },
                  { subject: 'Database Systems', task: 'Assignment milestone', time: 'Wed 6:30 PM', color: 'bg-emerald-500' },
                  { subject: 'AI Fundamentals', task: 'Revision and quiz review', time: 'Fri 5:30 PM', color: 'bg-violet-500' },
                ].map((item) => (
                  <div key={item.subject} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition hover:border-slate-300 hover:bg-white">
                    <div className={`mt-1 h-3 w-3 shrink-0 rounded-full ${item.color}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">{item.task}</p>
                      <p className="text-sm text-slate-500">{item.subject}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <Clock3 className="h-3.5 w-3.5" />
                      {item.time}
                    </div>
                  </div>
                ))}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-950 p-5 text-white">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Projected completion</p>
                    <p className="mt-2 text-3xl font-bold">86%</p>
                    <p className="mt-2 text-sm text-slate-300">StudyFlow keeps the week achievable without overloading your calendar.</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                    <div className="mb-3 flex items-center gap-2 text-emerald-700">
                      <Target className="h-4 w-4" />
                      <span className="text-sm font-semibold">Priority alignment</span>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" />Urgent work scheduled first</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" />Sessions spaced for recovery</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" />Deadlines visible at a glance</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-14 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Features</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">A planning system that looks polished and works like a real academic command center.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className={`overflow-hidden border border-slate-200 bg-gradient-to-b ${feature.tint} shadow-[0_22px_40px_-30px_rgba(15,23,42,0.45)] transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_28px_52px_-28px_rgba(14,165,233,0.28)]`}
                >
                  <CardHeader className="space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/85 shadow-sm">
                      <Icon className="h-6 w-6 text-slate-900" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-slate-950">{feature.title}</CardTitle>
                      <CardDescription className="mt-2 text-sm leading-6 text-slate-600">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        <section id="testimonials" className="border-y border-slate-200/80 bg-white/60 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-14 max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Student stories</p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Confident planning creates calmer semesters.</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  name: 'Emily Chen',
                  role: 'Computer Science Major',
                  quote: 'StudyFlow gave me a clear weekly plan instead of a constant feeling that I was behind.',
                },
                {
                  name: 'Marcus Johnson',
                  role: 'Pre-Med Student',
                  quote: 'Seeing deadlines and study blocks in one flow made my workload feel manageable for the first time.',
                },
                {
                  name: 'Sophia Martinez',
                  role: 'Engineering Student',
                  quote: 'The scheduling logic helps me protect deep-work time instead of reacting to deadlines at the last minute.',
                },
              ].map((testimonial) => (
                <Card key={testimonial.name} className="rounded-3xl border border-slate-200 bg-white/90 shadow-[0_24px_50px_-34px_rgba(15,23,42,0.4)]">
                  <CardContent className="pt-6">
                    <p className="text-base leading-7 text-slate-700">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="mt-6 border-t border-slate-100 pt-4">
                      <p className="font-semibold text-slate-950">{testimonial.name}</p>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <Card className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-[0_36px_90px_-40px_rgba(15,23,42,0.8)]">
            <CardContent className="relative px-6 py-12 text-center sm:px-10 lg:px-16">
              <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.34),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.24),_transparent_32%)]" />
              <div className="relative space-y-6">
                <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to make your study plan feel deliberate?</h3>
                <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-300">
                  Start with a structured workspace that helps you plan better, study earlier, and follow through consistently.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    onClick={() => router.push('/signup')}
                    className="cursor-pointer rounded-2xl bg-white px-7 text-slate-950 transition hover:-translate-y-0.5 hover:bg-sky-100 hover:text-sky-800"
                  >
                    Create Your Account
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => router.push('/login')}
                    className="cursor-pointer rounded-2xl border-white/30 bg-white/10 px-7 text-white transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-500/20"
                  >
                    Sign In
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 bg-white/70 py-10 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-500 sm:px-6 lg:flex-row lg:px-8">
          <p>&copy; 2024 StudyFlow. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/login" className="transition hover:text-slate-900">
              Sign In
            </Link>
            <Link href="/signup" className="transition hover:text-slate-900">
              Get Started
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
