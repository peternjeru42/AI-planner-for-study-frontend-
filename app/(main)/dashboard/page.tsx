'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, LineChart, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { dashboardApi } from '@/lib/api';
import { Assessment, StudySession } from '@/lib/types';
import { useAuth } from '@/lib/contexts/AuthContext';
import { DateUtils } from '@/lib/utils/date';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { WelcomeCard } from '@/components/dashboard/WelcomeCard';

type DashboardPayload = {
  welcomeInfo: { name: string; role: string };
  todaySessions: StudySession[];
  upcomingDeadlines: Assessment[];
  overdueCount: number;
  statsCards: {
    averageCompletionRate?: number;
    completedAssessments: number;
    pendingAssessments: number;
    totalStudyHours?: number;
  };
  quickChartData: Array<{ day: string; studyMinutes: number }>;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    try {
      setError('');
      const payload = await dashboardApi.student();
      setDashboard(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (!user) return null;

  const weeklyData =
    dashboard?.quickChartData.map((item) => ({
      day: item.day,
      hours: Number((item.studyMinutes / 60).toFixed(1)),
    })) ?? [];

  const todaySessions = dashboard?.todaySessions ?? [];
  const upcomingDeadlines = dashboard?.upcomingDeadlines ?? [];
  const pendingAssessments = dashboard?.statsCards.pendingAssessments ?? 0;
  const completedAssessments = dashboard?.statsCards.completedAssessments ?? 0;
  const totalStudyHours = dashboard?.statsCards.totalStudyHours ?? 0;
  const completionRate = dashboard?.statsCards.averageCompletionRate ?? 0;

  return (
    <div className="space-y-8">
      <WelcomeCard user={user} />

      {error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
      ) : null}

      <div className="panel-grid">
        <StatCard
          title="Pending assessments"
          value={pendingAssessments}
          description="Items still waiting for completion"
          icon={<AlertCircle className="h-6 w-6" />}
          accent="accent"
        />
        <StatCard
          title="Completed work"
          value={completedAssessments}
          description="Assessments already finished"
          icon={<CheckCircle2 className="h-6 w-6" />}
          accent="primary"
        />
        <StatCard
          title="Study hours"
          value={totalStudyHours.toFixed(1)}
          description="Hours recorded in the current week"
          icon={<Clock className="h-6 w-6" />}
          accent="neutral"
        />
        <StatCard
          title="Completion rate"
          value={`${Math.round(completionRate)}%`}
          description="Average delivery across tracked work"
          icon={<TrendingUp className="h-6 w-6" />}
          accent="primary"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <Card className="border-border/70 bg-card shadow-sm">
            <CardHeader>
              <CardTitle>This week&apos;s study load</CardTitle>
              <CardDescription>Hours completed across the last seven days.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading chart...</p>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
                    <YAxis stroke="var(--color-muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="hours" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card shadow-sm">
            <CardHeader>
              <CardTitle>Assessment status mix</CardTitle>
              <CardDescription>A quick split of what still needs attention versus what is already done.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-md border border-border/70 bg-muted/40 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Pending</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">{pendingAssessments}</p>
                <p className="mt-2 text-sm text-muted-foreground">Still in the queue.</p>
              </div>
              <div className="rounded-md border border-border/70 bg-secondary/55 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-foreground/75">In progress</p>
                <p className="mt-3 text-3xl font-semibold text-secondary-foreground">
                  {upcomingDeadlines.filter((assessment) => assessment.status === 'in-progress').length}
                </p>
                <p className="mt-2 text-sm text-secondary-foreground/70">Already underway.</p>
              </div>
              <div className="rounded-md border border-border/70 bg-primary/10 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">Completed</p>
                <p className="mt-3 text-3xl font-semibold text-primary">{completedAssessments}</p>
                <p className="mt-2 text-sm text-muted-foreground">Ready to archive mentally.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/70 bg-card shadow-sm">
            <CardHeader>
              <CardTitle>Today&apos;s sessions</CardTitle>
              <CardDescription>{todaySessions.length} session{todaySessions.length === 1 ? '' : 's'} on deck.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaySessions.length === 0 ? (
                <div className="rounded-md border border-dashed border-border p-5 text-sm text-muted-foreground">
                  No study sessions are scheduled for today.
                </div>
              ) : (
                todaySessions.slice(0, 4).map((session) => (
                  <div key={session.id} className="rounded-md border border-border/70 bg-muted/30 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{session.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {DateUtils.formatTime(new Date(session.startTime))} - {DateUtils.formatTime(new Date(session.endTime))}
                        </p>
                      </div>
                      <Badge variant="outline" className="rounded-md">
                        {session.duration} min
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card shadow-sm">
            <CardHeader>
              <CardTitle>Upcoming deadlines</CardTitle>
              <CardDescription>What needs attention next.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingDeadlines.length === 0 ? (
                <div className="rounded-md border border-dashed border-border p-5 text-sm text-muted-foreground">
                  No upcoming deadlines are visible right now.
                </div>
              ) : (
                upcomingDeadlines.slice(0, 5).map((assessment) => {
                  const daysLeft = DateUtils.daysUntil(new Date(assessment.dueDate));
                  return (
                    <div key={assessment.id} className="rounded-md border border-border/70 bg-card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{assessment.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {daysLeft === 0 ? 'Due today' : daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `Due in ${daysLeft} days`}
                          </p>
                        </div>
                        <Badge variant={daysLeft <= 3 ? 'destructive' : 'secondary'} className="rounded-md">
                          {assessment.priority || 'planned'}
                        </Badge>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card shadow-sm">
            <CardHeader>
              <CardTitle>Readout</CardTitle>
              <CardDescription>One glance before you switch tabs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between rounded-md border border-border/70 bg-muted/30 p-3">
                <span>Hours already logged</span>
                <span className="font-semibold text-foreground">{totalStudyHours.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border/70 bg-muted/30 p-3">
                <span>Sessions today</span>
                <span className="font-semibold text-foreground">{todaySessions.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border/70 bg-muted/30 p-3">
                <span>Completion trend</span>
                <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                  <LineChart className="h-4 w-4 text-primary" />
                  {Math.round(completionRate)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
