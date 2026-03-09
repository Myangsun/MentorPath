import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { studentProfileSchema } from '@/lib/validation';
import { getStudentId } from '@/lib/auth';

export async function GET() {
  try {
    const studentId = await getStudentId();
    if (!studentId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
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
    const studentId = await getStudentId();
    if (!studentId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = studentProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const student = await prisma.studentProfile.update({
      where: { id: studentId },
      data: parsed.data,
    });

    return NextResponse.json(student);
  } catch {
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
