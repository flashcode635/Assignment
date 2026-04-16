import { headers } from 'next/headers';
import { APIError } from './api-handler';

export async function requireUser() {
  const headersList = await headers();
  const userId = headersList.get('x-user-id');
  const role = headersList.get('x-user-role');

  if (!userId) {
    throw new APIError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  return { userId, role };
}

export async function requireRole(requiredRole: string) {
  const user = await requireUser();
  if (user.role !== requiredRole) {
    throw new APIError('Forbidden: Insufficient permissions', 403, 'FORBIDDEN');
  }
  return user;
}
