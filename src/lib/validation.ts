import { z } from 'zod';

export const priorRoleSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  industry: z.string().min(1),
  years: z.number().min(0),
});

export const studentProfileSchema = z.object({
  name: z.string().min(1).optional(),
  school: z.string().min(1).optional(),
  major: z.string().min(1).optional(),
  graduationYear: z.number().int().min(2000).max(2030).optional(),
  priorRoles: z.array(priorRoleSchema).optional(),
  visaStatus: z.string().nullable().optional(),
  industries: z.array(z.string()).optional(),
  roleInterests: z.array(z.string()).optional(),
  pivotDirection: z.string().nullable().optional(),
  geographicPrefs: z.array(z.string()).optional(),
  mentorPreferences: z.string().nullable().optional(),
});

export type StudentProfileFormData = z.infer<typeof studentProfileSchema>;
