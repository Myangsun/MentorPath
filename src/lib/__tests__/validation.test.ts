import { studentProfileSchema, priorRoleSchema } from '../validation';

describe('priorRoleSchema', () => {
  it('validates a valid prior role', () => {
    const result = priorRoleSchema.safeParse({
      title: 'Data Analyst',
      company: 'TechCorp',
      industry: 'Technology',
      years: 4,
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty title', () => {
    const result = priorRoleSchema.safeParse({
      title: '',
      company: 'TechCorp',
      industry: 'Technology',
      years: 4,
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative years', () => {
    const result = priorRoleSchema.safeParse({
      title: 'Analyst',
      company: 'Corp',
      industry: 'Tech',
      years: -1,
    });
    expect(result.success).toBe(false);
  });
});

describe('studentProfileSchema', () => {
  it('validates a complete profile', () => {
    const result = studentProfileSchema.safeParse({
      name: 'Liang Chen',
      school: 'MIT Sloan',
      program: 'MBA',
      graduationYear: 2026,
      priorRoles: [
        { title: 'Data Analyst', company: 'TechCorp', industry: 'Technology', years: 4 },
      ],
      visaStatus: 'F-1',
      industries: ['Climate Tech'],
      roleInterests: ['Product Manager'],
      pivotDirection: 'Data to PM',
      geographicPrefs: ['Boston'],
      mentorPreferences: 'Someone with visa experience',
    });
    expect(result.success).toBe(true);
  });

  it('validates with all optional fields missing', () => {
    const result = studentProfileSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('validates with null optional fields', () => {
    const result = studentProfileSchema.safeParse({
      visaStatus: null,
      pivotDirection: null,
      mentorPreferences: null,
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid graduation year', () => {
    const result = studentProfileSchema.safeParse({
      graduationYear: 1990,
    });
    expect(result.success).toBe(false);
  });

  it('validates priorRoles array', () => {
    const result = studentProfileSchema.safeParse({
      priorRoles: [
        { title: 'Analyst', company: 'Corp', industry: 'Tech', years: 2 },
        { title: 'Manager', company: 'Co', industry: 'Finance', years: 3 },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid priorRoles entries', () => {
    const result = studentProfileSchema.safeParse({
      priorRoles: [{ title: '', company: '', industry: '', years: -1 }],
    });
    expect(result.success).toBe(false);
  });
});
