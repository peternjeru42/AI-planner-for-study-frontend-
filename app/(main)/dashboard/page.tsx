'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
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
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6">
      <WelcomeCard user={user} />

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Tasks"
          value={pendingAssessments}
          description="Assessments to complete"
          icon={<AlertCircle className="w-8 h-8 text-amber-500" />}
        />
        <StatCard
          title="Completed"
          value={completedAssessments}
          description="Assessments finished"
          icon={<CheckCircle2 className="w-8 h-8 text-green-500" />}
        />
        <StatCard
          title="Study Hours"
          value={totalStudyHours.toFixed(1)}
          description="Hours logged this week"
          icon={<Clock className="w-8 h-8 text-blue-500" />}
        />
        <StatCard
          title="Completion Rate"
          value={`${Math.round(completionRate)}%`}
          description="Overall progress"
          icon={<TrendingUp className="w-8 h-8 text-purple-500" />}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>This Week&apos;s Study Time</CardTitle>
              <CardDescription>Hours studied per day</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading chart...</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
                    <YAxis stroke="var(--color-muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                      }}
                    />
                    <Bar dataKey="hours" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assessment Status Distribution</CardTitle>
              <CardDescription>Overview of all assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-secondary rounded-lg">
                  <p className="text-2xl font-bold text-foreground">{pendingAssessments}</p>
                  <p className="text-xs text-muted-foreground mt-1">Pending</p>
                </div>
                <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {upcomingDeadlines.filter((assessment) => assessment.status === 'in-progress').length}
                  </p>
                  <p className="text-xs text-blue-600/70 mt-1">In Progress</p>
                </div>
                <div className="text-center p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{completedAssessments}</p>
                  <p className="text-xs text-green-600/70 mt-1">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today&apos;s Sessions</CardTitle>
              <CardDescription>{todaySessions.length} scheduled</CardDescription>
            </CardHeader>
            <CardContent>
              {todaySessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No sessions scheduled for today</p>
              ) : (
                <div className="space-y-2">
                  {todaySessions.slice(0, 3).map((session) => (
                    <div key={session.id} className="p-2 bg-secondary rounded-lg text-sm">
                      <p className="font-medium text-foreground text-xs truncate">{session.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {DateUtils.formatTime(new Date(session.startTime))} - {DateUtils.formatTime(new Date(session.endTime))}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
              <CardDescription>{upcomingDeadlines.length} coming up</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingDeadlines.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
                ) : (
                  upcomingDeadlines.slice(0, 4).map((assessment) => {
                    const daysLeft = DateUtils.daysUntil(new Date(assessment.dueDate));
                    return (
                      <div key={assessment.id} className="p-3 border border-border rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">{assessment.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {daysLeft === 0 ? 'Today' : `in ${daysLeft} days`}
                            </p>
                          </div>
                          <Badge variant={daysLeft <= 3 ? 'destructive' : 'secondary'} className="shrink-0">
                            {assessment.priority || 'planned'}
                          </Badge>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
