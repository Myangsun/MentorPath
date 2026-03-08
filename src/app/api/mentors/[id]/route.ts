import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { DEMO_STUDENT_ID } from '@/lib/constants';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const alumni = await prisma.alumniProfile.findUnique({
      where: { id: params.id },
    });

    if (!alumni) {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 });
    }

    // Also fetch match result if exists
    const matchResult = await prisma.matchResult.findUnique({
      where: {
        studentId_alumniId: {
          studentId: DEMO_STUDENT_ID,
          alumniId: params.id,
        },
      },
    });

    return NextResponse.json({
      ...alumni,
      matchScore: matchResult?.score ?? null,
      scoreBreakdown: matchResult?.scoreBreakdown ?? null,
      rationale: matchResult?.rationale ?? null,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch mentor' }, { status: 500 });
  }
}
