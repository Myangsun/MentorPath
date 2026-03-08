/**
 * POST /api/matches
 * Runs the matching engine for the demo student against all alumni.
 * Returns scored and sorted match results with AI rationale.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateMatchScore } from '@/lib/matching';
import { generateMatchRationale } from '@/lib/openai';
import type { StudentProfile, AlumniProfile, Prisma } from '@prisma/client';

const DEMO_STUDENT_ID = 'demo-student';

export async function POST() {
  try {
    const student = await prisma.studentProfile.findUnique({
      where: { id: DEMO_STUDENT_ID },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    const alumni = await prisma.alumniProfile.findMany();

    // Score all alumni
    const scored = alumni.map((alum: AlumniProfile) => {
      const { score, breakdown } = calculateMatchScore(student as StudentProfile, alum);
      return { alumni: alum, score, breakdown };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    // Take top 20 for rationale generation
    const top = scored.slice(0, 20);

    // Generate rationales in parallel for top matches
    const results = await Promise.all(
      top.map(async ({ alumni: alum, score, breakdown }) => {
        const rationale = await generateMatchRationale(
          student as StudentProfile,
          alum,
          breakdown
        );
        return {
          alumniId: alum.id,
          score,
          breakdown,
          rationale,
          alumni: alum,
        };
      })
    );

    // Upsert match results into database
    await Promise.all(
      results.map(({ alumniId, score, breakdown, rationale }) =>
        prisma.matchResult.upsert({
          where: {
            studentId_alumniId: { studentId: DEMO_STUDENT_ID, alumniId },
          },
          update: { score, scoreBreakdown: breakdown as unknown as Prisma.JsonObject, rationale },
          create: {
            studentId: DEMO_STUDENT_ID,
            alumniId,
            score,
            scoreBreakdown: breakdown as unknown as Prisma.JsonObject,
            rationale,
          },
        })
      )
    );

    // Also include remaining alumni with lower scores (no rationale)
    const remaining = scored.slice(20).map(({ alumni: alum, score, breakdown }) => ({
      alumniId: alum.id,
      score,
      breakdown,
      rationale: 'A potential mentor match for your career journey.',
      alumni: alum,
    }));

    return NextResponse.json([...results, ...remaining]);
  } catch (error) {
    console.error('Match generation error:', error);
    return NextResponse.json({ error: 'Failed to generate matches' }, { status: 500 });
  }
}
