'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowRight, BookOpen, CheckCircle2, Sparkles } from 'lucide-react';

import { useAuth } from '@/lib/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

function AuthLoadingState() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const demo = searchParams.get('demo');
    if (demo === 'student') {
      setEmail('student@example.com');
      setPassword('demo123');
    } else if (demo === 'admin') {
      setEmail('admin@example.com');
      setPassword('demo123');
    }
  }, [searchParams]);

  useEffect(() => {
    if (user && !isLoading) {
      router.push(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const authenticatedUser = await login(email, password);
      router.push(authenticatedUser.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (role: 'student' | 'admin') => {
    setError('');
    setIsSubmitting(true);

    try {
      const demoEmail = role === 'student' ? 'student@example.com' : 'admin@example.com';
      const authenticatedUser = await login(demoEmail, 'demo123');
      router.push(authenticatedUser.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <AuthLoadingState />;
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="app-grid grid min-h-[calc(100vh-4rem)] items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden rounded-lg border border-border/70 lg:block">
          <Image src="/placeholder.jpg" alt="Focused student working through a study session" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,24,28,0.88),rgba(7,24,28,0.52),rgba(7,24,28,0.22))]" />
          <div className="relative flex h-full flex-col justify-between p-8 text-white">
            <div>
              <Link href="/" className="inline-flex items-center gap-3 rounded-md bg-white/10 px-3 py-2 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/15">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-base font-semibold">PulsePlan</p>
                  <p className="text-xs text-white/70">Adaptive study planning workspace</p>
                </div>
              </Link>
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-amber-300" />
                Keep the week readable before deadlines tighten
              </div>
              <div className="space-y-3">
                <h1 className="max-w-xl text-4xl font-semibold leading-tight">Sign back in and pick up your study plan where you left it.</h1>
                  <p className="max-w-xl text-base leading-7 text-white/80">
                  Subjects, assessments, study sessions, reminders, progress, and settings all stay aligned to the same backend data.
                </p>
              </div>
              <div className="grid gap-3">
                {[
                  'Use the student demo to inspect the full study workflow.',
                  'Use the admin demo to review platform-wide activity.',
                  'The frontend is refreshed without changing backend behavior.',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 rounded-md border border-white/15 bg-white/10 p-3 text-sm text-white/90 backdrop-blur-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-2">
              <Link href="/" className="inline-flex items-center gap-3 rounded-md px-2 py-1 transition hover:bg-secondary/60 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
                  <BookOpen className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">PulsePlan</p>
                  <p className="text-xs text-muted-foreground">Adaptive study planning workspace</p>
                </div>
              </Link>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Sign in</p>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">Return to your planning workspace.</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Access subjects, assessments, progress, notifications, and your latest plan from one place.
              </p>
            </div>

            <Card className="border-border/70 bg-card shadow-sm">
              <CardHeader className="space-y-1">
                <CardTitle>Account access</CardTitle>
                <CardDescription>Use your own account or jump into the demo workspaces.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      className="h-11 rounded-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSubmitting}
                      className="h-11 rounded-md"
                    />
                  </div>

                  <Button type="submit" className="h-11 w-full rounded-md" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in...' : 'Enter workspace'}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Quick demos</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button type="button" variant="outline" onClick={() => handleDemoLogin('student')} disabled={isSubmitting} className="rounded-md">
                    Student demo
                  </Button>
                  <Button type="button" variant="outline" onClick={() => handleDemoLogin('admin')} disabled={isSubmitting} className="rounded-md">
                    Admin demo
                  </Button>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    Need an account?{' '}
                    <Link href="/signup" className="font-medium text-primary transition hover:text-primary/80">
                      Create one
                    </Link>
                  </p>
                  <Link href="/" className="inline-flex items-center gap-1 font-medium text-primary transition hover:text-primary/80">
                    Back to overview
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthLoadingState />}>
      <LoginPageContent />
    </Suspense>
  );
}
