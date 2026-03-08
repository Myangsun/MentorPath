import type { StudentProfile, AlumniProfile } from '@prisma/client';
import type { ScoreBreakdown, PriorRole } from '@/types';

function normalize(str: string): string {
  return str.toLowerCase().trim();
}

function hasOverlap(a: string[], b: string[]): boolean {
  const setB = new Set(b.map(normalize));
  return a.some((item) => setB.has(normalize(item)));
}

function containsKeyword(text: string, keywords: string[]): boolean {
  const lower = normalize(text);
  return keywords.some((kw) => lower.includes(normalize(kw)));
}

export function scoreCareerPivot(
  student: StudentProfile,
  alumni: AlumniProfile
): number {
  if (!alumni.pivotType) return 0;

  const priorRoles = student.priorRoles as PriorRole[];
  const studentOrigins = priorRoles.map((r) => normalize(r.title));
  const studentTargets = (student.roleInterests || []).map(normalize);
  const pivotParts = alumni.pivotType.split('→').map((p) => normalize(p.trim()));

  if (pivotParts.length < 2) return 0;

  const [alumniOrigin, alumniDestination] = pivotParts;

  const originMatch = studentOrigins.some(
    (origin) =>
      origin.includes(alumniOrigin) || alumniOrigin.includes(origin)
  );

  const destMatch =
    studentTargets.some(
      (target) =>
        target.includes(alumniDestination) ||
        alumniDestination.includes(target)
    ) ||
    (student.pivotDirection
      ? containsKeyword(student.pivotDirection, [alumniDestination])
      : false);

  if (originMatch && destMatch) return 30;
  if (destMatch) return 20;
  if (originMatch) return 15;

  // Check partial keyword overlap
  const allStudentKeywords = [
    ...studentOrigins,
    ...studentTargets,
    ...(student.pivotDirection ? [normalize(student.pivotDirection)] : []),
  ];
  const alumniKeywords = pivotParts;

  const partialMatch = alumniKeywords.some((kw) =>
    allStudentKeywords.some(
      (sk) => sk.includes(kw) || kw.includes(sk)
    )
  );

  return partialMatch ? 10 : 0;
}

export function scoreAcademicBackground(
  student: StudentProfile,
  alumni: AlumniProfile
): number {
  let score = 0;

  if (normalize(student.school) === normalize(alumni.school)) {
    score += 10;
  }

  if (normalize(student.program) === normalize(alumni.program)) {
    score += 10;
  }

  // Year overlap bonus only if we haven't hit cap
  if (score < 20) {
    const yearDiff = Math.abs(student.graduationYear - alumni.graduationYear);
    if (yearDiff <= 5) {
      score = Math.min(score + 5, 20);
    }
  }

  return score;
}

export function scoreVisaAlignment(
  student: StudentProfile,
  alumni: AlumniProfile
): number {
  if (!student.visaStatus) return 0;

  const studentVisa = normalize(student.visaStatus);
  const alumniVisas = alumni.visaHistory.map(normalize);

  // Both citizens — less distinctive
  if (studentVisa === 'citizen' && alumniVisas.includes('citizen')) {
    return 10;
  }

  // Exact match
  if (alumniVisas.includes(studentVisa)) {
    return 20;
  }

  // Adjacent visa path (e.g., student is F-1, alumni went through H-1B)
  const adjacentPaths: Record<string, string[]> = {
    'f-1': ['h-1b', 'opt', 'green card'],
    'h-1b': ['f-1', 'green card'],
    'opt': ['f-1', 'h-1b'],
    'green card': ['h-1b', 'f-1'],
  };

  // Normalize underscores to spaces for lookup (e.g., "green_card" → "green card")
  const normalizedVisa = studentVisa.replace(/_/g, ' ');
  const adjacent = adjacentPaths[normalizedVisa] || [];
  if (alumniVisas.some((v) => adjacent.includes(v.replace(/_/g, ' ')))) {
    return 15;
  }

  return 0;
}

export function scoreIndustryMatch(
  student: StudentProfile,
  alumni: AlumniProfile
): number {
  const studentIndustries = student.industries.map(normalize);
  const alumniIndustry = normalize(alumni.industry);

  // Exact match
  if (studentIndustries.includes(alumniIndustry)) {
    return 15;
  }

  // Partial keyword overlap
  if (
    studentIndustries.some(
      (si) => si.includes(alumniIndustry) || alumniIndustry.includes(si)
    )
  ) {
    return 8;
  }

  return 0;
}

export function scoreGeographicProximity(
  student: StudentProfile,
  alumni: AlumniProfile
): number {
  if (
    !student.geographicPrefs.length ||
    !alumni.geographicHistory.length
  ) {
    return 0;
  }

  return hasOverlap(student.geographicPrefs, alumni.geographicHistory)
    ? 10
    : 0;
}

export function scoreStageProximity(
  student: StudentProfile,
  alumni: AlumniProfile
): number {
  const diff = Math.abs(student.graduationYear - alumni.graduationYear);
  if (diff <= 3) return 5;
  if (diff <= 6) return 3;
  if (diff <= 10) return 1;
  return 0;
}

export function calculateMatchScore(
  student: StudentProfile,
  alumni: AlumniProfile
): { score: number; breakdown: ScoreBreakdown } {
  const breakdown: ScoreBreakdown = {
    careerPivot: scoreCareerPivot(student, alumni),
    academicBackground: scoreAcademicBackground(student, alumni),
    visaAlignment: scoreVisaAlignment(student, alumni),
    industryMatch: scoreIndustryMatch(student, alumni),
    geographicProximity: scoreGeographicProximity(student, alumni),
    stageProximity: scoreStageProximity(student, alumni),
  };

  const score = Math.min(
    100,
    breakdown.careerPivot +
      breakdown.academicBackground +
      breakdown.visaAlignment +
      breakdown.industryMatch +
      breakdown.geographicProximity +
      breakdown.stageProximity
  );

  return { score, breakdown };
}
