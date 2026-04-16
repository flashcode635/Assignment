import { z } from 'zod';

// Create Task Schema
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
  description: z.string().max(5000, 'Description must be 5000 characters or less').optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

// Update Task Schema
export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less').optional(),
  description: z.string().max(5000, 'Description must be 5000 characters or less').optional().nullable(),
  isCompleted: z.boolean().optional(),
}).refine(
  (data) => data.title !== undefined || data.description !== undefined || data.isCompleted !== undefined,
  { message: 'At least one field must be provided for update' }
);

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
