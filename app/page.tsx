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
  },
  {
    icon: BarChart3,
    title: 'Progress Visibility',
    description: 'Track completion, study hours, and subject momentum with clear visual feedback.',
  },
  {
    icon: Calendar,
    title: 'Calendar-Ready Planning',
    description: 'See assessments and study sessions together so deadlines stop sneaking up on you.',
  },
  {
    icon: ShieldCheck,
    title: 'Structured Control',
    description: 'Keep academic work organized with predictable workflows for subjects, tasks, and sessions.',
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
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <nav className="border-b border-slate-300 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 rounded-md px-2 py-1 hover:bg-slate-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-600">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold">StudyFlow</p>
              <p className="text-xs text-slate-500">AI study planning platform</p>
            </div>
          </Link>

          <div className="hidden items-center gap-4 md:flex">
            <Link href="#features" className="text-sm text-slate-700 hover:underline">
              Features
            </Link>
            <Button
              onClick={() => router.push('/login')}
              variant="outline"
              size="sm"
              className="cursor-pointer border-slate-300 bg-white text-slate-900 hover:bg-slate-100"
            >
              Sign In
            </Button>
            <Button
              onClick={() => router.push('/signup')}
              size="sm"
              className="cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6 rounded-lg border border-slate-300 bg-white p-6">
            <div className="inline-flex items-center gap-2 rounded-md bg-blue-100 px-3 py-2 text-sm text-blue-700">
              <Sparkles className="h-4 w-4" />
              Personalized planning for serious students
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Ai powered study planner with assessment and deadlines tracking .</h1>
              <p className="text-base leading-7 text-slate-700">
                Plan assessments, generate focused study sessions, track real progress, and stay ahead with a study workflow that feels intentional from the first deadline to the final exam.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={() => router.push('/login?demo=student')}
                className="group cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
              >
                Explore Student Workspace
                <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/login?demo=admin')}
                className="cursor-pointer border-slate-300 bg-white text-slate-900 hover:bg-slate-100"
              >
                Explore Admin Overview
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {heroStats.map((item) => (
                <div key={item.label} className="rounded-md border border-slate-300 bg-slate-50 p-4">
                  <p className="text-lg font-semibold">{item.value}</p>
                  <p className="text-sm text-slate-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-slate-300 bg-white shadow-none">
            <CardHeader className="space-y-3 border-b border-slate-200 bg-slate-50">
              <div className="inline-flex w-fit items-center gap-2 rounded-md bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                <BrainCircuit className="h-3.5 w-3.5" />
                Weekly preview
              </div>
              <div>
                <CardTitle className="text-2xl">This week&apos;s study rhythm</CardTitle>
                <CardDescription className="mt-2 text-black">
                  A cleaner balance between assessments, revision, and protected focus blocks.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {[
                { subject: 'Algorithms', task: 'Exam prep sprint', time: 'Mon 7:00 PM', color: 'bg-blue-500' },
                { subject: 'Database Systems', task: 'Assignment milestone', time: 'Wed 6:30 PM', color: 'bg-green-500' },
                { subject: 'AI Fundamentals', task: 'Revision and quiz review', time: 'Fri 5:30 PM', color: 'bg-purple-500' },
              ].map((item) => (
                <div key={item.subject} className="flex items-start gap-3 rounded-md border border-slate-300 bg-slate-50 p-4">
                  <div className={`mt-1 h-3 w-3 rounded-full ${item.color}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{item.task}</p>
                    <p className="text-sm text-slate-600">{item.subject}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Clock3 className="h-3.5 w-3.5" />
                    {item.time}
                  </div>
                </div>
              ))}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-md border border-slate-300 bg-slate-900 p-5 text-white">
                  <p className="text-xs uppercase tracking-wide text-slate-300">Projected completion</p>
                  <p className="mt-2 text-3xl font-bold">86%</p>
                  <p className="mt-2 text-sm text-slate-300">StudyFlow keeps the week achievable without overloading your calendar.</p>
                </div>
                <div className="rounded-md border border-slate-300 bg-slate-50 p-5">
                  <div className="mb-3 flex items-center gap-2 text-slate-800">
                    <Target className="h-4 w-4" />
                    <span className="text-sm font-semibold">Priority alignment</span>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600" />Urgent work scheduled first</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600" />Sessions spaced for recovery</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600" />Deadlines visible at a glance</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="features" className="py-14">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">Features</p>
            <h2 className="text-3xl font-bold">A planning system that looks polished and works like a real academic command center.</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-slate-300 bg-white shadow-none">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-md bg-slate-100">
                      <Icon className="h-6 w-6 text-slate-900" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-sm leading-6 text-slate-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="py-8">
          <Card className="border-slate-300 bg-white shadow-none">
            <CardContent className="px-6 py-10 text-center">
              <div className="space-y-5">
                <h3 className="text-3xl font-bold">Ready to make your study plan feel deliberate?</h3>
                <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-700">
                  Start with a structured workspace that helps you plan better, study earlier, and follow through consistently.
                </p>
                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    onClick={() => router.push('/signup')}
                    className="cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Create Your Account
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => router.push('/login')}
                    className="cursor-pointer border-slate-300 bg-white text-slate-900 hover:bg-slate-100"
                  >
                    Sign In
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-slate-300 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-600 sm:px-6 lg:flex-row lg:px-8">
          <p>&copy; 2026 StudyFlow. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/login" className="hover:underline">
              Sign In
            </Link>
            <Link href="/signup" className="hover:underline">
              Get Started
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
