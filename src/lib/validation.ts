import { z } from 'zod';

export const priorRoleSchema = z.object({
  title: z.string().min(1, 'Role title is required'),
  company: z.string().min(1, 'Company name is required'),
  industry: z.string().min(1, 'Industry is required'),
  years: z.number().min(0, 'Years must be 0 or more'),
});

export const studentProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  school: z.string().min(1, 'Please select a school').optional(),
  major: z.string().min(1, 'Please select a major').optional(),
  graduationYear: z.number({ error: 'Graduation year must be a number' }).int('Must be a whole number').min(2000, 'Year must be 2000 or later').max(2030, 'Year must be 2030 or earlier').optional(),
  priorRoles: z.array(priorRoleSchema).optional(),
  visaStatus: z.string().nullable().optional(),
  industries: z.array(z.string()).optional(),
  roleInterests: z.array(z.string()).optional(),
  pivotDirection: z.string().nullable().optional(),
  geographicPrefs: z.array(z.string()).optional(),
  mentorPreferences: z.string().nullable().optional(),
});

export type StudentProfileFormData = z.infer<typeof studentProfileSchema>;
