import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler, APIError } from '@/lib/api-handler';
import { requireUser } from '@/lib/auth';
import { updateTaskSchema } from '@/lib/validations/task';

// PATCH /api/v1/todos/[id] - Update a specific todo
async function patchHandler(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await requireUser();
  const { id } = await params;
  const body = await req.json();

  // Validate input
  const parsedData = updateTaskSchema.parse(body);

  // Check if task exists and belongs to the user
  const existingTask = await prisma.task.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!existingTask) {
    throw new APIError('Task not found', 404, 'NOT_FOUND');
  }

  if (existingTask.userId !== userId) {
    throw new APIError('Forbidden: You can only update your own tasks', 403, 'FORBIDDEN');
  }

  // Update task
  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      ...(parsedData.title !== undefined && { title: parsedData.title }),
      ...(parsedData.description !== undefined && { description: parsedData.description }),
      ...(parsedData.isCompleted !== undefined && { isCompleted: parsedData.isCompleted }),
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

  return NextResponse.json({ task: updatedTask }, { status: 200 });
}

// DELETE /api/v1/todos/[id] - Delete a specific todo
async function deleteHandler(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await requireUser();
  const { id } = await params;

  // Check if task exists and belongs to the user
  const existingTask = await prisma.task.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!existingTask) {
    throw new APIError('Task not found', 404, 'NOT_FOUND');
  }

  if (existingTask.userId !== userId) {
    throw new APIError('Forbidden: You can only delete your own tasks', 403, 'FORBIDDEN');
  }

  // Delete task
  await prisma.task.delete({
    where: { id },
  });

  return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
}

export const PATCH = withErrorHandler(patchHandler);
export const DELETE = withErrorHandler(deleteHandler);
