import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getStudentId } from '@/lib/auth';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = await getStudentId();

    const alumni = await prisma.alumniProfile.findUnique({
      where: { id: params.id },
    });

    if (!alumni) {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 });
    }

    let matchResult = null;
    if (studentId) {
      matchResult = await prisma.matchResult.findUnique({
        where: {
          studentId_alumniId: { studentId, alumniId: params.id },
        },
      });
    }

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
