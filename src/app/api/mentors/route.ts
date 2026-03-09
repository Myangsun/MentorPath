/**
 * GET /api/mentors
 * Returns cached match results for the current student.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getStudentId } from '@/lib/auth';

export async function GET() {
  try {
    const studentId = await getStudentId();
    if (!studentId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const matches = await prisma.matchResult.findMany({
      where: { studentId },
      include: { alumni: true },
      orderBy: { score: 'desc' },
    });

    return NextResponse.json(matches);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch mentors' }, { status: 500 });
  }
}
