'use client';

import { useState } from 'react';

import { Subject } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/contexts/AuthContext';
import { SUBJECT_COLORS } from '@/lib/utils/constants';

interface SubjectFormProps {
  initialData?: Subject;
  onSubmit: (subject: Subject) => void;
  onCancel: () => void;
}

export default function SubjectForm({ initialData, onSubmit, onCancel }: SubjectFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    code: initialData?.code || '',
    instructor: initialData?.instructor || '',
    color: initialData?.color || '#3B82F6',
    semester: initialData?.semester || '',
    description: initialData?.description || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Subject name is required';
    if (!formData.code.trim()) newErrors.code = 'Subject code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user) return;

    const subject: Subject = {
      id: initialData?.id || `subject-${Date.now()}`,
      userId: user.id,
      ...formData,
    };

    onSubmit(subject);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Subject name *</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Data Structures"
            className="h-11 rounded-md"
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Subject code *</label>
          <Input
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="e.g. CS201"
            className="h-11 rounded-md"
          />
          {errors.code && <p className="text-xs text-destructive">{errors.code}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Instructor</label>
          <Input
            value={formData.instructor}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
            placeholder="e.g. Prof. John Smith"
            className="h-11 rounded-md"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Semester</label>
          <Input
            value={formData.semester}
            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
            placeholder="e.g. Semester 2"
            className="h-11 rounded-md"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-foreground">Course color</label>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {SUBJECT_COLORS.map((colorOption) => (
              <button
                key={colorOption.value}
                type="button"
                onClick={() => setFormData({ ...formData, color: colorOption.value })}
                className={`w-10 h-10 rounded-lg border-2 transition ${
                  formData.color === colorOption.value ? 'border-foreground scale-105' : 'border-transparent'
                }`}
                style={{ backgroundColor: colorOption.value }}
                title={colorOption.label}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-foreground">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add notes about the subject, workload, or expectations."
            rows={3}
            className="rounded-md"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button variant="outline" onClick={onCancel} type="button" className="rounded-md">
          Cancel
        </Button>
        <Button type="submit" className="rounded-md">
          {initialData ? 'Save subject' : 'Create subject'}
        </Button>
      </div>
    </form>
  );
}
