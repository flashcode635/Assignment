import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { withErrorHandler, APIError } from '@/lib/api-handler';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

async function handler() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) {
    throw new APIError('No refresh token provided', 401, 'UNAUTHORIZED');
  }

  // 1. Verify the JWT signature and expiry of the refresh token
  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) {
    throw new APIError('Invalid or expired refresh token', 401, 'UNAUTHORIZED');
  }

  // 2. Lookup the user
  const user = await prisma.user.findUnique({
    where: { id: payload.userId }
  });

  if (!user || !user.refreshTokenHash) {
    throw new APIError('Invalid user or token', 401, 'UNAUTHORIZED');
  }

  // 3. Verify that the provided token matches the hash in DB
  const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  
  if (!isValid) {
    // SECURITY RISK: The token is structurally valid but doesn't match the DB hash.
    // This usually implies a reused old token (possible theft).
    // Invalidate the current family of tokens by wiping the hash.
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: null }
    });
    throw new APIError('Invalid token. Please login again.', 401, 'UNAUTHORIZED');
  }

  // 4. Generate new pair
  const newAccessToken = await signAccessToken({ userId: user.id, role: user.role });
  const newRefreshToken = await signRefreshToken({ userId: user.id });

  // 5. Hash and store new refresh token (Rotation)
  const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshTokenHash: newRefreshTokenHash }
  });

  // 6. Set new cookie
  cookieStore.set('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  return NextResponse.json({ accessToken: newAccessToken }, { status: 200 });
}

export const POST = withErrorHandler(handler);
