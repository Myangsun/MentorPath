/**
 * @jest-environment node
 */
import { GET, POST } from '../route';
import { prisma } from '@/lib/db';

jest.mock('@/lib/db', () => ({
  prisma: {
    studentProfile: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  },
}));

const mockFindUnique = prisma.studentProfile.findUnique as jest.Mock;
const mockUpsert = prisma.studentProfile.upsert as jest.Mock;

const sampleProfile = {
  id: 'demo-student',
  name: 'Liang Chen',
  school: 'MIT - Massachusetts Institute of Technology',
  major: 'Computer Science',
  graduationYear: 2026,
  priorRoles: [{ title: 'Analyst', company: 'Corp', industry: 'Tech', years: 3 }],
  visaStatus: 'F-1',
  industries: ['Technology'],
  roleInterests: ['Product Manager'],
  pivotDirection: 'Data to PM',
  geographicPrefs: ['Boston'],
  mentorPreferences: null,
};

describe('GET /api/profile', () => {
  it('returns profile when found', async () => {
    mockFindUnique.mockResolvedValue(sampleProfile);
    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.name).toBe('Liang Chen');
  });

  it('returns 404 when profile not found', async () => {
    mockFindUnique.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(404);
  });

  it('returns 500 on database error', async () => {
    mockFindUnique.mockRejectedValue(new Error('DB error'));
    const res = await GET();
    expect(res.status).toBe(500);
  });
});

describe('POST /api/profile', () => {
  it('creates/updates profile with valid data', async () => {
    mockUpsert.mockResolvedValue(sampleProfile);
    const req = new Request('http://localhost/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Liang Chen', school: 'MIT - Massachusetts Institute of Technology' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockUpsert).toHaveBeenCalled();
  });

  it('returns 400 for invalid data', async () => {
    const req = new Request('http://localhost/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ graduationYear: 1990 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Validation failed');
  });

  it('returns 500 on database error', async () => {
    mockUpsert.mockRejectedValue(new Error('DB error'));
    const req = new Request('http://localhost/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
