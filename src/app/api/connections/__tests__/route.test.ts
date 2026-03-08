/**
 * @jest-environment node
 */
import { GET, POST, PATCH } from '../route';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

jest.mock('@/lib/db', () => ({
  prisma: {
    connection: {
      findMany: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
  },
}));

const mockFindMany = prisma.connection.findMany as jest.Mock;
const mockUpsert = prisma.connection.upsert as jest.Mock;
const mockUpdate = prisma.connection.update as jest.Mock;

function makeRequest(body: Record<string, unknown>, method = 'POST') {
  return new Request('http://localhost/api/connections', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('GET /api/connections', () => {
  it('returns all connections for demo student', async () => {
    const connections = [
      { id: 'c1', alumniId: 'a1', status: 'saved', alumni: { name: 'Alice' } },
    ];
    mockFindMany.mockResolvedValue(connections);

    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual(connections);
  });

  it('returns 500 on error', async () => {
    mockFindMany.mockRejectedValue(new Error('DB error'));
    const res = await GET();
    expect(res.status).toBe(500);
  });
});

describe('POST /api/connections', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 400 when alumniId is missing', async () => {
    const res = await POST(makeRequest({ status: 'saved' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid status', async () => {
    const res = await POST(makeRequest({ alumniId: 'a1', status: 'banana' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid status');
  });

  it('creates a connection successfully', async () => {
    const connection = { id: 'c1', alumniId: 'a1', status: 'outreach_sent', alumni: { name: 'Alice' } };
    mockUpsert.mockResolvedValue(connection);

    const res = await POST(makeRequest({
      alumniId: 'a1',
      status: 'outreach_sent',
      outreachMessage: 'Hi Alice',
    }));
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data).toEqual(connection);
  });

  it('defaults to saved status', async () => {
    mockUpsert.mockResolvedValue({ id: 'c1', status: 'saved' });

    await POST(makeRequest({ alumniId: 'a1' }));
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ status: 'saved' }),
      })
    );
  });

  it('returns 500 on error', async () => {
    mockUpsert.mockRejectedValue(new Error('DB error'));
    const res = await POST(makeRequest({ alumniId: 'a1' }));
    expect(res.status).toBe(500);
  });
});

describe('PATCH /api/connections', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 400 when alumniId is missing', async () => {
    const res = await PATCH(makeRequest({ status: 'replied' }, 'PATCH'));
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid status', async () => {
    const res = await PATCH(makeRequest({ alumniId: 'a1', status: 'invalid' }, 'PATCH'));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid status');
  });

  it('returns 404 when connection not found', async () => {
    const notFoundError = new Prisma.PrismaClientKnownRequestError('Record not found', {
      code: 'P2025',
      clientVersion: '5.0.0',
    });
    mockUpdate.mockRejectedValue(notFoundError);

    const res = await PATCH(makeRequest({ alumniId: 'a1', status: 'replied' }, 'PATCH'));
    expect(res.status).toBe(404);
  });

  it('updates connection status', async () => {
    mockUpdate.mockResolvedValue({ id: 'c1', status: 'replied', alumni: { name: 'Alice' } });

    const res = await PATCH(makeRequest({ alumniId: 'a1', status: 'replied' }, 'PATCH'));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.status).toBe('replied');
  });

  it('updates connection notes', async () => {
    mockUpdate.mockResolvedValue({ id: 'c1', notes: 'Great conversation', alumni: {} });

    const res = await PATCH(makeRequest({ alumniId: 'a1', notes: 'Great conversation' }, 'PATCH'));
    const data = await res.json();
    expect(data.notes).toBe('Great conversation');
  });

  it('returns 500 on non-Prisma error', async () => {
    mockUpdate.mockRejectedValue(new Error('DB error'));
    const res = await PATCH(makeRequest({ alumniId: 'a1', status: 'replied' }, 'PATCH'));
    expect(res.status).toBe(500);
  });
});
