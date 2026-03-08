import {
  scoreCareerPivot,
  scoreAcademicBackground,
  scoreVisaAlignment,
  scoreIndustryMatch,
  scoreGeographicProximity,
  scoreStageProximity,
  calculateMatchScore,
} from '../matching';
import type { StudentProfile, AlumniProfile } from '@prisma/client';

// ── Test Fixtures ──

function makeStudent(overrides: Partial<StudentProfile> = {}): StudentProfile {
  return {
    id: 'student-1',
    name: 'Liang Chen',
    school: 'MIT - Massachusetts Institute of Technology',
    major: 'Computer Science',
    graduationYear: 2026,
    priorRoles: [
      { title: 'Data Analyst', company: 'TechCorp', industry: 'Technology', years: 4 },
    ],
    visaStatus: 'F-1',
    industries: ['Climate Tech', 'Technology'],
    roleInterests: ['Product Manager', 'Strategy'],
    pivotDirection: 'Transition from data analytics to product management in climate tech',
    geographicPrefs: ['San Francisco', 'New York', 'Boston'],
    mentorPreferences: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as StudentProfile;
}

function makeAlumni(overrides: Partial<AlumniProfile> = {}): AlumniProfile {
  return {
    id: 'alumni-1',
    name: 'Sarah Chen',
    graduationYear: 2021,
    school: 'MIT - Massachusetts Institute of Technology',
    major: 'Computer Science',
    currentRole: 'Product Manager',
    currentCompany: 'ClimateTech Solutions',
    industry: 'Climate Tech',
    careerTimeline: [],
    pivotType: 'data analyst → product manager',
    skills: ['Product Strategy', 'Data Analytics'],
    visaHistory: ['F-1', 'H-1B'],
    geographicHistory: ['Boston', 'San Francisco'],
    openness: 'one_time_chat',
    topicsWilling: ['Career Pivot'],
    responseRate: 0.9,
    lastActive: new Date(),
    bio: null,
    createdAt: new Date(),
    ...overrides,
  } as AlumniProfile;
}

// ── Tests ──

describe('scoreCareerPivot', () => {
  it('returns 30 for exact origin + destination match', () => {
    const student = makeStudent();
    const alumni = makeAlumni({ pivotType: 'data analyst → product manager' });
    expect(scoreCareerPivot(student, alumni)).toBe(30);
  });

  it('returns 20 for destination-only match', () => {
    const student = makeStudent();
    const alumni = makeAlumni({ pivotType: 'software engineer → product manager' });
    expect(scoreCareerPivot(student, alumni)).toBe(20);
  });

  it('returns 15 for origin-only match', () => {
    const student = makeStudent();
    const alumni = makeAlumni({ pivotType: 'data analyst → venture capital' });
    expect(scoreCareerPivot(student, alumni)).toBe(15);
  });

  it('returns 0 when alumni has no pivot type', () => {
    const student = makeStudent();
    const alumni = makeAlumni({ pivotType: null });
    expect(scoreCareerPivot(student, alumni)).toBe(0);
  });

  it('returns 0 for no match', () => {
    const student = makeStudent();
    const alumni = makeAlumni({ pivotType: 'nurse → clinical operations director' });
    expect(scoreCareerPivot(student, alumni)).toBe(0);
  });

  it('returns 10 for partial keyword overlap', () => {
    const student = makeStudent({
      priorRoles: [{ title: 'Engineer', company: 'Corp', industry: 'Tech', years: 3 }],
      roleInterests: ['Director'],
      pivotDirection: null,
    });
    const alumni = makeAlumni({ pivotType: 'marketing → senior engineer' });
    // No origin match (student origin "engineer" vs alumni origin "marketing")
    // No dest match (student target "director" vs alumni dest "senior engineer")
    // But partial: "senior engineer" contains "engineer" → 10
    expect(scoreCareerPivot(student, alumni)).toBe(10);
  });
});

describe('scoreAcademicBackground', () => {
  it('returns 20 for same school and major', () => {
    const student = makeStudent({ school: 'MIT', major: 'Computer Science' });
    const alumni = makeAlumni({ school: 'MIT', major: 'Computer Science' });
    expect(scoreAcademicBackground(student, alumni)).toBe(20);
  });

  it('returns 10 for same school only (no year bonus)', () => {
    const student = makeStudent({ school: 'MIT', major: 'Computer Science', graduationYear: 2026 });
    const alumni = makeAlumni({ school: 'MIT', major: 'Data Science', graduationYear: 2014 });
    expect(scoreAcademicBackground(student, alumni)).toBe(10);
  });

  it('returns 10 for same major only (no year bonus)', () => {
    const student = makeStudent({ school: 'MIT', major: 'Computer Science', graduationYear: 2026 });
    const alumni = makeAlumni({ school: 'Harvard University', major: 'Computer Science', graduationYear: 2014 });
    expect(scoreAcademicBackground(student, alumni)).toBe(10);
  });

  it('returns 0 for no match (no year bonus)', () => {
    const student = makeStudent({ school: 'MIT', major: 'Computer Science', graduationYear: 2026 });
    const alumni = makeAlumni({ school: 'Harvard University', major: 'Data Science', graduationYear: 2014 });
    expect(scoreAcademicBackground(student, alumni)).toBe(0);
  });

  it('adds year overlap bonus when score < 20', () => {
    const student = makeStudent({ school: 'MIT', major: 'Data Science', graduationYear: 2026 });
    const alumni = makeAlumni({ school: 'Harvard University', major: 'Data Science', graduationYear: 2024 });
    // Same major (10) + year overlap within 5 (5) = 15
    expect(scoreAcademicBackground(student, alumni)).toBe(15);
  });

  it('caps at 20', () => {
    const student = makeStudent({ school: 'MIT', major: 'Computer Science', graduationYear: 2026 });
    const alumni = makeAlumni({ school: 'MIT', major: 'Computer Science', graduationYear: 2025 });
    // Same school (10) + same major (10) = 20, year bonus doesn't add
    expect(scoreAcademicBackground(student, alumni)).toBe(20);
  });
});

describe('scoreVisaAlignment', () => {
  it('returns 20 for exact visa match', () => {
    const student = makeStudent({ visaStatus: 'F-1' });
    const alumni = makeAlumni({ visaHistory: ['F-1', 'H-1B'] });
    expect(scoreVisaAlignment(student, alumni)).toBe(20);
  });

  it('returns 15 for adjacent visa path', () => {
    const student = makeStudent({ visaStatus: 'F-1' });
    const alumni = makeAlumni({ visaHistory: ['H-1B'] });
    expect(scoreVisaAlignment(student, alumni)).toBe(15);
  });

  it('returns 10 for both citizen', () => {
    const student = makeStudent({ visaStatus: 'citizen' });
    const alumni = makeAlumni({ visaHistory: ['citizen'] });
    expect(scoreVisaAlignment(student, alumni)).toBe(10);
  });

  it('returns 0 when student has no visa status', () => {
    const student = makeStudent({ visaStatus: null });
    const alumni = makeAlumni({ visaHistory: ['F-1'] });
    expect(scoreVisaAlignment(student, alumni)).toBe(0);
  });

  it('returns 0 for no overlap', () => {
    const student = makeStudent({ visaStatus: 'F-1' });
    const alumni = makeAlumni({ visaHistory: ['citizen'] });
    expect(scoreVisaAlignment(student, alumni)).toBe(0);
  });
});

describe('scoreIndustryMatch', () => {
  it('returns 15 for exact industry match', () => {
    const student = makeStudent({ industries: ['Climate Tech'] });
    const alumni = makeAlumni({ industry: 'Climate Tech' });
    expect(scoreIndustryMatch(student, alumni)).toBe(15);
  });

  it('returns 8 for partial match', () => {
    const student = makeStudent({ industries: ['Tech'] });
    const alumni = makeAlumni({ industry: 'Technology' });
    // "tech" is contained in "technology"
    expect(scoreIndustryMatch(student, alumni)).toBe(8);
  });

  it('returns 0 for no match', () => {
    const student = makeStudent({ industries: ['Finance'] });
    const alumni = makeAlumni({ industry: 'Healthcare' });
    expect(scoreIndustryMatch(student, alumni)).toBe(0);
  });
});

describe('scoreGeographicProximity', () => {
  it('returns 10 for geographic overlap', () => {
    const student = makeStudent({ geographicPrefs: ['Boston', 'New York'] });
    const alumni = makeAlumni({ geographicHistory: ['Boston', 'San Francisco'] });
    expect(scoreGeographicProximity(student, alumni)).toBe(10);
  });

  it('returns 0 for no overlap', () => {
    const student = makeStudent({ geographicPrefs: ['Seattle'] });
    const alumni = makeAlumni({ geographicHistory: ['Boston'] });
    expect(scoreGeographicProximity(student, alumni)).toBe(0);
  });

  it('returns 0 for empty arrays', () => {
    const student = makeStudent({ geographicPrefs: [] });
    const alumni = makeAlumni({ geographicHistory: ['Boston'] });
    expect(scoreGeographicProximity(student, alumni)).toBe(0);
  });
});

describe('scoreStageProximity', () => {
  it('returns 5 for diff <= 3', () => {
    const student = makeStudent({ graduationYear: 2026 });
    const alumni = makeAlumni({ graduationYear: 2024 });
    expect(scoreStageProximity(student, alumni)).toBe(5);
  });

  it('returns 3 for diff 4-6', () => {
    const student = makeStudent({ graduationYear: 2026 });
    const alumni = makeAlumni({ graduationYear: 2021 });
    expect(scoreStageProximity(student, alumni)).toBe(3);
  });

  it('returns 1 for diff 7-10', () => {
    const student = makeStudent({ graduationYear: 2026 });
    const alumni = makeAlumni({ graduationYear: 2018 });
    expect(scoreStageProximity(student, alumni)).toBe(1);
  });

  it('returns 0 for diff > 10', () => {
    const student = makeStudent({ graduationYear: 2026 });
    const alumni = makeAlumni({ graduationYear: 2014 });
    expect(scoreStageProximity(student, alumni)).toBe(0);
  });
});

describe('calculateMatchScore', () => {
  it('returns total score and breakdown', () => {
    const student = makeStudent();
    const alumni = makeAlumni();
    const result = calculateMatchScore(student, alumni);

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.breakdown).toHaveProperty('careerPivot');
    expect(result.breakdown).toHaveProperty('academicBackground');
    expect(result.breakdown).toHaveProperty('visaAlignment');
    expect(result.breakdown).toHaveProperty('industryMatch');
    expect(result.breakdown).toHaveProperty('geographicProximity');
    expect(result.breakdown).toHaveProperty('stageProximity');
  });

  it('score equals sum of breakdown dimensions', () => {
    const student = makeStudent();
    const alumni = makeAlumni();
    const { score, breakdown } = calculateMatchScore(student, alumni);

    const sum =
      breakdown.careerPivot +
      breakdown.academicBackground +
      breakdown.visaAlignment +
      breakdown.industryMatch +
      breakdown.geographicProximity +
      breakdown.stageProximity;

    expect(score).toBe(Math.min(100, sum));
  });

  it('produces high score for ideal match (Liang → Sarah)', () => {
    const student = makeStudent();
    const alumni = makeAlumni();
    const { score } = calculateMatchScore(student, alumni);
    // Sarah: same school+major (20), same pivot (30), F-1 match (20),
    // Climate Tech match (15), geo overlap (10), stage ~3 diff (3) = ~98
    expect(score).toBeGreaterThanOrEqual(80);
  });

  it('produces low score for poor match', () => {
    const student = makeStudent();
    const alumni = makeAlumni({
      school: 'University of Pennsylvania',
      major: 'Biomedical Engineering',
      pivotType: 'nurse → healthcare strategy',
      visaHistory: ['citizen'],
      industry: 'Healthcare',
      geographicHistory: ['Minneapolis'],
      graduationYear: 2010,
    });
    const { score } = calculateMatchScore(student, alumni);
    expect(score).toBeLessThan(30);
  });
});
