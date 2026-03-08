/**
 * @jest-environment node
 */
import { GET } from '../route';
import { prisma } from '@/lib/db';

jest.mock('@/lib/db', () => ({
  prisma: {
    alumniProfile: { findUnique: jest.fn() },
    matchResult: { findUnique: jest.fn() },
  },
}));

const mockAlumniFindUnique = prisma.alumniProfile.findUnique as jest.Mock;
const mockMatchFindUnique = prisma.matchResult.findUnique as jest.Mock;

describe('GET /api/mentors/[id]', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns mentor with match data', async () => {
    mockAlumniFindUnique.mockResolvedValue({ id: 'a1', name: 'Alice' });
    mockMatchFindUnique.mockResolvedValue({ score: 85, scoreBreakdown: {}, rationale: 'Great match' });

    const res = await GET(new Request('http://localhost'), { params: { id: 'a1' } });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.name).toBe('Alice');
    expect(data.matchScore).toBe(85);
  });

  it('returns mentor without match data', async () => {
    mockAlumniFindUnique.mockResolvedValue({ id: 'a1', name: 'Alice' });
    mockMatchFindUnique.mockResolvedValue(null);

    const res = await GET(new Request('http://localhost'), { params: { id: 'a1' } });
    const data = await res.json();
    expect(data.matchScore).toBeNull();
  });

  it('returns 404 when not found', async () => {
    mockAlumniFindUnique.mockResolvedValue(null);
    const res = await GET(new Request('http://localhost'), { params: { id: 'missing' } });
    expect(res.status).toBe(404);
  });

  it('returns 500 on error', async () => {
    mockAlumniFindUnique.mockRejectedValue(new Error('DB error'));
    const res = await GET(new Request('http://localhost'), { params: { id: 'a1' } });
    expect(res.status).toBe(500);
  });
});
