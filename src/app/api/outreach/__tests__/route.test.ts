/**
 * @jest-environment node
 */
import { POST } from '../route';
import { prisma } from '@/lib/db';
import { generateOutreachMessage } from '@/lib/openai';

jest.mock('@/lib/db', () => ({
  prisma: {
    studentProfile: { findUnique: jest.fn() },
    alumniProfile: { findUnique: jest.fn() },
    matchResult: { findUnique: jest.fn() },
  },
}));

jest.mock('@/lib/openai', () => ({
  generateOutreachMessage: jest.fn(),
}));

const mockStudentFind = prisma.studentProfile.findUnique as jest.Mock;
const mockAlumniFind = prisma.alumniProfile.findUnique as jest.Mock;
const mockMatchFind = prisma.matchResult.findUnique as jest.Mock;
const mockGenerate = generateOutreachMessage as jest.Mock;

function makeRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/outreach', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/outreach', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 400 when alumniId is missing', async () => {
    const res = await POST(makeRequest({ purpose: 'career_advice' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when purpose is missing', async () => {
    const res = await POST(makeRequest({ alumniId: 'a1' }));
    expect(res.status).toBe(400);
  });

  it('returns 404 when student not found', async () => {
    mockStudentFind.mockResolvedValue(null);
    mockAlumniFind.mockResolvedValue({ id: 'a1', name: 'Alice' });
    mockMatchFind.mockResolvedValue(null);

    const res = await POST(makeRequest({ alumniId: 'a1', purpose: 'career_advice' }));
    expect(res.status).toBe(404);
  });

  it('returns 404 when alumni not found', async () => {
    mockStudentFind.mockResolvedValue({ id: 'demo-student', name: 'Demo' });
    mockAlumniFind.mockResolvedValue(null);
    mockMatchFind.mockResolvedValue(null);

    const res = await POST(makeRequest({ alumniId: 'a1', purpose: 'career_advice' }));
    expect(res.status).toBe(404);
  });

  it('generates outreach message successfully', async () => {
    const student = { id: 'demo-student', name: 'Demo', major: 'Computer Science', school: 'MIT - Massachusetts Institute of Technology' };
    const alumni = { id: 'a1', name: 'Alice' };
    const matchResult = { rationale: 'Great match because...' };
    const outreach = {
      message: 'Hi Alice, ...',
      toneGuidance: ['Keep it concise'],
    };

    mockStudentFind.mockResolvedValue(student);
    mockAlumniFind.mockResolvedValue(alumni);
    mockMatchFind.mockResolvedValue(matchResult);
    mockGenerate.mockResolvedValue(outreach);

    const res = await POST(makeRequest({ alumniId: 'a1', purpose: 'career_advice' }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual(outreach);
    expect(mockGenerate).toHaveBeenCalledWith(student, alumni, 'Great match because...', 'career_advice');
  });

  it('uses empty rationale when no match result exists', async () => {
    const student = { id: 'demo-student', name: 'Demo' };
    const alumni = { id: 'a1', name: 'Alice' };

    mockStudentFind.mockResolvedValue(student);
    mockAlumniFind.mockResolvedValue(alumni);
    mockMatchFind.mockResolvedValue(null);
    mockGenerate.mockResolvedValue({ message: 'Hi', toneGuidance: [] });

    await POST(makeRequest({ alumniId: 'a1', purpose: 'networking' }));
    expect(mockGenerate).toHaveBeenCalledWith(student, alumni, '', 'networking');
  });

  it('returns 500 on unexpected error', async () => {
    mockStudentFind.mockRejectedValue(new Error('DB error'));
    const res = await POST(makeRequest({ alumniId: 'a1', purpose: 'test' }));
    expect(res.status).toBe(500);
  });
});
