/**
 * GET /api/mentors
 * Returns cached match results for the demo student.
 * Use POST /api/matches to generate fresh matches first.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

import { DEMO_STUDENT_ID } from '@/lib/constants';

export async function GET() {
  try {
    const matches = await prisma.matchResult.findMany({
      where: { studentId: DEMO_STUDENT_ID },
      include: { alumni: true },
      orderBy: { score: 'desc' },
    });

    return NextResponse.json(matches);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch mentors' }, { status: 500 });
  }
}
