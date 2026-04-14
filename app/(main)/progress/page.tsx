'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Clock3, TrendingUp } from 'lucide-react';

import { progressApi, subjectsApi } from '@/lib/api';
import { Progress, Subject } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProgressPage() {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [overview, setOverview] = useState({
    averageCompletionRate: 0,
    totalStudyHours: 0,
    totalSubjects: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      try {
        setError('');
        const [overviewData, progressData, subjectData] = await Promise.all([
          progressApi.overview(),
          progressApi.subjects(),
          subjectsApi.list(),
        ]);
        if (!ignore) {
          setOverview(overviewData);
          setProgress(progressData);
          setSubjects(subjectData);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to load progress');
        }
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const progressData = progress.map((item) => ({
    name: subjects.find((subject) => subject.id === item.subjectId)?.code || 'Unknown',
    completion: item.completionRate,
    hours: item.studyHours,
  }));

  return (
    <div className="space-y-8">
      <section className="page-band">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Progress</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Read progress by subject instead of relying on memory.</h1>
          <p className="text-sm leading-7 text-muted-foreground">
            Review completion rates, total study hours, and the subjects that still need steady effort before the next assessment wave.
          </p>
        </div>
      </section>

      {error ? <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/70 bg-card shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-3xl font-semibold text-foreground">{Math.round(overview.averageCompletionRate)}%</p>
                <p className="text-sm text-muted-foreground">Average completion</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Clock3 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-3xl font-semibold text-foreground">{overview.totalStudyHours}</p>
                <p className="text-sm text-muted-foreground">Total study hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Tracked subjects</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{overview.totalSubjects}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/70 bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Subject completion rates</CardTitle>
            <CardDescription>Completion percentage for every tracked subject.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="completion" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Subject detail</CardTitle>
            <CardDescription>See how much work is finished and how many hours are already invested.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {progress.map((item) => {
              const subject = subjects.find((candidate) => candidate.id === item.subjectId);
              return (
                <div key={item.subjectId} className="rounded-md border border-border/70 bg-muted/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: subject?.color }} />
                      <div>
                        <p className="font-medium text-foreground">{subject?.name}</p>
                        <p className="text-sm text-muted-foreground">{subject?.code}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{Math.round(item.completionRate)}%</p>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary transition-all duration-300" style={{ width: `${item.completionRate}%` }} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {item.completedAssignments} of {item.totalAssignments} complete
                    </span>
                    <span>{item.studyHours} hours logged</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
