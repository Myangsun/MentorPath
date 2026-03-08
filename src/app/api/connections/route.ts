import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { DEMO_STUDENT_ID } from '@/lib/constants';
import type { ConnectionStatus } from '@/types';

const VALID_STATUSES: ConnectionStatus[] = ['saved', 'outreach_sent', 'replied', 'met', 'ongoing'];

export async function GET() {
  try {
    const connections = await prisma.connection.findMany({
      where: { studentId: DEMO_STUDENT_ID },
      include: { alumni: true },
      orderBy: { lastActivityAt: 'desc' },
    });
    return NextResponse.json(connections);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { alumniId, status, outreachMessage } = await request.json();

    if (!alumniId) {
      return NextResponse.json({ error: 'alumniId is required' }, { status: 400 });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const connection = await prisma.connection.upsert({
      where: {
        studentId_alumniId: { studentId: DEMO_STUDENT_ID, alumniId },
      },
      create: {
        studentId: DEMO_STUDENT_ID,
        alumniId,
        status: status || 'saved',
        outreachMessage: outreachMessage ?? null,
      },
      update: {
        ...(status !== undefined && { status }),
        ...(outreachMessage !== undefined && { outreachMessage }),
        lastActivityAt: new Date(),
      },
      include: { alumni: true },
    });

    return NextResponse.json(connection, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create connection' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { alumniId, status, notes } = await request.json();

    if (!alumniId) {
      return NextResponse.json({ error: 'alumniId is required' }, { status: 400 });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const connection = await prisma.connection.update({
      where: {
        studentId_alumniId: { studentId: DEMO_STUDENT_ID, alumniId },
      },
      data: {
        ...(status !== undefined && { status }),
        ...(notes !== undefined && { notes }),
        lastActivityAt: new Date(),
      },
      include: { alumni: true },
    });

    return NextResponse.json(connection);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update connection' }, { status: 500 });
  }
}
