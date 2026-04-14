'use client';

import { useState } from 'react';
import { Assessment, AssessmentStatus, AssessmentType, Subject } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/contexts/AuthContext';
import { ASSESSMENT_TYPES, PRIORITY_LEVELS } from '@/lib/utils/constants';

interface AssessmentFormProps {
  initialData?: Assessment;
  subjects: Subject[];
  onSubmit: (assessment: Partial<Assessment>) => void;
  onCancel: () => void;
}

export default function AssessmentForm({ initialData, subjects, onSubmit, onCancel }: AssessmentFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    subjectId: initialData?.subjectId || (subjects[0]?.id || ''),
    type: (initialData?.type || 'assignment') as AssessmentType,
    dueDate: initialData ? initialData.dueDate.toISOString().split('T')[0] : '',
    dueTime: initialData?.dueTime || '23:59',
    weight: initialData?.weight || 10,
    estimatedHours: initialData?.estimatedHours || 2,
    priority: (initialData?.priority || 'medium') as Assessment['priority'],
    notes: initialData?.notes || '',
    status: (initialData?.status || 'pending') as AssessmentStatus,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (formData.weight < 0 || formData.weight > 100) newErrors.weight = 'Weight must be between 0 and 100';
    if (formData.estimatedHours < 0) newErrors.estimatedHours = 'Hours must be positive';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user) return;

    const assessment: Partial<Assessment> = {
      id: initialData?.id || `assessment-${Date.now()}`,
      userId: user.id,
      title: formData.title,
      subjectId: formData.subjectId,
      type: formData.type,
      dueDate: new Date(formData.dueDate),
      dueTime: formData.dueTime,
      weight: Number(formData.weight),
      estimatedHours: Number(formData.estimatedHours),
      priority: formData.priority,
      notes: formData.notes,
      status: formData.status,
    };

    onSubmit(assessment);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Title *</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Midterm exam"
          className="h-11 rounded-md"
        />
        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Subject *</label>
          <select
            value={formData.subjectId}
            onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20"
          >
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as AssessmentType })}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20"
          >
            {ASSESSMENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Due Date *</label>
          <Input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="h-11 rounded-md"
          />
          {errors.dueDate && <p className="text-xs text-destructive">{errors.dueDate}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Due Time</label>
          <Input
            type="time"
            value={formData.dueTime}
            onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
            className="h-11 rounded-md"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Weight (%)</label>
          <Input
            type="number"
            min="0"
            max="100"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
            className="h-11 rounded-md"
          />
          {errors.weight && <p className="text-xs text-destructive">{errors.weight}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Estimated Hours</label>
          <Input
            type="number"
            min="0"
            step="0.5"
            value={formData.estimatedHours}
            onChange={(e) => setFormData({ ...formData, estimatedHours: Number(e.target.value) })}
            className="h-11 rounded-md"
          />
          {errors.estimatedHours && <p className="text-xs text-destructive">{errors.estimatedHours}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as Assessment['priority'] })}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20"
          >
            {PRIORITY_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as AssessmentStatus })}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Notes</label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add planning notes, revision scope, or submission details."
          rows={3}
          className="rounded-md"
        />
      </div>

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button variant="outline" onClick={onCancel} type="button" className="rounded-md">
          Cancel
        </Button>
        <Button type="submit" className="rounded-md">
          {initialData ? 'Save assessment' : 'Create assessment'}
        </Button>
      </div>
    </form>
  );
}
