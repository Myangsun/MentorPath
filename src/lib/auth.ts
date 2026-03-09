import { cookies } from 'next/headers';

const COOKIE_NAME = 'student-id';

export async function getStudentId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

export async function setStudentCookie(studentId: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, studentId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
}

export async function clearStudentCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
