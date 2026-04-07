'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, BookOpen, CheckCircle, Eye, EyeOff, Lock } from 'lucide-react';

import { useAuth } from '@/lib/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from '@/components/ui/input-group';

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
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/30 to-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">StudyFlow</h1>
          <p className="text-sm text-muted-foreground">Create your account</p>
        </div>

        <Card className="border border-border">
          <CardHeader className="space-y-1">
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Join StudyFlow and start planning your studies</CardDescription>
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
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isSubmitting}
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
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <InputGroup className="h-14 rounded-2xl border-slate-300 bg-white shadow-[0_10px_30px_-24px_rgba(15,23,42,0.6)] transition focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-100">
                  <InputGroupAddon align="inline-start" className="pl-4 text-slate-400">
                    <InputGroupText>
                      <Lock className="h-5 w-5" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={isSubmitting}
                    className="h-14 rounded-2xl px-2 text-base placeholder:text-slate-400"
                  />
                  <InputGroupAddon align="inline-end" className="pr-3 text-slate-500">
                    <InputGroupButton
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="cursor-pointer rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      onClick={() => setShowPassword((current) => !current)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                <InputGroup className="h-14 rounded-2xl border-slate-300 bg-white shadow-[0_10px_30px_-24px_rgba(15,23,42,0.6)] transition focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-100">
                  <InputGroupAddon align="inline-start" className="pl-4 text-slate-400">
                    <InputGroupText>
                      <Lock className="h-5 w-5" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    disabled={isSubmitting}
                    className="h-14 rounded-2xl px-2 text-base placeholder:text-slate-400"
                  />
                  <InputGroupAddon align="inline-end" className="pr-3 text-slate-500">
                    <InputGroupButton
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="cursor-pointer rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      onClick={() => setShowConfirmPassword((current) => !current)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  disabled={isSubmitting}
                  className="w-4 h-4 border border-input rounded cursor-pointer"
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                  I agree to the <span className="font-medium text-primary">Terms and Conditions</span>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-[0_20px_45px_-22px_rgba(37,99,235,0.95)] transition hover:-translate-y-0.5 hover:from-sky-500 hover:to-blue-600 hover:shadow-[0_24px_50px_-20px_rgba(14,165,233,0.85)]"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <div className="text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account? <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent/5 border border-accent/30">
          <CardContent className="pt-4 space-y-3">
            {[
              'Personalized study schedules',
              'Real-time progress tracking',
              'Assessment management',
              'Interactive calendar',
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                <span className="text-foreground">{benefit}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
