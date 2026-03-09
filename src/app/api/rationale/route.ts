import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateDetailedRationale } from '@/lib/openai';
import { getStudentId } from '@/lib/auth';
import type { StudentProfile, AlumniProfile, Prisma } from '@prisma/client';
import type { ScoreBreakdown } from '@/types';

export async function POST(request: Request) {
  try {
    const studentId = await getStudentId();
    if (!studentId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { alumniId } = await request.json();

    if (!alumniId) {
      return NextResponse.json({ error: 'alumniId is required' }, { status: 400 });
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

    const scoreBreakdown = (matchResult?.scoreBreakdown ?? {}) as unknown as ScoreBreakdown;

    const detailed = await generateDetailedRationale(
      student as StudentProfile,
      alumni as AlumniProfile,
      scoreBreakdown
    );

    if (matchResult) {
      await prisma.matchResult.update({
        where: { id: matchResult.id },
        data: { detailedRationale: detailed as unknown as Prisma.JsonObject },
      });
    }

    return NextResponse.json(detailed);
  } catch {
    return NextResponse.json({ error: 'Failed to generate rationale' }, { status: 500 });
  }
}
