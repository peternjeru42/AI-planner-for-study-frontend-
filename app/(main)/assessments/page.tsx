'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Edit2, Plus, Search, Trash2 } from 'lucide-react';

import { assessmentsApi, subjectsApi } from '@/lib/api';
import { Assessment, Subject } from '@/lib/types';
import { DateUtils } from '@/lib/utils/date';
import { ASSESSMENT_STATUSES, ASSESSMENT_TYPES } from '@/lib/utils/constants';
import AssessmentForm from '@/components/assessments/AssessmentForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setError('');
      const [nextAssessments, nextSubjects] = await Promise.all([assessmentsApi.list(), subjectsApi.list()]);
      setAssessments(nextAssessments);
      setSubjects(nextSubjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assessments');
    }
  };

  useEffect(() => {
    let ignore = false;

    const bootstrap = async () => {
      try {
        const [nextAssessments, nextSubjects] = await Promise.all([assessmentsApi.list(), subjectsApi.list()]);
        if (!ignore) {
          setError('');
          setAssessments(nextAssessments);
          setSubjects(nextSubjects);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to load assessments');
        }
      }
    };

    void bootstrap();

    return () => {
      ignore = true;
    };
  }, []);

  const handleAddAssessment = async (assessment: Partial<Assessment>) => {
    try {
      await assessmentsApi.create(assessment);
      await loadData();
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create assessment');
    }
  };

  const handleUpdateAssessment = async (id: string, updates: Partial<Assessment>) => {
    try {
      await assessmentsApi.update(id, updates);
      await loadData();
      setEditingAssessment(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update assessment');
    }
  };

  const handleDeleteAssessment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assessment?')) return;
    try {
      await assessmentsApi.remove(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete assessment');
    }
  };

  const getSubjectName = (subjectId: string) => subjects.find((subject) => subject.id === subjectId)?.name || 'Unknown';

  const filteredAssessments = useMemo(
    () =>
      assessments.filter((assessment) => {
        const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !filterStatus || assessment.status === filterStatus;
        return matchesSearch && matchesStatus;
      }),
    [assessments, filterStatus, searchTerm],
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-primary" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <section className="page-band">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Assessments</p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Track every deadline in one readable queue.</h1>
            <p className="text-sm leading-7 text-muted-foreground">
              Sort by status, search by title, and keep submissions visible enough to plan around before they become urgent.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingAssessment(null);
              setShowForm(true);
            }}
            className="rounded-md"
          >
            <Plus className="h-4 w-4" />
            New assessment
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/70 bg-card shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Total items</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{assessments.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Pending</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{assessments.filter((item) => item.status === 'pending').length}</p>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">In progress</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{assessments.filter((item) => item.status === 'in-progress').length}</p>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Completed</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{assessments.filter((item) => item.status === 'completed').length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex w-full flex-col gap-3 md:flex-row">
          <div className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search assessments"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 rounded-md pl-10"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All statuses</option>
            {ASSESSMENT_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>

      {showForm ? (
        <Card className="border-border/70 bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Create assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <AssessmentForm subjects={subjects} onSubmit={handleAddAssessment} onCancel={() => setShowForm(false)} />
          </CardContent>
        </Card>
      ) : null}

      {editingAssessment ? (
        <Card className="border-border/70 bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Edit assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <AssessmentForm
              initialData={editingAssessment}
              subjects={subjects}
              onSubmit={(assessment) => handleUpdateAssessment(editingAssessment.id, assessment)}
              onCancel={() => setEditingAssessment(null)}
            />
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-border/70 bg-card shadow-sm">
        <CardContent className="pt-6">
          {filteredAssessments.length === 0 ? (
            <div className="rounded-md border border-dashed border-border py-14 text-center text-sm text-muted-foreground">
              No assessments matched this view.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Assessment</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Subject</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Type</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Due</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssessments.map((assessment) => {
                    const daysLeft = DateUtils.daysUntil(new Date(assessment.dueDate));
                    return (
                      <tr key={assessment.id} className="border-b border-border/70 transition hover:bg-muted/30">
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">{assessment.title}</p>
                            <p className="text-xs text-muted-foreground">{assessment.priority || 'No priority set'}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-foreground">{getSubjectName(assessment.subjectId)}</td>
                        <td className="px-4 py-4">
                          <Badge variant="outline" className="rounded-md">
                            {ASSESSMENT_TYPES.find((type) => type.value === assessment.type)?.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-sm text-foreground">
                          {DateUtils.formatDate(new Date(assessment.dueDate))}
                          <p className="mt-1 text-xs text-muted-foreground">
                            {daysLeft === 0 ? 'Due today' : daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(assessment.status)}
                            <Badge variant={assessment.status === 'completed' ? 'default' : 'secondary'} className="rounded-md">
                              {ASSESSMENT_STATUSES.find((status) => status.value === assessment.status)?.label ?? assessment.status}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setShowForm(false);
                                setEditingAssessment(assessment);
                              }}
                              className="rounded-md border border-border/70 p-2 transition hover:bg-secondary"
                            >
                              <Edit2 className="h-4 w-4 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => handleDeleteAssessment(assessment.id)}
                              className="rounded-md border border-destructive/20 p-2 transition hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
