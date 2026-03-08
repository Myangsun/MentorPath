import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateOutreachMessage } from '@/lib/openai';
import type { StudentProfile, AlumniProfile } from '@prisma/client';

const DEMO_STUDENT_ID = 'demo-student';

export async function POST(request: Request) {
  try {
    const { alumniId, purpose } = await request.json();

    if (!alumniId || !purpose) {
      return NextResponse.json(
        { error: 'alumniId and purpose are required' },
        { status: 400 }
      );
    }

    const [student, alumni, matchResult] = await Promise.all([
      prisma.studentProfile.findUnique({ where: { id: DEMO_STUDENT_ID } }),
      prisma.alumniProfile.findUnique({ where: { id: alumniId } }),
      prisma.matchResult.findUnique({
        where: {
          studentId_alumniId: { studentId: DEMO_STUDENT_ID, alumniId },
        },
      }),
    ]);

    if (!student || !alumni) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const rationale = matchResult?.rationale || '';

    const outreach = await generateOutreachMessage(
      student as StudentProfile,
      alumni as AlumniProfile,
      rationale,
      purpose
    );

    return NextResponse.json(outreach);
  } catch {
    return NextResponse.json({ error: 'Failed to generate outreach' }, { status: 500 });
  }
}
