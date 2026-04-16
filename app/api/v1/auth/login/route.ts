import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { loginSchema } from '@/lib/validations/auth';
import { withErrorHandler, APIError } from '@/lib/api-handler';
import { signAccessToken, signRefreshToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

async function handler(req: Request) {
  const body = await req.json();
  
  // 1. Validate Input
  const parsedData = loginSchema.parse(body);

  // 2. Fetch User and verify exists
  const user = await prisma.user.findUnique({
    where: { email: parsedData.email },
  });

  if (!user) {
    throw new APIError('Invalid email or password', 401, 'UNAUTHORIZED');
  }

  // 3. Compare hash
  const isValidPassword = await bcrypt.compare(parsedData.password, user.passwordHash);
  if (!isValidPassword) {
    throw new APIError('Invalid email or password', 401, 'UNAUTHORIZED');
  }

  // 4. Issue Tokens
  const accessToken = await signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = await signRefreshToken({ userId: user.id });

  // 5. Store Refresh Token Hash in DB (Rotation logic requires us to validate this later)
  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshTokenHash },
  });

  // 6. Set Cookie
  const cookieStore = await cookies();
  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: '/',
  });

  // 7. Return Response
  return NextResponse.json(
    {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    },
    { status: 200 }
  );
}

export const POST = withErrorHandler(handler);
