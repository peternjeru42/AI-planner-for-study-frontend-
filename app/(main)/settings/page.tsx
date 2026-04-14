'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, LogOut } from 'lucide-react';

import { authApi } from '@/lib/api';
import { useAuth } from '@/lib/contexts/AuthContext';
import { StudyPreferences } from '@/lib/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  const { user, profile, updateAuthState, logout } = useAuth();
  const [preferences, setPreferences] = useState<StudyPreferences | null>(profile);
  const [savedMessage, setSavedMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const buildDefaultPreferences = (userId: string): StudyPreferences => ({
    userId,
    startTime: '08:00',
    endTime: '22:00',
    sessionLength: 60,
    breakLength: 15,
    maxSessionsPerDay: 6,
    weekendAvailable: true,
    enableInAppNotifications: true,
    enableEmailNotificationsSimulated: true,
    darkMode: false,
    timezone: 'Africa/Nairobi',
  });

  useEffect(() => {
    let ignore = false;

    const loadProfile = async () => {
      try {
        setError('');
        const payload = await authApi.me();
        if (!ignore) {
          updateAuthState(payload.user, payload.profile);
          setPreferences(payload.profile ?? buildDefaultPreferences(payload.user.id));
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to load settings');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      ignore = true;
    };
  }, [updateAuthState]);

  const handleSavePreferences = async () => {
    if (!preferences || !user) return;
    try {
      setError('');
      const payload = await authApi.updateProfile({
        name: user.name,
        ...preferences,
      });
      updateAuthState(payload.user, payload.profile);
      setPreferences(payload.profile);
      setSavedMessage('Preferences saved successfully.');
      window.setTimeout(() => setSavedMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save preferences');
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  if (loading || !user || !preferences) {
    return <div className="p-6 text-sm text-muted-foreground">Loading settings...</div>;
  }

  return (
    <div className="space-y-8">
      <section className="page-band">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Preferences</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Tune the study window, session pacing, and reminders.</h1>
          <p className="text-sm leading-7 text-muted-foreground">
            These settings shape how the planner behaves without touching the backend workflows behind it.
          </p>
        </div>
      </section>

      {savedMessage ? (
        <Alert className="border-primary/20 bg-primary/10">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary">{savedMessage}</AlertDescription>
        </Alert>
      ) : null}

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <Card className="border-border/70 bg-card shadow-sm">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Readonly account information from your current session.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Name</label>
                <Input value={user.name} disabled className="h-11 rounded-md" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input value={user.email} disabled className="h-11 rounded-md" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Role</label>
                <Input value={user.role} disabled className="h-11 rounded-md" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Member since</label>
                <Input value={user.enrollmentDate.toLocaleDateString()} disabled className="h-11 rounded-md" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card shadow-sm">
            <CardHeader>
              <CardTitle>Session management</CardTitle>
              <CardDescription>Sign out from the active account on this browser.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleLogout} className="rounded-md">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/70 bg-card shadow-sm">
            <CardHeader>
              <CardTitle>Study preferences</CardTitle>
              <CardDescription>Define the study window and the pacing the planner should respect.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Start time</label>
                  <Input type="time" value={preferences.startTime} onChange={(e) => setPreferences({ ...preferences, startTime: e.target.value })} className="h-11 rounded-md" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">End time</label>
                  <Input type="time" value={preferences.endTime} onChange={(e) => setPreferences({ ...preferences, endTime: e.target.value })} className="h-11 rounded-md" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Session length (minutes)</label>
                  <Input
                    type="number"
                    min="15"
                    max="180"
                    step="15"
                    value={preferences.sessionLength}
                    onChange={(e) => setPreferences({ ...preferences, sessionLength: Number(e.target.value) })}
                    className="h-11 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Break length (minutes)</label>
                  <Input
                    type="number"
                    min="5"
                    max="60"
                    step="5"
                    value={preferences.breakLength}
                    onChange={(e) => setPreferences({ ...preferences, breakLength: Number(e.target.value) })}
                    className="h-11 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Max sessions per day</label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={preferences.maxSessionsPerDay}
                    onChange={(e) => setPreferences({ ...preferences, maxSessionsPerDay: Number(e.target.value) })}
                    className="h-11 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Timezone</label>
                  <Input
                    value={preferences.timezone || 'Africa/Nairobi'}
                    onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                    className="h-11 rounded-md"
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 rounded-md border border-border/70 bg-muted/40 p-3">
                <input
                  type="checkbox"
                  checked={preferences.weekendAvailable}
                  onChange={(e) => setPreferences({ ...preferences, weekendAvailable: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border border-input"
                />
                <span className="text-sm leading-6 text-muted-foreground">
                  Allow study blocks on weekends when the planner needs extra room.
                </span>
              </label>

              <Button onClick={handleSavePreferences} className="rounded-md">
                Save preferences
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card shadow-sm">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Choose which reminder channels stay active.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-start gap-3 rounded-md border border-border/70 bg-muted/40 p-3">
                <input
                  type="checkbox"
                  checked={preferences.enableInAppNotifications ?? true}
                  onChange={(e) => setPreferences({ ...preferences, enableInAppNotifications: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border border-input"
                />
                <span className="text-sm leading-6 text-muted-foreground">Enable in-app reminders for sessions, deadlines, and summaries.</span>
              </label>
              <label className="flex items-start gap-3 rounded-md border border-border/70 bg-muted/40 p-3">
                <input
                  type="checkbox"
                  checked={preferences.enableEmailNotificationsSimulated ?? true}
                  onChange={(e) => setPreferences({ ...preferences, enableEmailNotificationsSimulated: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border border-input"
                />
                <span className="text-sm leading-6 text-muted-foreground">Enable simulated email reminders alongside the in-app feed.</span>
              </label>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
