import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateOutreachMessage } from '@/lib/openai';
import { getStudentId } from '@/lib/auth';
import type { StudentProfile, AlumniProfile } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const studentId = await getStudentId();
    if (!studentId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { alumniId, purpose } = await request.json();

    if (!alumniId || !purpose) {
      return NextResponse.json(
        { error: 'alumniId and purpose are required' },
        { status: 400 }
      );
    }

    const [student, alumni, matchResult] = await Promise.all([
      prisma.studentProfile.findUnique({ where: { id: studentId } }),
      prisma.alumniProfile.findUnique({ where: { id: alumniId } }),
      prisma.matchResult.findUnique({
        where: { studentId_alumniId: { studentId, alumniId } },
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
