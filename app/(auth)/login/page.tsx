'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, BookOpen } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/30 to-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">StudyFlow</h1>
          <p className="text-sm text-muted-foreground">Sign in to your account</p>
        </div>

        <Card className="border border-border">
          <CardHeader className="space-y-1">
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to continue planning, tracking, and managing your study workflow.</CardDescription>
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
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or try demo</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" onClick={() => handleDemoLogin('student')} disabled={isSubmitting}>
                Student Demo
              </Button>
              <Button type="button" variant="outline" onClick={() => handleDemoLogin('admin')} disabled={isSubmitting}>
                Admin Demo
              </Button>
            </div>

            <div className="space-y-2 text-center text-sm">
              <p className="text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-medium text-primary hover:underline">
                  Sign up
                </Link>
              </p>
              <Link href="/" className="font-medium text-primary hover:underline">
                Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
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
