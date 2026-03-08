/**
 * @jest-environment node
 */
import { POST } from '../route';
import { prisma } from '@/lib/db';

jest.mock('@/lib/db', () => ({
  prisma: {
    studentProfile: { findUnique: jest.fn() },
    alumniProfile: { findUnique: jest.fn() },
    matchResult: { findUnique: jest.fn(), update: jest.fn() },
  },
}));

jest.mock('@/lib/openai', () => ({
  generateDetailedRationale: jest.fn().mockResolvedValue({
    detailedRationale: 'Detailed analysis...',
    alignmentPoints: ['Point 1', 'Point 2'],
    conversationPrompts: ['Q1?', 'Q2?'],
  }),
}));

const mockStudentFind = prisma.studentProfile.findUnique as jest.Mock;
const mockAlumniFind = prisma.alumniProfile.findUnique as jest.Mock;
const mockMatchFind = prisma.matchResult.findUnique as jest.Mock;
const mockMatchUpdate = prisma.matchResult.update as jest.Mock;

describe('POST /api/rationale', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMatchUpdate.mockResolvedValue({});
  });

  it('generates detailed rationale', async () => {
    mockStudentFind.mockResolvedValue({ id: 'demo-student' });
    mockAlumniFind.mockResolvedValue({ id: 'a1' });
    mockMatchFind.mockResolvedValue({ id: 'm1', scoreBreakdown: {} });

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alumniId: 'a1' }),
    });

    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.detailedRationale).toBe('Detailed analysis...');
    expect(data.alignmentPoints).toHaveLength(2);
  });

  it('returns 400 when alumniId missing', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 404 when profiles not found', async () => {
    mockStudentFind.mockResolvedValue(null);
    mockAlumniFind.mockResolvedValue(null);

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alumniId: 'a1' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(404);
  });

  it('caches rationale in match result', async () => {
    mockStudentFind.mockResolvedValue({ id: 'demo-student' });
    mockAlumniFind.mockResolvedValue({ id: 'a1' });
    mockMatchFind.mockResolvedValue({ id: 'm1', scoreBreakdown: {} });

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alumniId: 'a1' }),
    });
    await POST(req);
    expect(mockMatchUpdate).toHaveBeenCalled();
  });

  it('returns 500 on error', async () => {
    mockStudentFind.mockRejectedValue(new Error('DB error'));
    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alumniId: 'a1' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
