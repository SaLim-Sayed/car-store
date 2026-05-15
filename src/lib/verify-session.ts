import { jwtVerify } from 'jose';

export type SessionUser = {
  userId: string;
  email: string;
  role: string;
};

export async function getSessionFromToken(token: string): Promise<SessionUser | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret || !token) return null;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const userId = payload.userId;
    const role = payload.role;

    if (typeof userId !== 'string' || typeof role !== 'string') {
      return null;
    }

    return {
      userId,
      email: typeof payload.email === 'string' ? payload.email : '',
      role,
    };
  } catch {
    return null;
  }
}
