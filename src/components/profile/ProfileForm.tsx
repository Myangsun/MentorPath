'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompletionBar } from './CompletionBar';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';
import type { StudentProfileFormData } from '@/lib/validation';
import type { PriorRole } from '@/types';

interface ProfileFormProps {
  initialData?: StudentProfileFormData;
  onSave: (data: StudentProfileFormData) => Promise<void>;
}

const SCHOOLS = ['MIT Sloan', 'HBS', 'Stanford GSB', 'Wharton', 'Kellogg', 'Columbia Business School'];
const PROGRAMS = ['MBA', 'MS', 'PhD'];
const VISA_OPTIONS = ['F-1', 'H-1B', 'OPT', 'Green Card', 'Citizen', 'Other'];
const INDUSTRY_OPTIONS = ['Technology', 'Consulting', 'Finance', 'Climate Tech', 'Healthcare', 'Nonprofit', 'Social Impact'];
const ROLE_OPTIONS = ['Product Manager', 'Strategy', 'Data Science', 'Engineering', 'Consulting', 'Marketing', 'Operations', 'Finance', 'Venture Capital'];

function calculateCompletion(data: StudentProfileFormData): number {
  const fields = [
    !!data.name,
    !!data.school,
    !!data.program,
    !!data.graduationYear,
    (data.priorRoles?.length ?? 0) > 0,
    !!data.visaStatus,
    (data.industries?.length ?? 0) > 0,
    (data.roleInterests?.length ?? 0) > 0,
    !!data.pivotDirection,
    (data.geographicPrefs?.length ?? 0) > 0,
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

export function ProfileForm({ initialData, onSave }: ProfileFormProps) {
  const [formData, setFormData] = useState<StudentProfileFormData>({
    name: initialData?.name || '',
    school: initialData?.school || '',
    program: initialData?.program || '',
    graduationYear: initialData?.graduationYear || 2026,
    priorRoles: initialData?.priorRoles || [],
    visaStatus: initialData?.visaStatus || null,
    industries: initialData?.industries || [],
    roleInterests: initialData?.roleInterests || [],
    pivotDirection: initialData?.pivotDirection || null,
    geographicPrefs: initialData?.geographicPrefs || [],
    mentorPreferences: initialData?.mentorPreferences || null,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateField = useCallback(<K extends keyof StudentProfileFormData>(
    key: K,
    value: StudentProfileFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }, []);

  const addPriorRole = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      priorRoles: [...(prev.priorRoles || []), { title: '', company: '', industry: '', years: 0 }],
    }));
    setSaved(false);
  }, []);

  const updatePriorRole = useCallback((index: number, field: keyof PriorRole, value: string | number) => {
    setFormData((prev) => {
      const roles = [...(prev.priorRoles || [])];
      roles[index] = { ...roles[index], [field]: value };
      return { ...prev, priorRoles: roles };
    });
    setSaved(false);
  }, []);

  const removePriorRole = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      priorRoles: (prev.priorRoles || []).filter((_, i) => i !== index),
    }));
    setSaved(false);
  }, []);

  const toggleArrayItem = useCallback((key: 'industries' | 'roleInterests' | 'geographicPrefs', item: string) => {
    setFormData((prev) => {
      const arr = prev[key] || [];
      const next = arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
      return { ...prev, [key]: next };
    });
    setSaved(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const completion = calculateCompletion(formData);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CompletionBar completion={completion} />

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Input
                id="graduationYear"
                type="number"
                value={formData.graduationYear || ''}
                onChange={(e) => updateField('graduationYear', parseInt(e.target.value) || undefined)}
                min={2000}
                max={2030}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="school">School</Label>
              <select
                id="school"
                className="flex h-10 w-full rounded-md border border-neutral-400 bg-white px-3 py-2 text-sm"
                value={formData.school || ''}
                onChange={(e) => updateField('school', e.target.value)}
              >
                <option value="">Select school</option>
                {SCHOOLS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="program">Program</Label>
              <select
                id="program"
                className="flex h-10 w-full rounded-md border border-neutral-400 bg-white px-3 py-2 text-sm"
                value={formData.program || ''}
                onChange={(e) => updateField('program', e.target.value)}
              >
                <option value="">Select program</option>
                {PROGRAMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="visaStatus">Visa Status</Label>
            <select
              id="visaStatus"
              className="flex h-10 w-full rounded-md border border-neutral-400 bg-white px-3 py-2 text-sm"
              value={formData.visaStatus || ''}
              onChange={(e) => updateField('visaStatus', e.target.value || null)}
            >
              <option value="">Select visa status</option>
              {VISA_OPTIONS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Prior Roles */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Prior Experience</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addPriorRole}>
            <Plus className="mr-1 h-4 w-4" /> Add Role
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {(formData.priorRoles || []).length === 0 && (
            <p className="text-sm text-neutral-600">No prior roles added yet. Click &quot;Add Role&quot; to get started.</p>
          )}
          {(formData.priorRoles || []).map((role, i) => (
            <div key={i} className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Role {i + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removePriorRole(i)}
                  aria-label={`Remove role ${i + 1}`}
                >
                  <Trash2 className="h-4 w-4 text-danger" />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Title</Label>
                  <Input
                    value={role.title}
                    onChange={(e) => updatePriorRole(i, 'title', e.target.value)}
                    placeholder="Job title"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Company</Label>
                  <Input
                    value={role.company}
                    onChange={(e) => updatePriorRole(i, 'company', e.target.value)}
                    placeholder="Company name"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Industry</Label>
                  <Input
                    value={role.industry}
                    onChange={(e) => updatePriorRole(i, 'industry', e.target.value)}
                    placeholder="Industry"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Years</Label>
                  <Input
                    type="number"
                    value={role.years}
                    onChange={(e) => updatePriorRole(i, 'years', parseInt(e.target.value) || 0)}
                    min={0}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Career Interests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Career Interests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Target Industries</Label>
            <div className="flex flex-wrap gap-2">
              {INDUSTRY_OPTIONS.map((ind) => (
                <button
                  key={ind}
                  type="button"
                  onClick={() => toggleArrayItem('industries', ind)}
                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                    formData.industries?.includes(ind)
                      ? 'border-brand-600 bg-brand-50 text-brand-600'
                      : 'border-border text-neutral-600 hover:border-neutral-400'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Target Roles</Label>
            <div className="flex flex-wrap gap-2">
              {ROLE_OPTIONS.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleArrayItem('roleInterests', role)}
                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                    formData.roleInterests?.includes(role)
                      ? 'border-brand-600 bg-brand-50 text-brand-600'
                      : 'border-border text-neutral-600 hover:border-neutral-400'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pivotDirection">Career Pivot Direction</Label>
            <Textarea
              id="pivotDirection"
              value={formData.pivotDirection || ''}
              onChange={(e) => updateField('pivotDirection', e.target.value || null)}
              placeholder="Describe the career transition you're looking to make..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mentor Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="geographicPrefs">Geographic Preferences</Label>
            <Input
              id="geographicPrefs"
              value={formData.geographicPrefs?.join(', ') || ''}
              onChange={(e) => updateField('geographicPrefs', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
              placeholder="e.g. San Francisco, New York, Boston"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mentorPreferences">Additional Preferences</Label>
            <Textarea
              id="mentorPreferences"
              value={formData.mentorPreferences || ''}
              onChange={(e) => updateField('mentorPreferences', e.target.value || null)}
              placeholder="Any specific preferences for your ideal mentor..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={saving} className="bg-brand-600 hover:bg-brand-700">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Save Profile
            </>
          )}
        </Button>
        {saved && <span className="text-sm text-success">Profile saved successfully!</span>}
      </div>
    </form>
  );
}
