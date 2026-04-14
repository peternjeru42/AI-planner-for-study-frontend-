'use client';

import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Edit2, Plus, Search, Trash2 } from 'lucide-react';

import { subjectsApi } from '@/lib/api';
import { Subject } from '@/lib/types';
import SubjectForm from '@/components/subjects/SubjectForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [error, setError] = useState('');

  const loadSubjects = async () => {
    try {
      setError('');
      setSubjects(await subjectsApi.list());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subjects');
    }
  };

  useEffect(() => {
    let ignore = false;

    const bootstrap = async () => {
      try {
        const nextSubjects = await subjectsApi.list();
        if (!ignore) {
          setError('');
          setSubjects(nextSubjects);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to load subjects');
        }
      }
    };

    void bootstrap();

    return () => {
      ignore = true;
    };
  }, []);

  const handleAddSubject = async (subject: Subject) => {
    try {
      await subjectsApi.create(subject);
      await loadSubjects();
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create subject');
    }
  };

  const handleUpdateSubject = async (id: string, updates: Partial<Subject>) => {
    try {
      await subjectsApi.update(id, updates);
      await loadSubjects();
      setEditingSubject(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subject');
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subject?')) return;
    try {
      await subjectsApi.remove(id);
      await loadSubjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete subject');
    }
  };

  const filteredSubjects = useMemo(
    () =>
      subjects.filter(
        (subject) =>
          subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subject.code.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [subjects, searchTerm],
  );

  return (
    <div className="space-y-8">
      <section className="page-band">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Subjects</p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Keep every course visible, color-coded, and easy to update.</h1>
            <p className="text-sm leading-7 text-muted-foreground">
              This view keeps the subject catalog readable so assessments, plans, and progress still have a clean foundation.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingSubject(null);
              setShowForm(true);
            }}
            className="rounded-md"
          >
            <Plus className="h-4 w-4" />
            New subject
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/70 bg-card shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Total subjects</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{subjects.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Search matches</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{filteredSubjects.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Active editing</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{editingSubject ? '1' : '0'}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by subject name or code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 rounded-md pl-10"
          />
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>

      {showForm ? (
        <Card className="border-border/70 bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Create subject</CardTitle>
          </CardHeader>
          <CardContent>
            <SubjectForm onSubmit={handleAddSubject} onCancel={() => setShowForm(false)} />
          </CardContent>
        </Card>
      ) : null}

      {editingSubject ? (
        <Card className="border-border/70 bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Edit subject</CardTitle>
          </CardHeader>
          <CardContent>
            <SubjectForm
              initialData={editingSubject}
              onSubmit={(subject) => handleUpdateSubject(editingSubject.id, subject)}
              onCancel={() => setEditingSubject(null)}
            />
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredSubjects.length === 0 ? (
          <Card className="col-span-full border-border/70 bg-card shadow-sm">
            <CardContent className="py-14">
              <div className="text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">No subjects matched this view.</h3>
                  <p className="text-sm text-muted-foreground">Add a subject or widen the search terms.</p>
                </div>
                <Button onClick={() => setShowForm(true)} variant="outline" className="rounded-md">
                  <Plus className="mr-2 h-4 w-4" />
                  Add subject
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredSubjects.map((subject) => (
            <Card key={subject.id} className="border-border/70 bg-card shadow-sm transition hover:border-primary/30">
              <CardContent className="pt-6">
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-4 w-4 rounded-full" style={{ backgroundColor: subject.color }} />
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-foreground">{subject.name}</h3>
                        <p className="text-sm text-muted-foreground">{subject.code}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowForm(false);
                          setEditingSubject(subject);
                        }}
                        className="rounded-md border border-border/70 p-2 transition hover:bg-secondary"
                      >
                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(subject.id)}
                        className="rounded-md border border-destructive/20 p-2 transition hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-md border border-border/70 bg-muted/30 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Instructor</p>
                      <p className="mt-2 text-sm text-foreground">{subject.instructor || 'Not added yet'}</p>
                    </div>
                    <div className="rounded-md border border-border/70 bg-muted/30 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Semester</p>
                      <p className="mt-2 text-sm text-foreground">{subject.semester || 'Not added yet'}</p>
                    </div>
                  </div>

                  <div className="rounded-md border border-border/70 bg-card p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Notes</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {subject.description || 'No extra notes have been added for this subject yet.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
