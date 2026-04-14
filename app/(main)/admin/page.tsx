'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, BellRing, Calendar, CheckSquare, Users } from 'lucide-react';

import { dashboardApi } from '@/lib/api';
import { useAuth } from '@/lib/contexts/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type AuditLogEvent = {
  id: string;
  action: string;
  target_model: string;
  created_at: string;
};

type AdminDashboardData = {
  activeStudents: number;
  assessmentsCount: number;
  generatedPlansCount: number;
  notificationsCount: number;
  recentLogs?: {
    audit?: AuditLogEvent[];
  };
  schedulerJobStats?: {
    queued?: number;
    running?: number;
    completed?: number;
    failed?: number;
  };
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    let ignore = false;

    const loadDashboard = async () => {
      if (!user || user.role !== 'admin') return;
      try {
        const payload = await dashboardApi.admin();
        if (!ignore) {
          setData(payload);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to load admin dashboard');
        }
      }
    };

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, [user]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-8">
      <section className="page-band">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Operations</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Monitor the platform without digging through backend tools.</h1>
          <p className="text-sm leading-7 text-muted-foreground">
            The admin view keeps student counts, generated plans, notifications, scheduler state, and audit activity in a single surface.
          </p>
        </div>
      </section>

      {error ? <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div> : null}

      <div className="panel-grid">
        <StatCard
          title="Active students"
          value={data?.activeStudents ?? 0}
          description="Student accounts using the platform"
          icon={<Users className="h-6 w-6" />}
          accent="primary"
        />
        <StatCard
          title="Assessments"
          value={data?.assessmentsCount ?? 0}
          description="Assessments stored across the system"
          icon={<CheckSquare className="h-6 w-6" />}
          accent="accent"
        />
        <StatCard
          title="Generated plans"
          value={data?.generatedPlansCount ?? 0}
          description="Study plans created so far"
          icon={<Calendar className="h-6 w-6" />}
          accent="neutral"
        />
        <StatCard
          title="Notifications"
          value={data?.notificationsCount ?? 0}
          description="Messages currently stored in the backend"
          icon={<BellRing className="h-6 w-6" />}
          accent="primary"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-border/70 bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Recent audit activity</CardTitle>
            <CardDescription>Latest events coming back from the backend audit log feed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(data?.recentLogs?.audit ?? []).length === 0 ? (
              <div className="rounded-md border border-dashed border-border p-5 text-sm text-muted-foreground">
                No recent audit logs are available.
              </div>
            ) : (
              (data?.recentLogs?.audit ?? []).map((event) => (
                <div key={event.id} className="rounded-md border border-border/70 bg-muted/30 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{event.action}</p>
                      <p className="text-sm text-muted-foreground">{event.target_model}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(event.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Scheduler health</CardTitle>
            <CardDescription>Current state of queued and completed background jobs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Queued jobs', value: data?.schedulerJobStats?.queued ?? 0 },
              { name: 'Running jobs', value: data?.schedulerJobStats?.running ?? 0 },
              { name: 'Completed jobs', value: data?.schedulerJobStats?.completed ?? 0 },
              { name: 'Failed jobs', value: data?.schedulerJobStats?.failed ?? 0 },
            ].map((service) => (
              <div key={service.name} className="flex items-center justify-between rounded-md border border-border/70 bg-muted/30 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                    <Activity className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{service.name}</span>
                </div>
                <span className="rounded-md bg-card px-3 py-1 text-sm font-semibold text-foreground">{service.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
