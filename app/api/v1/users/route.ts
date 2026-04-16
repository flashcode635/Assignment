import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/lib/api-handler';
import { requireRole } from '@/lib/auth';

// GET /api/v1/users - Get all users (Admin only)
async function getHandler() {
  // Ensure the user is an admin
  await requireRole('ADMIN');

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { tasks: true },
      },
    },
  });

  return NextResponse.json({ users }, { status: 200 });
}

export const GET = withErrorHandler(getHandler);
