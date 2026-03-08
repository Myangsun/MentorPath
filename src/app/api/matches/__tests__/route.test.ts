/**
 * @jest-environment node
 */
import { POST } from '../route';
import { prisma } from '@/lib/db';
import { generateMatchRationale } from '@/lib/openai';

jest.mock('@/lib/db', () => ({
  prisma: {
    studentProfile: { findUnique: jest.fn() },
    alumniProfile: { findMany: jest.fn() },
    matchResult: { upsert: jest.fn() },
  },
}));

jest.mock('@/lib/openai', () => ({
  generateMatchRationale: jest.fn().mockResolvedValue('Great match!'),
}));

const mockFindUnique = prisma.studentProfile.findUnique as jest.Mock;
const mockFindMany = prisma.alumniProfile.findMany as jest.Mock;
const mockUpsert = prisma.matchResult.upsert as jest.Mock;

const mockStudent = {
  id: 'demo-student',
  name: 'Test',
  school: 'MIT - Massachusetts Institute of Technology',
  major: 'Computer Science',
  graduationYear: 2026,
  priorRoles: [{ title: 'Analyst', company: 'Corp', industry: 'Tech', years: 2 }],
  visaStatus: 'F-1',
  industries: ['Technology'],
  roleInterests: ['Product Manager'],
  pivotDirection: 'Data to PM',
  geographicPrefs: ['Boston'],
  mentorPreferences: null,
};

const mockAlumni = {
  id: 'alumni-1',
  name: 'Sarah Chen',
  school: 'MIT - Massachusetts Institute of Technology',
  major: 'Computer Science',
  graduationYear: 2021,
  currentRole: 'PM',
  currentCompany: 'ClimateTech',
  industry: 'Technology',
  pivotType: 'data analyst → product manager',
  skills: ['PM'],
  visaHistory: ['F-1', 'H-1B'],
  geographicHistory: ['Boston'],
  openness: 'one_time_chat',
  topicsWilling: ['PM'],
  responseRate: 0.9,
  bio: 'Test',
  careerTimeline: [],
  lastActive: new Date(),
};

describe('POST /api/matches', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUpsert.mockResolvedValue({});
  });

  it('returns 404 when student not found', async () => {
    mockFindUnique.mockResolvedValue(null);
    const res = await POST();
    expect(res.status).toBe(404);
  });

  it('generates scored matches and returns them', async () => {
    mockFindUnique.mockResolvedValue(mockStudent);
    mockFindMany.mockResolvedValue([mockAlumni]);

    const res = await POST();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data[0].alumniId).toBe('alumni-1');
    expect(typeof data[0].score).toBe('number');
    expect(data[0].rationale).toBe('Great match!');
  });

  it('calls generateMatchRationale for top matches', async () => {
    mockFindUnique.mockResolvedValue(mockStudent);
    mockFindMany.mockResolvedValue([mockAlumni]);

    await POST();
    expect(generateMatchRationale).toHaveBeenCalled();
  });

  it('upserts match results into database', async () => {
    mockFindUnique.mockResolvedValue(mockStudent);
    mockFindMany.mockResolvedValue([mockAlumni]);

    await POST();
    expect(mockUpsert).toHaveBeenCalled();
  });

  it('returns 500 on error', async () => {
    mockFindUnique.mockRejectedValue(new Error('DB error'));
    const res = await POST();
    expect(res.status).toBe(500);
  });
});
