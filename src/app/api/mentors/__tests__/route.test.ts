/**
 * @jest-environment node
 */
import { GET } from '../route';
import { prisma } from '@/lib/db';

jest.mock('@/lib/db', () => ({
  prisma: {
    matchResult: { findMany: jest.fn() },
  },
}));

const mockFindMany = prisma.matchResult.findMany as jest.Mock;

describe('GET /api/mentors', () => {
  it('returns cached match results', async () => {
    const mockResults = [
      { id: 'm1', alumniId: 'a1', score: 90, alumni: { name: 'Alice' } },
    ];
    mockFindMany.mockResolvedValue(mockResults);

    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual(mockResults);
  });

  it('returns empty array when no matches', async () => {
    mockFindMany.mockResolvedValue([]);
    const res = await GET();
    const data = await res.json();
    expect(data).toEqual([]);
  });

  it('returns 500 on error', async () => {
    mockFindMany.mockRejectedValue(new Error('DB error'));
    const res = await GET();
    expect(res.status).toBe(500);
  });
});
