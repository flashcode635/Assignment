import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { RegisterInput, registerSchema } from '@/lib/validations/auth';
import { withErrorHandler, APIError } from '@/lib/api-handler';

async function handler(req: Request) {
  const body = await req.json();
  
  // 1. Validate Input
  const parsedData: RegisterInput = registerSchema.parse(body);

  // 2. Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: parsedData.email },
  });

  if (existingUser) {
    throw new APIError('User with this email already exists', 400, 'USER_EXISTS');
  }

  // 3. Hash password
  const passwordHash = await bcrypt.hash(parsedData.password, 12);

  // 4. Insert User
  const newUser = await prisma.user.create({
    data: {
      email: parsedData.email,
      passwordHash,
      role: parsedData.role || 'USER', // Default to USER if not provided
    },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      // intentionally omit passwordHash and refreshTokenHash
    }
  });

  // 5. Return 201
  return NextResponse.json(
    {
      message: 'User registered successfully',
      user: newUser,
    },
    { status: 201 }
  );
}

export const POST = withErrorHandler(handler);
