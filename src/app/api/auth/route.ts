import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getStudentId, setStudentCookie, clearStudentCookie } from '@/lib/auth';

// GET /api/auth — get current user from cookie
export async function GET() {
  try {
    const studentId = await getStudentId();
    if (!studentId) {
      return NextResponse.json({ user: null });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      select: { id: true, name: true, email: true },
    });

    if (!student) {
      await clearStudentCookie();
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: student });
  } catch {
    return NextResponse.json({ user: null });
  }
}

// POST /api/auth — login or register by name + email
export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    // Try to find existing student by email
    let student = await prisma.studentProfile.findUnique({
      where: { email: trimmedEmail },
    });

    if (student) {
      // Existing user — login
      await setStudentCookie(student.id);
      return NextResponse.json({
        user: { id: student.id, name: student.name, email: student.email },
        isNew: false,
      });
    }

    // New user — create profile
    student = await prisma.studentProfile.create({
      data: {
        email: trimmedEmail,
        name: trimmedName,
        school: '',
        major: '',
        graduationYear: 2026,
        priorRoles: [],
        industries: [],
        roleInterests: [],
        geographicPrefs: [],
      },
    });

    await setStudentCookie(student.id);
    return NextResponse.json({
      user: { id: student.id, name: student.name, email: student.email },
      isNew: true,
    }, { status: 201 });
  } catch (error: unknown) {
    const prismaError = error as { code?: string };
    if (prismaError.code === 'P2002') {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

// DELETE /api/auth — logout
export async function DELETE() {
  await clearStudentCookie();
  return NextResponse.json({ success: true });
}
