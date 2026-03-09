/**
 * POST /api/matches
 * Runs the matching engine for the current student against all alumni.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateMatchScore } from '@/lib/matching';
import { generateMatchRationale } from '@/lib/openai';
import { getStudentId } from '@/lib/auth';
import type { StudentProfile, AlumniProfile, Prisma } from '@prisma/client';

export async function POST() {
  try {
    const studentId = await getStudentId();
    if (!studentId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    const alumni = await prisma.alumniProfile.findMany();

    const scored = alumni.map((alum: AlumniProfile) => {
      const { score, breakdown } = calculateMatchScore(student as StudentProfile, alum);
      return { alumni: alum, score, breakdown };
    });

    scored.sort((a, b) => b.score - a.score);

    const top = scored.slice(0, 20);

    const results = await Promise.all(
      top.map(async ({ alumni: alum, score, breakdown }) => {
        const rationale = await generateMatchRationale(
          student as StudentProfile,
          alum,
          breakdown
        );
        return { alumniId: alum.id, score, breakdown, rationale, alumni: alum };
      })
    );

    await Promise.all(
      results.map(({ alumniId, score, breakdown, rationale }) =>
        prisma.matchResult.upsert({
          where: { studentId_alumniId: { studentId, alumniId } },
          update: { score, scoreBreakdown: breakdown as unknown as Prisma.JsonObject, rationale },
          create: { studentId, alumniId, score, scoreBreakdown: breakdown as unknown as Prisma.JsonObject, rationale },
        })
      )
    );

    const remaining = scored.slice(20).map(({ alumni: alum, score, breakdown }) => ({
      alumniId: alum.id, score, breakdown,
      rationale: 'A potential mentor match for your career journey.',
      alumni: alum,
    }));

    return NextResponse.json([...results, ...remaining]);
  } catch (error) {
    console.error('Match generation error:', error);
    return NextResponse.json({ error: 'Failed to generate matches' }, { status: 500 });
  }
}
