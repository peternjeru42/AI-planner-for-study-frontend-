'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, BookOpen, CheckCircle, Eye, EyeOff, Lock } from 'lucide-react';

import { useAuth } from '@/lib/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function SignupPage() {
  const router = useRouter();
  const { user, signup, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user && !isLoading) {
      router.push(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, isLoading, router]);

  const validateForm = (): boolean => {
    setError('');

    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const createdUser = await signup(formData.email, formData.password, formData.name);
      router.push(createdUser.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="app-grid grid min-h-[calc(100vh-4rem)] items-stretch gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="flex items-center justify-center">
          <div className="w-full max-w-xl space-y-6">
            <div className="space-y-2">
              <Link href="/" className="inline-flex items-center gap-3 rounded-md px-2 py-1 transition hover:bg-secondary/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
                  <BookOpen className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">PulsePlan</p>
                  <p className="text-xs text-muted-foreground">Adaptive study planning workspace</p>
                </div>
              </Link>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Create account</p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">Open a workspace built for real coursework.</h1>
              <p className="text-sm leading-6 text-muted-foreground">
                Create your account, keep all existing planning features, and start organizing subjects, deadlines, sessions, and reminders in one place.
              </p>
            </div>

            <Card className="border-border/70 bg-card shadow-sm">
              <CardHeader className="space-y-1">
                <CardTitle>Set up access</CardTitle>
                <CardDescription>Your new account will open directly into the main study workspace.</CardDescription>
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
                    <label className="text-sm font-medium text-foreground">Full name</label>
                    <Input
                      type="text"
                      placeholder="Jordan Kim"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={isSubmitting}
                      className="h-11 rounded-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={isSubmitting}
                      className="h-11 rounded-md"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Password</label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          disabled={isSubmitting}
                          className="h-11 rounded-md pl-9 pr-11"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                          onClick={() => setShowPassword((current) => !current)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Confirm password</label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Repeat the password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          disabled={isSubmitting}
                          className="h-11 rounded-md pl-9 pr-11"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                          onClick={() => setShowConfirmPassword((current) => !current)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 rounded-md border border-border/70 bg-muted/40 p-3">
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                      disabled={isSubmitting}
                      className="mt-1 h-4 w-4 rounded border border-input"
                    />
                    <span className="text-sm leading-6 text-muted-foreground">
                      I agree to the <span className="font-medium text-foreground">terms and conditions</span>.
                    </span>
                  </label>

                  <Button type="submit" className="h-11 w-full rounded-md" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating account...' : 'Create workspace'}
                  </Button>
                </form>

                <div className="text-sm text-muted-foreground">
                  Already registered?{' '}
                  <Link href="/login" className="font-medium text-primary transition hover:text-primary/80">
                    Sign in
                  </Link>
                </div>
              </CardContent>
            </Card>

            <div className="text-xs text-muted-foreground">
              <Link href="/" className="transition hover:text-foreground">
                Back to overview
              </Link>
            </div>
          </div>
        </section>

        <section className="relative hidden overflow-hidden rounded-lg border border-border/70 lg:block">
          <Image src="/placeholder.jpg" alt="Student planning coursework on a laptop" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(10,22,25,0.14),rgba(10,22,25,0.56),rgba(10,22,25,0.88))]" />
          <div className="relative flex h-full flex-col justify-end p-8 text-white">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 text-emerald-300" />
                Keep every core feature while changing the entire frontend feel
              </div>

              <div className="space-y-3">
                <h2 className="max-w-xl text-4xl font-semibold leading-tight">
                  Start with a workspace that keeps deadlines, study sessions, and progress in the same conversation.
                </h2>
                <p className="max-w-xl text-base leading-7 text-white/80">
                  Once you sign up, you can move straight into subject setup, assessment planning, AI plan drafting, notification control, and progress review.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  'Subject and assessment management',
                  'AI-assisted study plan drafting',
                  'Progress and weekly visibility',
                  'Notification and preference controls',
                ].map((benefit) => (
                  <div key={benefit} className="flex items-start gap-2 rounded-md border border-white/15 bg-white/10 p-3 text-sm text-white/80 backdrop-blur-sm">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
