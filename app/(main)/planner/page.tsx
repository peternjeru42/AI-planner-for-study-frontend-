'use client';

import { useEffect, useMemo, useState } from 'react';
import { Clock3, PencilLine, Plus, RefreshCw, Sparkles, Trash2 } from 'lucide-react';

import { PlannerAIModel, plannerApi } from '@/lib/api';
import { AIPlanDraft, AIPlanDraftSession, StudyDurationUnit, StudyPlan, StudyScope } from '@/lib/types';
import { DateUtils } from '@/lib/utils/date';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const EXAMPLE_PROMPT =
  'Plan a Discrete Mathematics unit for 10 hours each week, avoid Tuesdays, and keep the sessions realistic for evenings.';
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
type DraftEditor = AIPlanDraft & { model?: string };

const toDateInput = (value: Date) => value.toISOString().split('T')[0];
const nextDay = () => {
  const value = new Date();
  value.setDate(value.getDate() + 1);
  return value;
};

const newSession = (index: number): AIPlanDraftSession => ({
  tempId: `session-${Date.now()}-${index}`,
  title: `Study Session ${index}`,
  sessionDate: toDateInput(nextDay()),
  startTime: '09:00',
  endTime: '10:00',
  duration: 60,
  sessionType: 'revision',
  notes: '',
});

const emptyDraft = (model?: string): DraftEditor => ({
  model,
  title: '',
  studyScope: 'unit',
  targetName: '',
  durationValue: 10,
  durationUnit: 'hours',
  excludedDays: [],
  instructions: EXAMPLE_PROMPT,
  summary: '',
  startDate: toDateInput(nextDay()),
  endDate: toDateInput(nextDay()),
  sessions: [],
});

const planToDraft = (plan: StudyPlan, model?: string): DraftEditor => {
  if (plan.aiDraft) return { ...plan.aiDraft, model };
  return {
    model,
    title: plan.title,
    studyScope: 'course',
    targetName: plan.title.replace(/ study plan$/i, ''),
    durationValue: Math.max(1, Math.round(plan.sessions.reduce((sum, item) => sum + item.duration, 0) / 60)),
    durationUnit: 'hours',
    excludedDays: [],
    instructions: '',
    summary: '',
    startDate: plan.generatedForStartDate,
    endDate: plan.generatedForEndDate,
    sessions: plan.sessions.map((item, index) => ({
      tempId: `existing-${item.id}-${index}`,
      title: item.title,
      sessionDate: item.sessionDate ?? toDateInput(item.startTime),
      startTime: item.startTime.toTimeString().slice(0, 5),
      endTime: item.endTime.toTimeString().slice(0, 5),
      duration: item.duration,
      sessionType: item.sessionType ?? 'revision',
      notes: '',
    })),
  };
};

export default function PlannerPage() {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [models, setModels] = useState<PlannerAIModel[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editor, setEditor] = useState<DraftEditor>(emptyDraft('gpt-5-mini'));
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [pageError, setPageError] = useState('');
  const [modalError, setModalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setPageError('');
      const [nextPlans, nextModels] = await Promise.all([plannerApi.plans(), plannerApi.aiModels()]);
      setPlans(nextPlans);
      setModels(nextModels);
      const recommended = nextModels.find((item) => item.recommended)?.id ?? nextModels[0]?.id ?? 'gpt-5-mini';
      setEditor((current) => ({ ...current, model: current.model || recommended }));
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Failed to load planner data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const allSessions = useMemo(
    () =>
      plans.flatMap((plan) =>
        plan.sessions.map((session) => ({ ...session, planTitle: plan.title, generationTrigger: plan.generationTrigger })),
      ),
    [plans],
  );
  const plannedSessions = useMemo(() => allSessions.filter((item) => item.status === 'planned'), [allSessions]);
  const aiPlans = useMemo(() => plans.filter((item) => item.generationTrigger === 'ai_custom'), [plans]);
  const assessmentSessions = useMemo(
    () => plannedSessions.filter((item) => item.generationTrigger !== 'ai_custom'),
    [plannedSessions],
  );
  const todaySessions = useMemo(() => plannedSessions.filter((item) => DateUtils.isToday(item.startTime)), [plannedSessions]);
  const upcomingSessions = useMemo(
    () =>
      [...plannedSessions]
        .filter((item) => item.startTime > new Date())
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
        .slice(0, 10),
    [plannedSessions],
  );

  const openCreate = () => {
    const recommended = models.find((item) => item.recommended)?.id ?? models[0]?.id ?? 'gpt-5-mini';
    setEditingPlanId(null);
    setModalError('');
    setEditor(emptyDraft(recommended));
    setModalOpen(true);
  };

  const openEdit = (plan: StudyPlan) => {
    const recommended = models.find((item) => item.recommended)?.id ?? models[0]?.id ?? 'gpt-5-mini';
    setEditingPlanId(plan.id);
    setModalError('');
    setEditor(planToDraft(plan, recommended));
    setModalOpen(true);
  };

  const generateAssessmentPlan = async () => {
    try {
      setAssessmentLoading(true);
      setPageError('');
      await plannerApi.generate();
      await loadData();
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Failed to generate the assessment plan.');
    } finally {
      setAssessmentLoading(false);
    }
  };

  const generateDraft = async () => {
    if (!editor.targetName.trim()) {
      setModalError('Enter the unit, topic, or course you want to study.');
      return;
    }
    try {
      setDraftLoading(true);
      setModalError('');
      const response = await plannerApi.aiDraft({
        model: editor.model,
        studyScope: editor.studyScope,
        targetName: editor.targetName.trim(),
        durationValue: Number(editor.durationValue),
        durationUnit: editor.durationUnit,
        excludedDays: editor.excludedDays,
        instructions: editor.instructions ?? '',
      });
      setEditor({ ...response.draft, model: response.model });
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to generate the AI draft.');
    } finally {
      setDraftLoading(false);
    }
  };

  const savePlan = async () => {
    if (!editor.title.trim()) {
      setModalError('Add a plan title before saving.');
      return;
    }
    if (editor.sessions.length === 0) {
      setModalError('Generate or add at least one session before saving.');
      return;
    }
    try {
      setSaving(true);
      setModalError('');
      if (editingPlanId) {
        await plannerApi.aiUpdate(editingPlanId, editor);
      } else {
        await plannerApi.aiSave(editor);
      }
      setModalOpen(false);
      await loadData();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to save the AI plan.');
    } finally {
      setSaving(false);
    }
  };

  const setSessionField = (tempId: string, field: keyof AIPlanDraftSession, value: string | number) => {
    setEditor((current) => ({
      ...current,
      sessions: current.sessions.map((session) => {
        if (session.tempId !== tempId) return session;
        const next = { ...session, [field]: value };
        if (field === 'startTime' || field === 'duration') {
          const [hour, minute] = String(next.startTime).split(':').map(Number);
          const end = new Date();
          end.setHours(hour, minute + Number(next.duration), 0, 0);
          next.endTime = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;
        }
        return next;
      }),
    }));
  };

  const toggleExcludedDay = (day: string) => {
    setEditor((current) => ({
      ...current,
      excludedDays: current.excludedDays.includes(day)
        ? current.excludedDays.filter((item) => item !== day)
        : [...current.excludedDays, day],
    }));
  };

  return (
    <div className="space-y-8">
      <section className="page-band">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Plan studio</p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Build AI-guided study plans and edit them before they ever hit the calendar.</h1>
            <p className="text-sm leading-7 text-muted-foreground">
              Draft a unit, topic, or course plan, adjust every generated session, and keep assessment-based schedules available alongside custom plans.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={openCreate} size="lg" className="rounded-md">
              <Sparkles className="h-4 w-4" />
              Draft custom plan
            </Button>
            <Button onClick={generateAssessmentPlan} disabled={assessmentLoading} size="lg" variant="outline" className="rounded-md">
              <RefreshCw className={`h-4 w-4 ${assessmentLoading ? 'animate-spin' : ''}`} />
              {assessmentLoading ? 'Generating...' : 'Build from assessments'}
            </Button>
          </div>
        </div>
      </section>

      {pageError ? <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{pageError}</div> : null}

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/70 bg-card shadow-sm"><CardContent className="pt-6"><p className="text-sm font-medium text-muted-foreground">Scheduled sessions</p><p className="mt-3 text-3xl font-semibold text-foreground">{plannedSessions.length}</p></CardContent></Card>
        <Card className="border-border/70 bg-card shadow-sm"><CardContent className="pt-6"><p className="text-sm font-medium text-muted-foreground">AI plans</p><p className="mt-3 text-3xl font-semibold text-foreground">{aiPlans.length}</p></CardContent></Card>
        <Card className="border-border/70 bg-card shadow-sm"><CardContent className="pt-6"><p className="text-sm font-medium text-muted-foreground">Sessions today</p><p className="mt-3 text-3xl font-semibold text-foreground">{todaySessions.length}</p></CardContent></Card>
        <Card className="border-border/70 bg-card shadow-sm"><CardContent className="pt-6"><p className="text-sm font-medium text-muted-foreground">Planned hours</p><p className="mt-3 text-3xl font-semibold text-foreground">{(plannedSessions.reduce((sum, item) => sum + item.duration, 0) / 60).toFixed(1)}</p></CardContent></Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/70 bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Custom AI plans</CardTitle>
            <CardDescription>Edit saved drafts whenever the week changes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? <p className="text-sm text-muted-foreground">Loading plans...</p> : null}
            {!loading && aiPlans.length === 0 ? (
              <div className="rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">
                No custom plans are saved yet. Draft one from a unit, topic, or course.
              </div>
            ) : null}
            {aiPlans.map((plan) => (
              <div key={plan.id} className="rounded-md border border-border/70 bg-muted/20 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-foreground">{plan.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {plan.sessions.length} sessions scheduled between {plan.generatedForStartDate} and {plan.generatedForEndDate}
                    </p>
                    <p className="text-xs text-primary">Reminder jobs are queued one hour before each saved session.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => openEdit(plan)} className="rounded-md">
                    <PencilLine className="h-4 w-4" />
                    Edit draft
                  </Button>
                </div>

                <div className="mt-4 space-y-2">
                  {plan.sessions.slice(0, 4).map((session) => (
                    <div key={session.id} className="flex items-center justify-between rounded-md border border-border/70 bg-card px-3 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{session.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {session.sessionDate} • {DateUtils.formatTime(session.startTime)} to {DateUtils.formatTime(session.endTime)}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-primary">{session.duration} min</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/70 bg-card shadow-sm">
            <CardHeader>
              <CardTitle>Assessment-generated schedule</CardTitle>
              <CardDescription>The deterministic planner can still build sessions directly from your deadlines.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {assessmentSessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No assessment-generated sessions are available yet.</p>
              ) : (
                assessmentSessions.slice(0, 5).map((session) => (
                  <div key={session.id} className="rounded-md border border-border/70 bg-muted/20 px-4 py-3">
                    <p className="font-medium text-foreground">{session.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{DateUtils.formatDateTime(session.startTime)} • {session.duration} min</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card shadow-sm">
            <CardHeader>
              <CardTitle>Upcoming sessions</CardTitle>
              <CardDescription>The next ten sessions across every saved plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingSessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming sessions are scheduled.</p>
              ) : (
                upcomingSessions.map((session) => (
                  <div key={session.id} className="rounded-md border border-border/70 bg-muted/20 px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">{session.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{DateUtils.formatDateTime(session.startTime)}</p>
                        <p className="mt-1 text-xs text-primary">{session.planTitle}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">{session.duration} min</div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto border-border/70 bg-card sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>{editingPlanId ? 'Edit custom study plan' : 'Draft a custom study plan'}</DialogTitle>
            <DialogDescription>Ask the model for a draft, then adjust the sessions before you save anything.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="rounded-md border border-border/70 bg-muted/30 p-4">
              <p className="text-sm font-medium text-foreground">Prompt example</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{EXAMPLE_PROMPT}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Model</label>
                <select
                  value={editor.model ?? ''}
                  onChange={(e) => setEditor((current) => ({ ...current, model: e.target.value }))}
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.label}
                      {model.recommended ? ' (Recommended)' : ''}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">{models.find((model) => model.id === editor.model)?.description}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Plan title</label>
                <Input value={editor.title} onChange={(e) => setEditor((current) => ({ ...current, title: e.target.value }))} placeholder="Discrete Mathematics revision plan" className="h-11 rounded-md" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[180px_1fr]">
              <div className="space-y-2">
                <label className="text-sm font-medium">Study scope</label>
                <select
                  value={editor.studyScope}
                  onChange={(e) => setEditor((current) => ({ ...current, studyScope: e.target.value as StudyScope }))}
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="unit">Unit</option>
                  <option value="topic">Topic</option>
                  <option value="course">Course</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">What do you want to study?</label>
                <Input value={editor.targetName} onChange={(e) => setEditor((current) => ({ ...current, targetName: e.target.value }))} placeholder="Discrete Mathematics" className="h-11 rounded-md" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_180px]">
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration value</label>
                <Input type="number" min={1} value={editor.durationValue} onChange={(e) => setEditor((current) => ({ ...current, durationValue: Number(e.target.value) || 1 }))} className="h-11 rounded-md" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration unit</label>
                <select
                  value={editor.durationUnit}
                  onChange={(e) => setEditor((current) => ({ ...current, durationUnit: e.target.value as StudyDurationUnit }))}
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Excluded days</label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => {
                  const active = editor.excludedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleExcludedDay(day)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition ${
                        active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-foreground hover:bg-secondary'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Extra instructions</label>
              <Textarea rows={4} value={editor.instructions ?? ''} onChange={(e) => setEditor((current) => ({ ...current, instructions: e.target.value }))} placeholder={EXAMPLE_PROMPT} className="rounded-md" />
            </div>

            <div className="flex flex-col gap-3 rounded-md border border-border/70 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Generate the first draft</p>
                <p className="text-xs text-muted-foreground">The AI returns editable sessions that remain in your control.</p>
              </div>
              <Button type="button" onClick={generateDraft} disabled={draftLoading} className="rounded-md">
                <Sparkles className={`h-4 w-4 ${draftLoading ? 'animate-pulse' : ''}`} />
                {draftLoading ? 'Generating draft...' : 'Generate draft'}
              </Button>
            </div>

            {modalError ? <p className="text-sm text-destructive">{modalError}</p> : null}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-foreground">Editable sessions</p>
                  <p className="text-sm text-muted-foreground">Adjust any block before saving the plan.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditor((current) => ({ ...current, sessions: [...current.sessions, newSession(current.sessions.length + 1)] }))}
                  className="rounded-md"
                >
                  <Plus className="h-4 w-4" />
                  Add session
                </Button>
              </div>

              {editor.sessions.length === 0 ? (
                <div className="rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">
                  No draft sessions yet. Generate a draft or add one manually.
                </div>
              ) : (
                <div className="space-y-4">
                  {editor.sessions.map((session, index) => (
                    <div key={session.tempId} className="rounded-md border border-border/70 bg-muted/20 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground">Session {index + 1}</p>
                        <button
                          type="button"
                          onClick={() => setEditor((current) => ({ ...current, sessions: current.sessions.filter((item) => item.tempId !== session.tempId) }))}
                          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs text-destructive transition hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Title</label>
                          <Input value={session.title} onChange={(e) => setSessionField(session.tempId, 'title', e.target.value)} className="h-10 rounded-md bg-card" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Date</label>
                          <Input type="date" value={session.sessionDate} onChange={(e) => setSessionField(session.tempId, 'sessionDate', e.target.value)} className="h-10 rounded-md bg-card" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Start time</label>
                          <Input type="time" value={session.startTime} onChange={(e) => setSessionField(session.tempId, 'startTime', e.target.value)} className="h-10 rounded-md bg-card" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Duration</label>
                          <Input type="number" min={15} step={15} value={session.duration} onChange={(e) => setSessionField(session.tempId, 'duration', Number(e.target.value) || 60)} className="h-10 rounded-md bg-card" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Type</label>
                          <select value={session.sessionType} onChange={(e) => setSessionField(session.tempId, 'sessionType', e.target.value)} className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20">
                            <option value="reading">Reading</option>
                            <option value="revision">Revision</option>
                            <option value="assignment_work">Assignment work</option>
                            <option value="exam_prep">Exam prep</option>
                            <option value="project_work">Project work</option>
                          </select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Notes</label>
                          <Textarea rows={3} value={session.notes ?? ''} onChange={(e) => setSessionField(session.tempId, 'notes', e.target.value)} className="rounded-md bg-card" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock3 className="h-4 w-4 text-primary" />
                Reminder jobs are created one hour before every saved session.
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="rounded-md">
                  Cancel
                </Button>
                <Button type="button" onClick={savePlan} disabled={saving} className="rounded-md">
                  {saving ? 'Saving plan...' : editingPlanId ? 'Save changes' : 'Accept and save'}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
