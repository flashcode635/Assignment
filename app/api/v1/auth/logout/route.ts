import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/lib/api-handler';
import { verifyRefreshToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

async function handler() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  // If there's a valid refresh token, invalidate it in the database
  if (refreshToken) {
    try {
      const payload = await verifyRefreshToken(refreshToken);

      if (payload?.userId) {
        // Clear the refresh token hash from database
        await prisma.user.update({
          where: { id: payload.userId },
          data: { refreshTokenHash: null },
        });
      }
    } catch (error) {
      // Token might be invalid, but we still want to clear the cookie
      console.error('Error during logout:', error);
    }
  }

  // Clear the refresh token cookie
  cookieStore.delete('refreshToken');

  return NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  );
}

export const POST = withErrorHandler(handler);
