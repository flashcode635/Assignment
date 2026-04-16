import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/lib/api-handler';
import { requireUser } from '@/lib/auth';
import { createTaskSchema } from '@/lib/validations/task';

// GET /api/v1/todos - Get all todos for the logged-in user
async function getHandler() {
  const { userId } = await requireUser();

  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      isCompleted: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ tasks }, { status: 200 });
}

// POST /api/v1/todos - Create a new todo
async function postHandler(req: Request) {
  const { userId } = await requireUser();
  const body = await req.json();

  // Validate input
  const parsedData = createTaskSchema.parse(body);

  // Create task
  const task = await prisma.task.create({
    data: {
      title: parsedData.title,
      description: parsedData.description,
      userId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      isCompleted: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ task }, { status: 201 });
}

export const GET = withErrorHandler(getHandler);
export const POST = withErrorHandler(postHandler);
