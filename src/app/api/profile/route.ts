import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { studentProfileSchema } from '@/lib/validation';

import { DEMO_STUDENT_ID } from '@/lib/constants';

export async function GET() {
  try {
    const student = await prisma.studentProfile.findUnique({
      where: { id: DEMO_STUDENT_ID },
    });

    if (!student) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = studentProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const student = await prisma.studentProfile.upsert({
      where: { id: DEMO_STUDENT_ID },
      update: parsed.data,
      create: {
        id: DEMO_STUDENT_ID,
        name: parsed.data.name || '',
        school: parsed.data.school || '',
        major: parsed.data.major || '',
        graduationYear: parsed.data.graduationYear || 2026,
        priorRoles: parsed.data.priorRoles || [],
        visaStatus: parsed.data.visaStatus ?? null,
        industries: parsed.data.industries || [],
        roleInterests: parsed.data.roleInterests || [],
        pivotDirection: parsed.data.pivotDirection ?? null,
        geographicPrefs: parsed.data.geographicPrefs || [],
        mentorPreferences: parsed.data.mentorPreferences ?? null,
      },
    });

    return NextResponse.json(student);
  } catch {
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
